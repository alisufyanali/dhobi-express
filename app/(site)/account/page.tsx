import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { IS_DEMO } from "@/lib/demo";
import { rs, STATUS_LABEL } from "@/lib/site";
import { SignOutButton } from "../login/GoogleButton";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My account", robots: { index: false } };

export default async function AccountPage() {
  if (IS_DEMO) redirect("/login");
  const session = await getSession();
  const email = session?.user?.role === "customer" ? session.user.email : null;
  if (!email) redirect("/login");

  const orders = await prisma.order.findMany({ where: { userEmail: email }, orderBy: { createdAt: "desc" }, take: 50 });

  return (
    <div className="container-x max-w-3xl py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Assalam o Alaikum{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}</h1>
          <p className="text-sm text-slate-500">{email}</p>
        </div>
        <SignOutButton />
      </div>
      <h2 className="mt-8 font-semibold text-brand-900">Your orders</h2>
      <ul className="card mt-3 divide-y divide-slate-200">
        {orders.map((o) => (
          <li key={o.id}>
            <Link href={`/order/${o.code}?phone=${o.phone}`} className="flex items-center gap-3 p-4 text-sm hover:bg-brand-50">
              <span className="font-mono font-semibold text-brand-700">{o.code}</span>
              <span className="flex-1 text-slate-500">{o.createdAt.toLocaleDateString("en-PK", { timeZone: "Asia/Karachi" })}</span>
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700">{STATUS_LABEL[o.status]}</span>
              <span className="w-20 text-right font-medium">{rs(o.total)}</span>
            </Link>
          </li>
        ))}
        {!orders.length && <li className="p-6 text-center text-sm text-slate-500">No orders yet. <Link href="/bill-calculator" className="font-semibold text-brand-600">Book your first pickup</Link></li>}
      </ul>
    </div>
  );
}
