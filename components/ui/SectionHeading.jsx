import { fraunces, gochiHand } from "@/lib/fonts";

const delay = (ms) => ({ "--rv-delay": `${ms}ms` });

export default function SectionHeading({ title, desc, className = "", splitWords = false }) {
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