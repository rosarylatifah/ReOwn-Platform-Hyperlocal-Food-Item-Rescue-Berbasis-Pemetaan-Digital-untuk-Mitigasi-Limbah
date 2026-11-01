"use client";

import React, { useState } from 'react';
import { X, Search, ArrowLeft, Send, Image as ImageIcon, MapPin, Paperclip, MessageSquare } from 'lucide-react';
import { useChat } from '@/app/pembeli/context/chat'; // Menggunakan Context Chat yang sama agar saling terhubung!

export default function SellerChatPopover({ isOpen, onClose, externalActiveChatId, onClearActiveChat }) {
  const { chats, allMessages, sendMessage, unreadChatCount } = useChat();
  const [internalActiveChatId, setInternalActiveChatId] = useState(null);
  
  // Sinkronisasi jika ada chat aktif dari luar
  const activeChatId = externalActiveChatId || internalActiveChatId;

  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  if (!isOpen) return null;

  const currentChat = chats.find((c) => c.id === activeChatId);
  const messages = activeChatId ? allMessages[activeChatId] || [] : [];

  const filteredChats = chats.filter((c) =>
    c.storeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = (e, role = 'seller', customText = null) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || !activeChatId) return;

    // Mengirim pesan dengan peran sebagai 'seller'
    sendMessage(activeChatId, textToSend, role);
    setInputMessage('');
    setShowAttachmentMenu(false);
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
          backgroundColor: '#FFFFFF', borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(217, 90, 54, 0.08)',
          border: '1px solid rgba(217, 90, 54, 0.12)', zIndex: 999,
          display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'Inter, sans-serif'
        }}
        className="reown-seller-chat-popover"
      >
        {!activeChatId ? (
          <>
            {/* HEADER LIST CHAT PENJUAL */}
            <div style={{ padding: '18px 20px 12px 20px', borderBottom: '1px solid #F0F0F0', backgroundColor: '#FFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: '#1A1A1A', margin: 0 }}>Pesan Masuk Pembeli</h3>
                </div>
                <button onClick={onClose} style={{ border: 'none', backgroundColor: '#F5F5F5', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666' }}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#F5F5F5', borderRadius: '20px', padding: '8px 14px' }}>
                <Search size={15} color="#888" />
                <input 
                  type="text" placeholder="Cari pelanggan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '12px', width: '100%' }}
                />
              </div>
            </div>

            {/* DAFTAR CHAT */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: filteredChats.length === 0 ? 'center' : 'flex-start', alignItems: filteredChats.length === 0 ? 'center' : 'stretch', padding: filteredChats.length === 0 ? '20px' : '0', textAlign: filteredChats.length === 0 ? 'center' : 'left' }}>
              {filteredChats.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={42} color="#E5E7EB" style={{ marginBottom: '12px' }} />
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A1A', margin: '0 0 4px 0' }}>
                    Belum ada pesan pelanggan
                  </p>
                  <p style={{ fontSize: '11px', color: '#666', margin: 0, maxWidth: '240px', lineHeight: '1.4' }}>
                    Pertanyaan atau pesanan dari pembeli akan masuk ke sini.
                  </p>
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setInternalActiveChatId(chat.id)}
                    style={{
                      width: '100%', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
                      backgroundColor: '#FFF', borderBottom: '1px solid #F8F8F8', boxSizing: 'border-box'
                    }}
                  >
                    <img src={chat.avatar} alt={chat.storeName} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ flex: 1, overflow: 'hidden', textAlign: 'left' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#1A1A1A' }}>{chat.storeName}</h4>
                        <span style={{ fontSize: '10px', color: '#999' }}>{chat.time}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          /* ROOM CHAT PENJUAL */
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF3ED' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => { setInternalActiveChatId(null); if(onClearActiveChat) onClearActiveChat(); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#D95A36', padding: 0, display: 'flex' }}>
                  <ArrowLeft size={18} />
                </button>
                <img src={currentChat?.avatar} alt="Pelanggan" style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#1A1A1A' }}>{currentChat?.storeName}</h4>
                  <span style={{ fontSize: '10px', color: '#16A34A', fontWeight: '600' }}>● Pelanggan Aktif</span>
                </div>
              </div>
              <button onClick={onClose} style={{ border: 'none', backgroundColor: '#F5F5F5', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666' }}>
                <X size={14} />
              </button>
            </div>

            {/* BUBBLE CHAT (Pesan Seller dibedakan warnanya agar jelas) */}
            <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#FAFAFA' }}>
              {messages.map((msg) => {
                const isSeller = msg.sender === 'seller';
                return (
                  <div key={msg.id} style={{ alignSelf: isSeller ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                    <div style={{
                      padding: '10px 14px', borderRadius: '14px',
                      backgroundColor: isSeller ? '#1A1A1A' : '#FFFFFF', // Warna hitam/gelap untuk chat dari penjual
                      color: isSeller ? '#FFF' : '#1A1A1A',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.05)', fontSize: '12px', lineHeight: '1.4',
                      border: isSeller ? 'none' : '1px solid #E5E5E5'
                    }}>
                      {msg.text}
                    </div>
                    <span style={{ fontSize: '9px', color: '#999', marginTop: '2px', display: 'block', textAlign: isSeller ? 'right' : 'left' }}>
                      {msg.time}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* INPUT CHAT PENJUAL */}
            <form onSubmit={(e) => handleSend(e, 'seller')} style={{ padding: '10px 14px', borderTop: '1px solid #F0F0F0', backgroundColor: '#FFF', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input 
                type="text" placeholder="Balas pesan sebagai penjual..." value={inputMessage} onChange={(e) => setInputMessage(e.target.value)}
                style={{ flex: 1, padding: '8px 14px', borderRadius: '20px', border: '1px solid #E5E5E5', outline: 'none', fontSize: '12px' }}
              />
              <button type="submit" style={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#FFF' }}>
                <Send size={14} />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}