"use client";

import { useChat } from '@/app/pembeli/context/chat';
import { useProfile } from '@/lib/ProfileContext';
import { areaOf } from '@/lib/pembeli/locationPrivacy';

// Field kosong -> "-"
const orDash = (v) => {
  if (v === null || v === undefined) return "-";
  const s = String(v).trim();
  return s === "" ? "-" : s;
};

// Tanggal -> "12 Nov 2026, 05.17"
// ISO / timestamp: diformat. Teks lama tanpa tahun: tahun berjalan disisipkan.
const formatDateTime = (value) => {
  if (value === null || value === undefined || value === "") return "-";

  if (typeof value === "string" && !/^\d{4}-\d{2}-\d{2}/.test(value)) {
    const s = value.trim();
    if (!s) return "-";
    if (/\b\d{4}\b/.test(s)) return s;
    const y = new Date().getFullYear();
    return s.includes(",") ? s.replace(",", ` ${y},`) : `${s} ${y}`;
  }

  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

export function useOrderDetail(order, onClose, onCancelOrder) {
  const { requestOpenChat } = useChat();
  const { profile } = useProfile();

  if (!order) return null;

  // Cek status pesanan
  const currentStatus = order.status || 'Menunggu Konfirmasi';
  const isCancelable = currentStatus === 'Menunggu Konfirmasi';

  // Data mentah (dipakai untuk logika)
  const rawBuyerName = order.buyerName || "";
  const rawSellerName = order.sellerName || order.storeName || order.store || "";

  // Hanya area perkiraan, bukan alamat/titik pas
  const areaSource = order.pickupArea || order.pickupLocation || order.sellerAddress || order.location || "";
  const sellerArea = order.pickupArea || (areaSource ? areaOf(areaSource) : "");

  // Hubungi Penjual: buat/buka chat toko ini, popover chat terbuka otomatis lewat BuyerNavbar
  const handleContactSeller = () => {
    requestOpenChat({
      storeId: order.storeId ?? order.sellerId ?? rawSellerName,
      storeName: rawSellerName,
      buyerName: profile?.name || rawBuyerName || undefined,
      buyerEmail: profile?.email || order.buyerEmail || undefined,
    });
    onClose();
  };

  // Batalkan pesanan
  const handleCancel = () => {
    if (window.confirm(`Yakin ingin membatalkan pesanan ${order.productName || order.name || ""}?`)) {
      if (onCancelOrder) onCancelOrder(order.id);
      onClose();
    }
  };

  return {
    currentStatus,
    isCancelable,
    buyerName: orDash(rawBuyerName),
    sellerName: orDash(rawSellerName),
    sellerAddress: orDash(sellerArea),
    productName: orDash(order.productName || order.name),
    orderDate: formatDateTime(order.createdAtISO || order.createdAt || order.orderDate),
    confirmDate: formatDateTime(order.confirmDate),
    totalPrice: order.totalPrice || order.price || "Rp 0",
    deliveryOption: orDash(order.deliveryOption),
    productImage: order.image || order.img || "",
    description: orDash(order.description),
    handleContactSeller,
    handleCancel,
  };
}