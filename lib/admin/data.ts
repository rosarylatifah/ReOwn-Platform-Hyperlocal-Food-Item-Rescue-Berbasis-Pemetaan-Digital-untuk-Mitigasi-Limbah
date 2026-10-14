import { evidenceImage } from "./placeholder";
import type { Activity, Appeal, AppUser, Product, Report } from "./types";

/**
 * DATA CONTOH. Ganti dengan fetch ke backend/database kalian.
 * Tanggal dibuat RELATIF terhadap hari ini (WIB), jadi "menunggu N hari"
 * dan grafik 14 hari selalu terlihat hidup saat didemokan.
 */
const DAY = 86_400_000;
const ymd = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(d);
/** ago(3, "14:20") = 3 hari lalu pukul 14:20 WIB. Angka negatif = masa depan. */
const ago = (days: number, hm: string) => `${ymd(new Date(Date.now() - days * DAY))}T${hm}:00+07:00`;

export const seedUsers: AppUser[] = [
  { id: "u1", username: "jenny.ik", email: "jenny@gmail.com", phone: "0812 1111 0001", joinedAt: ago(120, "09:00"), status: "aktif", warnings: 0 },
  { id: "u2", username: "marryy.wk", email: "marryy@gmail.com", phone: "0812 1111 0002", joinedAt: ago(110, "14:30"), status: "aktif", warnings: 0 },
  { id: "u3", username: "harr.yyy", email: "harry@gmail.com", phone: "0812 1111 0003", joinedAt: ago(100, "10:15"), status: "aktif", warnings: 0 },
  { id: "u4", username: "will.lyy", email: "will@gmail.com", phone: "0812 1111 0004", joinedAt: ago(90, "16:45"), status: "aktif", warnings: 0 },
  { id: "u5", username: "cinta.lauu", email: "cinta@gmail.com", phone: "0812 1111 0005", joinedAt: ago(85, "08:20"), status: "peringatan", warnings: 1, sanction: { reason: "Makanan tidak layak konsumsi", at: ago(9, "15:00") } },
  { id: "u6", username: "dena.v", email: "dena@gmail.com", phone: "0812 1111 0006", joinedAt: ago(70, "11:00"), status: "aktif", warnings: 0 },
  { id: "u7", username: "community.garden", email: "garden@gmail.com", phone: "0812 1111 0007", joinedAt: ago(60, "13:10"), status: "aktif", warnings: 0 },
  { id: "u8", username: "artisan.bakery", email: "bakery@gmail.com", phone: "0812 1111 0008", joinedAt: ago(55, "07:30"), status: "aktif", warnings: 0 },
  { id: "u9", username: "raka.pm", email: "raka@gmail.com", phone: "0812 1111 0009", joinedAt: ago(45, "19:00"), status: "banned", warnings: 1, sanction: { reason: "Menjual obat tanpa izin edar", at: ago(22, "10:00") } },
  { id: "u10", username: "dewi.s", email: "dewi@gmail.com", phone: "0812 1111 0010", joinedAt: ago(40, "12:00"), status: "suspend", warnings: 2, sanction: { reason: "Beberapa laporan penipuan", at: ago(17, "09:00") } },
];

