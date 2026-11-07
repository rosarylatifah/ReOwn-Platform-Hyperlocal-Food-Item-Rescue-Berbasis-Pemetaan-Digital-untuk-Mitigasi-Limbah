"use client";

import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function ChatList({ filteredChats, activeTab, onSelectChat }) {
  if (filteredChats.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center', height: '100%' }}>
        <MessageSquare size={42} color="#E5E7EB" style={{ marginBottom: '12px' }} />
        <p style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A1A', margin: '0 0 4px 0' }}>Belum ada pesan</p>
        <p style={{ fontSize: '11px', color: '#666', margin: 0, maxWidth: '240px', lineHeight: '1.4' }}>
          {activeTab === 'unread' ? 'Tidak ada pesan yang belum dibaca.' : 'Pesan atau riwayat chat kamu akan muncul di sini.'}
        </p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      {filteredChats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onSelectChat(chat.id)}
          style={{
            width: '100%', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
            backgroundColor: chat.unread ? '#FFF8F6' : '#FFF', borderBottom: '1px solid #F8F8F8', position: 'relative', boxSizing: 'border-box'
          }}
        >
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img src={chat.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} alt="Avatar" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
            {chat.unread && (
              <span style={{ position: 'absolute', top: 0, right: 0, width: '12px', height: '12px', backgroundColor: '#D95A36', borderRadius: '50%', border: '2px solid #FFF' }} />
            )}
          </div>
          <div style={{ flex: 1, overflow: 'hidden', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <h4 style={{ margin: 0, fontSize: '13px', fontWeight: chat.unread ? '700' : '600', color: '#1A1A1A' }}>
                {chat.storeName || chat.buyerName || chat.senderName}
              </h4>
              <span style={{ fontSize: '10px', color: chat.unread ? '#D95A36' : '#999', fontWeight: chat.unread ? '600' : '400' }}>
                {chat.time}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: chat.unread ? '#1A1A1A' : '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: chat.unread ? '600' : '400' }}>
              {chat.lastMessage}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}