"use client";

import { MapPin } from "lucide-react";
import { useUserLocation } from "@/lib/locationStore";
import { fraunces } from "@/lib/fonts";

export default function LocationPrompt() {
  const { asked, markAsked, requestGps } = useUserLocation();
  if (asked) return null;

  const allow = async () => {
    try {
      await requestGps();
    } catch {
      alert("Izin lokasi tidak diberikan. Kamu tetap bisa mengatur lokasi manual di halaman Produk.");
    }
    markAsked();
  };

  return (
    <div className="fixed inset-0 z-[1200] grid place-items-center bg-stone-900/40 px-6 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-[22px] bg-white p-6 text-center shadow-[0_24px_60px_rgba(60,30,10,0.3)]"
      >
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#FBE9E2] text-[#D85834]">
          <MapPin size={24} />
        </span>
        <h3 className={`${fraunces.className} mt-4 text-xl font-extrabold text-stone-900`}>
          Izinkan akses lokasi?
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          ReOwn memakai lokasi kamu untuk menampilkan produk terdekat di peta. Ini opsional, dan kamu
          bisa mengatur lokasi manual kapan saja.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={markAsked}
            className="rounded-full border-[1.5px] border-stone-300 py-2.5 text-sm font-semibold text-stone-800 transition-colors hover:bg-stone-100"
          >
            Nanti saja
          </button>
          <button
            type="button"
            onClick={allow}
            className="rounded-full bg-stone-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#D85834]"
          >
            Izinkan
          </button>
        </div>
      </div>
    </div>
  );
}