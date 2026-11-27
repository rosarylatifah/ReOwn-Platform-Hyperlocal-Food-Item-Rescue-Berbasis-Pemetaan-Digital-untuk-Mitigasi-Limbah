"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const KEY_ORDERS = "reown_orders";
const KEY_STOCKS = "reown_product_stocks";
const KEY_HISTORY = "reown_order_history";

const read = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [productStocks, setProductStocks] = useState({});
  const [ready, setReady] = useState(false);

  // Muat sekali saat pertama dibuka
  useEffect(() => {
    setOrders(read(KEY_ORDERS, []));
    setProductStocks(read(KEY_STOCKS, {}));
    setReady(true);
  }, []);

  // Simpan setiap ada perubahan (setelah data awal termuat)
  useEffect(() => { if (ready) write(KEY_ORDERS, orders); }, [orders, ready]);
  useEffect(() => { if (ready) write(KEY_STOCKS, productStocks); }, [productStocks, ready]);

  // Sinkron antar tab (mis. satu tab pembeli, satu tab penjual)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEY_ORDERS) setOrders(read(KEY_ORDERS, []));
      if (e.key === KEY_STOCKS) setProductStocks(read(KEY_STOCKS, {}));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addOrder = useCallback((order) => setOrders((p) => [order, ...p]), []);

  const updateOrder = useCallback(
    (id, patch) =>
      setOrders((p) => p.map((o) => (String(o.id) === String(id) ? { ...o, ...patch } : o))),
    []
  );

  // Batalkan/tolak: status jadi Dibatalkan, stok dikembalikan, salinan ke riwayat
  const cancelOrder = useCallback((id) => {
    let cancelledItem = null;

    setOrders((prev) =>
      prev.map((o) => {
        if (String(o.id) !== String(id)) return o;
        if (o.status === "Dibatalkan" || o.status === "Selesai") return o;

        if (o.productId != null) {
          const k = String(o.productId);
          setProductStocks((s) => ({ ...s, [k]: (s[k] ?? 5) + (o.quantity || 1) }));
        }

        cancelledItem = {
          ...o,
          status: "Dibatalkan",
          statusType: "cancelled",
          canceledAt: new Date().toLocaleString("id-ID"),
        };

        write(KEY_HISTORY, [cancelledItem, ...read(KEY_HISTORY, [])]);
        return cancelledItem;
      })
    );

    return cancelledItem;
  }, []);

  return (
    <OrdersContext.Provider
      value={{ orders, setOrders, addOrder, updateOrder, cancelOrder, productStocks, setProductStocks }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders harus dipakai di dalam <OrdersProvider>");
  return ctx;
}