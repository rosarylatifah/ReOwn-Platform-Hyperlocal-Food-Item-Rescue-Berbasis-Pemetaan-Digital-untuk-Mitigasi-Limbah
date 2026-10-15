import PageShell, { Prose } from "@/components/common/PageShell";

export const metadata = {
  title: "Kebijakan Privasi | ReOwn",
  description: "Bagaimana ReOwn mengumpulkan, memakai, dan melindungi datamu.",
};

export default function PrivasiPage() {
  return (
    <PageShell pattern title="Kebijakan privasi" desc="Terakhir diperbarui: Oktober 2026">
      <Prose title="1. Data yang kami kumpulkan">
        <p>
          Saat kamu memakai ReOwn, kami dapat memproses informasi akun (seperti nama dan kontak) jika kamu membuat akun,
          informasi barang yang kamu bagikan, serta perkiraan lokasi untuk menampilkan barang di sekitarmu.
        </p>
      </Prose>

      <Prose title="2. Keranjang dan penyimpanan di perangkat">
        <p>
          Barang yang kamu masukkan ke keranjang disimpan di peramban (localStorage) pada perangkatmu, sehingga tetap
          ada walau kamu belum masuk atau mendaftar. Data ini tidak dikirim ke server kami dan dapat kamu hapus kapan
          saja lewat tombol &quot;Kosongkan keranjang&quot; atau dengan menghapus data situs di pengaturan peramban.
        </p>
      </Prose>

      <Prose title="3. Cara kami memakai data">
        <p>
          Data dipakai untuk menampilkan barang terdekat, menghubungkan pemberi dan pengambil barang, menjaga keamanan
          platform, serta meningkatkan layanan.
        </p>
      </Prose>

      <Prose title="4. Berbagi data dengan pihak lain">
        <p>
          Kami tidak menjual datamu. Informasi kontak hanya dibagikan kepada pengguna lain sebatas yang diperlukan untuk
          mengatur pengambilan barang, atau jika diwajibkan oleh hukum.
        </p>
      </Prose>

      <Prose title="5. Hakmu">
        <p>
          Kamu dapat meminta akses, perbaikan, atau penghapusan datamu dengan menghubungi kami lewat halaman Hubungi.
        </p>
      </Prose>

      <Prose title="6. Perubahan kebijakan">
        <p>
          Kebijakan ini dapat diperbarui. Perubahan penting akan kami informasikan di platform dan tanggal pembaruan di
          atas akan disesuaikan.
        </p>
      </Prose>
    </PageShell>
  );
}