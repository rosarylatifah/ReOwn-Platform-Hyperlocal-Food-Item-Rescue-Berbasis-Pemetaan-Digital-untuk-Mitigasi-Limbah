"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation"; // 👈 1. Import router Next.js
import { fraunces } from "@/lib/fonts";
import StatusDot from "@/components/ui/StatusDot";
import { useOrders } from "@/lib/ordersStore";

export default function ActivityTable() {
  const { orders } = useOrders();
  const router = useRouter(); // 👈 2. Inisialisasi router
  const [searchTerm, setSearchTerm] = useState("");

  const orderActivities = orders.map((order) => {
    const status = order.status || "Menunggu Konfirmasi";
    const buyerName = order.buyerName || order.buyer || "Pembeli";
    const productName = order.productName || order.name || "Produk";
    
    let activityText = "";
    switch (status) {
      case "Menunggu Konfirmasi":
        activityText = `Menerima pesanan baru "${productName}" dari ${buyerName}`;
        break;
      case "Dalam Proses":
        activityText = `Menerima dan memproses pesanan "${productName}" milik ${buyerName}`;
        break;
      case "Selesai":
        activityText = `Berhasil menyerahterimakan pesanan "${productName}" kepada ${buyerName}`;
        break;
      case "Dibatalkan":
        activityText = `Pesanan "${productName}" dari ${buyerName} ditolak/dibatalkan`;
        break;
      default:
        activityText = `Pembaruan status pesanan "${productName}"`;
    }

    // Pemetaan tab target URL di halaman pesanan penjual
    let targetTab = "Menunggu Konfirmasi";
    if (status === "Dalam Proses") targetTab = "Dalam Proses";
    if (status === "Selesai") targetTab = "Selesai";
    if (status === "Dibatalkan") targetTab = "Dibatalkan";

    return {
      id: order.id,
      time: order.createdAt || order.orderDate || "Baru saja",
      user: buyerName,
      activity: activityText,
      category: "Pesanan",
      status: status,
      targetUrl: `/penjual/pesanan?tab=${encodeURIComponent(targetTab)}`, // 👈 URL tujuan saat baris diklik
    };
  });

  const filteredActivities = orderActivities.filter(
    (item) =>
      item.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Selesai":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Dalam Proses":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Menunggu Konfirmasi":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Dibatalkan":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-stone-50 text-stone-700 border-stone-200";
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b border-stone-200/60 pb-3">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full border border-[#F23A10]/40 bg-white px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#F23A10]">
            <StatusDot /> Log & Aktivitas
          </p>
          <h2 className={`${fraunces.className} mt-1.5 text-2xl font-extrabold uppercase text-stone-900`}>
            Riwayat Aktivitas Toko
          </h2>
        </div>

        <div className="w-full sm:w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
            <input
              type="text"
              placeholder="Cari aktivitas atau pembeli..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white py-2 pl-9 pr-3 text-xs font-medium text-stone-800 shadow-sm focus:border-[#F23A10] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_10px_30px_rgba(120,70,30,0.08)] ring-1 ring-stone-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-100 bg-[#FFF3ED]/60 text-[11px] font-bold uppercase tracking-wider text-stone-600">
                <th className="py-3.5 pl-6 pr-4">Waktu</th>
                <th className="py-3.5 px-4">Pembeli / Pengguna</th>
                <th className="py-3.5 px-4">Aktivitas yang Dilakukan</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 pl-4 pr-6">Status Pesanan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => router.push(item.targetUrl)} // 👈 3. Aksi klik langsung pindah halaman & buka tab yang sesuai!
                    className="cursor-pointer transition-colors hover:bg-[#FFF7E9]/60 group"
                    title="Klik untuk melihat detail di halaman Pesanan"
                  >
                    <td className="py-3.5 pl-6 pr-4 whitespace-nowrap text-stone-500 font-mono text-[11px]">
                      {item.time}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-stone-900 whitespace-nowrap group-hover:text-[#F23A10] transition-colors">
                      {item.user}
                    </td>
                    <td className="py-3.5 px-4 text-stone-800">
                      {item.activity}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="rounded-md bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-600">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 pl-4 pr-6 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-[11px] font-bold ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-stone-500">
                    Belum ada riwayat aktivitas pesanan tercatat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}