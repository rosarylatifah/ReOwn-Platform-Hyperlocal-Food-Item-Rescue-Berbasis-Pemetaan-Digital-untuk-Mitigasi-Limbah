export interface Item {
  id: string;
  name: string;
  price: "Gratis" | string;
  distance: string;
  owner: string;
  emoji: string; // ganti dengan imageUrl saat foto asli sudah ada
}
