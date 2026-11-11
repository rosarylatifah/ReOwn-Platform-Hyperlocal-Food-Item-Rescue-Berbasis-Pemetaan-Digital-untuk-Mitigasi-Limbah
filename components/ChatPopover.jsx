"use client";

import React, { useState, useRef, useEffect } from 'react';
import { X, Search, ArrowLeft, Send, Image as ImageIcon, MapPin, Paperclip, MessageSquare } from 'lucide-react';
import { useChat } from '@/lib/chatStore';

export default function ChatPopover({ isOpen, onClose, externalActiveChatId, onClearActiveChat }) {
  const { chats, allMessages, sendMessage, unreadChatCount, markRead, role, pendingChatId, clearPending } = useChat();

  const [internalActiveChatId, setInternalActiveChatId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // "all" atau "unread"
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);

  const isSeller = role === 'seller';

  // Chat aktif bisa dipicu dari luar atau dari klik daftar
  const activeChatId = pendingChatId || externalActiveChatId || internalActiveChatId;
  const messages = activeChatId ? allMessages[activeChatId] || [] : [];

  // Mencegah background scroll saat popover terbuka
  useEffect(() => {
    if (!isOpen) return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  // Tandai dibaca saat room chat terbuka / ada pesan baru masuk
  useEffect(() => {
    if (isOpen && activeChatId && markRead) markRead(activeChatId);
  }, [isOpen, activeChatId, messages.length, markRead]);

  // Scroll otomatis ke pesan terbaru
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length, activeChatId, isOpen]);

  if (!isOpen) return null;

  const currentChat = chats.find((c) => c.id === activeChatId);

  // Filter pencarian & tab
  const filteredChats = chats.filter((c) => {
    const displayName = c.storeName || c.title || '';
    const matchesSearch = displayName.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'unread') return matchesSearch && c.unread;
    return matchesSearch;
  });

  const handleClose = () => {
    if (clearPending) clearPending();
    setInternalActiveChatId(null);
    setShowAttachmentMenu(false);
    onClose();
  };

  const goBack = () => {
    setInternalActiveChatId(null);
    if (clearPending) clearPending();
    if (onClearActiveChat) onClearActiveChat();
  };

  const handleSend = (e, customText = null) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || !activeChatId) return;

    sendMessage(activeChatId, textToSend);
    setInputMessage('');
    setShowAttachmentMenu(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) handleSend(null, `[Lampiran Gambar: ${file.name}]`);
    e.target.value = '';
  };

  const handleSendLocation = () => {
    handleSend(null, '📍 [Berbagi Lokasi Penjemputan: Batam Centre]');
  };

  const circleBtn = { border: 'none', backgroundColor: '#F5F5F5', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666' };
  const menuItem = { display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px', color: '#1A1A1A', textAlign: 'left' };
  const tabBtn = (active) => ({
    padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
    border: active ? '1px solid #D95A36' : '1px solid #E5E5E5',
    backgroundColor: active ? '#FFF3ED' : '#FFF',
    color: active ? '#D95A36' : '#666'
  });

  return (
    <>
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 998, backgroundColor: 'rgba(0, 0, 0, 0.25)',
          backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)'
        }}
      />

      <div
        style={{
          position: 'fixed', top: '80px', right: '120px', width: '380px',
          height: 'min(500px, calc(100dvh - 100px))',
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
              right: 12px !important;
            }
          }
          @media (max-width: 480px) {
            .reown-chat-popover {
              left: 12px !important;
              right: 12px !important;
              width: auto !important;
            }
          }
        `}</style>

        {!activeChatId ? (
          <>
            {/* HEADER DAFTAR CHAT */}
            <div style={{ padding: '18px 20px 12px 20px', borderBottom: '1px solid #F0F0F0', backgroundColor: '#FFF', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: '#1A1A1A', margin: 0 }}>
                    {isSeller ? 'Pesan Masuk' : 'Pesan'}
                  </h3>
                  {unreadChatCount > 0 && (
                    <span style={{ backgroundColor: '#D95A36', color: '#FFF', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px' }}>
                      {unreadChatCount} Baru
                    </span>
                  )}
                </div>
                <button onClick={handleClose} style={circleBtn}>
                  <X size={16} />
                </button>
              </div>

              {/* Tab filter */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <button onClick={() => setActiveTab('all')} style={tabBtn(activeTab === 'all')}>
                  Semua ({chats.length})
                </button>
                <button onClick={() => setActiveTab('unread')} style={tabBtn(activeTab === 'unread')}>
                  Belum Dibaca ({unreadChatCount})
                </button>
              </div>

              {/* Pencarian */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#F5F5F5', borderRadius: '20px', padding: '8px 14px' }}>
                <Search size={15} color="#888" />
                <input
                  type="text"
                  placeholder={isSeller ? 'Cari nama pembeli...' : 'Cari percakapan...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '12px', width: '100%' }}
                />
              </div>
            </div>

            {/* DAFTAR CHAT */}
            <div style={{
              flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column',
              justifyContent: filteredChats.length === 0 ? 'center' : 'flex-start',
              alignItems: filteredChats.length === 0 ? 'center' : 'stretch',
              padding: filteredChats.length === 0 ? '20px' : 0, textAlign: 'center'
            }}>
              {filteredChats.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={42} color="#E5E7EB" style={{ marginBottom: '12px' }} />
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A1A', margin: '0 0 4px 0' }}>
                    {activeTab === 'unread' ? 'Tidak ada pesan baru' : 'Belum ada pesan'}
                  </p>
                  <p style={{ fontSize: '11px', color: '#666', margin: 0, maxWidth: '240px', lineHeight: '1.4' }}>
                    {isSeller
                      ? 'Pesan dari pembeli akan muncul di sini.'
                      : 'Pesan dari penjual atau riwayat chat kamu akan muncul di sini.'}
                  </p>
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => {
                      setInternalActiveChatId(chat.id);
                      if (markRead) markRead(chat.id);
                    }}
                    style={{
                      width: '100%', boxSizing: 'border-box', padding: '12px 20px',
                      display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
                      backgroundColor: chat.unread ? '#FFF8F6' : '#FFF', borderBottom: '1px solid #F8F8F8'
                    }}
                  >
                    <img src={chat.avatar || '/placeholder.png'} alt={chat.title || chat.storeName} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1, overflow: 'hidden', textAlign: 'left' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <h4 style={{ margin: 0, fontSize: '13px', fontWeight: chat.unread ? '700' : '600', color: '#1A1A1A' }}>{chat.title || chat.storeName}</h4>
                        <span style={{ fontSize: '10px', color: chat.unread ? '#D95A36' : '#999', fontWeight: chat.unread ? '600' : '400' }}>{chat.time}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', color: chat.unread ? '#1A1A1A' : '#666', fontWeight: chat.unread ? '600' : '400', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {chat.lastMessage}
                      </p>
                    </div>
                    {chat.unread && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D95A36', flexShrink: 0 }} />}
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          /* RUANG CHAT */
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF3ED', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={goBack} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#D95A36', padding: 0, display: 'flex' }}>
                  <ArrowLeft size={18} />
                </button>
                <img src={currentChat?.avatar || '/placeholder.png'} alt={currentChat?.title || 'Chat'} style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#1A1A1A' }}>{currentChat?.title || currentChat?.storeName}</h4>
                  <span style={{ fontSize: '10px', color: '#16A34A', fontWeight: '600' }}>● Online</span>
                </div>
              </div>
              <button onClick={handleClose} style={circleBtn}>
                <X size={14} />
              </button>
            </div>

            {/* BUBBLE CHAT */}
            <div style={{ flex: 1, minHeight: 0, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#FAFAFA' }}>
              {messages.length === 0 && (
                <p style={{ margin: 'auto', fontSize: '11px', color: '#999' }}>Belum ada pesan. Sapa duluan yuk 👋</p>
              )}
              {messages.map((msg) => {
                const isMine = msg.sender === role;
                return (
                  <div key={msg.id} style={{ alignSelf: isMine ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                    <div style={{
                      padding: '10px 14px', borderRadius: '14px',
                      backgroundColor: isMine ? '#D95A36' : '#FFFFFF',
                      color: isMine ? '#FFF' : '#1A1A1A',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.05)', fontSize: '12px', lineHeight: '1.4',
                      border: isMine ? 'none' : '1px solid #E5E5E5', wordBreak: 'break-word'
                    }}>
                      {msg.text}
                    </div>
                    <span style={{ fontSize: '9px', color: '#999', marginTop: '2px', display: 'block', textAlign: isMine ? 'right' : 'left' }}>
                      {msg.time}
                    </span>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* MENU LAMPIRAN */}
            {showAttachmentMenu && (
              <div style={{ position: 'absolute', left: '14px', bottom: '58px', backgroundColor: '#FFF', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.15)', border: '1px solid #F0F0F0', overflow: 'hidden', zIndex: 2 }}>
                <button type="button" style={menuItem} onClick={() => fileInputRef.current?.click()}>
                  <ImageIcon size={15} color="#D95A36" /> Gambar
                </button>
                <button type="button" style={menuItem} onClick={handleSendLocation}>
                  <MapPin size={15} color="#D95A36" /> Lokasi
                </button>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />

            {/* INPUT PESAN */}
            <form onSubmit={handleSend} style={{ padding: '10px 14px', borderTop: '1px solid #F0F0F0', backgroundColor: '#FFF', display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
              <button type="button" onClick={() => setShowAttachmentMenu((v) => !v)} style={{ border: 'none', backgroundColor: '#F5F5F5', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#D95A36' }}>
                <Paperclip size={16} />
              </button>
              <input
                type="text"
                placeholder={isSeller ? 'Balas pesan pembeli...' : 'Tulis pesan...'}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                style={{ flex: 1, minWidth: 0, padding: '8px 14px', borderRadius: '20px', border: '1px solid #E5E5E5', outline: 'none', fontSize: '12px' }}
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