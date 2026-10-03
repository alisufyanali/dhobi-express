import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IS_DEMO } from "@/lib/demo";
import { complaintSchema } from "@/lib/validators";
import { notifyNewComplaint } from "@/lib/notify";

const newCode = () => "CMP-" + Math.floor(10000 + Math.random() * 90000);

export async function POST(req: Request) {
  const p = complaintSchema.safeParse(await req.json().catch(() => ({})));
  if (!p.success) {
    const errors: Record<string, string> = {};
    for (const i of p.error.issues) errors[String(i.path[0])] ??= i.message;
    return NextResponse.json({ error: "Please fix the highlighted fields.", errors }, { status: 422 });
  }
  if (IS_DEMO) return NextResponse.json({ demo: true }, { status: 503 });

  const d = { ...p.data, orderCode: p.data.orderCode || null };
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const c = await prisma.complaint.create({ data: { ...d, code: newCode() } });
      await notifyNewComplaint(c);
      return NextResponse.json({ code: c.code }, { status: 201 });
    } catch (e: unknown) {
      if ((e as { code?: string }).code === "P2002") continue;
      console.error("Complaint create failed", e);
      return NextResponse.json({ error: "Couldn't save your complaint. Please WhatsApp us." }, { status: 500 });
    }
  }
  return NextResponse.json({ error: "Server busy. Please try again." }, { status: 503 });
}
