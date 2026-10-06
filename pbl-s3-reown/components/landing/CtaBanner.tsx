import Link from "next/link";

export default function CtaBanner() {
  return (
    <section id="mulai" className="bg-[#FCEBD7] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="max-w-3xl font-display text-4xl font-extrabold uppercase leading-tight text-stone-900 sm:text-6xl">
          Siap beri kesempatan kedua buat barangmu?
        </h2>
        <p className="mt-6 max-w-xl text-stone-700">
          Gabung untuk saling berbagi barang dan makanan berlebih, kurangi sampah, dan buat aktivitas berbagi menjadi lebih seru dan bermanfaat.
        </p>
        <Link
          href="/katalog"
          className="mt-8 inline-block rounded-full bg-[#E05A47] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-orange-900/20 transition-colors hover:bg-[#C8442F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8442F]"
        >
          Yuk mulai berbagi
        </Link>
      </div>
    </section>
  );
}
