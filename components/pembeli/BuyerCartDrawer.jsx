"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Eye, MapPin, Send, Truck } from "lucide-react";
import { fraunces } from "@/lib/fonts";
import { useCartDrawer } from "@/app/pembeli/context/cartDrawer";
import { useBuyerCart } from "@/app/pembeli/hooks/useBuyerCart";
import CartDetail from "@/components/pembeli/CartDetail";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834]";

const deliveryBase = `inline-flex items-center gap-1.5 rounded-xl border-[1.5px] px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 ${focusRing}`;
const deliveryActive = "border-[#D85834] bg-[#FBE9E2] text-[#D85834]";
const deliveryIdle = "border-stone-200 bg-white text-stone-600 hover:border-[#D85834]/50 hover:text-[#D85834]";

export default function BuyerCartDrawer() {
  const { isOpen, close } = useCartDrawer();
  const {
    cart,
    selectedOrder,
    setSelectedOrder,
    updateDeliveryOption,
    removeFromCart,
    calculateItemTotal,
    handleDecreaseQuantity,
    handleIncreaseQuantity,
    handleSendRequest,
    handleSendSelected,
  } = useBuyerCart();

  const closeRef = useRef(null);
  const cancelRef = useRef(null);
  const [confirm, setConfirm] = useState(null); // { id, name } | null

  // Pilihan item untuk kirim sekaligus
  const [selected, setSelected] = useState([]);
  const isSelected = (id) => selected.includes(String(id));
  const toggleSelect = (id) =>
    setSelected((prev) =>
      prev.includes(String(id)) ? prev.filter((x) => x !== String(id)) : [...prev, String(id)]
    );
  const selectedItems = cart.filter((i) => isSelected(i.id));
  const allSelected = cart.length > 0 && selectedItems.length === cart.length;
  const toggleAll = () => setSelected(allSelected ? [] : cart.map((i) => String(i.id)));
  const sendSelected = () => {
    if (handleSendSelected(selectedItems)) setSelected([]);
  };

  // Ref supaya handler Esc tahu status dialog tanpa memicu ulang efek kunci-scroll
  const confirmOpenRef = useRef(false);
  confirmOpenRef.current = confirm !== null;
  const detailOpenRef = useRef(false);
  detailOpenRef.current = selectedOrder !== null && selectedOrder !== undefined;

  // Esc untuk menutup + kunci scroll di belakang saat drawer terbuka
  useEffect(() => {
    if (!isOpen) return;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (confirmOpenRef.current) setConfirm(null);
      else if (detailOpenRef.current) return; // modal detail menangani Esc-nya sendiri
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
    removeFromCart(confirm.id);
    setConfirm(null);
  };

  // Drawer disembunyikan sementara saat popup detail terbuka
  const visible = isOpen && selectedOrder == null;

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-[1100] bg-stone-900/40 backdrop-blur-sm"
          />
        )}
        {visible && (
          <motion.aside
            key="cart-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Keranjang"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed right-0 top-0 z-[1110] flex h-full w-full max-w-md flex-col bg-[#FFF7E9] shadow-[-20px_0_60px_rgba(60,30,10,0.25)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
              <div>
                <h2 className={`${fraunces.className} text-2xl font-extrabold text-stone-900`}>Keranjang</h2>
                <p className="mt-0.5 text-xs text-stone-500">
                  {cart.length > 0 ? `${cart.length} barang tersimpan` : "Belum ada barang"}
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
            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <span aria-hidden className="text-6xl">🧺</span>
                <p className="mt-4 text-base font-semibold text-stone-900">Keranjangmu masih kosong</p>
                <p className="mt-1 text-sm text-stone-500">
                  Belum ada makanan atau barang rescue yang kamu pilih. Yuk mulai cari dan selamatkan barang di sekitarmu!
                </p>
                <Link
                  href="/pembeli/produk"
                  onClick={close}
                  className="mt-6 rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#D85834]"
                >
                  Mulai belanja
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
                  <AnimatePresence initial={false}>
                    {cart.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.25 }}
                        className="rounded-2xl bg-white p-3 ring-1 ring-stone-100"
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected(item.id)}
                            onChange={() => toggleSelect(item.id)}
                            aria-label={`Pilih ${item.name}`}
                            className="mt-1 h-[18px] w-[18px] shrink-0 cursor-pointer accent-[#D85834]"
                          />

                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-amber-100 to-orange-200">
                            {item.image && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className={`${fraunces.className} truncate text-base font-extrabold leading-tight text-stone-900`}>
                              {item.name}
                            </p>
                            <p className={`${fraunces.className} mt-0.5 text-sm font-extrabold text-[#D85834]`}>
                              {calculateItemTotal(item)}
                            </p>
                            <p className="text-[11px] text-stone-500">
                              Satuan: {item.price || item.totalPrice}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => setConfirm({ id: item.id, name: item.name })}
                            aria-label={`Hapus ${item.name} dari keranjang`}
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-stone-500 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                              <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
                            </svg>
                          </button>
                        </div>

                        {/* Jumlah + lihat detail */}
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-stone-600">Jumlah:</span>
                            <div className="flex items-center overflow-hidden rounded-xl border border-stone-200">
                              <button
                                type="button"
                                onClick={() => handleDecreaseQuantity(item)}
                                aria-label="Kurangi jumlah"
                                className={`bg-stone-50 px-3 py-1 font-bold text-stone-600 transition-colors hover:bg-[#FBE9E2] hover:text-[#D85834] ${focusRing}`}
                              >
                                -
                              </button>
                              <span className="bg-white px-3 py-1 text-[13px] font-bold text-stone-900">
                                {item.quantity || 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleIncreaseQuantity(item)}
                                aria-label="Tambah jumlah"
                                className={`bg-stone-50 px-3 py-1 font-bold text-[#D85834] transition-colors hover:bg-[#FBE9E2] ${focusRing}`}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedOrder(item)}
                            className={`inline-flex items-center gap-1.5 rounded-xl bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-700 transition-all duration-200 hover:bg-[#D85834] hover:text-white ${focusRing}`}
                          >
                            <Eye size={13} /> Lihat detail
                          </button>
                        </div>

                        {/* Opsi pengantaran */}
                        <div className="mt-3">
                          <span className="mb-1.5 block text-xs font-semibold text-stone-600">Opsi pengantaran:</span>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => updateDeliveryOption(item.id, "Opsi Lainnya")}
                              aria-pressed={item.deliveryOption === "Opsi Lainnya"}
                              className={`${deliveryBase} ${item.deliveryOption === "Opsi Lainnya" ? deliveryActive : deliveryIdle}`}
                            >
                              <Truck size={13} /> Opsi Lainnya
                            </button>
                            <button
                              type="button"
                              onClick={() => updateDeliveryOption(item.id, "Ambil di Tempat")}
                              aria-pressed={item.deliveryOption === "Ambil di Tempat"}
                              className={`${deliveryBase} ${item.deliveryOption === "Ambil di Tempat" ? deliveryActive : deliveryIdle}`}
                            >
                              <MapPin size={13} /> Ambil di Tempat
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSendRequest(item)}
                          className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#D85834] ${focusRing}`}
                        >
                          <Send size={15} /> Kirim permintaan
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                {/* Footer */}
                <div className="space-y-3 border-t border-stone-200 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-stone-800">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        className="h-[18px] w-[18px] accent-[#D85834]"
                      />
                      Pilih semua
                    </label>
                    <span className="text-xs text-stone-500">{selectedItems.length} dipilih</span>
                  </div>

                  <button
                    type="button"
                    onClick={sendSelected}
                    disabled={selectedItems.length === 0}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#D85834] disabled:cursor-not-allowed disabled:bg-stone-300 ${focusRing}`}
                  >
                    <Send size={15} /> Kirim permintaan ({selectedItems.length})
                  </button>

                  <Link
                    href="/pembeli/produk"
                    onClick={close}
                    className="block w-full rounded-full border-[1.5px] border-stone-800 py-2.5 text-center text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-900 hover:text-[#FFF7E9]"
                  >
                    Lanjut jelajah
                  </Link>
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
                      Hapus barang ini?
                    </h3>
                    <p id="confirm-desc" className="mt-2 text-sm leading-relaxed text-stone-600">
                      <span className="font-semibold text-stone-900">{confirm.name}</span> akan dihapus dari keranjangmu.
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

      {/* Modal detail item */}
      <CartDetail
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onSendRequest={(updatedItem) => {
          handleSendRequest(updatedItem);
          setSelectedOrder(null);
        }}
        onDeleteItem={(id) => {
          removeFromCart(id);
          setSelectedOrder(null);
        }}
      />
    </>
  );
}