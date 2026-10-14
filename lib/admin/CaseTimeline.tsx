import { fmtDateTime } from "@/lib/admin/format";
import type { TimelineEvent } from "@/lib/admin/timeline";

/** Kronologi: titik berwarna sesuai jenis kejadian. Urutan lama→baru, atau baru→lama bila newestFirst. */
export default function CaseTimeline({
  events, title = "Jejak kasus", newestFirst = false,
}: { events: TimelineEvent[]; title?: string; newestFirst?: boolean }) {
  if (events.length === 0) return null;
  const list = newestFirst ? [...events].reverse() : events;
  return (
    <section className="adm-tl" aria-label={title}>
      <h3>{title}</h3>
      <ol>
        {list.map((e) => (
          <li key={e.id} className={"adm-tl-" + e.tone}>
            <time>{fmtDateTime(e.at)} WIB</time>
            <span>{e.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}