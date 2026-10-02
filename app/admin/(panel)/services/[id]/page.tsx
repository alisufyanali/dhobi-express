import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deleteService, saveService } from "../actions";

export default async function ServiceEdit({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const { error } = await searchParams;
  const isNew = id === "new";
  const [s, cats] = await Promise.all([
    isNew ? null : prisma.service.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!isNew && !s) notFound();

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">{isNew ? "Add service" : "Edit service"}</h1>
      {error && <p className="err">Check the fields: name, price and category are required; image must be a full URL.</p>}
      <form action={saveService.bind(null, isNew ? null : id)} className="card grid gap-4 p-5 sm:grid-cols-2">
        <div><label className="label">Name</label><input name="name" defaultValue={s?.name} required className="input" /></div>
        <div><label className="label">Name (Roman Urdu)</label><input name="nameUr" defaultValue={s?.nameUr ?? ""} className="input" /></div>
        <div className="sm:col-span-2"><label className="label">Description</label><input name="description" defaultValue={s?.description ?? ""} className="input" /></div>
        <div><label className="label">Price (Rs.)</label><input name="price" type="number" min={0} defaultValue={s?.price} required className="input" /></div>
        <div><label className="label">Unit</label><select name="unit" defaultValue={s?.unit ?? "PER_PIECE"} className="input"><option value="PER_PIECE">Per piece</option><option value="PER_KG">Per kg</option></select></div>
        <div><label className="label">Category</label><select name="categoryId" defaultValue={s?.categoryId} className="input">{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div><label className="label">Image URL (Cloudinary)</label><input name="imageUrl" defaultValue={s?.imageUrl ?? ""} className="input" placeholder="https://res.cloudinary.com/…" /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={s?.active ?? true} /> Active</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked={s?.featured ?? false} /> Featured on home page</label>
        <button className="btn-primary sm:col-span-2">Save</button>
      </form>
      {!isNew && (
        <form action={deleteService.bind(null, id)}><button className="text-sm text-red-600">Delete (deactivates if used in past orders)</button></form>
      )}
    </div>
  );
}
