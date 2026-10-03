import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { waLink } from "@/lib/site";
import { AutoRefresh } from "../AutoRefresh";
import { ReplyBox } from "./ReplyBox";

async function reply(id: string, fd: FormData) {
  "use server";
  await requireAdmin();
  const text = String(fd.get("text") ?? "").trim().slice(0, 1000);
  if (!text) return;
  await prisma.chatThread.update({ where: { id }, data: { lastAt: new Date(), unread: false, messages: { create: { from: "team", text } } } });
  revalidatePath(`/admin/chat/${id}`);
}
async function toggleClosed(id: string, closed: boolean) {
  "use server";
  await requireAdmin();
  await prisma.chatThread.update({ where: { id }, data: { closed, unread: false } });
  revalidatePath(`/admin/chat/${id}`);
}

export default async function ChatThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await prisma.chatThread.findUnique({ where: { id }, include: { messages: { orderBy: { createdAt: "asc" } } } });
  if (!t) notFound();
  if (t.unread) await prisma.chatThread.update({ where: { id }, data: { unread: false } });
  const time = (d: Date) => d.toLocaleTimeString("en-PK", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Karachi" });

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <AutoRefresh seconds={5} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/chat" className="text-sm text-brand-700">← All chats</Link>
          <h1 className="mt-1 text-xl font-bold">{t.name} <span className="text-base font-normal text-slate-500">{t.phone}</span></h1>
        </div>
        <div className="flex gap-2">
          <a href={waLink(t.phone.replace(/^0/, "92"), `Assalam o Alaikum ${t.name}, Dhobi Express here.`)} target="_blank" rel="noopener" className="btn-wa px-3 py-2">WhatsApp</a>
          <form action={toggleClosed.bind(null, t.id, !t.closed)}><button className="btn-ghost px-3 py-2">{t.closed ? "Reopen" : "Mark done"}</button></form>
        </div>
      </div>
      <div className="card space-y-3 bg-slate-50 p-4">
        {t.messages.map((m) => (
          <div key={m.id} className={`flex ${m.from === "team" ? "justify-end" : ""}`}>
            <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${m.from === "team" ? "rounded-br-md bg-brand-600 text-white" : "rounded-bl-md bg-white ring-1 ring-slate-200"}`}>
              <p className="whitespace-pre-line">{m.text}</p>
              <p className={`mt-1 text-[10px] ${m.from === "team" ? "text-white/70" : "text-slate-400"}`}>{time(m.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
      <ReplyBox action={reply.bind(null, t.id)} />
      <p className="text-xs text-slate-500">The customer sees your reply in the website chat within a few seconds while it is open. If they have left the site, reply on WhatsApp too.</p>
    </div>
  );
}
