import type { Metadata } from "next";
import PageShell, { Prose } from "@/components/common/PageShell";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan | ReOwn",
  description: "Aturan penggunaan platform ReOwn.",
};

export default function SyaratPage() {
  return (
    <PageShell pattern title="Syarat & ketentuan" desc="Terakhir diperbarui: Oktober 2026">
      <Prose title="1. Tentang layanan">
        <p>
          ReOwn adalah platform yang mempertemukan orang yang ingin memberikan atau menjual barang dan makanan layak
          pakai dengan tetangga di sekitarnya. ReOwn tidak memiliki, menyimpan, ataupun mengirimkan barang.
        </p>
      </Prose>

      <Prose title="2. Kewajiban pengguna">
        <p>
          Kamu setuju untuk memberikan informasi yang benar, hanya membagikan barang yang layak dan aman dipakai atau
          dikonsumsi, serta bersikap sopan terhadap pengguna lain.
        </p>
      </Prose>

      <Prose title="3. Barang yang dilarang">
        <p>
          Dilarang membagikan barang ilegal, berbahaya, kedaluwarsa, atau barang yang melanggar hak pihak lain.
        </p>
      </Prose>

      <Prose title="4. Pengambilan dan transaksi">
        <p>
          Kesepakatan lokasi, waktu, dan harga (bila ada) dilakukan langsung antara pemberi dan pengambil. Periksa
          kondisi barang sebelum menerimanya, dan utamakan keamanan saat bertemu, misalnya di tempat umum.
        </p>
      </Prose>

      <Prose title="5. Batasan tanggung jawab">
        <p>
          ReOwn berperan sebagai perantara. Kami tidak bertanggung jawab atas kualitas, keamanan, atau keabsahan barang
          maupun atas kesepakatan antarpengguna, sejauh diizinkan oleh hukum yang berlaku.
        </p>
      </Prose>

      <Prose title="6. Penghentian akun">
        <p>
          Kami dapat membatasi atau menutup akun yang melanggar ketentuan ini.
        </p>
      </Prose>

      <Prose title="7. Perubahan ketentuan">
        <p>
          Ketentuan ini dapat berubah sewaktu-waktu. Dengan terus memakai ReOwn setelah perubahan, kamu dianggap
          menyetujuinya.
        </p>
      </Prose>
    </PageShell>
  );
}