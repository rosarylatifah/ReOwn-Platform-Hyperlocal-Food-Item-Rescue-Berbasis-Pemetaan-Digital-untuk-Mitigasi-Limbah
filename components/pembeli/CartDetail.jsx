"use client";

import React from 'react';
import { X, MessageCircle, Clock, Package, MapPin } from 'lucide-react';
import { fraunces } from '@/lib/fonts';

const labelClass = "mb-1 block text-xs font-semibold text-stone-600";
const fieldClass =
  "w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-[13px] font-medium text-stone-900";

export default function CartDetail({ order, onClose }) {
  if (!order) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 p-5 backdrop-blur-sm"
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-[680px] overflow-y-auto rounded-[26px] border border-stone-100 bg-white p-7 shadow-[0_20px_44px_rgba(120,70,30,0.15)]"
      >
        {/* Tombol Close '✕' */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-[18px] top-[18px] grid h-8 w-8 place-items-center rounded-full bg-stone-100 text-stone-600 transition-colors duration-200 hover:bg-stone-200 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834]"
        >
          <X size={18} />
        </button>

        <h3 className={`${fraunces.className} mb-5 pr-10 text-xl font-extrabold leading-tight text-stone-900`}>
          Detail Item: {order.name}
        </h3>

        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
          {/* SISI KIRI: Informasi Toko, Alamat, Kuantitas, & Expired */}
          <div className="flex flex-col gap-3.5">
            {/* Nama Penjual */}
            <div>
              <label className={labelClass}>Nama Penjual / Toko:</label>
              <div className={fieldClass}>
                {order.store || order.sellerName || 'Toko Rescue Batam'}
              </div>
            </div>

            {/* Alamat Penjual */}
            <div>
              <label className={labelClass}>Alamat / Lokasi Toko:</label>
              <div className={`${fieldClass} flex items-start gap-1.5 text-xs leading-snug text-stone-600`}>
                <MapPin size={14} className="mt-0.5 shrink-0 text-[#D85834]" />
                <span>{order.location || order.sellerAddress || 'Jl. Ahmad Yani, Batam Center, Batam'}</span>
              </div>
            </div>

            {/* Kuantitas & Batas Waktu / Expired */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className={labelClass}>Jumlah Rescue:</label>
                <div className={`${fieldClass} flex items-center gap-1.5 font-bold`}>
                  <Package size={14} className="shrink-0 text-[#D85834]" /> {order.quantity || 1} Porsi
                </div>
              </div>

              <div>
                <label className={labelClass}>Batas Ambil / Exp:</label>
                <div className={`${fieldClass} flex items-center gap-1.5 text-xs font-bold text-red-600`}>
                  <Clock size={14} className="shrink-0" /> {order.expiryTime || 'Hari ini, 21:00'}
                </div>
              </div>
            </div>

            {/* Total Pembayaran */}
            <div>
              <label className={labelClass}>Total Harga:</label>
              <div className={`${fraunces.className} w-full rounded-xl border border-[#D85834]/20 bg-[#FBE9E2] px-3.5 py-2.5 text-base font-extrabold text-[#D85834]`}>
                {order.price || order.totalPrice}
              </div>
            </div>
          </div>

          {/* SISI KANAN: Gambar, Deskripsi, & Tombol Hubungi Penjual */}
          <div className="flex flex-col gap-3.5">
            {/* Gambar Produk */}
            <div className="h-[140px] w-full overflow-hidden rounded-2xl border border-stone-100 bg-gradient-to-br from-amber-100 to-orange-200">
              <img
                src={order.image}
                alt={order.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className={labelClass}>Deskripsi Produk:</label>
              <div className="min-h-[95px] w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-xs leading-relaxed text-stone-600">
                {order.description || `${order.name} adalah produk makanan berlebih berkualitas tinggi yang siap diselamatkan dari toko ${order.store || 'merchant'}.`}
              </div>
            </div>

            {/* Tombol Hubungi Penjual */}
            <button
              type="button"
              onClick={() => alert(`Menghubungi penjual ${order.store || order.sellerName || 'Toko'} terkait produk ${order.name}`)}
              className="mt-2.5 inline-flex items-center justify-center gap-2 rounded-xl border-[1.5px] border-stone-800 px-4 py-3 text-sm font-semibold text-stone-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-stone-900 hover:text-[#FFF7E9] hover:shadow-md active:translate-y-0 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834]"
            >
              <MessageCircle size={16} /> Hubungi Penjual
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}