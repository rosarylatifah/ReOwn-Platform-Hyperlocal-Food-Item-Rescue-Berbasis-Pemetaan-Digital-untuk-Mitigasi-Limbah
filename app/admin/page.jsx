"use client";

import Link from "next/link";
import { useState } from "react";
import ActivityTable from "@/components/admin/ActivityTable";
import EmptyState from "@/components/admin/EmptyState";
import ReviewQueue from "@/components/admin/ReviewQueue";
import StatCard from "@/components/admin/StatCard";
import TrendChart from "@/components/admin/TrendChart";
import { fmtDayLong, toYMD } from "@/lib/admin/format";
import { useAdmin } from "@/lib/admin/store";

export default function AdminDashboardPage() {
  const { users, products, counts, activities } = useAdmin();
  // tanggal yang dipilih di grafik; null = tampilkan aktivitas terbaru
  const [day, setDay] = useState(null);

  const activeUsers = users.filter((u) => u.status === "aktif" || u.status === "peringatan").length;
  const restricted = users.filter((u) => u.status === "suspend" || u.status === "banned").length;
  const activeProducts = products.filter((p) => p.status === "aktif").length;
  const removed = products.length - activeProducts;

  const dayItems = day
    ? activities
        .filter((a) => toYMD(a.at) === day)
        .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    : null;

  return (
    <>
      <div className="adm-stats">
        <StatCard
          label="Pengguna aktif"
          value={activeUsers}
          note={`${restricted} akun disuspend atau di-ban`}
          href="/admin/pengguna"
          cta="Kelola pengguna"
        />
        <StatCard
          hot
          label="Laporan dan moderasi masuk"
          value={counts.inbox}
          note={`${counts.newReports} laporan baru, ${counts.pendingAppeals} banding menunggu`}
          href="/admin/laporan"
          cta="Tinjau laporan"
        />
        <StatCard
          label="Produk sedang aktif"
          value={activeProducts}
          note={`${removed} produk sedang diturunkan`}
          href="/admin/produk"
          cta="Kelola produk"
        />
      </div>

      <ReviewQueue />
      <TrendChart pickedDay={day} onPickDay={setDay} />

      <section className="adm-panel" id="adm-dash-history">
        <div className="adm-panel-h">
          <h2>{day ? `Riwayat aktivitas di tanggal ${fmtDayLong(day)}` : "Riwayat aktivitas terbaru"}</h2>
          <div className="adm-panel-actions">
            {day && (
              <button type="button" className="adm-btn adm-btn--sm" onClick={() => setDay(null)}>Tampilkan terbaru</button>
            )}
            <Link className="adm-link" href="/admin/riwayat">Lihat semua</Link>
          </div>
        </div>
        {dayItems && dayItems.length === 0 ? (
          <EmptyState
            title="Tidak ada aktivitas pada tanggal ini"
            hint="Pilih tanggal lain di grafik, atau klik Tampilkan terbaru."
          />
        ) : (
          <ActivityTable items={dayItems ?? activities.slice(0, 5)} />
        )}
      </section>
    </>
  );
}