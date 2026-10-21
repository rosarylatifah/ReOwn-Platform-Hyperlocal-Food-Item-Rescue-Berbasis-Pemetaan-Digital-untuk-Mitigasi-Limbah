"use client";

import React from 'react';
import { X, MessageCircle, Clock, Package, MapPin } from 'lucide-react';

export default function CartDetail({ order, onClose }) {
  if (!order) return null;

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
    >
      {/* STYLE EFEK HOVER & INTERAKTIF */}
      <style jsx>{`
        .btn-action:hover {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
        .btn-action:active {
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
          borderRadius: '20px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          position: 'relative',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        {/* Tombol Close '✕' */}
        <button 
          onClick={onClose}
          className="btn-close"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            border: 'none',
            backgroundColor: '#F3F4F6',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#666',
            transition: 'all 0.2s ease'
          }}
        >
          <X size={18} />
        </button>

        <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', color: '#1A1A1A', marginTop: 0, marginBottom: '20px' }}>
          Detail Item: {order.name}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
          
          {/* SISI KIRI: Informasi Toko, Alamat, Kuantitas, & Expired */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Nama Penjual */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#555', display: 'block', marginBottom: '4px' }}>
                Nama Penjual / Toko:
              </label>
              <div style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', fontSize: '13px', color: '#1A1A1A', fontWeight: '500', boxSizing: 'border-box' }}>
                {order.store || order.sellerName || 'Toko Rescue Batam'}
              </div>
            </div>

            {/* Alamat Penjual */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#555', display: 'block', marginBottom: '4px' }}>
                Alamat / Lokasi Toko:
              </label>
              <div style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', fontSize: '12px', color: '#555', lineHeight: '1.4', boxSizing: 'border-box', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <MapPin size={14} color="#D95A36" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{order.location || order.sellerAddress || 'Jl. Ahmad Yani, Batam Center, Batam'}</span>
              </div>
            </div>

            {/* Kuantitas & Batas Waktu / Expired */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#555', display: 'block', marginBottom: '4px' }}>
                  Jumlah Rescue:
                </label>
                <div style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', fontSize: '13px', fontWeight: 'bold', color: '#1A1A1A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Package size={14} color="#D95A36" /> {order.quantity || 1} Porsi
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#555', display: 'block', marginBottom: '4px' }}>
                  Batas Ambil / Exp:
                </label>
                <div style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', fontSize: '12px', fontWeight: 'bold', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} /> {order.expiryTime || 'Hari ini, 21:00'}
                </div>
              </div>
            </div>

            {/* Total Pembayaran */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#555', display: 'block', marginBottom: '4px' }}>
                Total Harga:
              </label>
              <div style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #FFDBCC', backgroundColor: '#FFF3ED', fontSize: '14px', fontWeight: 'bold', color: '#D95A36', boxSizing: 'border-box' }}>
                {order.price || order.totalPrice}
              </div>
            </div>

          </div>

          {/* SISI KANAN: Gambar, Deskripsi, & Tombol Hubungi Penjual */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Gambar Produk */}
            <div style={{
              width: '100%',
              height: '140px',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              overflow: 'hidden',
              backgroundColor: '#F9FAFB'
            }}>
              <img 
                src={order.image} 
                alt={order.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#555', display: 'block', marginBottom: '4px' }}>
                Deskripsi Produk:
              </label>
              <div style={{
                width: '100%',
                minHeight: '95px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#F9FAFB',
                fontSize: '12px',
                color: '#555',
                lineHeight: '1.4',
                boxSizing: 'border-box'
              }}>
                {order.description || `${order.name} adalah produk makanan berlebih berkualitas tinggi yang siap diselamatkan dari toko ${order.store || 'merchant'}.`}
              </div>
            </div>

            {/* Tombol Hubungi Penjual */}
            <button 
              onClick={() => alert(`Menghubungi penjual ${order.store || order.sellerName || 'Toko'} terkait produk ${order.name}`)}
              className="btn-action"
              style={{
                marginTop: '10px',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #D1D5DB',
                backgroundColor: '#FFF',
                color: '#333',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease'
              }}
            >
              <MessageCircle size={16} color="#D95A36" /> Hubungi Penjual
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}