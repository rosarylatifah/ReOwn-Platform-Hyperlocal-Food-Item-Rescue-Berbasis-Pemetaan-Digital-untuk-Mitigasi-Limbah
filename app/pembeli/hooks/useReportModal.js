import { useState } from 'react';
import { useReport } from '@/app/pembeli/context/report';

export function useReportModal({ product, order, onClose }) {
  const { addReport } = useReport();
  
  const [reportReason, setReportReason] = useState('');
  const [reportDetail, setReportDetail] = useState('');
  const [evidenceImage, setEvidenceImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Menentukan jenis laporan (Transaksi vs Produk)
  const isOrderReport = Boolean(order);
  const targetData = order || product;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEvidenceImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setEvidenceImage(null);
    setImagePreview(null);
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (!reportReason) {
      alert('Silakan pilih alasan pelaporan terlebih dahulu!');
      return;
    }

    const reportData = {
      type: isOrderReport ? 'TRANSAKSI' : 'PRODUK',
      orderId: order?.id || null,
      product: product || { name: order?.productName || order?.name },
      storeName: targetData?.storeName || targetData?.store || targetData?.merchant || "Toko Rescue Batam",
      reason: reportReason,
      detail: reportDetail,
      image: evidenceImage,
      createdAt: new Date().toISOString()
    };

    // Kirim laporan ke Context
    if (addReport) {
      addReport(reportData);
    }

    const targetTitle = isOrderReport 
      ? `Pesanan #${order.id}` 
      : `Produk "${product.name}"`;

    alert(`Laporan masalah untuk ${targetTitle} berhasil dikirim ke Admin & Penjual!`);
    onClose();
  };

  return {
    isOrderReport,
    targetData,
    reportReason,
    setReportReason,
    reportDetail,
    setReportDetail,
    evidenceImage,
    imagePreview,
    handleImageChange,
    handleRemoveImage,
    handleSubmitReport
  };
}