import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { waLink } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy", description: "How Dhobi Express collects and uses your information.", alternates: { canonical: "/privacy-policy" } };

export default async function Page() {
  const s = await getSettings();
  void waLink;
  return (
    <article className="container-x max-w-3xl py-12 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-slate-700">
      <h1 className="text-3xl font-extrabold">Privacy Policy</h1>
      <p>We collect your name, phone number and address only to pick up and deliver your laundry and to contact you about your order. We do not sell or share your information with third parties except where needed to complete your order (for example, our delivery rider).</p>
      <h2>Data we keep</h2>
      <p>Order history, contact details and any notes you give us. You can ask us to delete your information by contacting {s.email}.</p>
      <h2>Cookies</h2>
      <p>We use a small cookie to remember your language choice and your browser storage to remember your cart. No advertising trackers are used on this site.</p>
    </article>
  );
}
