import type { MetadataRoute } from "next";
import { AREA_PAGES } from "@/lib/areas";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const core = ["", "/services", "/business", "/track", "/about", "/contact", "/privacy-policy", "/terms"];
  return [
    ...core.map((p) => ({ url: `${SITE.url}${p}`, lastModified: now, priority: p === "" ? 1 : 0.7 })),
    ...AREA_PAGES.map((a) => ({ url: `${SITE.url}/${a.path}`, lastModified: now, priority: 0.8 })),
  ];
}
