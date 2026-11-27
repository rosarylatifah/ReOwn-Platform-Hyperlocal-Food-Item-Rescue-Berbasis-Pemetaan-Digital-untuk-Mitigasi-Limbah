"use client";

import React from "react";
import { MapPin, Clock, EyeOff, Download, AlertTriangle } from "lucide-react";

export default function ChatPopoverOverlays({
  previewImageMsg,
  closePreviewImage,
  viewingOnceMsg,
  closeViewingOnce,
  showDurationModal,
  closeDurationModal,
  durationMinutes,
  setDurationMinutes,
  startTimedLocationShare,
  showLocationPrompt,
  closeLocationPrompt,
  handleAllowLocation,
  pendingDeleteTarget,
  cancelDeletePrompt,
  confirmDelete,
  isSeller,
}) {
  const modalBackdrop = {
    position: "absolute",
    inset: 0,
    zIndex: 1200,
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
  };
  const cardBox = {
    position: "relative",
    zIndex: 1201,
    backgroundColor: "#FFF",
    borderRadius: "16px",
    padding: "16px",
    maxWidth: "310px",
    width: "100%",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
    textAlign: "center",
  };
  const btnPrimary = {
    padding: "7px 14px",
    borderRadius: "999px",
    border: "none",
    backgroundColor: "#D95A36",
    color: "#FFF",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  };
  const btnSecondary = {
    padding: "7px 14px",
    borderRadius: "999px",
    border: "1px solid #E5E5E5",
    backgroundColor: "#FFF",
    color: "#555",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  };

  const isSingleMine =
    pendingDeleteTarget?.mode === "single" &&
    pendingDeleteTarget?.msg?.sender === (isSeller ? "seller" : "buyer");

  return (
    <>
      {pendingDeleteTarget && (
        <div style={modalBackdrop}>
          <div style={{ ...cardBox, border: "1.5px solid #FCA5A5" }}>
            <AlertTriangle size={24} color="#DC2626" style={{ margin: "0 auto 8px" }} />
            <p style={{ margin: "0 0 6px", fontSize: "13px", fontWeight: "700", color: "#991B1B" }}>
              Yakin ingin menghapus pesan?
            </p>
            <p style={{ margin: "0 0 14px", fontSize: "11px", color: "#555", lineHeight: "1.45" }}>
              {pendingDeleteTarget.mode === "selected"
                ? `${pendingDeleteTarget.count} pesan terpilih akan dihapus.`
                : "Tindakan ini krusial dan tidak dapat dibatalkan."}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              <button
                type="button"
                onClick={() => confirmDelete("self")}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  border: "1px solid #FECACA",
                  backgroundColor: "#FEF2F2",
                  color: "#B91C1C",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Hapus untuk saya saja
              </button>

              {isSingleMine && (
                <button
                  type="button"
                  onClick={() => confirmDelete("both")}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: "#DC2626",
                    color: "#FFF",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Hapus untuk kedua pihak
                </button>
              )}

              <button type="button" onClick={cancelDeletePrompt} style={{ ...btnSecondary, width: "100%", borderRadius: "10px" }}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {previewImageMsg && (
        <div onClick={closePreviewImage} style={{ ...modalBackdrop, backgroundColor: "rgba(0,0,0,0.9)", flexDirection: "column", gap: "12px" }}>
          <img
            src={previewImageMsg.image}
            alt={previewImageMsg.imageName}
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", zIndex: 1201, maxWidth: "100%", maxHeight: "72%", borderRadius: "12px", objectFit: "contain" }}
          />
          <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", zIndex: 1201, display: "flex", gap: "10px" }}>
            <a
              href={previewImageMsg.image}
              download={previewImageMsg.imageName}
              style={{ ...btnPrimary, backgroundColor: "#95F57C", color: "#1A1A1A", fontWeight: "700", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Download size={14} /> Simpan Gambar
            </a>
            <button type="button" onClick={closePreviewImage} style={{ ...btnSecondary, backgroundColor: "transparent", color: "#FFF", borderColor: "rgba(255,255,255,0.3)" }}>
              Tutup
            </button>
          </div>
        </div>
      )}

      {viewingOnceMsg && (
        <div onClick={closeViewingOnce} style={{ ...modalBackdrop, backgroundColor: "rgba(0,0,0,0.88)", flexDirection: "column" }}>
          <p style={{ position: "relative", zIndex: 1201, color: "#FDBA74", fontSize: "11px", marginBottom: "10px" }}>
            <EyeOff size={12} style={{ verticalAlign: "middle", marginRight: "4px" }} />
            Foto sekali lihat — akan hilang setelah ditutup
          </p>
          <img src={viewingOnceMsg.image} alt="Sekali lihat" style={{ position: "relative", zIndex: 1201, maxWidth: "100%", maxHeight: "72%", borderRadius: "12px", objectFit: "contain" }} />
          <button type="button" onClick={closeViewingOnce} style={{ ...btnPrimary, position: "relative", zIndex: 1201, marginTop: "14px", padding: "8px 18px" }}>
            Tutup Foto
          </button>
        </div>
      )}

      {showDurationModal && (
        <div style={modalBackdrop}>
          <div style={cardBox}>
            <Clock size={22} color="#D95A36" style={{ margin: "0 auto 8px" }} />
            <p style={{ margin: "0 0 6px", fontSize: "13px", fontWeight: "700", color: "#1A1A1A" }}>Bagi lokasi sampai berapa lama?</p>
            <p style={{ margin: "0 0 12px", fontSize: "11px", color: "#666" }}>Masukkan durasi bebas (menit):</p>
            <input
              type="number"
              min="1"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              placeholder="Contoh: 15"
              style={{ width: "100%", boxSizing: "border-box", padding: "8px 12px", borderRadius: "10px", border: "1px solid #D1D5DB", fontSize: "13px", marginBottom: "14px", textAlign: "center", outline: "none" }}
            />
            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
              <button type="button" onClick={closeDurationModal} style={btnSecondary}>Batal</button>
              <button type="button" onClick={() => startTimedLocationShare(durationMinutes)} style={btnPrimary}>Mulai Bagi Lokasi</button>
            </div>
          </div>
        </div>
      )}

      {showLocationPrompt && (
        <div style={modalBackdrop}>
          <div style={cardBox}>
            <MapPin size={22} color="#D95A36" style={{ margin: "0 auto 8px" }} />
            <p style={{ margin: "0 0 14px", fontSize: "13px", fontWeight: "600", color: "#1A1A1A" }}>Izinkan website kami mengirim lokasi anda?</p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
              <button type="button" onClick={closeLocationPrompt} style={btnSecondary}>Tolak</button>
              <button type="button" onClick={handleAllowLocation} style={btnPrimary}>Izinkan</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}