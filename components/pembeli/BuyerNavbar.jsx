"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Home, Package, CheckSquare, History, MessageSquare, Bell, User, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/app/pembeli/context/cart';
import { useChat } from '@/app/pembeli/context/chat';

import NotificationPopover from '@/components/pembeli/NotificationPopover';
import ChatPopover from '@/components/pembeli/ChatPopover';
import ProfilePopover from '@/components/pembeli/ProfilePopover';

export default function BuyerNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const [activePopover, setActivePopover] = useState(null); // 'notif' | 'chat' | 'profile' | null

  const { totalCartItems } = useCart();
  const { unreadChatCount } = useChat();
  const pathname = usePathname();

  const navItems = [
    { id: 'beranda', path: '/pembeli/beranda', label: 'BERANDA', icon: Home },
    { id: 'produk', path: '/pembeli/produk', label: 'PRODUK', icon: Package },
    { id: 'pesanan', path: '/pembeli/pesanan', label: 'PESANAN', icon: CheckSquare },
    { id: 'riwayat', path: '/pembeli/riwayat', label: 'RIWAYAT PESANAN', icon: History },
  ];

  const togglePopover = (popoverName) => {
    setActivePopover((prev) => (prev === popoverName ? null : popoverName));
  };

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
            gap: 8px !important;
          }
          .action-icons-group button, 
          .action-icons-group a {
            width: 36px !important;
            height: 36px !important;
          }
        }
      `}</style>

      {/* OVERLAY HAMBURGER MENU MOBILE */}
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
        {/* KIRI: LOGO & HAMBURGER */}
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

          <Link 
            href="/pembeli/beranda"
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

        {/* TENGAH: MENU NAVIGASI UTAMA */}
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

        {/* KANAN: AKSES CEPAT */}
        <div className="action-icons-group" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          
          {/* TOMBOL CHAT */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => togglePopover('chat')}
              onMouseEnter={() => setHoveredIcon('chat')}
              onMouseLeave={() => setHoveredIcon(null)}
              style={{ 
                width: '38px', height: '38px', borderRadius: '50%', 
                border: activePopover === 'chat' ? '2px solid #FFF' : 'none', 
                backgroundColor: activePopover === 'chat' ? '#C54E2D' : hoveredIcon === 'chat' ? '#E87A5D' : '#D95A36', 
                boxShadow: hoveredIcon === 'chat' || activePopover === 'chat' ? '0 6px 14px rgba(217, 90, 54, 0.45)' : '0 4px 10px rgba(0,0,0,0.15)', 
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: hoveredIcon === 'chat' ? 'translateY(-2px) scale(1.08)' : 'scale(1)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <MessageSquare size={18} color="#FFF" />
            </button>

            {unreadChatCount > 0 && (
              <span style={{
                position: 'absolute', top: '-4px', right: '-4px',
                backgroundColor: '#FFF', color: '#D95A36', fontSize: '10px', fontWeight: 'bold',
                borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}>
                {unreadChatCount}
              </span>
            )}
          </div>

          {/* TOMBOL NOTIFIKASI (DENGAN BADGE ANGKA) */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => togglePopover('notif')}
              onMouseEnter={() => setHoveredIcon('bell')}
              onMouseLeave={() => setHoveredIcon(null)}
              style={{ 
                width: '38px', height: '38px', borderRadius: '50%', 
                border: activePopover === 'notif' ? '2px solid #FFF' : 'none', 
                backgroundColor: activePopover === 'notif' ? '#C54E2D' : hoveredIcon === 'bell' ? '#E87A5D' : '#D95A36', 
                boxShadow: hoveredIcon === 'bell' || activePopover === 'notif' ? '0 6px 14px rgba(217, 90, 54, 0.45)' : '0 4px 10px rgba(0,0,0,0.15)', 
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: hoveredIcon === 'bell' ? 'translateY(-2px) scale(1.08)' : 'scale(1)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <Bell size={18} color="#FFF" />
            </button>

            {/* BADGE ANGKA NOTIFIKASI */}
            <span style={{
              position: 'absolute', top: '-4px', right: '-4px',
              backgroundColor: '#FFF', color: '#D95A36', fontSize: '10px', fontWeight: 'bold',
              borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }}>
              2
            </span>
          </div>

          {/* TOMBOL KERANJANG */}
          <Link
            href="/pembeli/keranjang"
            onMouseEnter={() => setHoveredIcon('cart')}
            onMouseLeave={() => setHoveredIcon(null)}
            style={{
              textDecoration: 'none',
              position: 'relative',
              width: '38px', 
              height: '38px', 
              borderRadius: '50%', 
              border: pathname === '/pembeli/keranjang' ? '2px solid #FFF' : 'none', 
              backgroundColor: pathname === '/pembeli/keranjang' 
                ? '#C54E2D' 
                : hoveredIcon === 'cart' 
                ? '#E87A5D' 
                : '#D95A36', 
              boxShadow: hoveredIcon === 'cart' || pathname === '/pembeli/keranjang' 
                ? '0 6px 14px rgba(217, 90, 54, 0.45)' 
                : '0 4px 10px rgba(0,0,0,0.15)', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transform: hoveredIcon === 'cart' ? 'translateY(-2px) scale(1.08)' : pathname === '/pembeli/keranjang' ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <ShoppingCart size={18} color="#FFF" />

            {/* BADGE ANGKA JUMLAH KERANJANG */}
            {totalCartItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: '#FFF',
                color: '#D95A36',
                fontSize: '10px',
                fontWeight: 'bold',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}>
                {totalCartItems}
              </span>
            )}
          </Link>

          {/* TOMBOL PROFIL */}
          <button 
            onClick={() => togglePopover('profile')}
            onMouseEnter={() => setHoveredIcon('profile')}
            onMouseLeave={() => setHoveredIcon(null)}
            style={{ 
              width: '38px', height: '38px', borderRadius: '50%', 
              border: activePopover === 'profile' ? '2px solid #FFF' : 'none', 
              backgroundColor: activePopover === 'profile' ? '#C54E2D' : hoveredIcon === 'profile' ? '#E87A5D' : '#D95A36', 
              boxShadow: hoveredIcon === 'profile' || activePopover === 'profile' ? '0 6px 14px rgba(217, 90, 54, 0.45)' : '0 4px 10px rgba(0,0,0,0.15)', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: hoveredIcon === 'profile' ? 'translateY(-2px) scale(1.08)' : 'scale(1)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <User size={18} color="#FFF" />
          </button>
        </div>
      </nav>

      {/* RENDER POPOVER */}
      <ChatPopover isOpen={activePopover === 'chat'} onClose={() => setActivePopover(null)} />
      <NotificationPopover isOpen={activePopover === 'notif'} onClose={() => setActivePopover(null)} />
      <ProfilePopover isOpen={activePopover === 'profile'} onClose={() => setActivePopover(null)} />
    </>
  );
}