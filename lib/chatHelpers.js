export const CHAT_STORAGE_KEY = "reown_chat";
export const LOCATION_CONSENT_KEY = "reown_location_permission_granted";
export const EMPTY_CHAT_DATA = { chats: [], messages: {} };

export const readChatStorage = () => {
  if (typeof window === "undefined") return EMPTY_CHAT_DATA;
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : EMPTY_CHAT_DATA;
  } catch {
    return EMPTY_CHAT_DATA;
  }
};

export const writeChatStorage = (data) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

export const formatChatTime = (ts) =>
  new Date(ts).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

export const avatarFor = (name = "?") =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='88' height='88'><rect width='88' height='88' fill='#D95A36'/><text x='50%' y='50%' dy='.35em' text-anchor='middle' font-family='sans-serif' font-size='40' fill='white'>${(name[0] || "?").toUpperCase()}</text></svg>`
  );

export function compressImageFile(file, maxWidth = 900, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
        resolve(canvas.toDataURL(outputType, outputType === "image/png" ? undefined : quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}