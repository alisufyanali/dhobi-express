import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);
const schema = z.object({
  name: z.string().trim().min(2).max(60),
  nameUr: z.string().trim().max(60).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

async function add(fd: FormData) {
  "use server";
  await requireAdmin();
  const p = schema.safeParse(Object.fromEntries(fd));
  if (!p.success) redirect("/admin/categories?error=1");
  const slug = slugify(p.data.name);
  if (await prisma.category.findUnique({ where: { slug } })) redirect("/admin/categories?error=exists");
  await prisma.category.create({ data: { ...p.data, nameUr: p.data.nameUr || null, slug } });
  revalidatePath("/", "layout");
  redirect("/admin/categories");
}
async function update(id: string, fd: FormData) {
  "use server";
  await requireAdmin();
  const p = schema.safeParse(Object.fromEntries(fd));
  if (!p.success) redirect("/admin/categories?error=1");
  // The slug stays fixed so links like /services#bedding keep working
  await prisma.category.update({ where: { id }, data: { ...p.data, nameUr: p.data.nameUr || null } });
  revalidatePath("/", "layout");
  redirect("/admin/categories");
}
async function remove(id: string) {
  "use server";
  await requireAdmin();
  const n = await prisma.service.count({ where: { categoryId: id } });
  if (n) redirect("/admin/categories?error=used");
  await prisma.category.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect("/admin/categories");
}

export default async function Categories({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [cats, { error }] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { services: true } } } }),
    searchParams,
  ]);
  const msg = error === "exists" ? "A category with that name already exists." : error === "used" ? "Move or delete this category's services first." : error ? "Name is required." : "";
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="mt-1 text-sm text-slate-500">Lower order numbers show first. The &ldquo;packages&rdquo; category is shown as the Packages section on the home page.</p>
      </div>
      {msg && <p className="err">{msg}</p>}
      <form action={add} className="card grid gap-3 p-4 sm:grid-cols-[1fr_1fr_90px_auto] sm:items-end">
        <div><label className="label">Name</label><input name="name" required className="input" /></div>
        <div><label className="label">Roman Urdu name</label><input name="nameUr" className="input" /></div>
        <div><label className="label">Order</label><input name="sortOrder" type="number" min={0} defaultValue={cats.length} className="input" /></div>
        <button className="btn-primary">Add</button>
      </form>
      <ul className="space-y-2">
        {cats.map((c) => (
          <li key={c.id} className="card p-3">
            <form action={update.bind(null, c.id)} className="grid gap-2 sm:grid-cols-[1fr_1fr_80px_auto_auto] sm:items-center">
              <input name="name" defaultValue={c.name} className="input py-2" aria-label="Name" />
              <input name="nameUr" defaultValue={c.nameUr ?? ""} className="input py-2" aria-label="Roman Urdu name" />
              <input name="sortOrder" type="number" min={0} defaultValue={c.sortOrder} className="input py-2" aria-label="Order" />
              <button className="btn-ghost px-3 py-2">Save</button>
              <span className="text-xs text-slate-500">{c._count.services} services · /{c.slug}</span>
            </form>
            {c._count.services === 0 && <form action={remove.bind(null, c.id)} className="mt-2"><button className="text-xs text-red-600">Delete</button></form>}
          </li>
        ))}
      </ul>
    </div>
  );
}
