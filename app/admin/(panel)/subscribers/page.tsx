import { prisma } from "@/lib/prisma";

export default async function Subscribers() {
  const list = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Newsletter subscribers ({list.length})</h1>
        <a href="/admin/subscribers.csv" className="btn-ghost px-3 py-2">Download CSV</a>
      </div>
      <ul className="card divide-y divide-slate-100">
        {list.map((s) => (
          <li key={s.id} className="flex justify-between p-3 text-sm"><span>{s.contact}</span><span className="text-slate-500">{s.createdAt.toLocaleDateString("en-PK", { timeZone: "Asia/Karachi" })}</span></li>
        ))}
        {!list.length && <li className="p-6 text-center text-sm text-slate-500">No subscribers yet.</li>}
      </ul>
    </div>
  );
}
