import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { ComplaintForm } from "./ComplaintForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Complaints & Support",
  description: "Something went wrong with your laundry order? Register a complaint with Dhobi Express and get a ticket number. We reply within 24 hours.",
  alternates: { canonical: "/complaints" },
};

const STEPS = [
  ["Tell us", "Fill the form below — you'll get a ticket number straight away."],
  ["We reply in 24 hours", "Our team calls or WhatsApps you, usually the same day."],
  ["We put it right", "Free re-wash, repair cost or compensation, as set out in our refund policy."],
];

export default async function ComplaintsPage() {
  const s = await getSettings();
  return (
    <div className="pb-10">
      <section className="border-b border-brand-100 bg-brand-50">
        <div className="container-x max-w-3xl py-8 md:py-12">
          <h1 className="text-2xl font-bold tracking-tight text-brand-900 md:text-4xl">Complaints &amp; support</h1>
          <p className="mt-3 text-slate-600 md:text-lg">We&apos;re sorry something went wrong. Tell us and we&apos;ll make it right.</p>
          <ol className="mt-6 grid gap-3 md:grid-cols-3">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-brand-100">
                <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">{i + 1}</span>
                <div><p className="font-semibold text-brand-900">{t}</p><p className="mt-0.5 text-sm text-slate-600">{d}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <div className="container-x max-w-3xl pt-6">
        <ComplaintForm whatsapp={s.whatsappNumber} />
        <p className="mt-4 text-center text-sm text-slate-600">
          Read our <Link href="/refund-policy" className="font-semibold text-brand-600">refund &amp; compensation policy</Link> · Urgent? Call <a href={`tel:${s.phone}`} className="font-semibold text-brand-600">{s.phone}</a>
        </p>
      </div>
    </div>
  );
}
