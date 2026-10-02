import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { deletePost, savePost } from "../actions";

export default async function PostEdit({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const { error } = await searchParams;
  const isNew = id === "new";
  const p = isNew ? null : await prisma.post.findUnique({ where: { id } });
  if (!isNew && !p) notFound();

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">{isNew ? "New article" : "Edit article"}</h1>
      {error && <p className="err">{error === "slug" ? "Another article already uses that URL." : "Title (5+), summary (10–220) and body (50+ characters) are required."}</p>}
      <form action={savePost.bind(null, isNew ? null : id)} className="card space-y-4 p-5">
        <div><label className="label">Title</label><input name="title" defaultValue={p?.title} required className="input" /></div>
        <div><label className="label">URL (leave blank to use the title)</label><input name="slug" defaultValue={p?.slug} className="input" placeholder="how-to-wash-razai" /></div>
        <div><label className="label">Summary (shown in Google and on the blog list)</label><textarea name="excerpt" defaultValue={p?.excerpt} required rows={2} maxLength={220} className="input" /></div>
        <ImageUpload name="coverUrl" defaultValue={p?.coverUrl} label="Cover image" />
        <div>
          <label className="label">Article</label>
          <textarea name="body" defaultValue={p?.body} required rows={18} className="input font-mono text-sm" />
          <p className="mt-1 text-xs text-slate-500">Start a line with <code>## </code> for a heading and <code>- </code> for a bullet. Leave an empty line between paragraphs.</p>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={p?.published ?? true} /> Published</label>
        <button className="btn-primary">Save</button>
      </form>
      {!isNew && <form action={deletePost.bind(null, id)}><button className="text-sm text-red-600">Delete article</button></form>}
    </div>
  );
}
