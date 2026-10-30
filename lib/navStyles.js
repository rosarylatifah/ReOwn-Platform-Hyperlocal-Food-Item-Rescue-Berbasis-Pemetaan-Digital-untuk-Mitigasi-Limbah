// Sumber tunggal gaya navbar. Dipakai oleh components/common/Navbar.jsx (landing)
// dan components/pembeli/BuyerNavbar.jsx supaya warna, transisi, dan animasi selalu sama.

export const styles = {
  overlay: {
    // hover: kapsul terisi putih, teks jadi oranye
    pill: "border-white text-white hover:bg-white hover:text-[#F24827] focus-visible:outline-white",
    burger: "border-white text-white",
    logo: "light",
  },
  solid: {
    // hover: kapsul terisi gelap, teks jadi krem
    pill: "border-stone-800 text-stone-900 hover:bg-stone-900 hover:text-[#FFF7E9] focus-visible:outline-[#E05A47]",
    burger: "border-stone-800 text-stone-900",
    logo: "dark",
  },
};

// Kapsul outline (menu & "Masuk")
export const pillBase =
  "inline-flex items-center rounded-full border-[1.5px] px-6 py-2 text-[15px] leading-[22px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

// Tombol utama hijau; hover: berubah gelap dengan teks hijau
export const ctaClass =
  "group inline-flex items-center gap-2 rounded-full bg-[#95F57C] px-6 py-2 text-[15px] leading-[22px] text-stone-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-stone-900 hover:text-[#95F57C] hover:shadow-lg active:translate-y-0 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900";
