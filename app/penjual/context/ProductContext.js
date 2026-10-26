"use client";

import React, { createContext, useContext } from 'react';
import { useProductManager } from '@/app/penjual/hooks/useProductManager';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const manager = useProductManager();
  
  return (
    <ProductContext.Provider value={manager}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext harus digunakan di dalam ProductProvider");
  }
  return context;
}