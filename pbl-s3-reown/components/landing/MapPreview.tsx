"use client";

import dynamic from "next/dynamic";

// Leaflet butuh `window`, jadi hanya dimuat di browser (tanpa SSR).
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-[#EAF0E4]" aria-hidden />,
});

export default function MapPreview() {
  return (
    // `isolate` menjaga layer Leaflet tidak menimpa Navbar & dropdown-nya
    <div className="relative isolate h-72 w-full overflow-hidden rounded-3xl shadow-2xl shadow-orange-900/20 ring-4 ring-white/70 sm:h-[26rem]">
      <LeafletMap />
      <div className="pointer-events-none absolute right-3 top-3 z-[1000] rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 shadow">
        <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-emerald-500" />
        42 barang diselamatkan hari ini
      </div>
    </div>
  );
}
