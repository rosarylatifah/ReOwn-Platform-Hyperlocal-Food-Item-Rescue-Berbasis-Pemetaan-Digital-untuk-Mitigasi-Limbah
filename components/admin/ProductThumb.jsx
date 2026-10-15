export default function ProductThumb({ product, small }) {
  const cls = "adm-thumb" + (small ? " adm-thumb--sm" : "");
  if (product.image) {
    return (
      <div className={cls}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.name} />
      </div>
    );
  }
  return (
    <div className={cls} role="img" aria-label={"Foto " + product.name}>
      <span>{product.emoji}</span>
    </div>
  );
}