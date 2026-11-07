"use client";

import React from 'react';
import { Clock } from 'lucide-react';

export default function NotificationList({ notifications, activeTab, onClose, onNotificationClick }) {
  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'unread') return item.unread;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* AREA LIST YANG BISA DI-SCROLL */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {filteredNotifications.length === 0 ? (
          <div style={{ 
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
            padding: '40px 20px', textAlign: 'center', color: '#888', minHeight: '200px'
          }}>
            <Clock size={36} color="#CCC" style={{ marginBottom: '8px' }} />
            <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#1A1A1A' }}>
              Tidak ada notifikasi{activeTab === 'unread' ? ' belum dibaca' : ''}.
            </p>
            <p style={{ fontSize: '11px', color: '#666', margin: '4px 0 0 0' }}>
              Informasi pesanan atau produk rescue terbaru akan muncul di sini.
            </p>
          </div>
        ) : (
          (() => {
            let lastDate = null;
            return filteredNotifications.map((item, index) => {
              const showDateHeader = item.date && item.date !== lastDate;
              lastDate = item.date;

              const IconComp = typeof item.icon === 'function' ? item.icon : Clock;

              return (
                <React.Fragment key={item.id || index}>
                  {showDateHeader && (
                    <div style={{ padding: '8px 20px 4px 20px', fontSize: '10px', fontWeight: 'bold', color: '#999', backgroundColor: '#FAFAFA', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {item.date}
                    </div>
                  )}

                  <div
                    onClick={() => onNotificationClick(item.id, item.link, onClose)}
                    style={{
                      padding: '12px 20px', display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer',
                      backgroundColor: item.unread ? '#FFF8F6' : '#FFFFFF', borderBottom: '1px solid #F7F7F7', position: 'relative',
                      transition: 'background-color 0.2s ease', boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF0EB'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = item.unread ? '#FFF8F6' : '#FFFFFF'}
                  >
                    <div style={{ backgroundColor: item.bgColor || '#FFF3ED', color: item.color || '#D95A36', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconComp size={18} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                        <h4 style={{ margin: 0, fontSize: '13px', fontWeight: item.unread ? '700' : '600', color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</h4>
                        <span style={{ fontSize: '10px', color: '#999', whiteSpace: 'nowrap', marginLeft: '8px' }}>{item.time}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', color: item.unread ? '#333' : '#666', lineHeight: '1.45', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.message}
                      </p>
                    </div>
                    {item.unread && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D95A36', marginTop: '6px', flexShrink: 0 }} />}
                  </div>
                </React.Fragment>
              );
            });
          })()
        )}
      </div>

      {/* FOOTER BAWAH (Konsisten di semua list notifikasi) */}
      <div style={{ padding: '10px 20px', borderTop: '1px solid #F0F0F0', backgroundColor: '#FAFAFA', textAlign: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: '11px', color: '#888' }}>
          Informasi pesanan atau produk rescue terbaru
        </span>
      </div>
    </div>
  );
}