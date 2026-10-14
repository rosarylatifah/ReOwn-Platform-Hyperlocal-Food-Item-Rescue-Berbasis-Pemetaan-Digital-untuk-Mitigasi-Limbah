"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

type From = "left" | "right" | "up";

interface RevealProps {
  as?: ElementType;
  from?: From;
  delay?: number; // ms
  className?: string;
  children: ReactNode;
}

export default function Reveal({
  as: Tag = "div",
  from = "up",
  delay = 0,
  className = "",
  children,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect(); // jalan sekali saja
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-in={inView}
      style={{ "--rv-delay": `${delay}ms` } as CSSProperties}
      className={`rv rv-${from} ${className}`}
    >
      {children}
    </Tag>
  );
}