import type { Activity, Appeal, RemovalSource, Report, Sanction, UserStatus } from "./types";

export type Tone = "ok" | "warn" | "info" | "bad" | "muted";

export const SANCTION_LABEL: Record<Sanction, string> = {
  turunkan_produk: "Turunkan produk",
  peringatan: "Beri peringatan",
  suspend: "Suspend akun",
  ban: "Ban permanen",
};

export const USER_STATUS_LABEL: Record<UserStatus, string> = {
  aktif: "Aktif",
  peringatan: "Diperingatkan",
  suspend: "Disuspend",
  banned: "Banned",
};

export const USER_STATUS_TONE: Record<UserStatus, Tone> = {
  aktif: "ok",
  peringatan: "warn",
  suspend: "warn",
  banned: "bad",
};

export const ACTIVITY_TONE: Record<Activity["status"], Tone> = {
  Selesai: "ok",
  "Belum ditindak": "warn",
  Diproses: "info",
};

export const REMOVAL_SOURCE_LABEL: Record<RemovalSource, string> = {
  laporan: "Dari laporan",
  langsung: "Moderasi langsung",
    akun: "Akun disuspend",
  ban: "Akun di-ban",
};

export const REMOVAL_REASONS = [
  "Barang ilegal atau dilarang",
  "Makanan tidak layak konsumsi",
  "Deskripsi atau foto menyesatkan",
  "Penipuan",
  "Konten tidak pantas",
  "Melanggar ketentuan lain",
];

export function reportChip(r: Report): { tone: Tone; label: string } {
  if (r.status === "baru") return { tone: "warn", label: "Baru" };
  if (r.status === "diproses") return { tone: "info", label: "Diproses" };
  return r.outcome === "diterima" ? { tone: "ok", label: "Diterima" } : { tone: "muted", label: "Ditolak" };
}

export function appealChip(a: Appeal): { tone: Tone; label: string } {
  if (a.status === "menunggu") return { tone: "warn", label: "Menunggu" };
  return a.status === "diterima" ? { tone: "ok", label: "Diterima" } : { tone: "muted", label: "Ditolak" };
}