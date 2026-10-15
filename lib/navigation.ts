export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Jelajahi", href: "/#beranda" },
  { label: "Cara Kerja", href: "/#cara-kerja" },
  { label: "Dampak", href: "/#dampak" },
  { label: "Kontak Kami", href: "/hubungi" },
];

export const FOOTER_LINKS: NavLink[] = [
  { label: "Jelajahi", href: "/#beranda" },
  { label: "Cara Kerja", href: "/#cara-kerja" },
  { label: "Dampak", href: "/#dampak" },
  { label: "Tentang Kami", href: "/tentang" },
  { label: "FAQ", href: "/faq" },
  { label: "Hubungi", href: "/hubungi" },
  { label: "Privasi", href: "/privasi" },
  { label: "Syarat & Ketentuan", href: "/syarat" },
];