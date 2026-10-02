"use client";
import { useCart, type CartItem } from "./CartProvider";

/** − qty + control bound to the cart. Shows a single + until the item is added. */
export function Stepper({ item }: { item: Omit<CartItem, "quantity"> }) {
  const { items, add, setQty } = useCart();
  const q = items.find((i) => i.serviceId === item.serviceId)?.quantity ?? 0;
  const step = item.unit === "PER_KG" ? 0.5 : 1;
  const btn = "grid h-8 w-8 place-items-center rounded-full text-lg leading-none transition active:scale-90";

  if (!q) {
    return <button onClick={() => add(item, 1)} className={`${btn} bg-brand-600 text-white`} aria-label={`Add ${item.name}`}>+</button>;
  }
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={() => setQty(item.serviceId, +(q - step).toFixed(1))} className={`${btn} bg-brand-100 text-brand-700`} aria-label={`Remove one ${item.name}`}>−</button>
      <span className="min-w-7 text-center text-sm font-semibold text-brand-900">{q}{item.unit === "PER_KG" ? "kg" : ""}</span>
      <button onClick={() => setQty(item.serviceId, +(q + step).toFixed(1))} className={`${btn} bg-brand-700 text-white`} aria-label={`Add one more ${item.name}`}>+</button>
    </div>
  );
}
