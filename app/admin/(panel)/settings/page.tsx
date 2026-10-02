import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { settingsSchema } from "@/lib/validators";

async function save(fd: FormData) {
  "use server";
  await requireAdmin();
  const p = settingsSchema.safeParse({ ...Object.fromEntries(fd), sundayFreeDelivery: fd.get("sundayFreeDelivery") === "on" });
  if (!p.success) redirect("/admin/settings?error=1");
  await prisma.setting.update({ where: { id: "default" }, data: p.data });
  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}

export default async function Settings({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const [s, sp] = await Promise.all([getSettings(), searchParams]);
  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      {sp.saved && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">Saved.</p>}
      {sp.error && <p className="err">Some values are invalid.</p>}
      <form action={save} className="card grid gap-4 p-5 sm:grid-cols-2">
        <div><label className="label">Delivery charge (Rs.)</label><input name="deliveryFee" type="number" defaultValue={s.deliveryFee} className="input" /></div>
        <div><label className="label">Free delivery above (Rs.)</label><input name="freeDeliveryThreshold" type="number" defaultValue={s.freeDeliveryThreshold} className="input" /></div>
        <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" name="sundayFreeDelivery" defaultChecked={s.sundayFreeDelivery} /> Free delivery when pickup and delivery are both on Sunday</label>
        <div className="sm:col-span-2"><label className="label">Time slots (comma separated)</label><input name="timeSlots" defaultValue={s.timeSlots.join(", ")} className="input" /></div>
        <div><label className="label">WhatsApp number (923…)</label><input name="whatsappNumber" defaultValue={s.whatsappNumber} className="input" /></div>
        <div><label className="label">Display phone</label><input name="phone" defaultValue={s.phone} className="input" /></div>
        <div><label className="label">Email</label><input name="email" defaultValue={s.email} className="input" /></div>
        <div><label className="label">Address</label><input name="address" defaultValue={s.address} className="input" /></div>
        <button className="btn-primary sm:col-span-2">Save settings</button>
      </form>
    </div>
  );
}
