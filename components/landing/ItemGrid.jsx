import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ItemCarousel from "./ItemCarousel";

const defaultItems = [
  { id: "1", name: "Fresh Sourdough Boule", price: "Gratis", distance: "0.3 km", owner: "Artisan Bakery", image: "/images/roti.jpg", emoji: "🍞" },
  { id: "2", name: "Vintage Glass Carafe", price: "15k", distance: "1.2 km", owner: "Elena V.", image: "/images/karafe.jpg", emoji: "🏺" },
  { id: "3", name: "Heirloom Tomato Box", price: "Gratis", distance: "0.8 km", owner: "Community Garden", image: "/images/tomat.jpg", emoji: "🍅" },
];

/** Lingkaran blur hangat: wrapper = parallax saat scroll, isi = melayang pelan */
function Blob({ className, floatDelay = "0s" }) {
  return (
    <div aria-hidden className={`parallax pointer-events-none absolute ${className}`}>
      <div className="float-slow h-full w-full rounded-full" style={{ animationDelay: floatDelay, background: "inherit", filter: "blur(48px)" }} />
    </div>
  );
}

export default function ItemGrid({ items = defaultItems }) {
  return (
    <section id="sekitarmu" className="relative overflow-hidden py-16 md:py-24">
      <Blob className="-left-24 top-10 h-72 w-72 bg-amber-200/60" />
      <Blob className="-right-20 top-1/2 h-80 w-80 bg-orange-200/50" floatDelay="-3s" />
      <Blob className="bottom-0 left-1/3 h-56 w-56 bg-[#D85834]/10" floatDelay="-1.5s" />

      <div className="relative mx-auto max-w-[1100px] px-4 md:px-6">
        <Reveal>
          <SectionHeading
            splitWords
            className="md:ml-[17%]"
            title="Ada apa saja di sekitarmu?"
            desc="Lihat daftar barang terdekat, atur jarak jangkauanmu, dan jelajahi peta buat nemuin harta karun di sekitar tetangga!"
          />
        </Reveal>
        <Reveal from="up" delay={250} className="mt-12">
          <ItemCarousel items={items} />
        </Reveal>
      </div>
    </section>
  );
}