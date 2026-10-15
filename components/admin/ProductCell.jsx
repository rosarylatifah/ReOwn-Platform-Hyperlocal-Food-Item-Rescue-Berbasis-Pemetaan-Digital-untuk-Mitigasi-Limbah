import ProductThumb from "./ProductThumb";

/** Sel produk untuk tabel: foto kecil + nama tebal + kategori. */
export default function ProductCell({ product }) {
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