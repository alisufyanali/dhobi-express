import { z } from "zod";

// Pakistani mobile: 03xxxxxxxxx or +923xxxxxxxxx / 923xxxxxxxxx
export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, ""))
  .refine((v) => /^(03\d{9}|\+?923\d{9})$/.test(v), "Enter a valid mobile number, e.g. 03001234567")
  .transform((v) => (v.startsWith("03") ? v : "0" + v.replace(/^\+?92/, "")));

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
});
