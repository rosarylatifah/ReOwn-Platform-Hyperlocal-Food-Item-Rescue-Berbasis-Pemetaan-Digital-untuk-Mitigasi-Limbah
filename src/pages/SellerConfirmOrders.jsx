"use client";

import React, { useState } from 'react';
import { MapPin, Clock, User, Package, Check, X, Eye } from 'lucide-react';

export default function SellerConfirmOrders() {
  // State data dummy pesanan masuk yang lebih real & bervariasi
  const [orders, setOrders] = useState([
    { 
      id: 1, 
      category: 'Barang', 
      name: 'Kemeja Rajut Vintage', 
      buyer: 'Siti Rahma', 
      location: 'Jl. Ahmad Yani, Batam Centre', 
      date: '14 Okt 2026, 16:30', 
      price: 'Rp. 25.000',
      status: 'Menunggu Konfirmasi'
    },
    { 
      id: 2, 
      category: 'Makanan', 
      name: 'Burger Daging Sisa Layak Makan (2 Pcs)', 
      buyer: 'Budi Santoso', 
      location: 'Nagoya Hill, Batam', 
      date: '14 Okt 2026, 15:10', 
      price: 'Gratis',
      status: 'Menunggu Konfirmasi'
    },
    { 
      id: 3, 
      category: 'Makanan', 
      name: 'Roti Panggang Keju Fresh', 
      buyer: 'Dewi Lestari', 
      location: 'Batam Centre Mall', 
      date: '14 Okt 2026, 13:45', 
      price: 'Rp. 10.000',
      status: 'Menunggu Konfirmasi'
    },
    { 
      id: 4, 
      category: 'Barang', 
      name: 'Jaket Denim Bekas Layak Pakai', 
      buyer: 'Ahmad Fauzi', 
      location: 'Batu Aji, Batam', 
      date: '13 Okt 2026, 19:20', 
      price: 'FREE',
      status: 'Menunggu Konfirmasi'
    },
  ]);

  // State buat efek hover kartu
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleTolak = (id, name) => {
    if (confirm(`Apakah kamu yakin ingin menolak pesanan "${name}"?`)) {
      setOrders(orders.filter(item => item.id !== id));
      alert(`Pesanan ${name} berhasil ditolak.`);
    }
  };

  const handleTerima = (id, name) => {
    if (confirm(`Terima pesanan "${name}" dan lanjutkan ke proses pengiriman/penjemputan?`)) {
      setOrders(orders.filter(item => item.id !== id));
      alert(`Pesanan ${name} diterima! Silakan cek menu 'Pesanan Masuk'.`);
    }
  };

  const handleLihatDetail = (item) => {
    alert(`Detail Pesanan:\n- Produk: ${item.name}\n- Pembeli: ${item.buyer}\n- Lokasi: ${item.location}\n- Waktu: ${item.date}\n- Harga: ${item.price}`);
  };

  return (
    <div style={{ 
      backgroundColor: '#FAF6F0', 
      minHeight: '100vh', 
      margin: 0, 
      paddingTop: '100px', 
      paddingBottom: '50px',
      paddingLeft: '40px',
      paddingRight: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      
      {/* HEADER HALAMAN */}
      <div style={{ 
        marginBottom: '24px',
        paddingBottom: '15px',
        borderBottom: '2px solid #EAE0D5',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', color: '#1A1A1A', margin: '0 0 4px 0', fontWeight: 'bold' }}>
            Konfirmasi Pesanan
          </h1>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
            Tinjau dan konfirmasi pesanan masuk dari pembeli sebelum diproses.
          </p>
        </div>
        <span style={{ backgroundColor: '#FFF3ED', color: '#D95A36', padding: '6px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold', border: '1px solid rgba(217,90,54,0.2)' }}>
          {orders.length} Pesanan Baru
        </span>
      </div>

      {/* DAFTAR KARTU PESANAN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {orders.length > 0 ? (
          orders.map((item) => {
            const isHovered = hoveredCard === item.id;

            return (
              <div 
                key={item.id}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ 
                  backgroundColor: '#FFF', 
                  borderRadius: '16px', 
                  padding: '20px 24px',
                  border: isHovered ? '1.5px solid #D95A36' : '1px solid rgba(0,0,0,0.06)',
                  boxShadow: isHovered ? '0 10px 25px rgba(217, 90, 54, 0.12)' : '0 4px 12px rgba(0,0,0,0.04)',
                  transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                {/* SISI KIRI: Gambar & Detail Informasi Pesanan */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {/* Kotak Placeholder Gambar Produk */}
                  <div style={{ 
                    width: '90px', 
                    height: '90px', 
                    backgroundColor: '#F0F0F0', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    textAlign: 'center',
                    fontSize: '11px', 
                    color: '#888',
                    fontWeight: '500',
                    position: 'relative',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    <span>Foto Produk</span>
                    <span style={{ 
                      position: 'absolute', top: '6px', left: '6px', 
                      backgroundColor: 'rgba(255,255,255,0.9)', color: '#333', 
                      padding: '2px 6px', borderRadius: '8px', fontSize: '9px', fontWeight: 'bold' 
                    }}>
                      {item.category}
                    </span>
                  </div>

                  {/* Informasi Teks */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1A1A1A' }}>
                        {item.name}
                      </h3>
                      <span style={{ fontWeight: 'bold', color: item.price === 'Gratis' || item.price === 'FREE' ? '#2E7D32' : '#D95A36', fontSize: '14px' }}>
                        {item.price}
                      </span>
                    </div>

                    <p style={{ margin: 0, fontSize: '12px', color: '#555', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <User size={13} color="#D95A36" /> Pembeli: <strong style={{ color: '#1A1A1A' }}>{item.buyer}</strong>
                    </p>

                    <p style={{ margin: 0, fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin size={13} color="#D95A36" /> {item.location} • <Clock size={12} color="#888" style={{ marginLeft: '4px' }} /> {item.date}
                    </p>

                    <button 
                      onClick={() => handleLihatDetail(item)}
                      style={{ 
                        backgroundColor: '#FAF0EC', 
                        color: '#D95A36', 
                        border: 'none', 
                        padding: '5px 12px', 
                        borderRadius: '6px', 
                        fontSize: '11px', 
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        width: 'fit-content',
                        marginTop: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5DCD3'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FAF0EC'}
                    >
                      <Eye size={13} /> LIHAT DETAIL
                    </button>
                  </div>
                </div>

                {/* SISI KANAN: Tombol Aksi (Tolak & Terima) */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {/* Tombol Tolak */}
                  <button 
                    onClick={() => handleTolak(item.id, item.name)}
                    style={{ 
                      backgroundColor: '#F5F5F5', 
                      color: '#444', 
                      border: '1px solid #DDD', 
                      padding: '10px 20px', 
                      borderRadius: '10px', 
                      fontSize: '13px', 
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFEBEE';
                      e.currentTarget.style.borderColor = '#D93025';
                      e.currentTarget.style.color = '#D93025';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#F5F5F5';
                      e.currentTarget.style.borderColor = '#DDD';
                      e.currentTarget.style.color = '#444';
                    }}
                  >
                    <X size={16} /> TOLAK
                  </button>

                  {/* Tombol Terima */}
                  <button 
                    onClick={() => handleTerima(item.id, item.name)}
                    style={{ 
                      backgroundColor: '#1A1A1A', 
                      color: '#FFF', 
                      border: 'none', 
                      padding: '10px 22px', 
                      borderRadius: '10px', 
                      fontSize: '13px', 
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#D95A36';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(217, 90, 54, 0.35)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#1A1A1A';
                      e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)';
                    }}
                  >
                    <Check size={16} /> TERIMA
                  </button>
                </div>

              </div>
            );
          })
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '50px', 
            color: '#777', 
            backgroundColor: '#FFF', 
            borderRadius: '16px',
            border: '1px dashed #D3C5B4'
          }}>
            <Package size={40} color="#D95A36" style={{ marginBottom: '10px' }} />
            <h3 style={{ margin: '0 0 5px 0', color: '#1A1A1A' }}>Semua Pesanan Sudah Dikonfirmasi!</h3>
            <p style={{ margin: 0, fontSize: '13px' }}>Tidak ada antrean pesanan baru yang menunggu saat ini.</p>
          </div>
        )}
      </div>

    </div>
  );
}