# ReOwn: Landing Page

Next.js 15 (App Router) + TypeScript + Tailwind CSS 4 + Leaflet (OpenStreetMap).

## Cara menjalankan

```bash
npm install
npm run dev
```

Lalu buka http://localhost:3000

Perlu internet saat pertama kali jalan, karena font (Google Fonts) dan tile peta (OpenStreetMap) diunduh online.

## Struktur folder

```
app/
  layout.tsx            font utama, judul situs, warna latar #FFF7E9
  globals.css           Tailwind + gaya dasar
  page.tsx              halaman landing (merakit semua section)
  katalog/page.tsx      contoh halaman lain (cara memakai Navbar & Footer)
components/
  common/               dipakai lintas halaman: Navbar, Footer, Logo, ItemCard, ScrollAwareHeader
  landing/              khusus landing: Hero, Peta, ValueProposition, Kategori, Carousel, dst.
  ui/                   SectionHeading, StatusDot
lib/
  fonts.ts              semua font (next/font/google)
  navigation.ts         daftar link Navbar & Footer
  stats.ts              jumlah barang terselamatkan bulan ini (sambungkan ke database di sini)
types/item.ts           tipe data barang
public/images/          gambar (lihat di bawah)
```

## Gambar

Folder `public/images/` berisi gambar PLACEHOLDER supaya halaman langsung tampil.
Ganti dengan fotomu sendiri, pakai nama file yang sama:

| File | Dipakai di |
|---|---|
| `piring.png` | piring makanan (kartu "Makanan Berlebih") |
| `sofa.png` | sofa, PNG transparan (kartu "Barang bekas") |
| `roti.jpg` | roti sourdough |
| `karafe.jpg` | botol kaca amber |
| `tomat.jpg` | keranjang tomat |
| `peta-bw.jpg` | peta hitam-putih (kartu "Cari Barang") |

## Yang perlu disambungkan nanti

- **Database:** isi fungsi `getMonthlyRescuedCount()` di `lib/stats.ts` (sudah ada contoh Prisma & Supabase).
- **Data barang:** `ItemGrid.tsx` (carousel) dan `LeafletMap.tsx` (pin peta) masih memakai data contoh.
- **Lokasi peta:** ubah `CENTER` dan `position` tiap pin di `components/landing/LeafletMap.tsx` (sekarang Pulau Batam).
- **Counter The World Counts:** `components/landing/ValueProposition.tsx` (opsional: isi `embedUrl` untuk memakai embed resmi).
