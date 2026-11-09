"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";

const BATAM = { lat: 1.1186, lng: 104.0487 };
// Batas pencarian: kira-kira seluruh Pulau Batam (kiri,atas,kanan,bawah)
const VIEWBOX = "103.85,1.25,104.2,0.95";
const AREAS = ['Batam Centre', 'Nagoya', 'Lubuk Baja', 'Batu Ampar', 'Jodoh', 'Bengkong', 'Botania', 'Sekupang', 'Batu Aji', 'Sagulung', 'Tiban', 'Nongsa'];

const pinIcon =
  typeof window !== "undefined"
    ? new L.DivIcon({
        className: "",
        html: '<div style="width:18px;height:18px;border-radius:50%;background:#F23A10;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)"></div>',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      })
    : null;

async function searchPlace(q) {
  const url =
    `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&accept-language=id` +
    `&countrycodes=id&viewbox=${VIEWBOX}&bounded=1&q=${encodeURIComponent(q)}`;
  const r = await fetch(url);
  const data = await r.json();
  return data.map((d) => ({
    lat: parseFloat(d.lat),
    lng: parseFloat(d.lon),
    label: d.display_name.split(",").slice(0, 3).join(","),
    name: d.name || d.display_name.split(",")[0],
  }));
}

async function reverseArea(lat, lng) {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=16&accept-language=id&lat=${lat}&lon=${lng}`
    );
    const a = (await r.json()).address || {};
    return a.suburb || a.neighbourhood || a.village || a.city_district || a.city || null;
  } catch {
    return null;
  }
}

function Recenter({ point }) {
  const map = useMap();
  useEffect(() => {
    if (point) map.flyTo([point.lat, point.lng], Math.max(map.getZoom(), 15));
  }, [point?.lat, point?.lng]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

function ClickCatcher({ onMove }) {
  useMapEvents({ click: (e) => onMove(e.latlng) });
  return null;
}

export default function LocationPicker({ labelClass, fieldClass, location, point, onText, onPick }) {
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const typed = useRef(false); // hanya cari saat penjual mengetik, bukan saat teks terisi otomatis
  const [focused, setFocused] = useState(false);
  const q = (location || "").trim().toLowerCase();
  const areaMatches = AREAS.filter((a) => !q || a.toLowerCase().includes(q));

  const chooseArea = async (a) => {
    typed.current = false;
    setFocused(false);
    setResults([]);
    onText(a);
    try {
      const r = (await searchPlace(`${a}, Batam`))[0];
      if (r) onPick({ lat: r.lat, lng: r.lng }, a);
      else setMsg("Titik area tidak ditemukan. Klik peta untuk menaruh pin.");
    } catch {
      setMsg("Gagal mencari titik area. Klik peta untuk menaruh pin.");
    }
  };

  // Cari otomatis 700 ms setelah berhenti mengetik (Nominatim membatasi ±1 request/detik)
  useEffect(() => {
    if (!typed.current || !location || location.trim().length < 3) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setBusy(true);
      try {
        setResults(await searchPlace(location.trim()));
      } catch {
        setResults([]);
      }
      setBusy(false);
    }, 700);
    return () => clearTimeout(t);
  }, [location]);

  const movePin = async ({ lat, lng }) => {
    typed.current = false;
    onPick({ lat, lng }, null);
    const name = await reverseArea(lat, lng);
    if (name) onPick({ lat, lng }, name);
  };

  const choose = (r) => {
    typed.current = false;
    setResults([]);
    onPick({ lat: r.lat, lng: r.lng }, r.name);
  };

  const gps = () => {
    if (!navigator.geolocation) return setMsg("Browser tidak mendukung GPS.");
    setMsg("Mengambil lokasi...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMsg("");
        movePin({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => setMsg("Gagal mengambil GPS. Pastikan izin lokasi aktif."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const center = point || BATAM;

  return (
    <div>
      <label className={labelClass} htmlFor="pm-area">Lokasi Toko</label>

      <div className="relative">
        <input
          id="pm-area"
          type="text"
          autoComplete="off"
          placeholder="Pilih area atau ketik nama tempat, misal: Tanjung Piayu"
          value={location || ""}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            typed.current = true;
            onText(e.target.value);
          }}
          className={fieldClass}
        />
        {focused && (areaMatches.length > 0 || busy || results.length > 0) && (
          <ul
            onMouseDown={(e) => e.preventDefault()}
            className="absolute left-0 right-0 top-full z-[1200] mt-1 max-h-52 overflow-y-auto rounded-xl border border-stone-200 bg-white shadow-lg"
          >
            {areaMatches.length > 0 && (
              <li className="px-3 pt-2 text-[10px] font-bold uppercase tracking-wide text-stone-400">Area</li>
            )}
            {areaMatches.map((a) => (
              <li key={a}>
                <button type="button" onClick={() => chooseArea(a)} className="block w-full px-3 py-2 text-left text-[13px] text-stone-800 hover:bg-[#FBE9E2]">
                  {a}
                </button>
              </li>
            ))}
            {(busy || results.length > 0) && (
              <li className="px-3 pt-2 text-[10px] font-bold uppercase tracking-wide text-stone-400">Hasil pencarian</li>
            )}
            {busy && <li className="px-3 py-2 text-xs text-stone-500">Mencari...</li>}
            {results.map((r, i) => (
              <li key={i}>
                <button type="button" onClick={() => choose(r)} className="block w-full px-3 py-2 text-left text-[13px] text-stone-800 hover:bg-[#FBE9E2]">
                  {r.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="relative mt-2 h-[220px] overflow-hidden rounded-xl border-2 border-stone-200">
        <MapContainer center={[center.lat, center.lng]} zoom={point ? 15 : 12} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Recenter point={point} />
          <ClickCatcher onMove={movePin} />
          {point && pinIcon && (
            <Marker
              position={[point.lat, point.lng]}
              icon={pinIcon}
              draggable
              eventHandlers={{ dragend: (e) => movePin(e.target.getLatLng()) }}
            />
          )}
        </MapContainer>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={gps}
          className="rounded-xl border-2 border-stone-200 bg-white px-3 py-2 text-[13px] font-semibold text-stone-800 transition-colors hover:border-[#F23A10]"
        >
          📡 Ambil dari GPS
        </button>
        <span className="text-xs text-stone-600">
          {point ? `Titik: ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}` : "Belum ada titik. Cari area, klik peta, atau pakai GPS."}
        </span>
      </div>
      {msg && <p className="mt-1 text-xs text-stone-600">{msg}</p>}
      <p className="mt-1 text-xs text-stone-600">
        Geser pin atau klik peta untuk menyesuaikan. Titik ini hanya terlihat olehmu, pembeli hanya melihat area perkiraan.
      </p>
    </div>
  );
}