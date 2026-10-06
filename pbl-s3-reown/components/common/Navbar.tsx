import Link from "next/link";
import Logo from "./Logo";
import { NAV_LINKS, type NavLink } from "@/lib/navigation";

interface NavbarProps {
  /** "overlay": transparan di atas hero oranye (outline putih). "solid": latar krem, outline gelap. */
  variant?: "overlay" | "solid";
  links?: NavLink[];
  cta?: NavLink;
  loginHref?: string;
}

const styles = {
  overlay: {
    header: "absolute inset-x-0 top-0 z-30",
    pill: "border-white text-white hover:bg-white/15 focus-visible:outline-white",
    burger: "border-white text-white",
    logo: "light" as const,
  },
  solid: {
    header: "relative z-30 border-b border-stone-200/80 bg-[#FFF7E9]",
    pill: "border-stone-800 text-stone-900 hover:bg-stone-900/5 focus-visible:outline-[#E05A47]",
    burger: "border-stone-800 text-stone-900",
    logo: "dark" as const,
  },
};

// Tombol outline kecil berbentuk kapsul (menu & "Masuk")
const pillBase =
  "inline-flex items-center rounded-full border px-4 py-1.5 text-[13px] font-medium leading-5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

// Tombol utama cyan
const ctaClass =
  "inline-flex items-center gap-2 rounded-full bg-[#1FF0DD] px-5 py-2 text-[13px] font-bold leading-5 text-stone-900 transition-colors hover:bg-[#12D9C8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900";

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export default function Navbar({
  variant = "solid",
  links = NAV_LINKS,
  cta = { label: "Mulai Menyelamatkan", href: "/katalog" },
  loginHref = "/masuk",
}: NavbarProps) {
  const s = styles[variant];

  return (
    <header className={s.header}>
      <nav aria-label="Navigasi utama" className="mx-auto flex w-full max-w-6xl items-center gap-3 px-5 py-4 md:py-5">
        {/* Urutan di desktop (sesuai prototype): menu, logo, lalu tombol kanan.
            Di HP: logo di kiri, hamburger di kanan. */}
        <ul className="hidden items-center gap-2 md:order-1 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <Link href={l.href} className={`${pillBase} ${s.pill}`}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="md:order-2 md:ml-3">
          <Logo tone={s.logo} />
        </div>

        <div className="ml-auto hidden items-center gap-2 md:order-3 md:flex">
          <Link href={loginHref} className={`${pillBase} ${s.pill}`}>
            Masuk
          </Link>
          <Link href={cta.href} className={ctaClass}>
            {cta.label}
            <ArrowIcon />
          </Link>
        </div>

        {/* Menu mobile tanpa JavaScript, jadi Navbar tetap Server Component */}
        <details className="relative ml-auto md:hidden">
          <summary className={`flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border ${s.burger}`}>
            <span className="sr-only">Buka menu</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </summary>
          <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white p-3 shadow-xl">
            {links.map((l) => (
              <Link key={l.label} href={l.href} className="block rounded-xl px-4 py-2.5 text-sm font-medium text-stone-800 hover:bg-orange-50">
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-stone-100 pt-3">
              <Link href={loginHref} className="rounded-full border border-stone-800 px-4 py-2 text-center text-[13px] font-medium text-stone-900">
                Masuk
              </Link>
              <Link href={cta.href} className={`${ctaClass} justify-center`}>
                {cta.label}
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </details>
      </nav>
    </header>
  );
}
