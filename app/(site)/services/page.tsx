import type { Metadata } from "next";
import { getCatalog } from "@/lib/data";
import { getLang } from "@/lib/i18n";
import { ServiceBrowser } from "./ServiceBrowser";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Laundry Services & Rates in Karachi",
  description: "Wash + press, press only, dry cleaning, curtains, bedsheets, quilts and uniforms. Clear per-piece and per-kg rates with free pickup in Karachi.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ focus?: string }> }) {
  const { focus } = await searchParams;
  const [lang, cats] = await Promise.all([getLang(), getCatalog()]);
  const visible = cats.filter((c) => c.services.length);

  return (
    <div className="container-x pb-10 md:py-10">
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "ItemList",
        itemListElement: visible.flatMap((c) => c.services).map((s, i) => ({
          "@type": "ListItem", position: i + 1,
          item: { "@type": "Service", name: s.name, provider: { "@type": "DryCleaningOrLaundry", name: SITE.name }, areaServed: "Karachi",
            offers: { "@type": "Offer", price: s.price, priceCurrency: "PKR" } },
        })),
      }} />
      <h1 className="sr-only md:not-sr-only md:mx-auto md:block md:max-w-3xl md:text-3xl md:font-bold md:tracking-tight md:text-brand-900">Services &amp; rates</h1>
      <ServiceBrowser cats={visible} roman={lang === "ru"} autoFocus={focus === "search"} />
    </div>
  );
}
