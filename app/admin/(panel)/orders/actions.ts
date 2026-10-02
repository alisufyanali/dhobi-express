"use server";
import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { STATUS_LABEL } from "@/lib/site";

export async function updateStatus(orderId: string, formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status"));
  if (!(status in STATUS_LABEL)) return;
  await prisma.order.update({
    where: { id: orderId },
    data: { status: status as OrderStatus, history: { create: { status: status as OrderStatus } } },
  });
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function saveNotes(orderId: string, formData: FormData) {
  await requireAdmin();
  await prisma.order.update({ where: { id: orderId }, data: { internalNotes: String(formData.get("internalNotes") ?? "").slice(0, 2000) } });
  revalidatePath(`/admin/orders/${orderId}`);
}
