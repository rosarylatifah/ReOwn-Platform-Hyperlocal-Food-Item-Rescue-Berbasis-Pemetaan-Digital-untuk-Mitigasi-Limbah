"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { fraunces } from "@/lib/fonts";

const steps = [
  {
    badge: "01 Cari",
    title: "Cari Barang di Sekitarmu",
    desc: "Jelajahi makanan segar, barang layak pakai, dan hasil sisa yang ada di dekat lokasi kamu.",
    image: "/images/peta-bw.jpg",
    tip: "Pakai filter “Terdekat” supaya barang yang jaraknya paling dekat muncul lebih dulu.",
  },
  {
    badge: "02 Pilih",
    title: "Pilih Barang yang Kamu Mau",
    desc: "Pilih barang atau makanan yang pas sama kebutuhan dan jadwal kamu.",
    image: "/images/roti.jpg",
    tip: "Klik “Lihat detail”, lalu “Tambah ke keranjang” untuk menyimpan barang yang kamu incar.",
  },
  {
    badge: "03 Hubungi",
    title: "Kirim Pesan Permintaan",
    desc: "Chat pemilik barang buat konfirmasi lokasi pengambilan atau janji COD.",
    image: "/images/karafe.jpg",
    tip: "Sebutkan jam ambil yang cocok buatmu supaya pemilik bisa langsung konfirmasi.",
  },
  {
    badge: "04 ReOwn",
    title: "Ambil Barang & Beri Kesempatan Kedua",
    desc: "Ambil barangnya dan beri kehidupan baru di rumahmu!",
    image: "/images/tomat.jpg",
    tip: "Punya barang sisa di rumah? Kamu juga bisa jadi pemberi dan bantu tetangga sekitar.",
  },
];

/** Ikon kecil di pojok gambar. Animasinya aktif saat kartu di-hover (label "hover" diwariskan dari <li>). */
function StepIcon({ index }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (index === 0) {
    // Pin lokasi memantul
    return (
      <motion.svg
        {...common}
        variants={{ hover: { y: [0, -5, 0], transition: { repeat: Infinity, duration: 0.7 } } }}
      >
        <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </motion.svg>
    );
  }
  if (index === 1) {
    // Centang membesar
    return (
      <motion.svg
        {...common}
        variants={{ hover: { scale: [1, 1.3, 1], transition: { repeat: Infinity, duration: 0.9 } } }}
      >
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12.5 2.8 2.8L16 9.5" />
      </motion.svg>
    );
  }
  if (index === 2) {
    // Chat bergetar
    return (
      <motion.svg
        {...common}
        variants={{
          hover: { rotate: [0, -12, 12, -8, 8, 0], transition: { repeat: Infinity, duration: 0.9, repeatDelay: 0.3 } },
        }}
      >
        <path d="M21 12a8 8 0 0 1-11.7 7L4 20l1.1-4.4A8 8 0 1 1 21 12Z" />
        <path d="M8.5 11h7M8.5 14h4" />
      </motion.svg>
    );
  }
  // Hati berdenyut
  return (
    <motion.svg
      {...common}
      variants={{ hover: { scale: [1, 1.25, 1, 1.2, 1], transition: { repeat: Infinity, duration: 1.1 } } }}
    >
      <path d="M12 20.5s-8-4.9-8-11A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5c0 6.1-8 11-8 11Z" />
    </motion.svg>
  );
}

