"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { products as staticProducts } from "@/lib/pembeli/productsData";

const KEY = "reown_seller_products";

const read = () => {
  try {
    const v = localStorage.getItem(KEY);
    return v ? JSON.parse(v) : [];
  } catch {
    return [];
  }
};

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [sellerProducts, setSellerProducts] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSellerProducts(read());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(sellerProducts));
    } catch {
      alert("Penyimpanan penuh. Gunakan gambar yang lebih kecil.");
    }
  }, [sellerProducts, ready]);

  // Sinkron antar tab
  useEffect(() => {
    const onStorage = (e) => e.key === KEY && setSellerProducts(read());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addProduct = useCallback(
    (p) => setSellerProducts((prev) => [{ ...p, id: `S-${Date.now()}`, isSeller: true }, ...prev]),
    []
  );
  const updateProduct = useCallback(
    (id, patch) => setSellerProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p))),
    []
  );
  const removeProduct = useCallback(
    (id) => setSellerProducts((prev) => prev.filter((p) => p.id !== id)),
    []
  );

  // Produk untuk pembeli: buatan penjual (paling atas) + data statis
  const allProducts = useMemo(() => [...sellerProducts, ...staticProducts], [sellerProducts]);

  return (
    <ProductsContext.Provider
      value={{ sellerProducts, allProducts, addProduct, updateProduct, removeProduct, ready }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProductsStore() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProductsStore harus dipakai di dalam <ProductsProvider>");
  return ctx;
}

// Perkecil gambar sebelum disimpan di localStorage (lebar maks 800px, JPEG)
export function compressImage(file, maxWidth = 800, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}