"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { fmtDateTime } from "@/lib/admin/format";
import { useAdmin } from "@/lib/admin/store";

export default function NotificationBell() {
  const { reports, appeals, getUser } = useAdmin();
  const [open, setOpen] = useState(false);
  const box = useRef(null);

  const name = (id) => getUser(id)?.username ?? "pengguna";
  const all = [
    ...reports
      .filter((r) => r.status === "baru")
      .map((r) => ({ id: r.id, at: r.createdAt, text: `Laporan baru: ${name(r.reporterId)} melaporkan ${name(r.reportedUserId)}` })),
    ...appeals
      .filter((a) => a.status === "menunggu")
      .map((a) => ({ id: a.id, at: a.createdAt, text: `${name(a.userId)} mengajukan banding` })),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (box.current && !box.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="adm-bell-wrap" ref={box}>
      <button
        type="button"
        className="adm-bell"
        aria-label={`Notifikasi, ${all.length} baru`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
        </svg>
        {all.length > 0 && <span className="adm-bell-dot">{all.length}</span>}
      </button>
      {open && (
        <div className="adm-notif">
          <h2>Notifikasi</h2>
          {all.length === 0 ? (
            <p className="adm-notif-empty">Tidak ada yang perlu ditinjau.</p>
          ) : (
            all.slice(0, 6).map((n) => (
              <Link key={n.id} href="/admin/laporan" className="adm-notif-item" onClick={() => setOpen(false)}>
                {n.text}
                <small>{fmtDateTime(n.at)}</small>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}