import { prisma } from "./prisma";
import { IS_DEMO } from "./demo";
import { CATEGORIES, FAQS, REVIEWS } from "./seed-data";
import { AREA_PAGES } from "./areas";
import { STARTER_POSTS } from "./posts-seed";

// Read-only queries for the public site. In demo mode they return the seed content.

export type Svc = {
  id: string; name: string; nameUr: string | null; description: string | null;
  price: number; unit: "PER_PIECE" | "PER_KG"; imageUrl: string | null; featured: boolean;
  category: { name: string; slug: string };
};
export type Cat = { id: string; name: string; nameUr: string | null; slug: string; services: Svc[] };

function demoCatalog(): Cat[] {
  return CATEGORIES.map((c) => ({
    id: c.slug, name: c.name, nameUr: c.nameUr, slug: c.slug,
    services: c.services.map(([name, nameUr, price, unit, description, featured], i) => ({
      id: `${c.slug}-${i}`, name, nameUr, price, unit, description, featured: !!featured, imageUrl: null,
      category: { name: c.name, slug: c.slug },
    })),
  }));
}

export async function getCatalog(): Promise<Cat[]> {
  if (IS_DEMO) return demoCatalog();
  const cats = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { services: { where: { active: true }, orderBy: { sortOrder: "asc" } } },
  });
  return cats.map((c) => ({ ...c, services: c.services.map((s) => ({ ...s, category: { name: c.name, slug: c.slug } })) }));
}

export async function getRateCard(limit = 8): Promise<Svc[]> {
  const all = (await getCatalog()).flatMap((c) => c.services);
  return [...all.filter((s) => s.featured), ...all.filter((s) => !s.featured)].slice(0, limit);
}

export async function getReviews() {
  if (IS_DEMO) return REVIEWS.map((r, i) => ({ id: String(i), ...r }));
  return prisma.review.findMany({ where: { approved: true }, orderBy: { createdAt: "desc" }, take: 6 });
}

export async function getFaqs() {
  if (IS_DEMO) return FAQS.map((f, i) => ({ id: String(i), ...f }));
  return prisma.faq.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getLogos(): Promise<{ id: string; name: string; imageUrl: string }[]> {
  if (IS_DEMO) return [];
  return prisma.clientLogo.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
}

export async function getAreas() {
  if (IS_DEMO) return AREA_PAGES.map((a) => ({ id: a.slug, name: a.name })).sort((a, b) => a.name.localeCompare(b.name));
  return prisma.area.findMany({ where: { active: true }, orderBy: { name: "asc" }, select: { id: true, name: true } });
}

export type PostT = { slug: string; title: string; excerpt: string; body: string; coverUrl: string | null; publishedAt: Date; updatedAt: Date };

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=70`;
const DEMO_DATE = new Date("2026-10-01T00:00:00Z");
const demoPosts = (): PostT[] =>
  STARTER_POSTS.map((p) => ({ slug: p.slug, title: p.title, excerpt: p.excerpt, body: p.body, coverUrl: unsplash(p.cover), publishedAt: DEMO_DATE, updatedAt: DEMO_DATE }));

export async function getPosts(): Promise<PostT[]> {
  if (IS_DEMO) return demoPosts();
  return prisma.post.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } });
}

export async function getPost(slug: string): Promise<PostT | null> {
  if (IS_DEMO) return demoPosts().find((p) => p.slug === slug) ?? null;
  return prisma.post.findFirst({ where: { slug, published: true } });
}
