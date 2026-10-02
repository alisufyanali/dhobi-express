import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { InquiryForm } from "./InquiryForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Commercial Laundry for Companies, Hospitals & Banquets in Karachi",
  description: "Uniform laundry for companies, hospital linen, banquet and lawn tablecloths, masjid chadar and ghilaf. Monthly contracts and invoicing in Karachi.",
  alternates: { canonical: "/business" },
};

const SEGMENTS = [
  { t: "Companies & factories", d: "Staff uniforms washed and pressed on a fixed weekly schedule, billed per piece on a monthly invoice." },
  { t: "Hospitals & clinics", d: "Bedsheets, gowns and linen collected, washed separately from household laundry, and returned on schedule." },
  { t: "Lawns & banquets", d: "Tablecloths, chair covers and drapes picked up the morning after the event and back before the next booking." },
  { t: "Masjids & madrasas", d: "Chadar, ghilaf, curtains and prayer-area fabrics cleaned with care." },
];

export default async function BusinessPage() {
  const logos = await prisma.clientLogo.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
  return (
    <>
      <section className="bg-brand-900 text-white">
        <div className="container-x py-12 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-sun-400">For business</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight md:text-5xl">Commercial laundry with fixed schedules and monthly invoicing.</h1>
          <p className="mt-4 max-w-xl text-brand-100">One contact person, tagged batches, agreed turnaround and a clear per-piece rate. Try the first batch at a trial rate.</p>
          <a href="#inquiry" className="btn-sun mt-6">Request a quote</a>
        </div>
      </section>

      <section className="container-x grid gap-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {SEGMENTS.map((s) => (
          <div key={s.t} className="card p-5"><h2 className="font-semibold text-slate-900">{s.t}</h2><p className="mt-2 text-sm text-slate-600">{s.d}</p></div>
        ))}
      </section>

      {logos.length > 0 && (
        <section className="container-x pb-6">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-slate-500">Clients we work with</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-8">
            {logos.map((l) => (<div key={l.id} className="relative h-14 w-32"><Image src={l.imageUrl} alt={l.name} fill sizes="128px" className="object-contain" /></div>))}
          </div>
        </section>
      )}

      <section id="inquiry" className="container-x scroll-mt-20 py-14 md:grid md:grid-cols-[1fr_1.2fr] md:gap-12">
        <div>
          <h2 className="h-section">Get a business quote</h2>
          <p className="mt-3 text-slate-600">Tell us what you need and roughly how much each month. We&apos;ll reply within one working day with a rate and pickup schedule.</p>
          <ul className="mt-6 space-y-2 text-sm text-slate-700">
            <li>✓ Per-piece pricing, no hidden charges</li>
            <li>✓ Monthly invoice with order-wise details</li>
            <li>✓ Separate handling for medical linen</li>
          </ul>
        </div>
        <InquiryForm />
      </section>
    </>
  );
}
