"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, MapPin, X, Minus, ShoppingCart } from 'lucide-react';

import bannerMakanan from '../assets/makanan.jpg'; 
import bannerBarang from '../assets/barang.jpg';

// --- KOMPONEN MODAL DETAIL PRODUK ---
function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

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
        fontFamily: 'Inter, sans-serif'
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
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: 'bold', color: '#1A1A1A', margin: 0 }}>
            {product.name}
          </h2>

          <p style={{ fontSize: '13px', color: '#555', margin: 0, lineHeight: '1.5' }}>
            {product.description || `${product.name} lezat dan berkualitas tinggi, cocok untuk penyelamatan porsi hari ini.`}
          </p>

          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A1A', marginTop: '2px' }}>
            {product.storeName || 'Toko ReOwn Batam'}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#666' }}>
            <MapPin size={14} color="#D95A36" />
            <span>{product.location}</span>
          </div>

          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#D95A36', fontFamily: 'Fraunces, serif', marginTop: '4px' }}>
            {product.price}
          </div>

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
                cursor: 'pointer'
              }}
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
                cursor: 'pointer'
              }}
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
              border: '1.5px solid #FFF',
              backgroundColor: '#1A1A1A',
              color: '#FFF',
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
              e.currentTarget.style.backgroundColor = '#D95A36';
              e.currentTarget.style.color = '#FFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1A1A1A';
              e.currentTarget.style.color = '#FFF';
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

