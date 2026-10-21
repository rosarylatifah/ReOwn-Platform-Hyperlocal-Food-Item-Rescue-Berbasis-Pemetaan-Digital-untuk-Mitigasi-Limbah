import { useChat } from '@/app/pembeli/context/chat';

export function useOrderDetail(order, onClose, onCancelOrder) {
  const { startChatWithSeller } = useChat();

  if (!order) return null;

  // Cek status pesanan
  const currentStatus = order.status || 'Menunggu Konfirmasi';
  const isCancelable = currentStatus === 'Menunggu Konfirmasi';

  // Format Fallback Data
  const buyerName = order.buyerName || "Zara (Pembeli)";
  const sellerName = order.sellerName || order.storeName || order.store || "Toko Rescue Batam";
  const sellerAddress = order.sellerAddress || order.location || "Jl. Ahmad Yani, Batam Center, Batam";
  const productName = order.productName || order.name || "Produk Rescue";
  const totalPrice = order.totalPrice || order.price || "Rp 0";
  const deliveryOption = order.deliveryOption || "Ambil di Tempat";
  const productImage = order.image || order.img || "";
  const description = order.description || `${productName} berkualitas segar siap diselamatkan dari ${sellerName}.`;

  // LOGIKA FORMAT TANGGAL AMAN
  const formatDate = (dateInput) => {
    if (!dateInput) {
      return new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) + `, ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')}`;
    }

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
    if (isNaN(d.getTime())) {
      return new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) + `, ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')}`;
    }

    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }) + `, ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')}`;
  };

  const orderDate = formatDate(order.createdAt || order.orderDate);
  const confirmDate = formatDate(order.confirmDate);

  // Handler Klik Hubungi Penjual
  const handleContactSeller = () => {
    if (startChatWithSeller) {
      startChatWithSeller({
        sellerName: sellerName,
        productName: productName,
        totalPrice: totalPrice,
        image: productImage
      });
    } else {
      alert(`Menghubungi penjual ${sellerName} untuk produk ${productName}`);
    }
    onClose();
  };

  // Handler Pembatalan Pesanan
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