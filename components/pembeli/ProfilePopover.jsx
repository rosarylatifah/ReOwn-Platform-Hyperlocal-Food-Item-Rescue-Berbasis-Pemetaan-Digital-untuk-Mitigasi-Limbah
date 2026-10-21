"use client";

import React from 'react';
import { User, ShoppingBag, Heart, Settings, LogOut, ChevronRight, Store, ShieldAlert, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePopover({ isOpen, onClose }) {
  if (!isOpen) return null;

  const userData = {
    name: 'Azzahara Faiza Rayya',
    email: 'zara@polsri.ac.id',
    role: 'Pembeli (Rescue Member)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  };

  return (
    <>
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 998,
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(1px)'
        }}
      />

      <div 
        style={{
          position: 'fixed',
          top: '80px',
          right: '30px',
          width: '320px',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(217, 90, 54, 0.08)',
          border: '1px solid rgba(217, 90, 54, 0.12)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: 'Inter, sans-serif',
          animation: 'fadeInPopover 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className="reown-profile-popover"
      >
        <style jsx global>{`
          @keyframes fadeInPopover {
            from {
              opacity: 0;
              transform: translateY(-10px) scale(0.97);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          @media (max-width: 640px) {
            .reown-profile-popover {
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
              width: 100vw !important;
              height: 100vh !important;
              border-radius: 0 !important;
            }
          }
        `}</style>

        {/* HEADER USER INFO */}
        <div style={{ padding: '20px', backgroundColor: '#FFF3ED', borderBottom: '1px solid rgba(217, 90, 54, 0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src={userData.avatar} 
              alt={userData.name}
              style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #D95A36' }}
            />
            <div style={{ overflow: 'hidden' }}>
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userData.name}
              </h4>
              <p style={{ margin: '2px 0 4px 0', fontSize: '11px', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userData.email}
              </p>
              <span style={{ backgroundColor: '#D95A36', color: '#FFF', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px', display: 'inline-block' }}>
                {userData.role}
              </span>
            </div>
          </div>
        </div>

        {/* MENU LIST */}
        <div style={{ padding: '8px 0' }}>
          <Link
            href="/pembeli/profil"
            onClick={onClose}
            style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#1A1A1A', fontSize: '13px', fontWeight: '600' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF0EC'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <User size={18} color="#D95A36" /> Pengaturan Profil
          </Link>

          <Link
            href="/pembeli/pesanan"
            onClick={onClose}
            style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#1A1A1A', fontSize: '13px', fontWeight: '600' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF0EC'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <ShoppingBag size={18} color="#D95A36" /> Pesanan Saya
          </Link>

          {/* TOGGLE KE MODE PENJUAL */}
          <div style={{ margin: '8px 16px', borderTop: '1px solid #F0F0F0', borderBottom: '1px solid #F0F0F0', padding: '8px 0' }}>
            <Link
              href="/penjual/beranda"
              onClick={onClose}
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: '#1A1A1A',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textDecoration: 'none',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Store size={16} color="#86efac" /> Switch ke Mode Penjual
              </div>
              <ChevronRight size={14} />
            </Link>
          </div>

          <Link
            href="/pembeli/Pelaporan"
            onClick={onClose}
            style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#1A1A1A', fontSize: '13px', fontWeight: '600' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF0EC'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <AlertTriangle size={18} color="#DC2626" /> Laporkan Masalah
          </Link>

          <button
            onClick={() => {
              alert('Anda telah keluar dari akun.');
              onClose();
            }}
            style={{
              width: '100%',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#DC2626',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={18} color="#DC2626" /> Keluar
          </button>
        </div>
      </div>
    </>
  );
}