// Stock photos (Unsplash, free to use). Replace with real photos of your own
// machines, staff and packed orders as soon as you have them — they build far more trust.
const u = (id: string, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export const IMAGES = {
  hero: u("1635274605638-d44babc08a4f", 1400), // folded shirts
  machines: u("1638949493140-edb10b7be2f3"), // row of washers
};

export const CATEGORY_IMAGE: Record<string, string> = {
  "wash-press": u("1604335398980-ededcadcc37d", 800),
  "press-only": u("1489274495757-95c7c837b101", 800),
  "dry-clean": u("1549037173-e3b717902c57", 800),
  curtains: u("1582735689369-4fe89db7114c", 800),
  bedding: u("1582735689369-4fe89db7114c", 800),
  uniforms: u("1542058186993-286fdce0b580", 800),
  packages: u("1635274605638-d44babc08a4f", 800),
};

export const imageFor = (slug: string) => CATEGORY_IMAGE[slug] ?? CATEGORY_IMAGE["wash-press"];

// Contract / B2B segments
export const B2B_IMAGES = {
  hospital: u("1611587266737-cc128ffe2946", 900), // hospital bed linen
  company: u("1741176504565-3fd277808585", 900), // commercial laundry folding
  banquet: u("1677129663241-5be1f17fe6fe", 900), // banquet tables and chairs
  masjid: u("1670514862391-df20ad00b330", 900), // masjid interior
};
