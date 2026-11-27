"use client";

import React from "react";
import dynamic from "next/dynamic";
import {
  X,
  Search,
  ArrowLeft,
  Send,
  Image as ImageIcon,
  MapPin,
  Clock,
  Paperclip,
  MessageSquare,
  EyeOff,
  SquareX,
  MoreVertical,
  CheckSquare,
  Pencil,
  Copy,
  Trash2,
} from "lucide-react";
import { useChatPopover } from "@/app/hooks/useChatPopover";
import ChatPopoverOverlays from "@/components/ChatPopoverOverlays";

const ChatLocationMap = dynamic(() => import("@/components/ChatLocationMap"), { ssr: false });

function renderHighlightedText(text, query) {
  const cleanText = String(text || "");
  const cleanQuery = String(query || "").trim();
  if (!cleanQuery || !cleanText) return cleanText;

  const escaped = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = cleanText.split(regex);

  return parts.map((part, idx) =>
    part.toLowerCase() === cleanQuery.toLowerCase() ? (
      <mark
        key={idx}
        style={{
          backgroundColor: "#FDE047",
          color: "#1A1A1A",
          padding: "0 2px",
          borderRadius: "3px",
          fontWeight: "700",
        }}
      >
        {part}
      </mark>
    ) : (
      <React.Fragment key={idx}>{part}</React.Fragment>
    )
  );
}

