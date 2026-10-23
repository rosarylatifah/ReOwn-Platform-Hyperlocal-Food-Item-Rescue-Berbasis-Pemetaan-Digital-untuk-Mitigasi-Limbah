"use client";

import React from 'react';

// Import Component yang Dipakai
import SellerNavbar from '@/components/penjual/SellerNavbar';
import RevenueChart from '@/components/penjual/RevenueChart';
import AvailableItemsCard from '@/components/penjual/AvailableItemsCard';
import AvailableFoodsCard from '@/components/penjual/AvailableFoodsCard';
import ActivityTable from '@/components/penjual/ActivityTable';

// Custom Hook Penjual
import { useSellerDashboard } from '@/app/penjual/hooks/useSellerDashboard';

export default function SellerBerandaPage() {
  const {
    activeModal,
    setActiveModal,
    chartScale,
    activeTooltip,
    setActiveTooltip,
    handleChartScroll,
  } = useSellerDashboard();

  return (
    <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* NAVBAR PENJUAL */}
      <SellerNavbar activeTab="beranda" />

      {/* CONTAINER UTAMA */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 20px' }}>
        
        {/* HEADER WELCOME */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1A1A1A', margin: '0 0 6px 0', fontFamily: 'Fraunces, serif' }}>
              Halo, Penjual
            </h1>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
              Berikut ringkasan performa toko dan aktivitas ReOwn kamu hari ini.
            </p>
          </div>

          <div style={{ backgroundColor: '#FFF', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 'bold', color: '#1A1A1A' }}>
            <span style={{ color: '#D95A36' }}>19.21.02 WIB</span>
            <span style={{ color: '#888', fontWeight: 'normal' }}>Jum, 23 Okt 2026</span>
          </div>
        </div>

        {/* BARIS ATAS: REVENUE CHART (KIRI) & STATS BARANG/MAKANAN TERSEDIA (KANAN) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 340px', // Chart dapat porsi lebih luas (1fr), stats di kanan 340px
          gap: '20px', 
          marginBottom: '28px',
          alignItems: 'stretch'
        }}>
          {/* CHART PENDAPATAN DENGAN DUA LINE */}
          <RevenueChart 
            chartScale={chartScale}
            onScroll={handleChartScroll}
            onOpenModal={(modalName) => setActiveModal(modalName)}
            activeTooltip={activeTooltip}
            setActiveTooltip={setActiveTooltip}
          />

          {/* DUA CARD STATS ETALASE TERSEDIA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <AvailableItemsCard onOpenModal={() => setActiveModal('barang-tersedia')} />
            <AvailableFoodsCard onOpenModal={() => setActiveModal('makanan-tersedia')} />
          </div>
        </div>

        {/* BARIS BAWAH: RIWAYAT AKTIVITAS TOKO */}
        <ActivityTable />

      </div>
    </div>
  );
}