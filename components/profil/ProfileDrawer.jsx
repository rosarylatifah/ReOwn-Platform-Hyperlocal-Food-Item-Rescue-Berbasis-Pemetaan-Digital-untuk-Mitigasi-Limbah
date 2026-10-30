"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { fraunces } from "@/lib/fonts";
import { useProfile } from "@/lib/ProfileContext";
import { useProfileDrawer } from "@/lib/ProfileDrawer";

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

export default function ProfileDrawer() {
  const { isOpen, close } = useProfileDrawer();
  const { profile, updateProfile, toggleSellerMode } = useProfile();
  const router = useRouter();
  const closeRef = useRef(null);

  const snapshot = () => ({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    address: profile.address,
    storeName: profile.storeName,
    storeAddress: profile.storeAddress,
  });

  const [formData, setFormData] = useState(snapshot);

  // Isi ulang form dari profil terbaru setiap drawer dibuka
  // (profil dibaca dari localStorage setelah mount, jadi nilai awal bisa basi)
  useEffect(() => {
    if (isOpen) setFormData(snapshot());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Esc untuk menutup + kunci scroll di belakang saat drawer terbuka
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

const handleSubmit = (e) => {
  e.preventDefault();
  updateProfile(formData);
  close();
};

  return (
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
              {/* FOTO PROFIL */}
              <div className="flex items-center gap-4">
                <img
                  src={profile.avatar}
                  alt="Avatar"
                  className="h-[70px] w-[70px] rounded-full border-[3px] border-[#D85834] object-cover"
                />
                <button
                  type="button"
                  className={`rounded-full border-[1.5px] border-[#D85834] bg-[#FBE9E2] px-4 py-2 text-xs font-bold text-[#D85834] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#D85834] hover:text-white active:translate-y-0 active:scale-95 ${focusRing}`}
                >
                  Ubah Foto Profil
                </button>
              </div>

              {/* TOGGLE AKUN TUNGGAL (PEMBELI / PENJUAL) */}
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-white p-4 ring-1 ring-stone-100">
                <span>
                  <span className="block text-sm font-bold text-stone-900">Status Mode Penjual</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-stone-500">
                    Aktifkan mode penjual untuk mulai mengelola produk toko kamu.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={!!profile.isSellerActive}
                  onChange={(e) => toggleSellerMode(e.target.checked)}
                  className="h-5 w-5 shrink-0 cursor-pointer accent-[#D85834]"
                />
              </label>

              {/* FORM INPUT DATA */}
              <div className="space-y-4">
                <Field label="Nama Lengkap" name="name" value={formData.name} onChange={handleChange} />
                <Field label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                <Field label="Nomor Telepon" name="phone" value={formData.phone} onChange={handleChange} />
                <Field label="Alamat" name="address" value={formData.address} onChange={handleChange} />
              </div>

              {/* JIKA MODE PENJUAL AKTIF, BISA EDIT DATA TOKO */}
              {profile.isSellerActive && (
                <div className="space-y-4 border-t border-dashed border-stone-300 pt-5">
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
  );
}
