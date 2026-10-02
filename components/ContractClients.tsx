import Image from "next/image";
import Link from "next/link";
import { canOptimize } from "@/lib/images";

type Logo = { id: string; name: string; imageUrl: string; sector: string | null };

// Shown only in demo mode until real clients are added in Admin → Client logos
const PLACEHOLDERS: Logo[] = ["Hospital", "Factory", "Banquet hall", "Masjid", "Corporate office", "Clinic"].map((sector, i) => ({
  id: `p${i}`, name: "Client name", imageUrl: "", sector,
}));

/** "Meet our contract clients": scrolling cards with logo, name and sector. */
export function ContractClients({ logos, demo }: { logos: Logo[]; demo: boolean }) {
  const items = logos.length ? logos : demo ? PLACEHOLDERS : [];
  if (!items.length) return null;
  const loop = [...items, ...items];

  return (
    <section className="py-14 md:py-20">
      <div className="container-x flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Our contract clients</p>
          <h2 className="h-section mt-1">Meet the organisations we work for</h2>
          <p className="mt-2 max-w-xl text-slate-600">Hospitals, factories, banquet halls and masjids across Karachi trust us with their laundry every week.</p>
        </div>
        <Link href="/business#inquiry" className="text-sm font-semibold text-brand-600">Become a contract client →</Link>
      </div>
      <div className="group mt-8 overflow-hidden">
        <ul className="animate-marquee flex w-max gap-4 pl-4 group-hover:[animation-play-state:paused]">
          {loop.map((l, n) => (
            <li key={`${l.id}-${n}`} aria-hidden={n >= items.length} className="card flex w-56 flex-none items-center gap-3 p-4">
              <div className="relative grid h-14 w-14 flex-none place-items-center overflow-hidden rounded-xl bg-brand-50">
                {l.imageUrl
                  ? <Image unoptimized={!canOptimize(l.imageUrl)} src={l.imageUrl} alt={l.name} fill sizes="56px" className="object-contain p-1.5" />
                  : <span className="text-[10px] text-slate-400">Logo</span>}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-brand-900">{l.name}</p>
                {l.sector && <p className="text-xs text-slate-500">{l.sector}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
