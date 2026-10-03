import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { rs, UNIT_LABEL } from "@/lib/site";

export default async function ServicesAdmin() {
  const cats = await prisma.category.findMany({ orderBy: { sortOrder: "asc" }, include: { services: { orderBy: [{ active: "desc" }, { segment: "asc" }, { sortOrder: "asc" }] } } });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Services</h1><Link href="/admin/services/new" className="btn-primary">+ Add service</Link></div>
      {cats.map((c) => (
        <div key={c.id} className="card overflow-hidden">
          <p className="bg-slate-50 px-4 py-2 text-sm font-semibold">{c.name}</p>
          <ul className="divide-y divide-slate-100">
            {c.services.map((s) => (
              <li key={s.id}><Link href={`/admin/services/${s.id}`} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50">
                <span className="flex-1">{s.name}{s.segment && <span className="ml-2 rounded bg-slate-100 px-1.5 text-xs capitalize">{s.segment}</span>}{s.featured && <span className="ml-2 rounded bg-amber-50 px-1.5 text-xs">featured</span>}</span>
                {!s.active && <span className="rounded bg-slate-200 px-1.5 text-xs">inactive</span>}
                <span className="w-32 text-right">{rs(s.price)} <span className="text-slate-500">{UNIT_LABEL[s.unit]}</span></span>
              </Link></li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
