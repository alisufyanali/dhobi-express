import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { IS_DEMO } from "@/lib/demo";
import { phoneSchema } from "@/lib/validators";
import { notifyNewChat } from "@/lib/notify";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(60),
  phone: phoneSchema,
  text: z.string().trim().min(1, "Type a message").max(1000),
});

/** Starts a conversation with the team. Returns a secret token the browser keeps to continue it. */
export async function POST(req: Request) {
  if (IS_DEMO) return NextResponse.json({ error: "Live chat isn't available in the demo. Please WhatsApp us." }, { status: 503 });
  const p = schema.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return NextResponse.json({ error: p.error.issues[0]?.message ?? "Invalid message" }, { status: 422 });
  const token = crypto.randomBytes(24).toString("hex");
  const t = await prisma.chatThread.create({
    data: { token, name: p.data.name, phone: p.data.phone, messages: { create: { from: "customer", text: p.data.text } } },
  });
  await notifyNewChat({ id: t.id, name: t.name, phone: t.phone, text: p.data.text });
  return NextResponse.json({ token }, { status: 201 });
}
