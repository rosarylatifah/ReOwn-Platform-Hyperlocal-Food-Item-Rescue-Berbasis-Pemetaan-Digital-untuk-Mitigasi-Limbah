"use client";

import Link from "next/link";
import { useState } from "react";
import { waitingLabel } from "@/lib/admin/format";
import { useAdmin } from "@/lib/admin/store";
import AppealDetailModal from "./AppealDetailModal";
import EmptyState from "./EmptyState";
import ReportDetailModal from "./ReportDetailModal";

export default function ReviewQueue() {
  const { reports, appeals, getUser, getProduct, startReview, counts } = useAdmin();
  const [now] = useState(() => Date.now());
  const [openReport, setOpenReport] = useState(null);
  const [openAppeal, setOpenAppeal] = useState(null);

  const name = (id) => getUser(id)?.username ?? "-";
  const items = [
    ...reports
      .filter((r) => r.status !== "selesai")
      .map((r) => ({
        key: "r" + r.id, kind: "laporan", id: r.id, at: r.createdAt,
        title: `${name(r.reporterId)} melaporkan ${name(r.reportedUserId)}`, sub: r.category,
      })),
    ...appeals
      .filter((a) => a.status === "menunggu")
      .map((a) => ({
        key: "a" + a.id, kind: "banding", id: a.id, at: a.createdAt,
        title: `${name(a.userId)} mengajukan banding`,
        sub: a.productId ? `Produk “${getProduct(a.productId)?.name ?? "-"}”` : "Sanksi akun",
      })),
  ].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());

  return (
    <section className="adm-panel">
      <div className="adm-panel-h">
        <h2>Perlu ditinjau sekarang</h2>
        <Link className="adm-link" href="/admin/laporan">Lihat semua ({counts.inbox})</Link>
      </div>

      {items.length === 0 ? (
        <EmptyState title="Semua sudah ditinjau" hint="Laporan dan banding baru akan muncul di sini." />
      ) : (
        <div className="adm-scroll">
          <table className="adm-table adm-queue-table">
            <thead>
              <tr>
                <th>Kasus & Keterangan</th>
                <th>Jenis</th>
                <th>Waktu Tunggu</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.slice(0, 5).map((it) => (
                <tr key={it.key}>
                  <td>
                    <b>{it.title}</b>
                    <small>{it.sub}</small>
                  </td>
                  <td>
                    <span className={`adm-q-badge ${it.kind === "laporan" ? "adm-q-rep" : "adm-q-app"}`}>
                      {it.kind === "laporan" ? "Laporan" : "Banding"}
                    </span>
                  </td>
                  <td>
                    <span className="adm-muted" style={{ fontSize: "13px" }}>
                      Menunggu {waitingLabel(it.at, now)}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      className="adm-btn adm-btn--sm adm-btn--primary"
                      onClick={() => {
                        if (it.kind === "laporan") {
                          startReview(it.id);
                          setOpenReport(it.id);
                        } else {
                          setOpenAppeal(it.id);
                        }
                      }}
                    >
                      Tinjau
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {openReport && <ReportDetailModal reportId={openReport} onClose={() => setOpenReport(null)} />}
      {openAppeal && <AppealDetailModal appealId={openAppeal} onClose={() => setOpenAppeal(null)} />}
    </section>
  );
}