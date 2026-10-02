import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function BlogAdmin() {
  const posts = await prisma.post.findMany({ orderBy: { publishedAt: "desc" } });
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Blog</h1><Link href="/admin/blog/new" className="btn-primary">+ New article</Link></div>
      <ul className="card divide-y divide-slate-100">
        {posts.map((p) => (
          <li key={p.id}><Link href={`/admin/blog/${p.id}`} className="flex items-center gap-3 p-4 text-sm hover:bg-slate-50">
            <span className="flex-1 font-medium">{p.title}</span>
            {!p.published && <span className="rounded bg-slate-200 px-1.5 text-xs">draft</span>}
            <span className="text-slate-500">{p.publishedAt.toLocaleDateString("en-PK")}</span>
          </Link></li>
        ))}
        {!posts.length && <li className="p-6 text-center text-sm text-slate-500">No articles yet.</li>}
      </ul>
    </div>
  );
}
