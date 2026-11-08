"use client";

import React from "react";
import { Clock, Navigation, Store } from "lucide-react";

const num = (v) => parseInt(String(v ?? "").replace(/[^0-9]/g, ""), 10);
const isFree = (v) => /^(gratis|free)$/i.test(String(v || "").trim());

const URGENCY = {
  Mendesak: { bg: "#FEE2E2", fg: "#B91C1C" },
  Segera: { bg: "#FEF3C7", fg: "#B45309" },
  Normal: { bg: "#DCFCE7", fg: "#15803D" },
};

const pill = (bg, fg) => ({
  display: "inline-flex", alignItems: "center", padding: "3px 10px",
  borderRadius: 999, fontSize: 11, fontWeight: 700, background: bg, color: fg,
});

const fmtDate = (d) => {
  const t = new Date(d);
  return isNaN(t) ? null : t.toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
};

function remaining(d) {
  const ms = new Date(d).getTime() - Date.now();
  if (isNaN(ms)) return { text: null, urgent: false };
  if (ms <= 0) return { text: "sudah lewat", urgent: true };
  const h = Math.floor(ms / 3600000);
  if (h >= 24) return { text: `sisa ${Math.floor(h / 24)} hari`, urgent: false };
  if (h >= 1) return { text: `sisa ${h} jam`, urgent: h < 2 };
  return { text: `sisa ${Math.max(1, Math.round(ms / 60000))} menit`, urgent: true };
}

export function ProductBadges({ product }) {
  const urgency = product.urgency || "Normal";
  const u = URGENCY[urgency] || URGENCY.Normal;
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {product.category && <span style={pill("#F3F4F6", "#374151")}>{product.category}</span>}
      <span style={pill(u.bg, u.fg)}>{urgency}</span>
    </div>
  );
}

export function PriceBlock({ product }) {
  const now = isFree(product.price) ? 0 : num(product.price);
  const normal = num(product.normalPrice);
  const showSave = normal > 0 && now < normal;
  const pct = showSave ? Math.round((1 - now / normal) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
      <span style={{ fontSize: 18, fontWeight: "bold", color: "#D95A36", fontFamily: "Fraunces, serif" }}>
        {product.price}
      </span>
      {showSave && (
        <>
          <span style={{ fontSize: 12, color: "#9CA3AF", textDecoration: "line-through" }}>{product.normalPrice}</span>
          <span style={pill("#DCFCE7", "#15803D")}>Hemat {pct}%</span>
        </>
      )}
    </div>
  );
}

function Row({ Icon, label, children, warn }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <Icon size={15} color={warn ? "#DC2626" : "#D95A36"} style={{ marginTop: 2, flexShrink: 0 }} />
      <div style={{ lineHeight: 1.35 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#9CA3AF" }}>{label}</div>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: warn ? "#DC2626" : "#1A1A1A" }}>{children}</div>
      </div>
    </div>
  );
}

export function ProductFacts({ product }) {
  const isFood = product.category === "Makanan";
  const expText = isFood ? fmtDate(product.expiryAt || product.deadline) : null;
  const distance = product.distance || (product.distanceKm ? `${Number(product.distanceKm).toFixed(1)} km` : null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "12px 14px", borderRadius: 14, background: "#FAFAFA", border: "1px solid #EEE" }}>
      {expText && (
        <Row Icon={Clock} label="Batas kadaluarsa">
          {expText}
        </Row>
      )}
      {distance && (
        <Row Icon={Navigation} label="Jarak dari lokasimu">
          sekitar {distance}
        </Row>
      )}
      <Row Icon={Store} label="Pengambilan">
        Ambil langsung di toko. Alamat lengkap dibagikan setelah pesananmu dikonfirmasi penjual.
      </Row>
    </div>
  );
}

export function UrgencyBadge({ urgency }) {
  if (urgency !== "Mendesak" && urgency !== "Segera") return null;
  const u = URGENCY[urgency];
  return (
    <span
      className="absolute right-1.5 top-1.5 z-[2] rounded-full px-2 py-0.5 text-[10px] font-bold shadow-md md:right-3 md:top-3 md:px-3 md:py-1 md:text-[11px]"
      style={{ background: u.bg, color: u.fg }}
    >
      {urgency}
    </span>
  );
}