import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IS_DEMO } from "@/lib/demo";
import { trackSchema } from "@/lib/validators";

/** Minimal status for the home-page "Active order" card. Needs both order ID and phone. */
export async function GET(req: Request) {
  if (IS_DEMO) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const url = new URL(req.url);
  const p = trackSchema.safeParse({ code: url.searchParams.get("code") ?? "", phone: url.searchParams.get("phone") ?? "" });
  if (!p.success) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const o = await prisma.order.findFirst({
    where: { code: p.data.code, phone: p.data.phone },
    select: { code: true, phone: true, status: true, pickupDate: true, pickupSlot: true, total: true, _count: { select: { items: true } } },
  });
  if (!o) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    code: o.code, phone: o.phone, status: o.status, total: o.total, items: o._count.items,
    pickup: `${o.pickupDate.toISOString().slice(0, 10)}, ${o.pickupSlot}`,
  }, { headers: { "Cache-Control": "no-store" } });
}
