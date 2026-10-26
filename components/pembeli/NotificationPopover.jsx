"use client";

import React, { useState } from 'react';
import { X, CheckCheck } from 'lucide-react';
import { useNotification } from '@/app/pembeli/context/notification';
import NotificationList from './NotificationList';

export default function NotificationPopover({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('semua');
  const { notifications, unreadCount, markAllAsRead, handleNotificationClick } = useNotification();

  if (!isOpen) return null;

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
          position: 'fixed', top: '80px', right: '40px', width: '380px', maxHeight: '560px',
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
        <div style={{ padding: '18px 20px 14px 20px', borderBottom: '1px solid #F0F0F0', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#FFF', flexShrink: 0 }}>
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

        {/* LIST NOTIFIKASI (BISA DI-SCROLL KE BAWAH DENGAN RAPI & ADA TANGGALNYA) */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <NotificationList 
            notifications={notifications}
            activeTab={activeTab}
            onClose={onClose}
            onNotificationClick={handleNotificationClick}
          />
        </div>

        {/* FOOTER STATIS (OPSIONAL: TANDA SEMUA DIBACA / TUTUP) */}
        <div style={{ padding: '10px 20px', borderTop: '1px solid #F0F0F0', backgroundColor: '#FAFAFA', textAlign: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '11px', color: '#888' }}>
            Menampilkan seluruh riwayat notifikasi terbaru
          </span>
        </div>
      </div>
    </>
  );
}