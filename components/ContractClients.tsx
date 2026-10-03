import Image from "next/image";
import Link from "next/link";
import { canOptimize } from "@/lib/images";

type Logo = { id: string; name: string; imageUrl: string; sector: string | null };

/** Sector groups shown in this order; anything else falls into "Other clients". */
const ORDER = ["Hospital", "Clinic", "Factory", "Corporate office", "Hotel", "Banquet hall", "Lawn", "Masjid", "Madrasa", "School"];
const PLURAL: Record<string, string> = {
  Hospital: "Hospitals", Clinic: "Clinics", Factory: "Factories", "Corporate office": "Corporate offices", Hotel: "Hotels",
  "Banquet hall": "Banquet halls", Lawn: "Lawns", Masjid: "Masjids", Madrasa: "Madrasas", School: "Schools",
};


/** "Our clients": logos grouped under sector headings, circular logo with the name underneath. */
export function ContractClients({ logos }: { logos: Logo[] }) {
  if (!logos.length) return null; // nothing to show until real logos are added in Admin → Client logos
  const groups = new Map<string, Logo[]>();
  for (const l of logos) {
    const k = l.sector && ORDER.includes(l.sector) ? l.sector : "Other";
    groups.set(k, [...(groups.get(k) ?? []), l]);
  }
  const keys = [...ORDER, "Other"].filter((k) => groups.has(k));

  return (
    <section className="py-10 md:py-20" data-reveal>
      <div className="container-x">
        <div className="text-center">
          <p className="eyebrow">Trusted across Karachi</p>
          <h2 className="h-section mt-1">Our clients</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600 md:text-base">Hospitals, companies, banquet halls and masjids send us their laundry every week on a monthly contract.</p>
        </div>

        <div className="mt-8 space-y-8 md:mt-10 md:space-y-10">
            {keys.map((k) => (
              <div key={k}>
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-brand-700 md:text-base">{k === "Other" ? "Other clients" : PLURAL[k]}</h3>
                  <span className="h-px flex-1 bg-slate-200" />
                </div>
                <ul className="mt-4 grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                  {groups.get(k)!.map((l) => (
                    <li key={l.id} className="flex flex-col items-center text-center">
                      <div className="lift relative h-16 w-16 overflow-hidden rounded-full bg-white ring-1 ring-slate-200 md:h-20 md:w-20">
                        <Image unoptimized={!canOptimize(l.imageUrl)} src={l.imageUrl} alt={l.name} fill sizes="80px" className="object-contain p-2.5" />
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs font-medium leading-snug text-slate-700 md:text-sm">{l.name}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        <div className="mt-8 text-center">
          <Link href="/business#inquiry" className="btn-primary">Become a contract client</Link>
        </div>
      </div>
    </section>
  );
}
