"use client";

import React, { useState } from "react";

// =========================================================
// 1. IMPORT SEMUA HALAMAN SELLER (DARI src/pages/)
// =========================================================
import SellerDashboard from "@/src/pages/SellerDashboard";
import SellerProducts from "@/src/pages/SellerProducts";
import SellerConfirmOrders from "@/src/pages/SellerConfirmOrders";
import SellerIncomingOrders from "@/src/pages/SellerIncomingOrders";
import SellerHistory from "@/src/pages/SellerHistory";
import SellerStatDetail from "@/src/pages/SellerStatDetail";

// =========================================================
// 2. IMPORT SEMUA HALAMAN BUYER / PEMBELI (DARI src/pages/)
// =========================================================
import BuyerDashboard from "@/src/pages/BuyerDashboard";
import BuyerProducts from "@/src/pages/BuyerProducts";
import BuyerCart from "@/src/pages/BuyerCart";
import BuyerOrders from "@/src/pages/BuyerOrders";
import BuyerHistory from "@/src/pages/BuyerHistory";

// =========================================================
// 3. IMPORT KOMPONEN / MODAL TAMBAHAN (DARI src/components/)
// =========================================================
import BuyerNavbar from "@/src/components/BuyerNavbar";
import SellerNavbar from "@/src/components/SellerNavbar";
import CartDetailModal from "@/src/components/CartDetailModal";
import OrderDetailModal from "@/src/components/OrderDetailModal";
import ProductDetailModal from "@/src/components/ProductDetailModal";

