import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { IMAGES } from "@/lib/images";
import { rs, waLink } from "@/lib/site";
import { IconBox, IconCheck, IconClock, IconDrop, IconIron, IconShield, IconTag, IconTruck, IconWhatsApp } from "@/components/Icons";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Why Choose Dhobi Express — Laundry Service in Karachi",
  description: "No water, no electricity, no time? Free pickup and delivery, tagged orders that never mix, clear prices and 24–48 hour turnaround across Karachi.",
  alternates: { canonical: "/why-choose-us" },
};

const PROBLEMS = [
  { I: IconDrop, t: "Pani ka masla", d: "No tanker, no water bill for laundry. We wash it all." },
  { I: IconClock, t: "Bijli nahi", d: "Load shedding doesn't stop us. No machine or iron needed at home." },
  { I: IconTruck, t: "Time nahi", d: "We collect from your door and bring it back folded." },
  { I: IconBox, t: "Jagah nahi", d: "Small flat, no space to dry? Your clothes come back dry and packed." },
];

const PROCESS = [
  { I: IconTag, t: "Pickup & tagging", d: "Every item is counted and tagged with your order number at your door." },
  { I: IconCheck, t: "Sorting", d: "Separated by colour and fabric. Stains are noted and pre-treated." },
  { I: IconDrop, t: "Separate wash", d: "Your order is washed on its own — never mixed with anyone else's." },
  { I: IconIron, t: "Press & check", d: "Steam pressed, then checked piece by piece against the tag list." },
  { I: IconBox, t: "Packed & delivered", d: "Folded, packed and delivered back in 24–48 hours." },
];

export default async function WhyChooseUs() {
  const s = await getSettings();
  const ROWS: [string, string, string, string][] = [
    ["Water & electricity needed", "Yes, a lot", "No", "No"],
    ["Pickup from your door", "—", "Sometimes", `Yes — free above ${rs(s.freeDeliveryThreshold)}`],
    ["Published, fixed prices", "—", "Rarely", "Yes"],
    ["Order tagged, never mixed", "—", "Not always", "Yes"],
    ["Track your order online", "—", "No", "Yes"],
    ["Ready in", "Your whole day", "Varies", "24–48 hours"],
  ];
  const REASONS = [
    { I: IconTruck, t: "Free pickup & delivery", d: `Above ${rs(s.freeDeliveryThreshold)} every day, and any order size on Sunday.` },
    { I: IconClock, t: "On time, every time", d: "You get a delivery date at pickup. If we can't make it, we tell you before, not after." },
    { I: IconTag, t: "Never mixed up", d: "Tagged at your door, washed separately, checked against the list before delivery." },
    { I: IconShield, t: "Clear prices", d: "Every rate is on our website. No surprise charges on the bill." },
    { I: IconDrop, t: "Hygienic handling", d: "Household, hospital and business loads are always washed apart." },
    { I: IconWhatsApp, t: "Real people on WhatsApp", d: "Questions or problems? A person replies — not a machine." },
  ];

  return (
    <div className="pb-10">
      <section className="border-b border-brand-100 bg-brand-50">
        <div className="container-x grid items-center gap-8 py-8 md:grid-cols-2 md:py-14">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-900 md:text-5xl">Why Karachi chooses Dhobi Express</h1>
            <p className="mt-3 text-slate-600 md:text-lg">Laundry shouldn&apos;t depend on whether the tanker came or the light is on. We take it off your hands — properly.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/services" className="btn-primary">Book a pickup</Link>
              <a href={waLink(s.whatsappNumber, "Assalam o Alaikum, I have a question about your laundry service.")} target="_blank" rel="noopener" className="btn-ghost"><IconWhatsApp className="h-5 w-5 text-wa" />Ask on WhatsApp</a>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image src={IMAGES.hero} alt="Freshly washed and folded clothes" fill priority sizes="(min-width:768px) 560px, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="container-x pt-10 md:pt-16">
        <h2 className="h-section">Made for Karachi&apos;s real problems</h2>
        <ul className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {PROBLEMS.map(({ I, t, d }) => (
            <li key={t} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 md:p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600"><I className="h-5 w-5" /></span>
              <h3 className="mt-3 font-semibold text-brand-900">{t}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 md:text-sm">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-x pt-10 md:pt-16">
        <h2 className="h-section">What you get with us</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
          {REASONS.map(({ I, t, d }) => (
            <li key={t} className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200 md:p-5">
              <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-brand-600 text-white"><I className="h-5 w-5" /></span>
              <div><h3 className="font-semibold text-brand-900">{t}</h3><p className="mt-1 text-sm text-slate-600">{d}</p></div>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-x pt-10 md:pt-16">
        <h2 className="h-section">How we compare</h2>
        <div className="-mx-4 mt-5 overflow-x-auto px-4 md:mx-0 md:px-0">
          <table className="w-full min-w-[560px] overflow-hidden rounded-2xl bg-white text-sm ring-1 ring-slate-200">
            <thead>
              <tr className="bg-brand-50 text-left text-xs font-semibold uppercase tracking-wide text-brand-700">
                <th className="p-3" /><th className="p-3">At home</th><th className="p-3">Typical dhobi</th><th className="bg-brand-600 p-3 text-white">Dhobi Express</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ROWS.map(([label, home, dhobi, us]) => (
                <tr key={label}>
                  <td className="p-3 font-medium text-brand-900">{label}</td>
                  <td className="p-3 text-slate-600">{home}</td>
                  <td className="p-3 text-slate-600">{dhobi}</td>
                  <td className="bg-brand-50 p-3 font-semibold text-brand-700">{us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="container-x pt-10 md:pt-16">
        <h2 className="h-section">What happens to your clothes</h2>
        <ol className="mt-5 grid gap-3 md:grid-cols-5">
          {PROCESS.map(({ I, t, d }, i) => (
            <li key={t} className="flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200 md:block">
              <span className="relative grid h-11 w-11 flex-none place-items-center rounded-full bg-brand-50 text-brand-700">
                <I className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-brand-600 text-[11px] font-bold text-white">{i + 1}</span>
              </span>
              <div className="md:mt-3"><h3 className="font-semibold text-brand-900">{t}</h3><p className="mt-1 text-sm text-slate-600">{d}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-x pt-10 md:pt-16">
        <div className="rounded-3xl bg-brand-600 p-6 text-white md:flex md:items-center md:justify-between md:gap-8 md:p-10">
          <div>
            <h2 className="text-xl font-bold md:text-3xl">Our promise</h2>
            <p className="mt-2 max-w-xl text-white/85">Not happy with how something was cleaned? Tell us within 24 hours and we&apos;ll re-wash it free. If something is damaged or missing, we compensate as set out in our refund policy.</p>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row md:mt-0 md:flex-none">
            <Link href="/refund-policy" className="btn bg-white text-brand-700 hover:bg-brand-50">Refund policy</Link>
            <Link href="/services" className="btn border border-white/60 text-white hover:bg-white/10">Book a pickup</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
