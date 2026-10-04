import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog } from "@/lib/data";
import { getSettings } from "@/lib/settings";
import { PackageTabs } from "@/components/PackageTabs";
import { PriceMatrix } from "@/components/PriceMatrix";
import { GarmentIcon } from "@/components/GarmentIcon";
import { IconClock, IconShield, IconTag, IconTruck } from "@/components/Icons";
import { rs, UNIT_LABEL } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Laundry Prices & Monthly Packages in Karachi",
  description: "Clear laundry rates in Karachi: per-piece price list for men, women, kids and household items, and monthly wash & iron and iron-only packages.",
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage() {
  const [cats, s] = await Promise.all([getCatalog(), getSettings()]);
  const packages = cats.find((c) => c.slug === "packages")?.services ?? [];
  const perKg = cats.flatMap((c) => c.services.filter((x) => x.unit === "PER_KG").map((x) => ({ ...x, type: c.name })));
  const facts = [
    { I: IconTruck, t: `Free delivery above ${rs(s.freeDeliveryThreshold)}` },
    { I: IconTag, t: "Free on Sunday, any size" },
    { I: IconClock, t: "Ready in 24–48 hours" },
    { I: IconShield, t: "No hidden charges" },
  ];

  return (
    <div className="pb-10">
      <section className="container-x pt-5 text-center md:pt-12">
        <h1 className="text-2xl font-bold text-brand-900 md:text-4xl">Pricing</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 md:text-base">Clear rates. What you see is what you pay.</p>
      </section>

      <section className="container-x mt-5 md:mt-8">
        <ul className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
          {facts.map(({ I, t }) => (
            <li key={t} className="flex items-center gap-2.5 rounded-2xl bg-white p-3 text-xs font-medium text-brand-900 ring-1 ring-slate-200 md:p-4 md:text-sm">
              <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-brand-50 text-brand-600"><I className="h-5 w-5" /></span>{t}
            </li>
          ))}
        </ul>
      </section>

      {packages.length > 0 && (
        <section id="packages" className="container-x mt-10 scroll-mt-24 md:mt-16">
          <h2 className="h-section text-center">Monthly packages</h2>
          <p className="mt-1 text-center text-sm text-slate-500">Lower per-piece rate, free pickup &amp; delivery.</p>
          <div className="mt-5"><PackageTabs items={packages} /></div>
        </section>
      )}

      <section id="price-list" className="container-x mt-10 scroll-mt-24 md:mx-auto md:mt-16 md:max-w-4xl">
        <h2 className="h-section text-center">Price list</h2>
        <p className="mt-1 text-center text-sm text-slate-500">Per piece, by service.</p>
        <div className="mt-5"><PriceMatrix cats={cats} /></div>

        {perKg.length > 0 && (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {perKg.map((k) => (
              <li key={k.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                <GarmentIcon name="mixed kg" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-brand-900">Mixed clothes · {k.type}</p>
                  <p className="text-xs text-slate-500">Weighed at pickup</p>
                </div>
                <p className="text-sm font-bold text-brand-700">{rs(k.price)} <span className="text-[11px] font-normal text-slate-500">{UNIT_LABEL[k.unit]}</span></p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="container-x mt-10 md:mt-14">
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-brand-600 p-6 text-center text-white md:flex-row md:justify-between md:p-8 md:text-left">
          <div>
            <h2 className="text-xl font-bold md:text-2xl">Know your total before pickup</h2>
            <p className="mt-1 text-sm text-white/80">Add items, see the bill, book in a minute.</p>
          </div>
          <Link href="/bill-calculator" className="btn bg-white text-brand-700 hover:bg-brand-50">Open bill calculator</Link>
        </div>
      </section>
    </div>
  );
}
