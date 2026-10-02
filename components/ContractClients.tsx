import Image from "next/image";
import Link from "next/link";
import { canOptimize } from "@/lib/images";

type Logo = { id: string; name: string; imageUrl: string; sector: string | null };

const SECTORS = [
  { t: "Hospitals", d: "Bed linen, gowns" },
  { t: "Clinics", d: "Sheets, lab coats" },
  { t: "Factories", d: "Staff uniforms" },
  { t: "Offices", d: "Uniforms, towels" },
  { t: "Banquet halls", d: "Tablecloths, chair covers" },
  { t: "Masjids", d: "Chadar, ghilaf, curtains" },
];

/**
 * "Meet our contract clients". With logos added in admin it shows a scrolling strip of
 * logo + name + sector. With none yet, it shows the sectors served instead of empty boxes.
 */
export function ContractClients({ logos }: { logos: Logo[] }) {
  const loop = [...logos, ...logos];
  return (
    <section className="py-10 md:py-20">
      <div className="container-x flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Our contract clients</p>
          <h2 className="h-section mt-1">{logos.length ? "Meet the organisations we work for" : "Who we work for"}</h2>
          <p className="mt-2 max-w-xl text-slate-600">Hospitals, factories, banquet halls and masjids across Karachi send us their laundry every week.</p>
        </div>
        <Link href="/business#inquiry" className="text-sm font-semibold text-brand-600">Become a contract client →</Link>
      </div>

      {logos.length ? (
        <div className="group mt-6 overflow-hidden md:mt-8">
          <ul className="animate-marquee flex w-max gap-4 pl-4 group-hover:[animation-play-state:paused]">
            {loop.map((l, n) => (
              <li key={`${l.id}-${n}`} aria-hidden={n >= logos.length} className="card flex w-56 flex-none items-center gap-3 p-4">
                <div className="relative h-14 w-14 flex-none overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
                  <Image unoptimized={!canOptimize(l.imageUrl)} src={l.imageUrl} alt={l.name} fill sizes="56px" className="object-contain p-1.5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-brand-900">{l.name}</p>
                  {l.sector && <p className="text-xs text-slate-500">{l.sector}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ul className="container-x mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mt-8 lg:grid-cols-6">
          {SECTORS.map((x) => (
            <li key={x.t} className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
              <p className="font-semibold text-brand-900">{x.t}</p>
              <p className="mt-0.5 text-xs text-slate-500">{x.d}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
