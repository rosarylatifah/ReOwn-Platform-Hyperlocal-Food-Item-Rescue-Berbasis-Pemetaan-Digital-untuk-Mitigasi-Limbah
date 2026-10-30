"use client";

import { useState } from "react";
import EmptyState from "@/components/admin/EmptyState";
import { DateFilter, SearchInput, SelectFilter, Toolbar } from "@/components/admin/Filters";
import Pagination, { usePaged } from "@/components/admin/Pagination";
import StatusChip from "@/components/admin/StatusChip";
import UserCell from "@/components/admin/UserCell";
import UserDetailModal from "@/components/admin/UserDetailModal";
import { fmtDate } from "@/lib/admin/format";
import { USER_STATUS_LABEL, USER_STATUS_TONE } from "@/lib/admin/labels";
import { useAdmin } from "@/lib/admin/store";

const startOf = (d) => (d ? new Date(d + "T00:00:00").getTime() : null);
const endOf = (d) => (d ? new Date(d + "T23:59:59.999").getTime() : null);

export default function PenggunaPage() {
  const { users, products } = useAdmin();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("semua");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [detail, setDetail] = useState(null);

  const inRange = (at) => {
    const f = startOf(from);
    const t = endOf(to);
    if (!f && !t) return true;
    if (!at) return false;
    const ts = new Date(at).getTime();
    return (f === null || ts >= f) && (t === null || ts <= t);
  };

  const needle = q.trim().toLowerCase();
  const list = users.filter((u) => {
    const hit = (u.username + " " + u.email).toLowerCase().includes(needle);
    return hit && (status === "semua" || u.status === status) && inRange(u.joinedAt);
  });
  const paged = usePaged(list);

  const hasFilter = q || from || to || status !== "semua";
  const clearFilters = () => {
    setQ("");
    setFrom("");
    setTo("");
    setStatus("semua");
    paged.setPage(1);
  };

  return (
    <>
      <Toolbar>
        <SearchInput
          value={q}
          onChange={(v) => { setQ(v); paged.setPage(1); }}
          placeholder="Cari username atau email"
        />
        <SelectFilter
          value={status}
          onChange={(v) => { setStatus(v); paged.setPage(1); }}
          label="Filter status"
          options={[
            { value: "semua", label: "Semua status" },
            ...Object.keys(USER_STATUS_LABEL).map((k) => ({ value: k, label: USER_STATUS_LABEL[k] })),
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
          <EmptyState title="Pengguna tidak ditemukan" hint="Ubah kata kunci, status, atau rentang tanggal." />
        ) : (
          <>
            <div className="adm-scroll">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Pengguna</th><th>Bergabung</th><th>Produk aktif</th><th>Status</th>
                    <th><span className="adm-sr">Aksi</span></th>
                  </tr>
                </thead>
                <tbody>
                  {paged.pageItems.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <button type="button" className="adm-profile" aria-label={`Lihat profil ${u.username}`} onClick={() => setDetail(u.id)}>
                          <UserCell username={u.username} email={u.email} />
                        </button>
                      </td>
                      <td className="adm-nowrap">{fmtDate(u.joinedAt)}</td>
                      <td>{products.filter((p) => p.sellerId === u.id && p.status === "aktif").length}</td>
                      <td><StatusChip tone={USER_STATUS_TONE[u.status]}>{USER_STATUS_LABEL[u.status]}</StatusChip></td>
                      <td>
                        <div className="adm-actcol">
                          <button type="button" className="adm-act adm-act--ghost" onClick={() => setDetail(u.id)}>
                            Lihat detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={paged.page} totalPages={paged.totalPages} total={paged.total} onChange={paged.setPage} />
          </>
        )}
      </section>

      {detail && <UserDetailModal userId={detail} onClose={() => setDetail(null)} />}
    </>
  );
}