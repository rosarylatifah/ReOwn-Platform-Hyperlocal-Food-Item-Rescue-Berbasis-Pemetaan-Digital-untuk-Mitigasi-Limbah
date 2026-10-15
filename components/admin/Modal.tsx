"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}

// Modal bisa bertumpuk (mis. dialog konfirmasi di dalam detail laporan).
// Hanya modal paling atas yang menutup saat Esc, dan scroll halaman terkunci selama ada modal.
const stack: object[] = [];
let locks = 0;
let savedOverflow = "";

export default function Modal({ title, onClose, children, footer, wide }: ModalProps) {
  const titleId = useId();
  const box = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    const token = {};
    stack.push(token);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && stack[stack.length - 1] === token) closeRef.current();
    };
    document.addEventListener("keydown", onKey);
    if (locks++ === 0) {
      savedOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    box.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      stack.splice(stack.indexOf(token), 1);
      if (--locks === 0) document.body.style.overflow = savedOverflow;
    };
  }, []);

  return (
    <div className="adm-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={box}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={"adm-modal" + (wide ? " adm-modal--wide" : "")}
      >
        <div className="adm-modal-h">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="adm-x" aria-label="Tutup" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="adm-modal-b">{children}</div>
        {footer && <div className="adm-modal-f">{footer}</div>}
      </div>
    </div>
  );
}