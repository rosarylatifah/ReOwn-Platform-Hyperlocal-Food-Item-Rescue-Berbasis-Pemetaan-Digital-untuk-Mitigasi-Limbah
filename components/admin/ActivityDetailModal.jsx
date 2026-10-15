"use client";

import Link from "next/link";
import { fmtDateTime, fmtPrice } from "@/lib/admin/format";
import {
  ACTIVITY_TONE, REMOVAL_SOURCE_LABEL, SANCTION_LABEL, USER_STATUS_LABEL, USER_STATUS_TONE, appealChip, reportChip,
} from "@/lib/admin/labels";
import { useAdmin } from "@/lib/admin/store";
import { productTimeline, userTimeline } from "@/lib/admin/timeline";
import CaseTimeline from "@/lib/admin/CaseTimeline";
import EvidenceGallery from "./EvidenceGallery";
import Modal from "./Modal";
import StatusChip from "./StatusChip";
import UserCell from "./UserCell";

function Section({ title, children }) {
  return (
    <section className="adm-sec">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

/** Informasi menyeluruh satu aktivitas: ringkasan, objek terkait (akun, produk, laporan, banding), dan jejak kasus. */
export default function ActivityDetailModal({ activityId, onClose }) {
  const { activities, users, products, reports, appeals, getUser, getProduct } = useAdmin();
  const act = activities.find((a) => a.id === activityId);
  if (!act) return null;

  const refs = act.refs ?? {};
  const user = refs.userId ? getUser(refs.userId) : undefined;
  const product = refs.productId ? getProduct(refs.productId) : undefined;
  const report = refs.reportId ? reports.find((r) => r.id === refs.reportId) : undefined;
  const appeal = refs.appealId ? appeals.find((a) => a.id === refs.appealId) : undefined;
  const name = (id) => getUser(id)?.username ?? "-";
  const src = { users, products, reports, appeals, activities };
  const timeline = user ? userTimeline(user.id, src) : product ? productTimeline(product.id, src) : [];
  const appealProduct = appeal?.productId ? getProduct(appeal.productId) : undefined;

  return (
    <Modal
      title="Detail aktivitas"
      onClose={onClose}
      wide
      footer={
        <>
          <button type="button" className="adm-btn" onClick={onClose}>Tutup</button>
          {act.href && (
            <Link href={act.href} className="adm-btn adm-btn--primary" onClick={onClose}>
              Buka halaman terkait
            </Link>
          )}
        </>
      }
    >
      <Section title="Ringkasan">
        <dl className="adm-dl">
          <dt>Waktu</dt><dd>{fmtDateTime(act.at)} WIB</dd>
          <dt>Jenis</dt>
          <dd><StatusChip tone={act.actorKind === "admin" ? "info" : "muted"}>{act.actorKind === "admin" ? "Aksi admin" : "Aktivitas pengguna"}</StatusChip></dd>
          <dt>Pelaku</dt><dd><UserCell username={act.actor} email={act.actorEmail} /></dd>
          <dt>Aktivitas</dt><dd>{act.text}</dd>
          <dt>Status</dt><dd><StatusChip tone={ACTIVITY_TONE[act.status]}>{act.status}</StatusChip></dd>
          {act.note && (<><dt>Alasan / catatan</dt><dd>{act.note}</dd></>)}
        </dl>
      </Section>

      {report && (
        <Section title="Laporan terkait">
          <dl className="adm-dl">
            <dt>Dilaporkan oleh</dt><dd>{name(report.reporterId)}</dd>
            <dt>Terlapor</dt><dd>{name(report.reportedUserId)}</dd>
            <dt>Waktu laporan</dt><dd>{fmtDateTime(report.createdAt)} WIB</dd>
            <dt>Alasan</dt><dd>{report.category}</dd>
            <dt>Keterangan</dt><dd>{report.detail}</dd>
            <dt>Status</dt><dd><StatusChip tone={reportChip(report).tone}>{reportChip(report).label}</StatusChip></dd>
            {report.sanction && (<><dt>Sanksi</dt><dd>{SANCTION_LABEL[report.sanction]}</dd></>)}
            {report.adminNote && (<><dt>Catatan admin</dt><dd>{report.adminNote}</dd></>)}
            {report.handledAt && (<><dt>Diputuskan</dt><dd>{fmtDateTime(report.handledAt)} WIB</dd></>)}
            <dt>Bukti</dt>
            <dd><EvidenceGallery urls={report.evidenceUrl ? [report.evidenceUrl] : []} label="Bukti laporan" emptyText="Tidak ada bukti" /></dd>
          </dl>
        </Section>
      )}

      {appeal && (
        <Section title="Banding terkait">
          <dl className="adm-dl">
            <dt>Diajukan oleh</dt><dd>{name(appeal.userId)}</dd>
            <dt>Waktu pengajuan</dt><dd>{fmtDateTime(appeal.createdAt)} WIB</dd>
            <dt>Objek banding</dt><dd>{appealProduct ? `Produk “${appealProduct.name}”` : "Sanksi akun"}</dd>
            <dt>Alasan banding</dt><dd>{appeal.message}</dd>
            <dt>Status</dt><dd><StatusChip tone={appealChip(appeal).tone}>{appealChip(appeal).label}</StatusChip></dd>
            {appeal.adminNote && (<><dt>Catatan admin</dt><dd>{appeal.adminNote}</dd></>)}
            {appeal.handledAt && (<><dt>Diputuskan</dt><dd>{fmtDateTime(appeal.handledAt)} WIB</dd></>)}
            <dt>Bukti</dt>
            <dd><EvidenceGallery urls={appeal.evidence ?? []} label="Bukti banding" emptyText="Penjual tidak melampirkan bukti" /></dd>
          </dl>
        </Section>
      )}

      {product && (
        <Section title="Produk terkait">
          <dl className="adm-dl">
            <dt>Produk</dt><dd>{product.emoji} {product.name}</dd>
            <dt>Penjual</dt><dd>{name(product.sellerId)}</dd>
            <dt>Kategori dan harga</dt><dd>{product.category} · {fmtPrice(product.price)}</dd>
            <dt>Alamat</dt><dd>{product.address}</dd>
            <dt>Diunggah</dt><dd>{fmtDateTime(product.uploadedAt)} WIB</dd>
            <dt>Status</dt>
            <dd><StatusChip tone={product.status === "aktif" ? "ok" : "bad"}>{product.status === "aktif" ? "Aktif" : "Diturunkan"}</StatusChip></dd>
            {product.removal && (
              <>
                <dt>Diturunkan</dt>
                <dd>
                  {product.removal.reason} · oleh {product.removal.by}
                  <small className="adm-sub">{REMOVAL_SOURCE_LABEL[product.removal.source]} · {fmtDateTime(product.removal.at)} WIB</small>
                </dd>
              </>
            )}
          </dl>
        </Section>
      )}

      {user && (
        <Section title="Akun terkait">
          <dl className="adm-dl">
            <dt>Akun</dt><dd><UserCell username={user.username} email={user.email} /></dd>
            <dt>Status</dt>
            <dd>
              <StatusChip tone={USER_STATUS_TONE[user.status]}>{USER_STATUS_LABEL[user.status]}</StatusChip>
              {user.warnings > 0 && <small className="adm-sub">{user.warnings} peringatan tercatat</small>}
            </dd>
            {user.sanction && (<><dt>Sanksi terakhir</dt><dd>{user.sanction.reason}<small className="adm-sub">{fmtDateTime(user.sanction.at)} WIB</small></dd></>)}
          </dl>
        </Section>
      )}

      {!report && !appeal && !product && !user && (
        <p className="adm-muted">Aktivitas ini tidak punya objek terkait.</p>
      )}

      <CaseTimeline events={timeline} />
    </Modal>
  );
}