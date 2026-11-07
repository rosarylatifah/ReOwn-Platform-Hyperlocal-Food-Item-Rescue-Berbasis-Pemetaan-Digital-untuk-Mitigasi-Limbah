"use client";

import React, { useState, useEffect } from 'react';
import { X, Search, ArrowLeft, Send, Paperclip } from 'lucide-react';
import { useChat } from '@/app/pembeli/context/chat';
import ChatList from '@/components/ChatList'; // 👈 Menggunakan komponen ChatList yang sudah dipisah

export default function ChatPopover({ isOpen, onClose, externalActiveChatId, onClearActiveChat }) {
  const { chats, allMessages, sendMessage, unreadChatCount, markChatAsRead, currentUserName } = useChat();
  const [internalActiveChatId, setInternalActiveChatId] = useState(null);
  
  const [activeTab, setActiveTab] = useState('all');
  const activeChatId = externalActiveChatId || internalActiveChatId;

  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentChat = chats.find((c) => c.id === activeChatId);
  const messages = activeChatId ? allMessages[activeChatId] || [] : [];

  const filteredChats = chats.filter((c) => {
    const storeDisplayName = c.storeName || '';
    const matchesSearch = storeDisplayName.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'unread') {
      return matchesSearch && c.unread;
    }
    return matchesSearch;
  });

  const handleSend = (e, role = 'buyer') => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !activeChatId) return;

    sendMessage(activeChatId, inputMessage, role, currentUserName);
    setInputMessage('');
  };

  const handleSelectChat = (chatId) => {
    setInternalActiveChatId(chatId);
    if (markChatAsRead) {
      markChatAsRead(chatId);
    }
  };

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
          position: 'fixed', top: '80px', right: '24px', width: '380px', height: '520px',
          maxWidth: 'calc(100vw - 24px)', boxSizing: 'border-box',
          backgroundColor: '#FFFFFF', borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(217, 90, 54, 0.08)',
          border: '1px solid rgba(217, 90, 54, 0.12)', zIndex: 999,
          display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'Inter, sans-serif'
        }}
        className="reown-chat-popover"
      >
        <style jsx global>{`
          @media (max-width: 640px) {
            .reown-chat-popover {
              top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
              width: 100vw !important; height: 100vh !important; max-height: 100vh !important; border-radius: 0 !important;
            }
          }
        `}</style>

        {!activeChatId ? (
          <>
            <div style={{ padding: '18px 20px 12px 20px', borderBottom: '1px solid #F0F0F0', backgroundColor: '#FFF', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
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

              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <button
                  onClick={() => setActiveTab('all')}
                  style={{
                    padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                    border: activeTab === 'all' ? '1px solid #D95A36' : '1px solid #E5E5E5',
                    backgroundColor: activeTab === 'all' ? '#FFF3ED' : '#FFF',
                    color: activeTab === 'all' ? '#D95A36' : '#666'
                  }}
                >
                  Semua ({chats.length})
                </button>
                <button
                  onClick={() => setActiveTab('unread')}
                  style={{
                    padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                    border: activeTab === 'unread' ? '1px solid #D95A36' : '1px solid #E5E5E5',
                    backgroundColor: activeTab === 'unread' ? '#FFF3ED' : '#FFF',
                    color: activeTab === 'unread' ? '#D95A36' : '#666'
                  }}
                >
                  Belum Dibaca ({unreadChatCount})
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#F5F5F5', borderRadius: '20px', padding: '8px 14px' }}>
                <Search size={15} color="#888" />
                <input 
                  type="text" placeholder="Cari percakapan toko..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '12px', width: '100%' }}
                />
              </div>
            </div>

            {/* RENDER LIST CHAT MENGGUNAKAN KOMPONEN TERPISAH */}
            <ChatList 
              filteredChats={filteredChats} 
              activeTab={activeTab} 
              onSelectChat={handleSelectChat} 
            />
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF3ED', flexShrink: 0 }}>
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

            <div style={{ flex: 1, minHeight: 0, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#FAFAFA' }}>
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

            <form onSubmit={(e) => handleSend(e, 'buyer')} style={{ padding: '10px 14px', borderTop: '1px solid #F0F0F0', backgroundColor: '#FFF', display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
              <button type="button" style={{ border: 'none', backgroundColor: '#F5F5F5', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#D95A36' }}>
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