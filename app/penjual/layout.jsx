"use client";

import React from "react";
import { ChatProvider } from "@/lib/chatStore";
import { ProfileDrawerProvider } from "@/lib/ProfileDrawer";
import ProfileDrawer from "@/components/profil/ProfileDrawer";

export default function SellerLayout({ children }) {
  return (
    <ChatProvider role="seller">
      <ProfileDrawerProvider>
        <ProfileDrawer />
        <main className="min-h-screen bg-[#FFF7E9]">{children}</main>
      </ProfileDrawerProvider>
    </ChatProvider>
  );
}