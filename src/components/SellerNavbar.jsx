"use client";

import React, { useState } from 'react';
import { Home, Package, CheckSquare, Inbox, History, MessageSquare, Bell, User } from 'lucide-react';

export default function SellerNavbar({ currentPage, setCurrentPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  
  // State hover khusus buat logo ReOwn di sebelah kiri
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  const navItems = [
    { id: 'beranda', label: 'BERANDA', icon: Home },
    { id: 'kelola-produk', label: 'KELOLA PRODUK', icon: Package },
    { id: 'konfirmasi-pesanan', label: 'KONFIRMASI PESANAN', icon: CheckSquare },
    { id: 'pesanan-masuk', label: 'PESANAN MASUK', icon: Inbox },
    { id: 'riwayat-pesanan', label: 'RIWAYAT PESANAN', icon: History },
  ];

  // Daftar tombol ikon di sebelah kanan (Tanpa Keranjang)
  const actionIcons = [
    { 
      key: 'chat', 
      icon: <MessageSquare size={18} color="#1A1A1A" />, 
      onClick: () => alert('Fitur Chat Seller akan datang!') 
    },
    { 
      key: 'notif', 
      icon: <Bell size={18} color="#1A1A1A" />, 
      onClick: () => alert('Tidak ada notifikasi baru.') 
    },
    { 
      key: 'user', 
      icon: <User size={18} color="#1A1A1A" />, 
      onClick: () => alert('Halaman Profil Penjual') 
    },
  ];

  return (
    <>
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
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(3px)',
            zIndex: 998,
          }}
        />
      )}

      <nav style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        zIndex: 1000,
        backgroundColor: 'transparent',
        padding: '16px 30px', // DISAMAKAN DENGAN BUYER NAVBAR
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxSizing: 'border-box'
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
              fontSize: '16px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isOpen ? '✕' : '☰'}
          </button>

          {/* LOGO REOWN DENGAN EFEK INTERAKTIF */}
          <div 
            onClick={() => setCurrentPage('beranda')}
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
            style={{ 
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
          </div>
        </div>

        {/* Tengah: Tombol Navigasi Utama Seller */}
        <div className={`nav-menu ${isOpen ? 'open' : ''}`} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            const isHovered = hoveredNav === item.id;
            const IconComponent = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsOpen(false);
                }}
                onMouseEnter={() => setHoveredNav(item.id)}
                onMouseLeave={() => setHoveredNav(null)}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  border: isActive ? '2px solid #FFF' : 'none',
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#C54E2D' : isHovered ? '#E87A5D' : '#D95A36',
                  color: '#FFF',
                  padding: '8px 18px', // DISAMAKAN DENGAN BUYER NAVBAR
                  borderRadius: '20px',
                  fontSize: '13px',    // DISAMAKAN UKURAN FONTNYA
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
              </button>
            );
          })}
        </div>

        {/* Kanan: Ikon Komputer Seller (Chat, Notif, User) */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {actionIcons.map((btn) => (
            <button 
              key={btn.key}
              onClick={btn.onClick}
              style={{ 
                width: '38px', 
                height: '38px', 
                borderRadius: '50%', 
                border: 'none', 
                backgroundColor: '#FFF', 
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                transition: 'transform 0.2s ease, background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.backgroundColor = '#FAF0EC';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = '#FFF';
              }}
            >
              {btn.icon}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}