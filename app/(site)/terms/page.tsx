import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { waLink } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of Service", description: "Terms for using Dhobi Express laundry services.", alternates: { canonical: "/terms" } };

export default async function Page() {
  const s = await getSettings();
  void waLink;
  return (
    <article className="container-x max-w-3xl py-12 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-slate-700">
      <h1 className="text-3xl font-extrabold">Terms of Service</h1>
      <p>By placing an order you agree to these terms.</p>
      <h2>Pricing</h2>
      <p>Per-piece prices are fixed as listed. Per-kg items are weighed at pickup and the final bill reflects actual weight.</p>
      <h2>Turnaround</h2>
      <p>Standard turnaround is 24–48 hours. Dry cleaning, quilts and bulk orders may take longer; we will tell you at pickup.</p>
      <h2>Damage and loss</h2>
      <p>Please point out stains, tears or delicate items at pickup. We take great care, but we are not responsible for colour bleeding of non-colourfast fabrics or items left in pockets. Claims must be made within 24 hours of delivery; compensation is limited to 10 times the service charge for the item.</p>
      <h2>Unclaimed items</h2>
      <p>Items not collected or accepted within 30 days may be donated.</p>
    </article>
  );
}
