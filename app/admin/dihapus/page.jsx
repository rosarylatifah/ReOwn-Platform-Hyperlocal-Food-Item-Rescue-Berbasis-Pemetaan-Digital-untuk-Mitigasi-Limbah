"use client";

import Link from "next/link";
import { useState } from "react";
import ActionDialog from "@/components/admin/ActionDialog";
import EmptyState from "@/components/admin/EmptyState";
import { DateFilter, SearchInput, Toolbar } from "@/components/admin/Filters";
import Pagination, { usePaged } from "@/components/admin/Pagination";
import ProductCell from "@/components/admin/ProductCell";
import ProductDetailModal from "@/components/admin/ProductDetailModal";
import StatusChip from "@/components/admin/StatusChip";
import Tabs from "@/components/admin/Tabs";
import UserCell from "@/components/admin/UserCell";
import UserDetailModal from "@/components/admin/UserDetailModal";
import { fmtDateTime } from "@/lib/admin/format";
import { REMOVAL_SOURCE_LABEL, USER_STATUS_LABEL, USER_STATUS_TONE } from "@/lib/admin/labels";
import { useAdmin } from "@/lib/admin/store";

// Ubah "YYYY-MM-DD" menjadi batas awal / akhir hari (waktu lokal)
const startOf = (d) => (d ? new Date(d + "T00:00:00").getTime() : null);
const endOf = (d) => (d ? new Date(d + "T23:59:59.999").getTime() : null);

