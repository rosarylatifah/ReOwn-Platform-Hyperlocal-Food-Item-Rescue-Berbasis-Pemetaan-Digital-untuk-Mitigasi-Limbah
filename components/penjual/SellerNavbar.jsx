"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Home, Package, CheckSquare, Inbox, History, MessageSquare, Bell, User } from 'lucide-react';
import Link from 'next/link';
import ProfilePopover from '@/components/profil/ProfilePopover';
import SellerChatPopover from '@/components/penjual/SellerChatPopover'; // 👈 1. Import SellerChatPopover

export default function SellerNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  // State untuk mengontrol buka/tutup popover profil & chat
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // 👈 2. State untuk buka/tutup chat popover

  const pathname = usePathname();

  // Daftar menu navigasi lengkap dengan path rutenya masing-masing
  const navItems = [
    { id: 'beranda', path: '/penjual/beranda', label: 'BERANDA', icon: Home },
    { id: 'kelola-produk', path: '/penjual/kelola-produk', label: 'KELOLA PRODUK', icon: Package },
    { id: 'konfirmasi-pesanan', path: '/penjual/konfirmasi-pesanan', label: 'KONFIRMASI PESANAN', icon: CheckSquare },
    { id: 'pesanan-masuk', path: '/penjual/pesanan-masuk', label: 'PESANAN MASUK', icon: Inbox },
    { id: 'riwayat-pesanan', path: '/penjual/riwayat', label: 'RIWAYAT PESANAN', icon: History },
  ];

  return (
    <>
      <style jsx>{`
        @media (max-width: 900px) {
          .hamburger-btn {
            display: flex !important;
          }
          .nav-menu {
            position: fixed;
            top: 80px;
            left: 30px;
            flex-direction: column;
            align-items: flex-start !important;
            gap: 10px !important;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(12px);
            padding: 20px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            transform: translateY(-20px);
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s ease;
          }
          .nav-menu.open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
          }
          .nav-menu a {
            width: 100%;
            justify-content: flex-start;
          }
        }

        @media (max-width: 600px) {
          nav {
            padding: 10px 14px !important;
          }
          .logo-btn {
            padding: 6px 14px !important;
          }
          .logo-btn h2 {
            font-size: 16px !important;
          }
          .action-icons-group {
            gap: 5px !important;
          }
          .action-icons-group button,
          .action-icons-group a {
            width: 32px !important;
            height: 32px !important;
          }
        }
      `}</style>

      {/* Backdrop Gelap saat Menu Mobile Dibuka */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
          }}
        />
      )}

      {/* NAVBAR SELLER */}
      <nav style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0,
        width: '100%', 
        zIndex: 1000,
        backgroundColor: 'rgba(250, 240, 236, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(217, 90, 54, 0.1)',
        padding: '14px 30px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease'
      }}>
        {/* Kiri: Hamburger Button & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="hamburger-btn"
            style={{ 
              display: 'none', 
              backgroundColor: '#D95A36', 
              color: '#FFF', 
              border: 'none', 
              width: '40px',
              height: '40px',
              borderRadius: '50%', 
              cursor: 'pointer',
              fontSize: '18px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s ease'
            }}
          >
            {isOpen ? '✕' : '☰'}
          </button>

          {/* LOGO REOWN */}
          <Link 
            href="/penjual/beranda"
            className="logo-btn"
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
            style={{ 
              textDecoration: 'none',
              backgroundColor: '#D95A36', 
              padding: '8px 20px', 
              borderRadius: '20px', 
              boxShadow: isLogoHovered ? '0 8px 20px rgba(217, 90, 54, 0.4)' : '0 4px 10px rgba(0,0,0,0.15)',
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer',
              transform: isLogoHovered ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }} 
          >
            <h2 style={{ fontFamily: 'Fraunces, serif', color: '#FFF', margin: 0, fontSize: '20px', letterSpacing: '0.5px' }}>
              Re<span style={{ color: '#86efac' }}>O</span>wn
            </h2>
          </Link>
        </div>

        {/* Tengah: Tombol Navigasi Utama Seller */}
        <div className={`nav-menu ${isOpen ? 'open' : ''}`} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const isHovered = hoveredNav === item.id;
            const IconComponent = item.icon;

            return (
              <Link
                key={item.id}
                href={item.path}
                onClick={() => setIsOpen(false)}
                onMouseEnter={() => setHoveredNav(item.id)}
                onMouseLeave={() => setHoveredNav(null)}
                style={{
                  textDecoration: 'none',
                  fontFamily: 'Inter, sans-serif',
                  border: isActive ? '2px solid #FFF' : 'none',
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#C54E2D' : isHovered ? '#E87A5D' : '#D95A36',
                  color: '#FFF',
                  padding: '8px 18px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: isActive ? 'bold' : '600',
                  boxShadow: isHovered || isActive ? '0 6px 14px rgba(217, 90, 54, 0.4)' : '0 4px 10px rgba(0,0,0,0.15)',
                  transform: isHovered ? 'translateY(-2px) scale(1.05)' : isActive ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {IconComponent && <IconComponent size={15} />}
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Kanan: Ikon Akses Cepat Seller */}
        <div className="action-icons-group" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          
          {/* TOMBOL CHAT (Memicu SellerChatPopover) */}
          <button 
            onClick={() => setIsChatOpen(true)} // 👈 3. Buka SellerChatPopover saat diklik
            onMouseEnter={() => setHoveredIcon('chat')}
            onMouseLeave={() => setHoveredIcon(null)}
            style={{ 
              width: '38px', 
              height: '38px', 
              borderRadius: '50%', 
              border: 'none', 
              backgroundColor: hoveredIcon === 'chat' ? '#E87A5D' : '#D95A36', 
              boxShadow: hoveredIcon === 'chat' ? '0 6px 14px rgba(217, 90, 54, 0.45)' : '0 4px 10px rgba(0,0,0,0.15)', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transform: hoveredIcon === 'chat' ? 'translateY(-2px) scale(1.08)' : 'scale(1)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <MessageSquare size={18} color="#FFF" />
          </button>

          {/* TOMBOL NOTIFIKASI */}
          <button 
            onClick={() => alert('Tidak ada notifikasi baru.')}
            onMouseEnter={() => setHoveredIcon('bell')}
            onMouseLeave={() => setHoveredIcon(null)}
            style={{ 
              width: '38px', 
              height: '38px', 
              borderRadius: '50%', 
              border: 'none', 
              backgroundColor: hoveredIcon === 'bell' ? '#E87A5D' : '#D95A36', 
              boxShadow: hoveredIcon === 'bell' ? '0 6px 14px rgba(217, 90, 54, 0.45)' : '0 4px 10px rgba(0,0,0,0.15)', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transform: hoveredIcon === 'bell' ? 'translateY(-2px) scale(1.08)' : 'scale(1)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <Bell size={18} color="#FFF" />
          </button>

          {/* TOMBOL PROFIL */}
          <button 
            onClick={() => setIsProfileOpen(true)}
            onMouseEnter={() => setHoveredIcon('profile')}
            onMouseLeave={() => setHoveredIcon(null)}
            style={{ 
              width: '38px', 
              height: '38px', 
              borderRadius: '50%', 
              border: 'none', 
              backgroundColor: hoveredIcon === 'profile' ? '#E87A5D' : '#D95A36', 
              boxShadow: hoveredIcon === 'profile' ? '0 6px 14px rgba(217, 90, 54, 0.45)' : '0 4px 10px rgba(0,0,0,0.15)', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transform: hoveredIcon === 'profile' ? 'translateY(-2px) scale(1.08)' : 'scale(1)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <User size={18} color="#FFF" />
          </button>

        </div>
      </nav>

      {/* RENDER POPOVER PROFIL & CHAT */}
      <ProfilePopover 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />

      <SellerChatPopover 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
}