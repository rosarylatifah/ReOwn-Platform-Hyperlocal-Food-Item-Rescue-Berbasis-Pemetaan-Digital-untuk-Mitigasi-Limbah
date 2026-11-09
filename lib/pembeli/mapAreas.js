import { approxLocation, PRIVACY_RADIUS_M } from "@/lib/pembeli/locationPrivacy";
import { DEFAULT_COORD, coordsForArea, isDefaultCoord } from "@/lib/pembeli/areaCoords";

// Satu-satunya tempat untuk mengatur pengelompokan & gaya area di SEMUA peta.
// Titik tampil paling jauh PRIVACY_RADIUS_M / 2 (200 m) dari titik asli toko.
// Gabung hanya jika <= 200 m dari pusat grup, jadi titik asli selalu <= 400 m dari pusat
// dan lingkaran tetap 400 m (tidak melebar).
export const MERGE_M = PRIVACY_RADIUS_M / 2;
export const AREA_STYLE = { color: "#9CA3AF", fillColor: "#9CA3AF", fillOpacity: 0.2, opacity: 0.55, weight: 1 };

const metersBetween = (aLat, aLng, bLat, bLng) =>
  Math.hypot((aLat - bLat) * 111320, (aLng - bLng) * 111320 * Math.cos((aLat * Math.PI) / 180));

export function groupByLocation(products = []) {
  const clusters = [];
  products.forEach((item) => {
    const hasRealCoord = item.lat != null && item.lng != null && !isDefaultCoord(item.lat, item.lng);
    const base = hasRealCoord ? { lat: item.lat, lng: item.lng } : coordsForArea(item.location) || DEFAULT_COORD;
    const realStore = item.storeId && item.storeId !== "toko" ? item.storeId : item.store || item.id;
    const a = approxLocation({ ...item, ...base, storeId: realStore });
    const c = clusters.find((x) => metersBetween(x.lat, x.lng, a.lat, a.lng) <= MERGE_M);
    if (c) {
      c.pts.push(a);
      c.items.push(item);
      c.lat = c.pts.reduce((s, q) => s + q.lat, 0) / c.pts.length;
      c.lng = c.pts.reduce((s, q) => s + q.lng, 0) / c.pts.length;
    } else {
      clusters.push({ lat: a.lat, lng: a.lng, pts: [a], items: [item] });
    }
  });
  return clusters.map((c) => ({ ...c, radius: PRIVACY_RADIUS_M }));
}