import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { waLink } from "@/lib/site";
import { InfoPage } from "@/components/InfoPage";
import { ShopLocation } from "@/components/ShopLocation";
import { IconWhatsApp } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Contact Dhobi Express — Laundry Shop in Karachi",
  description: "Call, WhatsApp or visit Dhobi Express for laundry pickup and delivery in Karachi. Shop address, opening hours and directions.",
  alternates: { canonical: "/contact" },
};

export default async function Contact() {
  const s = await getSettings();
  const ways = [
    { href: waLink(s.whatsappNumber, "Assalam o Alaikum"), label: "WhatsApp", sub: "Fastest reply", ext: true, icon: <IconWhatsApp className="h-6 w-6 text-wa" /> },
    { href: `tel:${s.phone}`, label: "Call", sub: s.phone, icon: <svg viewBox="0 0 24 24" className="h-6 w-6 text-brand-600" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg> },
    { href: `mailto:${s.email}`, label: "Email", sub: s.email, icon: <svg viewBox="0 0 24 24" className="h-6 w-6 text-brand-600" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg> },
  ];
  return (
    <InfoPage title="Contact Dhobi Express" intro={`We reply on WhatsApp ${s.openingHours.toLowerCase().startsWith("mon") ? s.openingHours : "every day"}.`}>
      <div className="grid gap-3 sm:grid-cols-3">
        {ways.map((w) => (
          <a key={w.label} href={w.href} {...(w.ext ? { target: "_blank", rel: "noopener" } : {})} className="lift flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200 sm:flex-col sm:text-center">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50">{w.icon}</span>
            <span className="min-w-0"><b className="block text-brand-900">{w.label}</b><span className="block truncate text-sm text-slate-500">{w.sub}</span></span>
          </a>
        ))}
      </div>
      <ShopLocation s={s} />
      <p className="px-1 text-sm text-slate-600">Have a problem with an order? <Link href="/complaints" className="font-semibold text-brand-600">Raise a complaint</Link> and get a ticket number.</p>
    </InfoPage>
  );
}
