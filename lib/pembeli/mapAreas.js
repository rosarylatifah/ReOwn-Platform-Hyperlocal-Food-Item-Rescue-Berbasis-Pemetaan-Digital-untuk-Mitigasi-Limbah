import { approxLocation, PRIVACY_RADIUS_M } from "@/lib/pembeli/locationPrivacy";

// Satu-satunya tempat untuk mengatur pengelompokan & gaya area di SEMUA peta
export const MERGE_M = 1000; // toko yang lebih dekat dari ini digabung jadi satu area
export const AREA_STYLE = { color: "#9CA3AF", fillColor: "#9CA3AF", fillOpacity: 0.2, opacity: 0.55, weight: 1 };

const metersBetween = (aLat, aLng, bLat, bLng) =>
  Math.hypot((aLat - bLat) * 111320, (aLng - bLng) * 111320 * Math.cos((aLat * Math.PI) / 180));

export function groupByLocation(products = []) {
  const clusters = [];
  products.forEach((item) => {
    const a = approxLocation({ ...item, lat: item.lat ?? 1.1186, lng: item.lng ?? 104.0487 });
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
  return clusters.map((c) => ({
    ...c,
    radius: PRIVACY_RADIUS_M + Math.max(...c.pts.map((q) => metersBetween(c.lat, c.lng, q.lat, q.lng))),
  }));
}