import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getDict, getLang } from "@/lib/i18n";
import { ServiceCard } from "@/components/ServiceCard";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Laundry Services & Rates in Karachi",
  description: "Wash + press, press only, dry cleaning, curtains, bedsheets, quilts and uniforms. Clear per-piece and per-kg rates with free pickup in Karachi.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const [t, lang, cats] = await Promise.all([
    getDict(), getLang(),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { services: { where: { active: true }, orderBy: { sortOrder: "asc" } } },
    }),
  ]);
  const roman = lang === "ru";
  const visible = cats.filter((c) => c.services.length);

  return (
    <div className="container-x py-8 md:py-12">
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "ItemList",
        itemListElement: visible.flatMap((c) => c.services).map((s, i) => ({
          "@type": "ListItem", position: i + 1,
          item: { "@type": "Service", name: s.name, provider: { "@type": "DryCleaningOrLaundry", name: SITE.name }, areaServed: "Karachi",
            offers: { "@type": "Offer", price: s.price, priceCurrency: "PKR" } },
        })),
      }} />
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">{t.nav.services} & rates</h1>
      <p className="mt-2 text-slate-600">Add what you need to the cart. Final weight-based items are confirmed at pickup.</p>

      {/* Category jump bar: horizontal chips on mobile, sticky sidebar on desktop */}
      <div className="mt-6 md:grid md:grid-cols-[220px_1fr] md:gap-10">
        <nav className="sticky top-16 z-30 -mx-4 flex gap-2 overflow-x-auto bg-white px-4 py-3 md:top-24 md:mx-0 md:block md:h-fit md:space-y-1 md:p-0">
          {visible.map((c) => (
            <a key={c.id} href={`#${c.slug}`} className="flex-none rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 md:block md:rounded-lg md:border-0 md:px-3 md:hover:bg-slate-50">
              {roman && c.nameUr ? c.nameUr : c.name}
            </a>
          ))}
        </nav>
        <div className="space-y-10">
          {visible.map((c) => (
            <section key={c.id} id={c.slug} className="scroll-mt-32">
              <h2 className="text-xl font-bold text-slate-900">{roman && c.nameUr ? c.nameUr : c.name}</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
                {c.services.map((s) => <ServiceCard key={s.id} s={s} roman={roman} label={t.addToCart} addedLabel={t.added} />)}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
