import { z } from "zod";

// Pakistani mobile numbers only: 030x–035x networks (Jazz, Zong, Ufone, Telenor, SCO).
// Accepts 03001234567, 3001234567, +923001234567 or 923001234567; stores as 03001234567.
export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s()-]/g, ""))
  .transform((v) => v.replace(/^(\+92|0092|92)/, "0").replace(/^(3\d{9})$/, "0$1"))
  .refine((v) => /^03[0-5]\d{8}$/.test(v), "Enter a Pakistani mobile number, e.g. 0300 1234567");

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date");

export const orderSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name").max(80),
    phone: phoneSchema,
    address: z.string().trim().min(8, "Enter your full address").max(300),
    areaId: z.string().min(1, "Choose your area"),
    pickupDate: dateStr,
    pickupSlot: z.string().min(1, "Choose a time slot"),
    deliveryDate: dateStr,
    notes: z.string().trim().max(500).optional().or(z.literal("")),
    paymentMethod: z.enum(["COD", "JAZZCASH", "EASYPAISA", "BANK_TRANSFER"]),
    couponCode: z.string().trim().max(40).optional().or(z.literal("")),
    items: z
      .array(z.object({ serviceId: z.string(), quantity: z.number().positive().max(500) }))
      .min(1, "Your cart is empty"),
  })
  .refine((d) => d.deliveryDate >= d.pickupDate, {
    path: ["deliveryDate"],
    message: "Delivery can't be before pickup",
  });

export type OrderInput = z.input<typeof orderSchema>;

export const trackSchema = z.object({
  code: z.string().trim().toUpperCase().min(4),
  phone: phoneSchema,
});

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  organization: z.string().trim().min(2, "Enter organization name").max(120),
  type: z.enum(["COMPANY", "HOSPITAL", "LAWN_BANQUET", "MASJID", "OTHER"]),
  phone: phoneSchema,
  email: z.string().trim().email("Invalid email").optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  monthlyVolume: z.string().trim().max(100).optional().or(z.literal("")),
});

export const serviceSchema = z.object({
  name: z.string().trim().min(2),
  nameUr: z.string().trim().optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
  price: z.coerce.number().int().min(0),
  unit: z.enum(["PER_PIECE", "PER_KG"]),
  imageUrl: z.string().trim().url().optional().or(z.literal("")),
  categoryId: z.string().min(1),
  active: z.coerce.boolean(),
  featured: z.coerce.boolean(),
});

export const settingsSchema = z.object({
  deliveryFee: z.coerce.number().int().min(0),
  freeDeliveryThreshold: z.coerce.number().int().min(0),
  sundayFreeDelivery: z.coerce.boolean(),
  timeSlots: z.string().transform((s) => s.split(",").map((x) => x.trim()).filter(Boolean)),
  whatsappNumber: z.string().trim().min(10),
  phone: z.string().trim().min(5),
  email: z.string().trim().email(),
  address: z.string().trim().min(3),
  mapsUrl: z.string().trim().url().refine((u) => /(google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps)/.test(u), "Use a Google Maps link").optional().or(z.literal("")).transform((v) => v ?? ""),
  latitude: z.union([z.literal("").transform(() => null), z.coerce.number().min(23).max(37)]).optional().transform((v) => v ?? null),
  longitude: z.union([z.literal("").transform(() => null), z.coerce.number().min(60).max(78)]).optional().transform((v) => v ?? null),
  openingHours: z.string().trim().min(3).max(80),
});

export const COMPLAINT_TYPES = [
  "Damaged item", "Missing item", "Late pickup or delivery", "Cleaning not satisfactory",
  "Wrong bill", "Rider behaviour", "Something else",
] as const;

export const complaintSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone: phoneSchema,
  orderCode: z.string().trim().toUpperCase().max(20).optional().or(z.literal("")),
  type: z.enum(COMPLAINT_TYPES, { errorMap: () => ({ message: "Choose what went wrong" }) }),
  message: z.string().trim().min(10, "Tell us a little more (at least 10 characters)").max(1500),
  contactPref: z.enum(["WHATSAPP", "CALL"]),
});
