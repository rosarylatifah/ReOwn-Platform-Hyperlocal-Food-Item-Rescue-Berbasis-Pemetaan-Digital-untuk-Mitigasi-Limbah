"use client";

import React, { useState } from 'react';
import { X, MapPin, Plus, Minus, ShoppingCart } from 'lucide-react';

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  // State jumlah kuantitas produk yang ingin dibeli
  const [quantity, setQuantity] = useState(1);

  // Jika tidak ada data produk yang dipilih, jangan render apa-apa
  if (!product) return null;

  const handleIncrease = () => {
    if (quantity < (product.stock || 10)) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 1100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      {/* KOTAK UTAMA MODAL DETAIL PRODUK */}
      <div style={{
        backgroundColor: '#FFF',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '750px',
        padding: '30px',
        position: 'relative',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        display: 'grid',
        gridTemplateColumns: '1fr 1.1fr',
        gap: '24px',
        alignItems: 'center',
        fontFamily: 'Inter, sans-serif',
        animation: 'fadeInScale 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        
        {/* TOMBOL TUTUP (X) */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            backgroundColor: '#E5E7EB',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#4B5563',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D1D5DB'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'}
        >
          <X size={16} />
        </button>

        {/* KOLOM KIRI: GAMBAR PRODUK */}
        <div style={{
          width: '100%',
          height: '320px',
          backgroundColor: '#F9FAFB',
          border: '1px solid #E5E7EB',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6B7280',
          fontSize: '15px',
          fontWeight: '500',
          overflow: 'hidden'
        }}>
          {product.image ? (
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span>Gambar Produk</span>
          )}
        </div>

        {/* KOLOM KANAN: DETAIL INFORMASI PRODUK */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Nama Produk */}
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: 'bold', color: '#1A1A1A', margin: 0 }}>
            {product.name || 'Burger Daging'}
          </h2>

          {/* Deskripsi */}
          <p style={{ fontSize: '13px', color: '#555', margin: 0, lineHeight: '1.5' }}>
            {product.description || 'Makanan Burger dengan Daging Sapi isian keju, timun, dll'}
          </p>

          {/* Nama Toko */}
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A1A', marginTop: '2px' }}>
            {product.storeName || 'Nama Toko'}
          </span>

          {/* Lokasi Toko */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#666' }}>
            <MapPin size={14} color="#D95A36" />
            <span>{product.location || 'Batam Centre'}</span>
          </div>

          {/* Harga */}
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#D95A36', fontFamily: 'Fraunces, serif', marginTop: '4px' }}>
            {product.price || 'Rp. 20.200'}
          </div>

          {/* Stok Tersedia */}
          <div style={{ fontSize: '12px', fontStyle: 'italic', color: '#777' }}>
            Tersedia ({product.stock || 10})
          </div>

          {/* PENGATUR KUANTITAS (+ / -) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
            <button 
              onClick={handleDecrease}
              style={{
                width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #D1D5DB',
                backgroundColor: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFF'}
            >
              <Minus size={14} color="#374151" />
            </button>

            <span style={{ fontSize: '14px', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>
              {quantity}
            </span>

            <button 
              onClick={handleIncrease}
              style={{
                width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #D1D5DB',
                backgroundColor: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFF'}
            >
              <Plus size={14} color="#374151" />
            </button>
          </div>

          {/* TOMBOL TAMBAH KE KERANJANG */}
          <button 
            onClick={() => {
              onAddToCart({ ...product, quantity });
              onClose();
            }}
            style={{
              marginTop: '10px',
              width: '100%',
              padding: '12px',
              borderRadius: '14px',
              border: '1.5px solid #1A1A1A',
              backgroundColor: '#FFF',
              color: '#1A1A1A',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1A1A1A';
              e.currentTarget.style.color = '#FFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFF';
              e.currentTarget.style.color = '#1A1A1A';
            }}
          >
            <ShoppingCart size={16} />
            + Tambah ke Keranjang
          </button>

        </div>

      </div>
    </div>
  );
}