// Menampilkan lokasi toko sebagai area perkiraan, bukan titik persis.

const hash = (s) => {
  let h = 2166136261;
  for (const c of String(s)) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const rand = (seed) => {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const PRIVACY_RADIUS_M = 400;

// Titik tampil = titik asli digeser acak-tetap (maks. setengah radius).
// Seed per TOKO: semua produk satu toko di titik yang sama, dan tidak berubah saat reload.
export function approxLocation(item, radius = PRIVACY_RADIUS_M) {
  const seed = hash(item.storeId ?? item.sellerId ?? item.store ?? item.sellerName ?? item.id);
  const angle = rand(seed) * 2 * Math.PI;
  const dist = Math.sqrt(rand(seed + 1)) * (radius / 2);
  const dLat = (dist * Math.cos(angle)) / 111320;
  const dLng = (dist * Math.sin(angle)) / (111320 * Math.cos((item.lat * Math.PI) / 180));
  return { lat: item.lat + dLat, lng: item.lng + dLng, radius };
}

// "Jl. Ahmad Yani, Batam Centre" -> "Batam Centre"
export function areaOf(address = "") {
  const parts = String(address).split(",").map((s) => s.trim()).filter(Boolean);
  return parts.length > 1 ? parts[parts.length - 1] : parts[0] || "Batam";
}