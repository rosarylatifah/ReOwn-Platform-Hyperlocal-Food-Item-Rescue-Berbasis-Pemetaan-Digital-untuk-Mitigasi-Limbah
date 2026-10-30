"use client";

import React from "react";
import { MapPin, Clock, User, PackageCheck, Eye, CheckCircle2, Check, X } from "lucide-react";

import SellerNavbar from "@/components/penjual/SellerNavbar";
import SectionHeading from "@/components/ui/SectionHeading";
import { fraunces } from "@/lib/fonts";
import { useOrders } from "@/lib/ordersStore";

const isFree = (price) => /^(gratis|free)$/i.test(String(price || "").trim());

const STATUS_STYLE = {
  "Menunggu Konfirmasi": { statusColor: "#E65100", statusBg: "#FFF3E0" },
  "Dalam Proses": { statusColor: "#D95A36", statusBg: "#FDE3D9" },
  Selesai: { statusColor: "#2E7D32", statusBg: "#E8F5E9" },
  Dibatalkan: { statusColor: "#C62828", statusBg: "#FDECEA" },
};

const TABS = [
  { id: "Menunggu Konfirmasi", label: "Konfirmasi Pesanan", short: "Konfirmasi" },
  { id: "Dalam Proses", label: "Dalam Proses", short: "Diproses" },
  { id: "Selesai", label: "Selesai", short: "Selesai" },
  { id: "Dibatalkan", label: "Dibatalkan", short: "Batal" },
];

const EMPTY = {
  "Menunggu Konfirmasi": ["Semua Pesanan Sudah Dikonfirmasi!", "Tidak ada antrean pesanan baru yang menunggu saat ini."],
  "Dalam Proses": ["Tidak Ada Pesanan Diproses", "Pesanan yang kamu terima akan muncul di sini."],
  Selesai: ["Belum Ada Pesanan Selesai", "Pesanan yang sudah diserahterimakan akan muncul di sini."],
  Dibatalkan: ["Tidak Ada Pesanan Dibatalkan", "Pesanan yang ditolak atau dibatalkan akan muncul di sini."],
};

const btnOutline =
  "flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-bold text-stone-700 transition hover:border-red-500 hover:bg-red-50 hover:text-red-600";
const btnPrimary =
  "flex items-center gap-1.5 rounded-full bg-[#D95A36] px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#C44A28] hover:shadow-lg";

// Ubah bentuk pesanan pembeli menjadi bentuk yang dipakai tampilan penjual
const toView = (o) => {
  const status = o.status || "Menunggu Konfirmasi";
  return {
    ...o,
    status,
    name: o.productName || o.name,
    buyer: o.buyerName || o.buyer || "Pembeli",
    price: o.totalPrice || o.price,
    date: o.createdAt || o.orderDate || "-",
    location: o.pickupLocation || o.deliveryOption || "-",
    category: o.category || "Barang",
    ...(STATUS_STYLE[status] || STATUS_STYLE["Menunggu Konfirmasi"]),
  };
};

