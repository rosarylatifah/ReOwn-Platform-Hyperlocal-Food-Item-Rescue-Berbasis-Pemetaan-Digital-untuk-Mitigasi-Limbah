"use client";

import { useChat } from '@/app/pembeli/context/chat';

export function useOrderDetail(order, onClose, onCancelOrder) {
  const { requestOpenChat } = useChat();

  if (!order) return null;

  // Cek status pesanan
  const currentStatus = order.status || 'Menunggu Konfirmasi';
  const isCancelable = currentStatus === 'Menunggu Konfirmasi';

  // Data asli dari pesanan
  const buyerName = order.buyerName || "";
  const sellerName = order.sellerName || order.storeName || order.store || "";
  const sellerAddress = order.sellerAddress || order.location || "";
  const productName = order.productName || order.name || "";
  const totalPrice = order.totalPrice || order.price || "Rp 0";
  const deliveryOption = order.deliveryOption || "";
  const productImage = order.image || order.img || "";
  const description = order.description || "";

  // Format tanggal aman
  const formatDate = (dateInput) => {
    const now = () =>
      new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) +
      `, ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')}`;

    if (!dateInput) return now();

    if (typeof dateInput === 'string') {
      if (!dateInput.match(/\d{4}/)) {
        const currentYear = new Date().getFullYear();
        return dateInput.includes(',')
          ? dateInput.replace(',', ` ${currentYear},`)
          : `${dateInput} ${currentYear}`;
      }
      return dateInput;
    }

    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return now();

    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) +
      `, ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')}`;
  };

  const orderDate = formatDate(order.createdAt || order.orderDate);
  const confirmDate = formatDate(order.confirmDate);

  // Hubungi Penjual: buat/buka chat toko ini, popover chat terbuka otomatis lewat BuyerNavbar
  const handleContactSeller = () => {
    requestOpenChat({
      storeId: order.storeId ?? order.sellerId ?? sellerName,
      storeName: sellerName,
      buyerName: buyerName || undefined,
    });
    onClose();
  };

  // Batalkan pesanan
  const handleCancel = () => {
    if (window.confirm(`Yakin ingin membatalkan pesanan ${productName}?`)) {
      if (onCancelOrder) onCancelOrder(order.id);
      onClose();
    }
  };

  return {
    currentStatus,
    isCancelable,
    buyerName,
    sellerName,
    sellerAddress,
    productName,
    orderDate,
    confirmDate,
    totalPrice,
    deliveryOption,
    productImage,
    description,
    handleContactSeller,
    handleCancel
  };
}