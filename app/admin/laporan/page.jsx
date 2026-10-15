"use client";

import { useState } from "react";
import AppealDetailModal from "@/components/admin/AppealDetailModal";
import EmptyState from "@/components/admin/EmptyState";
import EvidenceGallery from "@/components/admin/EvidenceGallery";
import EvidenceThumb from "@/components/admin/EvidenceThumb";
import { SearchInput, Toolbar } from "@/components/admin/Filters";
import Pagination, { usePaged } from "@/components/admin/Pagination";
import ReportDetailModal from "@/components/admin/ReportDetailModal";
import StatusChip from "@/components/admin/StatusChip";
import Tabs from "@/components/admin/Tabs";
import { fmtDateTime } from "@/lib/admin/format";
import { useAdmin } from "@/lib/admin/store";

export default function LaporanPage() {
  const { reports, appeals, counts, getUser, getProduct, startReview } = useAdmin();
  const [tab, setTab] = useState("baru");
  const [query, setQuery] = useState("");
  const [openReport, setOpenReport] = useState(null);
  const [openAppeal, setOpenAppeal] = useState(null);

  const name = (id) => getUser(id)?.username ?? "-";
  const byDateDesc = (a, b) => new Date(b).getTime() - new Date(a).getTime();

  const q = query.trim().toLowerCase();
  const match = (...parts) =>
    !q || parts.some((p) => p?.toLowerCase().includes(q));
  const productName = (id) => (id ? getProduct(id)?.name : undefined);

  const open = reports
    .filter((r) => r.status !== "selesai")
    .filter((r) =>
      match(
        name(r.reporterId), name(r.reportedUserId), r.category, r.detail,
        productName(r.productId), r.status === "baru" ? "baru" : "diproses",
      ),
    )
    .sort((a, b) => byDateDesc(a.createdAt, b.createdAt));

  const pendingAppeals = appeals
    .filter((a) => a.status === "menunggu")
    .filter((a) => match(name(a.userId), a.message, productName(a.productId), a.productId ? undefined : "sanksi akun"))
    .sort((a, b) => byDateDesc(a.createdAt, b.createdAt));

  const doneAll = [
    ...reports.filter((r) => r.status === "selesai").map((r) => ({
      key: "r" + r.id, kind: "laporan", id: r.id, at: r.handledAt ?? r.createdAt,
      parties: `${name(r.reporterId)} → ${name(r.reportedUserId)}`, summary: r.category, accepted: r.outcome === "diterima",
    })),
    ...appeals.filter((a) => a.status !== "menunggu").map((a) => ({
      key: "a" + a.id, kind: "banding", id: a.id, at: a.handledAt ?? a.createdAt,
      parties: name(a.userId), summary: a.productId ? `Produk “${getProduct(a.productId)?.name ?? "-"}”` : "Sanksi akun", accepted: a.status === "diterima",
    })),
  ].sort((a, b) => byDateDesc(a.at, b.at));

  const done = doneAll.filter((d) =>
    match(d.parties, d.summary, d.kind, d.accepted ? "diterima" : "ditolak"),
  );

  const pOpen = usePaged(open);
  const pAppeal = usePaged(pendingAppeals);
  const pDone = usePaged(done);

  const onSearch = (v) => {
    setQuery(v);
    pOpen.setPage(1);
    pAppeal.setPage(1);
    pDone.setPage(1);
  };

  const emptyTitle = (fallback) => (q ? `Tidak ada hasil untuk “${query.trim()}”` : fallback);
  const emptyHint = (fallback) => (q ? "Coba kata kunci lain atau pindah ke tab lain." : fallback);

  return (
    <>
      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "baru", label: "Laporan baru", count: counts.openReports },
          { id: "banding", label: "Banding", count: counts.pendingAppeals },
          { id: "selesai", label: "Selesai", count: doneAll.length },
        ]}
      />

      <Toolbar>
        <SearchInput
          value={query}
          onChange={onSearch}
          placeholder="Cari pelapor, terlapor, alasan, atau produk…"
        />
      </Toolbar>

      <section className="adm-panel">
        {tab === "baru" && (
          open.length === 0 ? (
            <EmptyState
              title={emptyTitle("Belum ada laporan baru")}
              hint={emptyHint("Laporan dari pengguna akan muncul di sini.")}
            />
          ) : (
            <>
              <div className="adm-scroll">
                <table className="adm-table">
                  <thead>
                    <tr><th>Waktu (WIB)</th><th>Pelapor</th><th>Terlapor</th><th>Alasan</th><th>Bukti</th><th>Status</th><th><span className="adm-sr">Aksi</span></th></tr>
                  </thead>
                  <tbody>
                    {pOpen.pageItems.map((r) => (
                      <tr key={r.id}>
                        <td className="adm-nowrap">{fmtDateTime(r.createdAt)}</td>
                        <td>{name(r.reporterId)}</td>
                        <td>{name(r.reportedUserId)}</td>
                        <td>{r.category}</td>
                        <td><EvidenceThumb url={r.evidenceUrl} label={r.category} /></td>
                        <td><StatusChip tone={r.status === "baru" ? "warn" : "info"}>{r.status === "baru" ? "Baru" : "Diproses"}</StatusChip></td>
                        <td>
                          <button type="button" className="adm-btn adm-btn--sm adm-btn--primary" onClick={() => { startReview(r.id); setOpenReport(r.id); }}>
                            Tinjau
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={pOpen.page} totalPages={pOpen.totalPages} total={pOpen.total} onChange={pOpen.setPage} />
            </>
          )
        )}

        {tab === "banding" && (
          pendingAppeals.length === 0 ? (
            <EmptyState
              title={emptyTitle("Tidak ada banding menunggu")}
              hint={emptyHint("Banding dari penjual atas produk atau akun yang kena sanksi akan muncul di sini.")}
            />
          ) : (
            <>
              <div className="adm-scroll">
                <table className="adm-table">
                  <thead>
                    <tr><th>Waktu (WIB)</th><th>Pengguna</th><th>Objek banding</th><th>Alasan banding</th><th>Bukti</th><th><span className="adm-sr">Aksi</span></th></tr>
                  </thead>
                  <tbody>
                    {pAppeal.pageItems.map((a) => (
                      <tr key={a.id}>
                        <td className="adm-nowrap">{fmtDateTime(a.createdAt)}</td>
                        <td>{name(a.userId)}</td>
                        <td>{a.productId ? `Produk “${getProduct(a.productId)?.name ?? "-"}”` : "Sanksi akun"}</td>
                        <td className="adm-clamp">{a.message}</td>
                        <td><EvidenceGallery urls={a.evidence ?? []} label="Bukti banding" /></td>
                        <td>
                          <button type="button" className="adm-btn adm-btn--sm adm-btn--primary" onClick={() => setOpenAppeal(a.id)}>Tinjau</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={pAppeal.page} totalPages={pAppeal.totalPages} total={pAppeal.total} onChange={pAppeal.setPage} />
            </>
          )
        )}

        {tab === "selesai" && (
          done.length === 0 ? (
            <EmptyState
              title={emptyTitle("Belum ada yang diselesaikan")}
              hint={emptyHint()}
            />
          ) : (
            <>
              <div className="adm-scroll">
                <table className="adm-table">
                  <thead>
                    <tr><th>Diputuskan (WIB)</th><th>Jenis</th><th>Pihak</th><th>Ringkasan</th><th>Keputusan</th><th><span className="adm-sr">Aksi</span></th></tr>
                  </thead>
                  <tbody>
                    {pDone.pageItems.map((d) => (
                      <tr key={d.key}>
                        <td className="adm-nowrap">{fmtDateTime(d.at)}</td>
                        <td><StatusChip tone={d.kind === "laporan" ? "info" : "muted"}>{d.kind === "laporan" ? "Laporan" : "Banding"}</StatusChip></td>
                        <td>{d.parties}</td>
                        <td>{d.summary}</td>
                        <td><StatusChip tone={d.accepted ? "ok" : "muted"}>{d.accepted ? "Diterima" : "Ditolak"}</StatusChip></td>
                        <td>
                          <button type="button" className="adm-btn adm-btn--sm" onClick={() => (d.kind === "laporan" ? setOpenReport(d.id) : setOpenAppeal(d.id))}>Lihat</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={pDone.page} totalPages={pDone.totalPages} total={pDone.total} onChange={pDone.setPage} />
            </>
          )
        )}
      </section>

      {openReport && <ReportDetailModal reportId={openReport} onClose={() => setOpenReport(null)} />}
      {openAppeal && <AppealDetailModal appealId={openAppeal} onClose={() => setOpenAppeal(null)} />}
    </>
  );
}