/**
 * Gambar bukti CONTOH (SVG data-URI) supaya tampilan bukti dan lightbox bisa dicoba.
 * Warna dibuat netral agar tidak menambah warna di panel. Parameter ketiga diabaikan
 * (dipertahankan supaya pemanggilan lama di data.ts tetap valid).
 * Ganti dengan URL berkas yang diunggah pengguna saat backend siap.
 */
export function evidenceImage(title, subtitle, _color) {
  void _color;
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420">` +
    `<rect width="640" height="420" fill="#efe9df"/>` +
    `<rect x="24" y="24" width="592" height="372" rx="20" fill="#fff" opacity=".75"/>` +
    `<text x="48" y="96" font-family="sans-serif" font-size="30" font-weight="700" fill="#1d1712">${esc(title)}</text>` +
    `<text x="48" y="140" font-family="sans-serif" font-size="20" fill="#6b645c">${esc(subtitle)}</text>` +
    `<g fill="#1d1712" opacity=".12"><rect x="48" y="190" width="420" height="16" rx="8"/>` +
    `<rect x="48" y="226" width="520" height="16" rx="8"/><rect x="48" y="262" width="360" height="16" rx="8"/></g></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}