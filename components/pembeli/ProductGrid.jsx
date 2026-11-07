"use client";

import React from 'react';
import { Plus, MapPin, Store } from 'lucide-react';
import StorePopover from '../profil/StorePopover';
import { fraunces } from '@/lib/fonts';

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834]";

export default function ProductGrid({
  products,
  activeStorePopover,
  setActiveStorePopover,
  onAddToCart,
  onSelectDetail,
  onReport
}) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[26px] border-2 border-dashed border-[#E4CFB2] bg-white px-5 py-16 text-center shadow-[0_10px_30px_rgba(120,70,30,0.08)]">
        <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-[#FBE9E2] text-[#D85834]">
          <Store size={24} />
        </div>
        <h3 className={`${fraunces.className} text-xl font-extrabold text-stone-900`}>
          Belum Ada Produk
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Belum ada produk yang diposting oleh penjual.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((item) => {
        const storeName = item.sellerName || item.store || 'Toko Penjual';

        return (
          <div
            key={item.id}
            className={`group relative rounded-[22px] border border-stone-100 bg-white shadow-[0_10px_30px_rgba(120,70,30,0.08)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#D85834]/40 hover:shadow-[0_20px_44px_rgba(120,70,30,0.15)] ${
              activeStorePopover === item.id ? 'z-30' : 'z-[1]'
            }`}
          >

            <div className="relative h-[150px] overflow-hidden rounded-t-[22px] bg-gradient-to-br from-amber-100 to-orange-200">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
              />
              <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-stone-900 shadow-md backdrop-blur">
                {item.distance || '1.2 km'}
              </span>
            </div>

            <div className="p-4">
              <h4 className={`${fraunces.className} mb-1 truncate text-base font-extrabold leading-tight text-stone-900 transition-colors duration-200 group-hover:text-[#D85834]`}>
                {item.name}
              </h4>

              <div className="relative mb-2 inline-block">
                <span
                  onClick={(e) => { e.stopPropagation(); setActiveStorePopover(activeStorePopover === item.id ? null : item.id); }}
                  className="cursor-pointer text-xs font-bold text-[#D85834] underline underline-offset-2 transition-colors hover:text-[#B94524]"
                >
                  {storeName}
                </span>

                {activeStorePopover === item.id && (
                  <StorePopover
                    store={{ name: storeName, location: item.location || 'Batam Centre', totalProducts: 5, logo: item.image }}
                    onClose={() => setActiveStorePopover(null)}
                    positionStyle={{ top: '24px', left: '0px' }}
                  />
                )}
              </div>

              <p className="mb-3.5 flex items-center gap-1 text-xs text-stone-600">
                <MapPin size={12} className="shrink-0 text-[#D85834]" />
                <span className="truncate">{item.location || 'Batam'}</span>
              </p>

<div className="flex flex-col gap-2.5">
  <span className={`${fraunces.className} text-base font-extrabold text-[#D85834]`}>{item.price}</span>

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
      onClick={(e) => { e.stopPropagation(); onSelectDetail(item); }}
      className={`flex-1 whitespace-nowrap rounded-xl bg-[#D85834] px-3 py-2 text-xs font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#C24A28] hover:shadow-lg active:translate-y-0 active:scale-95 ${focusRing}`}
    >
      Lihat Detail
    </button>
  </div>
</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}