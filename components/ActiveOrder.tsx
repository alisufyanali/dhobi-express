"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IconBox, IconCheck, IconDrop, IconIron, IconTruck } from "./Icons";
import { rs, STATUS_LABEL } from "@/lib/site";

type O = { code: string; phone: string; status: string; total: number; items: number; pickup: string };

const STEPS = [
  { key: ["PICKUP_PENDING", "PICKED_UP"], label: "Pickup", I: IconTruck },
  { key: ["WASHING"], label: "Washing", I: IconDrop },
  { key: ["PRESSING"], label: "Pressing", I: IconIron },
  { key: ["OUT_FOR_DELIVERY", "DELIVERED"], label: "Delivery", I: IconBox },
];

/** Shows the customer's latest order (saved on this phone at checkout) until it's delivered. */
export function ActiveOrder() {
  const [o, setO] = useState<O | null>(null);

  useEffect(() => {
    let saved: { code: string; phone: string } | null = null;
    try { saved = JSON.parse(localStorage.getItem("last-order") ?? "null"); } catch {}
    if (!saved?.code) return;
    fetch(`/api/order-status?code=${encodeURIComponent(saved.code)}&phone=${encodeURIComponent(saved.phone)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && !["DELIVERED", "CANCELLED"].includes(d.status) && setO(d))
      .catch(() => {});
  }, []);

  if (!o) return null;
  const current = STEPS.findIndex((s) => s.key.includes(o.status));

  return (
    <section className="container-x pt-6">
      <h2 className="h-section">Active order</h2>
      <Link href={`/order/${o.code}?phone=${o.phone}`} className="card mt-3 block p-4 active:scale-[.99]">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-brand-50 text-brand-600"><IconDrop className="h-5 w-5" /></span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-brand-900">Order {o.code}</p>
            <p className="text-xs text-slate-500">{o.items} item{o.items === 1 ? "" : "s"} · {rs(o.total)} · Pickup {o.pickup}</p>
          </div>
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800">{STATUS_LABEL[o.status]}</span>
        </div>
        <ol className="mt-4 flex items-center">
          {STEPS.map(({ label, I }, n) => {
            const done = n <= current;
            return (
              <li key={label} className="flex flex-1 flex-col items-center last:flex-none">
                <div className="flex w-full items-center">
                  <span className={`grid h-7 w-7 flex-none place-items-center rounded-full ${done ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                    {n < current ? <IconCheck className="h-3.5 w-3.5" /> : <I className="h-3.5 w-3.5" />}
                  </span>
                  {n < STEPS.length - 1 && <span className={`mx-1 h-0.5 flex-1 rounded ${n < current ? "bg-brand-600" : "bg-slate-200"}`} />}
                </div>
                <span className={`mt-1 self-start text-[10px] ${done ? "font-semibold text-brand-900" : "text-slate-400"}`}>{label}</span>
              </li>
            );
          })}
        </ol>
      </Link>
    </section>
  );
}
