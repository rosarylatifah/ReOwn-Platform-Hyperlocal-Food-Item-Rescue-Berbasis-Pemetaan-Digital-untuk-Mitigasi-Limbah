"use client";

import { useState } from "react";
import { toYMD } from "@/lib/admin/format";
import { appealChip, reportChip } from "@/lib/admin/labels";
import { useAdmin } from "@/lib/admin/store";
import AppealDetailModal from "./AppealDetailModal";
import { DateFilter } from "./Filters";
import ReportDetailModal from "./ReportDetailModal";
import StatusChip from "./StatusChip";

const DAY_MS = 86_400_000;
const MAX_CUSTOM = 90;
const W = 560;
const H = 210;
const PAD = { l: 26, r: 6, t: 14, b: 24 };
const PRESETS = [7, 14, 30] as const;
type Mode = (typeof PRESETS)[number] | "custom";

const dayFmt = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta", weekday: "short", day: "2-digit", month: "2-digit",
});
const noon = (ymd: string) => new Date(ymd + "T12:00:00+07:00").getTime();
const dayLabel = (ymd: string) => dayFmt.format(new Date(noon(ymd)));
const addDays = (ymd: string, n: number) => toYMD(new Date(noon(ymd) + n * DAY_MS).toISOString());
const shortDate = (ymd: string) => `${ymd.slice(8)}/${ymd.slice(5, 7)}/${ymd.slice(2, 4)}`;

interface TrendChartProps {
  /** Tanggal yang sedang dipilih (dipakai juga oleh tabel riwayat di bawahnya). */
  pickedDay: string | null;
  onPickDay: (day: string | null) => void;
}

/**
 * Grafik interaktif: rentang 7/14/30 hari atau pilih tanggal sendiri, sembunyikan/tampilkan seri,
 * tooltip saat kursor lewat, dan klik (atau Enter) sebuah hari untuk melihat rincian hari itu
 * sekaligus memfilter tabel riwayat aktivitas di dashboard.
 */
