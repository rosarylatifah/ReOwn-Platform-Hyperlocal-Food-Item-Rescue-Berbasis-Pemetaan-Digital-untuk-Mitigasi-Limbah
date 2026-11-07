"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ProfileDrawerContext = createContext(null);

export function ProfileDrawerProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return <ProfileDrawerContext.Provider value={value}>{children}</ProfileDrawerContext.Provider>;
}

export function useProfileDrawer() {
  const ctx = useContext(ProfileDrawerContext);
  if (!ctx) throw new Error("useProfileDrawer harus dipakai di dalam <ProfileDrawerProvider>");
  return ctx;
}
