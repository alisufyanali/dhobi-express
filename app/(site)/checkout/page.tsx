import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { karachiToday } from "@/lib/delivery";
import { CheckoutForm } from "./CheckoutForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const [s, areas] = await Promise.all([
    getSettings(),
    prisma.area.findMany({ where: { active: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  return (
    <CheckoutForm
      areas={areas}
      slots={s.timeSlots}
      today={karachiToday()}
      settings={{ deliveryFee: s.deliveryFee, freeDeliveryThreshold: s.freeDeliveryThreshold, sundayFreeDelivery: s.sundayFreeDelivery }}
    />
  );
}
