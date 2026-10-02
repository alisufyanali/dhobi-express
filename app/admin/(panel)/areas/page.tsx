import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { AREA_PAGES } from "@/lib/areas";

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);

async function add(fd: FormData) {
  "use server";
  await requireAdmin();
  const name = String(fd.get("name") ?? "").trim();
  if (name.length < 2 || name.length > 60) redirect("/admin/areas?error=1");
  const slug = slugify(name);
  if (await prisma.area.findFirst({ where: { OR: [{ slug }, { name }] } })) redirect("/admin/areas?error=exists");
  await prisma.area.create({ data: { name, slug } });
  revalidatePath("/checkout");
  redirect("/admin/areas");
}
async function toggle(id: string, active: boolean) {
  "use server";
  await requireAdmin();
  await prisma.area.update({ where: { id }, data: { active } });
  revalidatePath("/checkout");
}

export default async function Areas({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [areas, { error }] = await Promise.all([
    prisma.area.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { orders: true } } } }),
    searchParams,
  ]);
  const withPage = new Set(AREA_PAGES.map((a) => a.slug));
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Service areas</h1>
        <p className="mt-1 text-sm text-slate-500">Active areas appear in the checkout dropdown. Turning an area off stops new orders from it; past orders are kept.</p>
      </div>
      {error && <p className="err">{error === "exists" ? "That area already exists." : "Enter an area name."}</p>}
      <form action={add} className="card flex gap-2 p-4">
        <input name="name" required placeholder="e.g. Gulistan-e-Johar" className="input" />
        <button className="btn-primary">Add area</button>
      </form>
      <ul className="card divide-y divide-slate-100">
        {areas.map((a) => (
          <li key={a.id} className={`flex items-center gap-3 p-3 text-sm ${a.active ? "" : "opacity-50"}`}>
            <span className="flex-1 font-medium">{a.name}</span>
            <span className="text-xs text-slate-500">{a._count.orders} orders</span>
            {!withPage.has(a.slug) && <span className="rounded bg-amber-50 px-1.5 text-xs text-amber-800" title="Add content in lib/areas.ts to give it a Google landing page">no SEO page yet</span>}
            <form action={toggle.bind(null, a.id, !a.active)}><button className="text-xs text-brand-700">{a.active ? "Turn off" : "Turn on"}</button></form>
          </li>
        ))}
      </ul>
    </div>
  );
}
