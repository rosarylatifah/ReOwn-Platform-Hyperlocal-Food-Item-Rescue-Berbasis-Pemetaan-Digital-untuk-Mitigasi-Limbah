"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { fraunces } from "@/lib/fonts";
import { useProfile } from "@/lib/ProfileContext";
import { useProfileDrawer } from "@/lib/ProfileDrawer";
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834]";

const labelClass = "text-xs font-bold text-stone-700";
const inputClass =
  "mt-1.5 w-full rounded-xl border-[1.5px] border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition-colors focus:border-[#D85834] focus:outline-none";

function Field({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label htmlFor={`profile-${name}`} className={labelClass}>
        {label}
      </label>
      <input
        id={`profile-${name}`}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={inputClass}
      />
    </div>
  );
}

// ✂️ FUNGSI BANTUAN UNTUK CROPPER 1:1
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

export default function ProfileDrawer() {
  const { isOpen, close } = useProfileDrawer();
  const { profile, updateProfile, toggleSellerMode } = useProfile();
  const router = useRouter();
  const closeRef = useRef(null);
  
  const fileInputRef = useRef(null);

  // State Toast & Cropper
  const [showToast, setShowToast] = useState(false);
  const [selectedImageForCrop, setSelectedImageForCrop] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const snapshot = () => ({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    address: profile.address,
    avatar: profile.avatar,
    storeName: profile.storeName,
    storeAddress: profile.storeAddress,
  });

  const [formData, setFormData] = useState(snapshot);

  useEffect(() => {
    if (isOpen) setFormData(snapshot());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
    };
  }, [isOpen, close]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. Ambil foto dari galeri device
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImageForCrop(reader.result); // Buka modal cropper
      };
      reader.readAsDataURL(file);
    }
  };

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  }

  // 2. Eksekusi potong foto sesuai area crop user
  const handleSaveCroppedImage = () => {
    if (!completedCrop || !imgRef.current) return;

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const base64Image = canvas.toDataURL('image/jpeg');
    setFormData((prev) => ({ ...prev, avatar: base64Image }));
    setSelectedImageForCrop(null); // Tutup modal crop
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    close();

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <>
      {/* TOAST NOTIFIKASI BERHASIL DISIMPAN */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-[2000] flex items-center gap-3 rounded-2xl bg-stone-900 px-4 py-3 text-white shadow-xl animate-fade-in">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[#16A34A] text-xs font-bold text-white">✓</span>
          <div className="text-xs">
            <p className="font-bold">Berhasil!</p>
            <p className="text-stone-300">Profil kamu berhasil diubah.</p>
          </div>
        </div>
      )}

      {/* MODAL CROPPER FOTO (GAYA FACEBOOK/INSTAGRAM) */}
      {selectedImageForCrop && (
        <div className="fixed inset-0 z-[1200] grid place-items-center bg-stone-900/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl">
            <h3 className={`${fraunces.className} text-lg font-extrabold text-stone-900 mb-2`}>
              Sesuaikan Foto Profil
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Geser atau ubah ukuran kotak untuk memotong foto sesuai keinginanmu.
            </p>

            <div className="max-h-[60vh] overflow-auto flex justify-center bg-stone-100 rounded-xl p-2">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
              >
                <img
                  ref={imgRef}
                  alt="Crop preview"
                  src={selectedImageForCrop}
                  onLoad={onImageLoad}
                  style={{ maxHeight: '50vh' }}
                />
              </ReactCrop>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedImageForCrop(null)}
                className="rounded-full border-[1.5px] border-stone-300 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveCroppedImage}
                className="rounded-full bg-stone-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#D85834]"
              >
                Potong & Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="profile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-[1100] bg-stone-900/40 backdrop-blur-sm"
          />
        )}
        {isOpen && (
          <motion.aside
            key="profile-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Pengaturan profil akun"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed right-0 top-0 z-[1110] flex h-full w-full max-w-md flex-col bg-[#FFF7E9] shadow-[-20px_0_60px_rgba(60,30,10,0.25)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
              <div>
                <h2 className={`${fraunces.className} text-2xl font-extrabold text-stone-900`}>Pengaturan Profil</h2>
                <p className="mt-0.5 text-xs text-stone-500">Kelola data akun dan mode penjual kamu</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Tutup pengaturan profil"
                className="grid h-9 w-9 place-items-center rounded-full bg-white text-stone-900 ring-1 ring-stone-200 transition-colors hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                
                {/* FOTO PROFIL + UPLOAD GALERI */}
                <div className="flex items-center gap-4">
                  <img
                    src={formData.avatar || profile.avatar}
                    alt="Avatar"
                    className="h-[70px] w-[70px] rounded-full border-[3px] border-[#D85834] object-cover"
                  />
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`rounded-full border-[1.5px] border-[#D85834] bg-[#FBE9E2] px-4 py-2 text-xs font-bold text-[#D85834] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#D85834] hover:text-white active:translate-y-0 active:scale-95 ${focusRing}`}
                  >
                    Ubah Foto Profil
                  </button>
                </div>

                {/* TOGGLE AKUN TUNGGAL / SWITCH MODE */}
                <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-white p-4 ring-1 ring-stone-100">
                  <span>
                    <span className="block text-sm font-bold text-stone-900">
                      {profile.isSellerActive ? 'Mode Penjual Aktif' : 'Mode Pembeli Aktif'}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-stone-500">
                      {profile.isSellerActive 
                        ? 'Kamu sedang mengelola toko rescue-mu.' 
                        : 'Aktifkan jika ingin mulai menjual barang rescue.'}
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={!!profile.isSellerActive}
                    onChange={(e) => toggleSellerMode(e.target.checked)}
                    className="h-5 w-5 shrink-0 cursor-pointer accent-[#D85834]"
                  />
                </label>

                {/* FORM INPUT DATA UTAMA */}
                <div className="space-y-4">
                  <Field label="Nama Lengkap" name="name" value={formData.name} onChange={handleChange} />
                  <Field label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                  <Field label="Nomor Telepon" name="phone" value={formData.phone} onChange={handleChange} />
                  <Field label="Alamat" name="address" value={formData.address} onChange={handleChange} />
                </div>

                {/* 👈 INFORMASI TOKO HANYA MUNCUL JIKA JADI PENJUAL */}
                {profile.isSellerActive && (
                  <div className="space-y-4 border-t border-dashed border-stone-300 pt-5 animate-fade-in">
                    <h4 className={`${fraunces.className} text-lg font-extrabold text-[#D85834]`}>Informasi Toko</h4>
                    <Field label="Nama Toko" name="storeName" value={formData.storeName} onChange={handleChange} />
                    <Field label="Alamat Toko" name="storeAddress" value={formData.storeAddress} onChange={handleChange} />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-stone-200 px-6 py-5">
                <button
                  type="submit"
                  className={`w-full rounded-full bg-stone-900 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#D85834] hover:shadow-lg active:translate-y-0 active:scale-95 ${focusRing}`}
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}