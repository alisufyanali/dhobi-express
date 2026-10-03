"use client";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { rs } from "@/lib/site";

/** Live estimate like a bill calculator: items, delivery, grand total, Book order. */
export function BillSummary({ threshold, fee }: { threshold: number; fee: number }) {
  const { items, subtotal, count, ready } = useCart();
  const free = subtotal >= threshold;
  const delivery = !count || free ? 0 : fee;
  const left = Math.max(0, threshold - subtotal);
  const pct = Math.min(100, Math.round((subtotal / threshold) * 100));

  return (
    <aside className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
      <h2 className="font-semibold text-brand-900">Your estimate</h2>
      {!ready || !count ? (
        <p className="mt-3 text-sm text-slate-500">Tap + on any item to see your total here.</p>
      ) : (
        <ul className="mt-3 max-h-56 space-y-1.5 overflow-y-auto text-sm">
          {items.map((i) => (
            <li key={i.serviceId} className="flex justify-between gap-3">
              <span className="min-w-0 truncate text-slate-600">{i.quantity}{i.unit === "PER_KG" ? "kg" : "×"} {i.name}</span>
              <span className="flex-none">{rs(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
      )}
      <dl className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-sm">
        <div className="flex justify-between"><dt className="text-slate-600">Subtotal</dt><dd>{rs(subtotal)}</dd></div>
        <div className="flex justify-between">
          <dt className="text-slate-600">Pickup &amp; delivery</dt>
          <dd className={free && count ? "font-medium text-emerald-600" : ""}>{!count ? "—" : free ? "Free" : rs(delivery)}</dd>
        </div>
        <div className="flex justify-between border-t border-dashed border-slate-200 pt-2 text-base font-bold text-brand-900"><dt>Grand total</dt><dd className="text-brand-600">{rs(subtotal + delivery)}</dd></div>
      </dl>
      {count > 0 && !free && (
        <div className="mt-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-brand-50"><div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} /></div>
          <p className="mt-1.5 text-xs text-slate-500">Add {rs(left)} more for free delivery — or book for Sunday.</p>
        </div>
      )}
      <p className="mt-3 text-xs text-slate-500">New customer? Code <b className="text-brand-700">WELCOME10</b> gives 10% off at checkout.</p>
      {count > 0
        ? <Link href="/cart" className="btn-primary mt-4 w-full">Book order now</Link>
        : <span className="btn mt-4 w-full cursor-not-allowed bg-slate-100 text-slate-400">Book order now</span>}
    </aside>
  );
}
