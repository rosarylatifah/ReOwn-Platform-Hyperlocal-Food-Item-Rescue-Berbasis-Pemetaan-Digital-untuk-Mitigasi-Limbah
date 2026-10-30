// app/pembeli/produk/page.jsx
"use client";

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, Store } from 'lucide-react';
import { useUserLocation } from '@/lib/locationStore';
import { useBuyerProducts } from '@/app/pembeli/hooks/useBuyerProducts';
import ProductGrid from '@/components/pembeli/ProductGrid';
import ProductDetail from '@/components/pembeli/ProductDetail';
import ReportModal from '@/components/pembeli/ReportModal';
import BuyerMap from '@/components/pembeli/BuyerMap';
import { useCart } from '@/app/pembeli/context/cart';
import { fraunces } from '@/lib/fonts';

const batamCenterPos = [1.1186, 104.0487];

const chipBase =
  "rounded-full border-[1.5px] px-5 py-2.5 text-[13px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834]";
const chipSelected = "border-[#D85834] bg-[#D85834] text-white hover:bg-[#C24A28]";
const chipIdle =
  "border-stone-200 bg-white text-stone-900 hover:border-[#D85834] hover:bg-[#FBE9E2] hover:text-[#D85834]";

export default function BuyerProducts() {
  const { addToCart } = useCart();

  const { location: userLoc } = useUserLocation();

  const {
    products,
    filteredProducts,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedUrgency,
    setSelectedUrgency,
    activeStorePopover,
    setActiveStorePopover,
    selectedProduct,
    setSelectedProduct,
    reportingProduct,
    setReportingProduct
  } = useBuyerProducts();

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Rumus Haversine untuk jarak
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

const displayedProducts = React.useMemo(() => {
  const withDistance = filteredProducts.map((p) => {
    const d = calculateDistance(userLoc.lat, userLoc.lng, p.lat || 1.1186, p.lng || 104.0487);
    return { ...p, distanceKm: d, distance: `${d.toFixed(1)} km` };
  });
  if (selectedCategory === 'Terdekat') withDistance.sort((a, b) => a.distanceKm - b.distanceKm);
  return withDistance;
}, [filteredProducts, selectedCategory, userLoc.lat, userLoc.lng]);

  return (
    <div className="relative min-h-screen overflow-x-clip pb-16 pt-[100px]">
      {/* Background dekoratif */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(#E4CFB2_1.3px,transparent_1.3px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)]" />
        <div className="float-slow absolute -left-40 top-24 h-96 w-96 rounded-full bg-[#FFD3AE]/50 blur-3xl" />
        <div
          className="float-slow absolute -right-32 top-[60%] h-[28rem] w-[28rem] rounded-full bg-[#CFE3B4]/50 blur-3xl"
          style={{ animationDelay: '-3s' }}
        />
      </div>

      {/* PETA */}
      <div className="relative">
        <BuyerMap products={products} onSelectProduct={setSelectedProduct} />
      </div>

      {/* SEARCH, KATEGORI & URGENSI */}
      <section className="relative z-20 mx-auto mb-8 mt-8 flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-4 md:px-6">
        <div className="group relative min-w-[280px] flex-1">
          <Search
            size={18}
            className={`pointer-events-none absolute left-4 top-1/2 z-[2] -translate-y-1/2 transition-colors duration-200 group-hover:text-[#D85834] ${
              isSearchFocused ? 'text-[#D85834]' : 'text-stone-400'
            }`}
          />
          <input
            type="text"
            placeholder="Cari makanan, barang rescue, atau nama toko/penjual..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="w-full rounded-full border-[1.5px] border-stone-200 bg-white py-3 pl-12 pr-4 text-sm text-stone-900 outline-none transition-all duration-200 placeholder:text-stone-400 hover:border-[#D85834]/50 focus:-translate-y-px focus:border-[#D85834] focus:shadow-[0_10px_30px_rgba(120,70,30,0.12)]"
          />

          {isSearchFocused && searchTerm.trim() !== '' && products.filter(p => {
            const seller = p.sellerName || p.storeName || p.store || '';
            return seller.toLowerCase().includes(searchTerm.toLowerCase());
          }).length > 0 && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-10 overflow-hidden rounded-[22px] border border-stone-100 bg-white py-2 shadow-[0_20px_44px_rgba(120,70,30,0.15)]">
              <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-stone-500">
                Hasil Pencarian Penjual / Toko
              </div>
              {Array.from(
                new Map(
                  products
                    .filter(p => {
                      const seller = p.sellerName || p.storeName || p.store || '';
                      return seller.toLowerCase().includes(searchTerm.toLowerCase());
                    })
                    .map(p => [p.sellerName || p.storeName || p.store, p])
                ).values()
              ).map((sellerItem, idx) => {
                const sellerName = sellerItem.sellerName || sellerItem.storeName || sellerItem.store || 'Toko Rescue';
                return (
                  <div
                    key={idx}
                    onMouseDown={() => setSearchTerm(sellerName)}
                    className="flex cursor-pointer items-center gap-3 border-b border-stone-100 px-4 py-2.5 transition-colors duration-200 last:border-b-0 hover:bg-[#FBE9E2]"
                  >
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#FBE9E2] text-[#D85834]">
                      <Store size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[13px] font-bold text-stone-900">{sellerName}</div>
                      <div className="text-[11px] text-stone-500">Punya produk rescue aktif</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-2">
            {['Semua', 'Makanan', 'Barang', 'Terdekat'].map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={isSelected}
                  className={`${chipBase} ${isSelected ? chipSelected : chipIdle}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            aria-label="Filter urgensi"
            className="cursor-pointer rounded-full border-[1.5px] border-stone-200 bg-white px-5 py-2.5 text-[13px] font-semibold text-stone-900 outline-none transition-all duration-200 hover:border-[#D85834] focus:border-[#D85834]"
          >
            <option value="Semua">Urgensi: Semua</option>
            <option value="Mendesak">Mendesak</option>
            <option value="Segera">Segera</option>
            <option value="Normal">Normal</option>
          </select>
        </div>
      </section>

      {/* GRID PRODUK */}
      <section className="relative mx-auto max-w-[1280px] px-4 md:px-6">
        <h3 className={`${fraunces.className} mb-6 text-xl font-extrabold leading-tight text-stone-900 md:text-2xl`}>
          {selectedCategory === 'Terdekat' ? 'Hasil Berdasarkan Jarak Terdekat dari Lokasi Kamu' : 'Hasil Pencarian di Sekitar Anda'}
        </h3>

        <ProductGrid
          products={displayedProducts}
          activeStorePopover={activeStorePopover}
          setActiveStorePopover={setActiveStorePopover}
          onAddToCart={(item) => {
            addToCart(item, 1);
            alert(`1x ${item.name} berhasil ditambahkan ke Keranjang!`);
          }}
          onSelectDetail={(item) => setSelectedProduct(item)}
        />
      </section>

      {/* Popup dirender ke body supaya tidak tenggelam di bawah footer */}
      {selectedProduct &&
        createPortal(
          <ProductDetail
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onReport={() => setReportingProduct(selectedProduct)}
            onAddToCart={(prodWithQty) => {
              addToCart(prodWithQty, prodWithQty.quantity || 1);
              alert(`Berhasil menambahkan ${prodWithQty.quantity || 1}x ${prodWithQty.name} ke keranjang!`);
              setSelectedProduct(null);
            }}
          />,
          document.body
        )}

      {reportingProduct &&
        createPortal(
          <ReportModal product={reportingProduct} onClose={() => setReportingProduct(null)} />,
          document.body
        )}
    </div>
  );
}