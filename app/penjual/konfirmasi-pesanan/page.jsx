"use client";

import React, { useState } from "react";
import { MapPin, Clock, User, Package, Check, X, Eye } from "lucide-react";

import SellerNavbar from "@/components/penjual/SellerNavbar";
import Footer from "@/components/common/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { fraunces } from "@/lib/fonts";
import { initialConfirmOrders } from "@/lib/penjual/confirmOrdersData";

const isFree = (price) => price === "Gratis" || price === "FREE";

export default function SellerConfirmOrders() {
  const [orders, setOrders] = useState(initialConfirmOrders);

  const handleTolak = (id, name) => {
    if (confirm(`Apakah kamu yakin ingin menolak pesanan "${name}"?`)) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      alert(`Pesanan ${name} berhasil ditolak.`);
    }
  };

  const handleTerima = (id, name) => {
    if (confirm(`Terima pesanan "${name}" dan lanjutkan ke proses pengiriman/penjemputan?`)) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      alert(`Pesanan ${name} diterima! Silakan cek menu 'Pesanan Masuk'.`);
    }
  };

  const handleLihatDetail = (item) => {
    alert(`Detail Pesanan:\nProduk: ${item.name}\nPembeli: ${item.buyer}\nLokasi: ${item.location}\nWaktu: ${item.date}\nHarga: ${item.price}`);
  };

  return (
    <>
      {/* Pita oranye di belakang navbar, sama seperti PageShell */}
      <div className="min-h-[69px] bg-[#F24827]">
        <SellerNavbar />
      </div>

      <div className="relative bg-gradient-to-b from-[#FFF7E9] via-[#FEEBCB] to-[#EDE8B8]/70">
        {/* Grid titik oranye */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(216,88,52,0.22)_1.5px,transparent_1.5px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
        />

        <main className="relative z-10 mx-auto max-w-5xl px-5 pb-20 pt-12 md:pt-16">
          <SectionHeading
            title="Konfirmasi Pesanan"
            desc="Tinjau dan konfirmasi pesanan masuk dari pembeli sebelum diproses."
          />

          <div className="mt-8 flex justify-center">
            <span className="rounded-full border border-[#D95A36]/20 bg-[#FDE3D9] px-4 py-1.5 text-sm font-bold text-[#D95A36]">
              {orders.length} Pesanan Baru
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            {orders.length > 0 ? (
              orders.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-[22px] bg-white p-5 shadow-[0_8px_24px_rgba(120,70,30,0.08)] ring-1 ring-stone-100 transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(217,90,54,0.16)] hover:ring-[#D95A36]/60 md:px-6"
                >
                  {/* Kiri: foto + info */}
                  <div className="flex items-center gap-5">
                    <div className="relative grid h-24 w-24 shrink-0 place-items-center rounded-2xl bg-[#FDE3D9]/60 text-[11px] font-medium text-stone-400">
                      Foto Produk
                      <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#D95A36]">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className={`${fraunces.className} text-lg font-extrabold leading-tight text-stone-900`}>
                          {item.name}
                        </h3>
                        <span className={`text-sm font-bold ${isFree(item.price) ? "text-emerald-700" : "text-[#D95A36]"}`}>
                          {item.price}
                        </span>
                      </div>

                      <p className="flex items-center gap-1.5 text-[13px] text-stone-600">
                        <User size={14} className="text-[#D95A36]" />
                        Pembeli: <strong className="text-stone-900">{item.buyer}</strong>
                      </p>

                      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-stone-500">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-[#D95A36]" /> {item.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} /> {item.date}
                        </span>
                      </p>

                      <button
                        type="button"
                        onClick={() => handleLihatDetail(item)}
                        className="mt-1 flex w-fit items-center gap-1.5 rounded-full bg-[#FDE3D9] px-3.5 py-1.5 text-xs font-bold text-[#D95A36] transition hover:bg-[#FBD2C2]"
                      >
                        <Eye size={13} /> Lihat Detail
                      </button>
                    </div>
                  </div>

                  {/* Kanan: aksi */}
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleTolak(item.id, item.name)}
                      className="flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-bold text-stone-700 transition hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <X size={16} /> Tolak
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTerima(item.id, item.name)}
                      className="flex items-center gap-1.5 rounded-full bg-[#D95A36] px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#C44A28] hover:shadow-lg"
                    >
                      <Check size={16} /> Terima
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[22px] border border-dashed border-[#D3C5B4] bg-white/80 px-6 py-16 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#FDE3D9] text-[#D95A36]">
                  <Package size={28} />
                </div>
                <h3 className={`${fraunces.className} mt-4 text-xl font-extrabold text-stone-900`}>
                  Semua Pesanan Sudah Dikonfirmasi!
                </h3>
                <p className="mt-1 text-[15px] text-stone-600">
                  Tidak ada antrean pesanan baru yang menunggu saat ini.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}