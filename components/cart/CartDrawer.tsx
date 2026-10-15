"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { fraunces } from "@/lib/fonts";
import { useCart } from "@/lib/cart";

type Confirm = { kind: "item"; id: string; name: string } | { kind: "all" } | null;

export default function CartDrawer() {
  const { items, isOpen, close, remove, clear } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [confirm, setConfirm] = useState<Confirm>(null);

  // Ref supaya handler Esc selalu tahu status dialog tanpa memicu ulang efek kunci-scroll
  const confirmOpenRef = useRef(false);
  confirmOpenRef.current = confirm !== null;

  // Esc untuk menutup + kunci scroll di belakang saat drawer terbuka
  useEffect(() => {
    if (!isOpen) return;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (confirmOpenRef.current) setConfirm(null);
      else close();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
    };
  }, [isOpen, close]);

  // Reset dialog saat drawer ditutup
  useEffect(() => {
    if (!isOpen) setConfirm(null);
  }, [isOpen]);

  // Fokus ke tombol "Batal" saat dialog muncul (aksi paling aman)
  useEffect(() => {
    if (confirm) cancelRef.current?.focus();
  }, [confirm]);

  const handleConfirm = () => {
    if (!confirm) return;
    if (confirm.kind === "item") remove(confirm.id);
    else clear();
    setConfirm(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="cart-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={close}
          className="fixed inset-0 z-[110] bg-stone-900/40 backdrop-blur-sm"
        />
      )}
      {isOpen && (
        <motion.aside
          key="cart-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Keranjang"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
          className="fixed right-0 top-0 z-[120] flex h-full w-full max-w-md flex-col bg-[#FFF7E9] shadow-[-20px_0_60px_rgba(60,30,10,0.25)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
            <div>
              <h2 className={`${fraunces.className} text-2xl font-extrabold text-stone-900`}>Keranjang</h2>
              <p className="mt-0.5 text-xs text-stone-500">
                {items.length > 0 ? `${items.length} barang tersimpan` : "Belum ada barang"}
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Tutup keranjang"
              className="grid h-9 w-9 place-items-center rounded-full bg-white text-stone-900 ring-1 ring-stone-200 transition-colors hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          {/* Isi */}
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
              <span aria-hidden className="text-6xl">🧺</span>
              <p className="mt-4 text-base font-semibold text-stone-900">Keranjangmu masih kosong</p>
              <p className="mt-1 text-sm text-stone-500">
                Buka &quot;Lihat detail&quot; pada barang yang kamu suka, lalu pilih &quot;Tambah ke keranjang&quot;.
              </p>
              <button
                type="button"
                onClick={close}
                className="mt-6 rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#D85834]"
              >
                Lanjut jelajah
              </button>
            </div>
          ) : (
            <>
              <ul className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
                <AnimatePresence initial={false}>
                  {items.map((it) => {
                    const free = it.price === "Gratis";
                    return (
                      <motion.li
                        key={it.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-center gap-4 rounded-2xl bg-white p-3 ring-1 ring-stone-100"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-amber-100 to-orange-200">
                          {it.image ? (
                            <Image src={it.image} alt={it.name} fill sizes="64px" className="object-cover" />
                          ) : (
                            <span aria-hidden className="absolute inset-0 grid place-items-center text-3xl">
                              {it.emoji}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className={`${fraunces.className} truncate text-base font-extrabold leading-tight text-stone-900`}>
                            {it.name}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-stone-500">
                            {it.owner} · {it.distance}
                          </p>
                          <p className={`mt-1 text-xs font-bold ${free ? "uppercase text-[#D85834]" : "text-stone-900"}`}>
                            {it.price}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setConfirm({ kind: "item", id: it.id, name: it.name })}
                          aria-label={`Hapus ${it.name} dari keranjang`}
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-stone-500 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
                          </svg>
                        </button>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>

              {/* Footer */}
              <div className="space-y-3 border-t border-stone-200 px-6 py-5">
                <p className="text-xs leading-relaxed text-stone-500">
                  Keranjang tersimpan di perangkat ini. Buat akun supaya bisa diakses dari mana saja.
                </p>
                <Link
                  href="/daftar"
                  onClick={close}
                  className="block w-full rounded-full bg-stone-900 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#D85834]"
                >
                  Buat akun
                </Link>
                <button
                  type="button"
                  onClick={() => setConfirm({ kind: "all" })}
                  className="w-full rounded-full py-2 text-sm font-semibold text-stone-600 transition-colors hover:text-red-600"
                >
                  Kosongkan keranjang
                </button>
              </div>
            </>
          )}

          {/* Dialog konfirmasi hapus */}
          <AnimatePresence>
            {confirm && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => setConfirm(null)}
                className="absolute inset-0 z-10 grid place-items-center bg-stone-900/40 px-6"
              >
                <motion.div
                  role="alertdialog"
                  aria-modal="true"
                  aria-labelledby="confirm-title"
                  aria-describedby="confirm-desc"
                  initial={{ scale: 0.92, y: 8 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-sm rounded-[22px] bg-white p-6 text-center shadow-[0_24px_60px_rgba(60,30,10,0.3)]"
                >
                  <span aria-hidden className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-50 text-2xl">
                    🗑️
                  </span>
                  <h3 id="confirm-title" className={`${fraunces.className} mt-4 text-xl font-extrabold text-stone-900`}>
                    {confirm.kind === "item" ? "Hapus barang ini?" : "Kosongkan keranjang?"}
                  </h3>
                  <p id="confirm-desc" className="mt-2 text-sm leading-relaxed text-stone-600">
                    {confirm.kind === "item" ? (
                      <>
                        <span className="font-semibold text-stone-900">{confirm.name}</span> akan dihapus dari
                        keranjangmu.
                      </>
                    ) : (
                      <>Semua {items.length} barang di keranjangmu akan dihapus.</>
                    )}
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      ref={cancelRef}
                      type="button"
                      onClick={() => setConfirm(null)}
                      className="rounded-full border-[1.5px] border-stone-300 py-2.5 text-sm font-semibold text-stone-800 transition-colors hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834]"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirm}
                      className="rounded-full bg-red-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    >
                      Ya, hapus
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}