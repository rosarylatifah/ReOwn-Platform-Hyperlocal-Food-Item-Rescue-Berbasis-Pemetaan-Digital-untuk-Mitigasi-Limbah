"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { fmtDateTime } from "@/lib/admin/format";
import { useNotification } from "@/app/context/notification"; // 👈 Pakai context terpusat kita

export default function NotificationBell() {
  const { notifications, markAllAsReadByRole, handleNotificationClick } = useNotification();
  const [open, setOpen] = useState(false);
  const box = useRef(null);

  // Filter khusus notifikasi untuk role 'admin'
  const adminNotifications = notifications.filter((n) => n.role === 'admin');
  const adminUnreadCount = adminNotifications.filter((n) => n.unread).length;

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (box.current && !box.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="adm-bell-wrap" ref={box} style={{ position: 'relative' }}>
      <button
        type="button"
        className="adm-bell"
        aria-label={`Notifikasi, ${adminUnreadCount} baru`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{ position: 'relative', cursor: 'pointer', background: 'none', border: 'none' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
        </svg>
        {adminUnreadCount > 0 && <span className="adm-bell-dot">{adminUnreadCount}</span>}
      </button>

      {open && (
        <div className="adm-notif" style={{ position: 'absolute', right: 0, top: '40px', width: '320px', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 999, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>Notifikasi Admin</h2>
            {adminUnreadCount > 0 && (
              <button 
                onClick={() => markAllAsReadByRole('admin')} 
                style={{ fontSize: '11px', color: '#D95A36', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}
              >
                Tandai dibaca
              </button>
            )}
          </div>

          {adminNotifications.length === 0 ? (
            <p className="adm-notif-empty" style={{ textAlign: 'center', color: '#888', fontSize: '13px', padding: '20px 0' }}>
              Tidak ada notifikasi baru.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
              {adminNotifications.slice(0, 6).map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n.id, n.link, () => setOpen(false))}
                  className="adm-notif-item"
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    background: n.unread ? '#FFF8F6' : '#FFFFFF',
                    borderBottom: '1px solid #F0F0F0',
                    cursor: 'pointer'
                  }}
                >
                  <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: n.unread ? '700' : '500', color: '#1A1A1A' }}>
                    {n.title || n.text}
                  </p>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>
                    {n.message}
                  </p>
                  <small style={{ fontSize: '10px', color: '#999' }}>{n.time || n.date}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}