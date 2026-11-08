"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNotification } from '@/app/context/notification';
import NotificationList from '@/components/NotificationList';

export default function NotificationPopover({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('semua');
  const { notifications, markAllAsReadByRole, handleNotificationClick } = useNotification();

  useEffect(() => {
    if (!isOpen) return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const buyerNotifications = notifications.filter(item => item.role === 'pembeli' || !item.role);
  const buyerUnreadCount = buyerNotifications.filter(item => item.unread).length;

  return (
    <>
      <div 
        onClick={onClose}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 998, backgroundColor: 'rgba(0, 0, 0, 0.25)', 
          backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)'
        }}
      />

      <div 
        style={{
          position: 'fixed', top: '80px', right: '24px', width: '380px', height: '560px', maxHeight: '560px',
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

        {/* HEADER PEMBELI */}
        <div style={{ padding: '18px 20px 14px 20px', borderBottom: '1px solid #F0F0F0', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#FFF', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: '#1A1A1A', margin: 0 }}>
              Notifikasi Pembeli
            </h3>
            <button onClick={onClose} style={{ border: 'none', backgroundColor: '#F5F5F5', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666' }}>
              <X size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setActiveTab('semua')} 
                style={{ 
                  padding: '6px 14px', borderRadius: '20px', 
                  border: activeTab === 'semua' ? '1px solid rgba(217, 90, 54, 0.3)' : '1px solid transparent', 
                  fontSize: '12px', fontWeight: '600', cursor: 'pointer', 
                  backgroundColor: activeTab === 'semua' ? '#FFF3ED' : '#F5F5F5', 
                  color: activeTab === 'semua' ? '#D95A36' : '#666' 
                }}
              >
                Semua ({buyerNotifications.length})
              </button>
              
              <button 
                onClick={() => setActiveTab('unread')} 
                style={{ 
                  padding: '6px 14px', borderRadius: '20px', 
                  border: activeTab === 'unread' ? '1px solid rgba(217, 90, 54, 0.3)' : '1px solid transparent', 
                  fontSize: '12px', fontWeight: '600', cursor: 'pointer', 
                  backgroundColor: activeTab === 'unread' ? '#FFF3ED' : '#F5F5F5', 
                  color: activeTab === 'unread' ? '#D95A36' : '#666' 
                }}
              >
                Belum Dibaca ({buyerUnreadCount})
              </button>
            </div>

            {buyerUnreadCount > 0 && (
              <button 
                onClick={() => markAllAsReadByRole('pembeli')}
                style={{ border: 'none', background: 'none', color: '#D95A36', fontSize: '11px', fontWeight: '600', cursor: 'pointer', padding: 0, whiteSpace: 'nowrap' }}
              >
                Tandai dibaca
              </button>
            )}
          </div>
        </div>

        {/* PEMANGGILAN KOMPONEN NOTIFICATION LIST */}
        <NotificationList 
          notifications={buyerNotifications}
          activeTab={activeTab}
          onClose={onClose}
          onNotificationClick={handleNotificationClick}
        />
      </div>
    </>
  );
}