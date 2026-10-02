import { prisma } from "./prisma";

export async function getSettings() {
  return prisma.setting.upsert({ where: { id: "default" }, update: {}, create: { id: "default" } });
}
