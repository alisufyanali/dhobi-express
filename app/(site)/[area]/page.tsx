import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AREA_BY_PATH, AREA_PAGES } from "@/lib/areas";
import { JsonLd } from "@/components/JsonLd";
import { getSettings } from "@/lib/settings";
import { rs, SITE } from "@/lib/site";
import { IconCheck, IconPin } from "@/components/Icons";

export const dynamicParams = false;
export function generateStaticParams() {
  return AREA_PAGES.map((a) => ({ area: a.path }));
}

export async function generateMetadata({ params }: { params: Promise<{ area: string }> }): Promise<Metadata> {
  const a = AREA_BY_PATH[(await params).area];
  if (!a) return {};
  return {
    title: `Laundry Service in ${a.name}, Karachi — Free Pickup & Delivery`,
    description: `${a.intro} Wash, press, dry clean, curtains and quilts. Order online or on WhatsApp.`,
    keywords: a.keywords,
    alternates: { canonical: `/${a.path}` },
    openGraph: { title: `Laundry Service in ${a.name} | ${SITE.name}`, url: `/${a.path}` },
  };
}

export default async function AreaPage({ params }: { params: Promise<{ area: string }> }) {
  const a = AREA_BY_PATH[(await params).area];
  if (!a) notFound();
  const s = await getSettings();
  const others = AREA_PAGES.filter((x) => x.path !== a.path);

  return (
    <div className="container-x py-10 md:py-16">
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Service", serviceType: "Laundry and dry cleaning",
        name: `Laundry service in ${a.name}`, areaServed: { "@type": "Place", name: `${a.name}, Karachi` },
        provider: { "@type": "DryCleaningOrLaundry", name: SITE.name, url: SITE.url, telephone: s.phone },
      }} />
      <nav className="text-sm text-slate-500"><Link href="/">Home</Link> / <span>{a.name}</span></nav>
      <div className="mt-4 md:grid md:grid-cols-[1.4fr_1fr] md:gap-12">
        <div>
          <h1 className="text-3xl font-extrabold leading-tight md:text-4xl">Laundry service in {a.name}, Karachi</h1>
          <p className="mt-4 text-lg text-slate-600">{a.intro}</p>
          <ul className="mt-6 space-y-3">
            {a.local.map((l) => (<li key={l} className="flex gap-3"><IconCheck className="mt-0.5 h-5 w-5 flex-none text-brand-600" /><span>{l}</span></li>))}
          </ul>
          <h2 className="mt-10 text-xl font-bold">Delivery in {a.name}</h2>
          <p className="mt-2 text-slate-600">
            Pickup and delivery is free when both are on a Sunday, and on any day for orders above {rs(s.freeDeliveryThreshold)}.
            Otherwise a {rs(s.deliveryFee)} delivery charge applies. Pickup slots: {s.timeSlots.join(" or ")}.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/bill-calculator" className="btn-primary">Book a pickup in {a.name}</Link>
            <Link href="/business" className="btn-ghost">Business laundry</Link>
          </div>
        </div>
        <aside className="card mt-10 h-fit p-5 md:mt-0">
          <p className="font-semibold">We also serve</p>
          <ul className="mt-3 space-y-2">
            {others.map((o) => (<li key={o.path}><Link href={`/${o.path}`} className="flex items-center gap-2 text-sm text-brand-700"><IconPin className="h-4 w-4" />Laundry in {o.name}</Link></li>))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
