"use client";

import { useState } from "react";
import { fmtDateTime } from "@/lib/admin/format";
import { SANCTION_LABEL, USER_STATUS_LABEL, USER_STATUS_TONE } from "@/lib/admin/labels";
import { useAdmin } from "@/lib/admin/store";
import ActionDialog from "./ActionDialog";
import EvidenceThumb from "./EvidenceThumb";
import Modal from "./Modal";
import StatusChip from "./StatusChip";

export default function ReportDetailModal({ reportId, onClose }) {
  const { reports, getUser, getProduct, acceptReport, rejectReport } = useAdmin();
  const [dialog, setDialog] = useState(null);

  const report = reports.find((r) => r.id === reportId);
  if (!report) return null;

  const reporter = getUser(report.reporterId);
  const reported = getUser(report.reportedUserId);
  const product = report.productId ? getProduct(report.productId) : undefined;
  const history = reports.filter((r) => r.reportedUserId === report.reportedUserId && r.id !== report.id);
  const acceptedBefore = history.filter((r) => r.outcome === "diterima").length;
  const reciprocal = reports.some(
    (r) => r.reporterId === report.reportedUserId && r.reportedUserId === report.reporterId && r.id !== report.id,
  );
  const done = report.status === "selesai";

  const sanctionOptions = ["turunkan_produk", "peringatan", "suspend", "ban"]
    .filter((s) => s !== "turunkan_produk" || !!report.productId)
    .map((s) => ({ value: s, label: SANCTION_LABEL[s] }));

  return (
    <Modal
      title="Detail laporan"
      onClose={onClose}
      wide
      footer={
        done ? (
          <button type="button" className="adm-btn" onClick={onClose}>Tutup</button>
        ) : (
          <>
            <button type="button" className="adm-btn" onClick={() => setDialog("tolak")}>Tolak laporan</button>
            <button type="button" className="adm-btn adm-btn--primary" onClick={() => setDialog("terima")}>Terima laporan</button>
          </>
        )
      }
    >
      <dl className="adm-dl">
        <dt>Waktu laporan</dt><dd>{fmtDateTime(report.createdAt)} WIB</dd>
        <dt>Pelapor</dt><dd>{reporter?.username}<small className="adm-sub">{reporter?.email}</small></dd>
        <dt>Terlapor</dt>
        <dd>
          {reported?.username}
          {reported && <> <StatusChip tone={USER_STATUS_TONE[reported.status]}>{USER_STATUS_LABEL[reported.status]}</StatusChip></>}
          <small className="adm-sub">{reported?.email}</small>
        </dd>
        <dt>Alasan</dt><dd>{report.category}</dd>
        <dt>Keterangan pelapor</dt><dd>{report.detail}</dd>
        {product && (<><dt>Produk dilaporkan</dt><dd>{product.name}<small className="adm-sub">Status: {product.status === "aktif" ? "Aktif" : "Diturunkan"}</small></dd></>)}
        <dt>Bukti</dt><dd><EvidenceThumb url={report.evidenceUrl} label={report.category} /></dd>
      </dl>

      <div className={"adm-note" + (reciprocal ? " adm-note--warn" : "")}>
        <b>Konteks untuk keputusan</b>
        <ul>
          <li>
            {history.length === 0
              ? "Ini laporan pertama terhadap akun ini."
              : `Akun ini pernah dilaporkan ${history.length} kali sebelumnya, ${acceptedBefore} di antaranya diterima.`}
          </li>
          {reciprocal && (
            <li>Terlapor juga pernah melaporkan pelapor. Periksa kemungkinan laporan balasan.</li>
          )}
        </ul>
      </div>

      {done && (
        <dl className="adm-dl">
          <dt>Keputusan</dt>
          <dd>
            <StatusChip tone={report.outcome === "diterima" ? "ok" : "muted"}>
              {report.outcome === "diterima" ? "Diterima" : "Ditolak"}
            </StatusChip>
            {report.sanction && <> Sanksi: {SANCTION_LABEL[report.sanction]}</>}
          </dd>
          {report.adminNote && (<><dt>Catatan admin</dt><dd>{report.adminNote}</dd></>)}
          {report.handledAt && (<><dt>Diputuskan</dt><dd>{fmtDateTime(report.handledAt)} WIB</dd></>)}
        </dl>
      )}

      {dialog === "terima" && (
        <ActionDialog
          title="Terima laporan ini?"
          description={`Pilih sanksi untuk @${reported?.username}. Pengguna akan diberi tahu dan dapat mengajukan banding.`}
          confirmLabel="Terima dan terapkan sanksi"
          danger
          optionLabel="Sanksi"
          options={sanctionOptions}
          noteLabel="Catatan admin"
          onConfirm={({ value, note }) => { acceptReport(report.id, value, note); onClose(); }}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === "tolak" && (
        <ActionDialog
          title="Tolak laporan ini?"
          description="Laporan ditutup tanpa sanksi. Tulis alasannya agar tercatat di riwayat."
          confirmLabel="Tolak laporan"
          noteLabel="Alasan penolakan"
          noteRequired
          onConfirm={({ note }) => { rejectReport(report.id, note); onClose(); }}
          onClose={() => setDialog(null)}
        />
      )}
    </Modal>
  );
}