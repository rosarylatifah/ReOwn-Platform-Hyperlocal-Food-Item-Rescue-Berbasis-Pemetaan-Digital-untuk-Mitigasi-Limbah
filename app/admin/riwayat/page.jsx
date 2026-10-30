"use client";

import { useState } from "react";
import ActivityTable from "@/components/admin/ActivityTable";
import EmptyState from "@/components/admin/EmptyState";
import { DateFilter, SearchInput, SelectFilter, Toolbar } from "@/components/admin/Filters";
import Pagination, { usePaged } from "@/components/admin/Pagination";
import { toYMD } from "@/lib/admin/format";
import { useAdmin } from "@/lib/admin/store";

// Ubah status aktivitas (apa pun format tulisannya) jadi 3 kunci filter
function statusKey(a) {
  const s = String(a.status ?? "").toLowerCase();
  if (s.includes("belum") || s === "baru" || s === "pending") return "belum";
  if (s.includes("proses")) return "diproses";
  if (s.includes("selesai")) return "selesai";
  return "";
}

export default function RiwayatPage() {
  const { activities } = useAdmin();
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("semua");
  const [status, setStatus] = useState("semua");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const needle = q.trim().toLowerCase();
  const list = activities
    .filter((a) => {
      const day = toYMD(a.at);
      return (
        (a.text + " " + a.actor + " " + a.actorEmail).toLowerCase().includes(needle) &&
        (kind === "semua" || a.actorKind === kind) &&
        (status === "semua" || statusKey(a) === status) &&
        (!from || day >= from) &&
        (!to || day <= to)
      );
    })
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  const paged = usePaged(list);
  const reset = (fn) => (v) => { fn(v); paged.setPage(1); };

  return (
    <>
      <Toolbar>
        <SearchInput value={q} onChange={reset(setQ)} placeholder="Cari aktivitas atau pelaku" />
        <SelectFilter
          value={kind}
          onChange={reset(setKind)}
          label="Filter jenis"
          options={[
            { value: "semua", label: "Semua jenis" },
            { value: "admin", label: "Aksi admin" },
            { value: "pengguna", label: "Aktivitas pengguna" },
          ]}
        />
        <SelectFilter
          value={status}
          onChange={reset(setStatus)}
          label="Filter status"
          options={[
            { value: "semua", label: "Semua status" },
            { value: "belum", label: "Belum ditindak" },
            { value: "diproses", label: "Diproses" },
            { value: "selesai", label: "Selesai" },
          ]}
        />
        <DateFilter label="Dari" value={from} onChange={reset(setFrom)} />
        <DateFilter label="Sampai" value={to} onChange={reset(setTo)} />
      </Toolbar>

      <section className="adm-panel">
        {list.length === 0 ? (
          <EmptyState title="Tidak ada aktivitas" hint="Ubah kata kunci, jenis, status, atau rentang tanggal." />
        ) : (
          <>
            <ActivityTable items={paged.pageItems} showKind />
            <Pagination page={paged.page} totalPages={paged.totalPages} total={paged.total} onChange={paged.setPage} />
          </>
        )}
      </section>
    </>
  );
}