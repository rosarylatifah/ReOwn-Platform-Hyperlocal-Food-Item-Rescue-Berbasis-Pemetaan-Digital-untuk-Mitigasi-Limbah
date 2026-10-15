"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import Logo from "./Logo";
import { FOOTER_LINKS } from "@/lib/navigation";

/** Pengelompokan link berdasarkan label. */
const GROUPS = [
  { title: "Jelajahi", labels: ["Jelajahi", "Cara Kerja", "Dampak"] },
  { title: "ReOwn", labels: ["Tentang Kami", "FAQ", "Hubungi"] },
  { title: "Legal", labels: ["Privasi", "Syarat & Ketentuan"] },
];

const linkClass =
  "relative inline-block text-[13px] font-semibold text-stone-900 transition-all duration-200 hover:-translate-y-0.5 hover:text-[#D85834] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D85834] " +
  "after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-[#D85834] after:transition-transform after:duration-300 hover:after:scale-x-100";

export default function Footer({ links = FOOTER_LINKS }) {
  const reduced = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.1 } },
  };
  const item = {
    hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });

  return (
    <footer
      id="kontak"
      className="relative z-10 bg-white shadow-[0_-12px_32px_-6px_rgba(120,70,30,0.14)]"
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto max-w-[1200px] px-6 pb-5 pt-8 md:px-14 md:pt-9"
      >
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          {/* Brand */}
          <motion.div variants={item} className="flex flex-col">
            <motion.div
              whileHover={reduced ? undefined : { rotate: -3, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 14 }}
              className="origin-left self-start"
            >
              <Logo size="sm" />
            </motion.div>
            <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
              Give it another life.
            </p>
          </motion.div>

          {/* Link berkelompok */}
          <motion.nav
            variants={item}
            aria-label="Navigasi footer"
            className="grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-3 md:gap-x-16"
          >
            {GROUPS.map((g) => {
              const groupLinks = links.filter((l) => g.labels.includes(l.label));
              if (!groupLinks.length) return null;
              return (
                <div key={g.title}>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#D85834]">{g.title}</p>
                  <ul className="mt-2.5 flex flex-col gap-2">
                    {groupLinks.map((l) => (
                      <li key={l.label}>
                        <Link href={l.href} className={linkClass}>
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </motion.nav>
        </div>

        {/* Baris bawah */}
        <motion.div
          variants={item}
          className="mt-6 flex items-center justify-between gap-4 border-t border-stone-200 pt-4"
        >
          <p className="text-xs text-stone-500">© {new Date().getFullYear()} ReOwn</p>

          <motion.button
            type="button"
            onClick={scrollTop}
            whileHover={reduced ? undefined : { y: -3 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Kembali ke atas"
            className="group inline-flex items-center gap-2 rounded-full border-[1.5px] border-stone-900 px-3.5 py-1.5 text-xs font-semibold text-stone-900 transition-colors hover:bg-stone-900 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834]"
          >
            Ke atas
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
              className="transition-transform duration-200 group-hover:-translate-y-0.5"
            >
              <path d="M12 19V5m-6 6 6-6 6 6" />
            </svg>
          </motion.button>
        </motion.div>
      </motion.div>
    </footer>
  );
}