export interface Item {
  id: string;
  name: string;
  price: "Gratis" | string;
  distance: string;
  owner: string;
  image?: string; // path di /public, mis. "/images/roti.jpg"
  emoji?: string; // cadangan kalau belum ada foto
}
