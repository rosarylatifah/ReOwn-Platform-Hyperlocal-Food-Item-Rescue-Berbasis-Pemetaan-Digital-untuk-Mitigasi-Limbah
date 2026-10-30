"use client";

import React, { useState, useEffect } from 'react';
import { History } from 'lucide-react';

import OrderDetailModal from '@/components/pembeli/OrderDetailModal';
import ReportModal from '@/components/pembeli/ReportModal';
import OrderItemCard from '@/components/pembeli/OrderItemCard';
import { fraunces } from '@/lib/fonts';

// Gaya chip filter: mengikuti chip filter di ItemCarousel landing
const chipBase =
  "inline-flex shrink-0 items-center gap-2 rounded-full border-[1.5px] px-4 py-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834]";
const chipIdle = "border-stone-300 bg-white text-stone-700 hover:border-stone-900 hover:text-stone-900";
const chipActive = "border-stone-900 bg-stone-900 text-white";

const countBase =
  "grid h-5 min-w-[20px] place-items-center rounded-full px-1.5 text-[11px] font-bold transition-colors duration-200";
const countIdle = "bg-[#FBE9E2] text-[#D85834]";
const countActive = "bg-white/20 text-white";

export default function BuyerHistory() {
  const [historyOrders, setHistoryOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Semua');

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedReportOrder, setSelectedReportOrder] = useState(null);

  // Ambil data riwayat dari localStorage saat halaman dimuat
  useEffect(() => {
    const savedHistory = localStorage.getItem('reown_order_history');
    if (savedHistory) {
      try {
        setHistoryOrders(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Gagal parsing riwayat pesanan:", e);
      }
    }
  }, []);

  const totalCount = historyOrders.length;
  const completedCount = historyOrders.filter(o => o.status === 'Selesai').length;
  const cancelledCount = historyOrders.filter(o => o.status === 'Dibatalkan').length;

  const filteredOrders = historyOrders.filter((item) => {
    if (activeFilter === 'Selesai') return item.status === 'Selesai';
    if (activeFilter === 'Dibatalkan') return item.status === 'Dibatalkan';
    return true;
  });

  const tabs = [
    { id: 'Semua', label: 'Semua Transaksi', count: totalCount },
    { id: 'Selesai', label: 'Selesai Di-rescue', count: completedCount },
    { id: 'Dibatalkan', label: 'Dibatalkan', count: cancelledCount },
  ];

  return (
    <div className="min-h-screen px-4 pb-12 pt-[110px] md:px-[50px]">
      <div className="mx-auto max-w-[1100px]">

        {/* JUDUL UTAMA */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2.5">
            <History size={26} className="text-[#D85834]" aria-hidden />
            <h1 className={`${fraunces.className} text-2xl font-extrabold uppercase leading-[1.05] tracking-tight text-stone-900 md:text-[2rem]`}>
              Riwayat Pesanan
            </h1>
          </div>
          <hr className="border-0 border-t border-stone-200" />
        </div>

        {/* FILTER TABS (mobile: bisa digeser horizontal) */}
        <div
          role="group"
          aria-label="Filter riwayat pesanan"
          className="-mx-4 mb-7 flex gap-2.5 overflow-x-auto px-4 pb-2 pt-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
        >
          {tabs.map((tab) => {
            const on = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                aria-pressed={on}
                className={`${chipBase} ${on ? chipActive : chipIdle}`}
              >
                {tab.label}
                <span className={`${countBase} ${on ? countActive : countIdle}`}>{tab.count}</span>
              </button>
            );
          })}
        </div>

        {/* DAFTAR KARTU PESANAN */}
        <div className="flex flex-col gap-[18px]">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((item, index) => (
<OrderItemCard
  key={item?.id || index}
  item={item}
  detailOnCancelled
  onSelectOrder={setSelectedOrder}
  onReportOrder={(order) => setSelectedReportOrder(order)}
/>
            ))
          ) : (
            <div className="rounded-[22px] bg-white px-6 py-12 text-center text-sm text-stone-500 shadow-[0_12px_30px_rgba(120,70,30,0.08)] ring-1 ring-stone-100">
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
    </div>
  );
}