function StepCard({ step, index, open, onToggle, reduced }) {
  // Tilt 3D tipis mengikuti kursor
  const rx = useSpring(0, { stiffness: 180, damping: 18 });
  const ry = useSpring(0, { stiffness: 180, damping: 18 });

  const variants = {
    hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 48 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    hover: reduced ? {} : { y: -8, transition: { type: "spring", stiffness: 300, damping: 20 } },
  };

  return (
    <motion.li
      variants={variants}
      whileHover="hover"
      onMouseMove={(e) => {
        if (reduced) return;
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className="group flex flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_12px_30px_rgba(120,70,30,0.12)] ring-1 ring-stone-100 transition-shadow duration-300 hover:shadow-[0_24px_50px_rgba(120,70,30,0.22)]"
    >
      <div className="relative aspect-[2/1] overflow-hidden bg-gradient-to-br from-amber-100 to-orange-200">
        <Image
          src={step.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 22vw, 90vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <span className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-[#D85834] shadow-md backdrop-blur">
          <StepIcon index={index} />
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-6 pt-5">
        <span className="inline-block self-start rounded-full bg-[#FBE9E2] px-3 py-1 text-[11px] font-bold uppercase text-[#D85834] transition-colors duration-300 group-hover:bg-[#D85834] group-hover:text-white">
          {step.badge}
        </span>
        <h3 className={`${fraunces.className} mt-4 text-xl font-extrabold leading-tight text-stone-900`}>
          {step.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">{step.desc}</p>

        {/* Tip yang bisa dibuka */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="tip"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="mt-4 rounded-xl bg-[#FFF3E0] px-4 py-3 text-[13px] leading-relaxed text-stone-700">
                💡 {step.tip}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="mt-auto inline-flex items-center gap-1.5 self-start pt-5 text-sm font-semibold text-[#D85834] transition-colors hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834]"
        >
          {open ? "Tutup tips" : "Lihat tips"}
          <motion.svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <path d="m6 9 6 6 6-6" />
          </motion.svg>
        </button>
      </div>
    </motion.li>
  );
}

export default function HowItWorks() {
  const reducedMotion = useReducedMotion() ?? false;
  const wrapRef = useRef(null);
  const [open, setOpen] = useState(null);
  const [reached, setReached] = useState(1);

  // Progres garis alur mengikuti scroll
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start 75%", "end 65%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const count = [0, 1, 2, 3].filter((i) => v >= i / 3 - 0.03).length;
    setReached((prev) => (prev === count ? prev : count));
  });

  const list = {
    hidden: {},
    show: { transition: { staggerChildren: reducedMotion ? 0 : 0.15 } },
  };

  return (
    <section id="cara-kerja" className="py-16 md:py-24">
      <div className="mx-auto max-w-[1000px] px-4 md:px-6">
        <Reveal>
          <SectionHeading
            className="mx-auto text-center"
            splitWords
            title="Cara kerja?"
            desc="Cari barang di sekitar, pilih yang kamu suka, kirim pesan, lalu atur janji ketemuan atau ambil langsung. ReOwn bikin semuanya serba simpel, dekat, dan ramah!"
          />
        </Reveal>

        <div ref={wrapRef} className="mt-12">
          {/* Garis alur + titik langkah (desktop) */}
          <div aria-hidden className="relative mb-8 hidden grid-cols-4 gap-5 lg:grid">
            <div className="absolute left-[12.5%] right-[12.5%] top-1/2 -translate-y-1/2">
              <div className="absolute inset-x-0 top-0 h-0 border-t-2 border-dashed border-stone-300" />
              <motion.div
                style={{ scaleX: reducedMotion ? 1 : fill }}
                className="absolute inset-x-0 top-[-1px] h-[3px] origin-left rounded-full bg-[#D85834]"
              />
            </div>
            {steps.map((s, i) => {
              const on = i < reached;
              return (
                <div key={s.badge} className="relative z-10 flex justify-center">
                  <motion.span
                    animate={{ scale: on ? 1 : 0.85 }}
                    transition={{ type: "spring", stiffness: 400, damping: 16 }}
                    className={`grid h-11 w-11 place-items-center rounded-full text-sm font-bold ring-2 transition-colors duration-300 ${
                      on
                        ? "bg-[#D85834] text-white ring-[#D85834]"
                        : "bg-[#FFF7E9] text-stone-400 ring-stone-300"
                    }`}
                  >
                    {i + 1}
                  </motion.span>
                </div>
              );
            })}
          </div>

          <motion.ol
            variants={list}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {steps.map((s, i) => (
              <StepCard
                key={s.badge}
                step={s}
                index={i}
                reduced={reducedMotion}
                open={open === i}
                onToggle={() => setOpen((cur) => (cur === i ? null : i))}
              />
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}