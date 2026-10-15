import Link from "next/link";
import PolkaDots from "@/components/ui/PolkaDots";
import { fraunces } from "@/lib/fonts";

export default function CtaBanner() {
  return (
    <section id="mulai" className="relative overflow-hidden bg-[#FEE4C6] py-20 md:py-28">
      <PolkaDots />

      <div className="relative mx-auto max-w-[1100px] px-6 md:pl-[10%]">
        <h2 className={`${fraunces.className} max-w-3xl text-3xl font-extrabold uppercase leading-[1.05] tracking-tight text-stone-900 md:text-[2.6rem]`}>
          Siap beri kesempatan kedua buat barangmu?
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-stone-600">
          Gabung untuk saling berbagi barang &amp; makanan berlebih, kurangi sampah, dan buat aktivitas berbagi menjadi lebih seru dan bermanfaat!
        </p>
        <Link
          href="/katalog"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#D85834] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#C24A28] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834]"
        >
          Yuk Mulai Berbagi
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </Link>
      </div>
    </section>
  );
}