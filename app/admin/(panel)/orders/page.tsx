import Link from "next/link";
import type { OrderStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { rs, STATUS_LABEL } from "@/lib/site";

type SP = { status?: string; date?: string; area?: string; q?: string };

export default async function OrdersPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const where: Prisma.OrderWhereInput = {};
  if (sp.status && sp.status in STATUS_LABEL) where.status = sp.status as OrderStatus;
  if (sp.area) where.areaId = sp.area;
  if (sp.date && /^\d{4}-\d{2}-\d{2}$/.test(sp.date)) where.pickupDate = new Date(sp.date + "T00:00:00Z");
  if (sp.q) where.OR = [{ code: { contains: sp.q, mode: "insensitive" } }, { phone: { contains: sp.q } }, { name: { contains: sp.q, mode: "insensitive" } }];

  const [orders, areas] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, take: 100, include: { area: true } }),
    prisma.area.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>
      <form className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <input name="q" defaultValue={sp.q} placeholder="ID, phone or name" className="input" />
        <select name="status" defaultValue={sp.status ?? ""} className="input"><option value="">All statuses</option>{Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <select name="area" defaultValue={sp.area ?? ""} className="input"><option value="">All areas</option>{areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
        <input name="date" type="date" defaultValue={sp.date} className="input" aria-label="Pickup date" />
        <div className="flex gap-2"><button className="btn-primary flex-1">Filter</button><Link href="/admin/orders" className="btn-ghost">Reset</Link></div>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Area</th><th className="p-3">Pickup</th><th className="p-3">Status</th><th className="p-3 text-right">Total</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50">
                <td className="p-3"><Link href={`/admin/orders/${o.id}`} className="font-mono font-semibold text-brand-700">{o.code}</Link></td>
                <td className="p-3">{o.name}<br /><span className="text-slate-500">{o.phone}</span></td>
                <td className="p-3">{o.area.name}</td>
                <td className="p-3">{o.pickupDate.toISOString().slice(0, 10)}<br /><span className="text-slate-500">{o.pickupSlot}</span></td>
                <td className="p-3"><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{STATUS_LABEL[o.status]}</span></td>
                <td className="p-3 text-right font-medium">{rs(o.total)}</td>
              </tr>
            ))}
            {!orders.length && <tr><td colSpan={6} className="p-6 text-center text-slate-500">No orders match.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
