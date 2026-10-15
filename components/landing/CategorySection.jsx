import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { fraunces } from "@/lib/fonts";

// Ganti ke nama file foto aslimu kalau berbeda
const IMG = {
  food: "/images/piring.png",
  item: "/images/sofa.png",
};

const categories = [
  {
    badge: "Makanan",
    title: "Makanan Berlebih",
    desc: "Selamatkan bahan segar, roti, sampai makanan siap saji sebelum terbuang. Cocok buat diambil cepat dan dibagi bareng!",
    tags: ["Bahan Dapur", "Roti & Kue", "Makanan Cepat Saji"],
    cta: "Lihat makanan",
    href: "/katalog",
  },
  {
    badge: "Barang",
    title: "Barang Bekas Layak Pakai",
    desc: "Peralatan dapur, dekorasi, dan perlengkapan harian yang nganggur di rumah tetangga tapi masih bagus buat kamu.",
    tags: ["Alat Dapur", "Perlengkapan Rumah", "Perabotan Harian"],
    cta: "Lihat barang",
    href: "/katalog",
  },
];

const delay = (ms) => ({ "--rv-delay": `${ms}ms` });

/** Elemen isi kartu: muncul berurutan setelah kartunya masuk */
function Stagger({ i, children }) {
  return (
    <div className="rv rv-up" style={delay(380 + i * 90)}>
      {children}
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-block rounded-full bg-[#FBE9E2] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-[#D85834]">
      {children}
    </span>
  );
}

function Tags({ tags }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((t, idx) => (
        <li key={t} className="rv rv-up" style={delay(700 + idx * 80)}>
          <span className="block cursor-default rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D85834]/40 hover:bg-[#FBE9E2] hover:text-[#D85834]">
            {t}
          </span>
        </li>
      ))}
    </ul>
  );
}

function CardLink({ href, children }) {
  return (
    <div className="rv rv-up relative z-10" style={delay(950)}>
      <Link
        href={href}
        className="group/link inline-flex items-center gap-2 text-sm font-bold text-[#D85834] transition-colors hover:text-[#B94524]"
      >
        {children}
        <span
          aria-hidden
          className="inline-block transition-transform duration-300 group-hover/link:translate-x-1.5"
        >
          →
        </span>
      </Link>
    </div>
  );
}

const cardBase =
  "rv-card group relative rounded-[26px] border border-stone-100 bg-white p-6 shadow-[0_10px_30px_rgba(120,70,30,0.08)] hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(120,70,30,0.15)]";

export default function CategorySection() {
  const [food, item] = categories;
  const titleClass = `${fraunces.className} mt-3 text-xl font-extrabold leading-tight text-stone-900 md:text-[1.85rem]`;
  const descClass = "mt-2.5 max-w-xl text-sm leading-relaxed text-stone-600 md:text-[0.95rem]";
  const rowClass = "mt-5 flex flex-wrap items-center gap-x-5 gap-y-3";

  return (
    <section
      id="selamatkan"
      className="relative isolate scroll-mt-24 overflow-x-clip py-16 md:py-20"
    >
      {/* Background dekoratif */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(#E4CFB2_1.3px,transparent_1.3px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)]" />
        <div className="float-slow absolute -left-40 top-16 h-96 w-96 rounded-full bg-[#FFD3AE]/50 blur-3xl" />
        <div
          className="float-slow absolute -right-32 bottom-8 h-[28rem] w-[28rem] rounded-full bg-[#CFE3B4]/50 blur-3xl"
          style={{ animationDelay: "-3s" }}
        />
      </div>

      <div className="mx-auto max-w-[1100px] px-4 md:px-8">
        <Reveal from="up">
          <SectionHeading
            className="mx-auto text-center"
            title="Yuk, Selamatkan Yang Masih Layak!"
            desc="Intip makanan dan barang yang lagi dibagikan tetangga sekitar."
          />
        </Reveal>

        <div className="mt-10 flex flex-col gap-8 md:mt-14 md:gap-10">
          {/* Kartu makanan: masuk dari kiri, piring menyusul */}
          <Reveal
            as="article"
            from="left"
            className={`${cardBase} md:ml-auto md:w-[78%] md:py-7 md:pl-[12%] md:pr-[5%]`}
          >
            <div
              className="rv rv-left pointer-events-none mx-auto mb-5 h-32 w-32 md:absolute md:-left-[22%] md:top-1/2 md:mx-0 md:mb-0 md:h-[112%] md:w-auto md:-translate-y-1/2"
              style={delay(180)}
            >
              <div className="parallax md:h-full">
                <Image
                  src={IMG.food}
                  alt="Aneka makanan segar di atas piring"
                  width={500}
                  height={500}
                  className="float-slow aspect-square w-full rounded-full object-cover shadow-[0_18px_40px_rgba(120,70,30,0.22)] transition-transform duration-500 ease-out group-hover:rotate-[-6deg] group-hover:scale-105 md:h-full md:w-auto"
                />
              </div>
            </div>

            <Stagger i={0}><Badge>{food.badge}</Badge></Stagger>
            <Stagger i={1}><h3 className={titleClass}>{food.title}</h3></Stagger>
            <Stagger i={2}><p className={descClass}>{food.desc}</p></Stagger>
            <div className={rowClass}>
              <Tags tags={food.tags} />
              <CardLink href={food.href}>{food.cta}</CardLink>
            </div>
          </Reveal>

          {/* Kartu barang: masuk dari kanan, sofa menyusul */}
          <Reveal
            as="article"
            from="right"
            className={`${cardBase} md:w-[78%] md:py-7 md:pl-[5%] md:pr-[9%]`}
          >
            <Stagger i={0}><Badge>{item.badge}</Badge></Stagger>
            <Stagger i={1}><h3 className={titleClass}>{item.title}</h3></Stagger>
            <Stagger i={2}><p className={descClass}>{item.desc}</p></Stagger>
            <div className={rowClass}>
              <Tags tags={item.tags} />
              <CardLink href={item.href}>{item.cta}</CardLink>
            </div>

            <div
              className="rv rv-right pointer-events-none mx-auto mt-6 w-44 md:absolute md:-right-[18%] md:top-1/2 md:mx-0 md:mt-0 md:h-[120%] md:w-auto md:-translate-y-1/2"
              style={delay(180)}
            >
              <div className="parallax md:h-full">
                <Image
                  src={IMG.item}
                  alt="Sofa hijau bekas layak pakai"
                  width={400}
                  height={550}
                  style={{ animationDelay: "-3s" }}
                  className="float-slow h-auto w-full drop-shadow-[0_22px_22px_rgba(60,40,20,0.2)] transition-transform duration-500 ease-out group-hover:rotate-3 group-hover:scale-105 md:h-full md:w-auto"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}