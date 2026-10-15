import React, { useState } from 'react';
import { Plus, MapPin, Search, Navigation, X, Minus, ShoppingCart } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

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
            {product.description || `${product.name} berkualitas segar dan siap diselamatkan di toko ini.`}
          </p>

          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A1A', marginTop: '2px' }}>
            {product.store || 'Nama Toko'}
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

// --- KOMPONEN UTAMA BUYER PRODUCTS ---
export default function BuyerProducts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // State untuk deteksi Hover/Focus Interaktif
  const [isMapHovered, setIsMapHovered] = useState(false);
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isBadgeHovered, setIsBadgeHovered] = useState(false);

  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  // STATE UNTUK POP-UP DETAIL PRODUK
  const [selectedProduct, setSelectedProduct] = useState(null);

  const batamCenterPos = [1.1301, 104.0487];

  const products = [
    { id: 1, name: "Burger Daging", store: "Bakery Batam Centre", distance: "1.2 km", price: "Rp. 20.000", location: "Jl. Ahmad Yani, Batam Centre", lat: 1.1320, lng: 104.0450, stock: 10, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80" },
    { id: 2, name: "Salad Buah Segar", store: "Fresh Box Nagoya", distance: "2.5 km", price: "Rp. 15.000", location: "Nagoya Hill Mall", lat: 1.1380, lng: 104.0490, stock: 5, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80" },
    { id: 3, name: "Pastry & Roti Manis", store: "Sweet Bread Batam", distance: "3.0 km", price: "Rp. 12.000", location: "Batam Center Mall", lat: 1.1280, lng: 104.0520, stock: 8, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80" },
    { id: 4, name: "Kemeja Rajut Cream", store: "Thrift Corner", distance: "4.1 km", price: "Rp. 35.000", location: "Mega Mall Batam Center", lat: 1.1250, lng: 104.0550, stock: 3, image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=500&q=80" }
  ];

  return (
    <div style={{ 
      backgroundColor: '#FAF0EC', 
      minHeight: '100vh', 
      margin: 0, 
      paddingTop: '100px', 
      overflowX: 'hidden',
      fontFamily: 'Inter, sans-serif'
    }}>
      
      {/* CONTAINER PETA DENGAN EFEK HOVER LIFT */}
      <div style={{ padding: '0 40px', marginBottom: '30px' }}>
        <div 
          onMouseEnter={() => setIsMapHovered(true)}
          onMouseLeave={() => setIsMapHovered(false)}
          style={{ 
            backgroundColor: '#FFF', 
            borderRadius: '16px', 
            overflow: 'hidden', 
            border: isMapHovered ? '1.5px solid #D95A36' : '1px solid rgba(0,0,0,0.06)',
            boxShadow: isMapHovered ? '0 10px 25px rgba(217, 90, 54, 0.12)' : '0 4px 16px rgba(0,0,0,0.05)',
            transform: isMapHovered ? 'translateY(-3px)' : 'translateY(0)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* Header Bar Peta */}
          <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
            <div>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: '#1A1A1A', margin: '0 0 4px 0' }}>
                Peta Lokasi Rescue Terdekat
              </h2>
              <p style={{ fontSize: '13px', color: '#666', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Navigation size={14} color="#D95A36" /> Titik lokasi makanan & barang rescue terdekat
              </p>
            </div>
            
            {/* Badge Lokasi Interaktif */}
            <span 
              onMouseEnter={() => setIsBadgeHovered(true)}
              onMouseLeave={() => setIsBadgeHovered(false)}
              style={{ 
                backgroundColor: isBadgeHovered ? '#D95A36' : '#FAF0EC', 
                color: isBadgeHovered ? '#FFF' : '#D95A36', 
                padding: '6px 14px', 
                borderRadius: '20px', 
                fontSize: '12px', 
                fontWeight: 'bold', 
                border: '1px solid #FFDBCC',
                cursor: 'pointer',
                transform: isBadgeHovered ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s ease'
              }}
            >
              📍 Batam Centre
            </span>
          </div>

          {/* Area Peta Leaflet */}
          <div style={{ position: 'relative', width: '100%', height: '350px', zIndex: 1 }}>
            <MapContainer center={batamCenterPos} zoom={14} scrollWheelZoom={false} style={{ width: '100%', height: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {products.map((item) => (
                <Marker key={item.id} position={[item.lat, item.lng]} icon={customIcon}>
                  <Popup>
                    <div style={{ fontFamily: 'Inter, sans-serif' }}>
                      <b style={{ color: '#D95A36' }}>{item.name}</b><br />
                      {item.store}<br />
                      <span style={{ fontWeight: 'bold' }}>{item.price}</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* SEARCH BAR & KATEGORI FILTER INTERAKTIF */}
      <div style={{ padding: '0 40px', marginBottom: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Kolom Search Bar Interaktif */}
        <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
          <Search 
            size={18} 
            color={isSearchFocused || isSearchHovered ? '#D95A36' : '#888'} 
            style={{ 
              position: 'absolute', 
              left: '16px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              transition: 'color 0.2s ease' 
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
              width: '100%',
              padding: '12px 16px 12px 46px',
              borderRadius: '25px',
              border: isSearchFocused 
                ? '1.5px solid #D95A36' 
                : isSearchHovered 
                ? '1.5px solid #FFDBCC' 
                : '1px solid #ddd',
              backgroundColor: '#FFF',
              fontSize: '14px',
              outline: 'none',
              boxShadow: isSearchFocused 
                ? '0 0 0 3px rgba(217, 90, 54, 0.15)' 
                : isSearchHovered 
                ? '0 4px 12px rgba(0,0,0,0.06)' 
                : '0 2px 6px rgba(0,0,0,0.03)',
              transform: isSearchHovered && !isSearchFocused ? 'translateY(-1px)' : 'translateY(0)',
              transition: 'all 0.25s ease'
            }}
          />
        </div>

        {/* Kategori Filter */}
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
                  padding: '10px 18px',
                  borderRadius: '20px',
                  border: isSelected ? '1.5px solid #D95A36' : '1px solid rgba(0,0,0,0.06)',
                  backgroundColor: isSelected ? '#D95A36' : isHovered ? '#FFF3ED' : '#FFF',
                  color: isSelected ? '#FFF' : isHovered ? '#D95A36' : '#1A1A1A',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: isSelected || isHovered ? '0 4px 12px rgba(217, 90, 54, 0.2)' : '0 2px 6px rgba(0,0,0,0.03)',
                  transform: isHovered || isSelected ? 'scale(1.05) translateY(-1px)' : 'scale(1)',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* DAFTAR PRODUK GRID */}
      <div style={{ padding: '0 40px 50px 40px' }}>
        <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', color: '#1A1A1A', marginBottom: '20px' }}>
          Hasil Pencarian di Sekitar Anda
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '22px' }}>
          {products.map((item) => {
            const isCardHovered = hoveredCard === item.id;
            const isBtnHovered = hoveredBtn === item.id;

            return (
              <div 
                key={item.id} 
                onClick={() => setSelectedProduct(item)} // KLIK KARTU UNTUK BUKA MODAL DETAIL
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ 
                  backgroundColor: '#FFF', 
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  border: isCardHovered ? '1.5px solid #D95A36' : '1px solid rgba(0,0,0,0.05)',
                  boxShadow: isCardHovered ? '0 12px 28px rgba(217, 90, 54, 0.15)' : '0 4px 12px rgba(0,0,0,0.04)',
                  transform: isCardHovered ? 'translateY(-6px)' : 'translateY(0)',
                  transition: 'all 0.25s ease',
                  cursor: 'pointer'
                }}
              >
                <div style={{ position: 'relative', height: '150px', overflow: 'hidden', backgroundColor: '#F9F9F9' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: isCardHovered ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.35s ease' }} />
                  <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: isCardHovered ? '#D95A36' : 'rgba(0,0,0,0.7)', color: '#FFF', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', transition: 'background-color 0.2s ease' }}>
                    {item.distance}
                  </span>
                </div>

                <div style={{ padding: '16px' }}>
                  <span style={{ fontSize: '11px', color: '#D95A36', fontWeight: 'bold', textTransform: 'uppercase' }}>{item.store}</span>
                  <h4 style={{ margin: '4px 0 8px 0', fontSize: '16px', color: isCardHovered ? '#D95A36' : '#1A1A1A', fontFamily: 'Inter, sans-serif', fontWeight: '600', transition: 'color 0.2s ease' }}>{item.name}</h4>
                  <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} color="#D95A36" /> {item.location}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#D95A36' }}>{item.price}</span>

                    {/* Tombol Ambil Hitam -> Hover Oranye */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Mencegah modal terbuka jika pengguna hanya ingin langsung klik "Ambil"
                        alert(`Menambahkan ${item.name} ke Keranjang!`);
                      }}
                      onMouseEnter={() => setHoveredBtn(item.id)}
                      onMouseLeave={() => setHoveredBtn(null)}
                      style={{ 
                        backgroundColor: isBtnHovered ? '#D95A36' : '#1A1A1A', 
                        color: '#FFF', 
                        border: 'none', 
                        padding: '8px 16px', 
                        borderRadius: '8px', 
                        cursor: 'pointer', 
                        fontSize: '12px', 
                        fontWeight: 'bold', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        boxShadow: isBtnHovered ? '0 4px 14px rgba(217, 90, 54, 0.4)' : '0 2px 6px rgba(0,0,0,0.1)',
                        transform: isBtnHovered ? 'scale(1.08) translateY(-1px)' : 'scale(1)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Plus size={14} /> Ambil
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* RENDER MODAL DETAIL PRODUK */}
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