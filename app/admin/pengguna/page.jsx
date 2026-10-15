"use client";

import { useState } from "react";
import EmptyState from "@/components/admin/EmptyState";
import { SearchInput, SelectFilter, Toolbar } from "@/components/admin/Filters";
import Pagination, { usePaged } from "@/components/admin/Pagination";
import StatusChip from "@/components/admin/StatusChip";
import UserCell from "@/components/admin/UserCell";
import UserDetailModal from "@/components/admin/UserDetailModal";
import { fmtDate } from "@/lib/admin/format";
import { USER_STATUS_LABEL, USER_STATUS_TONE } from "@/lib/admin/labels";
import { useAdmin } from "@/lib/admin/store";

export default function PenggunaPage() {
  const { users, products } = useAdmin();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("semua");
  const [detail, setDetail] = useState(null);

  const list = users.filter((u) => {
    const hit = (u.username + " " + u.email).toLowerCase().includes(q.trim().toLowerCase());
    return hit && (status === "semua" || u.status === status);
  });
  const paged = usePaged(list);

  return (
    <>
      <Toolbar>
        <SearchInput value={q} onChange={(v) => { setQ(v); paged.setPage(1); }} placeholder="Cari username atau email" />
        <SelectFilter
          value={status}
          onChange={(v) => { setStatus(v); paged.setPage(1); }}
          label="Filter status"
          options={[
            { value: "semua", label: "Semua status" },
            ...Object.keys(USER_STATUS_LABEL).map((k) => ({ value: k, label: USER_STATUS_LABEL[k] })),
          ]}
        />
      </Toolbar>

      <section className="adm-panel">
        {list.length === 0 ? (
          <EmptyState title="Pengguna tidak ditemukan" hint="Ubah kata kunci atau filter status." />
        ) : (
          <>
            <div className="adm-scroll">
              <table className="adm-table">
                <thead>
                  <tr><th>Pengguna</th><th>Bergabung</th><th>Produk aktif</th><th>Status</th><th><span className="adm-sr">Aksi</span></th></tr>
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
                      <td><button type="button" className="adm-btn adm-btn--sm" onClick={() => setDetail(u.id)}>Detail</button></td>
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