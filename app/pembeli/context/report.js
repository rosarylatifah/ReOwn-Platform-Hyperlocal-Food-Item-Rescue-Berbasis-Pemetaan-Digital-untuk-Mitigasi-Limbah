"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const ReportContext = createContext();

export function ReportProvider({ children }) {
  const [reports, setReports] = useState([]);

  // Load laporan tersimpan dari localStorage pas aplikasi dibuka
  useEffect(() => {
    const savedReports = localStorage.getItem('reown_reports');
    if (savedReports) {
      try {
        setReports(JSON.parse(savedReports));
      } catch (err) {
        console.error("Gagal load laporan:", err);
      }
    }
  }, []);

  // Simpan ke localStorage tiap ada laporan baru
  const saveToStorage = (updatedReports) => {
    setReports(updatedReports);
    localStorage.setItem('reown_reports', JSON.stringify(updatedReports));
  };

  // Fungsi Tambah Laporan Baru
  const addReport = ({ product, reason, detail, image }) => {
    const newReport = {
      id: Date.now(),
      productId: product.id || Date.now(),
      productName: product.name,
      storeName: product.store || product.merchant || "ReOwn Merchant",
      reason,
      detail: detail || "-",
      image: image ? URL.createObjectURL(image) : null,
      status: 'Pending', // Pending | Reviewed | Resolved
      createdAt: new Date().toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updated = [newReport, ...reports];
    saveToStorage(updated);
    return newReport;
  };

  return (
    <ReportContext.Provider value={{ reports, addReport }}>
      {children}
    </ReportContext.Provider>
  );
}

export function useReport() {
  return useContext(ReportContext);
}