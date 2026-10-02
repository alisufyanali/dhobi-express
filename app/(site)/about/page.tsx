import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { waLink } from "@/lib/site";

export const metadata: Metadata = { title: "About Dhobi Express", description: "Dhobi Express is a Karachi laundry service with our own machines, free pickup and delivery, and tagged orders so clothes never mix.", alternates: { canonical: "/about" } };

export default async function Page() {
  const s = await getSettings();
  void waLink;
  return (
    <article className="container-x max-w-3xl py-12 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-slate-700">
      <h1 className="text-3xl font-extrabold">About Dhobi Express</h1>
      <p>Dhobi Express is a Karachi laundry run with our own machines and years of hands-on laundry experience. We started because so many families here deal with water shortages, load shedding and long work hours, and washing at home has become a daily headache.</p>
      <h2>How we work</h2>
      <p>Every order is tagged at pickup and washed separately. We promise 24–48 hour turnaround and we keep that promise. Rates are listed openly on our services page.</p>
      <h2>Who we serve</h2>
      <p>Households, students and working people across central and north Karachi, plus companies, hospitals, banquets and masjids on monthly contracts.</p>
      <p>Questions? Call {s.phone} or email {s.email}.</p>
    </article>
  );
}
