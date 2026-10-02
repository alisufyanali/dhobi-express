"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { PhoneInput } from "@/components/PhoneInput";
import { DeliveryProgress } from "@/components/DeliveryProgress";
import { calcDelivery, isSunday, type DeliverySettings } from "@/lib/delivery";
import { orderSchema } from "@/lib/validators";
import { PAYMENT_LABEL, rs } from "@/lib/site";

type Props = { demo?: boolean; areas: { id: string; name: string }[]; slots: string[]; today: string; settings: DeliverySettings };
type Errors = Partial<Record<string, string>>;

const PAYMENT_HELP: Record<string, string> = {
  COD: "Pay cash to the rider when your clothes are delivered.",
  JAZZCASH: "Send the total to JazzCash 03XX-XXXXXXX (Dhobi Express) and share the screenshot on WhatsApp with your order ID.",
  EASYPAISA: "Send the total to Easypaisa 03XX-XXXXXXX (Dhobi Express) and share the screenshot on WhatsApp with your order ID.",
  BANK_TRANSFER: "Bank: XXXX · Title: Dhobi Express · IBAN: PKXX XXXX XXXX XXXX. Share the receipt on WhatsApp with your order ID.",
};

export function CheckoutForm({ demo, areas, slots, today, settings }: Props) {
  const { items, subtotal, clear, ready } = useCart();
  const router = useRouter();
  const [f, setF] = useState({
    name: "", phone: "", address: "", areaId: "", pickupDate: "", pickupSlot: "", deliveryDate: "", notes: "", paymentMethod: "COD",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; discount: number; label: string } | null>(null);
  const [couponMsg, setCouponMsg] = useState("");

  async function applyCoupon() {
    setCouponMsg("");
    const res = await fetch("/api/coupons", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponInput, subtotal, phone: f.phone || undefined }) }).catch(() => null);
    const data = await res?.json().catch(() => null);
    if (data?.ok) { setCoupon({ code: data.code, discount: data.discount, label: data.label }); setCouponInput(data.code); }
    else { setCoupon(null); setCouponMsg(data?.message ?? "Couldn't check the coupon."); }
  }

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const delivery = calcDelivery(subtotal, f.pickupDate || undefined, f.deliveryDate || undefined, settings);
  const discount = coupon?.discount ?? 0;
  const total = subtotal - discount + delivery.fee;

  if (!ready) return <div className="container-x py-16" />;
  if (!items.length) {
    return (
      <div className="container-x py-20 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link href="/services" className="btn-primary mt-6">Browse services</Link>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    const payload = { ...f, couponCode: coupon?.code ?? "", items: items.map((i) => ({ serviceId: i.serviceId, quantity: i.quantity })) };
    const parsed = orderSchema.safeParse(payload);
    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] ??= issue.message;
      setErrors(errs);
      document.querySelector(`[name="${Object.keys(errs)[0]}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});
    if (demo) {
      setServerError("This is a demo preview, so orders aren't saved yet. Please book on WhatsApp for now.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        setServerError(data.error ?? "Could not place the order. Please try again or WhatsApp us.");
        return;
      }
      try { localStorage.setItem("last-order", JSON.stringify({ code: data.code, phone: data.phone })); } catch {}
      clear();
      router.push(`/order/${data.code}?phone=${encodeURIComponent(data.phone)}`);
    } catch {
      setServerError("Network problem. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const E = ({ k }: { k: string }) => (errors[k] ? <p className="err">{errors[k]}</p> : null);

  return (
    <form onSubmit={submit} noValidate className="container-x pb-32 pt-4 md:grid md:grid-cols-[1fr_380px] md:gap-10 md:py-12">
      <div className="space-y-3 md:space-y-8">
        <h1 className="hidden text-3xl font-bold text-brand-900 md:block">Book your pickup</h1>

        <div className="card p-4 md:rounded-none md:border-0 md:bg-transparent md:p-0"><fieldset className="space-y-4">
          <legend className="mb-2 font-semibold text-slate-900">1. Pickup time</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="pickupDate">Pickup date</label>
              <input id="pickupDate" name="pickupDate" type="date" min={today} className="input" value={f.pickupDate}
                onChange={(e) => setF((p) => ({ ...p, pickupDate: e.target.value, deliveryDate: p.deliveryDate && p.deliveryDate < e.target.value ? "" : p.deliveryDate }))} />
              <E k="pickupDate" />
            </div>
            <div>
              <label className="label" htmlFor="deliveryDate">Preferred delivery date</label>
              <input id="deliveryDate" name="deliveryDate" type="date" min={f.pickupDate || today} className="input" value={f.deliveryDate} onChange={set("deliveryDate")} />
              <E k="deliveryDate" />
            </div>
          </div>
          <div>
            <span className="label">Pickup slot</span>
            <div className="grid grid-cols-2 gap-2" role="radiogroup">
              {slots.map((sl) => (
                <label key={sl} className={`cursor-pointer rounded-xl border p-3 text-center text-sm font-semibold ${f.pickupSlot === sl ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-300"}`}>
                  <input type="radio" name="pickupSlot" value={sl} className="sr-only" checked={f.pickupSlot === sl} onChange={set("pickupSlot")} />{sl}
                </label>
              ))}
            </div>
            <E k="pickupSlot" />
          </div>
          {f.pickupDate && isSunday(f.pickupDate) && !(f.deliveryDate && isSunday(f.deliveryDate)) && settings.sundayFreeDelivery && (
            <p className="rounded-xl bg-amber-50 p-3 text-sm text-slate-800">Sunday pickup! Choose a Sunday delivery too to get free delivery on any order size.</p>
          )}
        </fieldset></div>

        <div className="card p-4 md:rounded-none md:border-0 md:bg-transparent md:p-0"><fieldset className="space-y-4">
          <legend className="mb-2 font-semibold text-slate-900">2. Your details</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label" htmlFor="name">Name</label><input id="name" name="name" className="input" autoComplete="name" value={f.name} onChange={set("name")} /><E k="name" /></div>
            <div><label className="label" htmlFor="phone">Mobile number</label><PhoneInput id="phone" name="phone" defaultValue={f.phone} onChange={(v) => setF((p) => ({ ...p, phone: v }))} /><E k="phone" /></div>
          </div>
          <div>
            <label className="label" htmlFor="areaId">Area</label>
            <select id="areaId" name="areaId" className="input" value={f.areaId} onChange={set("areaId")}>
              <option value="">Select your area</option>
              {areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <E k="areaId" />
          </div>
          <div><label className="label" htmlFor="address">Full address</label><textarea id="address" name="address" rows={2} className="input" placeholder="House/flat no., block, street, landmark" autoComplete="street-address" value={f.address} onChange={set("address")} /><E k="address" /></div>
          <div><label className="label" htmlFor="notes">Notes (optional)</label><textarea id="notes" name="notes" rows={2} className="input" placeholder="e.g. stain on white shirt, call before coming" value={f.notes} onChange={set("notes")} /></div>
        </fieldset></div>

        <div className="card p-4 md:rounded-none md:border-0 md:bg-transparent md:p-0"><fieldset>
          <legend className="mb-2 font-semibold text-slate-900">3. Payment</legend>
          <div className="space-y-2">
            {Object.entries(PAYMENT_LABEL).map(([k, label]) => (
              <label key={k} className={`block cursor-pointer rounded-xl border p-4 ${f.paymentMethod === k ? "border-brand-600 bg-brand-50" : "border-slate-300"}`}>
                <span className="flex items-center gap-3">
                  <input type="radio" name="paymentMethod" value={k} checked={f.paymentMethod === k} onChange={set("paymentMethod")} className="accent-brand-600" />
                  <span className="font-medium">{label}</span>
                </span>
                {f.paymentMethod === k && <span className="mt-2 block pl-7 text-sm text-slate-600">{PAYMENT_HELP[k]}</span>}
              </label>
            ))}
          </div>
        </fieldset></div>
      </div>

      <aside className="mt-8 h-fit space-y-4 md:sticky md:top-24 md:mt-0">
        {delivery.reason !== "sunday" && <DeliveryProgress subtotal={subtotal} threshold={settings.freeDeliveryThreshold} />}
        <div className="card p-5">
          <p className="font-semibold">Order summary</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {items.map((i) => (
              <li key={i.serviceId} className="flex justify-between gap-3"><span className="text-slate-600">{i.name} × {i.quantity}{i.unit === "PER_KG" ? "kg" : ""}</span><span>{rs(i.price * i.quantity)}</span></li>
            ))}
          </ul>
          <div className="mt-3 space-y-1.5 border-t border-slate-200 pt-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{rs(subtotal)}</span></div>
            {coupon && (
              <div className="flex justify-between text-emerald-700"><span>Coupon {coupon.code} ({coupon.label})</span><span>− {rs(coupon.discount)}</span></div>
            )}
            <div className="flex justify-between">
              <span>Delivery {delivery.reason === "sunday" && <span className="text-emerald-700">(Sunday free)</span>}</span>
              <span>{delivery.fee ? rs(delivery.fee) : "Free"}</span>
            </div>
            <div className="flex justify-between pt-1 text-lg font-bold"><span>Total</span><span>{rs(total)}</span></div>
          </div>
          <div className="mt-4 border-t border-slate-200 pt-4">
            <div className="flex gap-2">
              <input value={couponInput} onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); if (coupon) setCoupon(null); }}
                placeholder="Coupon code" aria-label="Coupon code" className="input py-2 text-sm uppercase" />
              <button type="button" onClick={applyCoupon} disabled={!couponInput.trim()} className="btn-ghost px-4 py-2">Apply</button>
            </div>
            {couponMsg && <p className="err">{couponMsg}</p>}
            {!coupon && !couponMsg && <p className="mt-1.5 text-xs text-slate-500">First order? Use <b>WELCOME10</b> for 10% off.</p>}
          </div>
          {serverError && <p className="err mt-3">{serverError}</p>}
          <div className="hidden md:block"><button disabled={submitting} className="btn-primary mt-4 w-full text-base">{submitting ? "Placing order…" : "Place order"}</button></div>
          <p className="mt-2 text-center text-xs text-slate-500">No payment needed now for Cash on Delivery.</p>
        </div>
      </aside>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white px-4 pt-3 pb-[max(.75rem,env(safe-area-inset-bottom))] md:hidden">
        {serverError && <p className="err mb-2">{serverError}</p>}
        <div className="flex items-center gap-3">
          <div className="flex-1"><p className="text-xs text-slate-500">Total{delivery.fee === 0 ? " · free delivery" : ""}</p><p className="text-lg font-bold text-brand-900">{rs(total)}</p></div>
          <button disabled={submitting} className="btn-primary px-6 text-base">{submitting ? "Placing…" : "Place order"}</button>
        </div>
      </div>
    </form>
  );
}
