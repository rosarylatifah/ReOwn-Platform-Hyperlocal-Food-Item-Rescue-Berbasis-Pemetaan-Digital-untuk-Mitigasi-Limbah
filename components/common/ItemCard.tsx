"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, animate, motion, useReducedMotion, useSpring } from "motion/react";
import { fraunces } from "@/lib/fonts";
import type { Item } from "@/types/item";

interface ItemCardProps {
  item: Item;
  /** Kartu tengah di carousel: tilt 3D, count-up jarak, dan tombol aksi */
  featured?: boolean;
  /** Dipanggil saat tombol "Lihat detail" diklik */
  onDetail?: (item: Item) => void;
}

/** "0.8 km" -> hitung naik dari 0 ke 0.8 saat kartu menjadi aktif */
function Distance({ value, active }: { value: string; active: boolean }) {
  const match = value.match(/^([\d.]+)\s*(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const decimals = match?.[1].split(".")[1]?.length ?? 0;
  const unit = match?.[2] ?? "";
  const [v, setV] = useState(target);

  useEffect(() => {
    if (!match) return;
    if (!active) {
      setV(target);
      return;
    }
    const c = animate(0, target, { duration: 0.9, ease: "easeOut", onUpdate: setV });
    return () => c.stop();
  }, [active, target]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!match) return <>{value}</>;
  return (
    <>
      {v.toFixed(decimals)} {unit}
    </>
  );
}

export default function ItemCard({ item, featured = false, onDetail }: ItemCardProps) {
  const reduced = useReducedMotion();
  const free = item.price === "Gratis";

  // Tilt 3D mengikuti kursor (hanya kartu tengah)
  const rx = useSpring(0, { stiffness: 180, damping: 18 });
  const ry = useSpring(0, { stiffness: 180, damping: 18 });
  const tilt = featured && !reduced;

  return (
    <motion.article
      onMouseMove={(e) => {
        if (!tilt) return;
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      whileHover={reduced ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className="group overflow-hidden rounded-[20px] bg-white shadow-[0_10px_30px_rgba(120,70,30,0.12)] ring-1 ring-stone-100 transition-shadow duration-300 hover:shadow-[0_22px_48px_rgba(120,70,30,0.22)]"
    >
      {/* Rasio gambar diperpendek (sebelumnya 7/5) supaya kartu tidak terlalu tinggi */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-amber-100 to-orange-200">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(min-width: 768px) 28vw, 90vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <span aria-hidden className="absolute inset-0 grid place-items-center text-6xl transition-transform duration-700 group-hover:scale-110">
            {item.emoji}
          </span>
        )}
      </div>

      <div className="px-5 pb-5 pt-4">
        <div className="flex items-center justify-between text-xs">
          {free ? (
            <span className="inline-flex items-center gap-1.5 font-bold uppercase text-[#D85834]">
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D85834] opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D85834]" />
              </span>
              {item.price}
            </span>
          ) : (
            <span className="font-bold text-stone-900">{item.price}</span>
          )}
          <span className="tabular-nums text-stone-500">
            <Distance value={item.distance} active={featured} />
          </span>
        </div>

        <h3 className={`${fraunces.className} mt-2 text-lg font-extrabold leading-tight text-stone-900`}>{item.name}</h3>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-stone-500">
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
            className="group-hover:animate-bounce motion-reduce:animate-none"
          >
            <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
          </svg>
          {item.owner}
        </p>

        {/* Isi ruang kosong kartu tengah; muncul/menghilang halus saat kartu aktif */}
        <AnimatePresence initial={false}>
          {featured && (
            <motion.div
              key="actions"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="-mx-3 -mb-3 overflow-hidden px-3 pb-3"
            >
              <p className="mt-3 text-xs leading-relaxed text-stone-500">
                {free ? "Gratis untuk tetangga. Ambil sebelum kehabisan." : "Harga tetangga, bisa tawar langsung dengan pemilik."}
              </p>
              <motion.button
                type="button"
                onClick={() => onDetail?.(item)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="mt-4 w-full rounded-full bg-stone-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#D85834]"
              >
                Lihat detail
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}