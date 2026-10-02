import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { CartView } from "./CartView";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your Cart", robots: { index: false } };

export default async function CartPage() {
  const s = await getSettings();
  return <CartView threshold={s.freeDeliveryThreshold} />;
}
