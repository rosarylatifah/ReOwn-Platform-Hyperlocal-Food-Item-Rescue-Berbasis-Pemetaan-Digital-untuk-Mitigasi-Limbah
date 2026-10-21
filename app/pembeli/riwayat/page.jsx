"use client";

import React, { useState } from 'react';
import { History, ShoppingBag, Layers, XCircle } from 'lucide-react';
import { historyOrders } from '@/lib/pembeli/historyData';

import OrderDetailModal from '@/components/pembeli/OrderDetailModal';
import ReportModal from '@/components/pembeli/ReportModal';
// NARIK KODE KARTU YANG SAMA
import OrderItemCard from '@/components/pembeli/OrderItemCard';

export default function BuyerHistory() {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [hoveredFilter, setHoveredFilter] = useState(null);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedReportOrder, setSelectedReportOrder] = useState(null);

  const totalCount = historyOrders.length;
  const completedCount = historyOrders.filter(o => o.status === 'Selesai').length;
  const cancelledCount = historyOrders.filter(o => o.status === 'Dibatalkan').length;

  const filteredOrders = historyOrders.filter((item) => {
    if (activeFilter === 'Selesai') return item.status === 'Selesai';
    if (activeFilter === 'Dibatalkan') return item.status === 'Dibatalkan';
    return true;
  });

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

      {/* FILTER TABS */}
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

      {/* DAFTAR KARTU PESANAN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((item, index) => (
            <OrderItemCard 
              key={item?.id || index} 
              item={item} 
              onSelectOrder={setSelectedOrder}
              onReportOrder={(order) => setSelectedReportOrder(order)}
            />
          ))
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

      {/* MODAL LAPORKAN MASALAH */}
      {selectedReportOrder && (
        <ReportModal 
          order={selectedReportOrder} 
          onClose={() => setSelectedReportOrder(null)} 
        />
      )}

    </div>
  );
}