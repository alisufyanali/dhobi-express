import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AutoRefresh } from "./AutoRefresh";

const ago = (d: Date) => {
  const m = Math.round((Date.now() - d.getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  if (m < 1440) return `${Math.round(m / 60)} h ago`;
  return d.toLocaleDateString("en-PK", { timeZone: "Asia/Karachi" });
};

export default async function ChatInbox() {
  const threads = await prisma.chatThread.findMany({
    orderBy: [{ unread: "desc" }, { lastAt: "desc" }], take: 100,
    include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  return (
    <div className="max-w-3xl space-y-4">
      <AutoRefresh />
      <div>
        <h1 className="text-2xl font-bold">Live chat</h1>
        <p className="mt-1 text-sm text-slate-500">Customers who tap &ldquo;Talk to our team&rdquo; on the website. New messages appear here automatically.</p>
      </div>
      <ul className="card divide-y divide-slate-100 overflow-hidden">
        {threads.map((t) => {
          const last = t.messages[0];
          return (
            <li key={t.id}>
              <Link href={`/admin/chat/${t.id}`} className={`flex items-center gap-3 p-4 hover:bg-slate-50 ${t.closed ? "opacity-60" : ""}`}>
                <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-brand-100 font-semibold text-brand-700">{t.name[0]?.toUpperCase()}</span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-sm font-semibold">{t.name} <span className="font-normal text-slate-500">{t.phone}</span></p>
                  <p className={`truncate text-sm ${t.unread ? "font-semibold text-slate-900" : "text-slate-500"}`}>{last ? `${last.from === "team" ? "You: " : ""}${last.text}` : ""}</p>
                </div>
                <div className="flex flex-none flex-col items-end gap-1">
                  <span className="text-xs text-slate-500">{ago(t.lastAt)}</span>
                  {t.unread && <span className="h-2.5 w-2.5 rounded-full bg-brand-600" aria-label="Unread" />}
                </div>
              </Link>
            </li>
          );
        })}
        {!threads.length && <li className="p-8 text-center text-sm text-slate-500">No chats yet.</li>}
      </ul>
    </div>
  );
}
