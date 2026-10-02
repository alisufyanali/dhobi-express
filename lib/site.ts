export const SITE = {
  name: "Dhobi Express",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  tagline: "Laundry pickup & delivery in Karachi",
  description:
    "Wash, press, dry clean, curtains, bedsheets and quilts with free pickup and delivery in Nazimabad, North Karachi, Gulshan-e-Iqbal, Malir and more.",
};

export const UNIT_LABEL = { PER_PIECE: "per piece", PER_KG: "per kg" } as const;

export const STATUS_FLOW = [
  "PICKUP_PENDING",
  "PICKED_UP",
  "WASHING",
  "PRESSING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
] as const;

export const STATUS_LABEL: Record<string, string> = {
  PICKUP_PENDING: "Pickup Pending",
  PICKED_UP: "Picked Up",
  WASHING: "Washing",
  PRESSING: "Pressing",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const PAYMENT_LABEL: Record<string, string> = {
  COD: "Cash on Delivery",
  JAZZCASH: "JazzCash",
  EASYPAISA: "Easypaisa",
  BANK_TRANSFER: "Bank Transfer",
};

export function rs(n: number) {
  return "Rs. " + Math.round(n).toLocaleString("en-PK");
}

export function waLink(number: string, text?: string) {
  const n = number.replace(/\D/g, "");
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
