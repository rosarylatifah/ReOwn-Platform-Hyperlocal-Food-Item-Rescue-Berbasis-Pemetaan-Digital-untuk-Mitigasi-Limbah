"use client";

import { useState } from "react";
import { fmtDateTime } from "@/lib/admin/format";
import { ACTIVITY_TONE } from "@/lib/admin/labels";
import ActivityDetailModal from "./ActivityDetailModal";
import StatusChip from "./StatusChip";
import UserCell from "./UserCell";

/** Tabel aktivitas. Tiap baris punya tombol “Lihat detail” yang membuka informasi menyeluruh. */
export default function ActivityTable({ items, showKind }) {
  const [open, setOpen] = useState(null);

  return (
    <>
      <div className="adm-scroll">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Waktu (WIB)</th>
              <th>Aktivitas</th>
              <th>Pelaku</th>
              {showKind && <th>Jenis</th>}
              <th>Status</th>
              <th><span className="adm-sr">Aksi</span></th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id}>
                <td className="adm-nowrap">{fmtDateTime(a.at)}</td>
                <td>{a.text}</td>
                <td><UserCell username={a.actor} email={a.actorEmail} /></td>
                {showKind && (
                  <td>
                    <StatusChip tone={a.actorKind === "admin" ? "info" : "muted"}>
                      {a.actorKind === "admin" ? "Aksi admin" : "Pengguna"}
                    </StatusChip>
                  </td>
                )}
                <td><StatusChip tone={ACTIVITY_TONE[a.status]}>{a.status}</StatusChip></td>
                <td>
                  <button type="button" className="adm-btn adm-btn--sm" onClick={() => setOpen(a.id)}>Lihat detail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open && <ActivityDetailModal activityId={open} onClose={() => setOpen(null)} />}
    </>
  );
}