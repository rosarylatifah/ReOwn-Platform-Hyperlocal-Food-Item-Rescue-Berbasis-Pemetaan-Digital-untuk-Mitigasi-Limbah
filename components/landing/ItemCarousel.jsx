"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import ItemCard from "@/components/common/ItemCard";
import ItemDetailModal from "./ItemDetailModal";

const AUTOPLAY_MS = 5000;

const FILTERS = [
  { id: "all", label: "Semua" },
  { id: "free", label: "Gratis" },
  { id: "paid", label: "Berbayar" },
  { id: "near", label: "Terdekat" },
];

const km = (d) => parseFloat(d) || 0;

function applyFilter(items, f) {
  if (f === "free") return items.filter((i) => i.price === "Gratis");
  if (f === "paid") return items.filter((i) => i.price !== "Gratis");
  if (f === "near") return [...items].sort((a, b) => km(a.distance) - km(b.distance));
  return items;
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
}

/** Kartu masuk dari arah navigasi, keluar ke arah sebaliknya */
const slide = {
  enter: (d) => ({ opacity: 0, x: d * 90 }),
  center: { opacity: 1, x: 0 },
  exit: (d) => ({ opacity: 0, x: d * -90 }),
};

function ArrowButton({ dir, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      aria-label={dir === "prev" ? "Barang sebelumnya" : "Barang berikutnya"}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-stone-900 text-stone-900 transition-colors hover:bg-stone-900 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834]"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={dir === "prev" ? "M19 12H5m6-6-6 6 6 6" : "M5 12h14m-6-6 6 6-6 6"} />
      </svg>
    </motion.button>
  );
}

export default function ItemCarousel({ items }) {
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();

  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState(1);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState(null);

  const closeDetail = useCallback(() => setSelected(null), []);

  const list = applyFilter(items, filter);
  const n = list.length;
  const a = n ? active % n : 0;
  const three = n >= 3;

  const go = useCallback(
    (d) => {
      setDir(d);
      setActive((x) => (n ? (x + d + n) % n : 0));
    },
    [n]
  );

  const jump = (i) => {
    setDir(i > a ? 1 : -1);
    setActive(i);
  };

  const changeFilter = (f) => {
    setFilter(f);
    setActive(1);
    setDir(1);
  };

  // Autoplay: berhenti saat hover/fokus, saat popup terbuka, atau jika pengguna mematikan animasi
  useEffect(() => {
    if (paused || reduced || n < 2 || selected) return;
    const t = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, reduced, n, go, active, selected]);

  const view = three
    ? [list[(a - 1 + n) % n], list[a], list[(a + 1) % n]]
    : list;

  const cols = three
    ? "md:grid-cols-3 md:mx-auto md:max-w-[800px]"
    : n === 2
      ? "md:grid-cols-2 md:mx-auto md:max-w-[720px]"
      : "md:mx-auto md:max-w-sm";

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Barang di sekitarmu"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="overflow-x-clip outline-none"
    >
      {/* Filter chip */}
      <div className="mb-10 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter barang">
        {FILTERS.map((f) => {
          const on = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => changeFilter(f.id)}
              aria-pressed={on}
              className={`relative rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                on ? "text-white" : "text-stone-700 hover:text-stone-900"
              }`}
            >
              {on && (
                <motion.span
                  layoutId="chip-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-stone-900"
                />
              )}
              {!on && <span className="absolute inset-0 rounded-full ring-1 ring-stone-300" />}
              <span className="relative">{f.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <ArrowButton dir="prev" onClick={() => go(-1)} />

        {n === 0 ? (
          <p className="flex-1 py-24 text-center text-stone-500">
            Belum ada barang di kategori ini. Coba pilih filter lain.
          </p>
        ) : (
          <motion.ul
            layoutRoot
            drag={n > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            dragSnapToOrigin
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1);
              else if (info.offset.x > 60) go(-1);
            }}
            className={`relative grid min-h-[430px] flex-1 touch-pan-y cursor-grab items-center gap-5 active:cursor-grabbing md:min-h-[520px] ${cols}`}
          >
            <AnimatePresence mode="popLayout" custom={dir} initial={false}>
              {view.map((it, i) => {
                const center = three ? i === 1 : true;
                return (
                  <motion.li
                    key={`${filter}-${it.id}`}
                    layout={reduced ? false : "position"}
                    custom={dir}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 260, damping: 28 }}
                    className={center ? "relative z-10" : "hidden md:block"}
                  >
                    <motion.div
                      animate={{
                        scale: three && desktop ? (center ? 1.03 : 0.88) : 1,
                        opacity: center ? 1 : 0.72,
                      }}
                      transition={{ type: "spring", stiffness: 240, damping: 24 }}
                    >
                      <ItemCard item={it} featured={center} onDetail={setSelected} />
                    </motion.div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
        )}

        <ArrowButton dir="next" onClick={() => go(1)} />
      </div>

      {/* Dot indicator */}
      {n > 1 && (
        <div className="mt-12 flex justify-center gap-2" role="group" aria-label="Pilih barang">
          {list.map((it, i) => (
            <button
              key={it.id}
              type="button"
              onClick={() => jump(i)}
              aria-label={`Tampilkan ${it.name}`}
              aria-current={i === a}
              className="grid h-4 place-items-center"
            >
              <motion.span
                animate={{ width: i === a ? 28 : 8, backgroundColor: i === a ? "#D85834" : "#D6D3D1" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="block h-2 rounded-full"
              />
            </button>
          ))}
        </div>
      )}

      {/* Popup detail barang */}
      <ItemDetailModal item={selected} onClose={closeDetail} />
    </div>
  );
}