import { Package, ShieldCheck, RefreshCw, TrendingUp } from 'lucide-react';

// Data 4 Kotak Metrik Statistik
export const metricCards = [
  { id: 'makanan-tersedia', title: 'Total Makanan Tersedia', value: '30', change: '+4 minggu ini', icon: Package, color: '#D95A36' },
  { id: 'makanan-terselamatkan', title: 'Total Makanan Terselamatkan', value: '30', change: '85% target tercapai', icon: ShieldCheck, color: '#2E7D32' },
  { id: 'barang-tersedia', title: 'Total Barang Tersedia', value: '30', change: 'Aktif di etalase', icon: RefreshCw, color: '#0288D1' },
  { id: 'barang-terselamatkan', title: 'Total Barang Terselamatkan', value: '30', change: 'Sukses terjual', icon: TrendingUp, color: '#7B1FA2' },
];

// Data Riwayat Aktivitas
export const initialActivities = [
  { id: 1, time: '14 Okt 2026, 16:30', activity: 'Menambahkan produk baru "Knitwear Cardigan Vintage"', user: 'Siti Rahma', status: 'Berhasil' },
  { id: 2, time: '14 Okt 2026, 14:15', activity: 'Konfirmasi pesanan #INV-8821 masuk', user: 'Budi Santoso', status: 'Diproses' },
  { id: 3, time: '13 Okt 2026, 09:10', activity: 'Memperbarui stok makanan sisa roti panggang', user: 'Admin Seller', status: 'Selesai' },
  { id: 4, time: '12 Okt 2026, 11:45', activity: 'Menyelesaikan transaksi penyelamatan item jaket', user: 'Ahmad Fauzi', status: 'Selesai' },
  { id: 5, time: '11 Okt 2026, 10:20', activity: 'Mengubah harga produk "Burger Daging"', user: 'Siti Rahma', status: 'Selesai' },
];