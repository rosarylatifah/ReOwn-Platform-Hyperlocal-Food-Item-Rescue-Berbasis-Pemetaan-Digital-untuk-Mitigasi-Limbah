"use client";

import React, { useState } from 'react';
import { MapPin, Clock, User, PackageCheck, Eye, CheckCircle2 } from 'lucide-react';

// Import data dummy dari lib
import { initialIncomingOrders } from '@/lib/penjual/incomingOrdersData';

export default function SellerIncomingOrders() {
  const [incomingOrders, setIncomingOrders] = useState(initialIncomingOrders);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Fungsi Konfirmasi Penyelesaian Pesanan
  const handleKonfirmasiSelesai = (id, name) => {
    if (confirm(`Apakah kamu yakin ingin menyelesaikan pesanan "${name}"?`)) {
      setIncomingOrders(incomingOrders.filter(item => item.id !== id));
      alert(`Pesanan ${name} berhasil diselesaikan! Data masuk ke Riwayat Pesanan.`);
    }
  };

  const handleLihatDetail = (item) => {
    alert(`Detail Pesanan Masuk:\nProduk: ${item.name}\nPembeli: ${item.buyer}\nLokasi: ${item.location}\nStatus: ${item.status}\nWaktu: ${item.date}\nTotal/Harga: ${item.price}`);
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
            Pesanan Masuk
          </h1>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
            Pantau pesanan yang sedang diproses dan konfirmasi jika pesanan sudah selesai diserahterimakan.
          </p>
        </div>
        <span style={{ backgroundColor: '#E3F2FD', color: '#0288D1', padding: '6px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold', border: '1px solid rgba(2, 136, 209, 0.2)' }}>
          {incomingOrders.length} Pesanan Aktif
        </span>
      </div>

      {/* DAFTAR KARTU PESANAN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {incomingOrders.length > 0 ? (
          incomingOrders.map((item) => {
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
                {/* SISI KIRI: Gambar & Informasi Detail Pesanan */}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1A1A1A' }}>
                        {item.name}
                      </h3>

                      {/* BADGE STATUS PESANAN */}
                      <span style={{ 
                        backgroundColor: item.statusBg, 
                        color: item.statusColor, 
                        padding: '3px 10px', 
                        borderRadius: '20px', 
                        fontSize: '11px', 
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: item.statusColor }}></span>
                        {item.status}
                      </span>
                    </div>

                    <p style={{ margin: 0, fontSize: '12px', color: '#555', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <User size={13} color="#D95A36" /> Pembeli: <strong style={{ color: '#1A1A1A' }}>{item.buyer}</strong>
                    </p>

                    <p style={{ margin: 0, fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin size={13} color="#D95A36" /> {item.location}
                      <Clock size={12} color="#888" style={{ marginLeft: '4px' }} /> {item.date}
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

                {/* SISI KANAN: Tombol Konfirmasi Penyelesaian */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button 
                    onClick={() => handleKonfirmasiSelesai(item.id, item.name)}
                    style={{ 
                      backgroundColor: '#1A1A1A', 
                      color: '#FFF', 
                      border: 'none', 
                      padding: '12px 22px', 
                      borderRadius: '10px', 
                      fontSize: '13px', 
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                      transition: 'all 0.2s ease'
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
                    <CheckCircle2 size={16} color="#86EFAC" /> KONFIRMASI SELESAI
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
            <PackageCheck size={40} color="#2E7D32" style={{ marginBottom: '10px' }} />
            <h3 style={{ margin: '0 0 5px 0', color: '#1A1A1A' }}>Tidak Ada Pesanan Masuk Aktif</h3>
            <p style={{ margin: 0, fontSize: '13px' }}>Semua pesanan telah dikonfirmasi dan diselesaikan dengan sukses!</p>
          </div>
        )}
      </div>

    </div>
  );
}