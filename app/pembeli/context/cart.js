"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useOrders } from '@/lib/ordersStore';
import { useProfile } from '@/lib/ProfileContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { orders, setOrders, addOrder, cancelOrder: cancelOrderInStore, productStocks, setProductStocks } = useOrders();
  const { profile } = useProfile();

  // Keranjang tetap lokal milik pembeli
  useEffect(() => {
    const savedCart = localStorage.getItem('reown_cart');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) { console.error(e); }
    }
  }, []);

  const saveCartToStorage = (newCart) => {
    setCart(newCart);
    localStorage.setItem('reown_cart', JSON.stringify(newCart));
  };

  const getProductStock = (product) => {
    const productId = String(product.id);
    if (productStocks[productId] !== undefined) return productStocks[productId];
    return product.stock || 5;
  };

  const addToCart = (product, quantity = 1) => {
    const currentStock = getProductStock(product);
    const cartItem = cart.find((i) => String(i.id) === String(product.id));
    const currentQtyInCart = cartItem ? cartItem.quantity : 0;

    if (currentQtyInCart + quantity > currentStock) {
      alert(`Maaf, sisa stok toko ini tidak mencukupi! Stok tersedia: ${currentStock}`);
      return false;
    }

    let updatedCart = [...cart];
    const existingIndex = updatedCart.findIndex((item) => String(item.id) === String(product.id));

    if (existingIndex > -1) {
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity: updatedCart[existingIndex].quantity + quantity,
      };
    } else {
      const newItem = {
        ...product,
        id: product.id || Date.now(),
        quantity,
        deliveryOption: product.deliveryOption || 'Ambil di Tempat',
        price: product.price || product.totalPrice,
        totalPrice: product.totalPrice || product.price,
      };
      updatedCart = [newItem, ...updatedCart];
    }

    saveCartToStorage(updatedCart);
    return true;
  };

  const getItemQuantityInCart = (productId) => {
    const item = cart.find((i) => String(i.id) === String(productId));
    return item ? item.quantity : 0;
  };

  const updateDeliveryOption = (id, option) => {
    saveCartToStorage(
      cart.map((item) => (String(item.id) === String(id) ? { ...item, deliveryOption: option } : item))
    );
  };

  const removeFromCart = (id) => {
    saveCartToStorage(cart.filter((item) => String(item.id) !== String(id)));
  };

  // Susun objek pesanan dari item keranjang
  const buildOrder = (item, seq = 0) => ({
    id: `REQ-${(Date.now() + seq).toString().slice(-6)}`,
    productId: item.id,
    productName: item.name,
    image: item.image,
    category: item.category || 'Barang',
    quantity: item.quantity || 1,
    totalPrice: item.totalPrice || item.price,
    deliveryOption: item.deliveryOption,
    pickupLocation: item.location || item.address || '',
    storeName: item.store || item.merchant || 'Toko Rescue Batam',
    buyerName: profile?.name || 'Pembeli',
    status: 'Menunggu Konfirmasi',
    statusType: 'warning',
    createdAt: new Date().toLocaleString('id-ID', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    }),
  });

  // KIRIM SATU PERMINTAAN -> masuk ke tab "Konfirmasi Pesanan" penjual
  const sendRequest = (item, onSendRequestCallback) => {
    if (!window.confirm(`Kirim permintaan rescue untuk "${item.name}" dengan opsi "${item.deliveryOption}"?`)) return;

    const productId = String(item.id);
    const newStock = Math.max(0, getProductStock(item) - (item.quantity || 1));
    setProductStocks({ ...productStocks, [productId]: newStock });

    removeFromCart(item.id);

    const newOrder = buildOrder(item);
    addOrder(newOrder);
    if (onSendRequestCallback) onSendRequestCallback(newOrder);
    alert(`Permintaan rescue untuk ${item.name} BERHASIL dikirim dan stok toko telah diperbarui!`);
  };

  // KIRIM BANYAK SEKALIGUS. Mengembalikan true jika terkirim.
  const sendRequests = (items, onSendRequestCallback) => {
    if (!items || items.length === 0) return false;
    if (!window.confirm(`Kirim ${items.length} permintaan rescue sekaligus?`)) return false;

    const stocks = { ...productStocks };
    items.forEach((item) => {
      const id = String(item.id);
      const current = stocks[id] !== undefined ? stocks[id] : item.stock || 5;
      stocks[id] = Math.max(0, current - (item.quantity || 1));
    });
    setProductStocks(stocks);

    const ids = items.map((i) => String(i.id));
    saveCartToStorage(cart.filter((i) => !ids.includes(String(i.id))));

    items.forEach((item, idx) => {
      const order = buildOrder(item, idx);
      addOrder(order);
      if (onSendRequestCallback) onSendRequestCallback(order);
    });

    alert(`${items.length} permintaan rescue berhasil dikirim!`);
    return true;
  };

  // Batalkan oleh pembeli: tetap tampil di tab "Pesanan Dibatalkan"
  const cancelOrder = (orderId) => {
    const done = cancelOrderInStore(orderId);
    if (done) alert(`Pesanan ${done.productName || 'produk'} berhasil dibatalkan.`);
  };

  const totalCartItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        saveOrdersToStorage: setOrders, // dipakai useOrderCompletion
        addToCart,
        updateDeliveryOption,
        removeFromCart,
        sendRequest,
        sendRequests,
        cancelOrder,
        totalCartItems,
        getItemQuantityInCart,
        getProductStock,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);