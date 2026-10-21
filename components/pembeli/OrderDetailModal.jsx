"use client";

import React from 'react';
import { X, MessageCircle, Ban, MapPin, Calendar, Clock, ShoppingBag } from 'lucide-react';
import { useOrderDetail } from '@/app/pembeli/hooks/useOrderDetail';

export default function OrderDetailModal({ order, onClose, onCancelOrder }) {
  const details = useOrderDetail(order, onClose, onCancelOrder);
  
  if (!order || !details) return null;

  const {
    currentStatus,
    isCancelable,
    buyerName,
    sellerName,
    sellerAddress,
    productName,
    orderDate,
    confirmDate,
    totalPrice,
    deliveryOption,
    productImage,
    description,
    handleContactSeller,
    handleCancel
  } = details;

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '20px',
        boxSizing: 'border-box'
      }}
    >
      <style jsx>{`
        .btn-chat {
          border: 1.5px solid #D95A36 !important;
          background-color: #FFF !important;
          color: #D95A36 !important;
        }
        .btn-chat:hover {
          background-color: #D95A36 !important;
          color: #FFF !important;
          box-shadow: 0 4px 14px rgba(217, 90, 54, 0.25) !important;
          transform: translateY(-1px);
        }
        .btn-chat:active {
          transform: scale(0.98);
        }

        .btn-cancel:hover {
          background-color: #FEE2E2 !important;
          border-color: #DC2626 !important;
          color: #B91C1C !important;
          transform: translateY(-1px);
        }
        .btn-cancel:active {
          transform: scale(0.98);
        }

        .btn-close:hover {
          background-color: #E5E7EB !important;
          color: #1A1A1A !important;
        }
      `}</style>

      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '700px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
          position: 'relative',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        {/* Header Title & Close Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #F0F0F0', paddingBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#D95A36', textTransform: 'uppercase' }}>
              ID: {order.id || 'REQ-000'}
            </span>
            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '21px', color: '#1A1A1A', margin: '2px 0 0 0', fontWeight: 'bold' }}>
              Rincian Detail Pesanan
            </h3>
          </div>

          <button 
            onClick={onClose}
            className="btn-close"
            style={{
              border: 'none',
              backgroundColor: '#F3F4F6',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#555',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* MAIN GRID: 2 KOLOM RAPI & SEJAJAR */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'stretch' }}>
          
          {/* SISI KIRI: Detail Info Utama */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#666', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                Nama Pembeli
              </label>
              <div style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #E5E7EB', backgroundColor: '#FAFAFA', fontSize: '13px', color: '#1A1A1A', boxSizing: 'border-box' }}>
                {buyerName}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#666', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                Nama Penjual / Toko
              </label>
              <div style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #E5E7EB', backgroundColor: '#FAFAFA', fontSize: '13px', color: '#1A1A1A', fontWeight: '600', boxSizing: 'border-box' }}>
                {sellerName}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#666', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                Alamat Penjual
              </label>
              <div style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #E5E7EB', backgroundColor: '#FAFAFA', fontSize: '12px', color: '#555', lineHeight: '1.4', boxSizing: 'border-box', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <MapPin size={14} color="#D95A36" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{sellerAddress}</span>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#666', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                Tanggal Pemesanan
              </label>
              <div style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #E5E7EB', backgroundColor: '#FAFAFA', fontSize: '12px', color: '#1A1A1A', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} color="#666" />
                <span>{orderDate}</span>
              </div>
            </div>

            {/* Tanggal Konfirmasi Penjual (HANYA MUNCUL DI STATUS DALAM PROSES) */}
            {(order.confirmDate || currentStatus === 'Dalam Proses') && (
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#D95A36', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                  Tanggal Konfirmasi Penjual
                </label>
                <div style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #FFDBCC', backgroundColor: '#FFF3ED', fontSize: '12px', color: '#D95A36', fontWeight: '600', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} color="#D95A36" />
                  <span>{confirmDate}</span>
                </div>
              </div>
            )}

            <div style={{ marginTop: 'auto' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#666', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                Total Pembayaran
              </label>
              <div style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #FFDBCC', backgroundColor: '#FFF3ED', fontSize: '15px', fontWeight: 'bold', color: '#D95A36', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShoppingBag size={16} color="#D95A36" />
                <span>{totalPrice}</span>
              </div>
            </div>
          </div>

          {/* SISI KANAN: Gambar Utuh, Deskripsi, Pengantaran & Aksi */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'space-between' }}>
            
            {/* Gambar Produk Utuh */}
            <div style={{
              width: '100%',
              height: '140px',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              overflow: 'hidden',
              backgroundColor: '#F9FAFB',
              flexShrink: 0
            }}>
              <img 
                src={productImage} 
                alt={productName} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Deskripsi Produk */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#666', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                Deskripsi Produk
              </label>
              <div style={{
                width: '100%',
                flex: 1,
                minHeight: '70px',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FAFAFA',
                fontSize: '12px',
                color: '#555',
                lineHeight: '1.45',
                boxSizing: 'border-box'
              }}>
                {description}
              </div>
            </div>

            {/* Opsi Pengantaran */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#666', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                Opsi Pengantaran
              </label>
              <div style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #E5E7EB', backgroundColor: '#FAFAFA', fontSize: '12px', color: '#1A1A1A', fontWeight: '600', boxSizing: 'border-box' }}>
                {deliveryOption}
              </div>
            </div>

            {/* AREA TOMBOL AKSI */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
              
              <button 
                onClick={handleContactSeller}
                className="btn-chat"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <MessageCircle size={16} /> Hubungi Penjual
              </button>

              {/* HANYA MUNCUL JIKA STATUS 'Menunggu Konfirmasi' */}
              {isCancelable && (
                <button 
                  onClick={handleCancel}
                  className="btn-cancel"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #FCA5A5',
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Ban size={16} /> Batalkan Pesanan
                </button>
              )}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}