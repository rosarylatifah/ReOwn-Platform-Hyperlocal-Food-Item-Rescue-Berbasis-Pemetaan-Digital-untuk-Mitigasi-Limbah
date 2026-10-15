"use client";

import dynamic from "next/dynamic";
import StatusDot from "@/components/ui/StatusDot";

// Leaflet butuh `window`, jadi hanya dimuat di browser (tanpa SSR).
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 animate-pulse bg-[#E4EBDD]" aria-hidden />,
});

interface MapPreviewProps {
  /** Jumlah barang/makanan yang terselamatkan bulan ini (dari database) */
  rescuedCount: number;
}

export default function MapPreview({ rescuedCount }: MapPreviewProps) {
  return (
    // `isolate` menjaga layer Leaflet tidak menimpa Navbar & dropdown-nya
    <div className="relative isolate min-h-[260px] w-full overflow-hidden rounded-[28px] shadow-[0_28px_60px_-14px_rgba(110,35,10,0.55),0_10px_24px_-8px_rgba(110,35,10,0.35)] ring-1 ring-black/10">
      <LeafletMap />
      <div className="pointer-events-none absolute right-0 top-4 z-[1000] flex items-center gap-2 rounded-l-full bg-white py-1.5 pl-3.5 pr-5 text-[10px] font-semibold text-stone-900 shadow-sm">
        <StatusDot />
        {rescuedCount.toLocaleString("id-ID")} barang/makanan sudah terselamatkan bulan ini
      </div>
    </div>
  );
}
