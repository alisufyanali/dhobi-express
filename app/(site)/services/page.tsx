import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog } from "@/lib/data";
import { getSettings } from "@/lib/settings";
import { GarmentIcon, TypeArt } from "@/components/GarmentIcon";
import { IconBox, IconDrop, IconIron, IconTruck, IconWhatsApp } from "@/components/Icons";
import { rs, waLink } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Laundry Services in Karachi — Wash & Iron, Dry Cleaning",
  description: "Wash & iron, iron only, wash & fold, dry cleaning and corporate laundry contracts in Karachi, with free pickup and delivery.",
  alternates: { canonical: "/services" },
};

const SERVICES = [
  { slug: "wash-iron", t: "Wash & Iron", d: "Washed, pressed and folded." },
  { slug: "wash-only", t: "Wash & Fold", d: "Washed, dried and folded. Razai too." },
  { slug: "iron-only", t: "Iron only", d: "Steam pressed, crease-free." },
  { slug: "dry-clean", t: "Dry cleaning", d: "Suits, sherwani, bridal wear." },
];

const WHO = [
  { seg: "men", t: "Men", items: ["Shirt", "Shalwar", "Jeans", "Suit (2-piece)"] },
  { seg: "women", t: "Women", items: ["Kameez", "Dupatta", "Abaya", "Saree"] },
  { seg: "kids", t: "Kids", items: ["T-shirt", "Shorts", "Frock", "School uniform"] },
  { seg: "household", t: "Household", items: ["Bedsheet", "Razai", "Curtain", "Sofa cover"] },
];

export default async function ServicesPage() {
  const [cats, s] = await Promise.all([getCatalog(), getSettings()]);
  const from = (slug: string) => {
    const list = cats.find((c) => c.slug === slug)?.services ?? [];
    return list.length ? Math.min(...list.map((x) => x.price)) : null;
  };
  const steps = [
    { I: IconTruck, t: "Pickup" }, { I: IconDrop, t: "Wash" }, { I: IconIron, t: "Press" }, { I: IconBox, t: "Delivery" },
  ];

  return (
    <div className="pb-10">
      <section className="container-x pt-5 text-center md:pt-12">
        <h1 className="text-2xl font-bold text-brand-900 md:text-4xl">Our services</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 md:text-base">Free pickup and delivery above {rs(s.freeDeliveryThreshold)}. Back in 24–48 hours.</p>
      </section>

      {/* Service cards */}
      <section className="container-x mt-6 md:mt-10">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-5">
          {SERVICES.map((x) => (
            <li key={x.slug}>
              <Link href={`/bill-calculator#${x.slug}/men`} className="lift flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 md:hover:ring-brand-500">
                <div className="relative aspect-[4/3]"><TypeArt slug={x.slug} /></div>
                <div className="flex flex-1 flex-col p-3 md:p-4">
                  <h2 className="text-sm font-bold text-brand-900 md:text-lg">{x.t}</h2>
                  <p className="mt-0.5 flex-1 text-[11px] leading-snug text-slate-500 md:text-sm">{x.d}</p>
                  {from(x.slug) != null && <p className="mt-2 text-xs text-slate-500">From <b className="text-sm text-brand-700">{rs(from(x.slug)!)}</b></p>}
                </div>
              </Link>
            </li>
          ))}
          <li className="col-span-2 md:col-span-1">
            <Link href="/business" className="lift flex h-full flex-row overflow-hidden rounded-2xl bg-brand-900 text-white md:flex-col">
              <div className="relative aspect-square w-28 flex-none md:aspect-[4/3] md:w-auto"><TypeArt slug="corporate" /></div>
              <div className="flex flex-1 flex-col justify-center p-3 md:p-4">
                <h2 className="text-sm font-bold md:text-lg">Corporate</h2>
                <p className="mt-0.5 text-[11px] leading-snug text-white/75 md:text-sm">Hospitals, offices, banquets, masjids.</p>
                <p className="mt-2 text-xs font-semibold text-brand-100">Monthly contract →</p>
              </div>
            </Link>
          </li>
        </ul>
      </section>

      {/* What we wash */}
      <section className="container-x mt-10 md:mt-16">
        <h2 className="h-section text-center">What we wash</h2>
        <ul className="mt-5 grid grid-cols-2 gap-3 md:mt-8 md:grid-cols-4 md:gap-5">
          {WHO.map((w) => (
            <li key={w.seg}>
              <Link href={`/bill-calculator#wash-iron/${w.seg}`} className="lift block rounded-2xl bg-white p-4 ring-1 ring-slate-200 md:p-5 md:hover:ring-brand-500">
                <div className="grid grid-cols-4 gap-1.5">
                  {w.items.map((i) => <GarmentIcon key={i} name={i} className="aspect-square h-auto w-full" />)}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <h3 className="font-bold text-brand-900">{w.t}</h3>
                  <span className="text-xs font-semibold text-brand-600">Rates →</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Process */}
      <section className="container-x mt-10 md:mt-16">
        <ol className="grid grid-cols-4 gap-1 rounded-2xl bg-brand-50 px-2 py-5 ring-1 ring-brand-100 md:px-8 md:py-8">
          {steps.map(({ I, t }, i) => (
            <li key={t} className="flex flex-col items-center text-center">
              <span className="relative grid h-12 w-12 place-items-center rounded-full bg-white text-brand-600 ring-1 ring-brand-100 md:h-16 md:w-16">
                <I className="h-6 w-6 md:h-7 md:w-7" />
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-brand-600 text-[10px] font-bold text-white">{i + 1}</span>
              </span>
              <span className="mt-2 text-xs font-semibold text-brand-900 md:text-base">{t}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-x mt-8 flex flex-col justify-center gap-3 sm:flex-row md:mt-12">
        <Link href="/bill-calculator" className="btn-primary">Calculate my bill</Link>
        <Link href="/pricing" className="btn-ghost">See packages</Link>
        <a href={waLink(s.whatsappNumber, "Assalam o Alaikum, I want to book a laundry pickup.")} target="_blank" rel="noopener" className="btn-wa"><IconWhatsApp className="h-5 w-5" />WhatsApp</a>
      </section>
    </div>
  );
}
