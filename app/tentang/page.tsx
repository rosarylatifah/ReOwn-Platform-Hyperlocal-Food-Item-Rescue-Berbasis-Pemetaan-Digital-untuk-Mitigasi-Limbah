import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/common/PageShell";
import Reveal from "@/components/ui/Reveal";
import { fraunces } from "@/lib/fonts";
import PolkaDots from "@/components/ui/PolkaDots";

export const metadata: Metadata = {
  title: "Tentang Kami | ReOwn",
  description: "Kenali ReOwn: platform hyper-lokal untuk menyelamatkan makanan berlebih dan barang layak pakai.",
};

const values = [
  {
    emoji: "📍",
    title: "Hyper-lokal",
    desc: "Barang yang tampil adalah yang paling dekat denganmu, pengambilan jadi cepat dan tidak butuh ongkos kirim.",
  },
  {
    emoji: "♻️",
    title: "Anti-mubazir",
    desc: "Makanan berlebih dan barang layak pakai berpindah tangan, bukan berakhir di tempat sampah.",
  },
  {
    emoji: "🤝",
    title: "Antar-tetangga",
    desc: "Berbagi menjadi lebih mudah dan ramah ketika terjadi di lingkungan yang saling kenal.",
  },
];

export default function TentangPage() {
  return (
    <PageShell
      width="wide"
      title="Tentang kami"
      desc="ReOwn lahir dari ide sederhana: setiap barang berhak mendapat kesempatan kedua."
    >
      <Reveal>
        <p className="max-w-2xl text-base leading-relaxed text-stone-600">
          ReOwn adalah platform hyper-lokal untuk menyelamatkan makanan berlebih dan barang layak pakai di sekitarmu.
          Banyak hal yang masih bagus justru terbuang karena pemiliknya tidak tahu harus memberikannya ke siapa, padahal
          tetangga di dekatnya mungkin sedang mencarinya. Kami menghubungkan keduanya.
        </p>
      </Reveal>

      <ul className="mt-12 grid gap-5 sm:grid-cols-3">
        {values.map((v, i) => (
          <Reveal as="li" key={v.title} delay={i * 120} className="rounded-[22px] bg-white p-6 shadow-[0_12px_30px_rgba(120,70,30,0.10)] ring-1 ring-stone-100">
            <span aria-hidden className="text-3xl">{v.emoji}</span>
            <h3 className={`${fraunces.className} mt-4 text-lg font-extrabold text-stone-900`}>{v.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{v.desc}</p>
          </Reveal>
        ))}
      </ul>

      <Reveal className="relative mt-14 overflow-hidden rounded-[22px] bg-[#FEE4C6] px-6 py-10 text-center md:px-10">
        <PolkaDots />
        <div className="relative">
          <h2 className={`${fraunces.className} text-2xl font-extrabold text-stone-900`}>Yuk, mulai dari sekitarmu</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">
            Lihat apa saja yang bisa diselamatkan hari ini.
          </p>
          <Link
            href="/katalog"
            className="mt-6 inline-flex rounded-xl bg-[#D85834] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#C24A28]"
          >
            Jelajahi barang
          </Link>
        </div>
      </Reveal>
    </PageShell>
  );
}