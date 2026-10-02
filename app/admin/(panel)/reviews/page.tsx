import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(2).max(60),
  area: z.string().trim().max(60).optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1).max(5),
  text: z.string().trim().min(5).max(500),
});

async function add(fd: FormData) {
  "use server";
  await requireAdmin();
  const p = schema.safeParse(Object.fromEntries(fd));
  if (!p.success) redirect("/admin/reviews?error=1");
  await prisma.review.create({ data: { ...p.data, area: p.data.area || null } });
  revalidatePath("/", "layout");
  redirect("/admin/reviews");
}
async function toggle(id: string, approved: boolean) {
  "use server";
  await requireAdmin();
  await prisma.review.update({ where: { id }, data: { approved } });
  revalidatePath("/", "layout");
}
async function remove(id: string) {
  "use server";
  await requireAdmin();
  await prisma.review.delete({ where: { id } });
  revalidatePath("/", "layout");
}

export default async function Reviews({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [list, { error }] = await Promise.all([prisma.review.findMany({ orderBy: { createdAt: "desc" } }), searchParams]);
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reviews</h1>
        <p className="mt-1 text-sm text-slate-500">Add real feedback from customers (WhatsApp messages, Google reviews). Only approved reviews show on the site — the newest three on the home page.</p>
      </div>
      <form action={add} className="card grid gap-4 p-5 sm:grid-cols-3">
        <div><label className="label">Customer name</label><input name="name" required className="input" placeholder="Ayesha K." /></div>
        <div><label className="label">Area</label><input name="area" className="input" placeholder="Nazimabad" /></div>
        <div><label className="label">Rating</label><select name="rating" defaultValue="5" className="input">{[5, 4, 3, 2, 1].map((r) => <option key={r}>{r}</option>)}</select></div>
        <div className="sm:col-span-3"><label className="label">Review</label><textarea name="text" required rows={2} className="input" /></div>
        <button className="btn-primary">Add review</button>
        {error && <p className="err sm:col-span-3">Name and a review of at least 5 characters are required.</p>}
      </form>
      <ul className="space-y-3">
        {list.map((r) => (
          <li key={r.id} className={`card p-4 ${r.approved ? "" : "opacity-60"}`}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm"><b>{r.name}</b>{r.area && <span className="text-slate-500"> · {r.area}</span>} <span className="text-amber-500">{"★".repeat(r.rating)}</span></p>
              <div className="flex gap-3">
                <form action={toggle.bind(null, r.id, !r.approved)}><button className="text-xs text-brand-700">{r.approved ? "Hide" : "Approve"}</button></form>
                <form action={remove.bind(null, r.id)}><button className="text-xs text-red-600">Delete</button></form>
              </div>
            </div>
            <p className="mt-1 text-sm text-slate-700">{r.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
