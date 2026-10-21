"use client";

import React, { useState } from 'react';
import { Plus, MapPin, X, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/app/pembeli/context/cart';

export default function ProductDetail({ product, onClose, onAddToCart }) {
  if (!product) return null;

  const { getItemQuantityInCart, getProductStock, addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // 1. Ambil stok riil toko dari CartContext (sudah terpotong jika ada order yang dikirim/checkout)
  const totalStock = getProductStock ? getProductStock(product) : (product.stock || 5);

  // 2. Ambil berapa porsi produk ini yang saat ini ada di keranjang belanja
  const quantityInCart = getItemQuantityInCart(product.id);
  
  // 3. Batas maksimal yang bisa ditambah ke keranjang saat ini
  const availableStock = totalStock - quantityInCart;

  const handleIncrease = () => {
    if (quantity < availableStock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (availableStock <= 0) {
      alert("Stok produk ini di keranjang kamu sudah mencapai batas maksimal!");
      return;
    }

    // Jika ada callback kustom dari props
    if (onAddToCart) {
      onAddToCart({ ...product, quantity });
    } else {
      // Menggunakan fungsi standar dari context
      addToCart(product, quantity);
    }

    if (onClose) onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)',
      zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', boxSizing: 'border-box'
    }}>
      {/* STYLE KHUSUS EFEK HOVER & OUTLINE */}
      <style jsx>{`
        .btn-qty:hover:not(:disabled) {
          background-color: #F3F4F6 !important;
          border-color: #D95A36 !important;
          color: #D95A36 !important;
        }
        .btn-qty:active:not(:disabled) {
          transform: scale(0.95);
        }

        .btn-cart:hover:not(:disabled) {
          background-color: #333333 !important;
          border-color: #D95A36 !important;
          box-shadow: 0 6px 16px rgba(217, 90, 54, 0.25) !important;
        }
        .btn-cart:active:not(:disabled) {
          transform: scale(0.98);
        }

        .btn-close:hover {
          background-color: #D1D5DB !important;
          color: #1A1A1A !important;
        }
      `}</style>

      <div style={{
        backgroundColor: '#FFF', borderRadius: '24px', width: '100%', maxWidth: '750px',
        padding: '30px', position: 'relative', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '24px', alignItems: 'center',
        fontFamily: 'Inter, sans-serif'
      }}>
        {/* TOMBOL TUTUP (X) */}
        <button
          onClick={onClose}
          className="btn-close"
          style={{
            position: 'absolute', top: '20px', right: '20px', backgroundColor: '#E5E7EB',
            border: 'none', borderRadius: '50%', width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4B5563',
            transition: 'all 0.2s ease'
          }}
        >
          <X size={16} />
        </button>

        {/* KOLOM KIRI: GAMBAR PRODUK */}
        <div style={{
          width: '100%', height: '320px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB',
          borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
        }}>
          {product.image ? (
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span>Gambar Produk</span>
          )}
        </div>

        {/* KOLOM KANAN: DETAIL INFORMASI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: 'bold', color: '#1A1A1A', margin: 0 }}>
            {product.name}
          </h2>

          <p style={{ fontSize: '13px', color: '#555', margin: 0, lineHeight: '1.5' }}>
            {product.description || `${product.name} berkualitas segar dan siap diselamatkan di toko ini.`}
          </p>

          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A1A', marginTop: '2px' }}>
            {product.store || product.merchant || 'Nama Toko'}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#666' }}>
            <MapPin size={14} color="#D95A36" />
            <span>{product.location || "Batam"}</span>
          </div>

          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#D95A36', fontFamily: 'Fraunces, serif', marginTop: '4px' }}>
            {product.price}
          </div>

          {/* INFORMASI STOK KONSISTEN & STANDAR PROFESIONAL */}
          <div style={{ fontSize: '12px', fontWeight: '600', color: availableStock > 0 ? '#16A34A' : '#DC2626' }}>
            {availableStock > 0 
              ? `Sisa Stok Toko: ${totalStock} porsi` 
              : 'Stok Toko Habis / Sudah di Keranjang!'} 
            {quantityInCart > 0 && ` (${quantityInCart} porsi di keranjang)`}
          </div>

          {/* KUANTITAS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
            <button 
              onClick={handleDecrease} 
              disabled={quantity <= 1 || availableStock <= 0}
              className="btn-qty"
              style={{
                width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #D1D5DB',
                backgroundColor: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: quantity <= 1 || availableStock <= 0 ? 'not-allowed' : 'pointer',
                opacity: quantity <= 1 || availableStock <= 0 ? 0.5 : 1, transition: 'all 0.2s ease'
              }}
            >
              <Minus size={14} color="#374151" />
            </button>

            <span style={{ fontSize: '14px', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>
              {availableStock > 0 ? quantity : 0}
            </span>

            <button 
              onClick={handleIncrease} 
              disabled={quantity >= availableStock || availableStock <= 0}
              className="btn-qty"
              style={{
                width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #D1D5DB',
                backgroundColor: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: quantity >= availableStock || availableStock <= 0 ? 'not-allowed' : 'pointer',
                opacity: quantity >= availableStock || availableStock <= 0 ? 0.5 : 1, transition: 'all 0.2s ease'
              }}
            >
              <Plus size={14} color="#374151" />
            </button>
          </div>

          {/* TOMBOL TAMBAH KE KERANJANG */}
          <button 
            onClick={handleAddToCart}
            disabled={availableStock <= 0}
            className="btn-cart"
            style={{
              marginTop: '10px', width: '100%', padding: '12px', borderRadius: '14px',
              border: '1.5px solid transparent',
              backgroundColor: availableStock <= 0 ? '#9CA3AF' : '#1A1A1A',
              color: '#FFF', fontSize: '13px', fontWeight: '600',
              cursor: availableStock <= 0 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <ShoppingCart size={16} />
            {availableStock <= 0 ? 'Stok Tidak Mencukupi' : '+ Tambah ke Keranjang'}
          </button>
        </div>
      </div>
    </div>
  );
}