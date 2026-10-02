import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { rs } from "@/lib/site";

export default async function Customers({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const customers = await prisma.customer.findMany({
    where: q ? { OR: [{ phone: { contains: q } }, { name: { contains: q, mode: "insensitive" } }] } : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { orders: { where: { status: { not: "CANCELLED" } }, select: { total: true, createdAt: true }, orderBy: { createdAt: "desc" } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Customers</h1>
      <form className="card flex gap-2 p-4"><input name="q" defaultValue={q} placeholder="Search name or phone" className="input" /><button className="btn-primary">Search</button></form>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500"><tr><th className="p-3">Customer</th><th className="p-3">Orders</th><th className="p-3">Total spent</th><th className="p-3">Last order</th><th className="p-3" /></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((c) => (
              <tr key={c.id}>
                <td className="p-3">{c.name ?? "—"}<br /><span className="text-slate-500">{c.phone}</span></td>
                <td className="p-3">{c.orders.length}</td>
                <td className="p-3 font-medium">{rs(c.orders.reduce((n, o) => n + o.total, 0))}</td>
                <td className="p-3 text-slate-600">{c.orders[0]?.createdAt.toLocaleDateString("en-PK", { timeZone: "Asia/Karachi" }) ?? "—"}</td>
                <td className="p-3 text-right"><Link href={`/admin/orders?q=${c.phone}`} className="text-xs text-brand-700">Order history</Link></td>
              </tr>
            ))}
            {!customers.length && <tr><td colSpan={5} className="p-6 text-center text-slate-500">No customers found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
