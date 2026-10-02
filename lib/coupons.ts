import { prisma } from "./prisma";
import { IS_DEMO } from "./demo";

export type CouponResult = { ok: true; code: string; discount: number; label: string } | { ok: false; message: string };

type C = { code: string; type: "PERCENT" | "FLAT"; value: number; minOrder: number; maxUses: number | null; used: number; firstOrderOnly: boolean; active: boolean; expiresAt: Date | null };

// The launch coupon, also used in demo mode
export const DEMO_COUPON: C = { code: "WELCOME10", type: "PERCENT", value: 10, minOrder: 0, maxUses: null, used: 0, firstOrderOnly: true, active: true, expiresAt: null };

/** Checks a coupon against the order. The server re-runs this when the order is placed. */
export async function checkCoupon(rawCode: string, subtotal: number, phone?: string): Promise<CouponResult> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, message: "Enter a coupon code." };

  const c: C | null = IS_DEMO ? (code === DEMO_COUPON.code ? DEMO_COUPON : null) : await prisma.coupon.findUnique({ where: { code } });
  if (!c || !c.active) return { ok: false, message: "This coupon code isn't valid." };
  if (c.expiresAt && c.expiresAt < new Date()) return { ok: false, message: "This coupon has expired." };
  if (c.maxUses != null && c.used >= c.maxUses) return { ok: false, message: "This coupon has been fully used." };
  if (subtotal < c.minOrder) return { ok: false, message: `This coupon needs an order of at least Rs. ${c.minOrder.toLocaleString("en-PK")}.` };
  if (c.firstOrderOnly && phone && !IS_DEMO) {
    const previous = await prisma.order.count({ where: { phone, status: { not: "CANCELLED" } } });
    if (previous > 0) return { ok: false, message: "This coupon is for your first order only." };
  }

  const discount = Math.min(subtotal, c.type === "PERCENT" ? Math.round((subtotal * c.value) / 100) : c.value);
  return { ok: true, code: c.code, discount, label: c.type === "PERCENT" ? `${c.value}% off` : `Rs. ${c.value} off` };
}
