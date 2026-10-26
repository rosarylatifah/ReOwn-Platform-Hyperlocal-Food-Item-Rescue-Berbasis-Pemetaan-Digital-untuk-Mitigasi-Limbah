// "use client";

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

  // Mendapatkan sisa stok terkini suatu produk
  const getProductStock = (product) => {
    const productId = String(product.id);
    if (productStocks[productId] !== undefined) {
      return productStocks[productId];
    }
    return product.stock || 5; 
  };

  // Fungsi Tambah Produk ke Keranjang
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

  const getItemQuantityInCart = (productId) => {
    const item = cart.find((i) => String(i.id) === String(productId));
    return item ? item.quantity : 0;
  };

  const updateDeliveryOption = (id, option) => {
    const updated = cart.map(item => 
      String(item.id) === String(id) ? { ...item, deliveryOption: option } : item
    );
    saveCartToStorage(updated);
  };

  const removeFromCart = (id) => {
    const updated = cart.filter(item => String(item.id) !== String(id));
    saveCartToStorage(updated);
  };

  // FUNGSI CHECKOUT / KIRIM PERMINTAAN
  const sendRequest = (item, onSendRequestCallback) => {
    if (window.confirm(`Kirim permintaan rescue untuk "${item.name}" dengan opsi "${item.deliveryOption}"?`)) {
      
      const productId = String(item.id);
      const currentStock = getProductStock(item);
      const newStock = Math.max(0, currentStock - (item.quantity || 1));
      
      const updatedStocks = { ...productStocks, [productId]: newStock };
      saveStocksToStorage(updatedStocks);

      removeFromCart(item.id);
      
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

      const updatedOrders = [newOrder, ...orders];
      saveOrdersToStorage(updatedOrders);

      if (onSendRequestCallback) {
        onSendRequestCallback(newOrder);
      }
      alert(`Permintaan rescue untuk ${item.name} BERHASIL dikirim dan stok toko telah diperbarui!`);
    }
  };

  // ==========================================
  // FUNGSI BARU: BATALKAN PESANAN
  // ==========================================
  const cancelOrder = (orderId) => {
    const orderToCancel = orders.find(o => String(o.id) === String(orderId));
    if (!orderToCancel) return;

    // 1. Kembalikan stok toko
    if (orderToCancel.productId) {
      const pId = String(orderToCancel.productId);
      const currentStock = productStocks[pId] !== undefined ? productStocks[pId] : 5;
      const restoredStock = currentStock + (orderToCancel.quantity || 1);
      const updatedStocks = { ...productStocks, [pId]: restoredStock };
      saveStocksToStorage(updatedStocks);
    }

    // 2. Simpan ke Riwayat Pesanan (localStorage khusus riwayat)
    const savedHistory = localStorage.getItem('reown_order_history');
    const currentHistory = savedHistory ? JSON.parse(savedHistory) : [];
    const canceledOrderEntry = {
      ...orderToCancel,
      status: 'Dibatalkan',
      canceledAt: new Date().toLocaleString('id-ID')
    };
    localStorage.setItem('reown_order_history', JSON.stringify([canceledOrderEntry, ...currentHistory]));

    // 3. Hapus dari daftar pesanan aktif
    const updatedOrders = orders.filter(o => String(o.id) !== String(orderId));
    saveOrdersToStorage(updatedOrders);

    alert(`Pesanan ${orderToCancel.productName || 'produk'} berhasil dibatalkan dan dipindahkan ke Riwayat Pesanan!`);
  };

  const totalCartItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{
      cart,
      orders,
      addToCart,
      updateDeliveryOption,
      removeFromCart,
      sendRequest,
      cancelOrder, // 👈 Jangan lupa di-export di sini agar terbaca di halaman pesanan!
      totalCartItems,
      getItemQuantityInCart,
      getProductStock
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);