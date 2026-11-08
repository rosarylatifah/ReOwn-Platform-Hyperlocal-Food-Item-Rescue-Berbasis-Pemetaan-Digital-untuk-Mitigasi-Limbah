"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import L from "leaflet";
import { Circle, Marker, Popup } from "react-leaflet";
import { getSharedProducts } from "@/lib/pembeli/productHelper";
import { groupByLocation, AREA_STYLE } from "@/lib/pembeli/mapAreas";

const badgeIcon = (count) =>
  new L.DivIcon({
    className: "reown-badge",
    html: `<div style="display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#2563EB;color:#fff;font:700 13px Inter,sans-serif;border:3px solid #fff;box-shadow:0 4px 12px rgba(37,99,235,0.45);">${count}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });

// Tidak butuh login untuk melihat titik: hanya membaca daftar produk dari localStorage
export default function ProductAreaLayer() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const load = () => setProducts(getSharedProducts());
    const checkLogin = () => {
      try {
        setLoggedIn(
          Boolean(localStorage.getItem("reown:session:v1") || localStorage.getItem("reown:current_user:v1"))
        );
      } catch {
        setLoggedIn(false);
      }
    };
    load();
    checkLogin();
    const onStorage = (e) => {
      if (!e.key || e.key.startsWith("reown")) {
        load();
        checkLogin();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const groups = useMemo(() => groupByLocation(products), [products]);

  return (
    <>
      {groups.map((g) => (
        <Circle
          key={`area-${g.lat},${g.lng}`}
          center={[g.lat, g.lng]}
          radius={g.radius}
          interactive={false}
          pathOptions={AREA_STYLE}
        />
      ))}

      {groups.map((g) => (
        <Marker key={`${g.lat},${g.lng}`} position={[g.lat, g.lng]} icon={badgeIcon(g.items.length)}>
          <Popup>
            <div style={{ fontFamily: "Inter, sans-serif", maxHeight: 180, overflowY: "auto", minWidth: 180 }}>
              <div style={{ fontSize: 11, color: "#777", paddingBottom: 4, borderBottom: "1px solid #eee" }}>
                📍 Area perkiraan · {g.items.length} produk
              </div>

              {g.items.map((item) => (
                <div key={item.id} style={{ padding: "6px 0", borderBottom: "1px solid #eee" }}>
                  <b style={{ color: "#D95A36" }}>{item.name}</b>
                  <br />
                  <span style={{ fontSize: 12 }}>{item.sellerName || item.store}</span>
                  <br />
                  <span style={{ fontWeight: "bold" }}>{item.price}</span>
                </div>
              ))}

              <button
                type="button"
                onClick={() => router.push(loggedIn ? "/pembeli/produk" : "/masuk")}
                style={{
                  display: "block", marginTop: 8, padding: 0, border: "none", background: "none",
                  cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#D85834", textAlign: "left",
                }}
              >
                {loggedIn ? "Lihat semua produk →" : "Masuk untuk lihat semua produk →"}
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}