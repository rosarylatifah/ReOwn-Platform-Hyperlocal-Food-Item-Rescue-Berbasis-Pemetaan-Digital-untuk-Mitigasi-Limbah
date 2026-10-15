"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import PageShell from "@/components/common/PageShell";
import Reveal from "@/components/ui/Reveal";
import { fraunces } from "@/lib/fonts";
import PolkaDots from "@/components/ui/PolkaDots";

const faqs = [
  {
    q: "Apa itu ReOwn?",
    a: "ReOwn adalah platform hyper-lokal untuk menyelamatkan makanan berlebih dan barang layak pakai di sekitarmu, dengan cara mempertemukan pemberi dan tetangga yang membutuhkannya.",
  },
  {
    q: "Apakah aku harus membuat akun untuk melihat barang?",
    a: "Tidak. Kamu bisa menjelajahi barang dan menambahkannya ke keranjang tanpa masuk atau mendaftar. Akun berguna supaya keranjangmu bisa diakses dari perangkat lain.",
  },
  {
    q: "Barang di keranjangku bisa hilang?",
    a: "Jika kamu mengakses tanpa login, keranjangmu disimpan di peramban pada perangkatmu, jadi tetap ada saat halaman dimuat ulang. Barangmu bisa hilang kalau kamu menghapus data situs di peramban atau berpindah perangkat. Kamu juga bisa mengosongkannya sendiri kapan saja.",
  },
  {
    q: "Apakah barang berlabel “Gratis” benar-benar gratis?",
    a: "Ya, barang berlabel Gratis diberikan tanpa biaya oleh pemiliknya untuk tetangga sekitar. Untuk barang berbayar, harga dan kesepakatannya dibicarakan langsung dengan pemilik.",
  },
  {
    q: "Bagaimana cara mengambil barang?",
    a: "Pilih barang, tekan “Lihat detail”, lalu tambahkan ke keranjang dan tekan tombol “Selamatkan Sekarang”. Setelah itu hubungi pemilik untuk menyepakati lokasi dan waktu pengambilan atau janji COD.",
  },
  {
    q: "Apakah aman bertemu dengan pemilik barang?",
    a: "Kami sarankan bertemu di tempat umum, memeriksa kondisi barang sebelum menerimanya, dan memberi kabar orang terdekat. Untuk makanan, selalu cek kesegaran dan tanggal kedaluwarsa.",
  },
  {
    q: "Bagaimana kalau aku juga ingin membagikan barang?",
    a: "Daftar akun lalu bagikan barang atau makanan berlebih yang masih layak, sehingga tetangga di sekitarmu bisa mengambilnya. Kamu juga bisa mulai lewat tombol “Yuk Mulai Berbagi”.",
  },
  {
    q: "Aku punya kendala atau pertanyaan lain. Hubungi siapa?",
    a: "Kamu bisa menghubungi kami lewat halaman Hubungi, dan sertakan detail kendalanya sejelas mungkin supaya cepat dibantu.",
  },
];

export default function FaqPage() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <PageShell
      title="Pertanyaan umum"
      desc="Jawaban singkat untuk hal-hal yang paling sering ditanyakan tetangga ReOwn."
    >
      <ul className="space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal as="li" key={f.q} delay={i * 60}>
              <div
                className={`overflow-hidden rounded-[18px] bg-white ring-1 transition-shadow duration-300 ${
                  isOpen
                    ? "shadow-[0_14px_34px_rgba(120,70,30,0.16)] ring-[#D85834]/30"
                    : "shadow-[0_6px_18px_rgba(120,70,30,0.08)] ring-stone-100 hover:shadow-[0_10px_26px_rgba(120,70,30,0.14)]"
                }`}
              >
                <h2>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-btn-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#D85834]"
                  >
                    <span className={`${fraunces.className} text-base font-extrabold leading-snug text-stone-900 md:text-lg`}>
                      {f.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
                        isOpen ? "bg-[#D85834] text-white" : "bg-[#FBE9E2] text-[#D85834]"
                      }`}
                      aria-hidden
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </motion.span>
                  </button>
                </h2>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="panel"
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-btn-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-[15px] leading-relaxed text-stone-600">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </ul>

      <Reveal className="relative mt-12 overflow-hidden rounded-[22px] bg-[#FEE4C6] px-6 py-8 text-center">
        <PolkaDots />
        <div className="relative">
          <h2 className={`${fraunces.className} text-xl font-extrabold text-stone-900`}>Belum menemukan jawabannya?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">Tanyakan langsung ke tim kami, kami senang membantu.</p>
          <Link
            href="/hubungi"
            className="mt-5 inline-flex rounded-xl bg-[#D85834] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#C24A28]"
          >
            Hubungi kami
          </Link>
        </div>
      </Reveal>
    </PageShell>
  );
}