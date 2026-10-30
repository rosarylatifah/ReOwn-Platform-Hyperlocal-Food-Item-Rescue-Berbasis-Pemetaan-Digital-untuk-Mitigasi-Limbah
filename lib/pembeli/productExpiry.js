// Aturan kadaluarsa makanan. Semua fungsi murni (tanpa timer): status dihitung
// setiap produk dibaca, jadi tetap benar setelah refresh.

export const URGENCY_MIN_HOURS = 8;
const HOUR = 60 * 60 * 1000;

// Nilai dari <input type="datetime-local"> ("2026-11-01T18:00") dibaca sebagai waktu lokal
const toMs = (v) => {
  if (!v) return null;
  const t = new Date(v).getTime();
  return Number.isNaN(t) ? null : t;
};

/** Validasi isian kadaluarsa. Mengembalikan {} kalau valid atau bukan kategori Makanan. */
export function validateExpiry(form, now = Date.now()) {
  if (form?.category !== "Makanan") return {};
  const errors = {};
  const exp = toMs(form.expiryAt);
  const urg = toMs(form.urgencyAt);

  if (!exp) errors.expiryAt = "Batas kadaluarsa wajib diisi.";
  else if (exp <= now) errors.expiryAt = "Batas kadaluarsa harus di masa depan.";

  if (!urg) errors.urgencyAt = "Batas urgensi wajib diisi.";
  else if (exp && urg > exp - URGENCY_MIN_HOURS * HOUR) {
    errors.urgencyAt = `Batas urgensi minimal ${URGENCY_MIN_HOURS} jam sebelum kadaluarsa.`;
  }
  return errors;
}

export function isExpired(p, now = Date.now()) {
  if (p?.category !== "Makanan") return false;
  const exp = toMs(p.expiryAt);
  return exp !== null && now >= exp;
}

/**
 * Terapkan status otomatis:
 * - sebelum batas urgensi : tidak berubah
 * - setelah batas urgensi : urgency "Mendesak" + harga gratis (harga asli disimpan di originalPrice)
 * - setelah kadaluarsa    : expired = true (disembunyikan dari pembeli)
 */
export function applyExpiryRules(p, now = Date.now()) {
  if (p?.category !== "Makanan" || !p.expiryAt) return p;
  if (isExpired(p, now)) return { ...p, expired: true };

  const urg = toMs(p.urgencyAt);
  if (urg !== null && now >= urg) {
    return {
      ...p,
      urgency: "Mendesak",
      originalPrice: p.originalPrice ?? p.price,
      price: typeof p.price === "number" ? 0 : "0",
    };
  }
  return p;
}