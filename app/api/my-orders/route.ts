import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { IS_DEMO } from "@/lib/demo";
import { phoneSchema } from "@/lib/validators";

const schema = z.object({ orders: z.array(z.object({ code: z.string().trim().toUpperCase().max(20), phone: phoneSchema })).max(30) });

/** Details for orders saved on this phone. Each must match both order ID and phone. */
export async function POST(req: Request) {
  if (IS_DEMO) return NextResponse.json({ orders: [] });
  const p = schema.safeParse(await req.json().catch(() => ({})));
  if (!p.success || !p.data.orders.length) return NextResponse.json({ orders: [] });
  const found = await prisma.order.findMany({
    where: { OR: p.data.orders.map((o) => ({ code: o.code, phone: o.phone })) },
    orderBy: { createdAt: "desc" },
    select: {
      code: true, phone: true, status: true, total: true, createdAt: true, pickupDate: true, pickupSlot: true, deliveryDate: true,
      items: { select: { name: true, quantity: true } },
    },
  });
  return NextResponse.json({
    orders: found.map((o) => ({
      ...o,
      createdAt: o.createdAt.toISOString(),
      pickupDate: o.pickupDate.toISOString().slice(0, 10),
      deliveryDate: o.deliveryDate.toISOString().slice(0, 10),
    })),
  }, { headers: { "Cache-Control": "no-store" } });
}
