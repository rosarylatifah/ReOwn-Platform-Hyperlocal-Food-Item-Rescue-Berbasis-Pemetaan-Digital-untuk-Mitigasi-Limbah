import Navbar from "./Navbar";
import Footer from "./Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { fraunces } from "@/lib/fonts";

function PageBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Grid titik oranye, memudar ke bawah */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(216,88,52,0.22)_1.5px,transparent_1.5px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
      {/* Lingkaran krem di pinggir */}
      <span className="absolute -left-24 top-40 aspect-square w-72 rounded-full bg-[#FDD9B9]/70" />
      <span className="absolute -right-28 top-[26rem] aspect-square w-96 rounded-full bg-[#FEE4C6]" />
      <span className="absolute -left-16 bottom-24 aspect-square w-64 rounded-full bg-[#FDD9B9]/60" />
      <span className="absolute -right-10 bottom-0 aspect-square w-44 rounded-full bg-[#FDD9B9]/70" />
    </div>
  );
}

export default function PageShell({ title, desc, width = "prose", pattern = false, children }) {
  return (
    <>
      {/* Pita oranye di belakang navbar, sama seperti hero di landing page */}
      <div className="bg-[#F24827] min-h-[69px]">
        <Navbar variant="overlay" />
      </div>

      <div className="relative">
        {pattern && <PageBackdrop />}

        <main className={`relative z-10 mx-auto px-5 pb-20 pt-12 md:pt-16 ${width === "prose" ? "max-w-3xl" : "max-w-5xl"}`}>
          <SectionHeading title={title} desc={desc} />
          <div
            className={
              pattern
                ? "mt-10 rounded-[22px] bg-white/80 p-6 shadow-[0_12px_30px_rgba(120,70,30,0.10)] ring-1 ring-stone-100 backdrop-blur-sm md:p-10"
                : "mt-10"
            }
          >
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}

/** Satu bagian teks (judul kecil + isi) untuk halaman Privasi / Syarat. */
export function Prose({ title, children }) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className={`${fraunces.className} text-xl font-extrabold text-stone-900`}>{title}</h2>
      <div className="mt-2 space-y-3 text-[15px] leading-relaxed text-stone-600">{children}</div>
    </section>
  );
}