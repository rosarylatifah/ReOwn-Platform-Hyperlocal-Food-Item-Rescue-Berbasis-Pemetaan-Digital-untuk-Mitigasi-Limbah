import { useEffect } from 'react';
import { useCart } from '@/app/pembeli/context/cart';

// Batas waktu konfirmasi otomatis (dalam milidetik)
// Misal: 24 jam = 24 * 60 * 60 * 1000 ms (bisa disesuaikan, misal 12 jam atau 2 jam untuk testing)
const AUTO_COMPLETE_LIMIT_MS = 24 * 60 * 60 * 1000;

export function useOrderCompletion() {
  const { orders, saveOrdersToStorage } = useCart();

  // 1. Logika Otomatis (Auto-Complete Timer Check)
  useEffect(() => {
    if (!orders || orders.length === 0) return;

    let isUpdated = false;
    const now = new Date().getTime();

    const updatedOrders = orders.map((order) => {
      // Hanya cek pesanan yang statusnya 'Dalam Proses'
      if (order.status === 'Dalam Proses') {
        const orderTimeSource = order.confirmDate || order.createdAt || order.orderDate;
        const orderTimestamp = new Date(orderTimeSource).getTime();

        // Jika waktu pesanan valid dan sudah melewati batas waktu 24 jam
        if (!isNaN(orderTimestamp) && (now - orderTimestamp >= AUTO_COMPLETE_LIMIT_MS)) {
          isUpdated = true;
          return {
            ...order,
            status: 'Selesai',
            statusType: 'success',
            completedAt: new Date().toLocaleString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            isAutoCompleted: true // Marker bahwa ini diselesaikan otomatis oleh sistem
          };
        }
      }
      return order;
    });

    // Jika ada pesanan yang otomatis selesai, update ke storage
    if (isUpdated && saveOrdersToStorage) {
      saveOrdersToStorage(updatedOrders);
    }
  }, [orders, saveOrdersToStorage]);

  // 2. Logika Manual (Klik Tombol "Pesanan Diterima")
  const handleConfirmCompletion = (orderId, productName) => {
    if (window.confirm(`Konfirmasi bahwa kamu telah menerima pesanan "${productName}"?`)) {
      const updatedOrders = orders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'Selesai',
            statusType: 'success',
            completedAt: new Date().toLocaleString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          };
        }
        return order;
      });

      if (saveOrdersToStorage) {
        saveOrdersToStorage(updatedOrders);
      } else {
        localStorage.setItem('reown_orders', JSON.stringify(updatedOrders));
        window.location.reload(); // Refresh ringan jika belum di-bind context
      }

      alert(`Terima kasih! Pesanan ${productName} telah diselesaikan.`);
    }
  };

  return {
    handleConfirmCompletion
  };
}