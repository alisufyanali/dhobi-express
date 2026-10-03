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
      {sp.error && <p className="err">Some values are invalid. The map link must be a Google Maps link, and latitude/longitude must be Karachi numbers (e.g. 24.91 and 67.03).</p>}
      <form action={save} className="card grid gap-4 p-5 sm:grid-cols-2">
        <div><label className="label">Delivery charge (Rs.)</label><input name="deliveryFee" type="number" defaultValue={s.deliveryFee} className="input" /></div>
        <div><label className="label">Free delivery above (Rs.)</label><input name="freeDeliveryThreshold" type="number" defaultValue={s.freeDeliveryThreshold} className="input" /></div>
        <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" name="sundayFreeDelivery" defaultChecked={s.sundayFreeDelivery} /> Free delivery when pickup and delivery are both on Sunday</label>
        <div className="sm:col-span-2"><label className="label">Time slots (comma separated)</label><input name="timeSlots" defaultValue={s.timeSlots.join(", ")} className="input" /></div>
        <div><label className="label">WhatsApp number (923…)</label><input name="whatsappNumber" defaultValue={s.whatsappNumber} className="input" /></div>
        <div><label className="label">Display phone</label><input name="phone" defaultValue={s.phone} className="input" /></div>
        <div><label className="label">Email</label><input name="email" defaultValue={s.email} className="input" /></div>
        <div className="border-t border-slate-200 pt-4 sm:col-span-2">
          <p className="font-semibold">Shop location</p>
          <p className="mt-1 text-xs text-slate-500">Open your shop in Google Maps → Share → Copy link, and paste it below. For an exact map pin, long-press the shop in Google Maps and copy the two numbers shown (e.g. 24.9125, 67.0322).</p>
        </div>
        <div className="sm:col-span-2"><label className="label">Full shop address (shown to customers)</label><input name="address" defaultValue={s.address} className="input" placeholder="Shop 12, Block D, North Nazimabad, Karachi" /></div>
        <div className="sm:col-span-2"><label className="label">Google Maps link</label><input name="mapsUrl" defaultValue={s.mapsUrl} className="input" placeholder="https://maps.app.goo.gl/…" /></div>
        <div><label className="label">Latitude (optional)</label><input name="latitude" inputMode="decimal" defaultValue={s.latitude ?? ""} className="input" placeholder="24.9125" /></div>
        <div><label className="label">Longitude (optional)</label><input name="longitude" inputMode="decimal" defaultValue={s.longitude ?? ""} className="input" placeholder="67.0322" /></div>
        <div className="sm:col-span-2"><label className="label">Opening hours</label><input name="openingHours" defaultValue={s.openingHours} className="input" /></div>
        <button className="btn-primary sm:col-span-2">Save settings</button>
      </form>
    </div>
  );
}
