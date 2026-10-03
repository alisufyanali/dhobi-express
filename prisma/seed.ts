import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AREA_PAGES } from "../lib/areas";
import { CATEGORIES, FAQS, REVIEWS } from "../lib/seed-data";
import { STARTER_POSTS } from "../lib/posts-seed";

const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.setting.upsert({ where: { id: "default" }, update: {}, create: { id: "default" } });

  // One-time update to catalog v2 (service type × men/women/kids/household) and the Rs. 2,000
  // free-delivery threshold. Runs once per database; afterwards admin edits are never overwritten.
  const migrating = settings.catalogVersion < 2;
  if (migrating) {
    // Old-style services are switched off, not deleted, so past orders and invoices stay intact
    await prisma.service.updateMany({ where: { segment: null, category: { slug: { not: "packages" } } }, data: { active: false } });
    await prisma.service.updateMany({ where: { category: { slug: "packages" } }, data: { active: false } });
    await prisma.category.updateMany({ where: { slug: { notIn: CATEGORIES.map((c) => c.slug) } }, data: { sortOrder: 50 } });
  }

  for (const a of AREA_PAGES) {
    await prisma.area.upsert({ where: { slug: a.slug }, update: {}, create: { name: a.name, slug: a.slug } });
  }

  for (const [ci, c] of CATEGORIES.entries()) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: migrating ? { name: c.name, nameUr: c.nameUr, sortOrder: ci } : {},
      create: { name: c.name, nameUr: c.nameUr, slug: c.slug, sortOrder: ci },
    });
    const active = await prisma.service.count({ where: { categoryId: cat.id, active: true } });
    const any = await prisma.service.count({ where: { categoryId: cat.id } });
    if (any && !(migrating && active === 0)) continue;
    await prisma.service.createMany({
      data: c.services.map(([name, nameUr, price, unit, description, featured, segment], si) => ({
        name, nameUr, price, unit, description: description || null, featured: !!featured, segment: segment ?? null, sortOrder: si, categoryId: cat.id,
      })),
    });
  }

  if (migrating) {
    for (const f of await prisma.faq.findMany({ where: { answer: { contains: "Rs. 1,000" } } })) {
      await prisma.faq.update({ where: { id: f.id }, data: { answer: f.answer.replace(/Rs\. 1,000/g, "Rs. 2,000") } });
    }
    await prisma.setting.update({ where: { id: "default" }, data: { catalogVersion: 2, freeDeliveryThreshold: 2000 } });
    console.log("Catalog updated to v2; free delivery threshold set to Rs. 2,000.");
  }

  if ((await prisma.review.count()) === 0) {
    await prisma.review.createMany({ data: REVIEWS });
  }

  if ((await prisma.faq.count()) === 0) {
    await prisma.faq.createMany({ data: FAQS.map((f, i) => ({ ...f, sortOrder: i })) });
  }

  for (const p of STARTER_POSTS) {
    await prisma.post.upsert({
      where: { slug: p.slug }, update: {},
      create: { slug: p.slug, title: p.title, excerpt: p.excerpt, body: p.body,
        coverUrl: `https://images.unsplash.com/photo-${p.cover}?auto=format&fit=crop&w=1200&q=70` },
    });
  }

  await prisma.coupon.upsert({
    where: { code: "WELCOME10" }, update: {},
    create: { code: "WELCOME10", type: "PERCENT", value: 10, firstOrderOnly: true },
  });

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    await prisma.adminUser.upsert({
      where: { email },
      update: {},
      create: { email, name: "Admin", passwordHash: await bcrypt.hash(password, 10) },
    });
    console.log("Admin user ready:", email);
  } else {
    console.warn("ADMIN_EMAIL / ADMIN_PASSWORD not set — no admin user created.");
  }
  console.log("Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
