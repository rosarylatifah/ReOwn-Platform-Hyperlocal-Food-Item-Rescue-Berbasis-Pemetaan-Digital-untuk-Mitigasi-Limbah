export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Jelajahi", href: "/katalog" },
  { label: "Cara Kerja", href: "/#cara-kerja" },
  { label: "Dampak", href: "/#dampak" },
  { label: "Kontak Kami", href: "#kontak" }, // footer ada di setiap halaman
];

export const FOOTER_LINKS: NavLink[] = [
  { label: "Jelajahi", href: "/katalog" },
  { label: "Cara kerja", href: "/#cara-kerja" },
  { label: "Dampak", href: "#" },
  { label: "Tentang kami", href: "#" },
  { label: "Hubungi", href: "#kontak" },
  { label: "Privasi", href: "#" },
  { label: "Syarat & ketentuan", href: "#" },
];
