import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { InfoPage } from "@/components/InfoPage";
import { rs } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for using Dhobi Express laundry pickup and delivery in Karachi: pricing, delivery, turnaround, payment and claims.",
  alternates: { canonical: "/terms" },
};

export default async function Terms() {
  const s = await getSettings();
  return (
    <InfoPage title="Terms of service" updated="October 2026" cta={false} intro="By placing an order with Dhobi Express you agree to these terms.">
      <h2>Prices</h2>
      <p>Per-piece prices are as listed on our <Link href="/services">services page</Link>. Per-kg items are weighed at pickup and the final bill uses the actual weight. Heavy, oversized or specially embellished items may be quoted at pickup before we accept them.</p>
      <h2>Pickup &amp; delivery</h2>
      <p>Free when the order is above {rs(s.freeDeliveryThreshold)}, or when both pickup and delivery are on a Sunday. Otherwise a {rs(s.deliveryFee)} charge applies. Please be available during the slot you choose; a missed pickup may be rescheduled.</p>
      <h2>Turnaround</h2>
      <p>Usually 24–48 hours. Dry cleaning, quilts, blankets and bulk orders can take up to 72 hours — we tell you at pickup.</p>
      <h2>Payment</h2>
      <p>Cash on delivery, JazzCash, Easypaisa or bank transfer. Business clients are invoiced monthly as agreed in their contract.</p>
      <h2>Your items</h2>
      <p>Please empty pockets and point out stains, tears and delicate items at pickup. We follow care labels where they exist.</p>
      <h2>Claims, refunds &amp; cancellations</h2>
      <p>Covered in full in our <Link href="/refund-policy">refund &amp; compensation policy</Link>. In short: report problems within 24 hours of delivery; compensation for damaged or missing items is up to 10 times the service charge for that item; unclaimed items may be donated after 30 days.</p>
      <h2>Contact</h2>
      <p>Questions or complaints: <Link href="/complaints">complaints page</Link>, {s.phone}, or <a href={`mailto:${s.email}`}>{s.email}</a>.</p>
    </InfoPage>
  );
}
