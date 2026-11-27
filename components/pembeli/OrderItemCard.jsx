"use client";

import React from 'react';
import { Eye, CheckCircle2, AlertCircle, Ban } from 'lucide-react';
import { useOrderCompletion } from '@/app/pembeli/hooks/useOrderCompletion';
import { fraunces } from '@/lib/fonts';

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834]";

// Kapsul outline: sama dengan tombol "Ke atas" di footer landing
const detailBtn = `inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] border-stone-900 px-4 py-1.5 text-xs font-semibold text-stone-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-stone-900 hover:text-white hover:shadow-md active:translate-y-0 active:scale-95 ${focusRing}`;

// Tombol batalkan: fill merah pudar, border & teks merah
const cancelBtn = `inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] border-red-300 bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-600 hover:bg-red-100 hover:text-red-700 hover:shadow-md active:translate-y-0 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600`;

// Tombol pesanan diterima: fill hijau pudar, border & teks hijau senada dengan tombol batalkan
const confirmBtn = `inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] border-emerald-300 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-600 hover:bg-emerald-100 hover:text-emerald-800 hover:shadow-md active:translate-y-0 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600`;

const reportBtn = `absolute right-3 top-3 z-[5] grid h-7 w-7 place-items-center rounded-full bg-stone-100 text-stone-500 shadow-sm transition-all duration-200 hover:scale-110 hover:bg-red-600 hover:text-white ${focusRing}`;

// eslint-disable-next-line no-unused-vars
export default function OrderItemCard({ item, onSelectOrder, onCancelOrder, onReportOrder, detailOnCancelled = false }) {
  const { handleConfirmCompletion } = useOrderCompletion();

  if (!item) return null;

  const isPending = !item.status || item.status === 'Menunggu Konfirmasi';
  const isProcess = item.status === 'Dalam Proses';

  const handleDirectCancel = (e) => {
    e.stopPropagation();
    const productTitle = item.productName || item.name || 'pesanan ini';
    if (window.confirm(`Yakin ingin membatalkan pesanan ${productTitle}?`)) {
      onCancelOrder && onCancelOrder(item.id);
    }
  };

  return (
    <div className="relative box-border flex min-h-[120px] flex-col gap-4 rounded-[22px] bg-white p-5 shadow-[0_12px_30px_rgba(120,70,30,0.10)] ring-1 ring-stone-100 transition-shadow duration-300 hover:shadow-[0_20px_44px_rgba(120,70,30,0.18)] sm:flex-row sm:items-center sm:p-6">

      {/* TOMBOL REPORT */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onReportOrder && onReportOrder(item);
        }}
        title="Laporkan produk/gambar bermasalah"
        aria-label="Laporkan produk/gambar bermasalah"
        className={reportBtn}
      >
        <AlertCircle size={16} aria-hidden />
      </button>

      {/* SISI KIRI: GAMBAR + DETAIL PRODUK */}
      <div className="flex items-center gap-5">
        <div className="h-[95px] w-[95px] shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 to-orange-200">
          <img
            src={item.image || item.img}
            alt={item.productName || item.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase text-[#D85834]">
            {item.id}
          </span>
          <h3 className={`${fraunces.className} m-0 text-lg font-extrabold leading-tight text-stone-900`}>
            {item.productName || item.name}
          </h3>
          <span className="text-[13px] text-stone-600">
            Toko: <strong className="font-semibold text-stone-800">{item.storeName || item.store || "Toko Rescue Batam"}</strong>
          </span>
          <span className="text-[15px] font-bold text-[#D85834]">
            {item.totalPrice || item.price}
          </span>
        </div>
      </div>

      {/* SISI KANAN: AKSI */}
      <div className="flex flex-wrap items-center gap-2.5 sm:ml-auto">
        {isPending && onCancelOrder && (
          <button
            type="button"
            onClick={handleDirectCancel}
            className={cancelBtn}
          >
            <Ban size={14} aria-hidden /> Batalkan
          </button>
        )}

        {isProcess && (
          <button
            type="button"
            onClick={() => handleConfirmCompletion(item.id, item.productName || item.name)}
            className={confirmBtn}
          >
            <CheckCircle2 size={14} aria-hidden /> Pesanan Diterima
          </button>
        )}

        <button
          type="button"
          onClick={() => onSelectOrder && onSelectOrder(item)}
          className={detailBtn}
        >
          <Eye size={14} aria-hidden /> LIHAT DETAIL
        </button>
      </div>
    </div>
  );
}