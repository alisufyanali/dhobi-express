import type { Unit } from "@prisma/client";

// Shared by the database seed and demo mode, so both show identical content.
export const CATEGORIES: { name: string; nameUr: string; slug: string; services: [string, string, number, Unit, string, boolean?][] }[] = [
  {
    name: "Packages", nameUr: "Packages", slug: "packages",
    services: [
      ["Monthly 50 – Wash & Press", "Mahana 50 – Dhulai + Press", 3999, "PER_PIECE", "50 pieces a month · wash + steam press · Rs. 80 per piece · free pickup & delivery", true],
      ["Office Week", "Office Week", 999, "PER_PIECE", "10 shirts · 5 trousers · wash + press", true],
      ["Monthly 100 – Wash & Press", "Mahana 100 – Dhulai + Press", 7499, "PER_PIECE", "100 pieces a month · wash + steam press · Rs. 75 per piece · free pickup & delivery", true],
      ["Monthly 50 – Press only", "Mahana 50 – Sirf Press", 2249, "PER_PIECE", "50 pieces a month · steam press · Rs. 45 per piece", true],
      ["Bedding Refresh", "Bedding Refresh", 1050, "PER_PIECE", "2 bedsheet sets · 1 razai or kambal · deep wash", true],
    ],
  },
  {
    name: "Wash + Press", nameUr: "Dhulai + Press", slug: "wash-press",
    services: [
      ["Shalwar Kameez (suit)", "Shalwar Kameez (jora)", 160, "PER_PIECE", "Both pieces washed, steam pressed and folded.", true],
      ["Shirt / Kurta", "Shirt / Kurta", 80, "PER_PIECE", "Collar and cuffs pre-treated."],
      ["Trouser / Jeans", "Pant / Jeans", 80, "PER_PIECE", "Washed and pressed with crease."],
      ["T-shirt", "T-shirt", 70, "PER_PIECE", "Washed and folded."],
      ["Dupatta", "Dupatta", 70, "PER_PIECE", "Gentle wash and press."],
      ["Abaya", "Abaya", 220, "PER_PIECE", "Gentle wash and press."],
      ["Sweater / Hoodie", "Sweater / Hoodie", 180, "PER_PIECE", "Washed and air dried to keep shape."],
      ["Wash & Fold (mixed)", "Dhulai aur tay (mix)", 250, "PER_KG", "Everyday clothes washed and folded by weight.", true],
    ],
  },
  {
    name: "Press only", nameUr: "Sirf Press", slug: "press-only",
    services: [
      ["Press – Shalwar Kameez (suit)", "Press – Shalwar Kameez (jora)", 80, "PER_PIECE", "Both pieces, steam press only.", true],
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
    name: "Curtains & Home", nameUr: "Parday aur ghar ka saman", slug: "curtains",
    services: [
      ["Curtain (per panel)", "Parda (ek panel)", 300, "PER_PIECE", "Washed and pressed. Heavy curtains may cost more.", true],
      ["Sofa cover (per seat)", "Sofa cover (ek seat)", 200, "PER_PIECE", "Removable sofa and cushion covers."],
      ["Table cloth", "Table cloth", 150, "PER_PIECE", "Dining and event table cloths."],
      ["Jaa-namaz / prayer mat", "Jaa-namaz", 120, "PER_PIECE", "Gentle wash, air dried."],
    ],
  },
  {
    name: "Bedsheets, Quilts & Blankets", nameUr: "Chadar, Razai aur Kambal", slug: "bedding",
    services: [
      ["Bedsheet set", "Chadar set", 250, "PER_PIECE", "Bedsheet with two pillow covers.", true],
      ["Quilt (Razai)", "Razai", 700, "PER_PIECE", "Deep wash and full dry."],
      ["Blanket", "Kambal", 600, "PER_PIECE", "Single or double blanket.", true],
      ["Comforter / Duvet", "Comforter / Duvet", 800, "PER_PIECE", "Deep wash, fully dried, no musty smell."],
      ["Pillow", "Takiya", 150, "PER_PIECE", "Washed and dried through."],
      ["Bath towel", "Tauliya", 90, "PER_PIECE", "Washed and folded."],
    ],
  },
  {
    name: "Uniforms", nameUr: "Uniform", slug: "uniforms",
    services: [
      ["Uniform (wash + press)", "Uniform (dhulai + press)", 90, "PER_PIECE", "School, office or factory uniforms. Bulk rates for businesses."],
    ],
  },
];

export const REVIEWS = [
  { name: "Ayesha K.", area: "Nazimabad", rating: 5, text: "Kapray time pe aaye aur press bohat acha tha. Sunday wali free delivery best hai." },
  { name: "Bilal R.", area: "Gulshan-e-Iqbal", rating: 5, text: "Hamare flat mein pani ka masla hai, ab har hafte inhi se dhulwata hoon." },
  { name: "Sana M.", area: "North Karachi", rating: 4, text: "Razaiyan bilkul saaf aur khushbu wali wapas aayin." },
];

export const FAQS = [
  { question: "Is pickup and delivery really free?", answer: "Yes — every Sunday (pickup and delivery both on Sunday), and on any day for orders above Rs. 1,000. Below that a small delivery charge applies." },
  { question: "How long does it take?", answer: "Usually 24–48 hours. Dry cleaning and quilts can take up to 72 hours." },
  { question: "Will my clothes get mixed with others?", answer: "No. Every order is tagged at pickup and washed separately." },
  { question: "How do I pay?", answer: "Cash on delivery, or JazzCash, Easypaisa and bank transfer. Businesses get a monthly invoice." },
  { question: "Which areas do you cover?", answer: "Nazimabad, North Karachi, Gulshan-e-Iqbal, Malir, Ahsanabad, Gulzar-e-Hijri, Karimabad and FC Area. More areas soon." },
];
