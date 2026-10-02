"use client";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { DeliveryProgress } from "@/components/DeliveryProgress";
import { rs, UNIT_LABEL } from "@/lib/site";

export function CartView({ threshold }: { threshold: number }) {
  const { items, subtotal, setQty, remove, ready } = useCart();
  if (!ready) return <div className="container-x py-16" />;

  if (!items.length) {
    return (
      <div className="container-x py-20 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-slate-600">Add a few services to book a pickup.</p>
        <Link href="/services" className="btn-primary mt-6">Browse services</Link>
      </div>
    );
  }

  return (
    <div className="container-x py-8 md:grid md:grid-cols-[1fr_360px] md:gap-10 md:py-12">
      <div>
        <h1 className="text-2xl font-extrabold md:text-3xl">Your cart</h1>
        <ul className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200">
          {items.map((i) => {
            const step = i.unit === "PER_KG" ? 0.5 : 1;
            return (
              <li key={i.serviceId} className="flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900">{i.name}</p>
                  <p className="text-sm text-slate-500">{rs(i.price)} {UNIT_LABEL[i.unit]}</p>
                </div>
                <div className="flex items-center rounded-xl border border-slate-200">
                  <button className="h-10 w-10 text-lg" aria-label="Decrease" onClick={() => setQty(i.serviceId, +(i.quantity - step).toFixed(1))}>−</button>
                  <span className="w-12 text-center text-sm font-semibold">{i.quantity}{i.unit === "PER_KG" ? "kg" : ""}</span>
                  <button className="h-10 w-10 text-lg" aria-label="Increase" onClick={() => setQty(i.serviceId, +(i.quantity + step).toFixed(1))}>+</button>
                </div>
                <div className="hidden w-24 text-right font-semibold sm:block">{rs(i.price * i.quantity)}</div>
                <button onClick={() => remove(i.serviceId)} className="text-sm text-slate-400 hover:text-red-600" aria-label={`Remove ${i.name}`}>✕</button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs text-slate-500">Per-kg items are weighed at pickup; your final bill uses the actual weight.</p>
      </div>
      <aside className="mt-6 h-fit space-y-4 md:sticky md:top-24 md:mt-0">
        <DeliveryProgress subtotal={subtotal} threshold={threshold} />
        <div className="card p-5">
          <div className="flex justify-between text-lg font-bold"><span>Subtotal</span><span>{rs(subtotal)}</span></div>
          <p className="mt-1 text-xs text-slate-500">Delivery calculated at checkout.</p>
          <Link href="/checkout" className="btn-primary mt-4 w-full text-base">Choose pickup time →</Link>
        </div>
      </aside>
    </div>
  );
}
