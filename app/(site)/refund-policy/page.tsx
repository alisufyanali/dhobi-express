import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { InfoPage } from "@/components/InfoPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Refund & Compensation Policy",
  description: "Free re-wash if you're not happy, compensation for damaged or missing items, cancellations and how refunds are paid at Dhobi Express, Karachi.",
  alternates: { canonical: "/refund-policy" },
};

export default async function RefundPolicy() {
  const s = await getSettings();
  return (
    <InfoPage title="Refund & compensation policy" updated="October 2026"
      intro="We take care with every piece. If something goes wrong, here's exactly how we put it right.">
      <h2>1. Not happy with the cleaning — free re-wash</h2>
      <p>If an item doesn&apos;t come back clean or pressed to your satisfaction, tell us within <strong>24 hours of delivery</strong>. We&apos;ll collect it and re-wash or re-press it free of charge, including pickup and delivery.</p>

      <h2>2. Damaged or missing items — compensation</h2>
      <ul>
        <li>Report it within <strong>24 hours of delivery</strong> through our <Link href="/complaints">complaints page</Link> or WhatsApp, with your order ID.</li>
        <li>Keep the item, its tag and the packing. Photos help us resolve it faster.</li>
        <li>If we are responsible, we pay compensation of up to <strong>10 times the service charge</strong> for that item, or the repair cost, whichever is lower — and refund the charge for that item.</li>
        <li>We investigate and give you a decision within <strong>3 working days</strong>.</li>
      </ul>

      <h2>3. What we can&apos;t be responsible for</h2>
      <ul>
        <li>Stains that can&apos;t be removed without damaging the fabric — we&apos;ll always try, and we&apos;ll tell you if a stain stays.</li>
        <li>Colour running or shrinking in fabrics that aren&apos;t colourfast or pre-shrunk, or that have no care label.</li>
        <li>Damage to buttons, sequins, beads or embroidery that were already loose or weak.</li>
        <li>Wear and tear that was already there — please point out tears and weak spots at pickup.</li>
        <li>Items left in pockets (money, cards, pens, phones). Please empty pockets before pickup.</li>
        <li>Complaints made more than 24 hours after delivery.</li>
      </ul>

      <h2>4. Cancelling an order</h2>
      <ul>
        <li><strong>Before pickup:</strong> cancel free of charge on WhatsApp or by phone.</li>
        <li><strong>After pickup, before washing:</strong> we return your items; only the delivery charge applies, if any.</li>
        <li><strong>After washing has started:</strong> the order can&apos;t be cancelled.</li>
      </ul>

      <h2>5. Prepaid orders and coupons</h2>
      <p>If you paid in advance (JazzCash, Easypaisa or bank transfer) and are owed money, we refund to the same method within <strong>7 working days</strong>. Cash on delivery orders are adjusted on the bill or refunded in cash at delivery. Coupon discounts aren&apos;t paid out as cash.</p>

      <h2>6. Unclaimed items</h2>
      <p>If we can&apos;t deliver and you don&apos;t collect your items within <strong>30 days</strong>, after reminders by phone and WhatsApp, they may be donated.</p>

      <h2>7. Business contracts</h2>
      <p>Hospitals, companies and other contract clients follow the terms in their contract, which take priority over this page.</p>

      <h2>Contact</h2>
      <p>Register a complaint on our <Link href="/complaints">complaints page</Link>, call <strong>{s.phone}</strong>, or email <a href={`mailto:${s.email}`}>{s.email}</a>.</p>
    </InfoPage>
  );
}
