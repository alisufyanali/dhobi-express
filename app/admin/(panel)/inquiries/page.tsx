import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { waLink } from "@/lib/site";

async function toggleReplied(id: string, replied: boolean) {
  "use server";
  await requireAdmin();
  await prisma.businessInquiry.update({ where: { id }, data: { replied } });
  revalidatePath("/admin/inquiries");
}

export default async function Inquiries() {
  const list = await prisma.businessInquiry.findMany({ orderBy: [{ replied: "asc" }, { createdAt: "desc" }], take: 200 });
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Business inquiries</h1>
      {list.map((q) => (
        <div key={q.id} className={`card p-4 ${q.replied ? "opacity-60" : ""}`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div><p className="font-semibold">{q.organization} <span className="text-xs font-normal text-slate-500">· {q.type.replace("_", " / ").toLowerCase()}</span></p>
              <p className="text-sm text-slate-600">{q.name} · {q.phone}{q.email && ` · ${q.email}`}</p></div>
            <p className="text-xs text-slate-500">{q.createdAt.toLocaleString("en-PK", { timeZone: "Asia/Karachi" })}</p>
          </div>
          {q.monthlyVolume && <p className="mt-2 text-sm"><b>Volume:</b> {q.monthlyVolume}</p>}
          {q.message && <p className="mt-1 text-sm text-slate-700">{q.message}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            <a className="btn-wa px-3 py-2" target="_blank" rel="noopener" href={waLink(q.phone.replace(/^0/, "92"), `Assalam o Alaikum ${q.name}, thank you for your inquiry for ${q.organization}.`)}>Reply on WhatsApp</a>
            {q.email && <a className="btn-ghost px-3 py-2" href={`mailto:${q.email}?subject=${encodeURIComponent("Dhobi Express — laundry quote for " + q.organization)}`}>Reply by email</a>}
            <form action={toggleReplied.bind(null, q.id, !q.replied)}><button className="btn-ghost px-3 py-2">{q.replied ? "Mark as not replied" : "Mark as replied"}</button></form>
          </div>
        </div>
      ))}
      {!list.length && <p className="text-slate-500">No inquiries yet.</p>}
    </div>
  );
}
