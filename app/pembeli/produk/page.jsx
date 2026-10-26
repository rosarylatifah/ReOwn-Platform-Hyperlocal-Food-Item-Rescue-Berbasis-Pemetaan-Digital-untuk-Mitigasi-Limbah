// app/pembeli/produk/page.jsx
"use client";

import React, { useState } from 'react';
import { Search, Store } from 'lucide-react';

import { useBuyerProducts } from '@/app/pembeli/hooks/useBuyerProducts';
import ProductGrid from '@/components/pembeli/ProductGrid';
import ProductDetail from '@/components/pembeli/ProductDetail';
import ReportModal from '@/components/pembeli/ReportModal';
import BuyerMap from '@/components/pembeli/BuyerMap'; // 👈 Import komponen peta yang sudah dipisah
import { useCart } from '@/app/pembeli/context/cart';

const batamCenterPos = [1.1186, 104.0487];

export default function BuyerProducts() {
  const { addToCart } = useCart();
  
  const {
    products,
    filteredProducts,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    activeStorePopover,
    setActiveStorePopover,
    selectedProduct,
    setSelectedProduct,
    reportingProduct,
    setReportingProduct
  } = useBuyerProducts();

  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Rumus Haversine untuk jarak
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const displayedProducts = React.useMemo(() => {
    let result = [...filteredProducts];
    if (selectedCategory === 'Terdekat') {
      result.sort((a, b) => {
        const distA = calculateDistance(batamCenterPos[0], batamCenterPos[1], a.lat || 1.1186, a.lng || 104.0487);
        const distB = calculateDistance(batamCenterPos[0], batamCenterPos[1], b.lat || 1.1186, b.lng || 104.0487);
        return distA - distB;
      });
    }
    return result;
  }, [filteredProducts, selectedCategory]);

  return (
    <div style={{ backgroundColor: '#FAF0EC', minHeight: '100vh', margin: 0, paddingTop: '100px', overflowX: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      
      {/* PETA DIPISAH KE KOMPONEN BUYERMAP */}
      <BuyerMap products={products} />

      {/* SEARCH & KATEGORI */}
      <div style={{ padding: '0 40px', marginBottom: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
          <Search size={18} color={isSearchFocused || isSearchHovered ? '#D95A36' : '#888'} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 2, transition: 'color 0.2s ease' }} />
          <input 
            type="text" 
            placeholder="Cari makanan, barang rescue, atau nama toko/penjual..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onMouseEnter={() => setIsSearchHovered(true)}
            onMouseLeave={() => setIsSearchHovered(false)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            style={{
              width: '100%', padding: '12px 16px 12px 46px', borderRadius: '25px',
              border: isSearchFocused ? '1.5px solid #D95A36' : isSearchHovered ? '1.5px solid #E87A5D' : '1px solid #ddd',
              backgroundColor: '#FFF', fontSize: '14px', outline: 'none',
              boxShadow: isSearchFocused ? '0 6px 20px rgba(217, 90, 54, 0.18)' : isSearchHovered ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
              transform: isSearchFocused ? 'translateY(-1px)' : 'translateY(0)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />

          {isSearchFocused && searchTerm.trim() !== '' && products.filter(p => {
            const seller = p.sellerName || p.storeName || '';
            return seller.toLowerCase().includes(searchTerm.toLowerCase());
          }).length > 0 && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
              backgroundColor: '#FFF', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              border: '1px solid rgba(217, 90, 54, 0.2)', zIndex: 10, overflow: 'hidden', padding: '8px 0'
            }}>
              <div style={{ padding: '6px 16px', fontSize: '11px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase' }}>
                Hasil Pencarian Penjual / Toko
              </div>
              {Array.from(
                new Map(
                  products
                    .filter(p => {
                      const seller = p.sellerName || p.storeName || '';
                      return seller.toLowerCase().includes(searchTerm.toLowerCase());
                    })
                    .map(p => [p.sellerName || p.storeName, p])
                ).values()
              ).map((sellerItem, idx) => {
                const sellerName = sellerItem.sellerName || sellerItem.storeName || 'Toko Rescue';
                return (
                  <div
                    key={idx}
                    onMouseDown={() => setSearchTerm(sellerName)}
                    style={{
                      padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
                      transition: 'background 0.2s ease', borderBottom: '1px solid #F5F5F5'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF3ED'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFF'}
                  >
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#FFF3ED', color: '#D95A36', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Store size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1A1A1A' }}>{sellerName}</div>
                      <div style={{ fontSize: '11px', color: '#666' }}>Punya produk rescue aktif</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Semua', 'Makanan', 'Barang', 'Terdekat'].map((cat) => {
            const isSelected = selectedCategory === cat;
            const [isBtnHovered, setIsBtnHovered] = useState(false);

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                onMouseEnter={() => setIsBtnHovered(true)}
                onMouseLeave={() => setIsBtnHovered(false)}
                style={{
                  padding: '10px 20px', borderRadius: '20px',
                  border: isSelected ? '1.5px solid #D95A36' : isBtnHovered ? '1.5px solid #D95A36' : '1px solid rgba(0,0,0,0.08)',
                  backgroundColor: isSelected ? '#D95A36' : isBtnHovered ? '#FFF3ED' : '#FFF',
                  color: isSelected ? '#FFF' : isBtnHovered ? '#D95A36' : '#1A1A1A',
                  fontWeight: '600', fontSize: '13px', cursor: 'pointer',
                  boxShadow: isBtnHovered || isSelected ? '0 4px 12px rgba(217, 90, 54, 0.2)' : 'none',
                  transform: isBtnHovered ? 'translateY(-2px)' : 'translateY(0)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* GRID PRODUK */}
      <div style={{ padding: '0 40px 50px 40px' }}>
        <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', color: '#1A1A1A', marginBottom: '20px' }}>
          {selectedCategory === 'Terdekat' ? 'Hasil Berdasarkan Jarak Terdekat dari Lokasi Kamu' : 'Hasil Pencarian di Sekitar Anda (Urutan Postingan Paling Lama)'}
        </h3>

        <ProductGrid 
          products={displayedProducts}
          activeStorePopover={activeStorePopover}
          setActiveStorePopover={setActiveStorePopover}
          onAddToCart={(item) => {
            addToCart(item, 1);
            alert(`1x ${item.name} berhasil ditambahkan ke Keranjang!`);
          }}
          onSelectDetail={(item) => setSelectedProduct(item)}
          onReport={(item) => setReportingProduct(item)}
        />
      </div>

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

      {reportingProduct && (
        <ReportModal 
          product={reportingProduct} 
          onClose={() => setReportingProduct(null)} 
        />
      )}
    </div>
  );
}