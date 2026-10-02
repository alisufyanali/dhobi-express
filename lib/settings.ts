import { prisma } from "./prisma";
import { IS_DEMO } from "./demo";

const DEFAULTS = {
  id: "default",
  deliveryFee: 150,
  freeDeliveryThreshold: 1000,
  sundayFreeDelivery: true,
  timeSlots: ["10am-1pm", "4pm-7pm"],
  whatsappNumber: "923000000000",
  phone: "0300-0000000",
  email: "info@dhobiexpress.pk",
  address: "Karachi, Pakistan",
};

export async function getSettings() {
  if (IS_DEMO) return DEFAULTS;
  return prisma.setting.upsert({ where: { id: "default" }, update: {}, create: { id: "default" } });
}
