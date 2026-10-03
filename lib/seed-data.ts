import type { Unit } from "@prisma/client";

// Shared by the database seed and demo mode, so both show identical content.
type Seg = "men" | "women" | "kids" | "household";
type Row = [name: string, nameUr: string, price: number, unit: Unit, description: string, featured?: boolean, segment?: Seg];
type CatSeed = { name: string; nameUr: string; slug: string; services: Row[] };

/**
 * Garment price list. Columns: Wash & Iron, Iron only, Wash only, Dry clean (0 = not offered).
 * Set below Karachi market rates (see docs/pricing-research.md).
 */
const G: [string, string, Seg, number, number, number, number, boolean?][] = [
  // Men
  ["Shirt", "Shirt", "men", 80, 45, 60, 180, true],
  ["T-shirt / Polo", "T-shirt / Polo", "men", 70, 40, 55, 0],
  ["Kameez", "Kameez", "men", 80, 45, 60, 180],
  ["Shalwar", "Shalwar", "men", 80, 45, 60, 150],
  ["Kurta", "Kurta", "men", 80, 45, 60, 180],
  ["Trouser", "Pant", "men", 80, 45, 60, 180],
  ["Jeans", "Jeans", "men", 90, 50, 70, 0],
  ["Shorts", "Shorts", "men", 60, 35, 45, 0],
  ["Track suit", "Track suit", "men", 160, 90, 120, 0],
  ["Sweater / Hoodie", "Sweater / Hoodie", "men", 180, 0, 140, 280],
  ["Waistcoat", "Waistcoat", "men", 150, 90, 0, 250],
  ["Jacket", "Jacket", "men", 350, 0, 280, 500],
  ["Coat / Blazer", "Coat / Blazer", "men", 0, 250, 0, 450],
  ["Suit (2-piece)", "Suit (2 piece)", "men", 0, 300, 0, 650, true],
  ["Suit (3-piece)", "Suit (3 piece)", "men", 0, 380, 0, 850],
  ["Sherwani", "Sherwani", "men", 0, 450, 0, 900],
  ["Lab coat", "Lab coat", "men", 130, 70, 100, 0],
  ["Vest / Undergarment", "Baniyan", "men", 40, 0, 30, 0],
  ["Socks (pair)", "Moze (jora)", "men", 30, 0, 25, 0],
  // Women
  ["Kameez", "Kameez", "women", 80, 45, 60, 200, true],
  ["Shalwar / Trouser", "Shalwar / Pant", "women", 80, 45, 60, 150],
  ["Dupatta", "Dupatta", "women", 70, 40, 55, 150],
  ["Kurti / Shirt", "Kurti / Shirt", "women", 80, 45, 60, 180],
  ["Jeans", "Jeans", "women", 90, 50, 70, 0],
  ["T-shirt", "T-shirt", "women", 70, 40, 55, 0],
  ["Abaya", "Abaya", "women", 220, 120, 170, 300],
  ["Shawl", "Shawl", "women", 200, 110, 0, 300],
  ["Sweater / Cardigan", "Sweater", "women", 180, 0, 140, 280],
  ["Nightwear", "Night suit", "women", 120, 0, 90, 0],
  ["Formal / fancy suit", "Formal jora", "women", 0, 250, 0, 450],
  ["Saree", "Saree", "women", 0, 300, 0, 600],
  ["Lehenga", "Lehenga", "women", 0, 400, 0, 1500],
  ["Bridal dress", "Bridal jora", "women", 0, 0, 0, 2000],
  // Kids
  ["Shirt / T-shirt", "Shirt / T-shirt", "kids", 50, 30, 40, 0],
  ["Trouser / Shorts", "Pant / Shorts", "kids", 50, 30, 40, 0],
  ["Kameez", "Kameez", "kids", 50, 30, 40, 0],
  ["Shalwar", "Shalwar", "kids", 50, 30, 40, 0],
  ["Frock", "Frock", "kids", 70, 40, 55, 200],
  ["School uniform (set)", "School uniform", "kids", 90, 50, 70, 0],
  ["Sweater", "Sweater", "kids", 100, 0, 80, 0],
  ["Formal suit", "Formal suit", "kids", 0, 150, 0, 300],
  // Household (razai, kambal etc. are washed and fully dried — same price under Wash & Iron)
  ["Bedsheet (single)", "Chadar (single)", "household", 120, 70, 90, 0],
  ["Bedsheet (double)", "Chadar (double)", "household", 160, 90, 120, 0, true],
  ["Pillow / cushion cover", "Takiye ka ghilaf", "household", 40, 25, 30, 0],
  ["Quilt cover", "Razai ka ghilaf", "household", 250, 0, 200, 0],
  ["Razai (quilt)", "Razai", "household", 700, 0, 700, 800, true],
  ["Blanket (single)", "Kambal (single)", "household", 500, 0, 500, 600],
  ["Blanket (double)", "Kambal (double)", "household", 650, 0, 650, 750],
  ["Comforter / Duvet", "Comforter", "household", 800, 0, 800, 900],
  ["Curtain (per panel)", "Parda (ek panel)", "household", 300, 150, 250, 400],
  ["Sofa cover (per seat)", "Sofa cover (seat)", "household", 200, 0, 160, 250],
  ["Table cloth", "Table cloth", "household", 150, 80, 120, 0],
  ["Towel", "Tauliya", "household", 70, 0, 55, 0],
  ["Jaa-namaz", "Jaa-namaz", "household", 120, 0, 120, 0],
];

