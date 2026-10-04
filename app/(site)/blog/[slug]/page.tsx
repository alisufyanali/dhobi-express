import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/data";
import { canOptimize } from "@/lib/images";
import { SITE } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { PostBody } from "@/components/PostBody";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getPost((await params).slug);
  if (!p) return {};
  return {
    title: p.title, description: p.excerpt, alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: "article", title: p.title, description: p.excerpt, images: p.coverUrl ? [p.coverUrl] : undefined },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getPost((await params).slug);
  if (!p) notFound();
  return (
    <article className="container-x max-w-3xl py-10 md:py-14">
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title, description: p.excerpt,
        image: p.coverUrl ?? undefined, datePublished: p.publishedAt.toISOString(), dateModified: p.updatedAt.toISOString(),
        author: { "@type": "Organization", name: SITE.name }, publisher: { "@type": "Organization", name: SITE.name },
        mainEntityOfPage: `${SITE.url}/blog/${p.slug}`,
      }} />
      <nav className="text-sm text-slate-500"><Link href="/blog">Blog</Link> / <span>{p.title}</span></nav>
      <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-brand-900 md:text-4xl">{p.title}</h1>
      <p className="mt-3 text-lg text-slate-600">{p.excerpt}</p>
      {p.coverUrl && (
        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-brand-50">
          <Image unoptimized={!canOptimize(p.coverUrl)} src={p.coverUrl} alt="" fill priority sizes="(min-width:768px) 720px, 100vw" className="object-cover" />
        </div>
      )}
      <div className="mt-8"><PostBody body={p.body} /></div>
      <div className="mt-12 rounded-2xl bg-brand-50 p-6">
        <p className="font-semibold text-brand-900">Let us handle it</p>
        <p className="mt-1 text-sm text-slate-600">Free pickup and delivery across Karachi. Clean clothes back in 24–48 hours.</p>
        <Link href="/bill-calculator" className="btn-primary mt-4">Book a pickup</Link>
      </div>
    </article>
  );
}
