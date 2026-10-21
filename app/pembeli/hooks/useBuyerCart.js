import { useState } from 'react';
import { useCart } from '@/app/pembeli/context/cart';

export function useBuyerCart(onSendRequest) {
  const { cart, updateDeliveryOption, removeFromCart, addToCart, sendRequest } = useCart();
  
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Helper format Rupiah
  const formatRupiah = (priceString) => {
    if (!priceString) return 'Rp 0';
    const num = parseInt(String(priceString).replace(/[^0-9]/g, '')) || 0;
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  // Hitung total harga per item (Harga Satuan x Quantity)
  const calculateItemTotal = (item) => {
    const unitPrice = parseInt(String(item.price || item.totalPrice || '0').replace(/[^0-9]/g, '')) || 0;
    return formatRupiah(unitPrice * (item.quantity || 1));
  };

  // Handler Pengurangan Kuantitas
  const handleDecreaseQuantity = (item) => {
    if ((item.quantity || 1) > 1) {
      addToCart(item, -1);
    } else {
      removeFromCart(item.id);
    }
  };

  // Handler Penambahan Kuantitas
  const handleIncreaseQuantity = (item) => {
    addToCart(item, 1);
  };

  // Handler Kirim Permintaan
  const handleSendRequest = (item) => {
    sendRequest(item, onSendRequest);
  };

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
    handleSendRequest
  };
}