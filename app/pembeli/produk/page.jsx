// app/pembeli/produk/page.jsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Store, ChevronDown } from 'lucide-react';
import { useUserLocation } from '@/lib/locationStore';
import { useBuyerProducts } from '@/app/pembeli/hooks/useBuyerProducts';
import { approxLocation } from '@/lib/pembeli/locationPrivacy';
import ProductGrid from '@/components/pembeli/ProductGrid';
import ProductDetail from '@/components/pembeli/ProductDetail';
import ReportModal from '@/components/pembeli/ReportModal';
import BuyerMap from '@/components/pembeli/BuyerMap';
import { useCart } from '@/app/pembeli/context/cart';
import { fraunces } from '@/lib/fonts';

const chipBase =
  "shrink-0 whitespace-nowrap rounded-full border-[1.5px] px-5 py-2.5 text-[13px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834]";
const chipSelected = "border-[#D85834] bg-[#D85834] text-white hover:bg-[#C24A28]";
const chipIdle =
  "border-stone-200 bg-white text-stone-900 hover:border-[#D85834] hover:bg-[#FBE9E2] hover:text-[#D85834]";

const urgencyOptions = [
  { value: 'Semua', label: 'Urgensi: Semua' },
  { value: 'Mendesak', label: 'Mendesak' },
  { value: 'Segera', label: 'Segera' },
  { value: 'Normal', label: 'Normal' },
];

// Dropdown urgensi KHUSUS MOBILE (desktop tetap memakai <select> asli)
function UrgencyDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('touchstart', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('touchstart', close);
    };
  }, []);

  const current = urgencyOptions.find((o) => o.value === value) || urgencyOptions[0];

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Filter urgensi"
        className={`flex w-full items-center justify-between gap-3 rounded-full border-[1.5px] bg-white py-2.5 pl-5 pr-4 text-[13px] font-semibold text-stone-900 outline-none transition-all duration-200 hover:border-[#D85834] ${
          open ? 'border-[#D85834]' : 'border-stone-200'
        }`}
      >
        <span>{current.label}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-stone-500 transition-transform duration-200 ${open ? 'rotate-180 text-[#D85834]' : ''}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border border-stone-100 bg-white py-1.5 shadow-[0_20px_44px_rgba(120,70,30,0.15)]"
        >
          {urgencyOptions.map((opt) => {
            const isActive = opt.value === value;
            return (
              <li key={opt.value} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full px-5 py-2.5 text-left text-[13px] font-semibold transition-colors duration-150 ${
                    isActive
                      ? 'bg-[#FBE9E2] text-[#D85834]'
                      : 'text-stone-900 hover:bg-[#FBE9E2] hover:text-[#D85834]'
                  }`}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// Rumus Haversine untuk jarak (km)
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

  // Placeholder pendek hanya di mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Jarak dihitung dari titik PERKIRAAN toko (sama dengan lingkaran di peta),
  // bukan dari koordinat asli, supaya lokasi persis toko tidak bisa ditebak.
  const displayedProducts = React.useMemo(() => {
    const withDistance = filteredProducts.map((p) => {
      const a = approxLocation({ ...p, lat: p.lat ?? 1.1186, lng: p.lng ?? 104.0487 });
      const d = calculateDistance(userLoc.lat, userLoc.lng, a.lat, a.lng);
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
      <section className="relative z-20 mx-auto mb-6 mt-6 flex max-w-[1280px] flex-col items-stretch gap-3 px-4 md:mb-8 md:mt-8 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-4 md:px-6">
        <div className="group relative w-full md:w-auto md:min-w-[280px] md:flex-1">
          <Search
            size={18}
            className={`pointer-events-none absolute left-4 top-1/2 z-[2] -translate-y-1/2 transition-colors duration-200 group-hover:text-[#D85834] ${
              isSearchFocused ? 'text-[#D85834]' : 'text-stone-400'
            }`}
          />
          <input
            type="text"
            placeholder={
              isMobile
                ? "Cari makanan, barang, atau toko..."
                : "Cari makanan, barang rescue, atau nama toko/penjual..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="w-full rounded-full border-[1.5px] border-stone-200 bg-white py-3 pl-12 pr-4 text-base text-stone-900 outline-none transition-all duration-200 placeholder:text-stone-400 hover:border-[#D85834]/50 focus:-translate-y-px focus:border-[#D85834] focus:shadow-[0_10px_30px_rgba(120,70,30,0.12)] md:text-sm"
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

        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:flex-wrap md:items-center">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:py-0">
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

          {/* MOBILE: dropdown buatan sendiri */}
          <div className="md:hidden">
            <UrgencyDropdown value={selectedUrgency} onChange={setSelectedUrgency} />
          </div>

          {/* DESKTOP: select asli (tidak diubah) */}
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            aria-label="Filter urgensi"
            className="hidden cursor-pointer rounded-full border-[1.5px] border-stone-200 bg-white px-5 py-2.5 text-[13px] font-semibold text-stone-900 outline-none transition-all duration-200 hover:border-[#D85834] focus:border-[#D85834] md:block"
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
