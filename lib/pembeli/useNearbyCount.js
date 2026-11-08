"use client";

import { useEffect, useState } from "react";
import { getSharedProducts } from "@/lib/pembeli/productHelper";
import { approxLocation } from "@/lib/pembeli/locationPrivacy";

const distKm = (aLat, aLng, bLat, bLng) => {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

// Jumlah produk aktif dalam radius `radiusKm` dari lokasi pengguna.
// Mengembalikan null (tidak ditampilkan) kalau izin lokasi BELUM diberikan.
// Tidak pernah memunculkan permintaan izin sendiri.
export function useNearbyCount(radiusKm = 5) {
  const [count, setCount] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation || !navigator.permissions) return;
    let status;
    let cancelled = false;

    const compute = () =>
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (cancelled) return;
          const { latitude, longitude } = pos.coords;
          // Pakai titik perkiraan toko, sama dengan peta & jarak di halaman pembeli
          const n = getSharedProducts().filter((p) => {
            const a = approxLocation({ ...p, lat: p.lat ?? 1.1186, lng: p.lng ?? 104.0487 });
            return distKm(latitude, longitude, a.lat, a.lng) <= radiusKm;
          }).length;
          setCount(n);
        },
        () => setCount(null),
        { maximumAge: 300000, timeout: 8000 }
      );

    const sync = () => (status.state === "granted" ? compute() : setCount(null));

    navigator.permissions
      .query({ name: "geolocation" })
      .then((s) => {
        if (cancelled) return;
        status = s;
        sync();
        s.onchange = sync;
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (status) status.onchange = null;
    };
  }, [radiusKm]);

  return count;
}