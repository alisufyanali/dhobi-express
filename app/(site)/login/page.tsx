import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GOOGLE_ENABLED, getSession } from "@/lib/auth";
import { GoogleButton } from "./GoogleButton";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default async function LoginPage() {
  if (GOOGLE_ENABLED && (await getSession())?.user?.role === "customer") redirect("/account");
  return (
    <div className="container-x grid min-h-[60vh] place-items-center py-12">
      <div className="card w-full max-w-sm p-6 text-center md:p-8">
        <h1 className="text-2xl font-bold text-brand-900">Sign in</h1>
        <p className="mt-2 text-sm text-slate-600">See your order history and book faster next time.</p>
        <div className="mt-6"><GoogleButton enabled={GOOGLE_ENABLED} /></div>
        {!GOOGLE_ENABLED && <p className="mt-3 text-xs text-slate-500">Sign-in is coming soon.</p>}
        <p className="mt-6 text-sm text-slate-600">No account needed to order. <Link href="/bill-calculator" className="font-semibold text-brand-600">Order with your phone number</Link></p>
      </div>
    </div>
  );
}
