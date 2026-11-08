"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ChevronRight, Package } from 'lucide-react';
import { useProfile } from '@/lib/ProfileContext';
import { areaOf } from '@/lib/pembeli/locationPrivacy';

export default function StorePopover({ store, onClose, positionStyle }) {
  const router = useRouter();
  const popoverRef = useRef(null);
  const { profile } = useProfile();

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Gunakan data toko dari props atau fallback ke data profil global akun
  const activeStore = store || {
    name: profile.storeName,
    address: profile.storeAddress,
    logo: profile.storeLogo,
    totalProducts: profile.totalProducts
  };

  return (
    <div
      ref={popoverRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{
        position: 'absolute', zIndex: 50, backgroundColor: '#FFF', borderRadius: '16px',
        padding: '14px 16px', width: '300px',
        boxShadow: isHovered ? '0 14px 32px rgba(217, 90, 54, 0.25)' : '0 10px 25px rgba(0,0,0,0.18)',
        border: isHovered ? '2px solid #D95A36' : '2px solid #E5E7EB',
        display: 'flex', gap: '14px', alignItems: 'center', cursor: 'pointer',
        transform: isPressed ? 'scale(0.97)' : isHovered ? 'translateY(-2px)' : 'scale(1)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        ...positionStyle
      }}
      onClick={(e) => {
        e.stopPropagation();
        const storeSlug = encodeURIComponent(activeStore.name || 'toko');
        router.push(`/pembeli/toko/${storeSlug}`);
      }}
    >
      <div style={{ width: '80px', height: '80px', borderRadius: '12px', backgroundColor: '#F3F4F6', overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={activeStore.logo || activeStore.image || '/placeholder-store.png'}
          alt={activeStore.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {activeStore.name}
          </h4>
          <ChevronRight size={16} color="#D95A36" />
        </div>

        {/* Hanya nama area, bukan alamat lengkap */}
        <p style={{ margin: 0, fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <MapPin size={12} color="#D95A36" /> {areaOf(activeStore.address || activeStore.location)}
        </p>

        <span style={{ fontSize: '12px', color: '#777', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
          <Package size={12} color="#888" /> Produk: <strong>{activeStore.totalProducts}</strong>
        </span>
      </div>
    </div>
  );
}
