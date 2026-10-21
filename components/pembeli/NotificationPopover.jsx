"use client";

import React, { useState } from 'react';
import { Clock, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useNotification } from '@/app/pembeli/context/notification';

export default function NotificationPopover({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('semua');
  const { notifications, unreadCount, markAllAsRead, handleNotificationClick } = useNotification();

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'unread') return item.unread;
    return true;
  });

  return (
    <>
      {/* Overlay Luar */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 998, backgroundColor: 'rgba(0, 0, 0, 0.15)', backdropFilter: 'blur(1px)'
        }}
      />

      <div 
        style={{
          position: 'fixed', top: '80px', right: '40px', width: '380px', maxHeight: '520px',
          backgroundColor: '#FFFFFF', borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(217, 90, 54, 0.08)',
          border: '1px solid rgba(217, 90, 54, 0.12)', zIndex: 999,
          display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'Inter, sans-serif'
        }}
        className="reown-notification-popover"
      >
        <style jsx global>{`
          @media (max-width: 640px) {
            .reown-notification-popover {
              top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
              width: 100vw !important; height: 100vh !important; max-height: 100vh !important; border-radius: 0 !important;
            }
          }
        `}</style>

        {/* HEADER */}
        <div style={{ padding: '18px 20px 14px 20px', borderBottom: '1px solid #F0F0F0', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#FFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: '#1A1A1A', margin: 0 }}>
                Notifikasi
              </h3>
              {unreadCount > 0 && (
                <span style={{ backgroundColor: '#D95A36', color: '#FFF', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px' }}>
                  {unreadCount} Baru
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} style={{ border: 'none', background: 'none', color: '#D95A36', fontSize: '11px', fontWeight: '600', cursor: 'pointer', padding: 0 }}>
                  Tandai dibaca
                </button>
              )}
              <button onClick={onClose} style={{ border: 'none', backgroundColor: '#F5F5F5', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666' }}>
                <X size={16} />
              </button>
            </div>
          </div>

          {/* TABS */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setActiveTab('semua')} style={{ padding: '6px 14px', borderRadius: '20px', border: activeTab === 'semua' ? '1px solid rgba(217, 90, 54, 0.3)' : '1px solid transparent', fontSize: '12px', fontWeight: '600', cursor: 'pointer', backgroundColor: activeTab === 'semua' ? '#FFF3ED' : '#F5F5F5', color: activeTab === 'semua' ? '#D95A36' : '#666' }}>
              Semua
            </button>
            <button onClick={() => setActiveTab('unread')} style={{ padding: '6px 14px', borderRadius: '20px', border: activeTab === 'unread' ? '1px solid rgba(217, 90, 54, 0.3)' : '1px solid transparent', fontSize: '12px', fontWeight: '600', cursor: 'pointer', backgroundColor: activeTab === 'unread' ? '#FFF3ED' : '#F5F5F5', color: activeTab === 'unread' ? '#D95A36' : '#666' }}>
              Belum Dibaca {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>
        </div>

        {/* LIST NOTIFIKASI */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0', display: 'flex', flexDirection: 'column' }}>
          {filteredNotifications.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#888' }}>
              <Clock size={32} color="#CCC" style={{ marginBottom: '8px' }} />
              <p style={{ margin: 0, fontSize: '13px' }}>Tidak ada notifikasi {activeTab === 'unread' ? 'belum dibaca' : ''}.</p>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item.id, item.link, onClose)}
                  style={{
                    padding: '12px 20px', display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer',
                    backgroundColor: item.unread ? '#FFF8F6' : '#FFFFFF', borderBottom: '1px solid #F7F7F7', position: 'relative',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF0EB'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = item.unread ? '#FFF8F6' : '#FFFFFF'}
                >
                  <div style={{ backgroundColor: item.bgColor, color: item.color, padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <IconComp size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                      <h4 style={{ margin: 0, fontSize: '13px', fontWeight: item.unread ? '700' : '600', color: '#1A1A1A' }}>{item.title}</h4>
                      <span style={{ fontSize: '10px', color: '#999', whiteSpace: 'nowrap' }}>{item.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: item.unread ? '#333' : '#666', lineHeight: '1.45', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.message}
                    </p>
                  </div>
                  {item.unread && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D95A36', marginTop: '6px', flexShrink: 0 }} />}
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #F0F0F0', backgroundColor: '#FAFAFA', textAlign: 'center' }}>
          <Link href="/pembeli/notifikasi" onClick={onClose} style={{ fontSize: '12px', fontWeight: 'bold', color: '#D95A36', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Lihat Seluruh Notifikasi <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </>
  );
}