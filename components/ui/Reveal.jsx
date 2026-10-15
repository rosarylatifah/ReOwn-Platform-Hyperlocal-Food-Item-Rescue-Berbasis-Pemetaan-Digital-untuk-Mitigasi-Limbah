"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

export default function Reveal({
  as: Tag = "div",
  from = "up",
  delay = 0,
  className = "",
  children,
}) {
  const ref = useRef(null);
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
      style={{ "--rv-delay": `${delay}ms` }}
      className={`rv rv-${from} ${className}`}
    >
      {children}
    </Tag>
  );
}