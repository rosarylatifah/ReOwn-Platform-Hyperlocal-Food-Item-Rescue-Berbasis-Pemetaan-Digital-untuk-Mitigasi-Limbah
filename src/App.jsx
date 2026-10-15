import React, { useState } from 'react';
import BuyerNavbar from './components/BuyerNavbar';
import BuyerDashboard from './pages/BuyerDashboard';
import BuyerProducts from './pages/BuyerProducts';
import BuyerOrders from './pages/BuyerOrders';
import BuyerHistory from './pages/BuyerHistory';
import BuyerCart from './pages/BuyerCart';
import SellerNavbar from './components/SellerNavbar';
import SellerDashboard from './pages/SellerDashboard';
import SellerProducts from './pages/SellerProducts';
import SellerConfirmOrders from './pages/SellerConfirmOrders';
import SellerIncomingOrders from './pages/SellerIncomingOrders';
import SellerHistory from './pages/SellerHistory';

export default function App() {
  const [currentPage, setCurrentPage] = useState('beranda');
  const [role, setRole] = useState('buyer');

  return (
    <div>
      {/* Tombol SEMENTARA di pojok kanan atas buat switch mode */}
      <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 9999, background: '#fff', padding: '6px 12px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <button onClick={() => setRole('buyer')} style={{ marginRight: '8px', fontWeight: role === 'buyer' ? 'bold' : 'normal', cursor: 'pointer' }}>Mode Buyer</button>
        <button onClick={() => setRole('seller')} style={{ fontWeight: role === 'seller' ? 'bold' : 'normal', cursor: 'pointer' }}>Mode Seller</button>
      </div>

      {/* Jika Mode Seller aktif, tampilkan Navbar Seller & halaman Seller */}
        {role === 'seller' ? (
          <>
            <SellerNavbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

            {currentPage === 'beranda' && <SellerDashboard />}
            {currentPage === 'kelola-produk' && <SellerProducts />}
            {currentPage === 'konfirmasi-pesanan' && <SellerConfirmOrders />}
            {currentPage === 'pesanan-masuk' && <SellerIncomingOrders />}
            {currentPage === 'riwayat-pesanan' && <SellerHistory />}
          </>
        ) : (
        <>
          <BuyerNavbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

          {/* Halaman-halaman Buyer */}
          {currentPage === 'beranda' && <BuyerDashboard setCurrentPage={setCurrentPage} />}
          {currentPage === 'produk' && <BuyerProducts />}
          {currentPage === 'pesanan' && <BuyerOrders />}
          {currentPage === 'riwayat' && <BuyerHistory />}
          {currentPage === 'keranjang' && <BuyerCart />}
        </>
      )}
    </div>
  );
}