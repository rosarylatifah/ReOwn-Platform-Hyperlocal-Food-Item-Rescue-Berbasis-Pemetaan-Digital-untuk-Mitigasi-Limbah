/**
 * Jumlah barang/makanan yang sudah terselamatkan pada bulan berjalan.
 *
 * SEKARANG: nilai contoh. NANTI: ganti isi fungsi ini dengan query database.
 * Contoh dengan Prisma:
 *
 *   const start = new Date();
 *   start.setDate(1);
 *   start.setHours(0, 0, 0, 0);
 *   return prisma.item.count({
 *     where: { status: "RESCUED", rescuedAt: { gte: start } },
 *   });
 *
 * Contoh dengan Supabase:
 *
 *   const { count } = await supabase
 *     .from("items")
 *     .select("*", { count: "exact", head: true })
 *     .eq("status", "rescued")
 *     .gte("rescued_at", startOfMonthISO);
 *   return count ?? 0;
 */
export async function getMonthlyRescuedCount(): Promise<number> {
  return 42;
}
