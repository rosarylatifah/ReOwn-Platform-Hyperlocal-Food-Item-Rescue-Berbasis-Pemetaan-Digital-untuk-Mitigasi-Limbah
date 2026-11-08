"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Store, ShieldAlert, AlertTriangle, CheckCircle, Clock, Tag } from 'lucide-react';

const NotificationContext = createContext(null);
const NOTIF_STORAGE_KEY = 'reown:notifications:v5'; // Update versi key biar fresh

const iconMap = {
  Package: Package,
  Store: Store,
  ShieldAlert: ShieldAlert,
  AlertTriangle: AlertTriangle,
  CheckCircle: CheckCircle,
  Clock: Clock,
  Tag: Tag,
};

export function NotificationProvider({ children }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(NOTIF_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const hydrated = (Array.isArray(parsed) ? parsed : []).map(n => ({
          ...n,
          icon: iconMap[n.iconName] || Store
        }));
        setNotifications(hydrated);
      } else {
        setNotifications([]);
      }
    } catch (e) {
      console.error(e);
      setNotifications([]);
    }
  }, []);

    useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== NOTIF_STORAGE_KEY) return;
      try {
        const parsed = e.newValue ? JSON.parse(e.newValue) : [];
        setNotifications(
          (Array.isArray(parsed) ? parsed : []).map((n) => ({
            ...n,
            icon: iconMap[n.iconName] || Store,
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // 🛠️ PERBAIKAN: Gunakan callback updater (prev) agar data tidak saling tumpang tindih
  const saveNotifications = (updater) => {
    setNotifications((prev) => {
      const newNotifs = typeof updater === 'function' ? updater(prev) : updater;
      const serializable = newNotifs.map(({ icon, ...rest }) => rest);
      localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(serializable));
      return newNotifs;
    });
  };

  const markAllAsRead = () => {
    saveNotifications((prev) => prev.map(n => ({ ...n, unread: false })));
  };

  const markAllAsReadByRole = (role) => {
    saveNotifications((prev) => 
      prev.map(n => (n.role === role ? { ...n, unread: false } : n))
    );
  };

  const handleNotificationClick = (id, link, onClose) => {
    saveNotifications((prev) =>
      prev.map(n => (n.id === id ? { ...n, unread: false } : n))
    );
    if (onClose) onClose();
    if (link) router.push(link);
  };

  const addNotification = ({
    role = 'pembeli', // Pastikan nilainya 'pembeli' atau 'penjual'
    title,
    message,
    type = 'info', 
    link = '/pembeli/pesanan'
  }) => {
    const now = new Date();
    
    // 🕒 PERBAIKAN WAKTU: Ubah format ke 24 jam Indonesia + akhiran WIB (Contoh: 17.57 WIB)
    const formattedTime = now.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }).replace(/:/g, '.');

    const timeNow = `${formattedTime} WIB`;

    let iconName = 'Store';
    let icon = Store;
    let bgColor = '#FFF3ED';
    let color = '#D95A36';

    if (type === 'order') {
      iconName = 'Package';
      icon = Package;
      bgColor = '#EBF8FF';
      color = '#2563EB';
    } else if (type === 'success') {
      iconName = 'CheckCircle';
      icon = CheckCircle;
      bgColor = '#DCFCE7';
      color = '#16A34A';
    } else if (type === 'warning' || type === 'admin') {
      iconName = 'ShieldAlert';
      icon = ShieldAlert;
      bgColor = '#FEE2E2';
      color = '#DC2626';
    } else if (type === 'expired' || type === 'cancel') {
      iconName = 'Clock';
      icon = Clock;
      bgColor = '#FEF3C7';
      color = '#D97706';
    }

    const newNotif = {
      id: Date.now() + Math.random(), // Mencegah ID kembar jika dipanggil bersamaan
      role,
      title,
      message,
      time: timeNow,
      date: 'Hari Ini',
      unread: true,
      link,
      iconName,
      icon,
      bgColor,
      color
    };

    // Masukkan ke array menggunakan updater yang aman
    saveNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      markAllAsRead,
      markAllAsReadByRole,
      handleNotificationClick,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification harus di dalam NotificationProvider");
  return context;
}