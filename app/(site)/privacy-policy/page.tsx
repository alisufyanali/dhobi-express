import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { InfoPage } from "@/components/InfoPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What information Dhobi Express collects, why, who it's shared with, how long we keep it and how to ask us to delete it.",
  alternates: { canonical: "/privacy-policy" },
};

export default async function Privacy() {
  const s = await getSettings();
  return (
    <InfoPage title="Privacy policy" updated="October 2026" cta={false}
      intro="We collect only what we need to pick up, clean and deliver your laundry — and we never sell it.">
      <h2>What we collect</h2>
      <ul>
        <li><strong>When you order:</strong> your name, mobile number, address and area, pickup and delivery times, the items you order and any notes you add.</li>
        <li><strong>If you sign in with Google:</strong> your name and email address, so we can show your order history.</li>
        <li><strong>Business inquiries and complaints:</strong> the details you type into those forms.</li>
        <li><strong>Newsletter:</strong> the email or mobile number you give us.</li>
      </ul>
      <p>We don&apos;t collect card numbers. Payments are cash on delivery, or made directly in your JazzCash, Easypaisa or banking app.</p>

      <h2>Why we use it</h2>
      <ul>
        <li>To pick up and deliver your order and contact you about it.</li>
        <li>To handle complaints, refunds and business contracts.</li>
        <li>To send offers, only if you subscribed — you can unsubscribe any time.</li>
        <li>To keep accounts and improve our service.</li>
      </ul>

      <h2>Who we share it with</h2>
      <p>We never sell your information. We share only what&apos;s needed with:</p>
      <ul>
        <li>Our riders, who see your name, phone and address for pickup and delivery.</li>
        <li>Service providers who run the website for us: hosting, database, image storage, email delivery and Google sign-in. They may store data outside Pakistan and may only use it to provide their service to us.</li>
        <li>Authorities, if the law requires it.</li>
      </ul>

      <h2>On your phone</h2>
      <p>The website stores a few small things in your browser: your cart, your language choice, your latest order (so the home page can show its status) and whether you&apos;ve seen the welcome screen. We don&apos;t use advertising trackers.</p>

      <h2>How long we keep it</h2>
      <p>Order records are kept for as long as we need them for accounts and to handle any claims, normally up to 3 years. Newsletter details are deleted when you unsubscribe.</p>

      <h2>Your choices</h2>
      <p>You can ask us to show, correct or delete your information. Email <a href={`mailto:${s.email}`}>{s.email}</a> or WhatsApp <strong>{s.phone}</strong>. We&apos;ll reply within 7 days. We may keep what the law requires us to keep.</p>

      <h2>Children</h2>
      <p>Our service is for adults. We don&apos;t knowingly collect information from children.</p>

      <h2>Changes</h2>
      <p>If we change this policy, we&apos;ll update the date at the top. Questions? <Link href="/contact">Contact us</Link>.</p>
    </InfoPage>
  );
}
