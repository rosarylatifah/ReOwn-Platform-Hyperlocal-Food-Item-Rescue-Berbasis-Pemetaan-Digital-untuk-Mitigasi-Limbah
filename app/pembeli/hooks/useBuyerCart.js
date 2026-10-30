import { useState } from 'react';
import { useCart } from '@/app/pembeli/context/cart';

export function useBuyerCart(onSendRequest) {
  const { cart, updateDeliveryOption, removeFromCart, addToCart, sendRequest, sendRequests } = useCart();

  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Helper format Rupiah
  const formatRupiah = (priceString) => {
    if (!priceString) return 'Rp 0';
    const num = parseInt(String(priceString).replace(/[^0-9]/g, '')) || 0;
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  // Total harga per item (harga satuan x quantity)
  const calculateItemTotal = (item) => {
    const unitPrice = parseInt(String(item.price || item.totalPrice || '0').replace(/[^0-9]/g, '')) || 0;
    return formatRupiah(unitPrice * (item.quantity || 1));
  };

  const handleDecreaseQuantity = (item) => {
    if ((item.quantity || 1) > 1) {
      addToCart(item, -1);
    } else {
      removeFromCart(item.id);
    }
  };

  const handleIncreaseQuantity = (item) => {
    addToCart(item, 1);
  };

  // Kirim satu item
  const handleSendRequest = (item) => {
    sendRequest(item, onSendRequest);
  };

  // Kirim banyak item sekaligus (true jika terkirim)
  const handleSendSelected = (items) => sendRequests(items, onSendRequest);

  return {
    cart,
    hoveredCard,
    setHoveredCard,
    hoveredBtn,
    setHoveredBtn,
    selectedOrder,
    setSelectedOrder,
    updateDeliveryOption,
    removeFromCart,
    calculateItemTotal,
    handleDecreaseQuantity,
    handleIncreaseQuantity,
    handleSendRequest,
    handleSendSelected,
  };
}