"use client";

import React, { useState } from 'react';
import { 
  User, ShoppingBag, LogOut, ChevronRight, Store, AlertTriangle, 
  ArrowLeft, Lock, ShieldCheck, Bell, Trash2, Phone, MapPin, Key, Smartphone 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useProfile } from '@/lib/ProfileContext'; // 👈 Import context profil global

export default function ProfilePopover({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const { profile, toggleSellerMode } = useProfile(); // 👈 Ambil status isSellerActive
  const router = useRouter();

  // State untuk mengatur level navigasi popover ('main', 'settings', 'privacy', 'security', 'notifications')
  const [currentView, setCurrentView] = useState('main');

  // State untuk memunculkan mini popover kartu profil HANYA KETIKA FOTO DIKLIK
  const [showMiniCard, setShowMiniCard] = useState(false);

  // State toggle interaktif di dalam sub-menu
  const [showPhone, setShowPhone] = useState(true);
  const [showAddress, setShowAddress] = useState(false);
  const [locationNotif, setLocationNotif] = useState(true);

  // State untuk modal pop-up kecil (ubah sandi & aktivitas login)
  const [activeModal, setActiveModal] = useState(null); // 'password' atau 'sessions'

  if (!isOpen) return null;

  const userData = {
    name: user?.nama || 'Azzahara Faiza Rayya',
    email: user?.email || 'zara@polsri.ac.id',
    role: profile.isSellerActive ? `Penjual (${profile.storeName || 'Toko'})` : 'Pembeli (Rescue Member)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  };

  const handleLogout = () => {
    logout();
    onClose();
    router.push('/masuk');
  };

  const handleClose = () => {
    setCurrentView('main');
    setShowMiniCard(false);
    setActiveModal(null);
    onClose();
  };

  // Fungsi khusus untuk tombol switch mode
  const handleSwitchMode = () => {
    onClose();
    if (profile.isSellerActive) {
      // Jika sedang jadi Penjual -> Langsung pindah ke Mode Pembeli
      toggleSellerMode(false);
      router.push('/pembeli/beranda'); // Sesuaikan rute beranda pembeli kamu
    } else {
      // Jika sedang jadi Pembeli -> Masuk ke /profil dulu untuk verifikasi data toko
      router.push('/profil');
    }
  };

  return (
    <>
      <div 
        onClick={handleClose}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 998, backgroundColor: 'rgba(0, 0, 0, 0.15)', backdropFilter: 'blur(1px)'
        }}
      />

      <div 
        style={{
          position: 'fixed', top: '80px', right: '30px', width: '340px',
          backgroundColor: '#FFFFFF', borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(217, 90, 54, 0.08)',
          border: '1px solid rgba(217, 90, 54, 0.12)', zIndex: 999,
          display: 'flex', flexDirection: 'column', overflow: 'visible',
          fontFamily: 'Inter, sans-serif', animation: 'fadeInPopover 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className="reown-profile-popover"
      >
        <style jsx global>{`
          @keyframes fadeInPopover {
            from { opacity: 0; transform: translateY(-10px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @media (max-width: 640px) {
            .reown-profile-popover {
              top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
              width: 100vw !important; height: 100vh !important; border-radius: 0 !important;
            }
          }
        `}</style>

        {/* ================= VIEW 1: MENU UTAMA ================= */}
        {currentView === 'main' && (
          <div style={{ animation: 'fadeInPopover 0.2s ease', position: 'relative' }}>
            
            {/* HEADER USER INFO */}
            <div 
              style={{ 
                padding: '20px', backgroundColor: '#FFF3ED', borderBottom: '1px solid rgba(217, 90, 54, 0.15)', 
                borderTopLeftRadius: '20px', borderTopRightRadius: '20px', position: 'relative' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                
                {/* FOTO PROFIL */}
                <div style={{ position: 'relative' }}>
                  <img 
                    src={userData.avatar} 
                    alt={userData.name}
                    onClick={() => setShowMiniCard(!showMiniCard)}
                    title="Klik untuk lihat semua profil"
                    style={{ 
                      width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', 
                      border: '2px solid #D95A36', cursor: 'pointer', transition: 'transform 0.2s' 
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />

                  {/* MINI POPOVER KARTU PROFIL */}
                  {showMiniCard && (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                        router.push('/profil');
                      }}
                      style={{
                        position: 'absolute',
                        top: '0px',
                        left: '65px',
                        width: '260px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '16px',
                        boxShadow: '0 14px 32px rgba(217, 90, 54, 0.25)',
                        border: '2px solid #D95A36',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        zIndex: 1005,
                        animation: 'fadeInPopover 0.2s ease-out'
                      }}
                    >
                      <img 
                        src={userData.avatar} alt="Avatar"
                        style={{ width: '45px', height: '45px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #ddd' }}
                      />
                      <div style={{ overflow: 'hidden', flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {userData.name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#D95A36', fontWeight: '600', marginTop: '2px' }}>
                          Lihat Semua Profil
                        </div>
                      </div>
                      <ChevronRight size={16} color="#D95A36" />
                    </div>
                  )}
                </div>

                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {userData.name}
                  </h4>
                  <p style={{ margin: '2px 0 4px 0', fontSize: '11px', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {userData.email}
                  </p>
                  
                  <span 
                    onClick={() => setShowMiniCard(!showMiniCard)}
                    style={{ 
                      backgroundColor: '#D95A36', color: '#FFF', fontSize: '10px', fontWeight: 'bold', 
                      padding: '2px 8px', borderRadius: '10px', display: 'inline-block', cursor: 'pointer' 
                    }}
                  >
                    Lihat semua profil
                  </span>
                </div>
              </div>
            </div>

            <div style={{ padding: '8px 0' }}>
              <div
                onClick={() => setCurrentView('settings')}
                style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', color: '#1A1A1A', fontSize: '13px', fontWeight: '600' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF0EC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <User size={18} color="#D95A36" /> Pengaturan Profil
                </div>
                <ChevronRight size={16} color="#888" />
              </div>

              <Link
                href="/pembeli/pesanan"
                onClick={handleClose}
                style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#1A1A1A', fontSize: '13px', fontWeight: '600' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF0EC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <ShoppingBag size={18} color="#D95A36" /> Pesanan Saya
              </Link>

              {/* TOMBOL SWITCH DINAMIS: BERUBAH OTOMATIS SESUAI STATUS AKUN */}
              <div style={{ margin: '8px 16px', borderTop: '1px solid #F0F0F0', borderBottom: '1px solid #F0F0F0', padding: '8px 0' }}>
                <div
                  onClick={handleSwitchMode}
                  style={{
                    padding: '10px 14px', borderRadius: '12px', backgroundColor: '#1A1A1A', color: '#FFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Store size={16} color="#86efac" /> 
                    {profile.isSellerActive ? 'Switch ke Mode Pembeli' : 'Switch ke Mode Penjual'}
                  </div>
                  <ChevronRight size={14} />
                </div>
              </div>

              <Link
                href="/pembeli/Pelaporan"
                onClick={handleClose}
                style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#1A1A1A', fontSize: '13px', fontWeight: '600' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF0EC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <AlertTriangle size={18} color="#DC2626" /> Laporkan Masalah
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  width: '100%', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px',
                  border: 'none', backgroundColor: 'transparent', color: '#DC2626', fontSize: '13px', fontWeight: '600', cursor: 'pointer', textAlign: 'left'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <LogOut size={18} color="#DC2626" /> Keluar
              </button>
            </div>
          </div>
        )}

        {/* ================= VIEW 2: MENU SETELAN UTAMA ================= */}
        {currentView === 'settings' && (
          <div style={{ animation: 'fadeInPopover 0.2s ease', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', backgroundColor: '#FFF3ED', borderBottom: '1px solid rgba(217, 90, 54, 0.15)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={() => setCurrentView('main')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFF', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
              >
                <ArrowLeft size={18} color="#D95A36" />
              </button>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#1A1A1A' }}>Pengaturan Profil</h3>
            </div>

            <div style={{ padding: '8px 0' }}>
              <div
                onClick={() => setCurrentView('privacy')}
                style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', color: '#1A1A1A', fontSize: '13px', fontWeight: '600' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF0EC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <User size={16} color="#D95A36" /> Privasi Profil Utama
                </div>
                <ChevronRight size={16} color="#888" />
              </div>

              <div
                onClick={() => setCurrentView('security')}
                style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', color: '#1A1A1A', fontSize: '13px', fontWeight: '600' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF0EC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <ShieldCheck size={16} color="#0284C7" /> Keamanan Akun
                </div>
                <ChevronRight size={16} color="#888" />
              </div>

              <div
                onClick={() => setCurrentView('notifications')}
                style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', color: '#1A1A1A', fontSize: '13px', fontWeight: '600' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF0EC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Bell size={16} color="#CA8A04" /> Pengaturan Notifikasi
                </div>
                <ChevronRight size={16} color="#888" />
              </div>

              <div style={{ margin: '8px 16px', borderTop: '1px solid #F0F0F0' }} />

              <div
                onClick={() => {
                  if (window.confirm("Yakin ingin menghapus akun secara permanen?")) alert("Akun dihapus.");
                }}
                style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#DC2626', fontSize: '13px', fontWeight: '600' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Trash2 size={16} color="#DC2626" /> Penghapusan Akun
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 3A: PRIVASI PROFIL UTAMA ================= */}
        {currentView === 'privacy' && (
          <div style={{ animation: 'fadeInPopover 0.2s ease', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', backgroundColor: '#FFF3ED', borderBottom: '1px solid rgba(217, 90, 54, 0.15)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={() => setCurrentView('settings')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFF', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
              >
                <ArrowLeft size={18} color="#D95A36" />
              </button>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#1A1A1A' }}>Privasi Profil Utama</h3>
            </div>

            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
              <div style={{ color: '#666', fontSize: '11px' }}>Atur visibilitas informasi pribadi kamu agar terlihat oleh pengguna lain di platform ReOwn.</div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAF0EC', padding: '10px 14px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1A1A1A', fontWeight: '600' }}>
                  <Phone size={16} color="#D95A36" /> Tampilkan No. HP
                </div>
                <input 
                  type="checkbox" 
                  checked={showPhone} 
                  onChange={() => setShowPhone(!showPhone)}
                  style={{ width: '18px', height: '18px', accentColor: '#D95A36', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAF0EC', padding: '10px 14px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1A1A1A', fontWeight: '600' }}>
                  <MapPin size={16} color="#D95A36" /> Tampilkan Alamat
                </div>
                <input 
                  type="checkbox" 
                  checked={showAddress} 
                  onChange={() => setShowAddress(!showAddress)}
                  style={{ width: '18px', height: '18px', accentColor: '#D95A36', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 3B: KEAMANAN AKUN ================= */}
        {currentView === 'security' && (
          <div style={{ animation: 'fadeInPopover 0.2s ease', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', backgroundColor: '#FFF3ED', borderBottom: '1px solid rgba(217, 90, 54, 0.15)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={() => setCurrentView('settings')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFF', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
              >
                <ArrowLeft size={18} color="#D95A36" />
              </button>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#1A1A1A' }}>Keamanan Akun</h3>
            </div>

            <div style={{ padding: '12px 0' }}>
              <div
                onClick={() => setActiveModal('password')}
                style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#1A1A1A', fontSize: '13px', fontWeight: '600' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF0EC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Key size={16} color="#0284C7" /> Ubah Kata Sandi
              </div>

              <div
                onClick={() => setActiveModal('sessions')}
                style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#1A1A1A', fontSize: '13px', fontWeight: '600' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF0EC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Smartphone size={16} color="#0284C7" /> Aktivasi Sesi Login
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 3C: PENGATURAN NOTIFIKASI ================= */}
        {currentView === 'notifications' && (
          <div style={{ animation: 'fadeInPopover 0.2s ease', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', backgroundColor: '#FFF3ED', borderBottom: '1px solid rgba(217, 90, 54, 0.15)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={() => setCurrentView('settings')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFF', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
              >
                <ArrowLeft size={18} color="#D95A36" />
              </button>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#1A1A1A' }}>Pengaturan Notifikasi</h3>
            </div>

            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
              <div style={{ color: '#666', fontSize: '11px' }}>Kelola izin akses notifikasi untuk fitur pendukung aplikasi.</div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FEFCE8', padding: '10px 14px', borderRadius: '12px' }}>
                <div style={{ fontWeight: '600', color: '#1A1A1A' }}>Izin Akses Lokasi</div>
                <input 
                  type="checkbox" 
                  checked={locationNotif} 
                  onChange={() => setLocationNotif(!locationNotif)}
                  style={{ width: '18px', height: '18px', accentColor: '#CA8A04', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ================= MODAL KECIL POP-UP ================= */}
      {activeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '16px', width: '300px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', fontFamily: 'Inter, sans-serif' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#1A1A1A' }}>
              {activeModal === 'password' ? 'Ubah Kata Sandi' : 'Aktivasi Sesi Login'}
            </h4>
            <p style={{ fontSize: '12px', color: '#666', margin: '0 0 16px 0' }}>
              {activeModal === 'password' 
                ? 'Masukkan kata sandi baru untuk mengamankan akun ReOwn kamu.' 
                : 'Perangkat ini terdaftar aktif dan aman untuk sesi login saat ini.'}
            </p>
            {activeModal === 'password' && (
              <input 
                type="password" 
                placeholder="Kata sandi baru..." 
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '16px', fontSize: '12px' }} 
              />
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                onClick={() => setActiveModal(null)}
                style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #ddd', background: '#FFF', fontSize: '12px', cursor: 'pointer' }}
              >
                Tutup
              </button>
              <button 
                onClick={() => { alert("Berhasil disimpan!"); setActiveModal(null); }}
                style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: '#D95A36', color: '#FFF', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}