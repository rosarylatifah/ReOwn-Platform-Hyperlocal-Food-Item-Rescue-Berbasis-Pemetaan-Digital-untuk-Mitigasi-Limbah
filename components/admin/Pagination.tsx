"use client";

import { useState } from "react";

/** Jumlah data per halaman untuk semua tabel admin. Ubah di sini untuk mengubah semuanya. */
export const PAGE_SIZE = 20;

/** Potong daftar per halaman. Halaman otomatis dikoreksi bila daftar menyusut. */
export function usePaged<T>(items: T[], size: number = PAGE_SIZE) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / size));
  const safe = Math.min(page, totalPages);
  return {
    page: safe,
    setPage,
    totalPages,
    total: items.length,
    pageItems: items.slice((safe - 1) * size, safe * size),
  };
}

/** Nomor halaman yang ditampilkan: 1 … 4 5 6 … 12 */
function windowed(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | "…")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);
  if (start > 2) out.push("…");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push("…");
  out.push(total);
  return out;
}

/** Pager selalu tampil (selama ada data), termasuk saat hanya ada satu halaman. */
export default function Pagination({
  page, totalPages, total, onChange, size = PAGE_SIZE,
}: { page: number; totalPages: number; total: number; onChange: (p: number) => void; size?: number }) {
  if (total === 0) return null;
  const from = (page - 1) * size + 1;
  const to = Math.min(page * size, total);

  return (
    <nav className="adm-pager" aria-label="Halaman">
      <span className="adm-muted">Menampilkan {from}–{to} dari {total} data</span>
      <div className="adm-pager-ctrl">
        <button type="button" className="adm-btn adm-btn--sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Sebelumnya
        </button>
        {windowed(page, totalPages).map((n, i) =>
          n === "…" ? (
            <span key={"e" + i} className="adm-pager-gap" aria-hidden>…</span>
          ) : (
            <button
              key={n}
              type="button"
              className="adm-btn adm-btn--sm adm-pg"
              aria-current={n === page ? "page" : undefined}
              aria-label={`Halaman ${n}`}
              onClick={() => onChange(n)}
            >
              {n}
            </button>
          ),
        )}
        <button type="button" className="adm-btn adm-btn--sm" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
          Berikutnya
        </button>
      </div>
    </nav>
  );
}