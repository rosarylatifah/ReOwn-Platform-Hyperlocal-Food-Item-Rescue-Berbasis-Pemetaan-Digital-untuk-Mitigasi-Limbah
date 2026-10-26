"use client";

import React, { useState } from 'react';
import { Plus, MapPin, AlertCircle, Store } from 'lucide-react';
import StorePopover from '../profil/StorePopover';

export default function ProductGrid({ 
  products, 
  activeStorePopover, 
  setActiveStorePopover, 
  onAddToCart, 
  onSelectDetail, 
  onReport 
}) {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredPlusBtn, setHoveredPlusBtn] = useState(null);
  const [hoveredDetailBtn, setHoveredDetailBtn] = useState(null);
  const [hoveredReportBtn, setHoveredReportBtn] = useState(null);

  if (products.length === 0) {
    return (
      <div style={{ 
        backgroundColor: '#FFF', 
        borderRadius: '20px', 
        padding: '60px 20px', 
        textAlign: 'center', 
        border: '2px dashed #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          backgroundColor: '#FFF3ED', color: '#D95A36',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '12px'
        }}>
          <Store size={24} />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 6px 0', color: '#1A1A1A' }}>Belum Ada Produk</h3>
        <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Belum ada produk yang diposting oleh penjual.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '22px' }}>
      {products.map((item) => {
        const isCardHovered = hoveredCard === item.id;
        const isPlusHovered = hoveredPlusBtn === item.id;
        const isDetailHovered = hoveredDetailBtn === item.id;
        const isReportHovered = hoveredReportBtn === item.id;
        const storeName = item.sellerName || item.store || 'Toko Penjual';

        return (
          <div 
            key={item.id} 
            onMouseEnter={() => setHoveredCard(item.id)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ 
              backgroundColor: '#FFF', 
              borderRadius: '16px', 
              border: isCardHovered ? '1.5px solid #D95A36' : '1px solid rgba(0,0,0,0.05)',
              boxShadow: isCardHovered ? '0 14px 32px rgba(217, 90, 54, 0.18)' : '0 4px 12px rgba(0,0,0,0.04)',
              transform: isCardHovered ? 'translateY(-6px)' : 'translateY(0)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              zIndex: activeStorePopover === item.id ? 30 : 1 
            }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); onReport(item); }}
              onMouseEnter={() => setHoveredReportBtn(item.id)}
              onMouseLeave={() => setHoveredReportBtn(null)}
              title="Laporkan produk"
              style={{
                position: 'absolute', top: '10px', right: '10px',
                backgroundColor: isReportHovered ? '#DC2626' : 'rgba(255, 255, 255, 0.9)',
                color: isReportHovered ? '#FFF' : '#666',
                border: 'none', borderRadius: '50%', width: '28px', height: '28px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', zIndex: 2, boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                transform: isReportHovered ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.2s ease'
              }}
            >
              <AlertCircle size={16} />
            </button>

            <div style={{ position: 'relative', height: '150px', overflow: 'hidden', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', backgroundColor: '#F9F9F9' }}>
              <img 
                src={item.image} 
                alt={item.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: isCardHovered ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.4s ease' }} 
              />
              <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#FFF', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                {item.distance || '1.2 km'}
              </span>
            </div>

            <div style={{ padding: '16px' }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: isCardHovered ? '#D95A36' : '#1A1A1A' }}>
                {item.name}
              </h4>

              <div style={{ position: 'relative', marginBottom: '8px', display: 'inline-block' }}>
                <span 
                  onClick={(e) => { e.stopPropagation(); setActiveStorePopover(activeStorePopover === item.id ? null : item.id); }}
                  style={{ fontSize: '12px', color: '#D95A36', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {storeName}
                </span>

                {activeStorePopover === item.id && (
                  <StorePopover 
                    store={{ name: storeName, location: item.location || 'Batam Centre', totalProducts: 5, logo: item.image }}
                    onClose={() => setActiveStorePopover(null)}
                    positionStyle={{ top: '24px', left: '0px' }}
                  />
                )}
              </div>

              <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} color="#D95A36" /> {item.location || 'Batam'}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#D95A36' }}>{item.price}</span>

                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
                    onMouseEnter={() => setHoveredPlusBtn(item.id)}
                    onMouseLeave={() => setHoveredPlusBtn(null)}
                    style={{ backgroundColor: isPlusHovered ? '#D95A36' : '#1A1A1A', color: '#FFF', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Plus size={16} />
                  </button>

                  <button 
                    onClick={(e) => { e.stopPropagation(); onSelectDetail(item); }}
                    onMouseEnter={() => setHoveredDetailBtn(item.id)}
                    onMouseLeave={() => setHoveredDetailBtn(null)}
                    style={{ backgroundColor: isDetailHovered ? '#D95A36' : '#1A1A1A', color: '#FFF', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                  >
                    LIHAT DETAIL
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}