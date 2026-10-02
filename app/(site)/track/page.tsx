import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { trackSchema } from "@/lib/validators";

export const metadata: Metadata = {
  title: "Track Your Laundry Order",
  description: "Check the status of your Dhobi Express laundry order with your order ID and phone number.",
  alternates: { canonical: "/track" },
};

async function track(formData: FormData) {
  "use server";
  const parsed = trackSchema.safeParse({ code: formData.get("code"), phone: formData.get("phone") });
  if (!parsed.success) redirect("/track?error=1");
  redirect(`/order/${parsed.data.code}?phone=${parsed.data.phone}`);
}

export default async function TrackPage({ searchParams }: { searchParams: Promise<{ error?: string; demo?: string }> }) {
  const { error, demo } = await searchParams;
  return (
    <div className="container-x max-w-lg py-12">
      <h1 className="text-3xl font-extrabold">Track your order</h1>
      <p className="mt-2 text-slate-600">Enter the order ID from your confirmation (e.g. DE-24817) and the phone number you ordered with.</p>
      <form action={track} className="card mt-6 space-y-4 p-5">
        <div><label className="label" htmlFor="code">Order ID</label><input id="code" name="code" required className="input uppercase" placeholder="DE-12345" /></div>
        <div><label className="label" htmlFor="phone">Phone number</label><input id="phone" name="phone" type="tel" required className="input" placeholder="03001234567" /></div>
        {demo && <p className="err">Order tracking is off in the demo preview.</p>}
        {error && <p className="err">We couldn&apos;t find an order with those details. Check the ID and phone number.</p>}
        <button className="btn-primary w-full">Track order</button>
      </form>
    </div>
  );
}
