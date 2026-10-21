"use client";

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, MapPin, Tag, CheckCheck, Bell } from 'lucide-react';

const NotificationContext = createContext();

// Data awal notifikasi dengan parameter link dinamis
const initialNotifications = [
  {
    id: 1,
    type: 'order',
    title: 'Pesanan Dikonfirmasi Penjual! 🍔',
    message: 'Pesanan Burger Daging Komplit telah disetujui Toko Rescue Batam dan sedang diproses.',
    time: '5 menit lalu',
    unread: true,
    icon: ShoppingBag,
    color: '#D95A36',
    bgColor: '#FFF3ED',
    // Lempar ke halaman pesanan & langsung filter ke tab 'proses'
    link: '/pembeli/pesanan?tab=proses',
    orderId: 'ORD-101'
  },
  {
    id: 2,
    type: 'promo_store',
    title: 'Promo Flash Rescue dari Baker\'s King! 🔥',
    message: 'Diskon 50% untuk semua aneka Roti & Pastry di Baker\'s King Nagoya tinggal 1 jam lagi!',
    time: '30 menit lalu',
    unread: true,
    icon: Tag,
    color: '#E11D48',
    bgColor: '#FFE4E6',
    // Lempar langsung ke Halaman Toko Spesifik yang kasih promo!
    link: '/pembeli/toko/bakers-king-nagoya',
    storeId: 'STORE-002'
  },
  {
    id: 3,
    type: 'location',
    title: 'Pengingat Batas Waktu Rescue 📍',
    message: 'Batas waktu pengumpulan Salad Buah Segar tinggal 1 jam lagi di Batam Center.',
    time: '1 jam lalu',
    unread: false,
    icon: MapPin,
    color: '#2563EB',
    bgColor: '#EFF6FF',
    link: '/pembeli/pesanan?tab=proses'
  },
  {
    id: 4,
    type: 'order_complete',
    title: 'Pesanan Selesai ✨',
    message: 'Transaksi selesai! Terima kasih telah mengurangi sampah makanan hari ini.',
    time: '1 hari lalu',
    unread: false,
    icon: CheckCheck,
    color: '#16A34A',
    bgColor: '#DCFCE7',
    link: '/pembeli/pesanan?tab=selesai'
  },
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const router = useRouter();

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Fungsi Tambah Notif Otomatis (Akan dipanggil saat Penjual/Admin Mengonfirmasi)
  const addNotification = (newNotif) => {
    const item = {
      id: Date.now(),
      type: newNotif.type || 'order',
      title: newNotif.title || 'Notifikasi Baru',
      message: newNotif.message || '',
      time: 'Baru saja',
      unread: true,
      icon: newNotif.icon || Bell,
      color: newNotif.color || '#D95A36',
      bgColor: newNotif.bgColor || '#FFF3ED',
      link: newNotif.link || '/pembeli/pesanan'
    };
    setNotifications((prev) => [item, ...prev]);
  };

  // Handler Klik Notifikasi
  const handleNotificationClick = (id, link, onClosePopover) => {
    // 1. Set status dibaca
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );

    // 2. Tutup Popover
    if (onClosePopover) onClosePopover();

    // 3. Navigasi Tepat Sasaran
    if (link) {
      router.push(link);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllAsRead,
        addNotification,
        handleNotificationClick
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification harus digunakan di dalam NotificationProvider');
  }
  return context;
}