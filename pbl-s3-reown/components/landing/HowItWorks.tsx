import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  { title: "Cari barang di sekitarmu", desc: "Jelajahi makanan segar dan barang layak pakai yang ada di dekat lokasimu.", emoji: "📍" },
  { title: "Pilih yang kamu mau", desc: "Pilih barang atau makanan yang pas dengan kebutuhan dan jadwalmu.", emoji: "🧺" },
  { title: "Kirim pesan permintaan", desc: "Chat pemilik barang, lalu konfirmasi lokasi pengambilan atau janji COD.", emoji: "💬" },
  { title: "Ambil dan beri kesempatan kedua", desc: "Ambil barangnya, lalu pakai. Setiap yang terselamatkan berarti satu limbah berkurang.", emoji: "♻️" },
];

export default function HowItWorks() {
  return (
    <section id="cara-kerja" className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <SectionHeading
        title="Cara kerja?"
        desc="Cari barang di sekitar, pilih yang kamu suka, kirim pesan, lalu atur janji ketemuan atau ambil langsung. ReOwn bikin semuanya serba simpel, dekat, dan ramah."
      />
      <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.title} className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-orange-900/5">
            <div className="flex h-28 items-center justify-center bg-orange-50 text-5xl">{s.emoji}</div>
            <div className="p-5">
              <p className="text-sm font-bold text-[#C8442F]">Langkah {i + 1}</p>
              <h3 className="mt-1 font-display text-xl font-extrabold leading-snug text-stone-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{s.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
