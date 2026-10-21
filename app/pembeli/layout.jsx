"use client";

import React from 'react';
import { CartProvider } from '@/app/pembeli/context/cart';
import { ChatProvider } from '@/app/pembeli/context/chat';
import { ReportProvider } from '@/app/pembeli/context/report';
import { NotificationProvider } from '@/app/pembeli/context/notification';
import BuyerNavbar from '@/components/pembeli/BuyerNavbar';

export default function BuyerLayout({ children }) {
  return (
    <NotificationProvider>
      <ReportProvider>
        <ChatProvider>
          <CartProvider>
            <BuyerNavbar />
            <main style={{ minHeight: '100vh', backgroundColor: '#FAF0EC' }}>
              {children}
            </main>
          </CartProvider>
        </ChatProvider>
      </ReportProvider>
    </NotificationProvider>
  );
}