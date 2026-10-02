/**
 * Delivery fee rules (shared by client preview and server — the server result is the one that's charged):
 * 1. If BOTH pickup and delivery dates fall on a Sunday (and Sunday free delivery is on) → free.
 * 2. Otherwise, free when subtotal >= threshold.
 * 3. Otherwise, the flat delivery fee applies.
 * Dates are "YYYY-MM-DD" strings in Karachi local time.
 */
export type DeliverySettings = {
  deliveryFee: number;
  freeDeliveryThreshold: number;
  sundayFreeDelivery: boolean;
};

export function isSunday(date: string) {
  // Parse as UTC midnight so the weekday doesn't shift with the server's timezone
  return new Date(date + "T00:00:00Z").getUTCDay() === 0;
}

export function calcDelivery(
  subtotal: number,
  pickupDate: string | undefined,
  deliveryDate: string | undefined,
  s: DeliverySettings
): { fee: number; reason: "sunday" | "threshold" | "charged" } {
  if (s.sundayFreeDelivery && pickupDate && deliveryDate && isSunday(pickupDate) && isSunday(deliveryDate)) {
    return { fee: 0, reason: "sunday" };
  }
  if (subtotal >= s.freeDeliveryThreshold) return { fee: 0, reason: "threshold" };
  return { fee: s.deliveryFee, reason: "charged" };
}

/** Today's date in Karachi as YYYY-MM-DD */
export function karachiToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Karachi" }).format(new Date());
}
