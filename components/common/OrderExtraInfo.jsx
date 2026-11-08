"use client";

import React from "react";
import { Check, X as XIcon, Hash, Tag } from "lucide-react";

const fmt = (d) => {
  if (!d) return null;
  const t = new Date(d);
  return isNaN(t)
    ? String(d)
    : t.toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const chip =
  "flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-700";

// Info tambahan yang dipakai bersama oleh OrderDetailModal (pembeli) dan SellerOrderModal (penjual)
export default function OrderExtraInfo({ order }) {
  if (!order) return null;

  const status = order.status;
  const cancelled = status === "Dibatalkan";
  const confirmed = !!order.confirmDate || status === "Dalam Proses" || status === "Selesai";
  const finished = status === "Selesai";

  const steps = [
    { label: "Pesanan dibuat", date: fmt(order.orderDate || order.createdAt || order.date), done: true },
    { label: "Dikonfirmasi penjual", date: fmt(order.confirmDate), done: confirmed },
    cancelled
      ? { label: "Dibatalkan", date: fmt(order.canceledAt), done: true, bad: true }
      : { label: "Selesai diserahterimakan", date: fmt(order.completedAt), done: finished },
  ];

  return (
    <div className="mt-5 border-t border-stone-200 pt-4">
      {(order.quantity || order.category) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {order.quantity && (
            <span className={chip}>
              <Hash size={13} className="text-[#D85834]" aria-hidden /> Jumlah: <b>{order.quantity} porsi</b>
            </span>
          )}
          {order.category && (
            <span className={chip}>
              <Tag size={13} className="text-[#D85834]" aria-hidden /> Kategori: <b>{order.category}</b>
            </span>
          )}
        </div>
      )}

      <p className="mb-2 text-[11px] font-bold uppercase text-stone-500">Status Pesanan</p>
      <ol className="flex flex-col gap-3">
        {steps.map((s) => (
          <li key={s.label} className="flex items-start gap-3">
            <span
              className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white ${
                s.bad ? "bg-red-500" : s.done ? "bg-[#D85834]" : "bg-stone-300"
              }`}
            >
              {s.bad ? <XIcon size={12} aria-hidden /> : s.done ? <Check size={12} aria-hidden /> : null}
            </span>
            <div className="leading-tight">
              <p className={`text-[13px] font-semibold ${s.done ? "text-stone-900" : "text-stone-400"}`}>{s.label}</p>
              {s.date && <p className="mt-0.5 text-[11px] text-stone-500">{s.date}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
