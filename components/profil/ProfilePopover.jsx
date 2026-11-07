"use client";

import React, { useState, useEffect } from 'react';
import {
  User, ShoppingBag, LogOut, ChevronRight, Store, AlertTriangle,
  ArrowLeft, ShieldCheck, Bell, Trash2, Phone, MapPin, Key, Smartphone, X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useAuth } from '@/lib/auth';
import { useProfile } from '@/lib/ProfileContext'; 
import { useProfileDrawer } from '@/lib/ProfileDrawer';
import { fraunces } from '@/lib/fonts';

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834]";

const rowBase =
  `flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-[13px] font-semibold text-stone-900 transition-all duration-200 hover:bg-white hover:shadow-sm ${focusRing}`;
const rowDanger =
  `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[13px] font-semibold text-red-600 transition-all duration-200 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600`;

const backButton =
  `grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-[#D85834] ring-1 ring-stone-200 transition-colors hover:bg-stone-100 ${focusRing}`;

const toggleRow =
  "flex items-center justify-between rounded-xl bg-white px-4 py-3 ring-1 ring-stone-100";

function View({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col"
    >
      {children}
    </motion.div>
  );
}

function SubHeader({ title, onBack }) {
  return (
    <div className="flex items-center gap-3 rounded-t-[22px] border-b border-stone-200 bg-white px-5 py-4">
      <button type="button" onClick={onBack} aria-label="Kembali" className={backButton}>
        <ArrowLeft size={17} />
      </button>
      <h3 className={`${fraunces.className} text-lg font-extrabold text-stone-900`}>{title}</h3>
    </div>
  );
}