const TYPES: { name: string; nameUr: string; slug: string; col: 3 | 4 | 5 | 6; kg?: [number, string] }[] = [
  { name: "Wash & Iron", nameUr: "Dhulai + Press", slug: "wash-iron", col: 3, kg: [350, "Mixed clothes, washed and pressed — weighed at pickup"] },
  { name: "Iron only", nameUr: "Sirf Press", slug: "iron-only", col: 4 },
  { name: "Wash only", nameUr: "Sirf Dhulai", slug: "wash-only", col: 5, kg: [250, "Mixed clothes, washed, dried and folded — weighed at pickup"] },
  { name: "Dry clean", nameUr: "Dry Clean", slug: "dry-clean", col: 6 },
];

// Shared by the database seed and demo mode, so both show identical content.
export const CATEGORIES: CatSeed[] = [
  ...TYPES.map((t) => ({
    name: t.name, nameUr: t.nameUr, slug: t.slug,
    services: [
      ...G.filter((g) => g[t.col] > 0).map((g): Row => [g[0], g[1], g[t.col], "PER_PIECE", "", t.col === 3 && !!g[7], g[2]]),
      ...(t.kg ? [["Mixed clothes (per kg)", "Mix kapray (per kg)", t.kg[0], "PER_KG", t.kg[1], false, "household"] as Row] : []),
    ],
  })),
  {
    name: "Packages", nameUr: "Packages", slug: "packages",
    services: [
      ["Monthly 50 – Wash & Iron", "Mahana 50 – Dhulai + Press", 3999, "PER_PIECE", "50 pieces a month · wash + steam press · Rs. 80 per piece · free pickup & delivery", true],
      ["Office Week", "Office Week", 999, "PER_PIECE", "10 shirts · 5 trousers · wash + press", true],
      ["Monthly 100 – Wash & Iron", "Mahana 100 – Dhulai + Press", 7499, "PER_PIECE", "100 pieces a month · wash + steam press · Rs. 75 per piece · free pickup & delivery", true],
      ["Monthly 50 – Iron only", "Mahana 50 – Sirf Press", 2249, "PER_PIECE", "50 pieces a month · steam press · Rs. 45 per piece", true],
      ["Bedding Refresh", "Bedding Refresh", 1050, "PER_PIECE", "2 bedsheet sets · 1 razai or kambal · deep wash", true],
    ],
  },
];

export const REVIEWS = [
  { name: "Ayesha K.", area: "Nazimabad", rating: 5, text: "Kapray time pe aaye aur press bohat acha tha. Sunday wali free delivery best hai." },
  { name: "Bilal R.", area: "Gulshan-e-Iqbal", rating: 5, text: "Hamare flat mein pani ka masla hai, ab har hafte inhi se dhulwata hoon." },
  { name: "Sana M.", area: "North Karachi", rating: 4, text: "Razaiyan bilkul saaf aur khushbu wali wapas aayin." },
];

export const FAQS = [
  { question: "Is pickup and delivery really free?", answer: "Yes — every Sunday (pickup and delivery both on Sunday), and on any day for orders above Rs. 2,000. Below that a small delivery charge applies." },
  { question: "How long does it take?", answer: "Usually 24–48 hours. Dry cleaning and quilts can take up to 72 hours." },
  { question: "Will my clothes get mixed with others?", answer: "No. Every order is tagged at pickup and washed separately." },
  { question: "How do I pay?", answer: "Cash on delivery, or JazzCash, Easypaisa and bank transfer. Businesses get a monthly invoice." },
  { question: "Which areas do you cover?", answer: "Nazimabad, North Karachi, Gulshan-e-Iqbal, Malir, Ahsanabad, Gulzar-e-Hijri, Karimabad and FC Area. More areas soon." },
];
