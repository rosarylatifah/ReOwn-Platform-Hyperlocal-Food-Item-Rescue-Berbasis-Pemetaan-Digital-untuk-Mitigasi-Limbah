export type RemovalSource = "laporan" | "langsung" | "akun" | "ban";

export interface Removal {
  reason: string;
  by: string;
  at: string; // ISO
  source: RemovalSource;
}

export interface Product {
  id: string;
  name: string;
  category: "Makanan" | "Barang";
  emoji: string; // placeholder bila belum ada foto
  image?: string; // path di /public/images atau URL
  sellerId: string;
  price: number; // 0 = gratis
  address: string;
  description: string;
  uploadedAt: string;
  expiresAt?: string;
  status: "aktif" | "diturunkan";
  removal?: Removal;
}

export type UserStatus = "aktif" | "peringatan" | "suspend" | "banned";

export interface AppUser {
  id: string;
  username: string;
  email: string;
  phone: string;
  joinedAt: string;
  status: UserStatus;
  warnings: number;
  sanction?: { reason: string; at: string };
}

export type Sanction = "turunkan_produk" | "peringatan" | "suspend" | "ban";

export interface Report {
  id: string;
  createdAt: string;
  reporterId: string;
  reportedUserId: string;
  productId?: string;
  category: string;
  detail: string;
  evidenceUrl?: string;
  status: "baru" | "diproses" | "selesai";
  outcome?: "diterima" | "ditolak";
  sanction?: Sanction;
  adminNote?: string;
  handledAt?: string;
}

export interface Appeal {
  id: string;
  createdAt: string;
  userId: string;
  productId?: string; // kosong = banding atas sanksi akun
  message: string;
  evidence?: string[]; // bukti banding (URL gambar)
  status: "menunggu" | "diterima" | "ditolak";
  adminNote?: string;
  handledAt?: string;
}

/** Rujukan terstruktur dari satu aktivitas ke objek yang terlibat. */
export interface ActivityRefs {
  userId?: string;
  productId?: string;
  reportId?: string;
  appealId?: string;
}

export interface Activity {
  id: string;
  at: string;
  actor: string;
  actorEmail: string;
  actorKind: "admin" | "pengguna";
  text: string;
  status: "Selesai" | "Belum ditindak" | "Diproses";
  href?: string;
  refs?: ActivityRefs;
  note?: string; // alasan / catatan admin
}