export default function ProfilePopover({ isOpen, onClose }) {
  const { logout } = useAuth();
  const { profile, toggleSellerMode } = useProfile(); 
  const { open: openProfileDrawer } = useProfileDrawer();
  const router = useRouter();

  const [currentView, setCurrentView] = useState('main');
  const [showPhone, setShowPhone] = useState(true);
  const [showAddress, setShowAddress] = useState(false);
  const [locationNotif, setLocationNotif] = useState(true);

  const [activeModal, setActiveModal] = useState(null);
  const [confirmSwitch, setConfirmSwitch] = useState(false);

  // Kunci scroll background pas popover kebuka
  useEffect(() => {
    if (!isOpen) return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const userData = {
    name: profile.name || 'Pengguna ReOwn',
    email: profile.email || 'email@domain.com',
    phone: profile.phone || '-',
    address: profile.address || '-',
    role: profile.isSellerActive 
      ? `Penjual (${profile.storeName || 'Toko'})` 
      : 'Pembeli (Rescue Member)',
    avatar: profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  };

  const handleLogout = () => {
    logout();
    onClose();
    router.push('/masuk');
  };

  const handleClose = () => {
    setCurrentView('main');
    setActiveModal(null);
    setConfirmSwitch(false);
    onClose();
  };

  const handleEditProfile = () => {
    handleClose();
    openProfileDrawer(); // Memicu form drawer edit profil terbuka
  };

  const handleSwitchMode = () => setConfirmSwitch(true);

  const doSwitchMode = () => {
    handleClose();
    if (profile.isSellerActive) {
      toggleSellerMode(false);
      router.push('/pembeli/beranda');
    } else if (profile.storeName && profile.storeAddress) {
      toggleSellerMode(true);
      router.push('/penjual/beranda');
    } else {
      openProfileDrawer(); 
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        aria-hidden
        className="fixed inset-0 z-[998] bg-stone-900/20 backdrop-blur-[2px]"
      />

      {/* Panel popover */}
      <motion.div
        role="dialog"
        aria-label="Menu profil"
        initial={{ opacity: 0, y: -10, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        className="fixed right-7 top-[80px] z-[999] flex w-[380px] flex-col rounded-[22px] border border-stone-200 bg-[#FFF7E9] shadow-[0_24px_60px_rgba(60,30,10,0.25)] max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:top-0 max-sm:h-[100dvh] max-sm:w-screen max-sm:overflow-y-auto max-sm:rounded-none"
      >
        {/* ================= VIEW 1: MENU UTAMA ================= */}
        {currentView === 'main' && (
          <View>
            {/* HEADER USER INFO */}
            <div className="relative rounded-t-[22px] border-b border-stone-200 bg-white px-5 py-5 max-sm:rounded-none">
              
              {/* TOMBOL X CLOSE DI POJOK KANAN ATAS HEADER */}
              <button 
                onClick={handleClose} 
                className="absolute right-4 top-4 border-none bg-[#F5F5F5] rounded-full w-7 h-7 flex items-center justify-center cursor-pointer text-[#666] hover:bg-stone-200 transition-colors"
                aria-label="Tutup menu"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  onClick={handleEditProfile}
                  title="Edit profil"
                  aria-label="Edit profil"
                  className={`block rounded-full ${focusRing}`}
                >
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="h-[52px] w-[52px] rounded-full border-2 border-[#D85834] object-cover transition-transform duration-200 hover:scale-105"
                  />
                </button>

                <div className="min-w-0 flex-1 pr-6">
                  <h4 className={`${fraunces.className} truncate text-base font-extrabold leading-tight text-stone-900`}>
                    {userData.name}
                  </h4>
                  <p className="mb-1.5 mt-0.5 truncate text-[11px] text-stone-500">{userData.email}</p>

                  <button
                    type="button"
                    onClick={handleEditProfile}
                    className={`inline-block rounded-full bg-stone-900 px-3 py-1 text-[10px] font-bold text-white transition-colors duration-200 hover:bg-[#D85834] ${focusRing}`}
                  >
                    Edit Profil
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-0.5 p-2.5">
              <button type="button" onClick={() => setCurrentView('settings')} className={rowBase}>
                <span className="flex items-center gap-3">
                  <User size={18} className="text-[#D85834]" /> Pengaturan Profil
                </span>
                <ChevronRight size={16} className="text-stone-400" />
              </button>

              <Link href="/pembeli/pesanan" onClick={handleClose} className={rowBase}>
                <span className="flex items-center gap-3">
                  <ShoppingBag size={18} className="text-[#D85834]" /> Pesanan Saya
                </span>
              </Link>

              {/* TOMBOL SWITCH DINAMIS */}
              <div className="my-2 border-y border-stone-200 py-3">
                <button
                  type="button"
                  onClick={handleSwitchMode}
                  className={`flex w-full items-center justify-between rounded-full bg-stone-900 px-5 py-3 text-xs font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#D85834] hover:shadow-md active:translate-y-0 active:scale-95 ${focusRing}`}
                >
                  <span className="flex items-center gap-2.5">
                    <Store size={16} className="text-[#95F57C]" />
                    {profile.isSellerActive ? 'Switch ke Mode Pembeli' : 'Switch ke Mode Penjual'}
                  </span>
                  <ChevronRight size={14} />
                </button>
              </div>

              <Link href="/pembeli/Pelaporan" onClick={handleClose} className={rowBase}>
                <span className="flex items-center gap-3">
                  <AlertTriangle size={18} className="text-red-600" /> Laporkan Masalah
                </span>
              </Link>

              <button type="button" onClick={handleLogout} className={rowDanger}>
                <LogOut size={18} /> Keluar
              </button>
            </div>
          </View>
        )}

        {/* ================= VIEW 2: MENU SETELAN UTAMA ================= */}
        {currentView === 'settings' && (
          <View>
            <SubHeader title="Pengaturan Profil" onBack={() => setCurrentView('main')} />

            <div className="flex flex-col gap-0.5 p-2.5">
              <button type="button" onClick={() => setCurrentView('privacy')} className={rowBase}>
                <span className="flex items-center gap-3">
                  <User size={16} className="text-[#D85834]" /> Privasi Profil Utama
                </span>
                <ChevronRight size={16} className="text-stone-400" />
              </button>

              <button type="button" onClick={() => setCurrentView('security')} className={rowBase}>
                <span className="flex items-center gap-3">
                  <ShieldCheck size={16} className="text-[#D85834]" /> Keamanan Akun
                </span>
                <ChevronRight size={16} className="text-stone-400" />
              </button>

              <button type="button" onClick={() => setCurrentView('notifications')} className={rowBase}>
                <span className="flex items-center gap-3">
                  <Bell size={16} className="text-[#D85834]" /> Pengaturan Notifikasi
                </span>
                <ChevronRight size={16} className="text-stone-400" />
              </button>

              <div className="my-2 border-t border-stone-200" />

              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Yakin ingin menghapus akun secara permanen?")) alert("Akun dihapus.");
                }}
                className={rowDanger}
              >
                <Trash2 size={16} /> Penghapusan Akun
              </button>
            </div>
          </View>
        )}

        {/* ================= VIEW 3A: PRIVASI PROFIL UTAMA ================= */}
        {currentView === 'privacy' && (
          <View>
            <SubHeader title="Privasi Profil Utama" onBack={() => setCurrentView('settings')} />

            <div className="flex flex-col gap-3 p-4 text-[13px]">
              <p className="text-[11px] leading-relaxed text-stone-500">
                Atur visibilitas informasi pribadi kamu agar terlihat oleh pengguna lain di platform ReOwn.
              </p>

              <label className={`${toggleRow} cursor-pointer`}>
                <span className="flex items-center gap-2.5 font-semibold text-stone-900">
                  <Phone size={16} className="text-[#D85834]" /> Tampilkan No. HP ({userData.phone})
                </span>
                <input
                  type="checkbox"
                  checked={showPhone}
                  onChange={() => setShowPhone(!showPhone)}
                  className="h-[18px] w-[18px] cursor-pointer accent-[#D85834]"
                />
              </label>

              <label className={`${toggleRow} cursor-pointer`}>
                <span className="flex items-center gap-2.5 font-semibold text-stone-900">
                  <MapPin size={16} className="text-[#D85834]" /> Tampilkan Alamat
                </span>
                <input
                  type="checkbox"
                  checked={showAddress}
                  onChange={() => setShowAddress(!showAddress)}
                  className="h-[18px] w-[18px] cursor-pointer accent-[#D85834]"
                />
              </label>
            </div>
          </View>
        )}

        {/* ================= VIEW 3B: KEAMANAN AKUN ================= */}
        {currentView === 'security' && (
          <View>
            <SubHeader title="Keamanan Akun" onBack={() => setCurrentView('settings')} />

            <div className="flex flex-col gap-0.5 p-2.5">
              <button type="button" onClick={() => setActiveModal('password')} className={rowBase}>
                <span className="flex items-center gap-3">
                  <Key size={16} className="text-[#D85834]" /> Ubah Kata Sandi
                </span>
              </button>

              <button type="button" onClick={() => setActiveModal('sessions')} className={rowBase}>
                <span className="flex items-center gap-3">
                  <Smartphone size={16} className="text-[#D85834]" /> Aktivasi Sesi Login
                </span>
              </button>
            </div>
          </View>
        )}

        {/* ================= VIEW 3C: PENGATURAN NOTIFIKASI ================= */}
        {currentView === 'notifications' && (
          <View>
            <SubHeader title="Pengaturan Notifikasi" onBack={() => setCurrentView('settings')} />

            <div className="flex flex-col gap-3 p-4 text-[13px]">
              <p className="text-[11px] leading-relaxed text-stone-500">
                Kelola izin akses notifikasi untuk fitur pendukung aplikasi.
              </p>

              <label className={`${toggleRow} cursor-pointer`}>
                <span className="font-semibold text-stone-900">Izin Akses Lokasi</span>
                <input
                  type="checkbox"
                  checked={locationNotif}
                  onChange={() => setLocationNotif(!locationNotif)}
                  className="h-[18px] w-[18px] cursor-pointer accent-[#D85834]"
                />
              </label>
            </div>
          </View>
        )}
      </motion.div>

      {/* ================= MODAL KONFIRMASI SWITCH MODE ================= */}
      {confirmSwitch && (
        <div
          onClick={() => setConfirmSwitch(false)}
          className="fixed inset-0 z-[1100] grid place-items-center bg-stone-900/40 px-6 backdrop-blur-sm"
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            initial={{ scale: 0.92, y: 8 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-[22px] bg-white p-6 text-center shadow-[0_24px_60px_rgba(60,30,10,0.3)]"
          >
            <span aria-hidden className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#FBE9E2] text-2xl">🔄</span>
            <h4 className={`${fraunces.className} mt-4 text-xl font-extrabold text-stone-900`}>
              Switch ke Mode {profile.isSellerActive ? 'Pembeli' : 'Penjual'}?
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Apakah kamu yakin ingin switch ke mode {profile.isSellerActive ? 'pembeli' : 'penjual'}?
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfirmSwitch(false)}
                className={`rounded-full border-[1.5px] border-stone-300 py-2.5 text-sm font-semibold text-stone-800 transition-colors hover:bg-stone-100 ${focusRing}`}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={doSwitchMode}
                className={`rounded-full bg-stone-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#D85834] ${focusRing}`}
              >
                Ya, switch
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ================= MODAL KECIL POP-UP ================= */}
      {activeModal && (
        <div className="fixed inset-0 z-[1100] grid place-items-center bg-stone-900/40 px-6 backdrop-blur-sm">
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ scale: 0.92, y: 8 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="w-full max-w-sm rounded-[22px] bg-white p-6 shadow-[0_24px_60px_rgba(60,30,10,0.3)]"
          >
            <h4 className={`${fraunces.className} text-xl font-extrabold text-stone-900`}>
              {activeModal === 'password' ? 'Ubah Kata Sandi' : 'Aktivasi Sesi Login'}
            </h4>
            <p className="mb-5 mt-2 text-sm leading-relaxed text-stone-600">
              {activeModal === 'password'
                ? 'Masukkan kata sandi baru untuk mengamankan akun ReOwn kamu.'
                : 'Perangkat ini terdaftar aktif dan aman untuk sesi login saat ini.'}
            </p>

            {activeModal === 'password' && (
              <input
                type="password"
                placeholder="Kata sandi baru..."
                className="mb-5 w-full rounded-xl border-[1.5px] border-stone-200 bg-[#FFF7E9] px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#D85834] focus:outline-none"
              />
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className={`rounded-full border-[1.5px] border-stone-300 py-2.5 text-sm font-semibold text-stone-800 transition-colors hover:bg-stone-100 ${focusRing}`}
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => { alert("Berhasil disimpan!"); setActiveModal(null); }}
                className={`rounded-full bg-stone-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#D85834] ${focusRing}`}
              >
                Simpan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}