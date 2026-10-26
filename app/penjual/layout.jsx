"use client";

import React from 'react';

export default function SellerLayout({ children }) {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#FAF0EC' }}>
      {children}
    </main>
  );
}