import { NextResponse } from "next/server";
import { z } from "zod";
import { checkCoupon } from "@/lib/coupons";
import { phoneSchema } from "@/lib/validators";

const schema = z.object({ code: z.string().max(40), subtotal: z.number().min(0), phone: z.string().optional() });

export async function POST(req: Request) {
  const p = schema.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  const phone = p.data.phone ? phoneSchema.safeParse(p.data.phone) : null;
  return NextResponse.json(await checkCoupon(p.data.code, p.data.subtotal, phone?.success ? phone.data : undefined));
}
