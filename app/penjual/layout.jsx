"use client";

import React from "react";
import { ChatProvider } from "@/app/pembeli/context/chat";
import { ProfileDrawerProvider } from "@/lib/ProfileDrawer";
import ProfileDrawer from "@/components/profil/ProfileDrawer"; // sesuaikan path jika berbeda
import { NotificationProvider } from '@/app/context/notification';

export default function SellerLayout({ children }) {
  return (
    <NotificationProvider>
      <ChatProvider>
        <ProfileDrawerProvider>
          <ProfileDrawer />
          <main className="min-h-screen bg-[#FFF7E9]">{children}</main>
        </ProfileDrawerProvider>
      </ChatProvider>
    </NotificationProvider>
  );
}