export default function ChatPopover({ isOpen, onClose, externalActiveChatId, onClearActiveChat, storeName }) {
  const ui = useChatPopover({ isOpen, onClose, externalActiveChatId, onClearActiveChat });
  if (!isOpen) return null;

  const { role, isSeller, chats, filteredChats, unreadChatCount, activeChatId, currentChat, messages, activeTab, searchQuery, isSelectMode, selectedMsgIds, actionMenuMsg } = ui;

  const circleBtn = { border: "none", backgroundColor: "#F5F5F5", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#666" };
  const menuItem = { display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "9px 12px", border: "none", background: "none", cursor: "pointer", fontSize: "12px", color: "#1A1A1A", textAlign: "left" };
  const tabBtn = (active) => ({ padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", cursor: "pointer", border: active ? "1px solid #D95A36" : "1px solid #E5E5E5", backgroundColor: active ? "#FFF3ED" : "#FFF", color: active ? "#D95A36" : "#666" });

  return (
    <>
      <div onClick={ui.handleClose} style={{ position: "fixed", inset: 0, zIndex: 998, backgroundColor: "rgba(0,0,0,0.25)", backdropFilter: "blur(4px)" }} />

      <div
        className="reown-chat-popover"
        style={{
          position: "fixed", top: "80px", right: isSeller ? "24px" : "120px", width: "380px", height: "min(520px, calc(100dvh - 100px))",
          maxWidth: "calc(100vw - 24px)", boxSizing: "border-box", backgroundColor: "#FFF", borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.18), 0 4px 12px rgba(217,90,54,0.08)", border: "1px solid rgba(217,90,54,0.12)",
          zIndex: 999, display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "Inter, sans-serif",
        }}
      >
        <style jsx global>{`
          @media (max-width: 900px) { .reown-chat-popover { right: 12px !important; } }
          @media (max-width: 480px) { .reown-chat-popover { left: 12px !important; right: 12px !important; width: auto !important; } }
        `}</style>

        {!activeChatId ? (
          <>
            <div style={{ padding: "18px 20px 12px", borderBottom: "1px solid #F0F0F0", flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h3 style={{ fontFamily: "Fraunces, serif", fontSize: "20px", fontWeight: "700", color: "#1A1A1A", margin: 0 }}>{isSeller ? "Pesan Masuk" : "Pesan"}</h3>
                  {unreadChatCount > 0 && <span style={{ backgroundColor: "#D95A36", color: "#FFF", fontSize: "10px", fontWeight: "bold", padding: "2px 8px", borderRadius: "12px" }}>{unreadChatCount} Baru</span>}
                </div>
                <button onClick={ui.handleClose} style={circleBtn}><X size={16} /></button>
              </div>
              <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                <button onClick={() => ui.setActiveTab("all")} style={tabBtn(activeTab === "all")}>Semua ({chats.length})</button>
                <button onClick={() => ui.setActiveTab("unread")} style={tabBtn(activeTab === "unread")}>Belum Dibaca ({unreadChatCount})</button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#F5F5F5", borderRadius: "20px", padding: "8px 14px" }}>
                <Search size={15} color="#888" />
                <input
                  type="text"
                  placeholder={isSeller ? "Cari pembeli atau isi chat..." : "Cari toko, nama, atau isi chat..."}
                  value={searchQuery}
                  onChange={(e) => ui.setSearchQuery(e.target.value)}
                  style={{ border: "none", background: "transparent", outline: "none", fontSize: "12px", width: "100%" }}
                />
              </div>
            </div>

            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", justifyContent: filteredChats.length === 0 ? "center" : "flex-start", alignItems: filteredChats.length === 0 ? "center" : "stretch", padding: filteredChats.length === 0 ? "20px" : 0, textAlign: "center" }}>
              {filteredChats.length === 0 ? (
                <div>
                  <MessageSquare size={42} color="#E5E7EB" style={{ margin: "0 auto 12px" }} />
                  <p style={{ fontSize: "14px", fontWeight: "700", color: "#1A1A1A", margin: "0 0 4px" }}>{activeTab === "unread" ? "Tidak ada pesan baru" : "Belum ada pesan"}</p>
                  <p style={{ fontSize: "11px", color: "#666", margin: 0, maxWidth: "240px", lineHeight: "1.4" }}>{isSeller ? "Pesan dari pembeli akan muncul di sini." : "Pesan dari penjual atau riwayat chat kamu akan muncul di sini."}</p>
                </div>
              ) : filteredChats.map((chat) => {
                const matchMeta = ui.searchIndexByChat?.[chat.id];
                const isSearchHit = Boolean(searchQuery.trim() && matchMeta);

                return (
                  <div
                    key={chat.id}
                    onClick={() => ui.handleSelectChat(chat.id)}
                    style={{
                      width: isSearchHit ? "calc(100% - 20px)" : "100%",
                      boxSizing: "border-box",
                      padding: "12px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      cursor: "pointer",
                      backgroundColor: isSearchHit ? "#FFF4EE" : chat.unread ? "#FFF8F6" : "#FFF",
                      borderBottom: isSearchHit ? "none" : "1px solid #F8F8F8",
                      border: isSearchHit ? "1.5px solid #D95A36" : undefined,
                      borderRadius: isSearchHit ? "14px" : 0,
                      margin: isSearchHit ? "6px 10px" : 0,
                      transition: "all 0.15s ease",
                    }}
                  >
                    <img
                      src={chat.avatar || "/placeholder.png"}
                      alt={chat.title}
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        flexShrink: 0,
                        outline: isSearchHit ? "2px solid #D95A36" : "none",
                        outlineOffset: "1px",
                      }}
                    />
                    <div style={{ flex: 1, overflow: "hidden", textAlign: "left" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                        <h4 style={{ margin: 0, fontSize: "13px", fontWeight: chat.unread || isSearchHit ? "700" : "600", color: "#1A1A1A" }}>
                          {renderHighlightedText(chat.title, searchQuery)}
                        </h4>
                        <span style={{ fontSize: "10px", color: chat.unread ? "#D95A36" : "#999", fontWeight: chat.unread ? "600" : "400", flexShrink: 0 }}>{chat.time}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: "12px", color: chat.unread ? "#1A1A1A" : "#666", fontWeight: chat.unread ? "600" : "400", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {renderHighlightedText(chat.lastMessage, searchQuery)}
                      </p>

                      {isSearchHit && matchMeta.snippet && (
                        <div
                          style={{
                            marginTop: "5px",
                            fontSize: "10px",
                            color: "#7C2D12",
                            backgroundColor: "#FFF",
                            borderLeft: "2.5px solid #D95A36",
                            padding: "3px 7px",
                            borderRadius: "4px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {renderHighlightedText(matchMeta.snippet, searchQuery)}
                        </div>
                      )}
                    </div>
                    {chat.unread && <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#D95A36", flexShrink: 0 }} />}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #F0F0F0", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: isSelectMode ? "#FFE8DF" : "#FFF3ED", flexShrink: 0 }}>
              {isSelectMode ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button type="button" onClick={ui.exitSelectMode} style={circleBtn}><X size={14} /></button>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#1A1A1A" }}>{selectedMsgIds.length} dipilih</span>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={ui.handleCopySelected}
                      disabled={selectedMsgIds.length === 0}
                      style={{ padding: "5px 10px", borderRadius: "8px", border: "1px solid #DDD", backgroundColor: "#FFF", color: "#1A1A1A", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}
                    >
                      Salin
                    </button>
                    <button
                      type="button"
                      onClick={ui.promptDeleteSelected}
                      disabled={selectedMsgIds.length === 0}
                      style={{ padding: "5px 10px", borderRadius: "8px", border: "none", backgroundColor: "#FEE2E2", color: "#B91C1C", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button onClick={ui.goBack} style={{ border: "none", background: "none", cursor: "pointer", color: "#D95A36", padding: 0, display: "flex" }}><ArrowLeft size={18} /></button>
                    <img src={currentChat?.avatar || "/placeholder.png"} alt={currentChat?.title || "Chat"} style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover" }} />
                    <div>
                      <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "bold", color: "#1A1A1A" }}>{currentChat?.title || storeName}</h4>
                    </div>
                  </div>
                  <button onClick={ui.handleClose} style={circleBtn}><X size={14} /></button>
                </>
              )}
            </div>

            <div style={{ isolation: "isolate", flex: 1, minHeight: 0, padding: "14px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "#FAFAFA" }}>
              {messages.length === 0 && <p style={{ margin: "auto", fontSize: "11px", color: "#999" }}>Belum ada pesan. Sapa duluan yuk 👋</p>}
              {messages.map((msg) => {
                const isMine = msg.sender === role;
                const receiverRole = role === "buyer" ? "seller" : "buyer";
                const alreadyOpened = Array.isArray(msg.openedBy) && msg.openedBy.includes(receiverRole);
                const isExpired = !isMine && msg.viewOnce && !msg.image;
                const isSelected = selectedMsgIds.includes(msg.id);
                const isEditing = ui.editingMsgId === msg.id;
                const isHighlighted = ui.highlightedMsgId === msg.id;

                return (
                  <div
                    key={msg.id}
                    ref={(node) => {
                      if (node) ui.messageRefs.current[msg.id] = node;
                      else delete ui.messageRefs.current[msg.id];
                    }}
                    onClick={isSelectMode ? () => ui.toggleSelectMessage(msg.id) : undefined}
                    onContextMenu={(e) => ui.openActionMenu(e, msg)}
                    onTouchStart={(e) => ui.handleTouchStartMsg(e, msg)}
                    onTouchEnd={ui.cancelTouchTimer}
                    onTouchMove={ui.cancelTouchTimer}
                    style={{
                      alignSelf: isMine ? "flex-end" : "flex-start",
                      maxWidth: isEditing ? "90%" : "84%",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      cursor: isSelectMode ? "pointer" : "default",
                      borderRadius: "14px",
                      outline: isSelected
                        ? "2px solid #D95A36"
                        : isHighlighted
                          ? "2.5px solid #16A34A"
                          : "none",
                      outlineOffset: isHighlighted ? "2px" : "0px",
                      backgroundColor: isSelected
                        ? "rgba(217, 90, 54, 0.08)"
                        : isHighlighted
                          ? "rgba(149, 245, 124, 0.22)"
                          : "transparent",
                      padding: isSelected || isHighlighted ? "3px" : 0,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {isSelectMode && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        style={{ cursor: "pointer", accentColor: "#D95A36" }}
                      />
                    )}

                    {!isSelectMode && isMine && !isEditing && (
                      <button
                        type="button"
                        onClick={(e) => ui.openActionMenu(e, msg)}
                        aria-label="Opsi pesan"
                        style={{ border: "none", background: "transparent", color: "#999", cursor: "pointer", padding: "2px", display: "flex" }}
                      >
                        <MoreVertical size={13} />
                      </button>
                    )}

                    <div style={{ flex: 1, minWidth: isEditing ? "195px" : 0 }}>
                      <div style={{ padding: "10px 14px", borderRadius: "14px", backgroundColor: isMine ? "#D95A36" : "#FFF", color: isMine ? "#FFF" : "#1A1A1A", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", fontSize: "12px", lineHeight: "1.4", border: isMine ? "none" : "1px solid #E5E5E5", wordBreak: "break-word" }}>
                        {msg.viewOnce ? (
                          isMine ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
                              <EyeOff size={14} />
                              <span>{alreadyOpened ? "Foto sekali lihat • Dibuka" : "Foto sekali lihat"}</span>
                            </div>
                          ) : isExpired ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#666", fontSize: "11px" }}>
                              <EyeOff size={14} />
                              <span>Foto sekali lihat • Sudah dibuka</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => ui.handleOpenViewOnce(msg)}
                              style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 10px", borderRadius: "10px", border: "1px solid #FDBA74", backgroundColor: "#FFF7ED", color: "#C2410C", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}
                            >
                              <EyeOff size={14} /> Foto sekali lihat
                            </button>
                          )
                        ) : msg.image && (
                          <button type="button" onClick={() => !isSelectMode && ui.openPreviewImage(msg)} style={{ padding: 0, border: "none", background: "transparent", cursor: "pointer", display: "block", marginBottom: msg.text ? "8px" : 0 }}>
                            <img src={msg.image} alt={msg.imageName || "Lampiran"} style={{ display: "block", maxWidth: "100%", maxHeight: "180px", borderRadius: "10px", objectFit: "cover" }} />
                          </button>
                        )}

                        {msg.location && (
                          <div style={{ marginBottom: msg.text ? "8px" : 0, width: "210px", maxWidth: "100%" }}>
                            <ChatLocationMap lat={msg.location.lat} lng={msg.location.lng} height="130px" />
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "6px" }}>
                              <a href={`https://www.openstreetmap.org/?mlat=${msg.location.lat || 1.1301}&mlon=${msg.location.lng || 104.0529}#map=16/${msg.location.lat || 1.1301}/${msg.location.lng || 104.0529}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", fontWeight: "600", color: isMine ? "#FFF7ED" : "#D95A36", textDecoration: "underline" }}>
                                Buka di OpenStreetMap
                              </a>
                              {msg.location.isSharing && isMine && (
                                <button type="button" onClick={() => ui.cancelLocationSharing(msg.id)} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "6px 10px", borderRadius: "8px", border: "none", backgroundColor: "#FEE2E2", color: "#B91C1C", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>
                                  <SquareX size={13} /> Batalkan Sharing Map
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {isEditing ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
                            <input
                              type="text"
                              value={ui.editDraftText}
                              onChange={(e) => ui.setEditDraftText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  ui.saveEditMessage();
                                } else if (e.key === "Escape") {
                                  ui.cancelEditMessage();
                                }
                              }}
                              autoFocus
                              style={{
                                width: "100%",
                                boxSizing: "border-box",
                                padding: "6px 10px",
                                borderRadius: "8px",
                                border: "1px solid rgba(255,255,255,0.45)",
                                backgroundColor: "rgba(0,0,0,0.22)",
                                fontSize: "12px",
                                color: "#FFFFFF",
                                outline: "none",
                              }}
                            />
                            <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                              <button type="button" onClick={ui.cancelEditMessage} style={{ padding: "4px 8px", borderRadius: "6px", border: "none", backgroundColor: "rgba(0,0,0,0.25)", color: "#FFF", fontSize: "10px", cursor: "pointer" }}>Batal</button>
                              <button type="button" onClick={ui.saveEditMessage} style={{ padding: "4px 10px", borderRadius: "6px", border: "none", backgroundColor: "#95F57C", color: "#1A1A1A", fontSize: "10px", fontWeight: "700", cursor: "pointer" }}>Simpan</button>
                            </div>
                          </div>
                        ) : (
                          msg.text && <div>{renderHighlightedText(msg.text, searchQuery)}</div>
                        )}
                      </div>
                      <span style={{ fontSize: "9px", color: "#999", marginTop: "2px", display: "block", textAlign: isMine ? "right" : "left" }}>
                        {msg.edited ? `diedit • ${msg.time}` : msg.time}
                      </span>
                    </div>

                    {!isSelectMode && !isMine && (
                      <button
                        type="button"
                        onClick={(e) => ui.openActionMenu(e, msg)}
                        aria-label="Opsi pesan"
                        style={{ border: "none", background: "transparent", color: "#999", cursor: "pointer", padding: "2px", display: "flex" }}
                      >
                        <MoreVertical size={13} />
                      </button>
                    )}
                  </div>
                );
              })}
              <div ref={ui.bottomRef} />
            </div>

            {actionMenuMsg && (
              <div onClick={ui.closeActionMenu} style={{ position: "absolute", inset: 0, zIndex: 1150, backgroundColor: "rgba(0,0,0,0.2)" }}>
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: "absolute",
                    bottom: "68px",
                    right: "16px",
                    width: "175px",
                    backgroundColor: "#FFF",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                    border: "1px solid #EFEFEF",
                    overflow: "hidden",
                  }}
                >
                  <button type="button" style={menuItem} onClick={() => ui.enterSelectModeWith(actionMenuMsg.msg.id)}>
                    <CheckSquare size={14} color="#D95A36" /> Pilih Pesan
                  </button>
                  {actionMenuMsg.msg.sender === role && actionMenuMsg.msg.text && (
                    <button type="button" style={menuItem} onClick={() => ui.startEditMessage(actionMenuMsg.msg)}>
                      <Pencil size={14} color="#D95A36" /> Edit Pesan
                    </button>
                  )}
                  {actionMenuMsg.msg.text && (
                    <button type="button" style={menuItem} onClick={() => ui.handleCopyText(actionMenuMsg.msg.text)}>
                      <Copy size={14} color="#D95A36" /> Salin Teks
                    </button>
                  )}
                  <button type="button" style={{ ...menuItem, color: "#B91C1C" }} onClick={() => ui.promptDeleteSingle(actionMenuMsg.msg)}>
                    <Trash2 size={14} color="#B91C1C" /> Hapus Pesan
                  </button>
                </div>
              </div>
            )}

            <ChatPopoverOverlays
              previewImageMsg={ui.previewImageMsg} closePreviewImage={ui.closePreviewImage}
              viewingOnceMsg={ui.viewingOnceMsg} closeViewingOnce={ui.closeViewingOnce}
              showDurationModal={ui.showDurationModal} closeDurationModal={ui.closeDurationModal}
              durationMinutes={ui.durationMinutes} setDurationMinutes={ui.setDurationMinutes}
              startTimedLocationShare={ui.startTimedLocationShare}
              showLocationPrompt={ui.showLocationPrompt} closeLocationPrompt={ui.closeLocationPrompt}
              handleAllowLocation={ui.handleAllowLocation}
              pendingDeleteTarget={ui.pendingDeleteTarget}
              cancelDeletePrompt={ui.cancelDeletePrompt}
              confirmDelete={ui.confirmDelete}
              isSeller={isSeller}
            />

            {ui.draftImage && (
              <div style={{ padding: "8px 14px", borderTop: "1px solid #F0F0F0", backgroundColor: "#FFF8F6", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                  <img src={ui.draftImage} alt="Preview" style={{ width: "38px", height: "38px", borderRadius: "8px", objectFit: "cover" }} />
                  <span style={{ fontSize: "11px", color: "#333", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ui.draftImageName}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                  <button type="button" onClick={() => ui.setViewOnce((v) => !v)} style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "5px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "600", cursor: "pointer", border: ui.viewOnce ? "1px solid #D95A36" : "1px solid #DDD", backgroundColor: ui.viewOnce ? "#D95A36" : "#FFF", color: ui.viewOnce ? "#FFF" : "#555" }}>
                    <EyeOff size={12} /> Sekali lihat
                  </button>
                  <button type="button" onClick={ui.clearDraftImage} style={circleBtn}><X size={13} /></button>
                </div>
              </div>
            )}

            {ui.showAttachmentMenu && (
              <div style={{ position: "absolute", left: "14px", bottom: "58px", backgroundColor: "#FFF", borderRadius: "12px", boxShadow: "0 6px 20px rgba(0,0,0,0.15)", border: "1px solid #F0F0F0", overflow: "hidden", zIndex: 2 }}>
                <button type="button" style={menuItem} onClick={() => ui.fileInputRef.current?.click()}><ImageIcon size={15} color="#D95A36" /> Gambar (PNG, JPG, JPEG, dll.)</button>
                <button type="button" style={menuItem} onClick={() => ui.handleSelectLocationOption("instant")} disabled={ui.sendingLocation}><MapPin size={15} color="#D95A36" /> {ui.sendingLocation ? "Mengambil lokasi..." : "Lokasi Langsung"}</button>
                <button type="button" style={menuItem} onClick={() => ui.handleSelectLocationOption("timed")} disabled={ui.sendingLocation}><Clock size={15} color="#D95A36" /> Bagi Lokasi Berwaktu</button>
              </div>
            )}
            <input ref={ui.fileInputRef} type="file" accept="image/*" onChange={ui.handleImageUpload} style={{ display: "none" }} />

            <form onSubmit={ui.handleSend} style={{ padding: "10px 14px", borderTop: "1px solid #F0F0F0", backgroundColor: "#FFF", display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
              <button type="button" onClick={() => ui.setShowAttachmentMenu((v) => !v)} style={{ border: "none", backgroundColor: "#F5F5F5", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#D95A36" }}><Paperclip size={16} /></button>
              <input type="text" placeholder={isSeller ? "Balas pesan pembeli..." : "Tulis pesan..."} value={ui.inputMessage} onChange={(e) => ui.setInputMessage(e.target.value)} style={{ flex: 1, minWidth: 0, padding: "8px 14px", borderRadius: "20px", border: "1px solid #E5E5E5", outline: "none", fontSize: "12px" }} />
              <button type="submit" style={{ backgroundColor: "#D95A36", border: "none", borderRadius: "50%", width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#FFF" }}><Send size={14} /></button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}