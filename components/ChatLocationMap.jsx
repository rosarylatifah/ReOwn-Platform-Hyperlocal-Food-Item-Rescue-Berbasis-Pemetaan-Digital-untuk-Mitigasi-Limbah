"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_LAT = 1.1301;
const DEFAULT_LNG = 104.0529;

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function ChatLocationMap({ lat, lng, height = "135px" }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  const safeLat = typeof lat === "number" && !Number.isNaN(lat) ? lat : DEFAULT_LAT;
  const safeLng = typeof lng === "number" && !Number.isNaN(lng) ? lng : DEFAULT_LNG;

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, {
        center: [safeLat, safeLng],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(mapRef.current);

      L.marker([safeLat, safeLng], { icon: markerIcon }).addTo(mapRef.current);
    } else {
      mapRef.current.setView([safeLat, safeLng], 15);
    }

    const timer = setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 120);

    return () => {
      clearTimeout(timer);
    };
  }, [safeLat, safeLng]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height,
        borderRadius: "10px",
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    />
  );
}