import Link from "next/link";
import Logo from "./Logo";
import ScrollAwareHeader from "./ScrollAwareHeader";
import NavbarAuth from "./NavbarAuth";
import CartButton from "@/components/cart/CartButton";
import { delaGothic } from "@/lib/fonts";
import { NAV_LINKS } from "@/lib/navigation";

const styles = {
  overlay: {
    // hover: kapsul terisi putih, teks jadi oranye
    pill: "border-white text-white hover:bg-white hover:text-[#F24827] focus-visible:outline-white",
    burger: "border-white text-white",
    logo: "light",
  },
  solid: {
    // hover: kapsul terisi gelap, teks jadi krem
    pill: "border-stone-800 text-stone-900 hover:bg-stone-900 hover:text-[#FFF7E9] focus-visible:outline-[#E05A47]",
    burger: "border-stone-800 text-stone-900",
    logo: "dark",
  },
};

const pillAnim =
  "inline-flex items-center rounded-full border-[1.5px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

// Kapsul outline (menu & "Masuk")
const pillBase = `${pillAnim} px-6 py-2 text-[15px] leading-[22px]`;

// Kapsul kecil ("Kembali ke dashboard")
const pillSmall = `${pillAnim} px-4 py-1.5 text-[13px] leading-[20px]`;

// Tombol utama hijau; hover: berubah gelap dengan teks hijau
const ctaClass =
  "group inline-flex items-center gap-2 rounded-full bg-[#95F57C] px-6 py-2 text-[15px] leading-[22px] text-stone-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-stone-900 hover:text-[#95F57C] hover:shadow-lg active:translate-y-0 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900";

function ArrowIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export default function Navbar({
  variant = "solid",
  links = NAV_LINKS,
  cta = { label: "Buat akun", href: "/daftar" },
  loginHref = "/masuk",
}) {
  const s = styles[variant];

  const authProps = {
    pillClass: `${pillBase} ${s.pill}`,
    smallPillClass: `${pillSmall} ${s.pill}`,
    ctaClass,
    loginHref,
    cta,
    arrow: <ArrowIcon />,
  };

  return (
    <ScrollAwareHeader variant={variant}>
      <nav aria-label="Navigasi utama" className="flex w-full items-center justify-between gap-6 px-7 py-3.5">
        {/* Tata letak sesuai prototype: logo di kiri, menu di tengah, tombol di kanan */}
        <Logo tone={s.logo} />

        <ul className={`${delaGothic.className} hidden items-center gap-3 md:flex`}>
          {links.map((l) => (
            <li key={l.label}>
              <Link href={l.href} className={`${pillBase} ${s.pill}`}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={`${delaGothic.className} hidden items-center gap-2.5 md:flex`}>
          <CartButton className={s.pill} />
          <NavbarAuth {...authProps} />
        </div>

        {/* Mobile: keranjang + menu burger */}
        <div className="flex items-center gap-2.5 md:hidden">
          <CartButton className={s.pill} />

          {/* Menu mobile tanpa JavaScript tambahan */}
          <details className="relative">
            <summary className={`flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border-[1.5px] ${s.burger}`}>
              <span className="sr-only">Buka menu</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </summary>
            <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white p-3 shadow-xl">
              {links.map((l) => (
                <Link key={l.label} href={l.href} className="block rounded-xl px-4 py-3 text-base font-medium text-stone-800 hover:bg-orange-50">
                  {l.label}
                </Link>
              ))}
              <NavbarAuth mobile {...authProps} />
            </div>
          </details>
        </div>
      </nav>
    </ScrollAwareHeader>
  );
}