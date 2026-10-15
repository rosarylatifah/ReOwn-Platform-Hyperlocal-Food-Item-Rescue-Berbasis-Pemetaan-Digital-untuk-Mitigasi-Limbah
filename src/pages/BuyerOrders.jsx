"use client";

import React, { useState } from 'react';
import { Clock, RefreshCw, Eye, Package, Layers } from 'lucide-react';
import OrderDetailModal from '../components/OrderDetailModal';

export default function BuyerOrders() {
  const [orders, setOrders] = useState([
    {
      id: 1,
      name: 'Kemeja Rajut',
      buyerName: 'Aurel Cinta',
      sellerName: 'Thrift Corner Batam',
      sellerAddress: 'Ruko Mega Cipta Blok A No. 4, Batam Center',
      orderDate: '29/09/26 15:03',
      confirmDate: null,
      totalPrice: 'Rp. 35.000',
      deliveryOption: 'Ambil di Tempat',
      status: 'Menunggu Konfirmasi',
      statusType: 'warning',
      description: 'Kemeja rajut warna cream ukuran L, kondisi 95% masih sangat bagus dan layak pakai.',
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      name: 'Burger Daging',
      buyerName: 'Aurel Cinta',
      sellerName: 'Thrift Corner Batam',
      sellerAddress: 'Ruko Mega Cipta Blok A No. 4, Batam Center',
      orderDate: '29/09/26 14:20',
      confirmDate: '29/09/26 14:35',
      totalPrice: 'Rp. 20.200',
      deliveryOption: 'Ambil di Tempat',
      status: 'Dalam Proses',
      statusType: 'process',
      description: 'Burger daging porsi lebih promo last chance, kondisi hangat dan dikemas rapi.',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    },
  ]);

  const [activeFilter, setActiveFilter] = useState('Semua');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [hoveredFilter, setHoveredFilter] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleCancelOrder = (orderId) => {
    setOrders(prev => prev.filter(item => item.id !== orderId));
  };

  const totalCount = orders.length;
  const waitingCount = orders.filter(o => o.status === 'Menunggu Konfirmasi').length;
  const processCount = orders.filter(o => o.status === 'Dalam Proses').length;

  const filteredOrders = orders.filter((item) => {
    if (activeFilter === 'Menunggu Konfirmasi') return item.status === 'Menunggu Konfirmasi';
    if (activeFilter === 'Dalam Proses') return item.status === 'Dalam Proses';
    return true;
  });

  const getStatusBadge = (type, statusText) => {
    if (type === 'process') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFF3ED', color: '#D95A36', border: '1px solid #FFDBCC', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
          <RefreshCw size={13} className="spin-icon" /> {statusText}
        </span>
      );
    }
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
        <Clock size={13} /> {statusText}
      </span>
    );
  };

  return (
    <div style={{ backgroundColor: '#FAF0EC', minHeight: '100vh', paddingTop: '110px', paddingLeft: '50px', paddingRight: '50px', paddingBottom: '50px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* JUDUL */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Package size={26} color="#D95A36" />
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: '600', color: '#1A1A1A', margin: 0 }}>
            Pesanan
          </h1>
        </div>
        <hr style={{ border: 'none', borderTop: '1.5px solid rgba(0,0,0,0.08)', margin: 0 }} />
      </div>

      {/* FILTER TABS */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        
        {/* Tab Semua */}
        <div 
          onClick={() => setActiveFilter('Semua')}
          onMouseEnter={() => setHoveredFilter('Semua')}
          onMouseLeave={() => setHoveredFilter(null)}
          style={{ 
            backgroundColor: activeFilter === 'Semua' ? '#1A1A1A' : '#FFF', 
            color: activeFilter === 'Semua' ? '#FFF' : '#333',
            padding: '12px 20px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px',
            border: activeFilter === 'Semua' ? '1px solid #1A1A1A' : '1px solid rgba(0,0,0,0.06)',
            boxShadow: activeFilter === 'Semua' || hoveredFilter === 'Semua' ? '0 6px 16px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.02)',
            cursor: 'pointer', transform: hoveredFilter === 'Semua' ? 'translateY(-2px)' : 'translateY(0)', transition: 'all 0.2s ease'
          }}
        >
          <Layers size={18} color={activeFilter === 'Semua' ? '#FFF' : '#1A1A1A'} />
          <span style={{ fontSize: '13px', fontWeight: '500' }}>Semua Pesanan: <strong>{totalCount}</strong></span>
        </div>

        {/* Tab Menunggu Konfirmasi */}
        <div 
          onClick={() => setActiveFilter('Menunggu Konfirmasi')}
          onMouseEnter={() => setHoveredFilter('Menunggu Konfirmasi')}
          onMouseLeave={() => setHoveredFilter(null)}
          style={{ 
            backgroundColor: activeFilter === 'Menunggu Konfirmasi' ? '#475569' : '#FFF', 
            color: activeFilter === 'Menunggu Konfirmasi' ? '#FFF' : '#333',
            padding: '12px 20px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px',
            border: activeFilter === 'Menunggu Konfirmasi' ? '1px solid #475569' : '1px solid rgba(0,0,0,0.06)',
            boxShadow: activeFilter === 'Menunggu Konfirmasi' || hoveredFilter === 'Menunggu Konfirmasi' ? '0 6px 16px rgba(71, 85, 105, 0.25)' : '0 2px 8px rgba(0,0,0,0.02)',
            cursor: 'pointer', transform: hoveredFilter === 'Menunggu Konfirmasi' ? 'translateY(-2px)' : 'translateY(0)', transition: 'all 0.2s ease'
          }}
        >
          <Clock size={18} color={activeFilter === 'Menunggu Konfirmasi' ? '#FFF' : '#475569'} />
          <span style={{ fontSize: '13px', fontWeight: '500' }}>Menunggu Konfirmasi: <strong>{waitingCount}</strong></span>
        </div>

        {/* Tab Dalam Proses */}
        <div 
          onClick={() => setActiveFilter('Dalam Proses')}
          onMouseEnter={() => setHoveredFilter('Dalam Proses')}
          onMouseLeave={() => setHoveredFilter(null)}
          style={{ 
            backgroundColor: activeFilter === 'Dalam Proses' ? '#D95A36' : '#FFF', 
            color: activeFilter === 'Dalam Proses' ? '#FFF' : '#333',
            padding: '12px 20px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px',
            border: activeFilter === 'Dalam Proses' ? '1px solid #D95A36' : '1px solid rgba(0,0,0,0.06)',
            boxShadow: activeFilter === 'Dalam Proses' || hoveredFilter === 'Dalam Proses' ? '0 6px 16px rgba(217, 90, 54, 0.25)' : '0 2px 8px rgba(0,0,0,0.02)',
            cursor: 'pointer', transform: hoveredFilter === 'Dalam Proses' ? 'translateY(-2px)' : 'translateY(0)', transition: 'all 0.2s ease'
          }}
        >
          <RefreshCw size={18} color={activeFilter === 'Dalam Proses' ? '#FFF' : '#D95A36'} />
          <span style={{ fontSize: '13px', fontWeight: '500' }}>Dalam Proses: <strong>{processCount}</strong></span>
        </div>

      </div>

      {/* LIST KARTU HASIL FILTER */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((item) => (
            <div 
              key={item.id}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                backgroundColor: '#FFF', borderRadius: '16px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                border: hoveredCard === item.id ? '1.5px solid #D95A36' : '1px solid rgba(0,0,0,0.06)',
                boxShadow: hoveredCard === item.id ? '0 10px 25px rgba(217, 90, 54, 0.12)' : '0 4px 14px rgba(0,0,0,0.03)',
                transform: hoveredCard === item.id ? 'translateY(-3px)' : 'translateY(0)', transition: 'all 0.25s ease',
              }}
            >
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '95px', height: '95px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#F9F9F9' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1A1A1A' }}>{item.name}</h3>
                  <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#D95A36' }}>{item.totalPrice}</span>

                  <div style={{ marginTop: '6px' }}>
                    <button 
                      onClick={() => setSelectedOrder(item)}
                      onMouseEnter={() => setHoveredBtn(item.id)}
                      onMouseLeave={() => setHoveredBtn(null)}
                      style={{
                        backgroundColor: hoveredBtn === item.id ? '#D95A36' : '#F3F4F6',
                        color: hoveredBtn === item.id ? '#FFF' : '#374151',
                        border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s ease'
                      }}
                    >
                      <Eye size={14} /> LIHAT DETAIL
                    </button>
                  </div>
                </div>
              </div>

              <div>{getStatusBadge(item.statusType, item.status)}</div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#FFF', borderRadius: '16px', color: '#888' }}>
            Tidak ada pesanan dengan status "{activeFilter}".
          </div>
        )}
      </div>

      <OrderDetailModal 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        onCancelOrder={handleCancelOrder}
      />

    </div>
  );
}