import { PrismaClient, Unit } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AREA_PAGES } from "../lib/areas";

const prisma = new PrismaClient();

const CATEGORIES: { name: string; nameUr: string; slug: string; services: [string, string, number, Unit, string, boolean?][] }[] = [
  {
    name: "Wash + Press", nameUr: "Dhulai + Press", slug: "wash-press",
    services: [
      ["Shalwar Kameez", "Shalwar Kameez", 120, "PER_PIECE", "Washed, steam pressed and folded.", true],
      ["Shirt / Kurta", "Shirt / Kurta", 80, "PER_PIECE", "Collar and cuffs pre-treated."],
      ["Trouser / Jeans", "Pant / Jeans", 80, "PER_PIECE", "Washed and pressed with crease."],
      ["Wash & Fold (mixed)", "Dhulai aur tay (mix)", 250, "PER_KG", "Everyday clothes washed and folded by weight.", true],
    ],
  },
  {
    name: "Press only", nameUr: "Sirf Press", slug: "press-only",
    services: [
      ["Press – Shalwar Kameez", "Press – Shalwar Kameez", 60, "PER_PIECE", "Steam press only.", true],
      ["Press – Shirt / Trouser", "Press – Shirt / Pant", 40, "PER_PIECE", "Steam press only."],
    ],
  },
  {
    name: "Dry clean", nameUr: "Dry Clean", slug: "dry-clean",
    services: [
      ["Suit (2-piece)", "Suit (2 piece)", 650, "PER_PIECE", "Professional dry clean and press.", true],
      ["Sherwani", "Sherwani", 900, "PER_PIECE", "Careful clean for embellished wear."],
      ["Bridal / Formal dress", "Formal jora", 1200, "PER_PIECE", "Delicate dry clean, inspected by hand."],
    ],
  },
  {
    name: "Curtains", nameUr: "Parday", slug: "curtains",
    services: [
      ["Curtain (per panel)", "Parda (ek panel)", 300, "PER_PIECE", "Washed and pressed. Heavy curtains may cost more."],
    ],
  },
  {
    name: "Bedsheets, Quilts & Blankets", nameUr: "Chadar, Razai aur Kambal", slug: "bedding",
    services: [
      ["Bedsheet set", "Chadar set", 250, "PER_PIECE", "Bedsheet with two pillow covers.", true],
      ["Quilt (Razai)", "Razai", 700, "PER_PIECE", "Deep wash and full dry."],
      ["Blanket", "Kambal", 600, "PER_PIECE", "Single or double blanket."],
    ],
  },
  {
    name: "Uniforms", nameUr: "Uniform", slug: "uniforms",
    services: [
      ["Uniform (wash + press)", "Uniform (dhulai + press)", 90, "PER_PIECE", "School, office or factory uniforms. Bulk rates for businesses."],
    ],
  },
];

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
    await prisma.review.createMany({
      data: [
        { name: "Ayesha K.", area: "Nazimabad", rating: 5, text: "Kapray time pe aaye aur press bohat acha tha. Sunday wali free delivery best hai." },
        { name: "Bilal R.", area: "Gulshan-e-Iqbal", rating: 5, text: "Hamare flat mein pani ka masla hai, ab har hafte inhi se dhulwata hoon." },
        { name: "Sana M.", area: "North Karachi", rating: 4, text: "Razaiyan bilkul saaf aur khushbu wali wapas aayin." },
      ],
    });
  }

  if ((await prisma.faq.count()) === 0) {
    await prisma.faq.createMany({
      data: [
        { sortOrder: 0, question: "Is pickup and delivery really free?", answer: "Yes — every Sunday (pickup and delivery both on Sunday), and on any day for orders above Rs. 2,000. Below that a small delivery charge applies." },
        { sortOrder: 1, question: "How long does it take?", answer: "Usually 24–48 hours. Dry cleaning and quilts can take up to 72 hours." },
        { sortOrder: 2, question: "Will my clothes get mixed with others?", answer: "No. Every order is tagged at pickup and washed separately." },
        { sortOrder: 3, question: "How do I pay?", answer: "Cash on delivery, or JazzCash, Easypaisa and bank transfer. Businesses get a monthly invoice." },
        { sortOrder: 4, question: "Which areas do you cover?", answer: "Nazimabad, North Karachi, Gulshan-e-Iqbal, Malir, Ahsanabad, Gulzar-e-Hijri, Karimabad and FC Area. More areas soon." },
      ],
    });
  }

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
