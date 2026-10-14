// CONTOH untuk teman satu tim: halaman lain tinggal import komponen bersama.
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import ItemCard from "@/components/common/ItemCard";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Item } from "@/types/item";

const items: Item[] = [
  { id: "1", name: "Roti sourdough sisa", price: "Gratis", distance: "0,3 km", owner: "Toko roti Artisan", emoji: "🍞" },
  { id: "2", name: "Minyak zaitun botol kaca", price: "Rp 15 rb", distance: "1,2 km", owner: "Elena V.", emoji: "🫒" },
];

export default function KatalogPage() {
  return (
    <>
      {/* variant "solid" (default): latar krem, teks gelap, cocok untuk halaman tanpa hero berwarna */}
      <Navbar />
      <main className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading title="Katalog barang" desc="Semua barang yang bisa diselamatkan di sekitarmu." />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.id}>
              <ItemCard item={item} />
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