export const seedProducts: Product[] = [
  { id: "p1", name: "Burger Daging", category: "Makanan", emoji: "🍔", sellerId: "u2", price: 15000, address: "Jl. Engku Putri No. 12, Batam Centre", description: "Burger daging sapi sisa pesanan katering, dikemas rapi dan masih hangat.", uploadedAt: ago(3, "10:20"), expiresAt: ago(-1, "20:00"), status: "aktif" },
  { id: "p2", name: "Fresh Sourdough Boule", category: "Makanan", emoji: "🍞", sellerId: "u8", price: 0, address: "Ruko Mitra Raya Blok C, Batam Centre", description: "Roti sourdough sisa produksi hari ini. Ambil sebelum tutup toko.", uploadedAt: ago(2, "08:00"), expiresAt: ago(-1, "21:00"), status: "aktif" },
  { id: "p3", name: "Heirloom Tomato Box", category: "Makanan", emoji: "🍅", sellerId: "u7", price: 0, address: "Community Garden, Sekupang", description: "Satu kotak tomat hasil kebun komunitas. Gratis untuk tetangga.", uploadedAt: ago(2, "07:15"), expiresAt: ago(-3, "18:00"), status: "aktif" },
  { id: "p4", name: "Vintage Glass Carafe", category: "Barang", emoji: "🫗", sellerId: "u6", price: 15000, address: "Perumahan Taman Raya, Batu Aji", description: "Karaf kaca antik, kondisi bagus tanpa retak.", uploadedAt: ago(6, "15:40"), status: "aktif" },
  { id: "p5", name: "Nasi Kotak Sisa Katering", category: "Makanan", emoji: "🍱", sellerId: "u3", price: 0, address: "Jl. Raja Ali Haji, Batam Kota", description: "20 kotak nasi sisa acara kantor, lauk lengkap.", uploadedAt: ago(1, "12:10"), expiresAt: ago(-1, "20:00"), status: "aktif" },
  { id: "p6", name: "Kursi Kayu Hijau", category: "Barang", emoji: "🪑", sellerId: "u4", price: 75000, address: "Jl. Ahmad Yani, Batam Kota", description: "Kursi kayu jati dicat hijau, ada goresan kecil di kaki.", uploadedAt: ago(13, "17:25"), status: "aktif" },
  { id: "p7", name: "Roti Tawar Mendekati Kedaluwarsa", category: "Makanan", emoji: "🥖", sellerId: "u8", price: 0, address: "Ruko Mitra Raya Blok C, Batam Centre", description: "Roti tawar 5 bungkus.", uploadedAt: ago(5, "09:00"), status: "diturunkan", removal: { reason: "Deskripsi atau foto menyesatkan", by: "Admin", at: ago(4, "08:30"), source: "langsung" } },
  { id: "p8", name: "Obat Batuk Racikan", category: "Barang", emoji: "💊", sellerId: "u9", price: 20000, address: "Jl. Imam Bonjol, Nagoya", description: "Obat batuk racikan sendiri.", uploadedAt: ago(23, "20:00"), status: "diturunkan", removal: { reason: "Barang ilegal atau dilarang", by: "Admin", at: ago(22, "10:00"), source: "ban" } },
];

export const seedReports: Report[] = [
  { id: "r1", createdAt: ago(2, "23:00"), reporterId: "u1", reportedUserId: "u2", productId: "p1", category: "Menjual barang ilegal", detail: "Penjual menawarkan barang yang dilarang beredar. Lihat bukti percakapan.", evidenceUrl: evidenceImage("Bukti percakapan", "Tangkapan layar chat jenny.ik dan marryy.wk"), status: "baru" },
  { id: "r2", createdAt: ago(3, "13:00"), reporterId: "u2", reportedUserId: "u1", category: "Menjual barang ilegal", detail: "Akun ini menawarkan barang ilegal lewat pesan pribadi.", status: "diproses" },
  { id: "r3", createdAt: ago(5, "11:00"), reporterId: "u3", reportedUserId: "u4", productId: "p6", category: "Barang tidak sesuai deskripsi", detail: "Kondisi kursi jauh lebih buruk dari foto di listing.", evidenceUrl: evidenceImage("Foto kursi", "Kondisi barang saat diterima", "#d9e6d0"), status: "baru" },
  { id: "r4", createdAt: ago(7, "17:00"), reporterId: "u5", reportedUserId: "u3", category: "Penipuan", detail: "Pesanan tidak pernah diserahkan.", status: "selesai", outcome: "ditolak", adminNote: "Bukti tidak cukup untuk menindak.", handledAt: ago(6, "10:00") },
  { id: "r5", createdAt: ago(9, "12:03"), reporterId: "u4", reportedUserId: "u5", category: "Makanan tidak layak konsumsi", detail: "Makanan sudah berbau saat diterima.", status: "selesai", outcome: "diterima", sanction: "peringatan", adminNote: "Peringatan pertama.", handledAt: ago(9, "15:00") },
  { id: "r6", createdAt: ago(11, "10:30"), reporterId: "u7", reportedUserId: "u4", productId: "p6", category: "Barang tidak sesuai deskripsi", detail: "Foto kursi di listing berbeda dengan barang aslinya.", status: "selesai", outcome: "ditolak", adminNote: "Foto sudah diperbarui penjual.", handledAt: ago(10, "09:00") },
];

