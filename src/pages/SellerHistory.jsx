"use client";

import React, { useState } from 'react';
import { History, Eye, CheckCircle2, XCircle, ShoppingBag, Layers } from 'lucide-react';
import OrderDetailModal from '../components/OrderDetailModal';

export default function SellerHistory() {
  const historyOrders = [
    {
      id: 101,
      name: 'Salad Buah Segar',
      buyerName: 'Aurel Cinta',
      orderDate: '25/09/26 10:15',
      confirmDate: '25/09/26 10:30',
      totalPrice: 'Rp. 15.000',
      deliveryOption: 'Ambil di Tempat',
      status: 'Selesai',
      statusType: 'completed',
      description: 'Salad buah porsi sedang, kondisi segar baru di-rescue dari toko Fresh Box Nagoya.',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 102,
      name: 'Roti Manis Assorted',
      buyerName: 'Aurel Cinta',
      orderDate: '20/09/26 18:00',
      confirmDate: null,
      totalPrice: 'Rp. 12.000',
      deliveryOption: 'Ambil di Tempat',
      status: 'Dibatalkan',
      statusType: 'cancelled',
      description: 'Paket roti manis beragam rasa, dibatalkan karena stok di toko sudah habis.',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 103,
      name: 'Kotak Makanan Kayu',
      buyerName: 'Aurel Cinta',
      orderDate: '15/09/26 14:10',
      confirmDate: '15/09/26 14:25',
      totalPrice: 'Rp. 35.000',
      deliveryOption: 'Ambil di Tempat',
      status: 'Selesai',
      statusType: 'completed',
      description: 'Kerajinan kotak kayu bekas layak pakai kondisi 90% mulus.',
      image: 'https://images.unsplash.com/photo-1532635241-17e820acc59f?auto=format&fit=crop&w=600&q=80',
    }
  ];

  // State untuk filter yang aktif: 'Semua', 'Selesai', atau 'Dibatalkan'
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [hoveredFilter, setHoveredFilter] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Hitung jumlah data
  const totalCount = historyOrders.length;
  const completedCount = historyOrders.filter(o => o.status === 'Selesai').length;
  const cancelledCount = historyOrders.filter(o => o.status === 'Dibatalkan').length;

  // Filter daftar transaksi sesuai tab yang dipilih
  const filteredOrders = historyOrders.filter((item) => {
    if (activeFilter === 'Selesai') return item.status === 'Selesai';
    if (activeFilter === 'Dibatalkan') return item.status === 'Dibatalkan';
    return true; // 'Semua'
  });

  const getStatusBadge = (statusType, statusText) => {
    if (statusType === 'completed') {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#DCFCE7',
          color: '#15803D',
          border: '1px solid #BBF7D0',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          <CheckCircle2 size={14} /> {statusText}
        </span>
      );
    }
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: '#FEE2E2',
        color: '#B91C1C',
        border: '1px solid #FCA5A5',
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600'
      }}>
        <XCircle size={14} /> {statusText}
      </span>
    );
  };

  return (
    <div style={{ 
      backgroundColor: '#FAF0EC', 
      minHeight: '100vh', 
      margin: 0, 
      paddingTop: '110px', 
      paddingLeft: '50px',
      paddingRight: '50px',
      paddingBottom: '50px',
      fontFamily: 'Inter, sans-serif'
    }}>
      
      {/* JUDUL UTAMA */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <History size={26} color="#D95A36" />
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: '600', color: '#1A1A1A', margin: 0 }}>
            Riwayat Pesanan
          </h1>
        </div>
        <hr style={{ border: 'none', borderTop: '1.5px solid rgba(0,0,0,0.08)', margin: 0 }} />
      </div>

      {/* FILTER TABS INTERAKTIF (BISA DIKLIK) */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        
        {/* Tab 1: Semua */}
        <div 
          onClick={() => setActiveFilter('Semua')}
          onMouseEnter={() => setHoveredFilter('Semua')}
          onMouseLeave={() => setHoveredFilter(null)}
          style={{ 
            backgroundColor: activeFilter === 'Semua' ? '#1A1A1A' : '#FFF', 
            color: activeFilter === 'Semua' ? '#FFF' : '#333',
            padding: '12px 20px', 
            borderRadius: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            border: activeFilter === 'Semua' ? '1px solid #1A1A1A' : '1px solid rgba(0,0,0,0.06)',
            boxShadow: activeFilter === 'Semua' || hoveredFilter === 'Semua' ? '0 6px 16px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.02)',
            cursor: 'pointer',
            transform: hoveredFilter === 'Semua' ? 'translateY(-2px)' : 'translateY(0)',
            transition: 'all 0.2s ease'
          }}
        >
          <Layers size={18} color={activeFilter === 'Semua' ? '#FFF' : '#1A1A1A'} />
          <span style={{ fontSize: '13px', fontWeight: '500' }}>
            Semua Transaksi: <strong>{totalCount}</strong>
          </span>
        </div>

        {/* Tab 2: Selesai Di-rescue */}
        <div 
          onClick={() => setActiveFilter('Selesai')}
          onMouseEnter={() => setHoveredFilter('Selesai')}
          onMouseLeave={() => setHoveredFilter(null)}
          style={{ 
            backgroundColor: activeFilter === 'Selesai' ? '#D95A36' : '#FFF', 
            color: activeFilter === 'Selesai' ? '#FFF' : '#333',
            padding: '12px 20px', 
            borderRadius: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            border: activeFilter === 'Selesai' ? '1px solid #D95A36' : '1px solid rgba(0,0,0,0.06)',
            boxShadow: activeFilter === 'Selesai' || hoveredFilter === 'Selesai' ? '0 6px 16px rgba(217, 90, 54, 0.25)' : '0 2px 8px rgba(0,0,0,0.02)',
            cursor: 'pointer',
            transform: hoveredFilter === 'Selesai' ? 'translateY(-2px)' : 'translateY(0)',
            transition: 'all 0.2s ease'
          }}
        >
          <ShoppingBag size={18} color={activeFilter === 'Selesai' ? '#FFF' : '#D95A36'} />
          <span style={{ fontSize: '13px', fontWeight: '500' }}>
            Selesai Di-rescue: <strong>{completedCount} Produk</strong>
          </span>
        </div>

        {/* Tab 3: Dibatalkan */}
        <div 
          onClick={() => setActiveFilter('Dibatalkan')}
          onMouseEnter={() => setHoveredFilter('Dibatalkan')}
          onMouseLeave={() => setHoveredFilter(null)}
          style={{ 
            backgroundColor: activeFilter === 'Dibatalkan' ? '#DC2626' : '#FFF', 
            color: activeFilter === 'Dibatalkan' ? '#FFF' : '#333',
            padding: '12px 20px', 
            borderRadius: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            border: activeFilter === 'Dibatalkan' ? '1px solid #DC2626' : '1px solid rgba(0,0,0,0.06)',
            boxShadow: activeFilter === 'Dibatalkan' || hoveredFilter === 'Dibatalkan' ? '0 6px 16px rgba(220, 38, 38, 0.25)' : '0 2px 8px rgba(0,0,0,0.02)',
            cursor: 'pointer',
            transform: hoveredFilter === 'Dibatalkan' ? 'translateY(-2px)' : 'translateY(0)',
            transition: 'all 0.2s ease'
          }}
        >
          <XCircle size={18} color={activeFilter === 'Dibatalkan' ? '#FFF' : '#DC2626'} />
          <span style={{ fontSize: '13px', fontWeight: '500' }}>
            Dibatalkan: <strong>{cancelledCount} Transaksi</strong>
          </span>
        </div>

      </div>

      {/* DAFTAR KARTU PESANAN DENGAN HASIL FILTER */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((item) => {
            const isCardHovered = hoveredCard === item.id;
            const isBtnHovered = hoveredBtn === item.id;

            return (
              <div 
                key={item.id}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  backgroundColor: '#FFF',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: isCardHovered ? '1.5px solid #D95A36' : '1px solid rgba(0,0,0,0.06)',
                  boxShadow: isCardHovered ? '0 10px 25px rgba(217, 90, 54, 0.12)' : '0 4px 14px rgba(0,0,0,0.03)',
                  transform: isCardHovered ? 'translateY(-3px)' : 'translateY(0)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '95px', height: '95px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#F9F9F9', flexShrink: 0 }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: isCardHovered ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.3s ease' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#888' }}>{item.orderDate}</span>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: isCardHovered ? '#D95A36' : '#1A1A1A' }}>{item.name}</h3>
                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#D95A36' }}>{item.totalPrice}</span>

                    <div style={{ marginTop: '6px' }}>
                      <button 
                        onClick={() => setSelectedOrder(item)}
                        onMouseEnter={() => setHoveredBtn(item.id)}
                        onMouseLeave={() => setHoveredBtn(null)}
                        style={{
                          backgroundColor: isBtnHovered ? '#D95A36' : '#F3F4F6',
                          color: isBtnHovered ? '#FFF' : '#374151',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Eye size={14} /> LIHAT DETAIL
                      </button>
                    </div>
                  </div>
                </div>

                <div>{getStatusBadge(item.statusType, item.status)}</div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#FFF', borderRadius: '16px', color: '#888' }}>
            Tidak ada riwayat pesanan dengan status "{activeFilter}".
          </div>
        )}
      </div>

      {/* MODAL DETAIL */}
      <OrderDetailModal 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />

    </div>
  );
}