"use client";

import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, Package, Layers } from 'lucide-react';
import { useCart } from '@/app/pembeli/context/cart';
import { useOrderCompletion } from '@/app/pembeli/hooks/useOrderCompletion';
import { useSearchParams } from 'next/navigation';

import OrderDetailModal from '@/components/pembeli/OrderDetailModal';
import ReportModal from '@/components/pembeli/ReportModal';
// NARIK DARI KODE UTAMA KARTU
import OrderItemCard from '@/components/pembeli/OrderItemCard';

export default function BuyerOrders() {
  const { orders = [] } = useCart();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  useOrderCompletion();

  const [activeFilter, setActiveFilter] = useState('Semua');
  const [hoveredFilter, setHoveredFilter] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedReportOrder, setSelectedReportOrder] = useState(null);

  useEffect(() => {
    if (tabParam === 'proses') {
      setActiveFilter('Dalam Proses');
    }
  }, [tabParam]);

  const totalCount = orders.length;
  const waitingCount = orders.filter(o => o?.status === 'Menunggu Konfirmasi' || !o?.status).length;
  const processCount = orders.filter(o => o?.status === 'Dalam Proses').length;

  const filteredOrders = orders.filter((item) => {
    const itemStatus = item?.status || 'Menunggu Konfirmasi';
    if (activeFilter === 'Menunggu Konfirmasi') return itemStatus === 'Menunggu Konfirmasi';
    if (activeFilter === 'Dalam Proses') return itemStatus === 'Dalam Proses';
    return true;
  });

  return (
    <div style={{ backgroundColor: '#FAF0EC', minHeight: '100vh', paddingTop: '110px', paddingLeft: '50px', paddingRight: '50px', paddingBottom: '50px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* JUDUL */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Package size={26} color="#D95A36" />
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: '600', color: '#1A1A1A', margin: 0 }}>
            Pesanan Saya
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

      {/* LIST KARTU PESANAN */}
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
            Belum ada pesanan dengan status "{activeFilter}".
          </div>
        )}
      </div>

      {/* MODAL DETAIL PESANAN */}
      <OrderDetailModal 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />

      {/* MODAL LAPORKAN MASALAH PESANAN */}
      {selectedReportOrder && (
        <ReportModal 
          order={selectedReportOrder} 
          onClose={() => setSelectedReportOrder(null)} 
        />
      )}

    </div>
  );
}