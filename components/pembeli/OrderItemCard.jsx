"use client";

import React, { useState } from 'react';
import { Eye, Clock, CheckCircle2, PackageCheck, AlertCircle, Ban } from 'lucide-react';
import { useOrderCompletion } from '@/app/pembeli/hooks/useOrderCompletion';

export default function OrderItemCard({ item, onSelectOrder, onReportOrder }) {
  const { handleConfirmCompletion } = useOrderCompletion();
  const [hoveredBtn, setHoveredBtn] = useState(null);

  if (!item) return null;

  const isProcess = item.status === 'Dalam Proses';
  const isWaiting = item.status === 'Menunggu Konfirmasi' || !item.status;
  const isCompleted = item.status === 'Selesai' || item.statusType === 'completed';
  const isCancelled = item.status === 'Dibatalkan' || item.statusType === 'cancelled';

  const isReportHovered = hoveredBtn === `report-${item.id}`;

  // Helper Badge Status dengan warna & ikon spesifik
  const renderStatusBadge = () => {
    if (isCompleted) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#DCFCE7',
          color: '#15803D',
          border: '1px solid #BBF7D0',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          whiteSpace: 'nowrap'
        }}>
          <PackageCheck size={14} color="#15803D" /> Selesai
        </span>
      );
    }

    if (isCancelled) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#FEE2E2',
          color: '#B91C1C',
          border: '1px solid #FCA5A5',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          whiteSpace: 'nowrap'
        }}>
          <Ban size={14} color="#B91C1C" /> Dibatalkan
        </span>
      );
    }

    if (isProcess) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#FFF3ED',
          color: '#D95A36',
          border: '1px solid #FFDBCC',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          whiteSpace: 'nowrap'
        }}>
          <Clock size={14} color="#D95A36" /> Dalam Proses
        </span>
      );
    }

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: '#F1F5F9',
        color: '#475569',
        border: '1px solid #CBD5E1',
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        whiteSpace: 'nowrap'
      }}>
        <Clock size={14} color="#475569" /> Menunggu Konfirmasi
      </span>
    );
  };

  return (
    <div style={{
      backgroundColor: '#FFF',
      borderRadius: '16px',
      padding: '24px',
      display: 'flex',
      alignItems: 'center',
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      minHeight: '120px',
      boxSizing: 'border-box'
    }}>
      
      {/* TOMBOL REPORT */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onReportOrder && onReportOrder(item);
        }}
        onMouseEnter={() => setHoveredBtn(`report-${item.id}`)}
        onMouseLeave={() => setHoveredBtn(null)}
        title="Laporkan produk/gambar bermasalah"
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: isReportHovered ? '#DC2626' : '#F5F5F5',
          color: isReportHovered ? '#FFF' : '#666',
          border: 'none',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 5,
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          transform: isReportHovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'all 0.2s ease',
          padding: 0,
          margin: 0,
          outline: 'none'
        }}
      >
        <AlertCircle size={16} color={isReportHovered ? '#FFF' : '#666'} />
      </button>

      {/* SISI KIRI: GAMBAR + DETAIL PRODUK */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div style={{
          width: '95px',
          height: '95px',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: '#F9F9F9',
          flexShrink: 0
        }}>
          <img 
            src={item.image || item.img} 
            alt={item.productName || item.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#D95A36', textTransform: 'uppercase' }}>
            {item.id}
          </span>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1A1A1A' }}>
            {item.productName || item.name}
          </h3>
          <span style={{ fontSize: '13px', color: '#666' }}>
            Toko: <strong>{item.storeName || item.store || "Toko Rescue Batam"}</strong>
          </span>
          <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#D95A36' }}>
            {item.totalPrice || item.price}
          </span>

          {/* TOMBOL LIHAT DETAIL */}
          <div style={{ marginTop: '6px' }}>
            <button
              type="button"
              onClick={() => onSelectOrder && onSelectOrder(item)}
              onMouseEnter={() => setHoveredBtn('detail')}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                backgroundColor: hoveredBtn === 'detail' ? '#D95A36' : '#F3F4F6',
                color: hoveredBtn === 'detail' ? '#FFF' : '#374151',
                border: 'none',
                outline: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                transform: hoveredBtn === 'detail' ? 'translateY(-1px)' : 'translateY(0)'
              }}
            >
              <Eye size={14} /> LIHAT DETAIL
            </button>
          </div>
        </div>
      </div>

      {/* SISI KANAN: BADGE STATUS + TOMBOL DITERIMA */}
      <div style={{ 
        marginLeft: 'auto',
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        paddingTop: '10px'
      }}>
        
        {/* RENDER BADGE STATUS DINAMIS */}
        {renderStatusBadge()}

        {/* TOMBOL PESANAN DITERIMA */}
        {isProcess && (
          <button
            type="button"
            onClick={() => handleConfirmCompletion(item.id, item.productName || item.name)}
            onMouseEnter={() => setHoveredBtn('confirm')}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              backgroundColor: hoveredBtn === 'confirm' ? '#15803D' : '#16A34A',
              color: '#FFF',
              border: 'none',
              outline: 'none',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              boxShadow: hoveredBtn === 'confirm' ? '0 6px 16px rgba(22, 163, 74, 0.35)' : '0 4px 12px rgba(22, 163, 74, 0.25)',
              transition: 'all 0.2s ease',
              transform: hoveredBtn === 'confirm' ? 'translateY(-1px)' : 'translateY(0)'
            }}
          >
            <CheckCircle2 size={14} /> Pesanan Diterima
          </button>
        )}

      </div>
    </div>
  );
}