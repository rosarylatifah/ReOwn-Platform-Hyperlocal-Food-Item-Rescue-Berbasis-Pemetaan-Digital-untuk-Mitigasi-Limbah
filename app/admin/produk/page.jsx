"use client";

import { useState } from "react";
import ActionDialog from "@/components/admin/ActionDialog";
import EmptyState from "@/components/admin/EmptyState";
import { DateFilter, SearchInput, SelectFilter, Toolbar } from "@/components/admin/Filters";
import Pagination, { usePaged } from "@/components/admin/Pagination";
import ProductCell from "@/components/admin/ProductCell";
import ProductDetailModal from "@/components/admin/ProductDetailModal";
import StatusChip from "@/components/admin/StatusChip";
import UserCell from "@/components/admin/UserCell";
import UserDetailModal from "@/components/admin/UserDetailModal";
import { fmtDateTime, fmtPrice } from "@/lib/admin/format";
import { REMOVAL_REASONS } from "@/lib/admin/labels";
import { useAdmin } from "@/lib/admin/store";

const startOf = (d) => (d ? new Date(d + "T00:00:00").getTime() : null);
const endOf = (d) => (d ? new Date(d + "T23:59:59.999").getTime() : null);

export default function ProdukPage() {
  const { products, reports, getUser, takedownProduct } = useAdmin();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("semua");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [detail, setDetail] = useState(null);
  const [seller, setSeller] = useState(null);
  const [takedown, setTakedown] = useState(null);

  const inRange = (at) => {
    const f = startOf(from);
    const t = endOf(to);
    if (!f && !t) return true;
    if (!at) return false;
    const ts = new Date(at).getTime();
    return (f === null || ts >= f) && (t === null || ts <= t);
  };

  const active = products.filter((p) => p.status === "aktif");
  const needle = q.trim().toLowerCase();
  const list = active.filter((p) => {
    const name = getUser(p.sellerId)?.username ?? "";
    const hit = (p.name + " " + name).toLowerCase().includes(needle);
    return hit && (cat === "semua" || p.category === cat) && inRange(p.uploadedAt);
  });
  const paged = usePaged(list);
  const target = takedown ? products.find((p) => p.id === takedown) : undefined;

  const hasFilter = q || from || to || cat !== "semua";
  const clearFilters = () => {
    setQ("");
    setFrom("");
    setTo("");
    setCat("semua");
    paged.setPage(1);
  };

  return (
    <>
      <p className="adm-intro">
        <b>{active.length}</b> produk sedang aktif di katalog.
      </p>
      <Toolbar>
        <SearchInput
          value={q}
          onChange={(v) => { setQ(v); paged.setPage(1); }}
          placeholder="Cari nama produk atau penjual"
        />
        <SelectFilter
          value={cat}
          onChange={(v) => { setCat(v); paged.setPage(1); }}
          label="Filter kategori"
          options={[
            { value: "semua", label: "Semua kategori" },
            { value: "Makanan", label: "Makanan" },
            { value: "Barang", label: "Barang" },
          ]}
        />
        <DateFilter label="Dari" value={from} onChange={(v) => { setFrom(v); paged.setPage(1); }} />
        <DateFilter label="Sampai" value={to} onChange={(v) => { setTo(v); paged.setPage(1); }} />
        {hasFilter && (
          <button type="button" className="adm-tb-clear" onClick={clearFilters}>
            Reset
          </button>
        )}
      </Toolbar>

      <section className="adm-panel">
        {list.length === 0 ? (
          <EmptyState title="Produk tidak ditemukan" hint="Ubah kata kunci, kategori, atau rentang tanggal." />
        ) : (
          <>
            <div className="adm-scroll">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Produk</th><th>Penjual</th><th>Harga</th><th>Diunggah (WIB)</th><th>Laporan</th>
                    <th><span className="adm-sr">Aksi</span></th>
                  </tr>
                </thead>
                <tbody>
                  {paged.pageItems.map((p) => {
                    const open = reports.filter((r) => r.productId === p.id && r.status !== "selesai").length;
                    const sellerUser = getUser(p.sellerId);
                    return (
                      <tr key={p.id}>
                        <td><ProductCell product={p} /></td>
                        <td>
                          {sellerUser ? (
                            <button
                              type="button"
                              className="adm-profile"
                              aria-label={`Lihat profil ${sellerUser.username}`}
                              onClick={() => setSeller(p.sellerId)}
                            >
                              <UserCell username={sellerUser.username} />
                            </button>
                          ) : "-"}
                        </td>
                        <td className="adm-nowrap">{fmtPrice(p.price)}</td>
                        <td className="adm-nowrap">{fmtDateTime(p.uploadedAt)}</td>
                        <td>{open > 0 ? <StatusChip tone="warn">{open} terbuka</StatusChip> : <span className="adm-muted">-</span>}</td>
                        <td>
                          <div className="adm-actcol">
                            <button type="button" className="adm-act adm-act--ghost" onClick={() => setDetail(p.id)}>
                              Lihat detail
                            </button>
                            <button type="button" className="adm-act adm-act--danger" onClick={() => setTakedown(p.id)}>
                              Turunkan
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination page={paged.page} totalPages={paged.totalPages} total={paged.total} onChange={paged.setPage} />
          </>
        )}
      </section>

      {detail && (
        <ProductDetailModal
          productId={detail}
          onClose={() => setDetail(null)}
          onOpenSeller={setSeller}
          footer={
            <>
              <button type="button" className="adm-btn" onClick={() => setDetail(null)}>Tutup</button>
              <button type="button" className="adm-btn adm-btn--danger" onClick={() => { setTakedown(detail); setDetail(null); }}>Turunkan</button>
            </>
          }
        />
      )}

      {seller && <UserDetailModal userId={seller} onClose={() => setSeller(null)} />}

      {target && (
        <ActionDialog
          title={`Turunkan “${target.name}”?`}
          description="Produk hilang dari katalog dan masuk ke halaman Dihapus. Penjual diberi tahu dan bisa mengajukan banding."
          confirmLabel="Turunkan produk"
          danger
          optionLabel="Alasan"
          options={REMOVAL_REASONS.map((r) => ({ value: r, label: r }))}
          onConfirm={({ value }) => takedownProduct(target.id, value)}
          onClose={() => setTakedown(null)}
        />
      )}
    </>
  );
}