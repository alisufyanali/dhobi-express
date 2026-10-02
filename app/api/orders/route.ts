import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IS_DEMO } from "@/lib/demo";
import { orderSchema } from "@/lib/validators";
import { calcDelivery, karachiToday } from "@/lib/delivery";
import { getSettings } from "@/lib/settings";

function newCode() {
  return "DE-" + Math.floor(10000 + Math.random() * 90000);
}

export async function POST(req: Request) {
  if (IS_DEMO) return NextResponse.json({ error: "Demo mode: nothing is saved. Please contact us on WhatsApp." }, { status: 503 });
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0])] ??= i.message;
    return NextResponse.json({ error: "Please fix the highlighted fields.", errors }, { status: 422 });
  }
  const d = parsed.data;

  if (d.pickupDate < karachiToday()) {
    return NextResponse.json({ error: "Pickup date is in the past.", errors: { pickupDate: "Choose today or later" } }, { status: 422 });
  }

  const s = await getSettings();
  if (!s.timeSlots.includes(d.pickupSlot)) {
    return NextResponse.json({ error: "That time slot is no longer available.", errors: { pickupSlot: "Choose another slot" } }, { status: 422 });
  }
  const area = await prisma.area.findFirst({ where: { id: d.areaId, active: true } });
  if (!area) return NextResponse.json({ error: "We don't serve that area yet.", errors: { areaId: "Choose your area" } }, { status: 422 });

  // Prices come from the database, never from the client
  const services = await prisma.service.findMany({ where: { id: { in: d.items.map((i) => i.serviceId) }, active: true } });
  const byId = new Map(services.map((sv) => [sv.id, sv]));
  const missing = d.items.find((i) => !byId.has(i.serviceId));
  if (missing) return NextResponse.json({ error: "A service in your cart is no longer available. Please refresh your cart." }, { status: 409 });

  const lines = d.items.map((i) => {
    const sv = byId.get(i.serviceId)!;
    const qty = sv.unit === "PER_PIECE" ? Math.round(i.quantity) : i.quantity;
    return { serviceId: sv.id, name: sv.name, unit: sv.unit, price: sv.price, quantity: qty, lineTotal: Math.round(sv.price * qty) };
  });
  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);
  const { fee } = calcDelivery(subtotal, d.pickupDate, d.deliveryDate, s);

  const customer = await prisma.customer.upsert({
    where: { phone: d.phone },
    update: { name: d.name },
    create: { phone: d.phone, name: d.name },
  });

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const order = await prisma.order.create({
        data: {
          code: newCode(),
          customerId: customer.id,
          name: d.name, phone: d.phone, address: d.address, areaId: area.id,
          pickupDate: new Date(d.pickupDate + "T00:00:00Z"),
          deliveryDate: new Date(d.deliveryDate + "T00:00:00Z"),
          pickupSlot: d.pickupSlot,
          notes: d.notes || null,
          paymentMethod: d.paymentMethod,
          subtotal, deliveryFee: fee, total: subtotal + fee,
          items: { create: lines },
          history: { create: { status: "PICKUP_PENDING" } },
        },
      });
      return NextResponse.json({ code: order.code, phone: order.phone }, { status: 201 });
    } catch (e: unknown) {
      if ((e as { code?: string }).code === "P2002") continue; // order code collision, retry
      console.error("Order create failed", e);
      return NextResponse.json({ error: "Server error. Please try again or WhatsApp us." }, { status: 500 });
    }
  }
  return NextResponse.json({ error: "Server busy. Please try again." }, { status: 503 });
}
