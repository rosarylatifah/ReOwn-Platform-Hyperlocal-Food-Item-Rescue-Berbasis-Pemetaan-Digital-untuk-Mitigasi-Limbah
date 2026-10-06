"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// Ganti dengan koordinat kota target ReOwn (latitude, longitude)
const CENTER: [number, number] = [-6.2088, 106.8456];

interface MapItem {
  id: string;
  name: string;
  price: string;
  distance: string;
  owner: string;
  position: [number, number];
}

// Nanti ganti dengan data dari API
const MAP_ITEMS: MapItem[] = [
  { id: "1", name: "Roti sourdough sisa", price: "Gratis", distance: "0,3 km", owner: "Toko roti Artisan", position: [-6.2035, 106.8395] },
  { id: "2", name: "Minyak zaitun botol kaca", price: "Rp 15 rb", distance: "1,2 km", owner: "Elena V.", position: [-6.2125, 106.8510] },
  { id: "3", name: "Buah tomat heirloom", price: "Gratis", distance: "0,8 km", owner: "Kebun komunitas", position: [-6.2010, 106.8530] },
  { id: "4", name: "Karafe kaca antik", price: "Rp 25 rb", distance: "1,5 km", owner: "Dewi S.", position: [-6.2160, 106.8380] },
];

// Pin berupa HTML (divIcon), jadi tidak bergantung pada gambar marker bawaan Leaflet
function pinIcon(price: string) {
  const free = price === "Gratis";
  const bg = free ? "bg-emerald-500" : "bg-white";
  const label = free ? "text-white" : "text-[#C8442F]";
  return L.divIcon({
    className: "reown-pin",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `<div class="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center">
      <span class="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold shadow-lg ${bg} ${label}">${price}</span>
      <span class="-mt-1 h-2.5 w-2.5 rotate-45 shadow-lg ${bg}"></span>
    </div>`,
  });
}

export default function LeafletMap() {
  return (
    <MapContainer
      center={CENTER}
      zoom={14}
      scrollWheelZoom={false} // supaya scroll halaman tidak "tersangkut" di peta
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {MAP_ITEMS.map((item) => (
        <Marker key={item.id} position={item.position} icon={pinIcon(item.price)}>
          <Popup>
            <strong>{item.name}</strong>
            <br />
            {item.owner} · {item.distance}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
