"use client";

import { useState } from "react";
import EmptyState from "@/components/admin/EmptyState";
import { DateFilter, SearchInput, SelectFilter, Toolbar } from "@/components/admin/Filters";
import MessageDetailModal, { ADMIN_STATUS_LABEL, KIND_TONE, STATUS_TONE } from "@/components/admin/MessageDetailModal";
import Pagination, { usePaged } from "@/components/admin/Pagination";
import StatusChip from "@/components/admin/StatusChip";
import Tabs from "@/components/admin/Tabs";
import UserCell from "@/components/admin/UserCell";
import { fmtDateTime } from "@/lib/admin/format";
import { KIND_LABEL, markRead, useMessages } from "@/lib/contact";

const inTab = (m, t) =>
  t === "masuk" ? m.status === "baru" || m.status === "dibaca" : m.status === t;

const startOf = (d) => (d ? new Date(d + "T00:00:00").getTime() : null);
const endOf = (d) => (d ? new Date(d + "T23:59:59.999").getTime() : null);

export default function PesanPage() {
  const { messages } = useMessages();
  const [tab, setTab] = useState("masuk");
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("semua");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [open, setOpen] = useState(null);

  const inRange = (at) => {
    const f = startOf(from);
    const t = endOf(to);
    if (!f && !t) return true;
    if (!at) return false;
    const ts = new Date(at).getTime();
    return (f === null || ts >= f) && (t === null || ts <= t);
  };

  const needle = q.trim().toLowerCase();
  const list = messages
    .filter((m) => inTab(m, tab))
    .filter((m) => kind === "semua" || m.kind === kind)
    .filter((m) => (m.subject + " " + m.body + " " + m.userName + " " + m.userEmail).toLowerCase().includes(needle))
    .filter((m) => inRange(m.createdAt))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const paged = usePaged(list);

  const hasFilter = q || from || to || kind !== "semua";
  const clearFilters = () => {
    setQ("");
    setFrom("");
    setTo("");
    setKind("semua");
    paged.setPage(1);
  };

  return (
    <>
      <Tabs
        active={tab}
        onChange={(t) => { setTab(t); paged.setPage(1); }}
        tabs={[
          { id: "masuk", label: "Masuk", count: messages.filter((m) => inTab(m, "masuk")).length },
          { id: "dibalas", label: "Dibalas", count: messages.filter((m) => inTab(m, "dibalas")).length },
          { id: "selesai", label: "Selesai", count: messages.filter((m) => inTab(m, "selesai")).length },
        ]}
      />
      <Toolbar>
        <SearchInput
          value={q}
          onChange={(v) => { setQ(v); paged.setPage(1); }}
          placeholder="Cari subjek, isi, atau pengirim"
        />
        <SelectFilter
          value={kind}
          onChange={(v) => { setKind(v); paged.setPage(1); }}
          label="Filter jenis"
          options={[
            { value: "semua", label: "Semua jenis" },
            { value: "pertanyaan", label: "Pertanyaan" },
            { value: "saran", label: "Saran" },
            { value: "kendala", label: "Kendala" },
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
          <EmptyState
            title={messages.length === 0 ? "Belum ada pesan masuk" : "Tidak ada pesan di sini"}
            hint={messages.length === 0
              ? "Pesan dari halaman Hubungi akan muncul di sini. Pengirim harus sudah punya akun."
              : "Ubah tab, jenis, kata kunci, atau rentang tanggal."}
          />
        ) : (
          <>
            <div className="adm-scroll">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Waktu (WIB)</th><th>Pengirim</th><th>Jenis</th><th>Pesan</th><th>Status</th>
                    <th><span className="adm-sr">Aksi</span></th>
                  </tr>
                </thead>
                <tbody>
                  {paged.pageItems.map((m) => (
                    <tr key={m.id}>
                      <td className="adm-nowrap">{fmtDateTime(m.createdAt)}</td>
                      <td><UserCell username={m.userName} email={m.userEmail} /></td>
                      <td><StatusChip tone={KIND_TONE[m.kind]}>{KIND_LABEL[m.kind]}</StatusChip></td>
                      <td className="adm-clamp">
                        <b>{m.subject}</b>
                        <span className="adm-clamp2">{m.body}</span>
                      </td>
                      <td><StatusChip tone={STATUS_TONE[m.status]}>{ADMIN_STATUS_LABEL[m.status]}</StatusChip></td>
                      <td>
                        <div className="adm-actcol">
                          <button
                            type="button"
                            className="adm-act adm-act--main"
                            onClick={() => { markRead(m.id); setOpen(m.id); }}
                          >
                            Buka
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

      {open && <MessageDetailModal messageId={open} onClose={() => setOpen(null)} />}
    </>
  );
}