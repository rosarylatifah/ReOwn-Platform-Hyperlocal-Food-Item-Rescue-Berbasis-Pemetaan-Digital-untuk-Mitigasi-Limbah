"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Item } from "@/types/item";

const STORAGE_KEY = "reown:cart:v1";

interface CartContextValue {
  items: Item[];
  count: number;
  /** false sampai data localStorage selesai dibaca (hindari hydration mismatch) */
  hydrated: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (item: Item) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): Item[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is Item => !!x && typeof x === "object" && typeof (x as Item).id === "string"
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Baca keranjang tersimpan setelah mount + sinkron antar-tab
  useEffect(() => {
    setItems(readStorage());
    setHydrated(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Simpan setiap perubahan (hanya setelah data awal terbaca, supaya tidak menimpa dengan [])
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage penuh / diblokir: abaikan, keranjang tetap jalan di memori */
    }
  }, [items, hydrated]);

  const ids = useMemo(() => new Set(items.map((i) => i.id)), [items]);

  const add = useCallback((item: Item) => {
    setItems((prev) => (prev.some((i) => i.id === item.id) ? prev : [...prev, item]));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const has = useCallback((id: string) => ids.has(id), [ids]);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(
    () => ({ items, count: items.length, hydrated, isOpen, open, close, add, remove, clear, has }),
    [items, hydrated, isOpen, open, close, add, remove, clear, has]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam <CartProvider>");
  return ctx;
}