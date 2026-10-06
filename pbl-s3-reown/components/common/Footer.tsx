import Link from "next/link";
import Logo from "./Logo";
import { FOOTER_LINKS, type NavLink } from "@/lib/navigation";

interface FooterProps {
  links?: NavLink[];
}

export default function Footer({ links = FOOTER_LINKS }: FooterProps) {
  return (
    <footer id="kontak" className="border-t border-stone-200/70 bg-[#FFF7E9] py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo />
          <p className="mt-1 text-xs text-stone-500">Give it another life.</p>
          <p className="mt-6 text-xs text-stone-500">© {new Date().getFullYear()} ReOwn</p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-stone-800">
          {links.map((l) => (
            <li key={l.label}>
              <Link href={l.href} className="hover:text-[#C8442F]">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