export default function SellerOrders() {
  const { orders, updateOrder, cancelOrder } = useOrders();
  const [activeTab, setActiveTab] = React.useState("Menunggu Konfirmasi");

  const items = orders.map(toView);
  const countOf = (s) => items.filter((o) => o.status === s).length;
  const visible = items.filter((o) => o.status === activeTab);

  const handleTerima = (item) => {
    if (confirm(`Terima pesanan "${item.name}" dan lanjutkan ke proses pengiriman/penjemputan?`)) {
      updateOrder(item.id, {
        status: "Dalam Proses",
        statusType: "process",
        confirmDate: new Date().toISOString(),
      });
    }
  };

  const handleTolak = (item) => {
    if (confirm(`Apakah kamu yakin ingin menolak pesanan "${item.name}"?`)) {
      cancelOrder(item.id); // stok dikembalikan otomatis
    }
  };

  const handleSelesai = (item) => {
    if (confirm(`Apakah kamu yakin ingin menyelesaikan pesanan "${item.name}"?`)) {
      updateOrder(item.id, {
        status: "Selesai",
        statusType: "success",
        completedAt: new Date().toLocaleString("id-ID", {
          day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
        }),
      });
    }
  };

  const handleLihatDetail = (item) => {
    alert(
      `Detail Pesanan:\nProduk: ${item.name}\nJumlah: ${item.quantity || 1}\nPembeli: ${item.buyer}\nPengantaran: ${item.deliveryOption || "-"}\nStatus: ${item.status}\nWaktu: ${item.date}\nHarga: ${item.price}`
    );
  };

  return (
    <>
      <div className="min-h-[69px] bg-[#F24827]">
        <SellerNavbar />
      </div>

      <div className="relative min-h-screen bg-[#FFF7E9]">
        <main className="relative z-10 mx-auto max-w-5xl px-5 pb-20 pt-12 md:pt-16">
          <SectionHeading
            title="Pesanan"
            desc="Konfirmasi pesanan baru, pantau yang sedang diproses, dan lihat pesanan yang sudah selesai atau dibatalkan."
          />

          {/* TAB */}
          <div
            role="group"
            aria-label="Filter pesanan"
            className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 md:mx-auto md:flex md:flex-wrap md:justify-center md:gap-2.5"
          >
            {TABS.map((tab) => {
              const on = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-pressed={on}
                  className={`inline-flex min-w-0 items-center justify-between gap-2 rounded-full border-[1.5px] px-3 py-2 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95 md:justify-start md:px-4 md:text-sm ${
                    on
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-300 bg-white text-stone-700 hover:border-stone-900 hover:text-stone-900"
                  }`}
                >
                  <span className="truncate md:hidden">{tab.short}</span>
                  <span className="hidden md:inline">{tab.label}</span>
                  <span
                    className={`grid h-5 min-w-[20px] place-items-center rounded-full px-1.5 text-[11px] font-bold ${
                      on ? "bg-white/20 text-white" : "bg-[#FBE9E2] text-[#D85834]"
                    }`}
                  >
                    {countOf(tab.id)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* DAFTAR */}
          <div className="mt-8 flex flex-col gap-4">
            {visible.length > 0 ? (
              visible.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-[22px] bg-white p-5 shadow-[0_8px_24px_rgba(120,70,30,0.08)] ring-1 ring-stone-100 transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(217,90,54,0.16)] hover:ring-[#D95A36]/60 md:px-6"
                >
                  <div className="flex items-center gap-5">
                    <div className="relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#FDE3D9]/60 text-[11px] font-medium text-stone-400">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        "Foto Produk"
                      )}
                      <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#D95A36]">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className={`${fraunces.className} text-lg font-extrabold leading-tight text-stone-900`}>
                          {item.name}
                          {item.quantity > 1 && <span className="ml-2 text-sm text-stone-500">x{item.quantity}</span>}
                        </h3>
                        <span className={`text-sm font-bold ${isFree(item.price) ? "text-emerald-700" : "text-[#D95A36]"}`}>
                          {item.price}
                        </span>
                      </div>

                      <span
                        className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                        style={{ backgroundColor: item.statusBg, color: item.statusColor }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.statusColor }} />
                        {item.status}
                      </span>

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

                  {item.status === "Menunggu Konfirmasi" && (
                    <div className="flex items-center gap-2.5">
                      <button type="button" onClick={() => handleTolak(item)} className={btnOutline}>
                        <X size={16} /> Tolak
                      </button>
                      <button type="button" onClick={() => handleTerima(item)} className={btnPrimary}>
                        <Check size={16} /> Terima
                      </button>
                    </div>
                  )}
                  {item.status === "Dalam Proses" && (
                    <button type="button" onClick={() => handleSelesai(item)} className={btnPrimary}>
                      <CheckCircle2 size={16} /> Konfirmasi Selesai
                    </button>
                  )}
                </article>
              ))
            ) : (
              <div className="rounded-[22px] border border-dashed border-[#D3C5B4] bg-white/80 px-6 py-16 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#FDE3D9] text-[#D95A36]">
                  <PackageCheck size={28} />
                </div>
                <h3 className={`${fraunces.className} mt-4 text-xl font-extrabold text-stone-900`}>
                  {EMPTY[activeTab][0]}
                </h3>
                <p className="mt-1 text-[15px] text-stone-600">{EMPTY[activeTab][1]}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}