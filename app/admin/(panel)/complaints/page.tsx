import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { waLink } from "@/lib/site";

async function setStatus(id: string, fd: FormData) {
  "use server";
  await requireAdmin();
  const resolved = fd.get("resolve") === "1";
  await prisma.complaint.update({
    where: { id },
    data: { status: resolved ? "RESOLVED" : "OPEN", adminNote: String(fd.get("adminNote") ?? "").slice(0, 1000) || null },
  });
  revalidatePath("/admin/complaints");
}

export default async function Complaints({ searchParams }: { searchParams: Promise<{ show?: string }> }) {
  const { show } = await searchParams;
  const status = show === "resolved" ? "RESOLVED" : show === "all" ? undefined : "OPEN";
  const list = await prisma.complaint.findMany({ where: status ? { status } : undefined, orderBy: { createdAt: "desc" }, take: 200 });
  const tab = (v: string, l: string) => (
    <Link href={`/admin/complaints${v ? `?show=${v}` : ""}`} className={`rounded-lg px-3 py-1.5 text-sm ${(show ?? "") === v ? "bg-brand-600 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"}`}>{l}</Link>
  );
  return (
    <div className="max-w-4xl space-y-4">
      <h1 className="text-2xl font-bold">Complaints</h1>
      <div className="flex gap-2">{tab("", "Open")}{tab("resolved", "Resolved")}{tab("all", "All")}</div>
      {list.map((c) => (
        <div key={c.id} className={`card p-4 ${c.status === "RESOLVED" ? "opacity-70" : ""}`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-semibold"><span className="font-mono">{c.code}</span> · {c.type}</p>
              <p className="text-sm text-slate-600">{c.name} · {c.phone} · prefers {c.contactPref === "CALL" ? "a call" : "WhatsApp"}
                {c.orderCode && <> · order <Link href={`/admin/orders?q=${c.orderCode}`} className="text-brand-700">{c.orderCode}</Link></>}</p>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.status === "OPEN" ? "bg-amber-100 text-amber-800" : "bg-emerald-50 text-emerald-700"}`}>{c.status === "OPEN" ? "Open" : "Resolved"}</span>
          </div>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-800">{c.message}</p>
          <p className="mt-1 text-xs text-slate-400">{c.createdAt.toLocaleString("en-PK", { timeZone: "Asia/Karachi" })}</p>
          <form action={setStatus.bind(null, c.id)} className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <input name="adminNote" defaultValue={c.adminNote ?? ""} placeholder="Internal note (what was done)" className="input py-2 text-sm" />
            <input type="hidden" name="resolve" value={c.status === "OPEN" ? "1" : "0"} />
            <button className="btn-ghost flex-none px-3 py-2">{c.status === "OPEN" ? "Mark resolved" : "Reopen"}</button>
            <a href={waLink(c.phone.replace(/^0/, "92"), `Assalam o Alaikum ${c.name}, Dhobi Express here about your complaint ${c.code}.`)} target="_blank" rel="noopener" className="btn-wa flex-none px-3 py-2">WhatsApp</a>
          </form>
        </div>
      ))}
      {!list.length && <p className="text-slate-500">Nothing here.</p>}
    </div>
  );
}
