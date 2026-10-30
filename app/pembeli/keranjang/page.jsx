"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartDrawer } from "@/app/pembeli/context/cartDrawer";

// Halaman keranjang lama sudah digantikan drawer di sisi kanan.
// Jika ada link lama ke /pembeli/keranjang, buka drawer lalu pindah ke halaman produk.
export default function BuyerCartRedirect() {
  const router = useRouter();
  const { open } = useCartDrawer();

  useEffect(() => {
    open();
    router.replace("/pembeli/produk");
  }, [open, router]);

  return null;
}
