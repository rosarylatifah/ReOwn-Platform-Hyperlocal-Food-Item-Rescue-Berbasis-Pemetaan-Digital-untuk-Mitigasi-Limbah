"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productStocks, setProductStocks] = useState({}); // Menyimpan sisa stok real-time per produk

  // Load data dari localStorage saat aplikasi pertama kali dibuka
  useEffect(() => {
    const savedCart = localStorage.getItem('reown_cart');
    const savedOrders = localStorage.getItem('reown_orders');
    const savedStocks = localStorage.getItem('reown_product_stocks');

    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) { console.error(e); }
    }
    if (savedOrders) {
      try { setOrders(JSON.parse(savedOrders)); } catch (e) { console.error(e); }
    }
    if (savedStocks) {
      try { setProductStocks(JSON.parse(savedStocks)); } catch (e) { console.error(e); }
    }
  }, []);

  // Helper Simpan Keranjang
  const saveCartToStorage = (newCart) => {
    setCart(newCart);
    localStorage.setItem('reown_cart', JSON.stringify(newCart));
  };

  // Helper Simpan Pesanan
  const saveOrdersToStorage = (newOrders) => {
    setOrders(newOrders);
    localStorage.setItem('reown_orders', JSON.stringify(newOrders));
  };

  // Helper Simpan Stok Produk
  const saveStocksToStorage = (newStocks) => {
    setProductStocks(newStocks);
    localStorage.setItem('reown_product_stocks', JSON.stringify(newStocks));
  };

  // Mendapatkan sisa stok terkini suatu produk (default ke stok awal jika belum tercatat)
  const getProductStock = (product) => {
    const productId = String(product.id);
    if (productStocks[productId] !== undefined) {
      return productStocks[productId];
    }
    return product.stock || 5; // Default stok awal misal 5 porsi
  };

  // Fungsi Tambah Produk ke Keranjang (Membatasi agar tidak melebihi sisa stok riil toko)
  const addToCart = (product, quantity = 1) => {
    const currentStock = getProductStock(product);
    const cartItem = cart.find((i) => String(i.id) === String(product.id));
    const currentQtyInCart = cartItem ? cartItem.quantity : 0;

    // Validasi standar profesional: total di keranjang + qty baru tidak boleh > sisa stok toko
    if (currentQtyInCart + quantity > currentStock) {
      alert(`Maaf, sisa stok toko ini tidak mencukupi! Stok tersedia: ${currentStock}`);
      return false;
    }

    let updatedCart = [...cart];
    const existingIndex = updatedCart.findIndex((item) => String(item.id) === String(product.id));
    
    if (existingIndex > -1) {
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity: updatedCart[existingIndex].quantity + quantity
      };
    } else {
      const newItem = {
        ...product,
        id: product.id || Date.now(),
        quantity: quantity,
        deliveryOption: product.deliveryOption || 'Ambil di Tempat',
        price: product.price || product.totalPrice,
        totalPrice: product.totalPrice || product.price
      };
      updatedCart = [newItem, ...updatedCart];
    }
    
    saveCartToStorage(updatedCart);
    return true;
  };

  // Cek jumlah produk di keranjang
  const getItemQuantityInCart = (productId) => {
    const item = cart.find((i) => String(i.id) === String(productId));
    return item ? item.quantity : 0;
  };

  // Fungsi Ubah Opsi Pengantaran
  const updateDeliveryOption = (id, option) => {
    const updated = cart.map(item => 
      String(item.id) === String(id) ? { ...item, deliveryOption: option } : item
    );
    saveCartToStorage(updated);
  };

  // Fungsi Hapus Item dari Keranjang
  const removeFromCart = (id) => {
    const updated = cart.filter(item => String(item.id) !== String(id));
    saveCartToStorage(updated);
  };

  // FUNGSI CHECKOUT / KIRIM PERMINTAAN (STOK TOKO RESMI TERPOTONG DI SINI)
  const sendRequest = (item, onSendRequestCallback) => {
    if (window.confirm(`Kirim permintaan rescue untuk "${item.name}" dengan opsi "${item.deliveryOption}"?`)) {
      
      // 1. Kurangi stok produk secara permanen di sistem toko
      const productId = String(item.id);
      const currentStock = getProductStock(item);
      const newStock = Math.max(0, currentStock - (item.quantity || 1));
      
      const updatedStocks = { ...productStocks, [productId]: newStock };
      saveStocksToStorage(updatedStocks);

      // 2. Hapus dari keranjang pembeli
      removeFromCart(item.id);
      
      // 3. Buat objek pesanan baru (Masuk ke status Menunggu Konfirmasi / Dalam Proses)
      const newOrder = {
        id: `REQ-${Date.now().toString().slice(-6)}`,
        productId: item.id,
        productName: item.name,
        image: item.image,
        quantity: item.quantity || 1,
        totalPrice: item.totalPrice || item.price,
        deliveryOption: item.deliveryOption,
        storeName: item.store || item.merchant || "Toko Rescue Batam",
        buyerName: "Zara (Pembeli)",
        status: 'Menunggu Konfirmasi',
        statusType: 'warning',
        createdAt: new Date().toLocaleString('id-ID', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      // 4. Simpan ke daftar pesanan global
      const updatedOrders = [newOrder, ...orders];
      saveOrdersToStorage(updatedOrders);

      if (onSendRequestCallback) {
        onSendRequestCallback(newOrder);
      }
      alert(`Permintaan rescue untuk ${item.name} BERHASIL dikirim dan stok toko telah diperbarui!`);
    }
  };

  // Total item untuk badge navbar
  const totalCartItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{
      cart,
      orders,
      addToCart,
      updateDeliveryOption,
      removeFromCart,
      sendRequest,
      totalCartItems,
      getItemQuantityInCart,
      getProductStock // <--- Di-export agar halaman produk/beranda bisa nampilkeun sisa stok real-time
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);