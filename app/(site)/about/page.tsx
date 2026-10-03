import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { AREA_PAGES } from "@/lib/areas";
import { InfoPage } from "@/components/InfoPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "About Dhobi Express",
  description: "Dhobi Express is a Karachi laundry with its own machines, free pickup and delivery, and tagged orders that never mix. Serving homes and businesses.",
  alternates: { canonical: "/about" },
};

export default async function About() {
  const s = await getSettings();
  return (
    <InfoPage title="About Dhobi Express" intro="A Karachi laundry built around one idea: clean clothes shouldn't depend on water, electricity or free time.">
      <h2>Why we started</h2>
      <p>In much of Karachi, washing clothes at home has become a daily struggle. Water comes when it comes, load shedding stops the machine halfway, and after a long working day there&apos;s no time or space left to wash, dry and iron. Families end up buying tankers just for laundry.</p>
      <p>Dhobi Express takes that whole job off your hands. We collect from your door, wash and press with our own machines, and bring everything back folded and packed.</p>

      <h2>How we work</h2>
      <ul>
        <li><strong>Tagged at your door.</strong> Every item is counted and tagged with your order number before it leaves your home.</li>
        <li><strong>Washed separately.</strong> Your order is never mixed with anyone else&apos;s. Hospital and business loads are always kept apart from household laundry.</li>
        <li><strong>Checked before delivery.</strong> Each piece is matched against the tag list, so nothing goes missing.</li>
        <li><strong>On time.</strong> Usually 24–48 hours. You get a delivery date at pickup.</li>
        <li><strong>Clear prices.</strong> Every rate is on our <Link href="/services">services page</Link>.</li>
      </ul>

      <h2>Who we serve</h2>
      <p>Families, working people and students across Karachi — and organisations on monthly contracts: hospitals and clinics, factories and offices, lawns and banquet halls, masjids and madrasas. <Link href="/business">Business laundry →</Link></p>

      <h2>Where we serve</h2>
      <p>{AREA_PAGES.map((a, i) => (<span key={a.path}><Link href={`/${a.path}`}>{a.name}</Link>{i < AREA_PAGES.length - 1 ? ", " : "."}</span>))} More of Karachi soon.</p>

      <h2>Get in touch</h2>
      <p>Call or WhatsApp <strong>{s.phone}</strong>, or email <a href={`mailto:${s.email}`}>{s.email}</a>. We&apos;re open 7 days a week, 10am–7pm. Something not right? <Link href="/complaints">Tell us here</Link>.</p>
    </InfoPage>
  );
}
