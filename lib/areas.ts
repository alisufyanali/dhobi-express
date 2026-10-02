// Static SEO content for area landing pages. Replace the "local" lines with
// real details you know (blocks covered, landmarks, water-supply days) —
// that is what makes each page genuinely unique to Google.
export type AreaContent = {
  name: string;
  slug: string; // DB Area.slug
  path: string; // public URL segment
  intro: string;
  local: string[];
  keywords: string[];
};

export const AREA_PAGES: AreaContent[] = [
  {
    name: "Nazimabad",
    slug: "nazimabad",
    path: "laundry-service-nazimabad",
    intro: "Laundry and dry cleaning pickup across Nazimabad blocks 1 to 7, with delivery back to your door in 24–48 hours.",
    local: [
      "Pickups from homes, flats and hostels around Nazimabad's main roads and inner blocks.",
      "Popular with families in rented flats who don't have space or water for a weekly wash.",
      "Dry cleaning for wedding and Eid outfits with careful steam press.",
    ],
    keywords: ["laundry service Nazimabad", "dry cleaning Nazimabad", "kapray dhulai Nazimabad"],
  },
  {
    name: "North Karachi",
    slug: "north-karachi",
    path: "laundry-service-north-karachi",
    intro: "Wash, press and dry cleaning with free pickup across North Karachi sectors.",
    local: [
      "Covering residential sectors and the flats near the main commercial roads.",
      "Uniform wash and press for factory and office staff living in the area.",
      "Bedsheets, quilts and blankets washed in bulk, ideal before winter.",
    ],
    keywords: ["laundry North Karachi", "dry cleaning North Karachi", "uniform laundry North Karachi"],
  },
  {
    name: "Gulshan-e-Iqbal",
    slug: "gulshan-e-iqbal",
    path: "laundry-service-gulshan-e-iqbal",
    intro: "Doorstep laundry for Gulshan-e-Iqbal blocks — wash, press, dry clean and curtains.",
    local: [
      "Pickups from apartments, student flats and family homes across Gulshan blocks.",
      "Express press service for working professionals with busy weeks.",
      "Curtain removal-ready wash: we take them, wash them, press them.",
    ],
    keywords: ["laundry Gulshan-e-Iqbal", "dry cleaning Gulshan", "laundry pickup Gulshan Karachi"],
  },
  {
    name: "Malir",
    slug: "malir",
    path: "laundry-service-malir",
    intro: "Affordable laundry pickup and delivery across Malir.",
    local: [
      "Serving households that face water shortages — we wash so you don't need the tanker.",
      "Per-kg rates that keep regular family laundry affordable.",
      "Masjid chadar, ghilaf and curtain cleaning on request.",
    ],
    keywords: ["laundry Malir Karachi", "kapray dhulai Malir", "dry cleaning Malir"],
  },
  {
    name: "Ahsanabad",
    slug: "ahsanabad",
    path: "laundry-service-ahsanabad",
    intro: "Laundry pickup and delivery in Ahsanabad with free Sunday service.",
    local: [
      "Regular weekly pickups for families and bachelors.",
      "Quilts and blankets washed and dried properly — no musty smell.",
      "Book on WhatsApp in a minute.",
    ],
    keywords: ["laundry Ahsanabad", "laundry service Ahsanabad Karachi"],
  },
  {
    name: "Gulzar-e-Hijri",
    slug: "gulzar-e-hijri",
    path: "laundry-service-gulzar-e-hijri",
    intro: "Wash, press and dry cleaning with pickup across Gulzar-e-Hijri.",
    local: [
      "Covering residential schemes and the university-side student housing.",
      "Student-friendly per-kg wash and fold.",
      "Free pickup on Sundays.",
    ],
    keywords: ["laundry Gulzar-e-Hijri", "laundry Scheme 33 Karachi"],
  },
  {
    name: "Karimabad",
    slug: "karimabad",
    path: "laundry-service-karimabad",
    intro: "Laundry and press service with doorstep pickup in Karimabad.",
    local: [
      "Quick press-only service for shopkeepers and office workers.",
      "Dry cleaning for formal wear and shalwar kameez.",
      "Tagged orders so your clothes never mix with anyone else's.",
    ],
    keywords: ["laundry Karimabad Karachi", "press service Karimabad"],
  },
  {
    name: "FC Area",
    slug: "fc-area",
    path: "laundry-service-fc-area",
    intro: "Laundry pickup and delivery in FC Area, Liaquatabad side.",
    local: [
      "Weekly family laundry with flexible morning and evening pickup slots.",
      "Bedsheets and curtains washed and pressed.",
      "Free delivery on orders above Rs. 2,000.",
    ],
    keywords: ["laundry FC Area Karachi", "dhobi FC Area"],
  },
];

export const AREA_BY_PATH = Object.fromEntries(AREA_PAGES.map((a) => [a.path, a]));