export const seedAppeals: Appeal[] = [
  { id: "a1", createdAt: ago(3, "21:15"), userId: "u8", productId: "p7", message: "Foto sudah saya ganti dan tanggal kedaluwarsa sudah diperbarui. Mohon listing dipulihkan.", evidence: [evidenceImage("Foto baru roti", "Foto yang diperbarui penjual", "#f0e0b8"), evidenceImage("Label kedaluwarsa", "Tanggal sudah diperbarui", "#e0ecf5")], status: "menunggu" },
  { id: "a2", createdAt: ago(4, "09:40"), userId: "u10", message: "Laporan penipuan terjadi karena salah paham dengan pembeli. Pembayaran sudah saya kembalikan.", evidence: [evidenceImage("Bukti pengembalian dana", "Transfer Rp50.000 ke pembeli", "#dfe9d8")], status: "menunggu" },
];

/** Urutan: terbaru di atas (store menambahkan aktivitas baru di paling atas). */
export const seedActivities: Activity[] = [
  { id: "x1", at: ago(2, "23:00"), actor: "jenny.ik", actorEmail: "jenny@gmail.com", actorKind: "pengguna", text: "Pengguna melaporkan produk “Burger Daging”", status: "Belum ditindak", href: "/admin/laporan", refs: { reportId: "r1", productId: "p1", userId: "u2" } },
  { id: "x2", at: ago(3, "21:15"), actor: "artisan.bakery", actorEmail: "bakery@gmail.com", actorKind: "pengguna", text: "Pengguna mengajukan banding atas produk “Roti Tawar Mendekati Kedaluwarsa”", status: "Belum ditindak", href: "/admin/laporan", refs: { appealId: "a1", productId: "p7", userId: "u8" } },
  { id: "x3", at: ago(3, "13:00"), actor: "marryy.wk", actorEmail: "marryy@gmail.com", actorKind: "pengguna", text: "Pengguna melaporkan akun lain", status: "Diproses", href: "/admin/laporan", refs: { reportId: "r2", userId: "u1" } },
  { id: "x4", at: ago(4, "09:40"), actor: "dewi.s", actorEmail: "dewi@gmail.com", actorKind: "pengguna", text: "Pengguna mengajukan banding atas suspend akun", status: "Belum ditindak", href: "/admin/laporan", refs: { appealId: "a2", userId: "u10" } },
  { id: "x5", at: ago(4, "08:30"), actor: "Admin", actorEmail: "admin@reown.org", actorKind: "admin", text: "Admin menurunkan produk “Roti Tawar Mendekati Kedaluwarsa” (Deskripsi atau foto menyesatkan)", status: "Selesai", href: "/admin/dihapus", refs: { productId: "p7", userId: "u8" }, note: "Deskripsi atau foto menyesatkan" },
  { id: "x6", at: ago(5, "11:00"), actor: "harr.yyy", actorEmail: "harry@gmail.com", actorKind: "pengguna", text: "Pengguna melaporkan produk “Kursi Kayu Hijau”", status: "Belum ditindak", href: "/admin/laporan", refs: { reportId: "r3", productId: "p6", userId: "u4" } },
  { id: "x7", at: ago(6, "10:00"), actor: "Admin", actorEmail: "admin@reown.org", actorKind: "admin", text: "Admin menolak laporan terhadap @harr.yyy", status: "Selesai", href: "/admin/laporan", refs: { reportId: "r4", userId: "u3" }, note: "Bukti tidak cukup untuk menindak." },
  { id: "x8", at: ago(9, "15:00"), actor: "Admin", actorEmail: "admin@reown.org", actorKind: "admin", text: "Admin menerima laporan terhadap @cinta.lauu (Beri peringatan)", status: "Selesai", href: "/admin/laporan", refs: { reportId: "r5", userId: "u5" }, note: "Peringatan pertama." },
  { id: "x9", at: ago(10, "09:00"), actor: "Admin", actorEmail: "admin@reown.org", actorKind: "admin", text: "Admin menolak laporan terhadap @will.lyy", status: "Selesai", href: "/admin/laporan", refs: { reportId: "r6", productId: "p6", userId: "u4" }, note: "Foto sudah diperbarui penjual." },
  { id: "x10", at: ago(17, "09:00"), actor: "Admin", actorEmail: "admin@reown.org", actorKind: "admin", text: "Admin men-suspend @dewi.s (Beberapa laporan penipuan)", status: "Selesai", href: "/admin/pengguna", refs: { userId: "u10" }, note: "Beberapa laporan penipuan" },
  { id: "x11", at: ago(22, "10:00"), actor: "Admin", actorEmail: "admin@reown.org", actorKind: "admin", text: "Admin mem-ban @raka.pm (Menjual obat tanpa izin edar)", status: "Selesai", href: "/admin/pengguna", refs: { userId: "u9", productId: "p8" }, note: "Menjual obat tanpa izin edar" },
];