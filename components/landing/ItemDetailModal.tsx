"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { fraunces } from "@/lib/fonts";
import { useCart } from "@/lib/cart";
import type { Item } from "@/types/item";

interface Props {
  item: Item | null;
  onClose: () => void;
}

export default function ItemDetailModal({ item, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { add, has, open: openCart } = useCart();

  useEffect(() => setMounted(true), []);

  // Esc untuk menutup, kunci scroll di belakang, kembalikan fokus saat ditutup
  useEffect(() => {
    if (!item) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
      prevFocus?.focus?.();
    };
  }, [item, onClose]);

  if (!mounted) return null;

  const free = item?.price === "Gratis";
  const inCart = item ? has(item.id) : false;
  const description =
    (item as (Item & { description?: string }) | null)?.description ??
    (free
      ? "Barang ini diberikan gratis untuk tetangga sekitar. Segera hubungi pemilik dan ambil sebelum kehabisan."
      : "Harga khusus tetangga. Kamu bisa tanya kondisi barang dan tawar langsung dengan pemilik.");

  const handleCart = () => {
    if (!item) return;
    if (inCart) {
      // Sudah di keranjang: tutup popup lalu buka keranjang
      onClose();
      openCart();
    } else {
      add(item);
    }
  };

  return createPortal(
    <AnimatePresence>
      {item && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          onKeyDown={(e) => e.stopPropagation()}
          className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-stone-900/50 p-4 backdrop-blur-sm"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Detail ${item.name}`}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-[24px] bg-white shadow-[0_30px_80px_rgba(60,30,10,0.35)]"
          >
            <div className="relative aspect-[16/10] bg-gradient-to-br from-amber-100 to-orange-200">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(min-width: 768px) 448px, 100vw"
                  className="object-cover"
                />
              ) : (
                <span aria-hidden className="absolute inset-0 grid place-items-center text-7xl">
                  {item.emoji}
                </span>
              )}
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-stone-900 shadow-sm backdrop-blur transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between text-xs">
                {free ? (
                  <span className="inline-flex items-center gap-1.5 font-bold uppercase text-[#D85834]">
                    <span className="h-2 w-2 rounded-full bg-[#D85834]" aria-hidden />
                    {item.price}
                  </span>
                ) : (
                  <span className="text-sm font-bold text-stone-900">{item.price}</span>
                )}
                <span className="tabular-nums text-stone-500">{item.distance}</span>
              </div>

              <h2 className={`${fraunces.className} mt-2 text-2xl font-extrabold leading-tight text-stone-900`}>
                {item.name}
              </h2>

              <p className="mt-2 flex items-center gap-1.5 text-sm text-stone-500">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
                </svg>
                {item.owner}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-stone-600">{description}</p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={handleCart}
                  className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-colors ${
                    inCart
                      ? "bg-[#95F57C] text-stone-900 hover:bg-stone-900 hover:text-[#95F57C]"
                      : "bg-stone-900 text-white hover:bg-[#D85834]"
                  }`}
                >
                  {inCart ? "✓ Di keranjang · Lihat keranjang" : "Tambah ke keranjang"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-stone-700 ring-1 ring-stone-300 transition-colors hover:bg-stone-100"
                >
                  Tutup
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}