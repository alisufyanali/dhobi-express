import type { Metadata } from "next";
import { getCatalog } from "@/lib/data";
import { getLang } from "@/lib/i18n";
import { ServiceBrowser } from "./ServiceBrowser";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Laundry Bill Calculator — Karachi Rates",
  description: "Laundry price list and bill calculator for Karachi: wash & iron, iron only, wash only and dry cleaning for men, women, kids and household items. Free pickup and delivery.",
  alternates: { canonical: "/bill-calculator" },
};

export default async function BillCalculatorPage({ searchParams }: { searchParams: Promise<{ focus?: string }> }) {
  const { focus } = await searchParams;
  const [lang, cats, settings] = await Promise.all([getLang(), getCatalog(), getSettings()]);
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
      <h1 className="sr-only md:not-sr-only md:block md:pb-6 md:text-3xl md:font-bold md:tracking-tight md:text-brand-900">Bill calculator</h1>
      <ServiceBrowser cats={visible} roman={lang === "ru"} autoFocus={focus === "search"} threshold={settings.freeDeliveryThreshold} fee={settings.deliveryFee} />
    </div>
  );
}
