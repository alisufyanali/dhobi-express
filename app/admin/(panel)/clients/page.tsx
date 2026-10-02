import Image from "next/image";
import { canOptimize } from "@/lib/images";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ImageUpload } from "@/components/admin/ImageUpload";

const logoSchema = z.object({
  name: z.string().trim().min(2),
  sector: z.string().trim().max(40).optional().or(z.literal("")),
  imageUrl: z.string().trim().url(),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

async function addLogo(fd: FormData) {
  "use server";
  await requireAdmin();
  const p = logoSchema.safeParse(Object.fromEntries(fd));
  if (!p.success) redirect("/admin/clients?error=1");
  await prisma.clientLogo.create({ data: { ...p.data, sector: p.data.sector || null } });
  revalidatePath("/", "layout");
  redirect("/admin/clients");
}

async function toggleLogo(id: string, active: boolean) {
  "use server";
  await requireAdmin();
  await prisma.clientLogo.update({ where: { id }, data: { active } });
  revalidatePath("/", "layout");
}

async function deleteLogo(id: string) {
  "use server";
  await requireAdmin();
  await prisma.clientLogo.delete({ where: { id } });
  revalidatePath("/", "layout");
}

export default async function ClientsAdmin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [logos, { error }] = await Promise.all([prisma.clientLogo.findMany({ orderBy: { sortOrder: "asc" } }), searchParams]);
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Client logos</h1>
        <p className="mt-1 text-sm text-slate-500">Shown in the &ldquo;Trusted by&rdquo; section on the home page and the business page. Only add companies that have agreed to be listed.</p>
      </div>

      <form action={addLogo} className="card grid gap-4 p-5 sm:grid-cols-2">
        <div><label className="label">Company name</label><input name="name" required className="input" /></div>
        <div><label className="label">Sector</label><select name="sector" className="input"><option value="">—</option>{["Hospital", "Clinic", "Factory", "Corporate office", "Banquet hall", "Lawn", "Masjid", "Madrasa", "Hotel", "School"].map((x) => <option key={x}>{x}</option>)}</select></div>
        <div className="sm:col-span-2"><ImageUpload name="imageUrl" label="Logo" /></div>
        <div><label className="label">Order</label><input name="sortOrder" type="number" min={0} defaultValue={logos.length} className="input" /></div>
        <button className="btn-primary sm:col-span-2">Add logo</button>
        {error && <p className="err sm:col-span-2">Company name and a logo are required.</p>}
      </form>

      <ul className="grid gap-3 sm:grid-cols-2">
        {logos.map((l) => (
          <li key={l.id} className={`card flex items-center gap-4 p-4 ${l.active ? "" : "opacity-50"}`}>
            <div className="relative h-12 w-24 flex-none"><Image unoptimized={!canOptimize(l.imageUrl)} src={l.imageUrl} alt={l.name} fill sizes="96px" className="object-contain" /></div>
            <span className="flex-1 text-sm font-medium">{l.name}{l.sector && <span className="block text-xs font-normal text-slate-500">{l.sector}</span>}</span>
            <form action={toggleLogo.bind(null, l.id, !l.active)}><button className="text-xs text-brand-700">{l.active ? "Hide" : "Show"}</button></form>
            <form action={deleteLogo.bind(null, l.id)}><button className="text-xs text-red-600">Delete</button></form>
          </li>
        ))}
        {!logos.length && <li className="text-sm text-slate-500">No logos yet.</li>}
      </ul>
    </div>
  );
}
