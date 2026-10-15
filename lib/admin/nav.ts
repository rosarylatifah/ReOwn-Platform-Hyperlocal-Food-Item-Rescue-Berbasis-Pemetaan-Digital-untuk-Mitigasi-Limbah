export interface AdminNavItem {
  href: string;
  label: string; // teks menu sidebar
  title: string; // judul halaman
}

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", title: "Panel Admin" },
  { href: "/admin/laporan", label: "Kelola Laporan", title: "Kelola Laporan" },
  { href: "/admin/pesan", label: "Pesan Masuk", title: "Pesan Masuk" },
  { href: "/admin/produk", label: "Kelola Produk", title: "Kelola Produk" },
  { href: "/admin/pengguna", label: "Kelola Pengguna", title: "Kelola Pengguna" },
  { href: "/admin/dihapus", label: "Dihapus", title: "Produk dan Akun Dihapus" },
  { href: "/admin/riwayat", label: "Riwayat Aktivitas", title: "Riwayat Aktivitas" },
];

export function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}
