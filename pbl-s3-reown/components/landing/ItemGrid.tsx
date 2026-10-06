import ItemCard from "@/components/common/ItemCard";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Item } from "@/types/item";

const defaultItems: Item[] = [
  { id: "1", name: "Roti sourdough sisa", price: "Gratis", distance: "0,3 km", owner: "Toko roti Artisan", emoji: "🍞" },
  { id: "2", name: "Minyak zaitun botol kaca", price: "Rp 15 rb", distance: "1,2 km", owner: "Elena V.", emoji: "🫒" },
  { id: "3", name: "Buah tomat heirloom", price: "Gratis", distance: "0,8 km", owner: "Kebun komunitas", emoji: "🍅" },
  { id: "4", name: "Karafe kaca antik", price: "Rp 25 rb", distance: "1,5 km", owner: "Dewi S.", emoji: "🏺" },
];

interface ItemGridProps {
  items?: Item[]; // nanti ganti dengan data dari API
}

export default function ItemGrid({ items = defaultItems }: ItemGridProps) {
  return (
    <section id="sekitarmu" className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <SectionHeading
        title="Ada apa saja di sekitarmu?"
        desc="Lihat daftar barang terdekat, atur jarak jangkauanmu, dan jelajahi peta buat nemuin harta karun di sekitar tetanggamu."
      />
      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.id}>
            <ItemCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
