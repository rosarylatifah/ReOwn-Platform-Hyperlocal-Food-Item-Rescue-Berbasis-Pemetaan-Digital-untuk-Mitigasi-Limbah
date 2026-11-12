"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

const KEY = "reown_chat";
const EMPTY = { chats: [], messages: {} };

const read = () => {
  try { const v = localStorage.getItem(KEY); return v ? JSON.parse(v) : EMPTY; } catch { return EMPTY; }
};
const write = (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} };
const fmt = (ts) => new Date(ts).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

// Avatar inisial (SVG data-URI, tanpa file/domain eksternal)
const avatarFor = (name = "?") =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='88' height='88'><rect width='88' height='88' fill='#D95A36'/><text x='50%' y='50%' dy='.35em' text-anchor='middle' font-family='sans-serif' font-size='40' fill='white'>${(name[0] || "?").toUpperCase()}</text></svg>`
  );

const ChatContext = createContext(null);

export function ChatProvider({ children, role = "buyer" }) {
  const [data, setData] = useState(EMPTY);
  const [pendingChatId, setPendingChatId] = useState(null);

  useEffect(() => {
    setData(read());
    const onStorage = (e) => { if (e.key === KEY) setData(read()); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Baca-ubah-tulis dari localStorage terbaru agar aman antar tab
  const update = useCallback((fn) => {
    const next = fn(read());
    write(next);
    setData(next);
  }, []);

  // Satu chat = satu pasangan (toko, pembeli)
  const openChat = useCallback((info) => {
    const storeKey = info.storeId ?? info.storeName ?? "toko";
    const buyerKey = info.buyerEmail || info.buyerName || "pembeli"; // || supaya string kosong ikut dilewati
    const id = `chat_${storeKey}__${buyerKey}`;
    update((d) => {
      const exist = d.chats.find((c) => c.id === id);
      if (exist) {
        if (info.buyerName && exist.buyerName !== info.buyerName) {
          return { ...d, chats: d.chats.map((c) => (c.id === id ? { ...c, buyerName: info.buyerName } : c)) };
        }
        return d;
      }
      return {
        ...d,
        chats: [...d.chats, {
          id, storeId: storeKey,
          storeName: info.storeName || "Toko",
          buyerName: info.buyerName || "Pembeli",
          storeAvatar: info.avatar || avatarFor(info.storeName),
          lastMessage: "", lastTs: Date.now(), unread: { buyer: 0, seller: 0 },
        }],
      };
    });
    return id;
  }, [update]);

  // Dipakai tombol "Hubungi Penjual": buat chat lalu minta popover terbuka
  const requestOpenChat = useCallback((info) => setPendingChatId(openChat(info)), [openChat]);
  const clearPending = useCallback(() => setPendingChatId(null), []);

  const sendMessage = useCallback((chatId, text) => {
    const clean = String(text).trim();
    if (!clean) return;
    const ts = Date.now();
    const other = role === "buyer" ? "seller" : "buyer";
    const msg = { id: `${ts}_${Math.random().toString(36).slice(2, 7)}`, sender: role, text: clean, ts, time: fmt(ts) };
    update((d) => ({
      ...d,
      chats: d.chats.map((c) => c.id === chatId
        ? {
            ...c, lastMessage: clean, lastTs: ts, lastSender: role,
            unread: { ...c.unread, [other]: (c.unread?.[other] || 0) + 1, [role]: 0 },
          }
        : c),
      messages: { ...d.messages, [chatId]: [...(d.messages[chatId] || []), msg] },
    }));
  }, [role, update]);

  const markRead = useCallback((chatId) => {
    const cur = read().chats.find((c) => c.id === chatId);
    if (!cur || !cur.unread?.[role]) return; // tidak menulis jika tidak perlu
    update((d) => ({
      ...d,
      chats: d.chats.map((c) => c.id === chatId ? { ...c, unread: { ...c.unread, [role]: 0 } } : c),
    }));
  }, [role, update]);

  // Bentuk data sesuai sudut pandang peran saat ini
  const chats = useMemo(
    () => [...data.chats]
      .sort((a, b) => b.lastTs - a.lastTs)
      .map((c) => {
        const title = role === "buyer" ? c.storeName : c.buyerName;
        return {
          ...c, title, storeName: title,
          avatar: role === "buyer" ? c.storeAvatar : avatarFor(c.buyerName),
          time: c.lastMessage ? fmt(c.lastTs) : "",
          lastMessage: c.lastMessage
            ? (c.lastSender === role ? `Anda: ${c.lastMessage}` : c.lastMessage)
            : "Mulai percakapan",
          unread: (c.unread?.[role] || 0) > 0,
        };
      }),
    [data.chats, role]
  );

  const unreadChatCount = chats.filter((c) => c.unread).length;

  return (
    <ChatContext.Provider value={{
      role, chats, allMessages: data.messages, unreadChatCount,
      sendMessage, markRead, openChat, requestOpenChat, pendingChatId, clearPending,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat harus dipakai di dalam <ChatProvider>");
  return ctx;
}