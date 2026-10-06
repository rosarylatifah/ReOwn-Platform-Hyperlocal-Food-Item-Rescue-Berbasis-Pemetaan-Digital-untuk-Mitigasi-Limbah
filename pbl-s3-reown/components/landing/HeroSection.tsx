import Link from "next/link";
import MapPreview from "./MapPreview";

export default function HeroSection() {
  return (
    <section
      id="beranda"
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#F04A28] via-[#EC6B4D] to-[#FFF7E9] pb-20 pt-28 sm:pb-24 sm:pt-36"
    >
      <div className="mx-auto w-full max-w-6xl px-5">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-sm font-medium text-white">
          <span className="h-2 w-2 rounded-full bg-white" />
          Platform penyelamatan lokal
        </p>

        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl">
              BERI KESEMPATAN KEDUA.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
              Temukan makanan berlebih dan barang layak pakai di sekitarmu sebelum menjadi limbah.
            </p>
          </div>

          <Link
            href="/katalog"
            className="w-fit rounded-full bg-white px-6 py-3.5 text-sm font-bold text-stone-900 shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Jelajahi di sekitar
          </Link>
        </div>

        <div className="mt-12">
          <MapPreview />
        </div>
      </div>
    </section>
  );
}
