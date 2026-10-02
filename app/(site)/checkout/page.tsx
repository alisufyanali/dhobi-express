import type { Metadata } from "next";
import { getAreas } from "@/lib/data";
import { IS_DEMO } from "@/lib/demo";
import { getSettings } from "@/lib/settings";
import { karachiToday } from "@/lib/delivery";
import { CheckoutForm } from "./CheckoutForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const [s, areas] = await Promise.all([
    getSettings(),
    getAreas(),
  ]);
  return (
    <CheckoutForm
      demo={IS_DEMO}
      areas={areas}
      slots={s.timeSlots}
      today={karachiToday()}
      settings={{ deliveryFee: s.deliveryFee, freeDeliveryThreshold: s.freeDeliveryThreshold, sundayFreeDelivery: s.sundayFreeDelivery }}
    />
  );
}
