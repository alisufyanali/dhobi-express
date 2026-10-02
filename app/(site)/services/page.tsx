import type { Metadata } from "next";
import { getCatalog } from "@/lib/data";
import { getDict, getLang } from "@/lib/i18n";
import { ServiceBrowser } from "./ServiceBrowser";
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
    getCatalog(),
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
      <h1 className="text-2xl font-bold tracking-tight text-brand-900 md:text-4xl">Services & rates</h1>
      <p className="mt-2 text-slate-600">Add what you need to the cart. Per-kg items are weighed at pickup.</p>
      <ServiceBrowser cats={visible} roman={roman} label={t.addToCart} addedLabel={t.added} />
    </div>
  );
}
