"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  CHAT_STORAGE_KEY,
  EMPTY_CHAT_DATA,
  readChatStorage,
  writeChatStorage,
  formatChatTime,
  avatarFor,
} from "@/lib/chatHelpers";

const ChatContext = createContext(null);

function isVisibleToRole(msg, role) {
  if (!msg) return false;
  const deletedFor = Array.isArray(msg.deletedFor) ? msg.deletedFor : [];
  return !deletedFor.includes(role);
}

function makeMessagePreview(msg, role) {
  if (!msg) return "";
  if (msg.text) return msg.edited ? `${msg.text} (diedit)` : msg.text;
  if (msg.viewOnce) {
    const other = role === "buyer" ? "seller" : "buyer";
    const opened = Array.isArray(msg.openedBy) && msg.openedBy.includes(other);
    return opened ? "Foto sekali lihat • Dibuka" : "Foto sekali lihat";
  }
  if (msg.image) return "Mengirim gambar";
  if (msg.location) return "Berbagi lokasi";
  return "";
}

export function ChatProvider({ children, role: explicitRole }) {
  const pathname = usePathname();
  const role = explicitRole || (pathname?.startsWith("/penjual") ? "seller" : "buyer");

  const [data, setData] = useState(EMPTY_CHAT_DATA);
  const [pendingChatId, setPendingChatId] = useState(null);

  useEffect(() => {
    setData(readChatStorage());
    const onStorage = (e) => {
      if (e.key === CHAT_STORAGE_KEY) setData(readChatStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = useCallback((fn) => {
    const next = fn(readChatStorage());
    writeChatStorage(next);
    setData(next);
  }, []);

  const openChat = useCallback((info) => {
    const storeKey = info.storeId ?? info.storeName ?? "toko";
    const buyerKey = info.buyerEmail || info.buyerName || "pembeli";
    const id = `chat_${storeKey}__${buyerKey}`;

    update((d) => {
      const exist = d.chats.find((c) => c.id === id);
      if (exist) {
        if (info.buyerName && exist.buyerName !== info.buyerName) {
          return {
            ...d,
            chats: d.chats.map((c) => (c.id === id ? { ...c, buyerName: info.buyerName } : c)),
          };
        }
        return d;
      }
      return {
        ...d,
        chats: [
          ...d.chats,
          {
            id,
            storeId: storeKey,
            storeName: info.storeName || "Toko",
            buyerName: info.buyerName || "Pembeli",
            storeAvatar: info.avatar || avatarFor(info.storeName),
            lastMessage: "",
            lastTs: Date.now(),
            unread: { buyer: 0, seller: 0 },
          },
        ],
      };
    });
    return id;
  }, [update]);

  const requestOpenChat = useCallback((info) => setPendingChatId(openChat(info)), [openChat]);
  const clearPending = useCallback(() => setPendingChatId(null), []);

  const sendMessage = useCallback((chatId, textOrPayload, extraPayload = {}) => {
    const raw = typeof textOrPayload === "object" && textOrPayload !== null
      ? textOrPayload
      : { text: textOrPayload, ...extraPayload };

    const cleanText = String(raw.text || "").trim();
    const hasImage = Boolean(raw.image);
    const hasLocation = Boolean(raw.location);
    if (!cleanText && !hasImage && !hasLocation) return;

    const previewText =
      cleanText ||
      (raw.viewOnce ? "Foto sekali lihat" : hasImage ? "Mengirim gambar" : "Berbagi lokasi");
    const ts = Date.now();
    const other = role === "buyer" ? "seller" : "buyer";

    const msg = {
      id: raw.id || `${ts}_${Math.random().toString(36).slice(2, 7)}`,
      sender: role,
      text: cleanText,
      image: raw.image || null,
      imageName: raw.imageName || null,
      viewOnce: Boolean(raw.viewOnce),
      openedBy: [],
      deletedFor: [],
      location: raw.location || null,
      edited: false,
      ts,
      time: formatChatTime(ts),
    };

    update((d) => ({
      ...d,
      chats: d.chats.map((c) =>
        c.id === chatId
          ? {
              ...c,
              lastMessage: previewText,
              lastTs: ts,
              lastSender: role,
              unread: { ...c.unread, [other]: (c.unread?.[other] || 0) + 1, [role]: 0 },
            }
          : c
      ),
      messages: { ...d.messages, [chatId]: [...(d.messages[chatId] || []), msg] },
    }));
    return msg.id;
  }, [role, update]);

  const updateMessage = useCallback((chatId, messageId, updater) => {
    update((d) => {
      const list = d.messages[chatId] || [];
      return {
        ...d,
        messages: {
          ...d.messages,
          [chatId]: list.map((m) => {
            if (m.id !== messageId) return m;
            return typeof updater === "function" ? updater(m) : { ...m, ...updater };
          }),
        },
      };
    });
  }, [update]);

  const editMessage = useCallback((chatId, messageId, newText) => {
    const clean = String(newText || "").trim();
    if (!clean) return;

    update((d) => {
      const list = d.messages[chatId] || [];
      const nextList = list.map((m) =>
        m.id === messageId ? { ...m, text: clean, edited: true } : m
      );
      const visibleList = nextList.filter((m) => isVisibleToRole(m, role));
      const lastVisible = visibleList[visibleList.length - 1];
      return {
        ...d,
        chats: d.chats.map((c) =>
          c.id === chatId && lastVisible?.id === messageId
            ? { ...c, lastMessage: `${clean} (diedit)` }
            : c
        ),
        messages: { ...d.messages, [chatId]: nextList },
      };
    });
  }, [role, update]);

  const applyDeleteLogic = useCallback((d, chatId, messageIds, scope) => {
    const idsSet = new Set(Array.isArray(messageIds) ? messageIds : [messageIds]);
    if (idsSet.size === 0) return d;

    const list = d.messages[chatId] || [];
    const nextList = list
      .map((m) => {
        if (!idsSet.has(m.id)) return m;
        if (scope === "both") return null;
        const currentDeleted = Array.isArray(m.deletedFor) ? m.deletedFor : [];
        return currentDeleted.includes(role)
          ? m
          : { ...m, deletedFor: [...currentDeleted, role] };
      })
      .filter(Boolean);

    const visibleForRole = nextList.filter((m) => isVisibleToRole(m, role));
    const lastMsg = visibleForRole[visibleForRole.length - 1];

    return {
      ...d,
      chats: d.chats.map((c) =>
        c.id === chatId
          ? {
              ...c,
              lastMessage: makeMessagePreview(lastMsg, role),
              lastTs: lastMsg ? lastMsg.ts : c.lastTs,
              lastSender: lastMsg ? lastMsg.sender : null,
            }
          : c
      ),
      messages: { ...d.messages, [chatId]: nextList },
    };
  }, [role]);

  const deleteMessage = useCallback((chatId, messageId, scope = "self") => {
    update((d) => applyDeleteLogic(d, chatId, [messageId], scope));
  }, [applyDeleteLogic, update]);

  const deleteMessages = useCallback((chatId, messageIds, scope = "self") => {
    update((d) => applyDeleteLogic(d, chatId, messageIds, scope));
  }, [applyDeleteLogic, update]);

  const markViewOnceOpened = useCallback((chatId, messageId) => {
    update((d) => {
      const list = d.messages[chatId] || [];
      const nextList = list.map((m) => {
        if (m.id !== messageId || !m.viewOnce || m.sender === role) return m;
        const already = Array.isArray(m.openedBy) && m.openedBy.includes(role);
        if (already) return m;
        return {
          ...m,
          openedBy: [...(m.openedBy || []), role],
          image: null,
        };
      });
      return {
        ...d,
        messages: { ...d.messages, [chatId]: nextList },
      };
    });
  }, [role, update]);

  const markRead = useCallback((chatId) => {
    const cur = readChatStorage().chats.find((c) => c.id === chatId);
    if (!cur || !cur.unread?.[role]) return;
    update((d) => ({
      ...d,
      chats: d.chats.map((c) => (c.id === chatId ? { ...c, unread: { ...c.unread, [role]: 0 } } : c)),
    }));
  }, [role, update]);

  const visibleMessagesByChat = useMemo(() => {
    const out = {};
    Object.entries(data.messages || {}).forEach(([chatId, list]) => {
      out[chatId] = (list || []).filter((m) => isVisibleToRole(m, role));
    });
    return out;
  }, [data.messages, role]);

  const chats = useMemo(
    () =>
      [...data.chats]
        .sort((a, b) => b.lastTs - a.lastTs)
        .map((c) => {
          const title = role === "buyer" ? c.storeName : c.buyerName;
          const roomVisible = visibleMessagesByChat[c.id] || [];
          const lastVisible = roomVisible[roomVisible.length - 1];
          const rawPreview = lastVisible ? makeMessagePreview(lastVisible, role) : c.lastMessage;
          const senderForPreview = lastVisible ? lastVisible.sender : c.lastSender;

          return {
            ...c,
            title,
            storeName: title,
            avatar: role === "buyer" ? c.storeAvatar : avatarFor(c.buyerName),
            time: rawPreview ? formatChatTime(lastVisible ? lastVisible.ts : c.lastTs) : "",
            lastMessage: rawPreview
              ? (senderForPreview === role ? `Anda: ${rawPreview}` : rawPreview)
              : "Mulai percakapan",
            unread: (c.unread?.[role] || 0) > 0,
          };
        }),
    [data.chats, role, visibleMessagesByChat]
  );

  const unreadChatCount = chats.filter((c) => c.unread).length;

  return (
    <ChatContext.Provider
      value={{
        role,
        chats,
        allMessages: visibleMessagesByChat,
        unreadChatCount,
        sendMessage,
        updateMessage,
        editMessage,
        deleteMessage,
        deleteMessages,
        markViewOnceOpened,
        markRead,
        openChat,
        requestOpenChat,
        pendingChatId,
        clearPending,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat harus dipakai di dalam <ChatProvider>");
  return ctx;
}