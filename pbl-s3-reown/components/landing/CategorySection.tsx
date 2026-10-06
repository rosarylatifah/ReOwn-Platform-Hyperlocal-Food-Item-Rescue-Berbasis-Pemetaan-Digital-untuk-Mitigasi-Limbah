import SectionHeading from "@/components/ui/SectionHeading";

const categories = [
  {
    badge: "Makanan",
    title: "Makanan berlebih / mendekati kedaluwarsa",
    desc: "Selamatkan bahan segar, roti, hingga makanan siap saji sebelum terbuang sia-sia. Pas untuk diambil cepat dan dibagi ke sesama.",
    tags: ["Bahan dapur", "Roti & kue", "Makanan cepat saji"],
    emoji: "🥖",
  },
  {
    badge: "Barang",
    title: "Barang bekas layak pakai",
    desc: "Temukan peralatan dapur, dekorasi rumah, dan perlengkapan harian yang sudah tak dipakai tetangga tapi masih bagus banget buat kamu.",
    tags: ["Alat dapur", "Perlengkapan rumah", "Perabotan harian"],
    emoji: "🛋️",
  },
];

export default function CategorySection() {
  return (
    <section id="selamatkan" className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <SectionHeading
        title="Apa yang bisa kamu selamatkan?"
        desc="Cek berbagai barang dan makanan berlebih yang lagi dibagikan tetangga sekitar, mulai dari bahan segar sampai perabotan rumah."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {categories.map((c) => (
          <article key={c.badge} className="flex flex-col gap-5 rounded-3xl bg-white p-6 shadow-lg shadow-orange-900/5 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-100 to-orange-200 text-6xl">
              {c.emoji}
            </div>
            <div>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-[#C8442F]">{c.badge}</span>
              <h3 className="mt-3 font-display text-2xl font-extrabold leading-snug text-stone-900">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{c.desc}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {c.tags.map((t) => (
                  <li key={t} className="rounded-full border border-stone-200 px-3 py-1 text-xs font-medium text-stone-700">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
