"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Store } from 'lucide-react';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { fraunces, gochiHand } from '@/lib/fonts';
import { slides } from '@/lib/pembeli/dashboardData';
import { getSharedProducts } from '@/lib/pembeli/productHelper';
import { useCart } from '@/app/pembeli/context/cart';
import ProductCard from '@/components/pembeli/ProductCard';
import ProductDetail from '@/components/pembeli/ProductDetail';
import ReportModal from '@/components/pembeli/ReportModal';
import { createPortal } from 'react-dom';

const primaryButton =
  "inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-[#D85834] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#C24A28] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834]";

const heroButton =
  "inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-[#D85834] px-7 py-4 text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#C24A28] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834]";

const sliderArrow =
  "absolute top-32 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-stone-900 shadow-md backdrop-blur transition-all duration-200 hover:bg-white hover:text-[#D85834] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834] md:top-1/2";

export default function BuyerDashboard() {
  const { addToCart } = useCart();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHoveredSlider, setIsHoveredSlider] = useState(false);
  const [promoProducts, setPromoProducts] = useState([]);

  const [activeStorePopover, setActiveStorePopover] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reportingProduct, setReportingProduct] = useState(null);

  // Ambil produk asli dari helper localStorage saat halaman dimuat
  useEffect(() => {
    setPromoProducts(getSharedProducts());
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (isHoveredSlider) return;
    const timer = setInterval(() => { nextSlide(); }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide, isHoveredSlider]);

  const activeSlideData = slides[currentSlide] || {};

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#FFF7E9]">
      {/* HERO SECTION SLIDER: hampir setinggi layar, latar krem supaya kartu putih tetap menonjol */}
      <section className="relative mx-auto max-w-[1500px] px-4 pb-10 pt-[96px] md:px-8">
        <div
          onMouseEnter={() => setIsHoveredSlider(true)}
          onMouseLeave={() => setIsHoveredSlider(false)}
          className="relative flex min-h-[calc(100svh-190px)] flex-col overflow-hidden rounded-[26px] border border-stone-100 bg-white shadow-[0_14px_40px_rgba(120,70,30,0.14)] transition-shadow duration-300 hover:shadow-[0_24px_54px_rgba(120,70,30,0.2)] md:h-[calc(100svh-190px)] md:max-h-[760px] md:min-h-[440px] md:flex-row"
        >
          {/* SISI KIRI: BANNER GAMBAR & GRADASI HALUS */}
          <div className="relative h-64 w-full shrink-0 overflow-hidden md:h-full md:w-[55%]">
            {slides.map((slide, index) => (
              <img
                key={slide.id}
                src={slide.image?.src || slide.image}
                alt={slide.title || 'Slide Banner'}
                className="absolute left-0 top-0 h-full w-full object-cover"
                style={{
                  opacity: currentSlide === index ? 1 : 0,
                  transform: currentSlide === index ? 'scale(1)' : 'scale(1.08)',
                  transition: 'opacity 0.7s ease-in-out, transform 0.6s ease-out',
                }}
              />
            ))}

            {/* Gradasi foto → putih (desktop: ke kanan, mobile: ke bawah) */}
            <div
              aria-hidden
              className="pointer-events-none absolute right-0 top-0 hidden h-full w-[40%] bg-[linear-gradient(to_right,rgba(255,255,255,0)_0%,rgba(255,255,255,0.85)_70%,#FFFFFF_100%)] md:block"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent md:hidden"
            />
          </div>

          {/* SISI KANAN: TEKS */}
          <div className="relative z-[2] flex flex-1 flex-col justify-center bg-white px-6 pb-14 pt-4 md:w-[45%] md:flex-none md:py-0 md:pb-0 md:pl-6 md:pr-14">
            <span className="mb-4 inline-block self-start rounded-full bg-[#FBE9E2] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#D85834]">
              {activeSlideData.category || 'ReOwn Special'}
            </span>

            <h1 className={`${fraunces.className} text-3xl font-extrabold leading-tight text-stone-900 md:text-5xl`}>
              {activeSlideData.title || activeSlideData.heading || "Rescue Makanan & Produk Berkualitas"}
            </h1>

            <p className={`${gochiHand.className} mb-7 mt-4 text-lg leading-relaxed text-stone-600 md:text-2xl`}>
              {activeSlideData.description || activeSlideData.subtitle || "Dapatkan penawaran terbaik untuk produk layak pakai dan makanan lezat sebelum habis!"}
            </p>

            <Link href="/pembeli/produk" className={heroButton}>
              Jelajahi Sekarang
              <ChevronRight size={18} />
            </Link>
          </div>

          {/* TOMBOL NAVIGASI SLIDER KIRI & KANAN */}
          <button type="button" onClick={prevSlide} aria-label="Slide sebelumnya" className={`${sliderArrow} left-4`}>
            <ChevronLeft size={22} />
          </button>

          <button type="button" onClick={nextSlide} aria-label="Slide berikutnya" className={`${sliderArrow} right-4`}>
            <ChevronRight size={22} />
          </button>

          {/* INDIKATOR TITIK SLIDER */}
          <div className="absolute bottom-5 right-6 z-10 flex gap-1.5 md:right-14">
            {slides.map((_, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Ke slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-5 bg-[#D85834]' : 'w-1.5 bg-stone-300 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* AREA PRODUK: gradasi krem → krem kuning mulai dari sini */}
      <div className="relative bg-[linear-gradient(to_bottom,#FFF7E9_0%,#fcecd2_25%,#FFE8B0_100%)] pb-16 pt-12 md:pt-16">
        {/* Dekorasi lembut di belakang produk */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(#E4CFB2_1.3px,transparent_1.3px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)]" />
          <div className="float-slow absolute -left-40 top-24 h-96 w-96 rounded-full bg-[#FFD3AE]/50 blur-3xl" />
          <div
            className="float-slow absolute -right-32 top-[55%] h-[28rem] w-[28rem] rounded-full bg-[#CFE3B4]/50 blur-3xl"
            style={{ animationDelay: '-3s' }}
          />
        </div>

        {/* KONTEN UTAMA: DAFTAR PRODUK TERBARU DARI PENJUAL */}
        <section className="relative mx-auto max-w-[1280px] px-4 md:px-6">
          <Reveal from="up">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                title="Mulai Selamatkan Produk di Sekitar Kamu!"
                desc="Daftar barang dan makanan surplus yang baru saja diposting oleh penjual lokal!"
              />

              <Link href="/pembeli/produk" className={primaryButton}>
                Lihat Semua Produk
                <ChevronRight size={16} />
              </Link>
            </div>
          </Reveal>

          {promoProducts.length === 0 ? (
            <div className="mt-10 rounded-[26px] border-2 border-dashed border-[#E4CFB2] bg-white px-5 py-16 text-center shadow-[0_10px_30px_rgba(120,70,30,0.08)]">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-[#FBE9E2] text-[#D85834]">
                <Store size={28} />
              </div>
              <h3 className={`${fraunces.className} text-xl font-extrabold text-stone-900`}>
                Belum Ada Produk Rescue
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-stone-600">
                Belum ada penjual yang memposting produk.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {promoProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  isPromo={true}
                  activeStorePopover={activeStorePopover}
                  setActiveStorePopover={setActiveStorePopover}
                  onAddToCart={(prod) => {
                    addToCart(prod, 1);
                    alert(`Berhasil menambahkan ${prod.name} ke Keranjang!`);
                  }}
                  onSelectProduct={(prod) => setSelectedProduct(prod)}
                  onReportProduct={(prod) => setReportingProduct(prod)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* MODAL DETAIL PRODUK */}
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

      {/* MODAL LAPORKAN PRODUK */}
{reportingProduct &&
  createPortal(
    <ReportModal product={reportingProduct} onClose={() => setReportingProduct(null)} />,
    document.body
  )}
    </div>
  );
}