export default function SandboxPage() {
  const [activeTab, setActiveTab] = useState("seller-dashboard");

  return (
    <div style={{ backgroundColor: "#18181B", minHeight: "100vh", padding: "12px", fontFamily: "sans-serif" }}>
      {/* =========================================================
          PANEL TESTING / TESTING TOOLBAR (STICKY DI ATAS)
         ========================================================= */}
      <div
        style={{
          backgroundColor: "#27272A",
          padding: "12px 18px",
          borderRadius: "12px",
          marginBottom: "16px",
          display: "flex",
          gap: "8px",
          alignItems: "center",
          flexWrap: "wrap",
          border: "1px solid #3F3F46",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
          position: "sticky",
          top: "10px",
          zIndex: 9999,
        }}
      >
        <span style={{ color: "#F59E0B", fontWeight: "bold", fontSize: "13px", marginRight: "6px" }}>
          🛠️ REOWN SANDBOX:
        </span>

        {/* --- KELOMPOK SELLER --- */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#18181B", padding: "4px 8px", borderRadius: "8px" }}>
          <span style={{ color: "#F97316", fontSize: "11px", fontWeight: "bold" }}>SELLER:</span>
          
          <button
            onClick={() => setActiveTab("seller-dashboard")}
            style={getButtonStyle(activeTab === "seller-dashboard", "#EA580C")}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("seller-products")}
            style={getButtonStyle(activeTab === "seller-products", "#EA580C")}
          >
            Produk
          </button>
          <button
            onClick={() => setActiveTab("seller-confirm")}
            style={getButtonStyle(activeTab === "seller-confirm", "#EA580C")}
          >
            Konfirmasi
          </button>
          <button
            onClick={() => setActiveTab("seller-incoming")}
            style={getButtonStyle(activeTab === "seller-incoming", "#EA580C")}
          >
            Pesanan Masuk
          </button>
          <button
            onClick={() => setActiveTab("seller-history")}
            style={getButtonStyle(activeTab === "seller-history", "#EA580C")}
          >
            Riwayat
          </button>
          <button
            onClick={() => setActiveTab("seller-stat-detail")}
            style={getButtonStyle(activeTab === "seller-stat-detail", "#EA580C")}
          >
            Detail Stat
          </button>
        </div>

        {/* --- KELOMPOK BUYER / PEMBELI --- */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#18181B", padding: "4px 8px", borderRadius: "8px" }}>
          <span style={{ color: "#10B981", fontSize: "11px", fontWeight: "bold" }}>BUYER:</span>
          
          <button
            onClick={() => setActiveTab("buyer-dashboard")}
            style={getButtonStyle(activeTab === "buyer-dashboard", "#059669")}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("buyer-products")}
            style={getButtonStyle(activeTab === "buyer-products", "#059669")}
          >
            Katalog Produk
          </button>
          <button
            onClick={() => setActiveTab("buyer-cart")}
            style={getButtonStyle(activeTab === "buyer-cart", "#059669")}
          >
            Keranjang
          </button>
          <button
            onClick={() => setActiveTab("buyer-orders")}
            style={getButtonStyle(activeTab === "buyer-orders", "#059669")}
          >
            Pesanan Saya
          </button>
          <button
            onClick={() => setActiveTab("buyer-history")}
            style={getButtonStyle(activeTab === "buyer-history", "#059669")}
          >
            Riwayat
          </button>
        </div>

        {/* --- KELOMPOK MODAL & NAV --- */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#18181B", padding: "4px 8px", borderRadius: "8px" }}>
          <span style={{ color: "#3B82F6", fontSize: "11px", fontWeight: "bold" }}>MODAL/NAV:</span>
          
          <button
            onClick={() => setActiveTab("navbars")}
            style={getButtonStyle(activeTab === "navbars", "#2563EB")}
          >
            Navbar UI
          </button>
          <button
            onClick={() => setActiveTab("modals")}
            style={getButtonStyle(activeTab === "modals", "#2563EB")}
          >
            Modal Components
          </button>
        </div>
      </div>

      {/* =========================================================
          AREA UTAMA UNTUK MENAMPILKAN HALAMAN / KOMPONEN
         ========================================================= */}
      <div style={{ backgroundColor: "#FAF6F0", borderRadius: "16px", minHeight: "80vh", overflow: "hidden", color: "#18181B" }}>
        
        {/* AUTOMATIC NAVBAR FOR SELLER */}
        {activeTab.startsWith("seller-") && <SellerNavbar />}

        {/* AUTOMATIC NAVBAR FOR BUYER */}
        {activeTab.startsWith("buyer-") && <BuyerNavbar />}

        {/* AREA KONTEN ISI HALAMAN */}
        <div style={{ padding: "20px" }}>
          {/* HALAMAN SELLER */}
          {activeTab === "seller-dashboard" && <SellerDashboard />}
          {activeTab === "seller-products" && <SellerProducts />}
          {activeTab === "seller-confirm" && <SellerConfirmOrders />}
          {activeTab === "seller-incoming" && <SellerIncomingOrders />}
          {activeTab === "seller-history" && <SellerHistory />}
          {activeTab === "seller-stat-detail" && <SellerStatDetail />}

          {/* HALAMAN BUYER */}
          {activeTab === "buyer-dashboard" && <BuyerDashboard />}
          {activeTab === "buyer-products" && <BuyerProducts />}
          {activeTab === "buyer-cart" && <BuyerCart />}
          {activeTab === "buyer-orders" && <BuyerOrders />}
          {activeTab === "buyer-history" && <BuyerHistory />}
        </div>

        {/* PRATINJAU NAVBAR STANDALONE */}
        {activeTab === "navbars" && (
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <h3 style={{ marginBottom: "8px", color: "#3F3F46" }}>1. Seller Navbar</h3>
              <SellerNavbar />
            </div>
            <div>
              <h3 style={{ marginBottom: "8px", color: "#3F3F46" }}>2. Buyer Navbar</h3>
              <BuyerNavbar />
            </div>
          </div>
        )}

        {/* PRATINJAU MODALS */}
        {activeTab === "modals" && (
          <div style={{ padding: "20px" }}>
            <h2>Preview Modal Components</h2>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              Komponen modal biasanya muncul secara popup. Kamu bisa mengecek struktur kodingannya di bawah ini:
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ border: "1px solid #DDD", padding: "15px", borderRadius: "10px", backgroundColor: "#FFF" }}>
                <h4>CartDetailModal</h4>
                <CartDetailModal isOpen={true} onClose={() => {}} />
              </div>

              <div style={{ border: "1px solid #DDD", padding: "15px", borderRadius: "10px", backgroundColor: "#FFF" }}>
                <h4>OrderDetailModal</h4>
                <OrderDetailModal isOpen={true} onClose={() => {}} />
              </div>

              <div style={{ border: "1px solid #DDD", padding: "15px", borderRadius: "10px", backgroundColor: "#FFF" }}>
                <h4>ProductDetailModal</h4>
                <ProductDetailModal isOpen={true} onClose={() => {}} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Style untuk Tombol Toolbar
function getButtonStyle(isActive: boolean, activeBg: string) {
  return {
    padding: "5px 11px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: isActive ? activeBg : "#27272A",
    color: isActive ? "#FFFFFF" : "#A1A1AA",
    fontWeight: isActive ? ("bold" as const) : ("normal" as const),
    fontSize: "11px",
    cursor: "pointer",
    transition: "all 0.15s ease-in-out",
  };
}