import type { CSSProperties } from "react";
import { fraunces, gochiHand } from "@/lib/fonts";

interface SectionHeadingProps {
  title: string;
  desc?: string;
  className?: string; // mis. "mx-auto text-center" atau "md:ml-[17%]"
  /**
   * Judul muncul per kata, lalu deskripsi menyusul.
   * WAJIB dibungkus <Reveal> (kelas .rv baru tampil saat parent-nya data-in="true").
   */
  splitWords?: boolean;
}

const delay = (ms: number) => ({ "--rv-delay": `${ms}ms` }) as CSSProperties;

export default function SectionHeading({ title, desc, className = "", splitWords = false }: SectionHeadingProps) {
  const words = title.split(" ");

  return (
    <div className={`max-w-2xl ${className}`}>
      <h2
        aria-label={splitWords ? title : undefined}
        className={`${fraunces.className} text-3xl font-extrabold uppercase leading-[1.05] tracking-tight text-stone-900 md:text-[2.6rem]`}
      >
        {splitWords
          ? words.map((w, i) => (
              <span key={i} aria-hidden className="rv rv-up inline-block" style={delay(i * 90)}>
                {w}
                {i < words.length - 1 ? "\u00A0" : ""}
              </span>
            ))
          : title}
      </h2>
      {desc && (
        <p
          className={`${gochiHand.className} mt-4 text-base leading-relaxed text-stone-600 ${splitWords ? "rv rv-up" : ""}`}
          style={splitWords ? delay(words.length * 90 + 120) : undefined}
        >
          {desc}
        </p>
      )}
    </div>
  );
}
