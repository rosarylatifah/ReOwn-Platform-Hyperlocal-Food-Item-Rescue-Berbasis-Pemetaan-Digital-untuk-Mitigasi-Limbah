export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", title: "Panel Admin" },
  { href: "/admin/laporan", label: "Kelola Laporan", title: "Kelola Laporan" },
  { href: "/admin/pesan", label: "Pesan Masuk", title: "Pesan Masuk" },
  { href: "/admin/produk", label: "Kelola Produk", title: "Kelola Produk" },
  { href: "/admin/pengguna", label: "Kelola Pengguna", title: "Kelola Pengguna" },
  { href: "/admin/dihapus", label: "Dihapus", title: "Produk dan Akun Dihapus" },
  { href: "/admin/riwayat", label: "Riwayat Aktivitas", title: "Riwayat Aktivitas" },
];

export function isActive(pathname, href) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}