"use client";

import React, { useState, useRef } from 'react';
import { MessageSquare, X, Search, ArrowLeft, Send, Image as ImageIcon, MapPin, Paperclip } from 'lucide-react';
import { useChat } from '@/app/pembeli/context/chat';

export default function ChatPopover({ isOpen, onClose }) {
  const { chats, allMessages, sendMessage, unreadChatCount } = useChat();
  const [activeChatId, setActiveChatId] = useState(null);
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
    handleSend(null, 'buyer', '📍 [Berbagi Lokasi Penjemputan: Nagoya Hill, Batam]');
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
        className="reown-chat-popover"
      >
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

            {/* DAFTAR CHAT */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  style={{
                    padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
                    backgroundColor: chat.unread ? '#FFF8F6' : '#FFF', borderBottom: '1px solid #F8F8F8'
                  }}
                >
                  <img src={chat.avatar} alt={chat.storeName} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <h4 style={{ margin: 0, fontSize: '13px', fontWeight: chat.unread ? '700' : '600', color: '#1A1A1A' }}>{chat.storeName}</h4>
                      <span style={{ fontSize: '10px', color: '#999' }}>{chat.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: chat.unread ? '#1A1A1A' : '#666', fontWeight: chat.unread ? '600' : 'normal', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D95A36' }} />}
                </div>
              ))}
            </div>
          </>
        ) : (
          /* ROOM CHAT TAMPILAN DALAM POPOVER (BERSIH & RAPI) */
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
            
            {/* HEADER ROOM CHAT (TOMBOL BALAS PENJUAL DIHAPUS, JADI LEBIH BERSIH) */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF3ED' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => setActiveChatId(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#D95A36', padding: 0, display: 'flex' }}>
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

            {/* MENU LAMPIRAN */}
            {showAttachmentMenu && (
              <div style={{
                position: 'absolute', bottom: '65px', left: '12px',
                backgroundColor: '#FFF', borderRadius: '14px', boxShadow: '0 5px 20px rgba(0,0,0,0.15)',
                padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 10, border: '1px solid #EEE'
              }}>
                <button 
                  onClick={() => fileInputRef.current.click()}
                  style={{ border: 'none', background: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '12px', cursor: 'pointer', borderRadius: '8px', color: '#333', width: '100%', textAlign: 'left' }}
                >
                  <ImageIcon size={16} color="#D95A36" /> Kirim Gambar / Foto
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />

                <button 
                  onClick={handleSendLocation}
                  style={{ border: 'none', background: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '12px', cursor: 'pointer', borderRadius: '8px', color: '#333', width: '100%', textAlign: 'left' }}
                >
                  <MapPin size={16} color="#2563EB" /> Berbagi Lokasi (Pick-up)
                </button>
              </div>
            )}

            {/* INPUT PESAN */}
            <form onSubmit={(e) => handleSend(e, 'buyer')} style={{ padding: '10px 14px', borderTop: '1px solid #F0F0F0', backgroundColor: '#FFF', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                type="button" 
                onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                style={{ 
                  border: 'none', backgroundColor: showAttachmentMenu ? '#FFF3ED' : '#F5F5F5', 
                  borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  cursor: 'pointer', color: '#D95A36', flexShrink: 0 
                }}
              >
                <Paperclip size={16} />
              </button>

              <input 
                type="text" placeholder="Tulis pesan..." value={inputMessage} onChange={(e) => setSearchQuery ? setInputMessage(e.target.value) : null}
                style={{ flex: 1, padding: '8px 14px', borderRadius: '20px', border: '1px solid #E5E5E5', outline: 'none', fontSize: '12px' }}
              />

              <button type="submit" style={{ backgroundColor: '#D95A36', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#FFF', flexShrink: '0' }}>
                <Send size={14} />
              </button>
            </form>

          </div>
        )}
      </div>
    </>
  );
}