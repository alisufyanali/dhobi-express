import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  if ((await getSession())?.user?.role !== "admin") return new Response("Unauthorized", { status: 401 });
  const list = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "asc" } });
  const csv = ["contact,subscribed_at", ...list.map((s) => `"${s.contact.replace(/"/g, '""')}",${s.createdAt.toISOString()}`)].join("\n");
  return new Response(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="subscribers.csv"' } });
}
