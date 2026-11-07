"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext(null);

const CHAT_STORAGE_KEY = 'reown:chats:v1';
const MESSAGES_STORAGE_KEY = 'reown:messages:v1';

export function ChatProvider({ children }) {
  const [chats, setChats] = useState([]);
  const [allMessages, setAllMessages] = useState({});
  const [currentUserName, setCurrentUserName] = useState('Pembeli');

  // Load data dari localStorage saat pertama kali dirender
  useEffect(() => {
    try {
      const savedChats = localStorage.getItem(CHAT_STORAGE_KEY);
      const savedMsgs = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (savedChats) setChats(JSON.parse(savedChats));
      if (savedMsgs) setAllMessages(JSON.parse(savedMsgs));

      // Tarik nama user yang sedang login dari localStorage (sesuaikan key-nya jika perlu, misal 'user' atau 'account')
      const activeUser = localStorage.getItem('user');
      if (activeUser) {
        const parsedUser = JSON.parse(activeUser);
        if (parsedUser.name) {
          setCurrentUserName(parsedUser.name);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Simpan otomatis ke localStorage setiap ada perubahan
  const saveToStorage = (newChats, newMsgs) => {
    setChats(newChats);
    setAllMessages(newMsgs);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(newChats));
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(newMsgs));
  };

  const sendMessage = (chatId, text, sender = 'buyer') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage = { 
      id: Date.now(), 
      text, 
      sender, 
      senderName: sender === 'buyer' ? currentUserName : 'Penjual',
      time 
    };

    const updatedMsgs = {
      ...allMessages,
      [chatId]: [...(allMessages[chatId] || []), newMessage]
    };

    const updatedChats = chats.map(c => {
      if (c.id === chatId) {
        return { ...c, lastMessage: text, time, unread: sender === 'seller' };
      }
      return c;
    });

    saveToStorage(updatedChats, updatedMsgs);
  };

  // Fungsi khusus untuk menandai chat sudah dibaca
  const markChatAsRead = (chatId) => {
    const updatedChats = chats.map(c => {
      if (c.id === chatId) {
        return { ...c, unread: false };
      }
      return c;
    });
    saveToStorage(updatedChats, allMessages);
  };

  // Fungsi khusus untuk membuka/membuat room chat baru saat tombol "Hubungi Penjual" diklik
  const openOrCreateChat = (storeInfo) => {
    const chatId = `store_${storeInfo.id || Date.now()}`;
    const existingChat = chats.find(c => c.id === chatId);

    if (!existingChat) {
      const newChatObj = {
        id: chatId,
        storeName: storeInfo.storeName || storeInfo.store || 'Toko Penjual',
        avatar: storeInfo.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        lastMessage: 'Halo, apakah produk ini masih tersedia?',
        time: 'Baru saja',
        unread: false,
        buyerName: currentUserName // Nama otomatis ketarik dari akun login
      };
      const newChats = [newChatObj, ...chats];
      
      const initialMsgs = {
        ...allMessages,
        [chatId]: [
          { id: Date.now(), text: 'Halo, apakah produk ini masih tersedia?', sender: 'buyer', senderName: currentUserName, time: 'Baru saja' }
        ]
      };
      saveToStorage(newChats, initialMsgs);
    }

    return chatId;
  };

  const unreadChatCount = chats.filter(c => c.unread).length;

  return (
    <ChatContext.Provider value={{ chats, allMessages, sendMessage, openOrCreateChat, unreadChatCount, markChatAsRead, currentUserName }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat harus di dalam ChatProvider");
  return context;
}