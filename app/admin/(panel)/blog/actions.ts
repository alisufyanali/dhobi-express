"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);

const schema = z.object({
  title: z.string().trim().min(5).max(140),
  slug: z.string().trim().max(80).optional().or(z.literal("")),
  excerpt: z.string().trim().min(10).max(220),
  body: z.string().trim().min(50),
  coverUrl: z.string().trim().url().optional().or(z.literal("")),
  published: z.boolean(),
});

export async function savePost(id: string | null, fd: FormData) {
  await requireAdmin();
  const p = schema.safeParse({ ...Object.fromEntries(fd), published: fd.get("published") === "on" });
  if (!p.success) redirect(`/admin/blog/${id ?? "new"}?error=1`);
  const slug = slugify(p.data.slug || p.data.title);
  const taken = await prisma.post.findFirst({ where: { slug, NOT: id ? { id } : undefined } });
  if (taken) redirect(`/admin/blog/${id ?? "new"}?error=slug`);
  const data = { ...p.data, slug, coverUrl: p.data.coverUrl || null };
  if (id) await prisma.post.update({ where: { id }, data });
  else await prisma.post.create({ data });
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function deletePost(id: string) {
  await requireAdmin();
  await prisma.post.delete({ where: { id } });
  revalidatePath("/blog");
  redirect("/admin/blog");
}
