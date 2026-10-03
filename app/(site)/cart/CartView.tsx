"use client";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { Stepper } from "@/components/Stepper";
import { IconCart, IconTag, IconTruck } from "@/components/Icons";
import { rs, UNIT_LABEL } from "@/lib/site";
import { Sk, SkRow } from "@/components/Skeleton";

/** Laundo-style order summary: item table, promo hint, payment details, Continue. */
export function CartView({ threshold, fee }: { threshold: number; fee: number }) {
  const { items, subtotal, count, ready } = useCart();
  if (!ready) {
    return (
      <div className="container-x pt-4 md:mx-auto md:max-w-3xl md:py-10">
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200"><div className="divide-y divide-slate-100">{[0, 1, 2].map((i) => <SkRow key={i} />)}</div></div>
        <Sk className="mt-3 h-14 w-full rounded-2xl" /><Sk className="mt-3 h-36 w-full rounded-2xl" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="container-x py-20 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand-600"><IconCart className="h-8 w-8" /></span>
        <h1 className="mt-4 text-xl font-bold text-brand-900">Your cart is empty</h1>
        <p className="mt-1 text-slate-600">Add a few items to book a pickup.</p>
        <Link href="/services" className="btn-primary mt-6">Book now</Link>
      </div>
    );
  }

  const free = subtotal >= threshold;
  const delivery = free ? 0 : fee;
  const left = threshold - subtotal;

  return (
    <div className="container-x pb-32 pt-4 md:mx-auto md:max-w-3xl md:py-10">
      <h1 className="hidden text-3xl font-bold text-brand-900 md:block">Your order</h1>

      <section className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 md:mt-6">
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 bg-brand-50 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-brand-700">
          <span>Item</span><span className="w-16 text-right">Price</span><span className="w-[100px]" />
        </div>
        <ul className="divide-y divide-slate-100">
          {items.map((i) => (
            <li key={i.serviceId} className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug text-brand-900">{i.name}</p>
                <p className="text-xs text-slate-500">{rs(i.price)} {UNIT_LABEL[i.unit]}</p>
              </div>
              <p className="w-16 text-right text-sm font-semibold text-brand-900">{rs(i.price * i.quantity)}</p>
              <div className="flex w-[100px] justify-end"><Stepper item={i} /></div>
            </li>
          ))}
        </ul>
        <Link href="/services" className="flex items-center gap-2 border-t border-slate-100 px-4 py-3 text-sm font-semibold text-brand-600">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-100 text-base leading-none">+</span>Add more items
        </Link>
      </section>

      <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200">
        <IconTag className="h-5 w-5 text-brand-600" />
        <p className="flex-1 text-sm text-slate-700">Have a promo code? <span className="text-slate-500">Apply it at the next step.</span></p>
      </div>

      {!free && (
        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-brand-50 px-4 py-3 ring-1 ring-brand-100">
          <IconTruck className="h-5 w-5 flex-none text-brand-600" />
          <p className="text-sm text-brand-900">Add <b>{rs(left)}</b> more for free pickup &amp; delivery — or book for Sunday.</p>
        </div>
      )}

      <section className="mt-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
        <h2 className="font-semibold text-brand-900">Payment details</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-slate-600">Items total</dt><dd>{rs(subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-slate-600">Pickup &amp; delivery</dt><dd className={free ? "font-medium text-emerald-600" : ""}>{free ? "Free" : rs(delivery)}</dd></div>
          <div className="flex justify-between border-t border-dashed border-slate-200 pt-2 text-base font-bold text-brand-900"><dt>To pay</dt><dd className="text-brand-600">{rs(subtotal + delivery)}</dd></div>
        </dl>
        <p className="mt-2 text-xs text-slate-500">Sunday pickup &amp; delivery is free for any order. Per-kg items are weighed at pickup.</p>
        <div className="hidden md:block"><Link href="/checkout" className="btn-primary mt-4 w-full text-base">Choose pickup time</Link></div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white px-4 pt-3 pb-[max(.75rem,env(safe-area-inset-bottom))] md:hidden">
        <Link href="/checkout" className="btn-primary w-full py-3.5 text-base">
          Continue · {count} item{count > 1 ? "s" : ""} · {rs(subtotal + delivery)}
        </Link>
      </div>
    </div>
  );
}
