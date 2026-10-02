import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { waLink } from "@/lib/site";

export const metadata: Metadata = { title: "Contact Dhobi Express", description: "Call, WhatsApp or email Dhobi Express for laundry pickup in Karachi.", alternates: { canonical: "/contact" } };

export default async function Page() {
  const s = await getSettings();
  void waLink;
  return (
    <article className="container-x max-w-3xl py-12 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-slate-700">
      <h1 className="text-3xl font-extrabold">Contact Dhobi Express</h1>
      <p>The fastest way to reach us is WhatsApp. We reply between 10am and 7pm, seven days a week.</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a className="btn-wa" href={waLink(s.whatsappNumber)} target="_blank" rel="noopener">WhatsApp {s.phone}</a>
        <a className="btn-ghost" href={`tel:${s.phone}`}>Call {s.phone}</a>
        <a className="btn-ghost" href={`mailto:${s.email}`}>{s.email}</a>
      </div>
      <p>{s.address}</p>
    </article>
  );
}
