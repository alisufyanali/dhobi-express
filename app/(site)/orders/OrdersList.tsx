"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { readSavedOrders } from "@/lib/my-orders";
import { rs, STATUS_LABEL } from "@/lib/site";
import { IconBox, IconCheck, IconDrop, IconIron, IconTruck } from "@/components/Icons";

type O = {
  code: string; phone: string; status: string; total: number; createdAt: string;
  pickupDate: string; pickupSlot: string; deliveryDate: string; items: { name: string; quantity: number }[];
};

const STEPS = [
  { keys: ["PICKUP_PENDING"], label: "Booked", I: IconCheck },
  { keys: ["PICKED_UP"], label: "Picked up", I: IconTruck },
  { keys: ["WASHING"], label: "Washing", I: IconDrop },
  { keys: ["PRESSING"], label: "Pressing", I: IconIron },
  { keys: ["OUT_FOR_DELIVERY", "DELIVERED"], label: "Delivery", I: IconBox },
];
const DONE = ["DELIVERED", "CANCELLED"];
const day = (d: string) => new Date(d + (d.length === 10 ? "T00:00:00Z" : "")).toLocaleDateString("en-PK", { day: "numeric", month: "short", timeZone: "UTC" });

function Chip({ status }: { status: string }) {
  const tone = status === "DELIVERED" ? "bg-emerald-50 text-emerald-700" : status === "CANCELLED" ? "bg-red-50 text-red-700" : status === "PICKUP_PENDING" ? "bg-amber-50 text-amber-800" : "bg-brand-50 text-brand-700";
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone}`}>{STATUS_LABEL[status] ?? status}</span>;
}

function OrderCard({ o }: { o: O }) {
  const current = STEPS.findIndex((s) => s.keys.includes(o.status));
  const pieces = o.items.reduce((n, i) => n + (Number.isInteger(i.quantity) ? i.quantity : 1), 0);
  return (
    <li className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-brand-900">Order {o.code}</p>
          <p className="text-xs text-slate-500">Placed {new Date(o.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Karachi" })}</p>
        </div>
        <Chip status={o.status} />
      </div>

      {o.status !== "CANCELLED" && (
        <ol className="mt-4 flex items-start">
          {STEPS.map(({ label, I }, n) => {
            const done = n <= current;
            return (
              <li key={label} className="flex flex-1 flex-col items-center text-center last:flex-none">
                <div className="flex w-full items-center">
                  <span className={`grid h-7 w-7 flex-none place-items-center rounded-full ${done ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                    {n < current || o.status === "DELIVERED" ? <IconCheck className="h-3.5 w-3.5" /> : <I className="h-3.5 w-3.5" />}
                  </span>
                  {n < STEPS.length - 1 && <span className={`mx-0.5 h-0.5 flex-1 rounded ${n < current ? "bg-brand-600" : "bg-slate-200"}`} />}
                </div>
                <span className={`mt-1 self-start text-[10px] ${done ? "font-semibold text-brand-900" : "text-slate-400"}`}>{label}</span>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-center text-xs">
        <div><p className="text-slate-500">Pickup</p><p className="mt-0.5 font-semibold text-brand-900">{day(o.pickupDate)}</p></div>
        <div><p className="text-slate-500">Delivery</p><p className="mt-0.5 font-semibold text-brand-900">{day(o.deliveryDate)}</p></div>
        <div><p className="text-slate-500">{pieces} item{pieces === 1 ? "" : "s"}</p><p className="mt-0.5 font-semibold text-brand-900">{rs(o.total)}</p></div>
      </div>
      <p className="mt-3 line-clamp-1 text-xs text-slate-500">{o.items.map((i) => `${i.quantity}× ${i.name.split(" — ")[0]}`).join(", ")}</p>

      <div className="mt-3 flex gap-2">
        <Link href={`/order/${o.code}?phone=${o.phone}`} className="btn-primary flex-1 py-2.5">{DONE.includes(o.status) ? "View details" : "Track order"}</Link>
        <Link href="/complaints" className="btn-ghost py-2.5">Need help?</Link>
      </div>
    </li>
  );
}

export function OrdersList() {
  const [orders, setOrders] = useState<O[] | null>(null);
  const [tab, setTab] = useState<"active" | "past">("active");

  useEffect(() => {
    const saved = readSavedOrders();
    if (!saved.length) return setOrders([]);
    fetch("/api/my-orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orders: saved }) })
      .then((r) => r.json()).then((d) => setOrders(d.orders ?? [])).catch(() => setOrders([]));
  }, []);

  if (orders === null) {
    return <div className="space-y-3">{[0, 1].map((i) => <div key={i} className="h-56 animate-pulse rounded-2xl bg-slate-200" />)}</div>;
  }

  const active = orders.filter((o) => !DONE.includes(o.status));
  const past = orders.filter((o) => DONE.includes(o.status));
  const shown = tab === "active" ? active : past;

  return (
    <div>
      <div className="grid grid-cols-2 rounded-2xl bg-white p-1 ring-1 ring-slate-200" role="tablist">
        {([["active", `Active (${active.length})`], ["past", `Completed (${past.length})`]] as const).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
            className={`rounded-xl py-2.5 text-sm font-semibold ${tab === k ? "bg-brand-600 text-white" : "text-slate-600"}`}>{l}</button>
        ))}
      </div>

      {shown.length ? (
        <ul className="mt-4 space-y-3">{shown.map((o) => <OrderCard key={o.code} o={o} />)}</ul>
      ) : (
        <div className="mt-4 rounded-2xl bg-white p-8 text-center ring-1 ring-slate-200">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-600"><IconBox className="h-7 w-7" /></span>
          <p className="mt-3 font-semibold text-brand-900">{tab === "active" ? "No active orders" : "No completed orders yet"}</p>
          <p className="mt-1 text-sm text-slate-500">Orders you place from this phone appear here.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Link href="/services" className="btn-primary">Book a pickup</Link>
            <Link href="/track" className="btn-ghost">Find an order</Link>
          </div>
        </div>
      )}
    </div>
  );
}
