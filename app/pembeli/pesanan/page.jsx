"use client";

import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { useCart } from '@/app/pembeli/context/cart';
import { useOrderCompletion } from '@/app/pembeli/hooks/useOrderCompletion';
import { useSearchParams } from 'next/navigation';
import { useNotification } from '@/app/context/notification';

import OrderDetailModal from '@/components/pembeli/OrderDetailModal';
import ReportModal from '@/components/pembeli/ReportModal';
import OrderItemCard from '@/components/pembeli/OrderItemCard';
import { fraunces } from '@/lib/fonts';

const chipBase =
  "inline-flex shrink-0 items-center gap-2 rounded-full border-[1.5px] px-4 py-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834]";
const chipIdle = "border-stone-300 bg-white text-stone-700 hover:border-stone-900 hover:text-stone-900";
const chipActive = "border-stone-900 bg-stone-900 text-white";

const countBase =
  "grid h-5 min-w-[20px] place-items-center rounded-full px-1.5 text-[11px] font-bold transition-colors duration-200";
const countIdle = "bg-[#FBE9E2] text-[#D85834]";
const countActive = "bg-white/20 text-white";

export default function BuyerOrders() {
  const { orders = [] } = useCart();
  const { addNotification } = useNotification();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  useOrderCompletion();

  const [activeFilter, setActiveFilter] = useState('Menunggu Konfirmasi');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedReportOrder, setSelectedReportOrder] = useState(null);

  useEffect(() => {
    if (tabParam === 'proses') setActiveFilter('Dalam Proses');
    if (tabParam === 'selesai') setActiveFilter('Pesanan Selesai');
    if (tabParam === 'batal') setActiveFilter('Pesanan Dibatalkan');
  }, [tabParam]);

  const getStatus = (o) => {
    if (o?.status === 'Selesai' || o?.statusType === 'completed') return 'Pesanan Selesai';
    if (o?.status === 'Dibatalkan' || o?.statusType === 'cancelled') return 'Pesanan Dibatalkan';
    if (o?.status === 'Dalam Proses') return 'Dalam Proses';
    return 'Menunggu Konfirmasi';
  };

  const countOf = (s) => orders.filter((o) => getStatus(o) === s).length;
  const filteredOrders = orders.filter((o) => getStatus(o) === activeFilter);

  const tabs = [
    { id: 'Menunggu Konfirmasi', label: 'Menunggu Konfirmasi', short: 'Menunggu', count: countOf('Menunggu Konfirmasi') },
    { id: 'Dalam Proses', label: 'Dalam Proses', short: 'Diproses', count: countOf('Dalam Proses') },
    { id: 'Pesanan Selesai', label: 'Pesanan Selesai', short: 'Selesai', count: countOf('Pesanan Selesai') },
    { id: 'Pesanan Dibatalkan', label: 'Pesanan Dibatalkan', short: 'Dibatalkan', count: countOf('Pesanan Dibatalkan') },
  ];

  return (
    <div className="min-h-screen px-4 pb-12 pt-[110px] md:px-[50px]">
      <div className="mx-auto max-w-[1100px]">

        {/* JUDUL */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2.5">
            <Package size={26} className="text-[#D85834]" aria-hidden />
            <h1 className={`${fraunces.className} text-2xl font-extrabold uppercase leading-[1.05] tracking-tight text-stone-900 md:text-[2rem]`}>
              Pesanan Saya
            </h1>
          </div>
          <hr className="border-0 border-t border-stone-200" />
        </div>

        {/* FILTER TABS */}
        <div
          role="group"
          aria-label="Filter pesanan"
          className="mb-7 grid grid-cols-2 gap-2 sm:grid-cols-4 md:flex md:flex-wrap md:gap-2.5"
        >
          {tabs.map((tab) => {
            const on = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                aria-pressed={on}
                className={`${chipBase} ${on ? chipActive : chipIdle} min-w-0 justify-between px-3 py-2 text-xs md:justify-start md:px-4 md:text-sm`}
              >
                <span className="truncate md:hidden">{tab.short}</span>
                <span className="hidden md:inline">{tab.label}</span>
                <span className={`${countBase} ${on ? countActive : countIdle}`}>{tab.count}</span>
              </button>
            );
          })}
        </div>

        {/* LIST KARTU PESANAN */}
        <div className="flex flex-col gap-[18px]">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((item, index) => (
              <OrderItemCard
                key={item?.id || index}
                item={item}
                onSelectOrder={setSelectedOrder}
                onReportOrder={(order) => {
                  setSelectedReportOrder(order);
                  
                  // Kirim Notif ke Admin saat Pembeli Melaporkan Masalah
                  addNotification({
                    role: 'admin',
                    title: 'Laporan Kendala Baru',
                    message: `Pembeli melaporkan masalah pada pesanan ${order.productName || 'produk'}.`,
                    type: 'warning',
                    link: '/admin/laporan'
                  });
                }}
              />
            ))
          ) : (
            <div className="rounded-[22px] bg-white px-6 py-12 text-center text-sm text-stone-500 shadow-[0_12px_30px_rgba(120,70,30,0.08)] ring-1 ring-stone-100">
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
    </div>
  );
}