import { prisma } from "@/lib/prisma";
import { rs } from "@/lib/site";

const dayKey = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Karachi" }).format(d);
const monthKey = (d: Date) => dayKey(d).slice(0, 7);

type Row = { key: string; orders: number; gross: number; discount: number; delivery: number; total: number };
function group(orders: { createdAt: Date; subtotal: number; discount: number; deliveryFee: number; total: number }[], keyFn: (d: Date) => string) {
  const map = new Map<string, Row>();
  for (const o of orders) {
    const k = keyFn(o.createdAt);
    const r = map.get(k) ?? { key: k, orders: 0, gross: 0, discount: 0, delivery: 0, total: 0 };
    r.orders++; r.gross += o.subtotal; r.discount += o.discount; r.delivery += o.deliveryFee; r.total += o.total;
    map.set(k, r);
  }
  return [...map.values()].sort((a, b) => b.key.localeCompare(a.key));
}

function Table({ title, rows, fmt }: { title: string; rows: Row[]; fmt: (k: string) => string }) {
  const sum = rows.reduce((a, r) => ({ orders: a.orders + r.orders, total: a.total + r.total }), { orders: 0, total: 0 });
  return (
    <div className="card overflow-x-auto">
      <div className="flex items-center justify-between p-4"><h2 className="font-semibold">{title}</h2><p className="text-sm text-slate-500">{sum.orders} orders · {rs(sum.total)}</p></div>
      <table className="w-full min-w-[560px] text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500"><tr><th className="p-3">Period</th><th className="p-3">Orders</th><th className="p-3">Items</th><th className="p-3">Discounts</th><th className="p-3">Delivery</th><th className="p-3 text-right">Total</th></tr></thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r) => (
            <tr key={r.key}><td className="p-3">{fmt(r.key)}</td><td className="p-3">{r.orders}</td><td className="p-3">{rs(r.gross)}</td><td className="p-3 text-slate-500">{r.discount ? `− ${rs(r.discount)}` : "—"}</td><td className="p-3">{rs(r.delivery)}</td><td className="p-3 text-right font-medium">{rs(r.total)}</td></tr>
          ))}
          {!rows.length && <tr><td colSpan={6} className="p-6 text-center text-slate-500">No orders in this period.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export default async function Reports() {
  const since = new Date(Date.now() - 365 * 864e5);
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: since }, status: { not: "CANCELLED" } },
    select: { createdAt: true, subtotal: true, discount: true, deliveryFee: true, total: true },
  });
  const last30 = new Date(Date.now() - 30 * 864e5);
  const daily = group(orders.filter((o) => o.createdAt >= last30), dayKey);
  const monthly = group(orders, monthKey);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sales reports</h1>
        <p className="mt-1 text-sm text-slate-500">Booked value of orders placed (cancelled orders excluded), in Karachi time. This is not cash collected.</p>
      </div>
      <Table title="Daily — last 30 days" rows={daily} fmt={(k) => new Date(k + "T00:00:00Z").toLocaleDateString("en-PK", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" })} />
      <Table title="Monthly — last 12 months" rows={monthly} fmt={(k) => new Date(k + "-01T00:00:00Z").toLocaleDateString("en-PK", { month: "long", year: "numeric", timeZone: "UTC" })} />
    </div>
  );
}