// --- KOMPONEN UTAMA BUYER DASHBOARD ---
export default function BuyerDashboard({ setCurrentPage }) {
  const slides = [
    { id: 1, image: bannerMakanan, title: "Rescue Makanan Layak Konsumsi" },
    { id: 2, image: bannerBarang, title: "Rescue Barang & Produk Berkualitas" }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHoveredSlider, setIsHoveredSlider] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredPlusBtn, setHoveredPlusBtn] = useState(null);

  // 1. STATE UNTUK MENYIMPAN PRODUK YANG SEDANG DIKLIK / DILIHAT DETAILNYA
  const [selectedProduct, setSelectedProduct] = useState(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const products = [
    { id: 1, name: 'Burger Daging', price: 'Rp. 20.000', location: 'Jl. Ahmad Yani, Batam Centre', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80', stock: 8, storeName: 'Burger King Batam' },
    { id: 2, name: 'Kemeja Rajut Cream', price: 'Rp. 35.000', location: 'Nagoya, Batam', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=500&q=80', stock: 3, storeName: 'Thrift Nagoya Store' },
    { id: 3, name: 'Salad Buah Segar', price: 'Rp. 15.000', location: 'Batu Aji, Batam', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80', stock: 12, storeName: 'Healthy Salads' },
    { id: 4, name: 'Roti Manis Box', price: 'Rp. 12.000', location: 'Sei Panas, Batam', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80', stock: 5, storeName: 'Bakery Sei Panas' },
    { id: 5, name: 'Kotak Kayu Unik', price: 'Rp. 30.000', location: 'Bengkong, Batam', image: 'https://images.unsplash.com/photo-1532635241-17e820acc59f?auto=format&fit=crop&w=500&q=80', stock: 2, storeName: 'Craft Bengkong' },
  ];

  useEffect(() => {
    if (isHoveredSlider) return;
    const timer = setInterval(() => { nextSlide(); }, 4000);
    return () => clearInterval(timer);
  }, [currentSlide, isHoveredSlider]);

  return (
    <div style={{ 
      backgroundColor: '#FAF0EC', 
      minHeight: '100vh', 
      margin: 0, 
      paddingTop: '90px', 
      overflowX: 'hidden' 
    }}>
      
      {/* HERO SECTION SLIDER INTERAKTIF */}
      <div 
        onMouseEnter={() => setIsHoveredSlider(true)}
        onMouseLeave={() => setIsHoveredSlider(false)}
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '400px', 
          overflow: 'hidden',
          borderRadius: '16px',
          padding: '0 20px',
          cursor: 'pointer'
        }}
      >
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          height: '100%', 
          borderRadius: '16px', 
          overflow: 'hidden',
          boxShadow: isHoveredSlider ? '0 12px 30px rgba(217, 90, 54, 0.2)' : '0 4px 12px rgba(0,0,0,0.08)',
          transition: 'box-shadow 0.3s ease'
        }}>
          {slides.map((slide, index) => (
            <img 
              key={slide.id}
              src={slide.image} 
              alt={slide.title} 
              style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                opacity: currentSlide === index ? 1 : 0,
                transform: currentSlide === index 
                  ? (isHoveredSlider ? 'scale(1.05)' : 'scale(1)') 
                  : 'scale(1.1)',
                transition: 'opacity 0.6s ease-in-out, transform 0.5s ease-out'
              }}
            />
          ))}

          <button 
            onClick={prevSlide}
            style={{
              position: 'absolute',
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 10,
              opacity: isHoveredSlider ? 1 : 0.7,
              transition: 'all 0.25s ease'
            }}
          >
            <ChevronLeft size={24} color="#1A1A1A" />
          </button>

          <button 
            onClick={nextSlide}
            style={{
              position: 'absolute',
              top: '50%',
              right: '20px',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 10,
              opacity: isHoveredSlider ? 1 : 0.7,
              transition: 'all 0.25s ease'
            }}
          >
            <ChevronRight size={24} color="#1A1A1A" />
          </button>

          <div style={{ 
            position: 'absolute', 
            bottom: '20px', 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '8px',
            zIndex: 10
          }}>
            {slides.map((_, index) => (
              <div 
                key={index} 
                onClick={() => setCurrentSlide(index)}
                style={{
                  width: currentSlide === index ? '28px' : '9px',
                  height: '9px',
                  borderRadius: '5px',
                  backgroundColor: currentSlide === index ? '#D95A36' : 'rgba(255,255,255,0.8)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* KONTEN UTAMA */}
      <div style={{ padding: '30px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', color: '#1A1A1A', fontStyle: 'italic', margin: 0 }}>
            Promo "Last Chance"
          </h2>

          <button 
            onClick={() => setCurrentPage('produk')}
            style={{ 
              backgroundColor: '#1A1A1A', 
              color: '#FFF', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              fontSize: '12px', 
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#D95A36';
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(217, 90, 54, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1A1A1A';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            LIHAT SEMUA PRODUK
          </button>
          
        </div>

        {/* GRID PRODUK "LAST CHANCE" INTERAKTIF */}
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', paddingTop: '10px' }}>
          {products.map((item) => {
            const isCardHovered = hoveredCard === item.id;
            const isPlusHovered = hoveredPlusBtn === item.id;

            return (
              <div 
                key={item.id} 
                // 2. PAS KARTU PRODUK DIKLIK, POP-UP DETAIL PRODUK DI-OPEN!
                onClick={() => setSelectedProduct(item)}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ 
                  minWidth: '220px', 
                  backgroundColor: '#FFF', 
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  border: isCardHovered ? '1.5px solid #D95A36' : '1px solid rgba(0,0,0,0.06)',
                  boxShadow: isCardHovered ? '0 12px 28px rgba(217, 90, 54, 0.15)' : '0 4px 12px rgba(0,0,0,0.04)',
                  transform: isCardHovered ? 'translateY(-6px)' : 'translateY(0)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ width: '100%', height: '140px', overflow: 'hidden', backgroundColor: '#F9F9F9' }}>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      transform: isCardHovered ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 0.35s ease'
                    }} 
                  />
                </div>

                <div style={{ padding: '14px' }}>
                  <h4 style={{ 
                    margin: '0 0 6px 0', 
                    fontSize: '15px', 
                    color: isCardHovered ? '#D95A36' : '#1A1A1A', 
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '600'
                  }}>
                    {item.name}
                  </h4>
                  
                  <p style={{ margin: '0 0 12px 0', fontSize: '11px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} color="#D95A36" /> {item.location}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#D95A36' }}>
                      {item.price}
                    </span>
                    
                    {/* Tombol Plus (+) Cepat Beli tanpa Membuka Modal Detail */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Mencegah modal terbuka saat cuma ngeklik ikon +
                        alert(`Menambahkan ${item.name} ke Keranjang!`);
                      }}
                      onMouseEnter={() => setHoveredPlusBtn(item.id)}
                      onMouseLeave={() => setHoveredPlusBtn(null)}
                      style={{ 
                        backgroundColor: isPlusHovered ? '#D95A36' : '#1A1A1A', 
                        color: '#FFF', 
                        border: 'none', 
                        width: '30px', 
                        height: '30px', 
                        borderRadius: '8px', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        transform: isPlusHovered ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* 3. POP-UP MODAL DETAIL PRODUK AKAN MUNCUL OTOMATIS DI SINI SAAT KARTU DIKLIK */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={(prodWithQty) => {
            alert(`Berhasil menambahkan ${prodWithQty.quantity} ${prodWithQty.name} ke keranjang!`);
          }}
        />
      )}

    </div>
  );
}