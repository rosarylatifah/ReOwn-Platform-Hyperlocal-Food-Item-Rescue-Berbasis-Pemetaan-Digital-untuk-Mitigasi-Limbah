"use client";

import { useState } from "react";
import { fmtDateTime } from "@/lib/admin/format";
import { REMOVAL_SOURCE_LABEL } from "@/lib/admin/labels";
import { useAdmin } from "@/lib/admin/store";
import ActionDialog from "./ActionDialog";
import EvidenceGallery from "./EvidenceGallery";
import Modal from "./Modal";
import StatusChip from "./StatusChip";

export default function AppealDetailModal({ appealId, onClose }) {
  const { appeals, getUser, getProduct, acceptAppeal, rejectAppeal } = useAdmin();
  const [dialog, setDialog] = useState(null);

  const appeal = appeals.find((a) => a.id === appealId);
  if (!appeal) return null;

  const user = getUser(appeal.userId);
  const product = appeal.productId ? getProduct(appeal.productId) : undefined;
  const pending = appeal.status === "menunggu";

  return (
    <Modal
      title="Detail banding"
      onClose={onClose}
      wide
      footer={
        pending ? (
          <>
            <button type="button" className="adm-btn" onClick={() => setDialog("tolak")}>Tolak banding</button>
            <button type="button" className="adm-btn adm-btn--primary" onClick={() => setDialog("terima")}>Terima banding</button>
          </>
        ) : (
          <button type="button" className="adm-btn" onClick={onClose}>Tutup</button>
        )
      }
    >
      <dl className="adm-dl">
        <dt>Waktu pengajuan</dt><dd>{fmtDateTime(appeal.createdAt)} WIB</dd>
        <dt>Pengguna</dt><dd>{user?.username}<small className="adm-sub">{user?.email}</small></dd>
        <dt>Objek banding</dt>
        <dd>{product ? `Produk “${product.name}”` : `Sanksi akun (${user?.status === "banned" ? "ban" : "suspend"})`}</dd>
        <dt>Sanksi awal</dt>
        <dd>
          {product?.removal
            ? <>{product.removal.reason}<small className="adm-sub">{REMOVAL_SOURCE_LABEL[product.removal.source]} · {fmtDateTime(product.removal.at)} WIB</small></>
            : user?.sanction
              ? <>{user.sanction.reason}<small className="adm-sub">{fmtDateTime(user.sanction.at)} WIB</small></>
              : "-"}
        </dd>
        <dt>Alasan banding</dt><dd>{appeal.message}</dd>
        <dt>Bukti banding</dt>
        <dd><EvidenceGallery urls={appeal.evidence ?? []} label="Bukti banding" emptyText="Penjual tidak melampirkan bukti" /></dd>
        {!pending && (
          <>
            <dt>Keputusan</dt>
            <dd><StatusChip tone={appeal.status === "diterima" ? "ok" : "muted"}>{appeal.status === "diterima" ? "Diterima" : "Ditolak"}</StatusChip></dd>
            {appeal.adminNote && (<><dt>Catatan admin</dt><dd>{appeal.adminNote}</dd></>)}
          </>
        )}
      </dl>

      {dialog === "terima" && (
        <ActionDialog
          title="Terima banding ini?"
          description={product ? "Produk akan dipulihkan dan tampil kembali di katalog." : "Akun akan dipulihkan menjadi aktif."}
          confirmLabel="Terima dan pulihkan"
          noteLabel="Catatan admin"
          onConfirm={({ note }) => { acceptAppeal(appeal.id, note); onClose(); }}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === "tolak" && (
        <ActionDialog
          title="Tolak banding ini?"
          description="Sanksi awal tetap berlaku. Tulis alasannya agar pengguna paham."
          confirmLabel="Tolak banding"
          danger
          noteLabel="Alasan penolakan"
          noteRequired
          onConfirm={({ note }) => { rejectAppeal(appeal.id, note); onClose(); }}
          onClose={() => setDialog(null)}
        />
      )}
    </Modal>
  );
}