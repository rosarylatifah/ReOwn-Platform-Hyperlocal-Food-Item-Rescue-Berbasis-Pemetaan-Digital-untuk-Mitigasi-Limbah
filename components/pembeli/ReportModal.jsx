"use client";

import React from 'react';
import { AlertCircle, X, Send, Upload } from 'lucide-react';
import { useReportModal } from '@/app/pembeli/hooks/useReportModal';

export default function ReportModal({ product, order, onClose }) {
  const {
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
  } = useReportModal({ product, order, onClose });

  if (!product && !order) return null;

  const targetName = isOrderReport 
    ? (order.productName || order.name || 'Pesanan Rescue') 
    : product.name;
    
  const storeName = targetData?.storeName || targetData?.store || targetData?.merchant || "Toko Rescue Batam";

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
    }}>
      <style jsx>{`
        .custom-input:hover { border-color: #DC2626 !important; }
        .custom-input:focus {
          border-color: #DC2626 !important;
          outline: 2px solid rgba(220, 38, 38, 0.4) !important;
        }
        .upload-box:hover { background-color: #FEE2E2 !important; border-color: #DC2626 !important; }
        .btn-cancel:hover { background-color: #F5F5F5 !important; }
        .btn-submit:hover { background-color: #B91C1C !important; }
      `}</style>

      <div style={{
        backgroundColor: '#FFF', borderRadius: '20px', width: '90%', maxWidth: '480px',
        maxHeight: '90vh', overflowY: 'auto', padding: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative', fontFamily: 'Inter, sans-serif'
      }}>
        {/* Tombol Close */}
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
        >
          <X size={20} />
        </button>

        {/* Header Title Dynamic */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ backgroundColor: '#FEE2E2', padding: '8px', borderRadius: '50%' }}>
            <AlertCircle size={22} color="#DC2626" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#1A1A1A', fontFamily: 'Fraunces, serif', fontWeight: 'bold' }}>
              {isOrderReport ? 'Laporkan Masalah Transaksi' : 'Laporkan Produk'}
            </h3>
            {isOrderReport && (
              <span style={{ fontSize: '11px', color: '#DC2626', fontWeight: 'bold' }}>
                ID Transaksi: {order.id}
              </span>
            )}
          </div>
        </div>

        <p style={{ fontSize: '13px', color: '#666', margin: '0 0 16px 0', lineHeight: '1.4' }}>
          {isOrderReport ? (
            <>Kamu akan melaporkan masalah transaksi pesanan <strong>"{targetName}"</strong> di toko <strong>{storeName}</strong>.</>
          ) : (
            <>Kamu akan melaporkan produk <strong>"{targetName}"</strong> dari toko <strong>{storeName}</strong>.</>
          )}
        </p>

        <form onSubmit={handleSubmitReport}>
          {/* Pilih Alasan Pelaporan */}
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#333', marginBottom: '6px' }}>
            Alasan Pelaporan Masalah <span style={{ color: '#DC2626' }}>*</span>
          </label>

          <select 
            value={reportReason} 
            onChange={(e) => setReportReason(e.target.value)}
            className="custom-input"
            style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #DDD', fontSize: '13px', marginBottom: '14px', outline: 'none' }}
          >
            <option value="">-- Pilih Alasan Pelaporan --</option>
            
            {/* OPSI JIKA LAPORAN TRANSAKSI */}
            {isOrderReport ? (
              <>
                <option value="Makanan Basi / Rusak / Tidak Layak Konsumsi">Makanan Basi / Rusak / Tidak Layak Konsumsi</option>
                <option value="Pesanan Tidak Diterima / Toko Tutup">Pesanan Tidak Diterima / Toko Tutup saat Diambil</option>
                <option value="Porsi / Barang Tidak Sesuai Deskripsi">Porsi / Barang Tidak Sesuai Deskripsi</option>
                <option value="Penjual Tidak Responsif / Sikap Buruk">Penjual Tidak Responsif / Sikap Buruk</option>
                <option value="Masalah Pembayaran / Diskon Tidak Terpotong">Masalah Pembayaran / Diskon Tidak Terpotong</option>
                <option value="Lainnya">Lainnya</option>
              </>
            ) : (
              /* OPSI JIKA LAPORAN PRODUK KATALOG */
              <>
                <option value="Gambar Tidak Sesuai / Palsu">Gambar Tidak Sesuai / Palsu</option>
                <option value="Makanan Basi / Rusak Parah">Makanan Basi / Rusak Parah</option>
                <option value="Penipuan Harga / Diskon Palsu">Penipuan Harga / Diskon Palsu</option>
                <option value="Melanggar Kebijakan ReOwn">Melanggar Kebijakan ReOwn</option>
                <option value="Lainnya">Lainnya</option>
              </>
            )}
          </select>

          {/* Detail Tambahan */}
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#333', marginBottom: '6px' }}>
            Detail Masalah (Deskripsikan Keluhanmu):
          </label>
          <textarea 
            rows={3} 
            value={reportDetail} 
            onChange={(e) => setReportDetail(e.target.value)}
            placeholder={isOrderReport ? "Jelaskan kronologi masalah transaksi ini..." : "Jelaskan masalah produk ini lebih detail..."}
            className="custom-input"
            style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #DDD', fontSize: '13px', marginBottom: '14px', outline: 'none', resize: 'none' }}
          />

          {/* Unggah Bukti */}
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#333', marginBottom: '6px' }}>
            Unggah Foto Bukti (Sangat Direkomendasikan):
          </label>
          
          {!imagePreview ? (
            <label className="upload-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '16px', border: '2px dashed #DC2626', borderRadius: '12px', backgroundColor: '#FEF2F2', cursor: 'pointer', marginBottom: '20px' }}>
              <Upload size={22} color="#DC2626" />
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#DC2626' }}>Klik untuk unggah foto bukti keluhan</span>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
          ) : (
            <div style={{ marginBottom: '20px', borderRadius: '12px', border: '1px solid #E5E5E5', padding: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={imagePreview} alt="Bukti" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
              <span style={{ flex: 1, fontSize: '12px', fontWeight: 'bold', color: '#333' }}>{evidenceImage?.name}</span>
              <button type="button" onClick={handleRemoveImage} style={{ border: 'none', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={14} />
              </button>
            </div>
          )}

          {/* Tombol Aksi */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn-cancel" style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid #CCC', backgroundColor: '#FFF', color: '#555', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
              Batal
            </button>
            <button type="submit" className="btn-submit" style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#DC2626', color: '#FFF', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Send size={14} /> Kirim Laporan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}