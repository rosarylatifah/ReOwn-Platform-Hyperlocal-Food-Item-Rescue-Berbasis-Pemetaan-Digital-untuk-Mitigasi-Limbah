"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Import data slides dan products khusus dari dashboardData.js
import { slides, products } from '@/lib/pembeli/dashboardData';

// Import context keranjang
import { useCart } from '@/app/pembeli/context/cart';

// Import komponen reusable
import ProductCard from '@/components/pembeli/ProductCard';
import ProductDetail from '@/components/pembeli/ProductDetail';
import ReportModal from '@/components/pembeli/ReportModal';

export default function BuyerDashboard() {
  const { addToCart } = useCart();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHoveredSlider, setIsHoveredSlider] = useState(false);
  
  // State untuk Popover Toko & Modal
  const [activeStorePopover, setActiveStorePopover] = useState(null);
  const [isSeeAllHovered, setIsSeeAllHovered] = useState(false);
  const [isExploreHovered, setIsExploreHovered] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reportingProduct, setReportingProduct] = useState(null);

  const promoProducts = products || [];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (isHoveredSlider) return;
    const timer = setInterval(() => { nextSlide(); }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide, isHoveredSlider]);

  const activeSlideData = slides[currentSlide] || {};

  return (
    <div style={{ backgroundColor: '#FAF0EC', minHeight: '100vh', margin: 0, paddingTop: '110px', paddingBottom: '60px', overflowX: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HERO SECTION SLIDER */}
      <div 
        onMouseEnter={() => setIsHoveredSlider(true)}
        onMouseLeave={() => setIsHoveredSlider(false)}
        style={{ position: 'relative', width: '100%', padding: '0 40px', boxSizing: 'border-box' }}
      >
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          height: '380px', 
          borderRadius: '24px', 
          overflow: 'hidden', 
          boxShadow: isHoveredSlider ? '0 12px 32px rgba(217, 90, 54, 0.22)' : '0 4px 16px rgba(0,0,0,0.06)', 
          transition: 'all 0.3s ease',
          backgroundColor: '#FFF',
          display: 'flex'
        }}>

          {/* SISI KIRI: BANNER */}
          <div style={{ position: 'relative', width: '55%', height: '100%', overflow: 'hidden' }}>
            {slides.map((slide, index) => (
              <img 
                key={slide.id}
                src={slide.image?.src || slide.image} 
                alt={slide.title || 'Slide Banner'} 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  opacity: currentSlide === index ? 1 : 0,
                  transform: currentSlide === index ? (isHoveredSlider ? 'scale(1.04)' : 'scale(1)') : 'scale(1.08)',
                  transition: 'opacity 0.7s ease-in-out, transform 0.6s ease-out'
                }}
              />
            ))}

            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '40%',
              height: '100%',
              background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 70%, #FFFFFF 100%)',
              pointerEvents: 'none'
            }} />
          </div>

          {/* SISI KANAN: TEKS */}
          <div style={{ 
            width: '45%', 
            height: '100%', 
            backgroundColor: '#FFF', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            padding: '0 45px 0 20px', 
            boxSizing: 'border-box',
            zIndex: 2 
          }}>
            <span style={{ 
              backgroundColor: '#FFF3ED', 
              color: '#D95A36', 
              fontSize: '11px', 
              fontWeight: 'bold', 
              padding: '6px 14px', 
              borderRadius: '20px', 
              alignSelf: 'flex-start',
              marginBottom: '12px',
              border: '1px solid rgba(217, 90, 54, 0.2)'
            }}>
              {activeSlideData.category || 'ReOwn Special'}
            </span>

            <h1 style={{ 
              fontFamily: 'Fraunces, serif', 
              fontSize: '28px', 
              fontWeight: '700', 
              color: '#1A1A1A', 
              margin: '0 0 10px 0',
              lineHeight: '1.25'
            }}>
              {activeSlideData.title || activeSlideData.heading || "Rescue Makanan & Produk Berkualitas"}
            </h1>

            <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6', margin: '0 0 20px 0' }}>
              {activeSlideData.description || activeSlideData.subtitle || "Dapatkan penawaran terbaik untuk produk layak pakai dan makanan lezat sebelum habis!"}
            </p>

            <Link 
              href="/pembeli/produk"
              onMouseEnter={() => setIsExploreHovered(true)}
              onMouseLeave={() => setIsExploreHovered(false)}
              style={{
                textDecoration: 'none',
                backgroundColor: isExploreHovered ? '#C54E2D' : '#D95A36',
                color: '#FFF',
                padding: '11px 24px',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '12px',
                alignSelf: 'flex-start',
                boxShadow: isExploreHovered ? '0 8px 20px rgba(217, 90, 54, 0.45)' : '0 4px 12px rgba(217, 90, 54, 0.3)',
                transform: isExploreHovered ? 'translateY(-2px) scale(1.04)' : 'translateY(0) scale(1)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              JELAJAHI SEKARANG <ChevronRight size={16} />
            </Link>
          </div>

          <button onClick={prevSlide} style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
            <ChevronLeft size={20} color="#1A1A1A" />
          </button>

          <button onClick={nextSlide} style={{ position: 'absolute', top: '50%', right: '16px', transform: 'translateY(-50%)', backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
            <ChevronRight size={20} color="#1A1A1A" />
          </button>

          <div style={{ position: 'absolute', bottom: '15px', right: '45px', display: 'flex', gap: '6px', zIndex: 10 }}>
            {slides.map((_, idx) => (
              <div 
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: currentSlide === idx ? '20px' : '6px',
                  height: '6px',
                  borderRadius: '10px',
                  backgroundColor: currentSlide === idx ? '#D95A36' : '#E0E0E0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* KONTEN UTAMA PROMO */}
      <div style={{ padding: '35px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '26px', color: '#1A1A1A', fontWeight: '600', margin: '0 0 4px 0' }}>
              Promo "Last Chance" 🔥
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              Penyelamatan makanan terlaris dengan batas waktu promo paling mendesak!
            </p>
          </div>

          <Link 
            href="/pembeli/produk"
            onMouseEnter={() => setIsSeeAllHovered(true)}
            onMouseLeave={() => setIsSeeAllHovered(false)}
            style={{ 
              textDecoration: 'none',
              backgroundColor: isSeeAllHovered ? '#C54E2D' : '#D95A36', 
              color: '#FFF', 
              padding: '11px 22px', 
              borderRadius: '25px', 
              fontWeight: 'bold', 
              fontSize: '12px', 
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: isSeeAllHovered ? '0 8px 20px rgba(217, 90, 54, 0.4)' : '0 4px 10px rgba(0,0,0,0.1)',
              transform: isSeeAllHovered ? 'translateY(-2px) scale(1.03)' : 'translateY(0) scale(1)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            LIHAT SEMUA PRODUK <ChevronRight size={16} />
          </Link>
        </div>

        {/* GRID PRODUK PROMO MENGGUNAKAN ProductCard REUSABLE */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '20px', 
          paddingBottom: '20px', 
          paddingTop: '10px' 
        }}>
          {promoProducts.map((item) => (
            <ProductCard 
              key={item.id}
              item={item}
              isPromo={true} // 👈 Nampilin Badge Promo
              activeStorePopover={activeStorePopover}
              setActiveStorePopover={setActiveStorePopover}
              onAddToCart={(prod) => {
                addToCart(prod, 1);
                alert(`Berhasil menambahkan ${prod.name} ke Keranjang!`);
              }}
              onSelectProduct={(prod) => setSelectedProduct(prod)}
              onReportProduct={(prod) => setReportingProduct(prod)}
            />
          ))}
        </div>
      </div>

      {/* MODAL DETAIL PRODUK */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={(prodWithQty) => {
            addToCart(prodWithQty, prodWithQty.quantity || 1);
            alert(`Berhasil menambahkan ${prodWithQty.quantity || 1}x ${prodWithQty.name} ke keranjang!`);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* MODAL LAPORKAN PRODUK */}
      {reportingProduct && (
        <ReportModal 
          product={reportingProduct} 
          onClose={() => setReportingProduct(null)} 
        />
      )}
    </div>
  );
}