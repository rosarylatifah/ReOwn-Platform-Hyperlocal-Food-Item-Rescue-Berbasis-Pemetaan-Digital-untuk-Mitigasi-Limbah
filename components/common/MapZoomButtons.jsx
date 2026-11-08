"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { useMap, useMapEvents } from "react-leaflet";

export default function MapZoomButtons() {
  const map = useMap();
  const ref = useRef(null);
  const [zoom, setZoom] = useState(map.getZoom());

  useMapEvents({ zoomend: () => setZoom(map.getZoom()) });

  useEffect(() => {
    if (ref.current) {
      L.DomEvent.disableClickPropagation(ref.current);
      L.DomEvent.disableScrollPropagation(ref.current);
    }
  }, []);

  const btn =
    "grid h-10 w-10 place-items-center text-stone-900 transition-colors hover:bg-stone-100 active:bg-stone-200 disabled:cursor-not-allowed disabled:text-stone-300 disabled:hover:bg-transparent";

  return (
    <div ref={ref} className="absolute bottom-4 left-4 z-[1000] flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/10">
      <button type="button" aria-label="Perbesar peta" onClick={() => map.zoomIn()} disabled={zoom >= map.getMaxZoom()} className={btn}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M12 5v14M5 12h14" /></svg>
      </button>
      <span aria-hidden className="h-px bg-stone-200" />
      <button type="button" aria-label="Perkecil peta" onClick={() => map.zoomOut()} disabled={zoom <= map.getMinZoom()} className={btn}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M5 12h14" /></svg>
      </button>
    </div>
  );
}