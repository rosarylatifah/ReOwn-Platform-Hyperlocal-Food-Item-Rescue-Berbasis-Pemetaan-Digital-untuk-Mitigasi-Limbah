const cards = [
  {
    title: "Makanan yang terbuang hari ini",
    text: "Setiap hari, makanan yang masih layak makan berakhir di tempat sampah. ReOwn mempertemukannya dengan orang yang membutuhkan.",
  },
  {
    title: "Barang yang terbuang hari ini",
    text: "Barang rumah tangga yang masih berfungsi bisa dipakai lagi oleh tetangga, bukan menumpuk di gudang.",
  },
];

export default function ValueProposition() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <h2 className="mx-auto max-w-3xl text-center font-display text-4xl font-extrabold leading-tight text-stone-900 sm:text-5xl">
        Tidak semua yang tak terpakai harus menjadi limbah
      </h2>
      <p className="mx-auto mt-5 max-w-2xl text-center text-stone-600">
        Makanan dan barang sehari-hari masih bisa bermanfaat meskipun sudah tidak dibutuhkan pemiliknya. ReOwn membantu mempertemukannya dengan orang yang lebih membutuhkan sebelum berakhir di tempat sampah.
      </p>
      <div className="relative mt-14">
        <div className="pointer-events-none absolute inset-0 -z-10 mx-auto max-w-3xl rounded-full bg-orange-300/30 blur-3xl" />
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          {cards.map((c) => (
            <article key={c.title} className="min-h-56 rounded-3xl bg-white p-7 shadow-xl shadow-orange-900/10">
              <h3 className="font-display text-xl font-semibold text-stone-900">{c.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">{c.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
