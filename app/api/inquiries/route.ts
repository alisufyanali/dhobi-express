import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { inquirySchema } from "@/lib/validators";

export async function POST(req: Request) {
  const parsed = inquirySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 422 });
  const d = parsed.data;
  await prisma.businessInquiry.create({
    data: { ...d, email: d.email || null, message: d.message || null, monthlyVolume: d.monthlyVolume || null },
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}
