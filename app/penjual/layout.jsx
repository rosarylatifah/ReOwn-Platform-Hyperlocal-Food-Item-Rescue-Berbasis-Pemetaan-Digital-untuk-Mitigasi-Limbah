"use client";

import React from "react";
import { ChatProvider } from "@/app/pembeli/context/chat";
import { ProfileDrawerProvider } from "@/lib/ProfileDrawer";
import ProfileDrawer from "@/components/profil/ProfileDrawer"; // sesuaikan path jika berbeda

export default function SellerLayout({ children }) {
  return (
    <ChatProvider>
      <ProfileDrawerProvider>
        <ProfileDrawer />
        <main className="min-h-screen bg-[#FFF7E9]">{children}</main>
      </ProfileDrawerProvider>
    </ChatProvider>
  );
}