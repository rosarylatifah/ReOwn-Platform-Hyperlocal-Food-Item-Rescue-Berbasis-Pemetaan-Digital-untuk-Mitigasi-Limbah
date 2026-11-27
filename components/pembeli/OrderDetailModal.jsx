"use client";

import React, { useEffect } from 'react';
import { X, MessageCircle, MapPin, Calendar, Clock, ShoppingBag, Package } from 'lucide-react';
import { useOrderDetail } from '@/app/pembeli/hooks/useOrderDetail';
import { fraunces } from '@/lib/fonts';
import { createPortal } from 'react-dom';

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834]";

const labelClass = "mb-1 block text-[11px] font-bold uppercase text-stone-500";
const fieldClass =
  "box-border w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-[9px] text-[13px] text-stone-900";
const accentFieldClass =
  "box-border flex w-full items-center gap-1.5 rounded-xl border border-[#D85834]/25 bg-[#FBE9E2] px-3 py-[9px] font-semibold text-[#D85834]";

const STATUS_BADGE = {
  "Menunggu Konfirmasi": "bg-[#FFF3E0] text-[#E65100]",
  "Dalam Proses": "bg-[#DBEAFE] text-[#1D4ED8]",
  "Selesai": "bg-[#E8F5E9] text-[#2E7D32]",
  "Pesanan Selesai": "bg-[#E8F5E9] text-[#2E7D32]",
  "Dibatalkan": "bg-[#FDECEA] text-[#C62828]",
  "Pesanan Dibatalkan": "bg-[#FDECEA] text-[#C62828]",
};

export default function OrderDetailModal({ order, onClose, onCancelOrder }) {
  const isOpen = Boolean(order);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const details = useOrderDetail(order, onClose, onCancelOrder);

  if (!order || !details) return null;

  const {
    currentStatus,
    buyerName,
    sellerName,
    sellerAddress,
    productName,
    orderDate,
    confirmDate,
    totalPrice,
    deliveryOption,
    productImage,
    description,
    handleContactSeller,
  } = details;

  const badgeClass = STATUS_BADGE[currentStatus] || STATUS_BADGE["Menunggu Konfirmasi"];

  return createPortal(
    <div
      onClick={onClose}
      className="fixed left-0 top-0 z-[1100] box-border flex h-screen w-screen items-center justify-center bg-black/45 p-5 backdrop-blur-[5px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-[720px] overflow-y-auto rounded-[22px] bg-white p-5 shadow-[0_24px_50px_rgba(120,70,30,0.22)] ring-1 ring-stone-100 sm:p-7"
      >
        {/* Header Title & Close Button */}
        <div className="mb-5 flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase text-[#D85834]">
                ID: {order.id || 'REQ-000'}
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${badgeClass}`}>
                {currentStatus}
              </span>
            </div>
            <h3 className={`${fraunces.className} mt-0.5 text-xl font-extrabold text-stone-900 sm:text-[21px]`}>
              Rincian Detail Pesanan
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-[1.5px] border-stone-900 text-stone-900 transition-colors duration-200 hover:bg-stone-900 hover:text-white ${focusRing}`}
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        {/* MAIN GRID: 2 KOLOM (mobile: 1 kolom) */}
        <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2">

          {/* SISI KIRI: Detail Info Utama */}
          <div className="flex flex-col gap-2.5">
            <div>
              <label className={labelClass}>Nama Produk</label>
              <div className={`${fieldClass} flex items-center gap-1.5 font-bold`}>
                <Package size={14} className="text-[#D85834]" aria-hidden />
                <span>{productName}</span>
              </div>
            </div>

            <div>
              <label className={labelClass}>Nama Pembeli</label>
              <div className={fieldClass}>{buyerName}</div>
            </div>

            <div>
              <label className={labelClass}>Nama Penjual / Toko</label>
              <div className={`${fieldClass} font-semibold`}>{sellerName}</div>
            </div>

            <div>
              <label className={labelClass}>Area Penjual</label>
              <div className={`${fieldClass} flex items-start gap-1.5 text-xs leading-snug text-stone-600`}>
                <MapPin size={14} className="mt-0.5 shrink-0 text-[#D85834]" aria-hidden />
                <span>{sellerAddress}</span>
              </div>
            </div>

            <div>
              <label className={labelClass}>Tanggal Pemesanan</label>
              <div className={`${fieldClass} flex items-center gap-1.5 text-xs`}>
                <Calendar size={14} className="text-stone-500" aria-hidden />
                <span>{orderDate}</span>
              </div>
            </div>

            {/* Tanggal Konfirmasi Penjual (HANYA MUNCUL DI STATUS DALAM PROSES) */}
            {(order.confirmDate || currentStatus === 'Dalam Proses') && (
              <div>
                <label className={`${labelClass} text-[#D85834]`}>Tanggal Konfirmasi Penjual</label>
                <div className={`${accentFieldClass} text-xs`}>
                  <Clock size={14} aria-hidden />
                  <span>{confirmDate}</span>
                </div>
              </div>
            )}

            <div className="mt-auto">
              <label className={labelClass}>Total Pembayaran</label>
              <div className={`${accentFieldClass} px-3.5 py-2.5 text-[15px] font-bold`}>
                <ShoppingBag size={16} aria-hidden />
                <span>{totalPrice}</span>
              </div>
            </div>
          </div>

          {/* SISI KANAN: Gambar, Deskripsi, Pengantaran & Aksi */}
          <div className="flex flex-col gap-2.5">

            {/* Gambar Produk */}
            <div className="h-[136px] w-full shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 to-orange-200 ring-1 ring-stone-100">
              <img
                src={productImage}
                alt={productName}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Deskripsi Produk */}
            <div className="flex flex-1 flex-col">
              <label className={labelClass}>Deskripsi Produk</label>
              <div className={`${fieldClass} min-h-[112px] flex-1 py-2.5 text-xs leading-relaxed text-stone-600`}>
                {description || "-"}
              </div>
            </div>

            {/* Opsi Pengantaran */}
            <div>
              <label className={labelClass}>Opsi Pengantaran</label>
              <div className={`${fieldClass} text-xs font-semibold`}>{deliveryOption}</div>
            </div>

            {/* AREA TOMBOL AKSI */}
            <div className="mt-auto pt-1">
              <button
                type="button"
                onClick={handleContactSeller}
                className={`flex w-full items-center justify-center gap-2 rounded-full border-[1.5px] border-[#D85834] bg-white px-4 py-2.5 text-[13px] font-bold text-[#D85834] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#D85834] hover:text-white hover:shadow-md active:translate-y-0 active:scale-95 ${focusRing}`}
              >
                <MessageCircle size={16} aria-hidden /> Hubungi Penjual
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}