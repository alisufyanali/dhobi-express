import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  code: z.string().trim().min(3).max(30).regex(/^[A-Za-z0-9_-]+$/).transform((v) => v.toUpperCase()),
  type: z.enum(["PERCENT", "FLAT"]),
  value: z.coerce.number().int().min(1),
  minOrder: z.coerce.number().int().min(0).default(0),
  maxUses: z.union([z.literal("").transform(() => null), z.coerce.number().int().min(1)]),
  expiresAt: z.union([z.literal("").transform(() => null), z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform((d) => new Date(d + "T23:59:59+05:00"))]),
  firstOrderOnly: z.boolean(),
}).refine((c) => c.type === "FLAT" || c.value <= 100, { message: "Percent must be 100 or less" });

async function create(fd: FormData) {
  "use server";
  await requireAdmin();
  const p = schema.safeParse({ ...Object.fromEntries(fd), firstOrderOnly: fd.get("firstOrderOnly") === "on" });
  if (!p.success) redirect("/admin/coupons?error=1");
  const exists = await prisma.coupon.findUnique({ where: { code: p.data.code } });
  if (exists) redirect("/admin/coupons?error=exists");
  await prisma.coupon.create({ data: p.data });
  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}
async function toggle(id: string, active: boolean) {
  "use server";
  await requireAdmin();
  await prisma.coupon.update({ where: { id }, data: { active } });
  revalidatePath("/admin/coupons");
}

export default async function Coupons({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [list, { error }] = await Promise.all([prisma.coupon.findMany({ orderBy: { createdAt: "desc" } }), searchParams]);
  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold">Coupons</h1>
      <form action={create} className="card grid gap-4 p-5 sm:grid-cols-3">
        <div><label className="label">Code</label><input name="code" required className="input uppercase" placeholder="EID20" /></div>
        <div><label className="label">Type</label><select name="type" className="input"><option value="PERCENT">% off</option><option value="FLAT">Rs. off</option></select></div>
        <div><label className="label">Value</label><input name="value" type="number" min={1} required className="input" placeholder="10" /></div>
        <div><label className="label">Minimum order (Rs.)</label><input name="minOrder" type="number" min={0} defaultValue={0} className="input" /></div>
        <div><label className="label">Max uses (blank = unlimited)</label><input name="maxUses" type="number" min={1} className="input" /></div>
        <div><label className="label">Expires on (optional)</label><input name="expiresAt" type="date" className="input" /></div>
        <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" name="firstOrderOnly" /> First order only (checked by phone number)</label>
        <button className="btn-primary">Create coupon</button>
        {error && <p className="err sm:col-span-3">{error === "exists" ? "That code already exists." : "Check the fields. Codes use letters, numbers, - or _."}</p>}
      </form>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500"><tr><th className="p-3">Code</th><th className="p-3">Discount</th><th className="p-3">Rules</th><th className="p-3">Used</th><th className="p-3" /></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {list.map((c) => (
              <tr key={c.id} className={c.active ? "" : "opacity-50"}>
                <td className="p-3 font-mono font-semibold">{c.code}</td>
                <td className="p-3">{c.type === "PERCENT" ? `${c.value}%` : `Rs. ${c.value}`}</td>
                <td className="p-3 text-slate-600">
                  {[c.minOrder ? `min Rs. ${c.minOrder}` : null, c.firstOrderOnly ? "first order" : null, c.expiresAt ? `until ${c.expiresAt.toISOString().slice(0, 10)}` : null].filter(Boolean).join(" · ") || "—"}
                </td>
                <td className="p-3">{c.used}{c.maxUses ? ` / ${c.maxUses}` : ""}</td>
                <td className="p-3 text-right"><form action={toggle.bind(null, c.id, !c.active)}><button className="text-xs text-brand-700">{c.active ? "Disable" : "Enable"}</button></form></td>
              </tr>
            ))}
            {!list.length && <tr><td colSpan={5} className="p-6 text-center text-slate-500">No coupons yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
