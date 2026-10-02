import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPosts } from "@/lib/data";
import { canOptimize } from "@/lib/images";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Laundry Tips & Guides",
  description: "Stain removal, uniform care and fabric tips from Dhobi Express, Karachi's laundry pickup and delivery service.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndex() {
  const posts = await getPosts();
  return (
    <div className="container-x py-10 md:py-14">
      <p className="eyebrow">Blog</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-900 md:text-4xl">Laundry tips & guides</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group card overflow-hidden">
            {p.coverUrl && (
              <div className="relative aspect-[16/9] bg-brand-50">
                <Image unoptimized={!canOptimize(p.coverUrl)} src={p.coverUrl} alt="" fill sizes="(min-width:768px) 380px, 100vw" className="object-cover transition duration-300 group-hover:scale-105" />
              </div>
            )}
            <div className="p-5">
              <h2 className="font-semibold text-brand-900 group-hover:text-brand-700">{p.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{p.excerpt}</p>
              <p className="mt-3 text-xs text-slate-400">{p.publishedAt.toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
          </Link>
        ))}
        {!posts.length && <p className="text-slate-500">No articles yet.</p>}
      </div>
    </div>
  );
}
