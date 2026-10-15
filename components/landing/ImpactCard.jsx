"use client";

import { useRef, useState } from "react";
import LiveCounter from "./LiveCounter";
import { caveat } from "@/lib/fonts";

const hidden = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" };
const faceClass =
  "relative col-start-1 row-start-1 rounded-[22px] bg-white px-6 pb-4 pt-6 shadow-[8px_10px_8px_-2px_rgba(0,0,0,0.35)]";

function FaceBody({ face }) {
  return (
    <>
      <h3 className={`${caveat.className} mb-4 text-center text-2xl font-medium leading-[1.15] text-[#F23A10]`}>
        <span className="block">{face.lines[0]}</span>
        <span className="block">{face.lines[1]}</span>
      </h3>
      {face.embedUrl ? (
        <iframe src={face.embedUrl} title={face.lines.join(" ")} loading="lazy" className="h-[170px] w-full rounded-2xl border-0" />
      ) : (
        <LiveCounter unit={face.unit} tonnesPerYear={face.tonnesPerYear} />
      )}
      <p className="mt-3 text-center text-[11px] text-stone-400">{face.hint}</p>
    </>
  );
}

/** Satu kartu dengan dua sisi: klik untuk membalik (depan: makanan, belakang: barang) */
export default function ImpactCard({ faces }) {
  const ref = useRef(null);
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0, gx: 50, gy: 50, active: false });

  const onMove = (e) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ x: (0.5 - py) * 12, y: (px - 0.5) * 12, gx: px * 100, gy: py * 100, active: true });
  };
  const reset = () => setTilt({ x: 0, y: 0, gx: 50, gy: 50, active: false });
  const toggle = () => setFlipped((f) => !f);

  const current = faces[flipped ? 1 : 0];
  const glare = {
    opacity: tilt.active ? 1 : 0,
    background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(246,150,120,0.28), transparent 60%)`,
  };

  return (
    <div className="mx-auto w-full max-w-[340px]">
      <div style={{ perspective: "1000px" }}>
        <div
          ref={ref}
          role="button"
          tabIndex={0}
          aria-pressed={flipped}
          aria-label={`${current.lines.join(" ")}. Tekan untuk membalik kartu`}
          onClick={toggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggle();
            }
          }}
          onPointerMove={onMove}
          onPointerLeave={reset}
          className="relative cursor-pointer rounded-[22px] outline-none transition-transform duration-200 ease-out [transform-style:preserve-3d] focus-visible:ring-4 focus-visible:ring-[#16A34A]/40"
          style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.active ? 1.03 : 1})` }}
        >
          <div
            className="grid transition-transform duration-700 ease-out [transform-style:preserve-3d]"
            style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
          >
            {/* Sisi depan: makanan */}
            <div aria-hidden={flipped} style={hidden} className={faceClass}>
              <FaceBody face={faces[0]} />
              <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[22px] transition-opacity duration-200" style={glare} />
            </div>

            {/* Sisi belakang: barang */}
            <div aria-hidden={!flipped} style={{ ...hidden, transform: "rotateY(180deg)" }} className={faceClass}>
              <FaceBody face={faces[1]} />
              <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[22px] transition-opacity duration-200" style={glare} />
            </div>
          </div>
        </div>
      </div>

      <a
        href={current.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block text-center text-xs text-[#3B82F6] hover:underline"
      >
        Sumber: {current.sourceLabel}
      </a>
    </div>
  );
}