import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { IS_DEMO } from "@/lib/demo";
import { phoneSchema } from "@/lib/validators";
import { getSettings } from "@/lib/settings";
import { PAYMENT_LABEL, rs, STATUS_FLOW, STATUS_LABEL, UNIT_LABEL, waLink } from "@/lib/site";
import { IconCheck } from "@/components/Icons";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order Status", robots: { index: false } };

const fmt = (d: Date) => d.toLocaleDateString("en-PK", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

export default async function OrderPage({ params, searchParams }: { params: Promise<{ code: string }>; searchParams: Promise<{ phone?: string }> }) {
  if (IS_DEMO) redirect("/track?demo=1");
  const { code } = await params;
  const { phone } = await searchParams;
  const p = phoneSchema.safeParse(phone ?? "");
  if (!p.success) redirect("/track?error=1");

  // Both ID and phone must match — the order ID alone never reveals an address
  const order = await prisma.order.findFirst({
    where: { code: code.toUpperCase(), phone: p.data },
    include: { items: true, area: true },
  });
  if (!order) redirect("/track?error=1");
  const s = await getSettings();

  const current = STATUS_FLOW.indexOf(order.status as (typeof STATUS_FLOW)[number]);

  return (
    <div className="container-x max-w-3xl py-10">
      <p className="text-sm font-semibold text-brand-700">Order {order.code}</p>
      <h1 className="mt-1 text-2xl font-extrabold md:text-3xl">
        {order.status === "CANCELLED" ? "This order was cancelled" : STATUS_LABEL[order.status]}
      </h1>
      <p className="mt-2 text-slate-600">Pickup {fmt(order.pickupDate)}, {order.pickupSlot} · Delivery {fmt(order.deliveryDate)}</p>

      {order.status !== "CANCELLED" && (
        <ol className="mt-8 grid gap-0 md:grid-cols-6">
          {STATUS_FLOW.map((st, i) => {
            const done = i <= current;
            return (
              <li key={st} className="relative flex items-center gap-3 pb-6 md:flex-col md:pb-0 md:text-center">
                {i < STATUS_FLOW.length - 1 && (
                  <span className={`absolute left-4 top-8 h-full w-0.5 md:left-1/2 md:top-4 md:h-0.5 md:w-full ${i < current ? "bg-brand-600" : "bg-slate-200"}`} aria-hidden />
                )}
                <span className={`relative z-10 grid h-8 w-8 flex-none place-items-center rounded-full ${done ? "bg-brand-600 text-white" : "bg-slate-200 text-slate-400"}`}>
                  {done ? <IconCheck className="h-4 w-4" /> : i + 1}
                </span>
                <span className={`text-sm md:mt-2 md:text-xs ${done ? "font-semibold text-slate-900" : "text-slate-500"}`}>{STATUS_LABEL[st]}</span>
              </li>
            );
          })}
        </ol>
      )}

      <div className="card mt-8 p-5">
        <ul className="space-y-1.5 text-sm">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between"><span>{i.name} × {i.quantity}{i.unit === "PER_KG" ? "kg" : ""} <span className="text-slate-400">({rs(i.price)} {UNIT_LABEL[i.unit]})</span></span><span>{rs(i.lineTotal)}</span></li>
          ))}
        </ul>
        <div className="mt-3 space-y-1 border-t border-slate-200 pt-3 text-sm">
          {order.discount > 0 && <div className="flex justify-between text-emerald-700"><span>Coupon {order.couponCode}</span><span>− {rs(order.discount)}</span></div>}
          <div className="flex justify-between"><span>Delivery</span><span>{order.deliveryFee ? rs(order.deliveryFee) : "Free"}</span></div>
          <div className="flex justify-between text-base font-bold"><span>Total</span><span>{rs(order.total)}</span></div>
          <p className="text-slate-500">Payment: {PAYMENT_LABEL[order.paymentMethod]}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a className="btn-wa" target="_blank" rel="noopener" href={waLink(s.whatsappNumber, `Assalam o Alaikum, about my order ${order.code}`)}>Ask about this order on WhatsApp</a>
        <Link href="/bill-calculator" className="btn-ghost">Place another order</Link>
      </div>
    </div>
  );
}
