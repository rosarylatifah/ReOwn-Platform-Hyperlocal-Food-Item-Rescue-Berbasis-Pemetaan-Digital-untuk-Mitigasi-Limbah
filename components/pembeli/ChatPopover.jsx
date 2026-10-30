"use client";

import React, { useState, useRef } from 'react';
import { X, Search, ArrowLeft, Send, Image as ImageIcon, MapPin, Paperclip, MessageSquare } from 'lucide-react';
import { useChat } from '@/app/pembeli/context/chat';

export default function ChatPopover({ isOpen, onClose, externalActiveChatId, onClearActiveChat }) {
  const { chats, allMessages, sendMessage, unreadChatCount } = useChat();
  const [internalActiveChatId, setInternalActiveChatId] = useState(null);
  
  // Sinkronisasi jika ada chat aktif yang dipicu dari luar (misal tombol Hubungi Penjual)
  const activeChatId = externalActiveChatId || internalActiveChatId;

  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const currentChat = chats.find((c) => c.id === activeChatId);
  const messages = activeChatId ? allMessages[activeChatId] || [] : [];

  const filteredChats = chats.filter((c) =>
    c.storeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = (e, role = 'buyer', customText = null) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || !activeChatId) return;

    sendMessage(activeChatId, textToSend, role);
    setInputMessage('');
    setShowAttachmentMenu(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleSend(null, 'buyer', `[Lampiran Gambar: ${file.name}]`);
    }
  };

  const handleSendLocation = () => {
    handleSend(null, 'buyer', '📍 [Berbagi Lokasi Penjemputan: Batam Centre]');
  };

  return (
    <>
      <div 
        onClick={onClose}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 998, backgroundColor: 'rgba(0, 0, 0, 0.15)', backdropFilter: 'blur(1px)'
        }}
      />

<div
  style={{
    position: 'fixed', top: '80px', right: '120px', width: '380px', height: '500px',
    maxWidth: 'calc(100vw - 24px)', boxSizing: 'border-box',
    backgroundColor: '#FFFFFF', borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(217, 90, 54, 0.08)',
    border: '1px solid rgba(217, 90, 54, 0.12)', zIndex: 999,
    display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'Inter, sans-serif'
  }}
  className="reown-chat-popover"
>
  <style jsx global>{`
    @media (max-width: 900px) {
      .reown-chat-popover {
        top: 76px !important;
        left: 12px !important;
        right: 12px !important;
        width: auto !important;
        height: calc(100vh - 92px) !important;
        max-width: none !important;
      }
    }
  `}</style>
        {!activeChatId ? (
          <>
            {/* HEADER LIST CHAT */}
            <div style={{ padding: '18px 20px 12px 20px', borderBottom: '1px solid #F0F0F0', backgroundColor: '#FFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: '#1A1A1A', margin: 0 }}>Pesan</h3>
                  {unreadChatCount > 0 && (
                    <span style={{ backgroundColor: '#D95A36', color: '#FFF', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px' }}>
                      {unreadChatCount} Baru
                    </span>
                  )}
                </div>
                <button onClick={onClose} style={{ border: 'none', backgroundColor: '#F5F5F5', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666' }}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#F5F5F5', borderRadius: '20px', padding: '8px 14px' }}>
                <Search size={15} color="#888" />
                <input 
                  type="text" placeholder="Cari percakapan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '12px', width: '100%' }}
                />
              </div>
            </div>

            {/* DAFTAR CHAT (KOSONG JIKA BELUM ADA PESAN MASUK) */}
            <div style={{ 
              flex: 1, 
              overflowY: 'auto', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center', // 👈 Biar konten tepat di tengah secara horizontal
              padding: '20px', 
              textAlign: 'center' 
            }}>
              {filteredChats.length === 0 ? (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', // 👈 Biar ikon & teks sejajar di tengah
                  justifyContent: 'center' 
                }}>
                  <MessageSquare size={42} color="#E5E7EB" style={{ marginBottom: '12px' }} />
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A1A', margin: '0 0 4px 0' }}>
                    Belum ada pesan
                  </p>
                  <p style={{ fontSize: '11px', color: '#666', margin: 0, maxWidth: '240px', lineHeight: '1.4' }}>
                    Pesan dari penjual atau riwayat chat kamu akan muncul di sini.
                  </p>
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setInternalActiveChatId(chat.id)}
                    style={{
                      width: '100%',
                      padding: '12px 20px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px', 
                      cursor: 'pointer',
                      backgroundColor: chat.unread ? '#FFF8F6' : '#FFF', 
                      borderBottom: '1px solid #F8F8F8'
                    }}
                  >
                    <img src={chat.avatar} alt={chat.storeName} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ flex: 1, overflow: 'hidden', textAlign: 'left' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <h4 style={{ margin: 0, fontSize: '13px', fontWeight: chat.unread ? '700' : '600', color: '#1A1A1A' }}>{chat.storeName}</h4>
                        <span style={{ fontSize: '10px', color: '#999' }}>{chat.time}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', color: chat.unread ? '#1A1A1A' : '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

          </>
        ) : (
          /* ROOM CHAT */
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF3ED' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => { setInternalActiveChatId(null); if(onClearActiveChat) onClearActiveChat(); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#D95A36', padding: 0, display: 'flex' }}>
                  <ArrowLeft size={18} />
                </button>
                <img src={currentChat?.avatar} alt="Toko" style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#1A1A1A' }}>{currentChat?.storeName}</h4>
                  <span style={{ fontSize: '10px', color: '#16A34A', fontWeight: '600' }}>● Online</span>
                </div>
              </div>
              <button onClick={onClose} style={{ border: 'none', backgroundColor: '#F5F5F5', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666' }}>
                <X size={14} />
              </button>
            </div>

            {/* BUBBLE CHAT */}
            <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#FAFAFA' }}>
              {messages.map((msg) => {
                const isBuyer = msg.sender === 'buyer';
                return (
                  <div key={msg.id} style={{ alignSelf: isBuyer ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                    <div style={{
                      padding: '10px 14px', borderRadius: '14px',
                      backgroundColor: isBuyer ? '#D95A36' : '#FFFFFF',
                      color: isBuyer ? '#FFF' : '#1A1A1A',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.05)', fontSize: '12px', lineHeight: '1.4',
                      border: isBuyer ? 'none' : '1px solid #E5E5E5'
                    }}>
                      {msg.text}
                    </div>
                    <span style={{ fontSize: '9px', color: '#999', marginTop: '2px', display: 'block', textAlign: isBuyer ? 'right' : 'left' }}>
                      {msg.time}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* INPUT */}
            <form onSubmit={(e) => handleSend(e, 'buyer')} style={{ padding: '10px 14px', borderTop: '1px solid #F0F0F0', backgroundColor: '#FFF', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button type="button" onClick={() => setShowAttachmentMenu(!showAttachmentMenu)} style={{ border: 'none', backgroundColor: '#F5F5F5', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#D95A36' }}>
                <Paperclip size={16} />
              </button>
              <input 
                type="text" placeholder="Tulis pesan..." value={inputMessage} onChange={(e) => setInputMessage(e.target.value)}
                style={{ flex: 1, padding: '8px 14px', borderRadius: '20px', border: '1px solid #E5E5E5', outline: 'none', fontSize: '12px' }}
              />
              <button type="submit" style={{ backgroundColor: '#D95A36', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#FFF' }}>
                <Send size={14} />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}