const TZ = "Asia/Jakarta";

/** 29/09/26 23:00 (WIB) */
export function fmtDateTime(iso) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ, day: "2-digit", month: "2-digit", year: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(new Date(iso)).replace(", ", " ");
}

/** 29/09/26 */
export function fmtDate(iso) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ, day: "2-digit", month: "2-digit", year: "2-digit",
  }).format(new Date(iso));
}

/** 2026-09-29, untuk perbandingan rentang tanggal */
export function toYMD(iso) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date(iso));
}

export function fmtPrice(n) {
  return n === 0 ? "Gratis" : "Rp" + n.toLocaleString("id-ID");
}

const DAY_MS = 86_400_000;

/** Berapa hari penuh sejak waktu tertentu. */
export function waitingDays(iso, now = Date.now()) {
  return Math.max(0, Math.floor((now - new Date(iso).getTime()) / DAY_MS));
}

/** "<1 hari", "3 hari" */
export function waitingLabel(iso, now = Date.now()) {
  const d = waitingDays(iso, now);
  return d === 0 ? "<1 hari" : `${d} hari`;
}

/** "Senin, 12 Oktober 2026" dari "2026-10-12" */
export function fmtDayLong(ymd) {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: TZ, weekday: "long", day: "numeric", month: "long", year: "numeric",
  }).format(new Date(ymd + "T12:00:00+07:00"));
}