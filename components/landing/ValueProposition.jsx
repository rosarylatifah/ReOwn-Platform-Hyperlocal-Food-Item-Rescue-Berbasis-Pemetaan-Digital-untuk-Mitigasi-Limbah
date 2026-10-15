import ImpactCard from "./ImpactCard";
import { gochiHand, sueEllen } from "@/lib/fonts";

const faces = [
  {
    lines: ["Makanan yang", "terbuang tahun ini"],
    unit: "Ton makanan",
    tonnesPerYear: 1_050_000_000,
    sourceLabel: "The World Counts",
    sourceUrl: "https://www.theworldcounts.com/footprint/food/food-waste-facts",
    hint: "Klik untuk lihat barang yang terbuang",
  },
  {
    lines: ["Barang yang", "terbuang tahun ini"],
    unit: "Ton sampah",
    tonnesPerYear: 2_120_000_000,
    sourceLabel: "The World Counts",
    sourceUrl: "https://www.theworldcounts.com/earth/waste/global-waste-problem",
    hint: "Klik untuk lihat makanan yang terbuang",
  },
];

const headlinePart1 = [
  { t: "Tidak" },
  { t: "semua" },
  { t: "yang" },
  { t: "tak", hl: true },
  { t: "terpakai", hl: true },
  { t: "harus" },
];

const headlinePart2 = [
  { t: "menjadi" },
  { t: "limbah" },
];

const wordCss = `
  .reown-word { display: inline-block; position: relative; z-index: 1; padding-bottom: 0.45em; cursor: default; }
  .reown-word-inner {
    display: inline-block;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.25s ease;
  }
  .reown-word-inner.hl { color: #F23A10; }
  .reown-word:hover .reown-word-inner,
  .reown-word:active .reown-word-inner { transform: translateY(-0.28em); color: #16A34A; }
`;

export default function ValueProposition() {
  return (
    <section id="dampak" className="relative overflow-x-clip px-6 py-16 md:py-28">
      <style>{wordCss}</style>

      <h2
        className={`${sueEllen.className} mx-auto max-w-5xl text-center text-4xl uppercase leading-snug tracking-wide text-stone-900 md:text-5xl lg:text-[3.4rem]`}
      >
        <div>
          {headlinePart1.map((w, i) => (
            <span key={i}>
              <span className="reown-word">
                <span className={`reown-word-inner${w.hl ? " hl" : ""}`}>{w.t}</span>
              </span>
              {i < headlinePart1.length - 1 && " "}
            </span>
          ))}
        </div>
        <div className="mt-1">
          {headlinePart2.map((w, i) => (
            <span key={i}>
              <span className="reown-word">
                <span className={`reown-word-inner${w.hl ? " hl" : ""}`}>{w.t}</span>
              </span>
              {i < headlinePart2.length - 1 && " "}
            </span>
          ))}
        </div>
      </h2>

      <p className={`${gochiHand.className} mx-auto mt-4 max-w-3xl text-center text-lg leading-relaxed text-stone-600 md:text-xl`}>
        Makanan dan barang sehari-hari masih bisa bermanfaat meskipun sudah tidak dibutuhkan pemiliknya. ReOwn membantu mempertemukannya dengan orang yang lebih membutuhkan sebelum berakhir di tempat sampah
      </p>

      <div className="relative isolate mx-auto mt-14 max-w-[640px] pb-10">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[470px] w-[1000px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(246,150,120,0.8),rgba(246,150,120,0)_100%)]"
        />
        <ImpactCard faces={faces} />
      </div>
    </section>
  );
}