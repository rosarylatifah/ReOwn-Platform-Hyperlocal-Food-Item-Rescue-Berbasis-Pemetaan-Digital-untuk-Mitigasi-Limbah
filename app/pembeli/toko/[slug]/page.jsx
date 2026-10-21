"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Phone, Package, ArrowLeft, Store } from 'lucide-react';

// Import data produk untuk mensimulasikan daftar produk milik toko ini
import { products } from '@/lib/pembeli/productsData';

// Import context keranjang
import { useCart } from '@/app/pembeli/context/cart';

// Import komponen reusable
import ProductCard from '@/components/pembeli/ProductCard';
import ProductDetail from '@/components/pembeli/ProductDetail';
import ReportModal from '@/components/pembeli/ReportModal';

export default function StoreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  // Ambil slug dari URL (misal: "REOWN%20MERCHANT" -> "REOWN MERCHANT")
  const rawSlug = params?.slug ? decodeURIComponent(params.slug) : "REOWN MERCHANT";

  // Dummy / Data detail toko berdasarkan slug
  const storeInfo = {
    name: rawSlug,
    bannerUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    logoUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80",
    address: "Jl. Ahmad Yani, Batam Centre, Kota Batam",
    phone: "0812-3456-7890",
    description: "Menyediakan aneka produk makanan rescue berkualitas tinggi dan masih layak konsumsi dengan harga sangat terjangkau."
  };

  // Filter produk yang dimiliki oleh toko ini
  const storeProducts = products.filter(item => {
    const itemStore = (item.store || item.merchant || "").toLowerCase();
    return itemStore.includes(rawSlug.toLowerCase()) || rawSlug.toLowerCase().includes("toko") || true; 
    // Fallback `true` disiapkan agar semua produk tetap tampil untuk demo UI jika data mock terbatas
  });

  // State
  const [activeStorePopover, setActiveStorePopover] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reportingProduct, setReportingProduct] = useState(null);
  const [isBackHovered, setIsBackHovered] = useState(false);

  return (
    <div style={{ backgroundColor: '#FAF0EC', minHeight: '100vh', margin: 0, paddingTop: '90px', paddingBottom: '60px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* TOMBOL KEMBALI */}
      <div style={{ padding: '0 40px', marginBottom: '16px' }}>
        <button
          onClick={() => router.back()}
          onMouseEnter={() => setIsBackHovered(true)}
          onMouseLeave={() => setIsBackHovered(false)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: isBackHovered ? '#D95A36' : '#FFF',
            color: isBackHovered ? '#FFF' : '#1A1A1A',
            border: '1px solid rgba(0,0,0,0.1)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            transform: isBackHovered ? 'translateX(-3px)' : 'translateX(0)',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={16} /> Kembali
        </button>
      </div>

      {/* CONTAINER UTAMA CARD TOKO */}
      <div style={{ padding: '0 40px', marginBottom: '35px' }}>
        <div style={{
          backgroundColor: '#FFF',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          
          {/* 1. BANNER TOKO (Sesuai area abu-abu di wireframe) */}
          <div style={{
            height: '200px',
            width: '100%',
            backgroundColor: '#D1D5DB', // Warna fallback abu-abu seperti di wireframe
            backgroundImage: `url(${storeInfo.bannerUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }} />

          {/* 2. AREA INFO & FOTO PROFIL LINGKARAN OVERLAPPING */}
          <div style={{
            padding: '0 35px 30px 35px',
            position: 'relative',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '30px',
            alignItems: 'flex-start'
          }}>

            {/* FOTO PROFIL LINGKARAN */}
            <div style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              backgroundColor: '#E5E7EB',
              border: '5px solid #FFF',
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
              marginTop: '-75px', // Membuat profil menumpuk ke atas di banner
              overflow: 'hidden',
              flexShrink: 0,
              zIndex: 2
            }}>
              <img
                src={storeInfo.logoUrl}
                alt={storeInfo.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/150?text=Toko';
                }}
              />
            </div>

            {/* DETAIL TOKO (SESUAI HIRARKI WIREFRAME) */}
            <div style={{ flex: 1, paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '260px' }}>
              
              <span style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#D95A36',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Store size={14} /> Detail Toko
              </span>

              {/* Nama Toko */}
              <h1 style={{
                margin: 0,
                fontSize: '28px',
                fontFamily: 'Fraunces, serif',
                fontWeight: '700',
                color: '#1A1A1A'
              }}>
                {storeInfo.name}
              </h1>

              {/* Jumlah Produk Tersedia */}
              <p style={{
                margin: '2px 0 6px 0',
                fontSize: '13px',
                color: '#555',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '500'
              }}>
                <Package size={15} color="#D95A36" /> Produk Tersedia: <strong style={{ color: '#D95A36' }}>{storeProducts.length} Produk</strong>
              </p>

              {/* Alamat */}
              <p style={{
                margin: 0,
                fontSize: '13px',
                color: '#666',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <MapPin size={15} color="#D95A36" /> {storeInfo.address}
              </p>

              {/* No HP / Kontak */}
              <p style={{
                margin: 0,
                fontSize: '13px',
                color: '#666',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Phone size={15} color="#D95A36" /> No. HP: <strong>{storeInfo.phone}</strong>
              </p>

              {/* Deskripsi Singkat */}
              <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#777', lineHeight: '1.5' }}>
                {storeInfo.description}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION DAFTAR PRODUK TOKO TERSEBUT */}
      <div style={{ padding: '0 40px' }}>
        <div style={{
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          paddingBottom: '12px',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '22px',
            color: '#1A1A1A',
            margin: 0,
            fontWeight: '700'
          }}>
            Produk Toko
          </h2>
        </div>

        {/* GRID PRODUK MENGGUNAKAN ProductCard REUSABLE */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '22px'
        }}>
          {storeProducts.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              isPromo={false}
              showStoreInfo={false} // 👈 Sembunyikan Nama Toko
              showLocation={false}  // 👈 Sembunyikan Alamat Toko
              onAddToCart={(prod) => {
                addToCart(prod, 1);
                alert(`1x ${prod.name} berhasil ditambahkan ke Keranjang!`);
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

      {/* MODAL LAPORAN PRODUK */}
      {reportingProduct && (
        <ReportModal
          product={reportingProduct}
          onClose={() => setReportingProduct(null)}
        />
      )}
    </div>
  );
}