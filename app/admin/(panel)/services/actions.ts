"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { serviceSchema } from "@/lib/validators";

function read(fd: FormData) {
  return serviceSchema.safeParse({
    ...Object.fromEntries(fd),
    active: fd.get("active") === "on",
    featured: fd.get("featured") === "on",
  });
}

export async function saveService(id: string | null, fd: FormData) {
  await requireAdmin();
  const p = read(fd);
  if (!p.success) redirect(`/admin/services/${id ?? "new"}?error=1`);
  const d = { ...p.data, nameUr: p.data.nameUr || null, description: p.data.description || null, imageUrl: p.data.imageUrl || null };
  if (id) await prisma.service.update({ where: { id }, data: d });
  else await prisma.service.create({ data: d });
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function deleteService(id: string) {
  await requireAdmin();
  const used = await prisma.orderItem.count({ where: { serviceId: id } });
  // Services that appear in past orders are deactivated, not deleted, to keep invoices intact
  if (used) await prisma.service.update({ where: { id }, data: { active: false } });
  else await prisma.service.delete({ where: { id } });
  revalidatePath("/admin/services");
  redirect("/admin/services");
}
