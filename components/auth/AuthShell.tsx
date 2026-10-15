"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import StatusDot from "@/components/ui/StatusDot";
import { fraunces } from "@/lib/fonts";

// TODO: ganti dengan data asli (mis. getMonthlyRescuedCount / hitungan harian)
const RESCUED_TODAY = 42;

const QUOTES = [
  {
    t: "Bekas Bukan Tak Berharga",
    d: "Bergabunglah dengan ribuan tetangga yang menjaga makanan layak dan barang bekas agar tidak berakhir di tempat sampah.",
  },
  {
    t: "Dekat Itu Nikmat",
    d: "Barang terbaik sering ada di gang sebelah. Tinggal jalan kaki, tanpa ongkos kirim.",
  },
  {
    t: "Berbagi Itu Menular",
    d: "Satu barang yang berpindah tangan hari ini bisa jadi alasan tetanggamu ikut berbagi besok.",
  },
];

/** Stabilo hijau di belakang kata kunci judul */
export function Highlight({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block">
      <span aria-hidden className="absolute -inset-x-1.5 bottom-[0.06em] -z-10 h-[0.36em] -rotate-1 rounded-sm bg-[#95F57C]" />
      {children}
    </span>
  );
}

function Backdrop() {
  return (
    <div aria-hidden className="absolute inset-0 z-0 overflow-hidden bg-[#9DB3A3]">
      {/* Peta ilustrasi (cadangan kalau /auth-map.jpg belum ada) */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <path d="M760 0C800 190 980 250 1200 230V0Z" fill="#7FA3AD" />
        <path d="M0 650C300 570 520 710 840 650S1100 710 1200 670V800H0Z" fill="#B9C8B0" />
        <g fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="10" strokeLinecap="round">
          <path d="M-20 140C200 200 360 330 620 520S1000 700 1240 600" />
          <path d="M300 -20C340 200 300 420 380 820" />
          <path d="M0 460C280 440 560 300 900 360S1120 460 1240 420" />
        </g>
        <g fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="4" strokeLinecap="round">
          <path d="M120 -20C180 160 90 360 160 820" />
          <path d="M520 -20C560 180 760 260 780 820" />
          <path d="M-20 300C240 320 420 200 700 220" />
          <path d="M900 820C940 620 1020 540 1240 520" />
        </g>
      </svg>
      {/* Peta asli kalau file-nya ada */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/auth-map.jpg)" }} />
      <div className="absolute inset-0 bg-stone-900/25 backdrop-blur-[1px]" />
    </div>
  );
}

function Quote() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((n) => (n + 1) % QUOTES.length), 6000);
    return () => clearInterval(id);
  }, [reduced]);

  const q = QUOTES[i];
  return (
    // Disembunyikan di layar pendek supaya form tetap muat tanpa scroll
    <div className="relative z-10 bg-gradient-to-t from-stone-900/70 via-stone-900/30 to-transparent px-6 pb-5 pt-8 md:px-12 [@media(max-height:820px)]:hidden">
      <div className="min-h-[84px] max-w-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="text-white"
          >
            <p className={`${fraunces.className} text-2xl font-extrabold md:text-3xl`}>&ldquo;{q.t}&rdquo;</p>
            <p className="mt-1 text-sm leading-relaxed text-white/90">{q.d}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

interface AuthShellProps {
  heading: ReactNode;
  desc: string;
  switchText: string;
  switchLabel: string;
  switchHref: string;
  children: ReactNode;
}

export default function AuthShell({ heading, desc, switchText, switchLabel, switchHref, children }: AuthShellProps) {
  const reduced = useReducedMotion();

  return (
    <div className="relative flex min-h-[100svh] flex-col overflow-x-hidden lg:h-[100svh] lg:overflow-hidden">
      <Backdrop />

      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-4 py-6">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28, rotate: -1.5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          className="relative w-full max-w-[680px] rounded-[28px] bg-[#FCFAF8] px-5 py-6 shadow-[0_40px_100px_rgba(30,40,30,0.35)] md:px-10 md:py-7"
        >
          {/* Lakban */}
          <span
            aria-hidden
            className="absolute -top-3 left-1/2 h-6 w-32 -translate-x-1/2 -rotate-3 bg-[repeating-linear-gradient(135deg,#F24827_0_10px,#FFF7E9_10px_20px)] opacity-95 shadow-sm"
          />

          <div className="flex items-start justify-between gap-4">
            <h1
              className={`${fraunces.className} isolate text-[clamp(1.4rem,3vw,2rem)] font-extrabold uppercase leading-[1.05] tracking-tight text-stone-900`}
            >
              {heading}
            </h1>
            <Link href="/" className="group mt-1 shrink-0 text-xs font-semibold text-[#E0452A] hover:underline">
              <span className="inline-block transition-transform group-hover:-translate-x-0.5">←</span> kembali
            </Link>
          </div>

          <p className="mt-2.5 inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#F23A10] bg-white px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#E0452A] [@media(max-height:700px)]:hidden">
            <StatusDot />
            {RESCUED_TODAY} barang sudah diselamatkan hari ini
          </p>

          <p className="mt-2 max-w-md text-sm leading-relaxed text-stone-600 [@media(max-height:760px)]:hidden">
            {desc}
          </p>

          <div className="mt-4 rounded-3xl border border-stone-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(120,70,30,0.06)] md:p-5">
            {children}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm text-stone-600">
            {switchText}
            <Link
              href={switchHref}
              className="rounded-full bg-[#FBE9E2] px-3.5 py-1.5 text-sm font-bold text-[#D85834] transition-colors hover:bg-[#D85834] hover:text-white"
            >
              {switchLabel}
            </Link>
          </div>
        </motion.div>
      </div>

      <Quote />
    </div>
  );
}