import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { karachiRanges } from "@/lib/admin-dates";
import { rs, STATUS_LABEL } from "@/lib/site";

export default async function Dashboard() {
  const { today, startToday, startMonth } = karachiRanges();
  const notCancelled = { status: { not: "CANCELLED" as const } };
  const [todayOrders, pendingPickups, revToday, revMonth, newInquiries, openComplaints, recent] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: startToday } } }),
    prisma.order.count({ where: { status: "PICKUP_PENDING", pickupDate: { lte: new Date(today + "T00:00:00Z") } } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: startToday }, ...notCancelled } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: startMonth }, ...notCancelled } }),
    prisma.businessInquiry.count({ where: { replied: false } }),
    prisma.complaint.count({ where: { status: "OPEN" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { area: true } }),
  ]);

  const stats = [
    ["Orders today", todayOrders],
    ["Pickups due (today or overdue)", pendingPickups],
    ["Booked today", rs(revToday._sum.total ?? 0)],
    ["Booked this month", rs(revMonth._sum.total ?? 0)],
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(([l, v]) => (<div key={String(l)} className="card p-4"><p className="text-xs text-slate-500">{l}</p><p className="mt-1 text-2xl font-bold">{v}</p></div>))}
      </div>
      {openComplaints > 0 && <Link href="/admin/complaints" className="block rounded-xl bg-red-50 p-4 text-sm font-medium text-red-800">{openComplaints} open complaint{openComplaints === 1 ? "" : "s"} — reply within 24 hours →</Link>}
      {newInquiries > 0 && <Link href="/admin/inquiries" className="block rounded-xl bg-amber-50 p-4 text-sm font-medium">{newInquiries} business inquir{newInquiries === 1 ? "y" : "ies"} waiting for a reply →</Link>}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-4"><h2 className="font-semibold">Latest orders</h2><Link href="/admin/orders" className="text-sm text-brand-700">All orders →</Link></div>
        <ul className="divide-y divide-slate-100">
          {recent.map((o) => (
            <li key={o.id}><Link href={`/admin/orders/${o.id}`} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50">
              <span className="font-mono font-semibold">{o.code}</span><span className="flex-1 truncate text-slate-600">{o.name} · {o.area.name}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{STATUS_LABEL[o.status]}</span><span className="w-20 text-right font-medium">{rs(o.total)}</span>
            </Link></li>
          ))}
          {!recent.length && <li className="p-4 text-sm text-slate-500">No orders yet.</li>}
        </ul>
      </div>
      <p className="text-xs text-slate-400">&quot;Booked&quot; = total of orders placed, not cash collected. Cancelled orders are excluded.</p>
    </div>
  );
}