export default function TrendChart({ pickedDay, onPickDay }: TrendChartProps) {
  const { reports, appeals, getUser, getProduct, startReview } = useAdmin();
  const [now] = useState(() => Date.now());
  const today = toYMD(new Date(now).toISOString());
  const [mode, setMode] = useState<Mode>(14);
  const [from, setFrom] = useState(() => addDays(today, -6));
  const [to, setTo] = useState(today);
  const [show, setShow] = useState({ rep: true, app: true });
  const [hover, setHover] = useState<number | null>(null);
  const [openReport, setOpenReport] = useState<string | null>(null);
  const [openAppeal, setOpenAppeal] = useState<string | null>(null);

  const name = (id: string) => getUser(id)?.username ?? "-";
  const presetDays = (n: number) => Array.from({ length: n }, (_, i) => addDays(today, -(n - 1 - i)));

  // daftar hari yang ditampilkan
  let customError = "";
  let days: string[];
  if (mode === "custom") {
    const span = from && to ? Math.round((noon(to) - noon(from)) / DAY_MS) + 1 : 0;
    if (!from || !to) customError = "Pilih tanggal awal dan akhir.";
    else if (from > to) customError = "Tanggal awal harus sebelum tanggal akhir.";
    else if (to > today) customError = "Tanggal akhir tidak boleh melebihi hari ini.";
    else if (span > MAX_CUSTOM) customError = `Rentang paling lama ${MAX_CUSTOM} hari.`;
    days = customError ? presetDays(7) : Array.from({ length: span }, (_, i) => addDays(from, i));
  } else {
    days = presetDays(mode);
  }
  const range = days.length;

  const choose = (m: Mode) => {
    setMode(m);
    onPickDay(m === "custom" && from && from === to ? from : null);
  };
  const changeFrom = (v: string) => {
    setFrom(v);
    onPickDay(v && v === to ? v : null);
  };
  const changeTo = (v: string) => {
    setTo(v);
    onPickDay(v && v === from ? v : null);
  };

  const repBy = days.map((d) => reports.filter((r) => toYMD(r.createdAt) === d));
  const appBy = days.map((d) => appeals.filter((a) => toYMD(a.createdAt) === d));
  const rep = repBy.map((x) => (show.rep ? x.length : 0));
  const app = appBy.map((x) => (show.app ? x.length : 0));
  const totals = rep.map((n, i) => n + app[i]);
  const max = Math.max(2, ...totals);
  const peakIdx = totals.lastIndexOf(Math.max(...totals));
  const hasData = totals.some((t) => t > 0);

  const filtered = !!pickedDay && days.includes(pickedDay);
  const sel = filtered ? pickedDay : hasData ? days[peakIdx] : null;
  const selIdx = sel ? days.indexOf(sel) : -1;

  // ringkasan periode
  const allRep = repBy.flat();
  const allApp = appBy.flat();
  const accepted = allRep.filter((r) => r.outcome === "diterima").length;
  const rejected = allRep.filter((r) => r.outcome === "ditolak").length;
  const avg = ((allRep.length + allApp.length) / range).toLocaleString("id-ID", { maximumFractionDigits: 1 });
  const rate = accepted + rejected === 0 ? "-" : Math.round((accepted / (accepted + rejected)) * 100) + "%";
  const cats = Object.entries(
    allRep.reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.category]: (acc[r.category] ?? 0) + 1 }), {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const slot = innerW / range;
  const bar = Math.min(slot * 0.62, 28);
  const yOf = (v: number) => PAD.t + innerH - (v / max) * innerH;
  const ticks = Array.from(new Set([0, Math.ceil(max / 2), max]));
  const labelStep = Math.max(1, Math.ceil(range / 12));

  const scrollToHistory = () =>
    document.getElementById("adm-dash-history")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section className="adm-panel">
      <div className="adm-panel-h">
        <h2>Laporan dan banding masuk</h2>
        <div className="adm-seg" role="group" aria-label="Rentang waktu">
          {PRESETS.map((r) => (
            <button key={r} type="button" aria-pressed={mode === r} onClick={() => choose(r)}>
              {r} hari
            </button>
          ))}
          <button type="button" aria-pressed={mode === "custom"} onClick={() => choose("custom")}>
            Pilih tanggal
          </button>
        </div>
      </div>

      <div className="adm-chart">
        {mode === "custom" && (
          <div className="adm-custom">
            <DateFilter label="Dari" value={from} onChange={changeFrom} />
            <DateFilter label="Sampai" value={to} onChange={changeTo} />
            {customError ? (
              <span className="adm-err" role="alert">{customError} Grafik sementara menampilkan 7 hari terakhir.</span>
            ) : (
              <span className="adm-muted adm-hint">Isi tanggal yang sama di kedua kolom untuk melihat satu hari saja.</span>
            )}
          </div>
        )}

        <div className="adm-kpis">
          <div><b>{allRep.length}</b><span>laporan masuk</span></div>
          <div><b>{allApp.length}</b><span>banding diajukan</span></div>
          <div><b>{avg}</b><span>rata-rata per hari</span></div>
          <div><b>{rate}</b><span>laporan diterima (dari yang diputuskan)</span></div>
        </div>

        <div className="adm-chart-body">
          <div>
            <div className="adm-chart-meta">
              <button type="button" className="adm-legend" aria-pressed={show.rep} onClick={() => setShow((s) => ({ ...s, rep: !s.rep }))}>
                <i className="adm-dot" style={{ background: "var(--hot)" }} />Laporan
              </button>
              <button type="button" className="adm-legend" aria-pressed={show.app} onClick={() => setShow((s) => ({ ...s, app: !s.app }))}>
                <i className="adm-dot" style={{ background: "var(--series-2)" }} />Banding
              </button>
              <span>Periode {shortDate(days[0])}{range > 1 ? ` – ${shortDate(days[range - 1])}` : ""}</span>
              {hasData && <span>Tersibuk: {dayLabel(days[peakIdx])} ({totals[peakIdx]})</span>}
            </div>

            <div className="adm-chart-wrap">
              <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label={`Grafik laporan dan banding ${range} hari. Pilih sebuah hari untuk melihat rincian dan memfilter riwayat aktivitas.`}>
                {ticks.map((t) => (
                  <g key={t}>
                    <line x1={PAD.l} x2={W - PAD.r} y1={yOf(t)} y2={yOf(t)} style={{ stroke: "var(--line)" }} />
                    <text x={PAD.l - 6} y={yOf(t) + 3} textAnchor="end" fontSize="10" style={{ fill: "var(--muted)" }}>{t}</text>
                  </g>
                ))}
                {days.map((d, i) => {
                  const x = PAD.l + i * slot + (slot - bar) / 2;
                  const hR = (rep[i] / max) * innerH;
                  const hA = (app[i] / max) * innerH;
                  const isSel = d === sel;
                  return (
                    <g
                      key={d}
                      className={"adm-bar" + (isSel ? " is-sel" : "")}
                      role="button"
                      tabIndex={0}
                      aria-pressed={d === pickedDay}
                      aria-label={`${dayLabel(d)}: ${repBy[i].length} laporan, ${appBy[i].length} banding`}
                      onClick={() => onPickDay(d === pickedDay ? null : d)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPickDay(d === pickedDay ? null : d); }
                      }}
                      onMouseEnter={() => setHover(i)}
                      onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover(i)}
                      onBlur={() => setHover(null)}
                    >
                      <rect className="adm-bar-bg" x={PAD.l + i * slot} y={PAD.t - 4} width={slot} height={innerH + 4} rx="6" />
                      {rep[i] > 0 && <rect x={x} y={yOf(rep[i])} width={bar} height={hR} rx="3" style={{ fill: "var(--hot)" }} />}
                      {app[i] > 0 && <rect x={x} y={yOf(rep[i] + app[i])} width={bar} height={hA} rx="3" style={{ fill: "var(--series-2)" }} />}
                      {(i % labelStep === 0 || i === range - 1) && (
                        <text
                          x={x + bar / 2} y={H - 8} textAnchor="middle" fontSize="10"
                          fontWeight={isSel || i === range - 1 ? 700 : 400}
                          style={{ fill: isSel || i === range - 1 ? "var(--ink)" : "var(--muted)" }}
                        >
                          {d.slice(8)}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
              {hover !== null && (
                <div
                  className="adm-tip"
                  style={{ left: `clamp(70px, ${((PAD.l + hover * slot + slot / 2) / W) * 100}%, calc(100% - 70px))` }}
                >
                  <b>{dayLabel(days[hover])}</b>
                  <span>{repBy[hover].length} laporan, {appBy[hover].length} banding</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="adm-day" aria-live="polite">
              {sel ? (
                <>
                  <h3>Rincian {dayLabel(sel)}</h3>
                  {filtered && (
                    <p className="adm-hint">
                      Tabel riwayat aktivitas di bawah menampilkan tanggal ini.{" "}
                      <button type="button" className="adm-linkbtn" onClick={scrollToHistory}>Lihat riwayatnya ↓</button>
                    </p>
                  )}
                  {repBy[selIdx].length + appBy[selIdx].length === 0 ? (
                    <p className="adm-muted">Tidak ada laporan atau banding pada hari ini.</p>
                  ) : (
                    <ul>
                      {repBy[selIdx].map((r) => (
                        <li key={r.id}>
                          <div>
                            <b>{name(r.reporterId)} melaporkan {name(r.reportedUserId)}</b>
                            <span className="sub">{r.category}</span>
                          </div>
                          <StatusChip tone={reportChip(r).tone}>{reportChip(r).label}</StatusChip>
                          <button type="button" className="adm-btn adm-btn--sm" onClick={() => { startReview(r.id); setOpenReport(r.id); }}>Lihat</button>
                        </li>
                      ))}
                      {appBy[selIdx].map((a) => (
                        <li key={a.id}>
                          <div>
                            <b>{name(a.userId)} mengajukan banding</b>
                            <span className="sub">{a.productId ? `Produk “${getProduct(a.productId)?.name ?? "-"}”` : "Sanksi akun"}</span>
                          </div>
                          <StatusChip tone={appealChip(a).tone}>{appealChip(a).label}</StatusChip>
                          <button type="button" className="adm-btn adm-btn--sm" onClick={() => setOpenAppeal(a.id)}>Lihat</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <p className="adm-muted">Belum ada laporan atau banding pada periode ini.</p>
              )}
            </div>

            {cats.length > 0 && (
              <div className="adm-cats">
                <h3>Kategori laporan terbanyak</h3>
                {cats.map(([c, n]) => (
                  <div key={c} className="adm-cat">
                    <span>{c}</span>
                    <div className="adm-cat-bar"><i style={{ width: `${(n / cats[0][1]) * 100}%` }} /></div>
                    <b>{n}</b>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {openReport && <ReportDetailModal reportId={openReport} onClose={() => setOpenReport(null)} />}
      {openAppeal && <AppealDetailModal appealId={openAppeal} onClose={() => setOpenAppeal(null)} />}
    </section>
  );
}