import type { ReactNode } from "react";
import { fmtDate, fmtPrice } from "@/lib/admin/format";
import type { Product } from "@/lib/admin/types";
import ProductThumb from "./ProductThumb";

/** Satu baris produk (dipakai di Kelola Produk dan Dihapus). */
export default function ProductRow({
  product, seller, badges, extra, actions,
}: {
  product: Product;
  seller: string;
  badges?: ReactNode;
  extra?: ReactNode;
  actions: ReactNode;
}) {
  return (
    <li className="adm-prow">
      <ProductThumb product={product} />
      <div className="adm-prow-main">
        <div className="adm-prow-name">
          <b>{product.name}</b>
          {badges}
        </div>
        <div className="adm-muted">
          {seller} · {product.category} · {fmtPrice(product.price)} · diunggah {fmtDate(product.uploadedAt)}
        </div>
        {extra}
      </div>
      <div className="adm-prow-actions">{actions}</div>
    </li>
  );
}
