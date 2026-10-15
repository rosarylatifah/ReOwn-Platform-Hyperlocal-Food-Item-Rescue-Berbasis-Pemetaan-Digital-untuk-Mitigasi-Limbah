import { Caveat, Dela_Gothic_One, Fraunces, Gochi_Hand, Sue_Ellen_Francisco } from "next/font/google";

/** Serif tebal: logo, judul section, judul kartu */
export const fraunces = Fraunces({ subsets: ["latin"], weight: ["700", "800"] });

/** Heading hero: huruf lebar & sangat tebal */
export const delaGothic = Dela_Gothic_One({ subsets: ["latin"], weight: "400" });

/** Tulisan tangan: menu, sub-teks, deskripsi section */
export const gochiHand = Gochi_Hand({ subsets: ["latin"], weight: "400" });

/** Judul tinggi & tipis: "Tidak semua yang tak terpakai..." */
export const sueEllen = Sue_Ellen_Francisco({ subsets: ["latin"], weight: "400" });

/** Tulisan tangan merah di kartu counter */
export const caveat = Caveat({ subsets: ["latin"], weight: ["500", "600"] });