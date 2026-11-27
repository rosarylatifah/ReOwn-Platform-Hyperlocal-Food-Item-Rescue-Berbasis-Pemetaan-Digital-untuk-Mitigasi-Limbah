"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useChat } from "@/app/context/chat";
import { LOCATION_CONSENT_KEY, compressImageFile } from "@/lib/chatHelpers";

const DEFAULT_COORDS = { lat: 1.1301, lng: 104.0529 };

function getCurrentPositionSafe() {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve({ ...DEFAULT_COORDS, isFallback: true });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: Number(pos.coords.latitude.toFixed(5)),
          lng: Number(pos.coords.longitude.toFixed(5)),
          isFallback: false,
        });
      },
      () => resolve({ ...DEFAULT_COORDS, isFallback: true }),
      { enableHighAccuracy: true, timeout: 6000 }
    );
  });
}

export function useChatPopover({ isOpen, onClose, externalActiveChatId, onClearActiveChat }) {
  const {
    chats,
    allMessages,
    sendMessage,
    updateMessage,
    editMessage,
    deleteMessage,
    deleteMessages,
    markViewOnceOpened,
    unreadChatCount,
    markRead,
    role,
    pendingChatId,
    clearPending,
  } = useChat();

  const [internalActiveChatId, setInternalActiveChatId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  const [draftImage, setDraftImage] = useState(null);
  const [draftImageName, setDraftImageName] = useState("");
  const [viewOnce, setViewOnce] = useState(false);
  const [viewingOnceMsg, setViewingOnceMsg] = useState(null);
  const [previewImageMsg, setPreviewImageMsg] = useState(null);

  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [pendingLocationMode, setPendingLocationMode] = useState("instant");
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [durationMinutes, setDurationMinutes] = useState("15");
  const [sendingLocation, setSendingLocation] = useState(false);
  const [activeShare, setActiveShare] = useState(null);

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedMsgIds, setSelectedMsgIds] = useState([]);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editDraftText, setEditDraftText] = useState("");
  const [actionMenuMsg, setActionMenuMsg] = useState(null);
  const [pendingDeleteTarget, setPendingDeleteTarget] = useState(null);
  const [highlightedMsgId, setHighlightedMsgId] = useState(null);

  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
  const longPressTimerRef = useRef(null);
  const messageRefs = useRef({});

  const isSeller = role === "seller";
  const activeChatId = pendingChatId || externalActiveChatId || internalActiveChatId;
  const messages = activeChatId ? allMessages[activeChatId] || [] : [];
  const currentChat = chats.find((c) => c.id === activeChatId);

  useEffect(() => {
    if (!isOpen) return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && activeChatId && markRead) markRead(activeChatId);
  }, [isOpen, activeChatId, messages.length, markRead]);

  useEffect(() => {
    if (!highlightedMsgId) {
      bottomRef.current?.scrollIntoView({ block: "end" });
    }
  }, [messages.length, activeChatId, isOpen, highlightedMsgId]);

  useEffect(() => {
    if (!highlightedMsgId || !activeChatId) return;
    const el = messageRefs.current[highlightedMsgId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    const timer = setTimeout(() => {
      setHighlightedMsgId(null);
    }, 2600);
    return () => clearTimeout(timer);
  }, [highlightedMsgId, activeChatId]);

  const stopActiveShare = useCallback((chatId, messageId) => {
    setActiveShare((prev) => {
      if (!prev) return null;
      if (messageId && prev.messageId !== messageId) return prev;
      return null;
    });
    if (chatId && messageId) {
      updateMessage(chatId, messageId, (prevMsg) => ({
        ...prevMsg,
        text: prevMsg.location?.isInstant
          ? prevMsg.text
          : "Berbagi lokasi telah dihentikan",
        location: prevMsg.location
          ? { ...prevMsg.location, isSharing: false }
          : null,
      }));
    }
  }, [updateMessage]);

  useEffect(() => {
    if (!activeShare) return;
    const { chatId, messageId, expiresAt } = activeShare;

    const interval = setInterval(async () => {
      const now = Date.now();
      if (now >= expiresAt) {
        clearInterval(interval);
        stopActiveShare(chatId, messageId);
        return;
      }

      const coords = await getCurrentPositionSafe();
      const sisaMenit = Math.max(1, Math.ceil((expiresAt - now) / 60000));
      updateMessage(chatId, messageId, (prevMsg) => {
        if (!prevMsg.location?.isSharing) return prevMsg;
        return {
          ...prevMsg,
          text: `Berbagi lokasi langsung (sisa ~${sisaMenit} mnt): ${coords.lat}, ${coords.lng}`,
          location: {
            ...prevMsg.location,
            lat: coords.lat,
            lng: coords.lng,
            updatedAt: now,
          },
        };
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [activeShare, stopActiveShare, updateMessage]);

  const q = searchQuery.trim().toLowerCase();

  const searchIndexByChat = useMemo(() => {
    const map = {};
    chats.forEach((c) => {
      if (!q) {
        map[c.id] = null;
        return;
      }
      const displayName = (c.title || c.storeName || c.buyerName || "").toLowerCase();
      const lastMsg = (c.lastMessage || "").toLowerCase();
      const roomMessages = allMessages[c.id] || [];

      const matchedMsg = roomMessages.find((m) => {
        const text = (m.text || "").toLowerCase();
        const imgName = (m.imageName || "").toLowerCase();
        return text.includes(q) || imgName.includes(q);
      });

      const matchName = displayName.includes(q);
      const matchLast = lastMsg.includes(q);
      const matchMsg = Boolean(matchedMsg);

      if (!matchName && !matchLast && !matchMsg) {
        map[c.id] = null;
        return;
      }

      map[c.id] = {
        matchedMsgId: matchedMsg?.id || null,
        snippet: matchedMsg?.text || matchedMsg?.imageName || null,
      };
    });
    return map;
  }, [chats, allMessages, q]);

  const filteredChats = chats.filter((c) => {
    const matchesSearch = !q || Boolean(searchIndexByChat[c.id]);
    if (activeTab === "unread") return matchesSearch && c.unread;
    return matchesSearch;
  });

  const resetComposer = () => {
    setInputMessage("");
    setDraftImage(null);
    setDraftImageName("");
    setViewOnce(false);
    setShowAttachmentMenu(false);
  };

  const resetMsgTools = () => {
    clearTimeout(longPressTimerRef.current);
    setIsSelectMode(false);
    setSelectedMsgIds([]);
    setEditingMsgId(null);
    setEditDraftText("");
    setActionMenuMsg(null);
    setPendingDeleteTarget(null);
  };

  const handleClose = () => {
    if (clearPending) clearPending();
    setInternalActiveChatId(null);
    setViewingOnceMsg(null);
    setPreviewImageMsg(null);
    setShowLocationPrompt(false);
    setShowDurationModal(false);
    setHighlightedMsgId(null);
    resetMsgTools();
    resetComposer();
    onClose();
  };

  const goBack = () => {
    setInternalActiveChatId(null);
    setViewingOnceMsg(null);
    setPreviewImageMsg(null);
    setShowLocationPrompt(false);
    setShowDurationModal(false);
    setHighlightedMsgId(null);
    resetMsgTools();
    resetComposer();
    if (clearPending) clearPending();
    if (onClearActiveChat) onClearActiveChat();
  };

  const handleSelectChat = (chatId) => {
    resetMsgTools();
    const meta = searchIndexByChat[chatId];
    setHighlightedMsgId(meta?.matchedMsgId || null);
    setInternalActiveChatId(chatId);
    if (markRead) markRead(chatId);
  };

  const handleSend = (e, customPayload = null) => {
    if (e) e.preventDefault();
    if (!activeChatId) return;

    if (customPayload) {
      const createdId = sendMessage(activeChatId, customPayload);
      setShowAttachmentMenu(false);
      return createdId;
    }

    const trimmed = inputMessage.trim();
    if (!trimmed && !draftImage) return;

    sendMessage(activeChatId, {
      text: trimmed,
      image: draftImage,
      imageName: draftImageName,
      viewOnce: draftImage ? viewOnce : false,
    });
    resetComposer();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file);
      setDraftImage(dataUrl);
      setDraftImageName(file.name);
      setShowAttachmentMenu(false);
    } catch {
      alert("Gagal memproses gambar. Coba pilih file gambar lain.");
    }
    e.target.value = "";
  };

  const sendInstantLocation = async () => {
    if (!activeChatId) return;
    setSendingLocation(true);
    const coords = await getCurrentPositionSafe();
    handleSend(null, {
      text: `Titik lokasi saya: ${coords.lat}, ${coords.lng}`,
      location: {
        lat: coords.lat,
        lng: coords.lng,
        isInstant: true,
        isSharing: false,
      },
    });
    setSendingLocation(false);
  };

  const startTimedLocationShare = async (minutesValue) => {
    if (!activeChatId) return;
    const parsedMinutes = Number(minutesValue);
    if (!parsedMinutes || parsedMinutes <= 0) {
      alert("Masukkan durasi waktu (menit) lebih dari 0 ya.");
      return;
    }

    setShowDurationModal(false);
    setSendingLocation(true);

    const coords = await getCurrentPositionSafe();
    const durationMs = parsedMinutes * 60 * 1000;
    const expiresAt = Date.now() + durationMs;

    const msgId = handleSend(null, {
      text: `Berbagi lokasi langsung (${parsedMinutes} menit): ${coords.lat}, ${coords.lng}`,
      location: {
        lat: coords.lat,
        lng: coords.lng,
        isInstant: false,
        isSharing: true,
        durationMinutes: parsedMinutes,
        expiresAt,
      },
    });

    if (msgId) {
      setActiveShare({ chatId: activeChatId, messageId: msgId, expiresAt });
    }
    setSendingLocation(false);
  };

  const handleSelectLocationOption = (mode) => {
    setShowAttachmentMenu(false);
    setPendingLocationMode(mode);
    const alreadyGranted = localStorage.getItem(LOCATION_CONSENT_KEY) === "true";
    if (!alreadyGranted) {
      setShowLocationPrompt(true);
      return;
    }
    if (mode === "instant") {
      sendInstantLocation();
    } else {
      setShowDurationModal(true);
    }
  };

  const handleAllowLocation = () => {
    try {
      localStorage.setItem(LOCATION_CONSENT_KEY, "true");
    } catch {}
    setShowLocationPrompt(false);
    if (pendingLocationMode === "instant") {
      sendInstantLocation();
    } else {
      setShowDurationModal(true);
    }
  };

  const cancelLocationSharing = (messageId) => {
    if (!activeChatId || !messageId) return;
    stopActiveShare(activeChatId, messageId);
  };

  const openActionMenu = (e, msg) => {
    if (isSelectMode || editingMsgId) return;
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const rect = e?.currentTarget?.getBoundingClientRect?.();
    const x = e?.clientX || (rect ? rect.left : 140);
    const y = e?.clientY || (rect ? rect.top : 180);
    setActionMenuMsg({ msg, x, y });
  };

  const closeActionMenu = () => setActionMenuMsg(null);

  const handleTouchStartMsg = (e, msg) => {
    if (isSelectMode || editingMsgId) return;
    clearTimeout(longPressTimerRef.current);
    const touch = e.touches?.[0];
    longPressTimerRef.current = setTimeout(() => {
      setActionMenuMsg({
        msg,
        x: touch?.clientX || 140,
        y: touch?.clientY || 180,
      });
    }, 500);
  };

  const cancelTouchTimer = () => {
    clearTimeout(longPressTimerRef.current);
  };

  const enterSelectModeWith = (messageId) => {
    setIsSelectMode(true);
    setSelectedMsgIds(messageId ? [messageId] : []);
    setActionMenuMsg(null);
  };

  const toggleSelectMessage = (messageId) => {
    setSelectedMsgIds((prev) =>
      prev.includes(messageId) ? prev.filter((id) => id !== messageId) : [...prev, messageId]
    );
  };

  const exitSelectMode = () => {
    setIsSelectMode(false);
    setSelectedMsgIds([]);
  };

  const promptDeleteSingle = (msg) => {
    setActionMenuMsg(null);
    if (!msg) return;
    setPendingDeleteTarget({ mode: "single", msg });
  };

  const promptDeleteSelected = () => {
    if (selectedMsgIds.length === 0) return;
    setPendingDeleteTarget({ mode: "selected", count: selectedMsgIds.length });
  };

  const cancelDeletePrompt = () => setPendingDeleteTarget(null);

  const confirmDelete = (scope = "self") => {
    if (!activeChatId || !pendingDeleteTarget) return;
    if (pendingDeleteTarget.mode === "single" && pendingDeleteTarget.msg?.id) {
      const targetId = pendingDeleteTarget.msg.id;
      deleteMessage(activeChatId, targetId, scope);
      setSelectedMsgIds((prev) => prev.filter((id) => id !== targetId));
    } else if (pendingDeleteTarget.mode === "selected" && selectedMsgIds.length > 0) {
      deleteMessages(activeChatId, selectedMsgIds, scope);
      exitSelectMode();
    }
    setPendingDeleteTarget(null);
  };

  const handleCopyText = async (text) => {
    if (!text) return;
    try {
      await navigator.clipboard?.writeText(text);
    } catch {}
    setActionMenuMsg(null);
  };

  const handleCopySelected = async () => {
    const joined = messages
      .filter((m) => selectedMsgIds.includes(m.id) && m.text)
      .map((m) => m.text)
      .join("\n");
    if (joined) await handleCopyText(joined);
    exitSelectMode();
  };

  const startEditMessage = (msg) => {
    if (!msg || msg.sender !== role || !msg.text) return;
    setEditingMsgId(msg.id);
    setEditDraftText(msg.text || "");
    setActionMenuMsg(null);
  };

  const cancelEditMessage = () => {
    setEditingMsgId(null);
    setEditDraftText("");
  };

  const saveEditMessage = () => {
    if (!activeChatId || !editingMsgId) return;
    const clean = editDraftText.trim();
    if (!clean) return;
    editMessage(activeChatId, editingMsgId, clean);
    cancelEditMessage();
  };

  const handleOpenViewOnce = (msg) => {
    const isSender = msg.sender === role;
    const alreadyOpened = Array.isArray(msg.openedBy) && msg.openedBy.includes(role);
    if (isSender || alreadyOpened || !msg.image) return;

    setViewingOnceMsg(msg);
    markViewOnceOpened(activeChatId, msg.id);
  };

  const openPreviewImage = (msg) => {
    if (!msg?.image || msg.viewOnce) return;
    setPreviewImageMsg({
      image: msg.image,
      imageName: msg.imageName || `reown-foto-${msg.id}.jpg`,
    });
  };

  const closePreviewImage = () => setPreviewImageMsg(null);

  return {
    role,
    isSeller,
    chats,
    filteredChats,
    searchIndexByChat,
    unreadChatCount,
    activeChatId,
    currentChat,
    messages,
    searchQuery,
    setSearchQuery,
    inputMessage,
    setInputMessage,
    activeTab,
    setActiveTab,
    showAttachmentMenu,
    setShowAttachmentMenu,
    draftImage,
    draftImageName,
    viewOnce,
    setViewOnce,
    clearDraftImage: () => {
      setDraftImage(null);
      setViewOnce(false);
    },
    viewingOnceMsg,
    closeViewingOnce: () => setViewingOnceMsg(null),
    previewImageMsg,
    openPreviewImage,
    closePreviewImage,
    showLocationPrompt,
    closeLocationPrompt: () => setShowLocationPrompt(false),
    showDurationModal,
    closeDurationModal: () => setShowDurationModal(false),
    durationMinutes,
    setDurationMinutes,
    startTimedLocationShare,
    cancelLocationSharing,
    sendingLocation,
    isSelectMode,
    selectedMsgIds,
    editingMsgId,
    editDraftText,
    setEditDraftText,
    actionMenuMsg,
    openActionMenu,
    closeActionMenu,
    handleTouchStartMsg,
    cancelTouchTimer,
    enterSelectModeWith,
    toggleSelectMessage,
    exitSelectMode,
    promptDeleteSingle,
    promptDeleteSelected,
    cancelDeletePrompt,
    confirmDelete,
    pendingDeleteTarget,
    highlightedMsgId,
    messageRefs,
    handleCopyText,
    handleCopySelected,
    startEditMessage,
    cancelEditMessage,
    saveEditMessage,
    fileInputRef,
    bottomRef,
    handleClose,
    goBack,
    handleSelectChat,
    handleSend,
    handleImageUpload,
    handleSelectLocationOption,
    handleAllowLocation,
    handleOpenViewOnce,
  };
}