"use client";

import { useState } from "react";
import { fmtDate, fmtDateTime, fmtPrice } from "@/lib/admin/format";
import { USER_STATUS_LABEL, USER_STATUS_TONE } from "@/lib/admin/labels";
import { useAdmin } from "@/lib/admin/store";
import { userTimeline } from "@/lib/admin/timeline";
import ActionDialog from "./ActionDialog";
import CaseTimeline from "@/lib/admin/CaseTimeline";
import Modal from "./Modal";
import ProductCell from "./ProductCell";
import ProductDetailModal from "./ProductDetailModal";
import StatusChip from "./StatusChip";

const COPY = {
  peringatan: { title: "Beri peringatan?", desc: "Peringatan tercatat di akun dan pengguna diberi tahu.", confirm: "Beri peringatan", danger: false },
  suspend: { title: "Suspend akun ini?", desc: "Pengguna tidak bisa masuk dan semua produk aktifnya diturunkan.", confirm: "Suspend akun", danger: true },
  banned: { title: "Ban akun ini secara permanen?", desc: "Pengguna diblokir dan semua produk aktifnya diturunkan. Pengguna masih bisa mengajukan banding.", confirm: "Ban permanen", danger: true },
  pulihkan: { title: "Pulihkan akun ini?", desc: "Akun kembali aktif. Produk yang ikut diturunkan karena suspend dipulihkan otomatis, sedangkan produk karena ban dipulihkan manual dari halaman Dihapus.", confirm: "Pulihkan akun", danger: false },
};

/** Profil akun: info, produk di akun ini, riwayat akun, dan tindakan moderasi. */
export default function UserDetailModal({ userId, onClose }) {
  const { users, products, reports, appeals, activities, changeUserStatus } = useAdmin();
  const [act, setAct] = useState(null);
  const [productId, setProductId] = useState(null);

  const user = users.find((u) => u.id === userId);
  if (!user) return null;

  const listed = products.filter((p) => p.sellerId === user.id);
  const activeCount = listed.filter((p) => p.status === "aktif").length;
  const against = reports.filter((r) => r.reportedUserId === user.id);
  const filed = reports.filter((r) => r.reporterId === user.id);
  const restricted = user.status === "suspend" || user.status === "banned";

  return (
    <Modal
      title="Detail pengguna"
      onClose={onClose}
      wide
      footer={
        restricted ? (
          <button type="button" className="adm-btn adm-btn--primary" onClick={() => setAct("pulihkan")}>Pulihkan akun</button>
        ) : (
          <>
            <button type="button" className="adm-btn" onClick={() => setAct("peringatan")}>Beri peringatan</button>
            <button type="button" className="adm-btn adm-btn--danger" onClick={() => setAct("suspend")}>Suspend</button>
            <button type="button" className="adm-btn adm-btn--danger" onClick={() => setAct("banned")}>Ban permanen</button>
          </>
        )
      }
    >
      <dl className="adm-dl">
        <dt>Username</dt><dd>{user.username}</dd>
        <dt>Email</dt><dd>{user.email}</dd>
        <dt>No. telepon</dt><dd>{user.phone}</dd>
        <dt>Bergabung</dt><dd>{fmtDate(user.joinedAt)}</dd>
        <dt>Status</dt>
        <dd>
          <StatusChip tone={USER_STATUS_TONE[user.status]}>{USER_STATUS_LABEL[user.status]}</StatusChip>
          {user.warnings > 0 && <small className="adm-sub">{user.warnings} peringatan tercatat</small>}
        </dd>
        {user.sanction && (
          <><dt>Sanksi terakhir</dt><dd>{user.sanction.reason}<small className="adm-sub">{fmtDateTime(user.sanction.at)} WIB</small></dd></>
        )}
        <dt>Produk</dt><dd>{activeCount} aktif dari {listed.length} listing</dd>
        <dt>Laporan terhadap akun</dt>
        <dd>{against.length} ({against.filter((r) => r.outcome === "diterima").length} diterima)</dd>
        <dt>Laporan yang dibuat</dt><dd>{filed.length}</dd>
      </dl>

      <section className="adm-sec">
        <h3>Produk di akun ini ({listed.length})</h3>
        {listed.length === 0 ? (
          <p className="adm-muted">Akun ini belum mengunggah produk.</p>
        ) : (
          <table className="adm-mini">
            <thead>
              <tr>
                <th>Produk</th><th>Harga</th><th>Status</th><th>Laporan</th>
                <th><span className="adm-sr">Aksi</span></th>
              </tr>
            </thead>
            <tbody>
              {listed.map((p) => {
                const n = reports.filter((r) => r.productId === p.id).length;
                return (
                  <tr key={p.id}>
                    <td><ProductCell product={p} /></td>
                    <td className="adm-nowrap">{fmtPrice(p.price)}</td>
                    <td><StatusChip tone={p.status === "aktif" ? "ok" : "bad"}>{p.status === "aktif" ? "Aktif" : "Diturunkan"}</StatusChip></td>
                    <td className="adm-nowrap">{n > 0 ? `${n} laporan` : "-"}</td>
                    <td><button type="button" className="adm-btn adm-btn--sm" onClick={() => setProductId(p.id)}>Lihat</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <CaseTimeline
        title="Riwayat akun"
        newestFirst
        events={userTimeline(user.id, { users, products, reports, appeals, activities })}
      />

      {productId && (
        <ProductDetailModal
          productId={productId}
          onClose={() => setProductId(null)}
          footer={<button type="button" className="adm-btn" onClick={() => setProductId(null)}>Tutup</button>}
        />
      )}

      {act && (
        <ActionDialog
          title={COPY[act].title}
          description={COPY[act].desc}
          confirmLabel={COPY[act].confirm}
          danger={COPY[act].danger}
          noteLabel={act === "pulihkan" ? undefined : "Alasan"}
          noteRequired={act !== "pulihkan"}
          onConfirm={({ note }) => {
            const status = act === "pulihkan" ? "aktif" : act;
            changeUserStatus(user.id, status, note);
            if (act === "pulihkan") onClose();
          }}
          onClose={() => setAct(null)}
        />
      )}
    </Modal>
  );
}