import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { IS_DEMO } from "@/lib/demo";

// Accepts an email or a Pakistani mobile number
const schema = z.object({
  contact: z.string().trim().max(120).refine(
    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^03[0-5]\d{8}$/.test(v.replace(/[\s()-]/g, "").replace(/^(\+92|0092|92)/, "0")),
    "Enter an email or mobile number",
  ),
});

export async function POST(req: Request) {
  const p = schema.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return NextResponse.json({ error: "Enter a valid email or mobile number." }, { status: 422 });
  if (IS_DEMO) return NextResponse.json({ ok: true, demo: true });
  const contact = p.data.contact.includes("@") ? p.data.contact.toLowerCase() : p.data.contact.replace(/[\s-]/g, "");
  await prisma.newsletterSubscriber.upsert({ where: { contact }, update: {}, create: { contact } });
  return NextResponse.json({ ok: true });
}
