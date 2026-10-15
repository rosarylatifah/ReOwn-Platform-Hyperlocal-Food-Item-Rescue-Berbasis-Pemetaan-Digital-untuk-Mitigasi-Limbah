export const SANCTION_LABEL = {
  turunkan_produk: "Turunkan produk",
  peringatan: "Beri peringatan",
  suspend: "Suspend akun",
  ban: "Ban permanen",
};

export const USER_STATUS_LABEL = {
  aktif: "Aktif",
  peringatan: "Diperingatkan",
  suspend: "Disuspend",
  banned: "Banned",
};

export const USER_STATUS_TONE = {
  aktif: "ok",
  peringatan: "warn",
  suspend: "warn",
  banned: "bad",
};

export const ACTIVITY_TONE = {
  Selesai: "ok",
  "Belum ditindak": "warn",
  Diproses: "info",
};

export const REMOVAL_SOURCE_LABEL = {
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

export function reportChip(r) {
  if (r.status === "baru") return { tone: "warn", label: "Baru" };
  if (r.status === "diproses") return { tone: "info", label: "Diproses" };
  return r.outcome === "diterima" ? { tone: "ok", label: "Diterima" } : { tone: "muted", label: "Ditolak" };
}

export function appealChip(a) {
  if (a.status === "menunggu") return { tone: "warn", label: "Menunggu" };
  return a.status === "diterima" ? { tone: "ok", label: "Diterima" } : { tone: "muted", label: "Ditolak" };
}