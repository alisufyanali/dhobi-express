import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { PAYMENT_LABEL, rs, STATUS_LABEL, UNIT_LABEL, waLink } from "@/lib/site";
import { saveNotes, updateStatus } from "../actions";
import { PrintButton } from "./PrintButton";

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [o, s] = await Promise.all([
    prisma.order.findUnique({ where: { id }, include: { items: true, area: true, history: { orderBy: { createdAt: "asc" } }, customer: { include: { _count: { select: { orders: true } } } } } }),
    getSettings(),
  ]);
  if (!o) notFound();
  const d = (x: Date) => x.toISOString().slice(0, 10);
  const msg = `Assalam o Alaikum ${o.name}, your Dhobi Express order ${o.code} is now: ${STATUS_LABEL[o.status]}. Total ${rs(o.total)}.`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* Invoice — this block is what prints */}
      <section className="card p-5 print:border-0 print:p-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-extrabold text-brand-700">Dhobi Express</p>
            <p className="text-xs text-slate-500">{s.phone} · {s.email}</p>
          </div>
          <div className="text-right"><p className="font-mono text-lg font-bold">{o.code}</p><p className="text-xs text-slate-500">Placed {o.createdAt.toLocaleString("en-PK", { timeZone: "Asia/Karachi" })}</p></div>
        </div>
        <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          <div><p className="text-xs uppercase text-slate-500">Customer</p><p className="font-medium">{o.name}</p><p>{o.phone}</p><p>{o.address}</p><p>{o.area.name}</p></div>
          <div><p className="text-xs uppercase text-slate-500">Schedule</p><p>Pickup: {d(o.pickupDate)}, {o.pickupSlot}</p><p>Delivery: {d(o.deliveryDate)}</p><p>Payment: {PAYMENT_LABEL[o.paymentMethod]}</p></div>
        </div>
        {o.notes && <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm"><b>Customer note:</b> {o.notes}</p>}
        <table className="mt-5 w-full text-sm">
          <thead className="border-b text-left text-xs uppercase text-slate-500"><tr><th className="py-2">Item</th><th>Qty</th><th>Rate</th><th className="text-right">Amount</th></tr></thead>
          <tbody>{o.items.map((i) => (<tr key={i.id} className="border-b border-slate-100"><td className="py-2">{i.name}</td><td>{i.quantity}{i.unit === "PER_KG" ? " kg" : ""}</td><td>{rs(i.price)} {UNIT_LABEL[i.unit]}</td><td className="text-right">{rs(i.lineTotal)}</td></tr>))}</tbody>
          <tfoot>
            <tr><td colSpan={3} className="pt-3 text-right">Subtotal</td><td className="pt-3 text-right">{rs(o.subtotal)}</td></tr>
            <tr><td colSpan={3} className="text-right">Delivery</td><td className="text-right">{o.deliveryFee ? rs(o.deliveryFee) : "Free"}</td></tr>
            <tr className="text-base font-bold"><td colSpan={3} className="text-right">Total</td><td className="text-right">{rs(o.total)}</td></tr>
          </tfoot>
        </table>
      </section>

      <aside className="space-y-4 print:hidden">
        <form action={updateStatus.bind(null, o.id)} className="card space-y-3 p-4">
          <label className="label" htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={o.status} className="input">{Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
          <button className="btn-primary w-full">Update status</button>
          <a href={waLink(o.phone.replace(/^0/, "92"), msg)} target="_blank" rel="noopener" className="btn-wa w-full">Send status on WhatsApp</a>
        </form>
        <form action={saveNotes.bind(null, o.id)} className="card space-y-3 p-4">
          <label className="label" htmlFor="internalNotes">Internal notes</label>
          <textarea id="internalNotes" name="internalNotes" rows={4} defaultValue={o.internalNotes ?? ""} className="input" placeholder="Only admins see this" />
          <button className="btn-ghost w-full">Save notes</button>
        </form>
        <PrintButton />
        <div className="card p-4 text-sm">
          <p className="font-semibold">History</p>
          <ul className="mt-2 space-y-1 text-slate-600">{o.history.map((h) => <li key={h.id}>{STATUS_LABEL[h.status]} — {h.createdAt.toLocaleString("en-PK", { timeZone: "Asia/Karachi" })}</li>)}</ul>
          <p className="mt-3 text-slate-500">Customer has {o.customer._count.orders} order(s) in total.</p>
        </div>
      </aside>
    </div>
  );
}
