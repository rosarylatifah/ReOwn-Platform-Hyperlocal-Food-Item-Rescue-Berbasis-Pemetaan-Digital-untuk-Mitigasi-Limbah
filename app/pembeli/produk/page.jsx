"use client";

import React, { useState } from 'react';
import { Plus, MapPin, Search, Navigation, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import data & komponen modal
import { batamCenterPos, products } from '@/lib/pembeli/productsData';
import ProductDetail from '@/components/pembeli/ProductDetail';
import ReportModal from '@/components/pembeli/ReportModal';
import StorePopover from '@/components/pembeli/StorePopover';

// Import Context Keranjang dari folder context
import { useCart } from '../context/cart';

// Marker Leaflet CDN
const customIcon = typeof window !== 'undefined' ? new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
}) : null;

export default function BuyerProducts() {
  const { addToCart } = useCart();

  const [activeStorePopover, setActiveStorePopover] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const [isMapHovered, setIsMapHovered] = useState(false);
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isBadgeHovered, setIsBadgeHovered] = useState(false);

  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredPlusBtn, setHoveredPlusBtn] = useState(null);
  const [hoveredDetailBtn, setHoveredDetailBtn] = useState(null);
  const [hoveredReportBtn, setHoveredReportBtn] = useState(null);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reportingProduct, setReportingProduct] = useState(null);

  // Filter & Pengurutan Produk
  const filteredProducts = products
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.store.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (selectedCategory === 'Makanan') {
        return matchesSearch && item.category === 'Makanan';
      }
      if (selectedCategory === 'Barang') {
        return matchesSearch && item.category === 'Barang';
      }
      return matchesSearch; 
    })
    .sort((a, b) => {
      if (selectedCategory === 'Terdekat') {
        return a.distanceKm - b.distanceKm;
      }
      return 0; 
    });

  return (
    <div style={{ backgroundColor: '#FAF0EC', minHeight: '100vh', margin: 0, paddingTop: '100px', overflowX: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      
      {/* CONTAINER PETA */}
      <div style={{ padding: '0 40px', marginBottom: '30px' }}>
        <div 
          onMouseEnter={() => setIsMapHovered(true)}
          onMouseLeave={() => setIsMapHovered(false)}
          style={{ 
            backgroundColor: '#FFF', borderRadius: '16px', overflow: 'hidden', 
            border: isMapHovered ? '1.5px solid #D95A36' : '1px solid rgba(0,0,0,0.06)',
            boxShadow: isMapHovered ? '0 12px 28px rgba(217, 90, 54, 0.15)' : '0 4px 16px rgba(0,0,0,0.05)',
            transform: isMapHovered ? 'translateY(-3px)' : 'translateY(0)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
            <div>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: '#1A1A1A', margin: '0 0 4px 0' }}>
                Peta Lokasi Rescue Terdekat
              </h2>
              <p style={{ fontSize: '13px', color: '#666', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Navigation size={14} color="#D95A36" /> Titik lokasi makanan & barang rescue terdekat
              </p>
            </div>
            
            <span 
              onMouseEnter={() => setIsBadgeHovered(true)}
              onMouseLeave={() => setIsBadgeHovered(false)}
              style={{ 
                backgroundColor: isBadgeHovered ? '#D95A36' : '#FAF0EC', 
                color: isBadgeHovered ? '#FFF' : '#D95A36', 
                padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', 
                border: '1px solid #FFDBCC', cursor: 'pointer',
                transform: isBadgeHovered ? 'scale(1.05)' : 'scale(1)',
                boxShadow: isBadgeHovered ? '0 4px 12px rgba(217, 90, 54, 0.25)' : 'none',
                transition: 'all 0.25s ease'
              }}
            >
              📍 Batam Centre
            </span>

          </div>

          <div style={{ position: 'relative', width: '100%', height: '350px', zIndex: 1 }}>
            <MapContainer center={batamCenterPos} zoom={14} scrollWheelZoom={false} style={{ width: '100%', height: '100%' }}>
              <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {products.map((item) => (
                customIcon && (
                  <Marker key={item.id} position={[item.lat, item.lng]} icon={customIcon}>
                    <Popup>
                      <div style={{ fontFamily: 'Inter, sans-serif' }}>
                        <b style={{ color: '#D95A36' }}>{item.name}</b><br />
                        {item.store}<br />
                        <span style={{ fontWeight: 'bold' }}>{item.price}</span>
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* SEARCH & KATEGORI */}
      <div style={{ padding: '0 40px', marginBottom: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* INPUT SEARCH */}
        <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
          <Search 
            size={18} 
            color={isSearchFocused || isSearchHovered ? '#D95A36' : '#888'} 
            style={{ 
              position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
              transition: 'color 0.25s ease'
            }} 
          />
          <input 
            type="text" 
            placeholder="Cari makanan atau barang rescue..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onMouseEnter={() => setIsSearchHovered(true)}
            onMouseLeave={() => setIsSearchHovered(false)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            style={{
              width: '100%', padding: '12px 16px 12px 46px', borderRadius: '25px',
              border: isSearchFocused ? '1.5px solid #D95A36' : isSearchHovered ? '1.5px solid #E87A5D' : '1px solid #ddd',
              backgroundColor: '#FFF', fontSize: '14px', outline: 'none',
              boxShadow: isSearchFocused ? '0 6px 20px rgba(217, 90, 54, 0.18)' : isSearchHovered ? '0 4px 12px rgba(0,0,0,0.08)' : '0 2px 6px rgba(0,0,0,0.03)',
              transform: isSearchFocused || isSearchHovered ? 'translateY(-1px)' : 'translateY(0)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </div>

        {/* TOMBOL KATEGORI */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Semua', 'Makanan', 'Barang', 'Terdekat'].map((cat) => {
            const isSelected = selectedCategory === cat;
            const isHovered = hoveredCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                onMouseEnter={() => setHoveredCategory(cat)}
                onMouseLeave={() => setHoveredCategory(null)}
                style={{
                  padding: '10px 20px', borderRadius: '20px',
                  border: isSelected ? '1.5px solid #D95A36' : isHovered ? '1.5px solid #E87A5D' : '1px solid rgba(0,0,0,0.06)',
                  backgroundColor: isSelected ? '#D95A36' : isHovered ? '#FFF3ED' : '#FFF',
                  color: isSelected ? '#FFF' : isHovered ? '#D95A36' : '#1A1A1A',
                  fontWeight: '600', fontSize: '13px', cursor: 'pointer',
                  transform: isHovered ? 'translateY(-2px) scale(1.03)' : isSelected ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isSelected || isHovered ? '0 6px 14px rgba(217, 90, 54, 0.2)' : '0 2px 6px rgba(0,0,0,0.04)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  outline: 'none'
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
          Hasil Pencarian di Sekitar Anda
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '22px' }}>
          {filteredProducts.map((item) => {
            const isCardHovered = hoveredCard === item.id;
            const isPlusHovered = hoveredPlusBtn === item.id;
            const isDetailHovered = hoveredDetailBtn === item.id;
            const isReportHovered = hoveredReportBtn === item.id;

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
                  zIndex: activeStorePopover === item.id ? 30 : 1 // Z-Index naik otomatis pas popover aktif biar menimpa card lain
                }}
              >
                {/* TOMBOL TANDA SERU LAPORKAN */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setReportingProduct(item);
                  }}
                  onMouseEnter={() => setHoveredReportBtn(item.id)}
                  onMouseLeave={() => setHoveredReportBtn(null)}
                  title="Laporkan produk/gambar bermasalah"
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

                {/* WADAH GAMBAR (Overflow hidden khusus di sini biar border radius atas rapi) */}
                <div style={{ 
                  position: 'relative', 
                  height: '150px', 
                  overflow: 'hidden', 
                  borderTopLeftRadius: '16px', 
                  borderTopRightRadius: '16px', 
                  backgroundColor: '#F9F9F9' 
                }}>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{ 
                      width: '100%', height: '100%', objectFit: 'cover',
                      transform: isCardHovered ? 'scale(1.08)' : 'scale(1)',
                      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} 
                  />
                  <span style={{ 
                    position: 'absolute', top: '10px', left: '10px', 
                    backgroundColor: 'rgba(0,0,0,0.7)', color: '#FFF', 
                    padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold',
                    backdropFilter: 'blur(4px)'
                  }}>
                    {item.distance}
                  </span>
                </div>

                <div style={{ padding: '16px' }}>
                  {/* Nama Produk di Atas */}
                  <h4 style={{ 
                    margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', 
                    color: isCardHovered ? '#D95A36' : '#1A1A1A',
                    transition: 'color 0.25s ease'
                  }}>
                    {item.name}
                  </h4>

                  {/* Nama Toko di Bawah Nama Produk (Bisa diklik & memunculkan StorePopover melayang) */}
                  <div style={{ position: 'relative', marginBottom: '8px', display: 'inline-block' }}>
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveStorePopover(activeStorePopover === item.id ? null : item.id);
                      }}
                      style={{ 
                        fontSize: '12px', color: '#D95A36', fontWeight: 'bold', 
                        cursor: 'pointer', textDecoration: 'underline' 
                      }}
                    >
                      {item.store}
                    </span>

                    {/* Popover Toko Melayang */}
                    {activeStorePopover === item.id && (
                      <StorePopover 
                        store={{
                          name: item.store,
                          location: item.location || 'Batam Centre',
                          totalProducts: 9,
                          logo: item.image
                        }}
                        onClose={() => setActiveStorePopover(null)}
                        positionStyle={{
                          top: '24px',
                          left: '0px'
                        }}
                      />
                    )}
                  </div>

                  <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} color="#D95A36" /> {item.location}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#D95A36' }}>
                      {item.price}
                    </span>

                    {/* Tombol Aksi (+ dan Lihat Detail) */}
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {/* Tombol Plus (+) Tambah ke Keranjang */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item, 1);
                          alert(`1x ${item.name} berhasil ditambahkan ke Keranjang!`);
                        }}
                        onMouseEnter={() => setHoveredPlusBtn(item.id)}
                        onMouseLeave={() => setHoveredPlusBtn(null)}
                        title="Tambah ke Keranjang"
                        style={{ 
                          backgroundColor: isPlusHovered ? '#D95A36' : '#1A1A1A', 
                          color: '#FFF', border: 'none', 
                          width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transform: isPlusHovered ? 'scale(1.08)' : 'scale(1)',
                          boxShadow: isPlusHovered ? '0 4px 12px rgba(217, 90, 54, 0.35)' : 'none',
                          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      >
                        <Plus size={16} />
                      </button>

                      {/* Tombol Lihat Detail */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(item);
                        }}
                        onMouseEnter={() => setHoveredDetailBtn(item.id)}
                        onMouseLeave={() => setHoveredDetailBtn(null)}
                        style={{ 
                          backgroundColor: isDetailHovered ? '#D95A36' : '#1A1A1A', 
                          color: '#FFF', border: 'none', 
                          padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', 
                          fontSize: '11px', fontWeight: 'bold', 
                          transform: isDetailHovered ? 'scale(1.05)' : 'scale(1)',
                          boxShadow: isDetailHovered ? '0 4px 12px rgba(217, 90, 54, 0.35)' : 'none',
                          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
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