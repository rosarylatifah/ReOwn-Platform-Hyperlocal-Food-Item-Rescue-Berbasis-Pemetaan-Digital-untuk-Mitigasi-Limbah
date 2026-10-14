"use client";

import { motion } from "motion/react";
import { useCart } from "@/lib/cart";

/** Tombol keranjang di navbar. `className` diisi warna/border sesuai variant navbar. */
export default function CartButton({ className = "" }: { className?: string }) {
  const { count, open, hydrated } = useCart();
  const shown = hydrated ? count : 0;

  return (
    <button
      type="button"
      onClick={open}
      aria-label={shown ? `Buka keranjang, ${shown} barang` : "Buka keranjang"}
      className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-full border-[1.5px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 md:h-[41px] md:w-[41px] ${className}`}
    >
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M6 7h12l1 13H5L6 7Z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>

      {shown > 0 && (
        <motion.span
          key={shown}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 14 }}
          className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#95F57C] px-1 text-[11px] font-bold leading-none text-stone-900 ring-2 ring-stone-900"
        >
          {shown}
        </motion.span>
      )}
    </button>
  );
}