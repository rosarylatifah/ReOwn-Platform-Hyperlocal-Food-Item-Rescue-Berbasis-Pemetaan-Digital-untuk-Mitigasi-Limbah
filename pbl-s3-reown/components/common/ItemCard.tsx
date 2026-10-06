import type { Item } from "@/types/item";

export default function ItemCard({ item }: { item: Item }) {
  const free = item.price === "Gratis";
  return (
    <article className="h-full overflow-hidden rounded-3xl bg-white shadow-lg shadow-orange-900/5">
      {/* Ganti blok emoji ini dengan <Image /> foto barang */}
      <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-amber-100 to-orange-200 text-7xl">
        {item.emoji}
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between text-xs">
          <span className={`rounded-full px-2.5 py-1 font-bold ${free ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-[#C8442F]"}`}>
            {item.price}
          </span>
          <span className="text-stone-500">{item.distance}</span>
        </div>
        <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-stone-900">{item.name}</h3>
        <p className="mt-1 text-sm text-stone-500">{item.owner}</p>
      </div>
    </article>
  );
}
