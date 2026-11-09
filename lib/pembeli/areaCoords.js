export const DEFAULT_COORD = { lat: 1.1186, lng: 104.0487 };

// Titik tengah perkiraan tiap area (cek ulang di peta, lalu sesuaikan)
export const AREA_COORDS = {
  "batam centre": { lat: 1.1292, lng: 104.053 },
  "nagoya": { lat: 1.1459, lng: 104.0095 },
  "jodoh": { lat: 1.137, lng: 104.03 },
  "lubuk baja": { lat: 1.144, lng: 104.013 },
  "batu ampar": { lat: 1.158, lng: 103.999 },
  "bengkong": { lat: 1.125, lng: 104.07 },
  "sekupang": { lat: 1.118, lng: 103.953 },
  "batu aji": { lat: 1.061, lng: 103.983 },
  "tiban": { lat: 1.068, lng: 104.005 },
  "tanjung uncang": { lat: 1.09, lng: 103.97 },
  "nongsa": { lat: 1.183, lng: 104.1 },
  "tanjung piayu": { lat: 1.095, lng: 104.023 },
  "mukakuning": { lat: 1.07, lng: 104.05 },
"botania": { lat: 1.1215, lng: 104.0585 },
  "sagulung": { lat: 1.0636, lng: 103.9566 },
};

// Cocokkan teks area ("Jl. Ahmad Yani, Nagoya") ke koordinat
export function coordsForArea(text = "") {
  const t = String(text).toLowerCase();
  const key = Object.keys(AREA_COORDS).find((k) => t.includes(k));
  return key ? AREA_COORDS[key] : null;
}

export const isDefaultCoord = (lat, lng) =>
  lat === DEFAULT_COORD.lat && lng === DEFAULT_COORD.lng;