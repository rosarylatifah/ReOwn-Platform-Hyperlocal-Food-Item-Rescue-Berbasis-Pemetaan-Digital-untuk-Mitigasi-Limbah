"use client";

import React from 'react';
import { Plus, MapPin, Clock } from 'lucide-react';
import StorePopover from '../profil/StorePopover';
import { fraunces } from '@/lib/fonts';

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834]";

export default function ProductCard({
  item,
  isPromo = false,
  showStoreInfo = true, // Control muncul/tidaknya nama toko
  showLocation = true,  // Control muncul/tidaknya alamat toko
  activeStorePopover,
  setActiveStorePopover,
  onAddToCart,
  onSelectProduct,
  onReportProduct
}) {
  const storeName = item.store || item.merchant || "REOWN MERCHANT";

  return (
    <div
      className={`group relative box-border w-full rounded-[22px] border border-stone-100 bg-white shadow-[0_10px_30px_rgba(120,70,30,0.08)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#D85834]/40 hover:shadow-[0_20px_44px_rgba(120,70,30,0.15)] ${
        activeStorePopover === item.id ? 'z-30' : 'z-[1]'
      }`}
    >
      {/* BADGE PROMO TERBATAS */}
      {isPromo && (
        <div className="absolute left-3 top-3 z-[2] flex items-center gap-1 rounded-full bg-[#D85834] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
          <Clock size={11} /> Promo Terbatas
        </div>
      )}

      {/* BADGE JARAK */}
      {!isPromo && item.distance && (
        <span className="absolute left-3 top-3 z-[2] rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-stone-900 shadow-md backdrop-blur">
          {item.distance}
        </span>
      )}

      {/* WADAH GAMBAR */}
      <div className="relative h-[150px] w-full overflow-hidden rounded-t-[22px] bg-gradient-to-br from-amber-100 to-orange-200">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
        />
      </div>

      {/* INFO PRODUK */}
      <div className="p-4">
        {/* NAMA PRODUK DI ATAS */}
        <h4
          className={`${fraunces.className} truncate text-base font-extrabold leading-tight text-stone-900 transition-colors duration-200 group-hover:text-[#D85834] ${
            showStoreInfo || showLocation ? 'mb-1' : 'mb-3.5'
          }`}
        >
          {item.name}
        </h4>

        {/* NAMA TOKO (Muncul jika showStoreInfo = true) */}
        {showStoreInfo && (
          <div className="relative mb-2 inline-block">
            <span
              onClick={(e) => {
                e.stopPropagation();
                if (setActiveStorePopover) {
                  setActiveStorePopover(activeStorePopover === item.id ? null : item.id);
                }
              }}
              className="cursor-pointer text-xs font-bold text-[#D85834] underline underline-offset-2 transition-colors hover:text-[#B94524]"
            >
              {storeName}
            </span>

            {/* POPOVER TOKO */}
            {activeStorePopover === item.id && (
              <StorePopover
                store={{
                  name: storeName,
                  location: item.location || item.address || 'Batam Centre',
                  totalProducts: 9,
                  logo: item.image
                }}
                onClose={() => setActiveStorePopover(null)}
                positionStyle={{
                  top: '24px',
                  left: '0px'
                }}
              />
            )}
          </div>
        )}

        {/* ALAMAT (Muncul jika showLocation = true) */}
        {showLocation && (
          <p className="mb-3.5 flex items-center gap-1 truncate text-xs text-stone-600">
            <MapPin size={13} className="shrink-0 text-[#D85834]" />
            <span className="truncate">{item.location || item.address || "Batam"}</span>
          </p>
        )}

        <div className="flex flex-col gap-2.5">
  <div>
    <span className={`${fraunces.className} block text-base font-extrabold text-[#D85834]`}>
      {item.price}
    </span>
    {item.originalPrice && (
      <span className="text-[11px] text-stone-400 line-through">{item.originalPrice}</span>
    )}
  </div>

  <div className="flex items-center gap-1.5">
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
      title="Tambah ke Keranjang"
      aria-label="Tambah ke keranjang"
      className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-stone-900 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#D85834] hover:shadow-lg active:translate-y-0 active:scale-95 ${focusRing}`}
    >
      <Plus size={16} />
    </button>

    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onSelectProduct(item); }}
      className={`flex-1 whitespace-nowrap rounded-xl bg-[#D85834] px-3 py-2 text-xs font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#C24A28] hover:shadow-lg active:translate-y-0 active:scale-95 ${focusRing}`}
    >
      Lihat Detail
    </button>
  </div>
</div>
      </div>
    </div>
  );
}