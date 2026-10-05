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
    name: 'Federal B Area',
    slug: 'federal-b-area',
    path: "laundry-service-federal-b-area",
    intro: 'Laundry and dry cleaning pickup across every block of Federal B Area, delivered back in 24–48 hours.',
    local: [
      'All blocks covered, including Karimabad, Aisha Manzil, Ancholi, Water Pump and Gulberg.',
      'Homes, flats and hostels — pick a morning or evening slot.',
      'Bedsheets, curtains and razai washed and pressed.',
    ],
    keywords: ['laundry service Federal B Area', 'dry cleaning FB Area', 'laundry Gulberg Karachi', 'laundry Karimabad'],
  },
  {
    name: 'Nazimabad',
    slug: 'nazimabad',
    path: "laundry-service-nazimabad",
    intro: 'Laundry and dry cleaning pickup across Nazimabad blocks 1 to 7, delivered back in 24–48 hours.',
    local: [
      'Homes and flats along the main roads and inner blocks.',
      'Weekly family laundry without needing water or space at home.',
      'Wedding and Eid outfits dry cleaned and steam pressed.',
    ],
    keywords: ['laundry service Nazimabad', 'dry cleaning Nazimabad', 'kapray dhulai Nazimabad'],
  },
  {
    name: 'North Nazimabad',
    slug: 'north-nazimabad',
    path: "laundry-service-north-nazimabad",
    intro: 'Doorstep laundry for every North Nazimabad block — wash, press and dry clean.',
    local: [
      'All blocks covered, from Block A to Block T.',
      'Hyderi, Five Star and Buffer Zone side included.',
      'Office shirts and uniforms washed and pressed every week.',
    ],
    keywords: ['laundry North Nazimabad', 'dry cleaning North Nazimabad', 'laundry Hyderi Karachi'],
  },
  {
    name: 'Naya Nazimabad',
    slug: 'naya-nazimabad',
    path: "laundry-service-naya-nazimabad",
    intro: 'Laundry pickup and delivery inside Naya Nazimabad, with free delivery above the order limit.',
    local: [
      'Pickups from houses and apartments across the blocks.',
      'Bedding and curtains for new homes washed before you move in.',
      'Book online or on WhatsApp in a minute.',
    ],
    keywords: ['laundry Naya Nazimabad', 'dry cleaning Naya Nazimabad'],
  },
  {
    name: 'Liaquatabad',
    slug: 'liaquatabad',
    path: "laundry-service-liaquatabad",
    intro: 'Wash, press and dry cleaning with doorstep pickup in Liaquatabad and FC Area.',
    local: [
      'Liaquatabad, FC Area and Tahir Villa side covered.',
      'Press-only service for shopkeepers and office workers.',
      "Tagged orders, never mixed with anyone else's.",
    ],
    keywords: ['laundry Liaquatabad', 'laundry FC Area Karachi', 'press service Liaquatabad'],
  },
  {
    name: 'North Karachi',
    slug: 'north-karachi',
    path: "laundry-service-north-karachi",
    intro: 'Wash, press and dry cleaning with free pickup across North Karachi sectors.',
    local: [
      'Residential sectors and flats near the main roads.',
      'Staff uniforms washed and pressed for factories and offices.',
      'Quilts and blankets washed in bulk before winter.',
    ],
    keywords: ['laundry North Karachi', 'dry cleaning North Karachi', 'uniform laundry North Karachi'],
  },
  {
    name: 'New Karachi',
    slug: 'new-karachi',
    path: "laundry-service-new-karachi",
    intro: 'Laundry pickup and delivery across New Karachi sectors.',
    local: [
      'Weekly family laundry with morning and evening slots.',
      'Per-kg wash for big family loads.',
      'Bedsheets and curtains washed and pressed.',
    ],
    keywords: ['laundry New Karachi', 'kapray dhulai New Karachi'],
  },
  {
    name: 'Gulshan-e-Iqbal',
    slug: 'gulshan-e-iqbal',
    path: "laundry-service-gulshan-e-iqbal",
    intro: 'Doorstep laundry for every Gulshan-e-Iqbal block — wash, press, dry clean and curtains.',
    local: [
      'All blocks covered.',
      'Student flats, apartments and family homes.',
      'Express press service for busy working weeks.',
    ],
    keywords: ['laundry Gulshan-e-Iqbal', 'dry cleaning Gulshan', 'laundry pickup Gulshan Karachi'],
  },
];

export const AREA_BY_PATH = Object.fromEntries(AREA_PAGES.map((a) => [a.path, a]));
