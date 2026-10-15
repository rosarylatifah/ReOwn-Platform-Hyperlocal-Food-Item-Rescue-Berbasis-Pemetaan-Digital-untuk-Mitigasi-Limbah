"use client";

import type { ReactNode } from "react";
import { fmtDateTime, fmtPrice } from "@/lib/admin/format";
import { REMOVAL_SOURCE_LABEL } from "@/lib/admin/labels";
import { useAdmin } from "@/lib/admin/store";
import { productTimeline } from "@/lib/admin/timeline";
import CaseTimeline from "@/lib/admin/CaseTimeline";
import Modal from "./Modal";
import ProductThumb from "./ProductThumb";
import StatusChip from "./StatusChip";

/**
 * Detail produk (read-only). `footer` diisi tombol aksi oleh halaman pemanggil.
 * Bila `onOpenSeller` diberikan, nama penjual menjadi tombol untuk membuka profil dan riwayat akunnya.
 */
export default function ProductDetailModal({
  productId, onClose, footer, onOpenSeller,
}: {
  productId: string;
  onClose: () => void;
  footer?: ReactNode;
  onOpenSeller?: (userId: string) => void;
}) {
  const { getProduct, getUser, users, products, reports, appeals, activities } = useAdmin();
  const p = getProduct(productId);
  if (!p) return null;
  const seller = getUser(p.sellerId);
  const reportCount = reports.filter((r) => r.productId === p.id).length;

  return (
    <Modal title="Detail produk" onClose={onClose} wide footer={footer}>
      <div className="adm-detail">
        <ProductThumb product={p} />
        <dl className="adm-dl">
          <dt>Nama toko / penjual</dt>
          <dd>
            {seller && onOpenSeller ? (
              <>
                <button type="button" className="adm-linkbtn" onClick={() => onOpenSeller(seller.id)}>{seller.username}</button>
                <small className="adm-sub">Klik untuk melihat profil dan riwayat akun</small>
              </>
            ) : (
              seller?.username ?? "-"
            )}
          </dd>
          <dt>Nama produk</dt><dd>{p.name}</dd>
          <dt>Kategori</dt><dd>{p.category}</dd>
          <dt>Harga</dt><dd>{fmtPrice(p.price)}</dd>
          <dt>Alamat</dt><dd>{p.address}</dd>
          <dt>Tanggal pengunggahan</dt><dd>{fmtDateTime(p.uploadedAt)} WIB</dd>
          {p.expiresAt && (<><dt>Batas ambil / kedaluwarsa</dt><dd>{fmtDateTime(p.expiresAt)} WIB</dd></>)}
          <dt>Deskripsi</dt><dd>{p.description}</dd>
          <dt>Status</dt>
          <dd><StatusChip tone={p.status === "aktif" ? "ok" : "bad"}>{p.status === "aktif" ? "Aktif" : "Diturunkan"}</StatusChip></dd>
          <dt>Laporan terhadap produk</dt><dd>{reportCount === 0 ? "Belum ada" : `${reportCount} laporan`}</dd>
          {p.removal && (
            <>
              <dt>Diturunkan</dt>
              <dd>
                {p.removal.reason} · oleh {p.removal.by} · {fmtDateTime(p.removal.at)} WIB
                <small className="adm-sub">{REMOVAL_SOURCE_LABEL[p.removal.source]}</small>
              </dd>
            </>
          )}
        </dl>
      </div>
      <CaseTimeline events={productTimeline(p.id, { users, products, reports, appeals, activities })} />
    </Modal>
  );
}