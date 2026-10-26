// app/pembeli/context/notification.js
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Tag, Store } from 'lucide-react';

const NotificationContext = createContext(null);
const NOTIF_STORAGE_KEY = 'reown:notifications:v1';

export function NotificationProvider({ children }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(NOTIF_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setNotifications(Array.isArray(parsed) ? parsed : []);
      } else {
        setNotifications([]); // Kosong default sesuai permintaan
      }
    } catch (e) {
      console.error(e);
      setNotifications([]);
    }
  }, []);

  const saveNotifications = (newNotifs) => {
    setNotifications(newNotifs);
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(newNotifs));
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, unread: false }));
    saveNotifications(updated);
  };

  const handleNotificationClick = (id, link, onClose) => {
    const updated = notifications.map(n => n.id === id ? { ...n, unread: false } : n);
    saveNotifications(updated);
    if (onClose) onClose();
    if (link) router.push(link);
  };

  const addNotification = (title, message, type = 'info', link = '/pembeli/produk') => {
    const now = new Date();
    const timeNow = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Format tanggal sederhana, misal: "Hari ini, 25 Okt 2026" atau tangal real
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const dateNow = now.toLocaleDateString('id-ID', options);

    let icon = Store;
    let bgColor = '#FFF3ED';
    let color = '#D95A36';

    if (type === 'order') {
      icon = Package;
      bgColor = '#EBF8FF';
      color = '#2563EB';
    } else if (type === 'promo') {
      icon = Tag;
      bgColor = '#FEF3C7';
      color = '#D97706';
    }

    const newNotif = {
      id: Date.now(),
      title,
      message,
      time: timeNow,
      date: dateNow, // Tanggal untuk dikelompokkan di card
      unread: true,
      link,
      icon,
      bgColor,
      color
    };

    saveNotifications([newNotif, ...notifications]);
  };

  // Hitung jumlah yang benar-benar belum dibaca
  const unreadCount = notifications.filter(n => n.unread === true).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, handleNotificationClick, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification harus di dalam NotificationProvider");
  return context;
}