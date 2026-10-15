import Link from "next/link";
import MapPreview from "./MapPreview";
import StatusDot from "@/components/ui/StatusDot";
import { delaGothic, gochiHand } from "@/lib/fonts";
import { getMonthlyRescuedCount } from "@/lib/stats";

export default async function HeroSection() {
  const rescuedCount = await getMonthlyRescuedCount();

  return (
    <section
      id="beranda"
      // Gradasi dasar sederhana; transisi ke krem ditangani overlay fade di bawah
      className="relative flex w-full flex-col overflow-hidden bg-[linear-gradient(to_bottom,#F24827_0%,#F5613F_55%,#F77C5B_100%)] pb-28 pt-24 md:min-h-[100svh] md:pb-36"
    >
      {/* Fade ke warna section berikutnya (#FFF7E9), banyak titik warna biar mulus */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-44 md:h-56 bg-[linear-gradient(to_bottom,rgba(255,247,233,0)_0%,rgba(255,247,233,0.04)_12%,rgba(255,247,233,0.15)_28%,rgba(255,247,233,0.35)_45%,rgba(255,247,233,0.6)_62%,rgba(255,247,233,0.82)_78%,rgba(255,247,233,0.95)_90%,rgba(255,247,233,1)_100%)]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col">
        {/* Teks hero: sedikit menjorok dibanding peta */}
        <div className="px-7 md:px-14">
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-[#F23A10] bg-white px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#E0452A]">
            <StatusDot />
            Platform penyelamatan lokal
          </p>

          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1
                className={`${delaGothic.className} text-[clamp(1.875rem,4.5vw,4.5rem)] uppercase leading-[0.9] tracking-tight text-white`}
              >
                Beri Kesempatan
                <br />
                Kedua.
              </h1>
              <p className={`${gochiHand.className} mt-3 max-w-2xl text-base leading-snug text-white md:text-[17px]`}>
                Temukan makanan berlebih dan barang layak pakai di sekitarmu sebelum menjadi limbah.
              </p>
            </div>

            {/* Tetap di landing page: scroll ke section #dampak */}
            <Link
              href="#dampak"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-[13px] text-[12px] font-semibold text-stone-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#95F57C] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Jelajahi di Sekitar
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m12 3 9 5-9 5-9-5 9-5Z" />
                <path d="m3 13 9 5 9-5" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Peta: hampir selebar layar */}
        <div className="mt-7 flex flex-1 px-7">
          <MapPreview rescuedCount={rescuedCount} />
        </div>
      </div>
    </section>
  );
}