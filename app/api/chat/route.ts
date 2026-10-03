import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { IS_DEMO } from "@/lib/demo";

const token = z.string().regex(/^[a-f0-9]{48}$/);

/** Visitor polls for messages in their conversation. */
export async function GET(req: Request) {
  if (IS_DEMO) return NextResponse.json({ error: "Not available" }, { status: 503 });
  const t = token.safeParse(new URL(req.url).searchParams.get("token") ?? "");
  if (!t.success) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const thread = await prisma.chatThread.findUnique({
    where: { token: t.data },
    select: { closed: true, messages: { orderBy: { createdAt: "asc" }, take: 200, select: { id: true, from: true, text: true, createdAt: true } } },
  });
  if (!thread) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(thread, { headers: { "Cache-Control": "no-store" } });
}

const send = z.object({ token, text: z.string().trim().min(1).max(1000) });

/** Visitor sends another message. */
export async function POST(req: Request) {
  if (IS_DEMO) return NextResponse.json({ error: "Not available" }, { status: 503 });
  const p = send.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return NextResponse.json({ error: "Invalid message" }, { status: 422 });
  const thread = await prisma.chatThread.findUnique({ where: { token: p.data.token }, select: { id: true, _count: { select: { messages: true } } } });
  if (!thread) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (thread._count.messages >= 300) return NextResponse.json({ error: "This chat is full. Please WhatsApp us." }, { status: 429 });
  await prisma.chatThread.update({
    where: { id: thread.id },
    data: { unread: true, closed: false, lastAt: new Date(), messages: { create: { from: "customer", text: p.data.text } } },
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}