export default function DihapusPage() {
  const { products, users, appeals, getUser, restoreProduct, changeUserStatus } = useAdmin();
  const [tab, setTab] = useState("produk");
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [detailP, setDetailP] = useState(null);
  const [detailU, setDetailU] = useState(null);
  const [restoreP, setRestoreP] = useState(null);
  const [restoreU, setRestoreU] = useState(null);

  const removedProducts = products.filter((p) => p.status === "diturunkan");
  const restrictedUsers = users.filter((u) => u.status === "suspend" || u.status === "banned");
  const needle = q.trim().toLowerCase();

  const inRange = (at) => {
    const f = startOf(from);
    const t = endOf(to);
    if (!f && !t) return true;
    if (!at) return false;
    const ts = new Date(at).getTime();
    return (f === null || ts >= f) && (t === null || ts <= t);
  };

  const prodList = removedProducts
    .filter((p) => (p.name + " " + (getUser(p.sellerId)?.username ?? "")).toLowerCase().includes(needle))
    .filter((p) => inRange(p.removal?.at))
    .sort((a, b) => new Date(b.removal?.at ?? 0).getTime() - new Date(a.removal?.at ?? 0).getTime());
  const userList = restrictedUsers
    .filter((u) => (u.username + " " + u.email).toLowerCase().includes(needle))
    .filter((u) => inRange(u.sanction?.at));

  const pProd = usePaged(prodList);
  const pUser = usePaged(userList);
  const pTarget = restoreP ? products.find((p) => p.id === restoreP) : undefined;
  const uTarget = restoreU ? users.find((u) => u.id === restoreU) : undefined;

  const resetPages = () => {
    pProd.setPage(1);
    pUser.setPage(1);
  };
  const hasFilter = q || from || to;
  const clearFilters = () => {
    setQ("");
    setFrom("");
    setTo("");
    resetPages();
  };

  return (
    <>
      <Tabs
        active={tab}
        onChange={(t) => { setTab(t); clearFilters(); }}
        tabs={[
          { id: "produk", label: "Produk", count: removedProducts.length },
          { id: "akun", label: "Akun", count: restrictedUsers.length },
        ]}
      />
      <Toolbar>
        <SearchInput
          value={q}
          onChange={(v) => { setQ(v); resetPages(); }}
          placeholder={tab === "produk" ? "Cari nama produk atau penjual" : "Cari username atau email"}
        />
        <DateFilter label="Dari" value={from} onChange={(v) => { setFrom(v); resetPages(); }} />
        <DateFilter label="Sampai" value={to} onChange={(v) => { setTo(v); resetPages(); }} />
        {hasFilter && (
          <button type="button" className="adm-tb-clear" onClick={clearFilters}>
            Reset
          </button>
        )}
      </Toolbar>

      {tab === "produk" && (
        <section className="adm-panel">
          {prodList.length === 0 ? (
            <EmptyState
              title={hasFilter ? "Tidak ada hasil untuk filter ini" : "Tidak ada produk yang diturunkan"}
              hint={hasFilter ? "Ubah kata kunci atau rentang tanggal." : "Produk yang diturunkan admin akan tampil di sini."}
            />
          ) : (
            <>
              <div className="adm-scroll">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Produk</th><th>Penjual</th><th>Alasan penurunan</th><th>Sumber</th><th>Sejak (WIB)</th>
                      <th><span className="adm-sr">Aksi</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pProd.pageItems.map((p) => {
                      const appealing = appeals.some((a) => a.productId === p.id && a.status === "menunggu");
                      return (
                        <tr key={p.id}>
                          <td><ProductCell product={p} /></td>
                          <td>
                            <button type="button" className="adm-profile" onClick={() => setDetailU(p.sellerId)}>
                              <UserCell username={getUser(p.sellerId)?.username ?? "-"} />
                            </button>
                          </td>
                          <td className="adm-reasoncell">
                            <div>{p.removal?.reason ?? "-"}</div>
                            {p.removal && <small>oleh {p.removal.by}</small>}
                          </td>
                          <td>{p.removal && <StatusChip tone="muted">{REMOVAL_SOURCE_LABEL[p.removal.source]}</StatusChip>}</td>
                          <td className="adm-nowrap">{p.removal ? fmtDateTime(p.removal.at) : "-"}</td>
                          <td>
                            <div className="adm-actcol">
                              {appealing && (
                                <Link href="/admin/laporan" className="adm-act adm-act--appeal">
                                  Tinjau Banding &rarr;
                                </Link>
                              )}
                              <button type="button" className="adm-act adm-act--ghost" onClick={() => setDetailP(p.id)}>
                                Lihat detail
                              </button>
                              <button type="button" className="adm-act adm-act--main" onClick={() => setRestoreP(p.id)}>
                                Pulihkan
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Pagination page={pProd.page} totalPages={pProd.totalPages} total={pProd.total} onChange={pProd.setPage} />
            </>
          )}
        </section>
      )}

      {tab === "akun" && (
        <section className="adm-panel">
          {userList.length === 0 ? (
            <EmptyState
              title={hasFilter ? "Tidak ada hasil untuk filter ini" : "Tidak ada akun yang disuspend atau di-ban"}
              hint={hasFilter ? "Ubah kata kunci atau rentang tanggal." : undefined}
            />
          ) : (
            <>
              <div className="adm-scroll">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Akun</th><th>Status</th><th>Alasan sanksi</th><th>Sejak (WIB)</th>
                      <th><span className="adm-sr">Aksi</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pUser.pageItems.map((u) => (
                      <tr key={u.id}>
                        <td><UserCell username={u.username} email={u.email} /></td>
                        <td><StatusChip tone={USER_STATUS_TONE[u.status]}>{USER_STATUS_LABEL[u.status]}</StatusChip></td>
                        <td>{u.sanction?.reason ?? "-"}</td>
                        <td className="adm-nowrap">{u.sanction ? fmtDateTime(u.sanction.at) : "-"}</td>
                        <td>
                          <div className="adm-actcol">
                            <button type="button" className="adm-act adm-act--ghost" onClick={() => setDetailU(u.id)}>
                              Lihat detail
                            </button>
                            <button type="button" className="adm-act adm-act--main" style={{ width: "auto", padding: "0 22px" }} onClick={() => { setRestoreP(detailP); setDetailP(null); }}>
                              Pulihkan
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={pUser.page} totalPages={pUser.totalPages} total={pUser.total} onChange={pUser.setPage} />
            </>
          )}
        </section>
      )}

      {detailP && (
        <ProductDetailModal
          productId={detailP}
          onClose={() => setDetailP(null)}
          onOpenSeller={setDetailU}
          footer={
            <>
              <button type="button" className="adm-btn" onClick={() => setDetailP(null)}>Tutup</button>
              <button type="button" className="adm-btn adm-btn--primary" onClick={() => { setRestoreP(detailP); setDetailP(null); }}>Pulihkan</button>
            </>
          }
        />
      )}
      {detailU && <UserDetailModal userId={detailU} onClose={() => setDetailU(null)} />}

      {pTarget && (
        <ActionDialog
          title={`Pulihkan “${pTarget.name}”?`}
          description="Produk tampil kembali di katalog dan penjual diberi tahu."
          confirmLabel="Pulihkan produk"
          onConfirm={() => restoreProduct(pTarget.id)}
          onClose={() => setRestoreP(null)}
        />
      )}
      {uTarget && (
        <ActionDialog
          title={`Pulihkan akun @${uTarget.username}?`}
          description="Akun kembali aktif. Produk yang ikut diturunkan karena suspend dipulihkan otomatis, sedangkan produk karena ban dipulihkan manual dari tab Produk."
          confirmLabel="Pulihkan akun"
          onConfirm={() => changeUserStatus(uTarget.id, "aktif", "")}
          onClose={() => setRestoreU(null)}
        />
      )}
    </>
  );
}