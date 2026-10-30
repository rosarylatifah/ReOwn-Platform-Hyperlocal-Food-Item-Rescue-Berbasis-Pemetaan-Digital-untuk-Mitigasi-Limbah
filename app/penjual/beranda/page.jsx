"use client";

import React from 'react';

import SellerNavbar from '@/components/penjual/SellerNavbar';
import RevenueChart from '@/components/penjual/RevenueChart';
import AvailableItemsCard from '@/components/penjual/AvailableItemsCard';
import AvailableFoodsCard from '@/components/penjual/AvailableFoodsCard';
import ActivityTable from '@/components/penjual/ActivityTable';
import StatusDot from '@/components/ui/StatusDot';
import { fraunces, gochiHand } from '@/lib/fonts';

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
    <div className="min-h-screen bg-[#FFF7E9] pb-10">
      <SellerNavbar activeTab="beranda" />

      <div className="mx-auto max-w-[1280px] px-5 pb-6 pt-24 md:px-8">
        {/* HEADER WELCOME */}
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border-2 border-[#F23A10] bg-white px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#E0452A]">
              <StatusDot />
              Dasbor penjual
            </p>
            <h1 className={`${fraunces.className} mt-3 text-3xl font-extrabold uppercase leading-[1.05] tracking-tight text-stone-900 md:text-[2.6rem]`}>
              Halo, Penjual
            </h1>
            <p className={`${gochiHand.className} mt-2 text-base leading-relaxed text-stone-600`}>
              Berikut ringkasan performa toko dan aktivitas ReOwn kamu hari ini.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-stone-900 shadow-sm">
            <span className="text-[#F23A10]">19.21.02 WIB</span>
            <span className="font-normal text-stone-500">Jum, 23 Okt 2026</span>
          </div>
        </div>

        {/* BARIS ATAS: CHART (KIRI) & STATS (KANAN) */}
        <div className="mb-7 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[1fr_340px]">
          <RevenueChart
            chartScale={chartScale}
            onScroll={handleChartScroll}
            onOpenModal={(modalName) => setActiveModal(modalName)}
            activeTooltip={activeTooltip}
            setActiveTooltip={setActiveTooltip}
          />

          <div className="flex flex-col gap-4">
            <AvailableItemsCard onOpenModal={() => setActiveModal('barang-tersedia')} />
            <AvailableFoodsCard onOpenModal={() => setActiveModal('makanan-tersedia')} />
          </div>
        </div>

        {/* BARIS BAWAH */}
        <ActivityTable />
      </div>
    </div>
  );
}