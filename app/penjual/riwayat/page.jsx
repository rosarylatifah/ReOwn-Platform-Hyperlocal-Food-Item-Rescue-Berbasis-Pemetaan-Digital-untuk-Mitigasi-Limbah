"use client";

import React, { useState } from "react";
import { Eye, CheckCircle2, XCircle, ShoppingBag, Layers, History } from "lucide-react";

import SellerNavbar from "@/components/penjual/SellerNavbar";
import Footer from "@/components/common/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import OrderDetailModal from "@/components/pembeli/OrderDetailModal";
import { fraunces } from "@/lib/fonts";
import { sellerHistoryOrders } from "@/lib/penjual/historyData";

const STATUS_STYLE = {
  completed: {
    cls: "border-green-200 bg-green-100 text-green-700",
    Icon: CheckCircle2,
  },
  cancelled: {
    cls: "border-red-200 bg-red-100 text-red-700",
    Icon: XCircle,
  },
};

function StatusBadge({ type, text }) {
  const { cls, Icon } = STATUS_STYLE[type] ?? STATUS_STYLE.cancelled;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${cls}`}>
      <Icon size={14} /> {text}
    </span>
  );
}

export default function SellerHistory() {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const totalCount = sellerHistoryOrders.length;
  const completedCount = sellerHistoryOrders.filter((o) => o.status === "Selesai").length;
  const cancelledCount = sellerHistoryOrders.filter((o) => o.status === "Dibatalkan").length;

  const filteredOrders = sellerHistoryOrders.filter((item) => {
    if (activeFilter === "Selesai") return item.status === "Selesai";
    if (activeFilter === "Dibatalkan") return item.status === "Dibatalkan";
    return true;
  });

  const filters = [
    { key: "Semua", label: "Semua Transaksi", count: totalCount, Icon: Layers },
    { key: "Selesai", label: "Selesai", count: completedCount, Icon: ShoppingBag },
    { key: "Dibatalkan", label: "Dibatalkan", count: cancelledCount, Icon: XCircle },
  ];

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
            title="Riwayat Pesanan Toko"
            desc="Lihat semua transaksi yang sudah selesai maupun dibatalkan."
          />

          {/* Filter pill */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {filters.map(({ key, label, count, Icon }) => {
              const active = activeFilter === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveFilter(key)}
                  aria-pressed={active}
                  className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-md ${
                    active
                      ? "border-[#D95A36] bg-[#D95A36] text-white shadow-md"
                      : "border-stone-200 bg-white text-stone-800"
                  }`}
                >
                  <Icon size={16} className={active ? "text-white" : "text-[#D95A36]"} />
                  {label}: <strong>{count}</strong>
                </button>
              );
            })}
          </div>

          {/* Daftar riwayat */}
          <div className="mt-8 flex flex-col gap-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((item) => (
                <article
                  key={item.id}
                  className="group flex flex-wrap items-center justify-between gap-4 rounded-[22px] bg-white p-5 shadow-[0_8px_24px_rgba(120,70,30,0.08)] ring-1 ring-stone-100 transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(217,90,54,0.16)] hover:ring-[#D95A36]/60 md:px-6"
                >
                  <div className="flex items-center gap-5">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs text-stone-500">{item.orderDate}</span>
                      <h3
                        className={`${fraunces.className} text-lg font-extrabold leading-tight text-stone-900 transition-colors group-hover:text-[#D95A36]`}
                      >
                        {item.name}
                      </h3>
                      <span className="text-[15px] font-bold text-[#D95A36]">{item.totalPrice}</span>

                      <button
                        type="button"
                        onClick={() => setSelectedOrder(item)}
                        className="mt-1 flex w-fit items-center gap-1.5 rounded-full bg-[#FDE3D9] px-3.5 py-1.5 text-xs font-bold text-[#D95A36] transition hover:bg-[#FBD2C2]"
                      >
                        <Eye size={13} /> Lihat Detail
                      </button>
                    </div>
                  </div>

                  <StatusBadge type={item.statusType} text={item.status} />
                </article>
              ))
            ) : (
              <div className="rounded-[22px] border border-dashed border-[#D3C5B4] bg-white/80 px-6 py-16 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#FDE3D9] text-[#D95A36]">
                  <History size={28} />
                </div>
                <h3 className={`${fraunces.className} mt-4 text-xl font-extrabold text-stone-900`}>
                  Belum Ada Riwayat
                </h3>
                <p className="mt-1 text-[15px] text-stone-600">
                  Tidak ada riwayat pesanan dengan status &quot;{activeFilter}&quot;.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />

      <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </>
  );
}