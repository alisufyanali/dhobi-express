import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AREA_PAGES } from "../lib/areas";
import { CATEGORIES, FAQS, REVIEWS } from "../lib/seed-data";

const prisma = new PrismaClient();



async function main() {
  await prisma.setting.upsert({ where: { id: "default" }, update: {}, create: { id: "default" } });

  for (const a of AREA_PAGES) {
    await prisma.area.upsert({ where: { slug: a.slug }, update: {}, create: { name: a.name, slug: a.slug } });
  }

  for (const [ci, c] of CATEGORIES.entries()) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { name: c.name, nameUr: c.nameUr, slug: c.slug, sortOrder: ci },
    });
    const existing = await prisma.service.count({ where: { categoryId: cat.id } });
    if (existing) continue;
    for (const [si, [name, nameUr, price, unit, description, featured]] of c.services.entries()) {
      await prisma.service.create({
        data: { name, nameUr, price, unit, description, featured: !!featured, sortOrder: si, categoryId: cat.id },
      });
    }
  }

  if ((await prisma.review.count()) === 0) {
    await prisma.review.createMany({ data: REVIEWS });
  }

  if ((await prisma.faq.count()) === 0) {
    await prisma.faq.createMany({ data: FAQS.map((f, i) => ({ ...f, sortOrder: i })) });
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
