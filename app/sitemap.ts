import type { MetadataRoute } from "next";
import { AREA_PAGES } from "@/lib/areas";
import { getPosts } from "@/lib/data";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const core = ["", "/services", "/business", "/blog", "/track", "/about", "/contact", "/privacy-policy", "/terms"];
  const posts = await getPosts().catch(() => []);
  return [
    ...core.map((p) => ({ url: `${SITE.url}${p}`, lastModified: now, priority: p === "" ? 1 : 0.7 })),
    ...AREA_PAGES.map((a) => ({ url: `${SITE.url}/${a.path}`, lastModified: now, priority: 0.8 })),
    ...posts.map((p) => ({ url: `${SITE.url}/blog/${p.slug}`, lastModified: p.updatedAt, priority: 0.6 })),
  ];
}
