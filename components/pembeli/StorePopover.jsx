"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ChevronRight, Package } from 'lucide-react';

export default function StorePopover({ store, onClose, positionStyle }) {
  const router = useRouter();
  const popoverRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Tutup popover jika klik di luar area
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!store) return null;

  return (
    <div
      ref={popoverRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{
        position: 'absolute',
        zIndex: 50,
        backgroundColor: '#FFF',
        borderRadius: '16px',
        padding: '14px 16px',
        width: '300px', // 👈 Ukuran diperbesar dari 240px ke 300px
        boxShadow: isHovered 
          ? '0 14px 32px rgba(217, 90, 54, 0.25)' 
          : '0 10px 25px rgba(0, 0, 0, 0.18)',
        border: isHovered ? '2px solid #D95A36' : '2px solid #E5E7EB',
        display: 'flex',
        gap: '14px',
        alignItems: 'center',
        cursor: 'pointer',
        transform: isPressed 
          ? 'scale(0.97)' 
          : isHovered 
          ? 'translateY(-2px)' 
          : 'scale(1)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: 'fadeInScale 0.2s ease-out forwards',
        ...positionStyle
      }}
      onClick={(e) => {
        e.stopPropagation();
        const storeSlug = encodeURIComponent(store.name || store.storeName || 'toko');
        router.push(`/pembeli/toko/${storeSlug}`);
      }}
    >
      {/* Gambar/Logo Toko */}
      <div style={{
        width: '80px',  // 👈 Logo diperbesar dari 50px ke 80px
        height: '80px',
        borderRadius: '12px',
        backgroundColor: '#F3F4F6',
        overflow: 'hidden',
        flexShrink: 0,
        border: '1px solid #EEEEEE'
      }}>
        <img
          src={store.logo || store.image || '/placeholder-store.png'}
          alt={store.name || store.storeName}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/150?text=Toko';
          }}
        />
      </div>

      {/* Info Toko Ringkas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h4 style={{
            margin: 0,
            fontSize: '15px', // 👈 Ukuran teks judul dinaikkan
            fontWeight: '700',
            color: '#1A1A1A',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {store.name || store.storeName || "Nama Toko"}
          </h4>
          <ChevronRight size={16} color="#D95A36" />
        </div>

        <p style={{
          margin: 0,
          fontSize: '12px', // 👈 Ukuran teks alamat dinaikkan
          color: '#666',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          <MapPin size={12} color="#D95A36" /> {store.location || store.address || "Batam Centre"}
        </p>

        <span style={{
          fontSize: '12px',
          color: '#777',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginTop: '2px'
        }}>
          <Package size={12} color="#888" /> Produk: <strong>{store.totalProducts || 9}</strong>
        </span>
      </div>
    </div>
  );
}