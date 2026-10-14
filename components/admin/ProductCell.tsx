import type { Product } from "@/lib/admin/types";
import ProductThumb from "./ProductThumb";

/** Sel produk untuk tabel: foto kecil + nama tebal + kategori. */
export default function ProductCell({ product }: { product: Product }) {
  return (
    <div className="adm-user">
      <ProductThumb product={product} small />
      <div>
        <b>{product.name}</b>
        <small>{product.category}</small>
      </div>
    </div>
  );
}