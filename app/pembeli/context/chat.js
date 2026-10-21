"use client";

import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

const initialChats = [
  {
    id: 1,
    storeName: 'ReOwn Bakery Batam',
    avatar: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&auto=format&fit=crop&q=80',
    lastMessage: 'Halo Kak! Pesanan Roti Manis Box sudah siap diambil yaa di toko.',
    time: '10:42 WIB',
    unread: true,
  },
  {
    id: 2,
    storeName: 'Burger Grill Centre',
    avatar: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&auto=format&fit=crop&q=80',
    lastMessage: 'Siap Kak, nanti tinggal tunjukkan nomor pesanan pas jemput.',
    time: 'Kemarin',
    unread: false,
  },
];

// Simulasi database pesan awal per room chat ID
const initialMessages = {
  1: [
    { id: 1, sender: 'seller', text: 'Halo Kak! Pesanan Roti Manis Box sudah siap diambil yaa di toko.', time: '10:40 WIB' },
    { id: 2, sender: 'buyer', text: 'Baik Kak, saya otw ke Batam Centre sekarang ya.', time: '10:42 WIB' },
  ],
  2: [
    { id: 1, sender: 'seller', text: 'Halo Kak, ada yang bisa dibantu untuk pesanan burgernya?', time: 'Kemarin' },
    { id: 2, sender: 'buyer', text: 'Siap Kak, nanti tinggal tunjukkan nomor pesanan pas jemput.', time: 'Kemarin' },
  ]
};

export function ChatProvider({ children }) {
  const [chats, setChats] = useState(initialChats);
  const [allMessages, setAllMessages] = useState(initialMessages);

  const unreadChatCount = chats.filter((c) => c.unread).length;

  const markChatAsRead = (chatId) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, unread: false } : c))
    );
  };

  // Fungsi mengirim pesan (bisa dari buyer atau seller)
  const sendMessage = (chatId, text, senderRole = 'buyer') => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newMessage = {
      id: Date.now(),
      sender: senderRole, // 'buyer' atau 'seller'
      text: text,
      time: timeNow
    };

    // Update list pesan di room tersebut
    setAllMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage]
    }));

    // Update pesan terakhir di list preview chat
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              lastMessage: `${senderRole === 'seller' ? 'Penjual: ' : ''}${text}`,
              time: timeNow
            }
          : c
      )
    );
  };

  return (
    <ChatContext.Provider value={{ chats, allMessages, unreadChatCount, markChatAsRead, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}