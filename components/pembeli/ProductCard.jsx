"use client";

import React, { useState } from 'react';
import { Plus, MapPin, Clock, AlertCircle } from 'lucide-react';
import StorePopover from './StorePopover';

export default function ProductCard({
  item,
  isPromo = false,
  showStoreInfo = true, // 👈 Control muncul/tidaknya nama toko
  showLocation = true,  // 👈 Control muncul/tidaknya alamat toko
  activeStorePopover,
  setActiveStorePopover,
  onAddToCart,
  onSelectProduct,
  onReportProduct
}) {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isPlusHovered, setIsPlusHovered] = useState(false);
  const [isDetailHovered, setIsDetailHovered] = useState(false);
  const [isReportHovered, setIsReportHovered] = useState(false);

  const storeName = item.store || item.merchant || "REOWN MERCHANT";

  return (
    <div 
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      style={{ 
        width: '100%',
        backgroundColor: '#FFF', 
        borderRadius: '16px', 
        border: isCardHovered ? '1.5px solid #D95A36' : '1px solid rgba(0,0,0,0.06)',
        boxShadow: isCardHovered ? '0 12px 28px rgba(217, 90, 54, 0.18)' : '0 4px 12px rgba(0,0,0,0.04)',
        transform: isCardHovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', 
        position: 'relative',
        zIndex: activeStorePopover === item.id ? 30 : 1,
        boxSizing: 'border-box'
      }}
    >
      {/* BADGE PROMO TERBATAS */}
      {isPromo && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: '#D95A36',
          color: '#FFF',
          fontSize: '10px',
          fontWeight: 'bold',
          padding: '4px 10px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          zIndex: 2,
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
        }}>
          <Clock size={11} /> Promo Terbatas
        </div>
      )}

      {/* BADGE JARAK */}
      {!isPromo && item.distance && (
        <span style={{ 
          position: 'absolute', top: '10px', left: '10px', 
          backgroundColor: 'rgba(0,0,0,0.7)', color: '#FFF', 
          padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold',
          backdropFilter: 'blur(4px)', zIndex: 2
        }}>
          {item.distance}
        </span>
      )}

      {/* TOMBOL LAPORKAN */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onReportProduct(item);
        }}
        onMouseEnter={() => setIsReportHovered(true)}
        onMouseLeave={() => setIsReportHovered(false)}
        title="Laporkan produk/gambar bermasalah"
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: isReportHovered ? '#DC2626' : 'rgba(255, 255, 255, 0.9)',
          color: isReportHovered ? '#FFF' : '#666',
          border: 'none',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 2,
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          transform: isReportHovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'all 0.2s ease'
        }}
      >
        <AlertCircle size={16} />
      </button>

      {/* WADAH GAMBAR */}
      <div style={{ 
        width: '100%', 
        height: '150px', 
        overflow: 'hidden', 
        borderTopLeftRadius: '16px', 
        borderTopRightRadius: '16px', 
        backgroundColor: '#F9F9F9',
        position: 'relative'
      }}>
        <img 
          src={item.image} 
          alt={item.name} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            transform: isCardHovered ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform 0.3s ease'
          }} 
        />
      </div>

      {/* INFO PRODUK */}
      <div style={{ padding: '16px' }}>
        {/* NAMA PRODUK DI ATAS */}
        <h4 style={{ 
          margin: showStoreInfo || showLocation ? '0 0 4px 0' : '0 0 14px 0', 
          fontSize: '15px', 
          color: isCardHovered ? '#D95A36' : '#1A1A1A', 
          fontWeight: '600', 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          transition: 'color 0.25s ease'
        }}>
          {item.name}
        </h4>

        {/* NAMA TOKO (Muncul jika showStoreInfo = true) */}
        {showStoreInfo && (
          <div style={{ position: 'relative', marginBottom: '8px', display: 'inline-block' }}>
            <span 
              onClick={(e) => {
                e.stopPropagation();
                if (setActiveStorePopover) {
                  setActiveStorePopover(activeStorePopover === item.id ? null : item.id);
                }
              }}
              style={{ 
                fontSize: '12px', 
                color: '#D95A36', 
                fontWeight: 'bold', 
                cursor: 'pointer', 
                textDecoration: 'underline' 
              }}
            >
              {storeName}
            </span>

            {/* POPOVER TOKO */}
            {activeStorePopover === item.id && (
              <StorePopover 
                store={{
                  name: storeName,
                  location: item.location || item.address || 'Batam Centre',
                  totalProducts: 9,
                  logo: item.image
                }}
                onClose={() => setActiveStorePopover(null)}
                positionStyle={{
                  top: '24px',
                  left: '0px'
                }}
              />
            )}
          </div>
        )}
        
        {/* ALAMAT (Muncul jika showLocation = true) */}
        {showLocation && (
          <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <MapPin size={13} color="#D95A36" /> {item.location || item.address || "Batam"}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#D95A36', display: 'block' }}>
              {item.price}
            </span>
            {item.originalPrice && (
              <span style={{ fontSize: '11px', color: '#999', textDecoration: 'line-through' }}>
                {item.originalPrice}
              </span>
            )}
          </div>

          {/* TOMBOL AKSI */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(item);
              }}
              onMouseEnter={() => setIsPlusHovered(true)}
              onMouseLeave={() => setIsPlusHovered(false)}
              title="Tambah ke Keranjang"
              style={{ 
                backgroundColor: isPlusHovered ? '#D95A36' : '#1A1A1A', 
                color: '#FFF', 
                border: 'none', 
                width: '32px', 
                height: '32px', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: isPlusHovered ? '0 4px 12px rgba(217, 90, 54, 0.35)' : 'none',
                transform: isPlusHovered ? 'scale(1.08)' : 'scale(1)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <Plus size={16} />
            </button>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSelectProduct(item);
              }}
              onMouseEnter={() => setIsDetailHovered(true)}
              onMouseLeave={() => setIsDetailHovered(false)}
              style={{ 
                backgroundColor: isDetailHovered ? '#D95A36' : '#1A1A1A', 
                color: '#FFF', 
                border: 'none', 
                padding: '8px 12px', 
                borderRadius: '8px', 
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer', 
                boxShadow: isDetailHovered ? '0 4px 12px rgba(217, 90, 54, 0.35)' : 'none',
                transform: isDetailHovered ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              LIHAT DETAIL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}