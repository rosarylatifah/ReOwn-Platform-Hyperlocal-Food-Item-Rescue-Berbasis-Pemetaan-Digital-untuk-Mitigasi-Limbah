import { ADMIN_NAV, isActive } from "./nav";

export const HELP = {
  "/admin": {
    title: "Panel Admin",
    about: "Ringkasan kondisi ReOwn hari ini: berapa pengguna dan produk aktif, serta apa saja yang menunggu keputusanmu.",
    steps: [
      "Lihat kartu oranye untuk tahu berapa laporan dan banding yang menunggu.",
      "Di “Perlu ditinjau sekarang”, mulai dari item paling atas karena itu yang paling lama menunggu.",
      "Pantau grafik 14 hari untuk melihat apakah laporan sedang naik.",
      "Cek riwayat di bagian bawah untuk melihat apa yang baru terjadi.",
    ],
    tips: ["Chip merah berarti sudah menunggu 3 hari atau lebih."],
  },
  "/admin/laporan": {
    title: "Kelola Laporan",
    about: "Tempat memutuskan laporan dari pengguna dan banding dari penjual yang merasa kena sanksi keliru.",
    steps: [
      "Pilih tab Laporan baru, lalu klik Tinjau.",
      "Baca keterangan, bukti, dan kotak “Konteks untuk keputusan”.",
      "Klik Terima lalu pilih sanksi, atau Tolak dan tulis alasannya.",
      "Buka tab Banding untuk menilai keberatan dari penjual.",
    ],
    tips: [
      "Kotak kuning berarti terlapor juga pernah melaporkan pelapor. Bisa jadi laporan balasan.",
      "Semua keputusan tercatat otomatis di Riwayat Aktivitas.",
    ],
  },
  "/admin/pesan": {
    title: "Pesan Masuk",
    about: "Pertanyaan, saran, dan kendala yang dikirim pengguna lewat halaman Hubungi. Hanya pengguna yang punya akun yang bisa mengirim.",
    steps: [
      "Mulai dari tab Masuk. Pesan yang belum dibuka berstatus Baru.",
      "Klik Buka untuk membaca isinya, lalu tulis balasan dan klik Kirim balasan.",
      "Klik Tandai selesai bila urusannya sudah beres. Pesan pindah ke tab Selesai.",
    ],
    tips: [
      "Balasanmu tampil langsung di halaman Hubungi milik pengirim.",
      "Pesan bertanda Kendala biasanya lebih mendesak dibanding Saran.",
    ],
  },
  "/admin/produk": {
    title: "Kelola Produk",
    about: "Daftar semua produk yang sedang tampil di katalog. Dari sini admin bisa menurunkan produk yang melanggar.",
    steps: [
      "Cari berdasarkan nama produk atau penjual, atau saring per kategori.",
      "Klik Lihat detail untuk memeriksa isi dan jejak kasus produk.",
      "Klik Turunkan, pilih alasan, lalu konfirmasi.",
    ],
    tips: ["Produk yang diturunkan tidak terhapus. Ia pindah ke halaman Dihapus dan bisa dipulihkan."],
  },
  "/admin/pengguna": {
    title: "Kelola Pengguna",
    about: "Daftar akun beserta statusnya. Dari sini admin memberi peringatan, men-suspend, mem-ban, atau memulihkan akun.",
    steps: [
      "Cari username atau email, atau saring per status.",
      "Klik Detail untuk melihat riwayat laporan dan jejak kasus akun.",
      "Pilih tindakan, tulis alasan, lalu konfirmasi.",
    ],
    tips: ["Mulai dari yang paling ringan: peringatan, lalu suspend, dan ban hanya untuk pelanggaran berat."],
  },
  "/admin/dihapus": {
    title: "Produk dan Akun Dihapus",
    about: "Arsip produk yang diturunkan dan akun yang disuspend atau di-ban, lengkap dengan alasan dan pelakunya.",
    steps: [
      "Pilih tab Produk atau Akun.",
      "Baca alasan dan tanggalnya sebelum memutuskan.",
      "Klik Pulihkan bila keputusan sebelumnya perlu dibatalkan.",
    ],
    tips: [
      "Chip “Ada banding” berarti penjual sudah mengajukan keberatan. Tinjau dulu di Kelola Laporan.",
      "Memulihkan akun yang di-ban tidak otomatis memulihkan produknya. Pulihkan manual dari tab Produk.",
    ],
  },
  "/admin/riwayat": {
    title: "Riwayat Aktivitas",
    about: "Catatan semua kejadian penting: tindakan admin dan aktivitas pengguna yang perlu perhatian.",
    steps: [
      "Cari kata kunci, atau saring per jenis dan rentang tanggal.",
      "Klik Buka pada baris untuk menuju halaman terkait.",
    ],
    tips: ["Catatan ini tidak bisa diubah dari panel, jadi bisa dipakai sebagai bukti keputusan."],
  },
};

export const LEGEND = [
  { term: "Baru", tone: "warn", meaning: "Laporan yang belum dibuka admin." },
  { term: "Diproses", tone: "info", meaning: "Laporan sudah dibuka tetapi belum diputuskan." },
  { term: "Diterima", tone: "ok", meaning: "Laporan atau banding disetujui, sanksi atau pemulihan diterapkan." },
  { term: "Ditolak", tone: "muted", meaning: "Laporan atau banding tidak disetujui." },
  { term: "Aktif", tone: "ok", meaning: "Akun normal tanpa sanksi berjalan." },
  { term: "Diperingatkan", tone: "warn", meaning: "Ada peringatan tercatat, akun masih bisa dipakai." },
  { term: "Disuspend", tone: "warn", meaning: "Akun tidak bisa masuk dan produknya diturunkan. Bisa dipulihkan." },
  { term: "Banned", tone: "bad", meaning: "Diblokir permanen. Produknya harus dipulihkan manual bila akunnya dipulihkan." },
  { term: "Diturunkan", tone: "bad", meaning: "Produk tidak tampil di katalog dan ada di halaman Dihapus." },
];

export function helpFor(pathname) {
  const nav = ADMIN_NAV.find((n) => isActive(pathname, n.href)) ?? ADMIN_NAV[0];
  return HELP[nav.href];
}