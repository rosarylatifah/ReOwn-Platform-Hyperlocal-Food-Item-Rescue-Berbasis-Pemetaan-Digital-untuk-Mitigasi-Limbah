"use client";

import React from 'react';
import { ChatProvider } from '@/app/pembeli/context/chat';
export default function SellerLayout({ children }) {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#FAF0EC' }}>
      <ChatProvider>
        {children}
      </ChatProvider>
    </main>
  );
}