// Jadwal otomatis status Barang: Normal -> Segera (harga diskon) -> Mendesak (Gratis)
export const splitDT = (v) => (v ? [v.slice(0, 10), v.slice(11, 16)] : ['', '']);
export const joinDT = (d, t) => (d ? `${d}T${t || '00:00'}` : '');

// Mengembalikan objek yang SAMA kalau tidak ada perubahan (aman untuk setState)
export function applySchedule(p) {
  if (!p || !p.autoSchedule || p.category === 'Makanan') return p;
  const now = Date.now();
  const hit = (v) => v && now >= new Date(v).getTime();

  let urgency = 'Normal';
  let price = p.normalPrice || p.price;
  if (hit(p.mendesakAt)) {
    urgency = 'Mendesak';
    price = 'Gratis';
  } else if (hit(p.segeraAt)) {
    urgency = 'Segera';
    price = p.discountPrice || p.price;
  }
  return p.urgency === urgency && p.price === price ? p : { ...p, urgency, price };
}