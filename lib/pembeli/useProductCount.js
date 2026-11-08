"use client";

import { useEffect, useState } from "react";
import { getSharedProducts } from "@/lib/pembeli/productHelper";

export function useProductCount() {
  const [n, setN] = useState(null);
  useEffect(() => {
    const load = () => setN(getSharedProducts().length);
    load();
    const onStorage = (e) => { if (!e.key || e.key.startsWith("reown:")) load(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return n;
}