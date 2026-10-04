import Link from "next/link";
import Image from "next/image";
import { getCatalog, getFaqs, getLogos, getReviews } from "@/lib/data";
import { getDict, getLang } from "@/lib/i18n";
import { getSettings } from "@/lib/settings";
import { FaqList } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { HeroSlider, type Slide } from "@/components/HeroSlider";
import { ContractClients } from "@/components/ContractClients";
import { ShopLocation } from "@/components/ShopLocation";
import { WashingMachine } from "@/components/WashingMachine";
import { DeliveryRoad } from "@/components/DeliveryRoad";
import { directionsUrl, hasShopLocation } from "@/lib/location";
import { InstallApp } from "@/components/InstallApp";
import { ActiveOrder } from "@/components/ActiveOrder";
import { PackageTabs } from "@/components/PackageTabs";
import { Stepper } from "@/components/Stepper";
import { AutoRail } from "@/components/AutoRail";
import { GarmentIcon, TypeArt } from "@/components/GarmentIcon";
import {
  IconArrow, IconBox, IconClock, IconDrop, IconIron, IconPin, IconShield, IconStar, IconTag, IconTruck, IconWhatsApp,
} from "@/components/Icons";
import { AREA_PAGES } from "@/lib/areas";
import { B2B_IMAGES, IMAGES, imageFor } from "@/lib/images";
import { itemLabel, rs, SEGMENT_LABEL, SITE, UNIT_LABEL, waLink } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [t, lang, s, catalog, logos, reviews, faqs] = await Promise.all([
    getDict(), getLang(), getSettings(), getCatalog(), getLogos(), getReviews(), getFaqs(),
  ]);
  const roman = lang === "ru";
  const cats = catalog.filter((c) => c.services.length && c.slug !== "packages");
  const packages = catalog.find((c) => c.slug === "packages")?.services ?? [];
  const winterItems = (catalog.find((c) => c.slug === "wash-only")?.services ?? []).filter((x) => x.segment === "household")
    .filter((x) => /quilt|blanket|comforter|razai|kambal/i.test(x.name)).slice(0, 3);
  const wa = waLink(s.whatsappNumber, "Assalam o Alaikum, I want to book a laundry pickup.");
  const stepIcons = [IconTruck, IconDrop, IconIron, IconBox];

  const slides: Slide[] = [
    {
      eyebrow: "Special deal", title: "10% off your", highlight: "first order", code: "WELCOME10",
      text: "Wash, press and dry clean with free pickup and delivery across Karachi.", image: IMAGES.hero, alt: "Freshly washed and folded shirts",
      primary: { label: "Book now", href: "/bill-calculator" }, secondary: { label: t.whatsapp, href: wa, external: true },
    },
    {
      eyebrow: "Winter is coming", title: "Kambal & razai", highlight: "deep wash", tone: "deep",
      text: "Fully dried, no musty smell — ready before the cold sets in.", image: IMAGES.winter, alt: "Stack of clean folded blankets",
      primary: { label: "Book kambal wash", href: "/bill-calculator#wash-only/household" },
    },
    {
      eyebrow: "Free pickup & delivery", title: `Every day above ${rs(s.freeDeliveryThreshold)}`, highlight: "· any size on Sunday",
      text: "Pickup slots 10am–1pm and 4pm–7pm.", image: IMAGES.machines, alt: "Row of washing machines",
      primary: { label: "Schedule pickup", href: "/bill-calculator" },
    },
    {
      eyebrow: "For institutions", title: "Laundry contracts", highlight: "for hospitals & factories", tone: "deep",
      text: "Fixed pickup days, per-piece rates and one monthly invoice.", image: B2B_IMAGES.company, alt: "Commercial laundry staff folding linen",
      primary: { label: "Get a quote", href: "/business#inquiry" }, secondary: { label: "Learn more", href: "/business" },
    },
  ];

  const offers = [
    { k: "New customer", t: "10% off · WELCOME10", cta: "Order now", href: "/bill-calculator", bg: "bg-amber-400", fg: "text-brand-900", sub: "text-brand-900/70" },
    { k: "Every day", t: `Free delivery above ${rs(s.freeDeliveryThreshold)}`, cta: "Schedule pickup", href: "/bill-calculator", bg: "bg-brand-500", fg: "text-white", sub: "text-white/80" },
    { k: "Sunday special", t: "Free delivery, any size", cta: "Book Sunday", href: "/bill-calculator", bg: "bg-emerald-500", fg: "text-white", sub: "text-white/80" },
    { k: "Winter is coming", t: "Kambal & razai wash", cta: "See rates", href: "/bill-calculator#wash-only/household", bg: "bg-brand-900", fg: "text-white", sub: "text-brand-100" },
  ];
  const SERVICE_BLURB: Record<string, string> = {
    "wash-iron": "Washed, pressed and folded — ready to wear.",
    "iron-only": "Steam pressed, crease-free, on hangers.",
    "wash-only": "Washed, dried and folded. Bedding and razai too.",
    "dry-clean": "Suits, sherwani and delicate fabrics.",
    "per-kg": "Mixed everyday load, priced by weight.",
  };
  const PICKS: [string, string, string][] = [
    ["Shirt", "men", "wash-iron"], ["Kameez", "women", "wash-iron"], ["Shalwar", "men", "wash-iron"],
    ["Bedsheet (double)", "household", "wash-iron"], ["Suit (2-piece)", "men", "dry-clean"], ["Kameez", "men", "iron-only"],
  ];
  const popular = PICKS.flatMap(([n, seg, type]) => {
    const c = catalog.find((x) => x.slug === type);
    const x = c?.services.find((y) => y.name === n && y.segment === seg);
    return c && x ? [{ id: x.id, name: x.name, label: itemLabel(x.name, x.segment, c.name, c.slug), price: x.price, unit: x.unit, type: c.name, seg: x.segment }] : [];
  });


  const segments = [
    { t: "Hospitals & clinics", d: "Bed sheets, gowns and linen, washed separately.", img: B2B_IMAGES.hospital },
    { t: "Companies & factories", d: "Staff uniforms on a fixed weekly schedule.", img: B2B_IMAGES.company },
    { t: "Lawns & banquets", d: "Tablecloths and chair covers, back before your next event.", img: B2B_IMAGES.banquet },
    { t: "Masjids & madrasas", d: "Chadar, ghilaf, curtains and prayer-area fabrics.", img: B2B_IMAGES.masjid },
  ];

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "DryCleaningOrLaundry", name: SITE.name, url: SITE.url,
        telephone: s.phone, email: s.email, priceRange: "Rs. 40 - Rs. 1200", image: IMAGES.hero,
        address: {
          "@type": "PostalAddress", addressLocality: "Karachi", addressRegion: "Sindh", addressCountry: "PK",
          ...(hasShopLocation(s) ? { streetAddress: s.address } : {}),
        },
        ...(s.latitude != null && s.longitude != null ? { geo: { "@type": "GeoCoordinates", latitude: s.latitude, longitude: s.longitude } } : {}),
        ...(hasShopLocation(s) ? { hasMap: directionsUrl(s) } : {}),
        areaServed: AREA_PAGES.map((a) => ({ "@type": "Place", name: `${a.name}, Karachi` })),
        openingHours: "Mo-Su 10:00-19:00",
      }} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
      }} />

      <h1 className="sr-only">Dhobi Express — laundry pickup and delivery in Karachi</h1>

      {/* Phones: greeting + search, like an app home screen */}
      <section className="container-x pt-4 md:hidden">
        <p className="text-sm text-slate-500">Assalam o Alaikum</p>
        <p className="text-xl font-bold text-brand-900">What should we wash today?</p>
        <Link href="/bill-calculator?focus=search" className="mt-3 flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 text-sm text-slate-400 ring-1 ring-slate-200 active:bg-slate-50">
          <svg viewBox="0 0 24 24" className="h-5 w-5 flex-none text-slate-400" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          Search shalwar kameez, razai, suit…
        </Link>
      </section>
      <InstallApp variant="card" />

      <HeroSlider slides={slides} />

      {/* Trust strip */}
      <section className="md:border-b md:border-slate-200 md:bg-white">
        <ul className="no-scrollbar container-x flex gap-2 overflow-x-auto pt-3 text-xs font-medium text-slate-700 md:grid md:grid-cols-4 md:gap-x-4 md:py-5 md:text-sm">
          {[[IconTruck, "Free pickup & delivery"], [IconClock, "Ready in 24–48 hours"], [IconTag, "Tagged, never mixed"], [IconShield, "Cash on delivery"]].map(([I, l]) => {
            const Ic = I as typeof IconTruck;
            return <li key={l as string} className="flex flex-none items-center gap-2 rounded-full bg-white px-3 py-2 ring-1 ring-slate-200 md:gap-2.5 md:rounded-none md:bg-transparent md:p-0 md:ring-0"><Ic className="h-4 w-4 flex-none text-brand-600 md:h-5 md:w-5" />{l as string}</li>;
          })}
        </ul>
      </section>

      {/* Colourful offer cards */}
      <section className="container-x pt-4 md:pt-6">
        <ul className="no-scrollbar -mx-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0">
          {offers.map((o) => (
            <li key={o.t} className="w-[62%] flex-none snap-start sm:w-[40%] md:w-auto">
              <Link href={o.href} className={`lift relative flex h-full min-h-[118px] flex-col justify-between overflow-hidden rounded-2xl p-4 md:min-h-[150px] md:p-5 ${o.bg}`}>
                <span aria-hidden className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-white/20 md:h-32 md:w-32" />
                <span aria-hidden className="absolute -right-2 top-3 h-10 w-10 rounded-full bg-white/15" />
                <div className="relative">
                  <p className={`text-[11px] font-bold uppercase tracking-wider ${o.sub}`}>{o.k}</p>
                  <p className={`mt-1 text-lg font-extrabold leading-tight md:text-2xl ${o.fg}`}>{o.t}</p>
                </div>
                <p className={`relative mt-3 text-xs font-semibold md:text-sm ${o.fg}`}>{o.cta} →</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Our services: auto-sliding photo cards */}
      <section data-reveal className="pt-8 pb-2 md:py-16">
        <div className="container-x flex items-end justify-between gap-4">
          <div><p className="eyebrow">What we do</p><h2 className="h-section mt-1">Our services</h2></div>
          <Link href="/services" className="text-sm font-semibold text-brand-600">See all</Link>
        </div>
        <div className="mt-4 md:container-x md:mt-8">
          <AutoRail label="Our services">
            {cats.map((c) => (
              <Link key={c.id} href={`/services#${c.slug}/men`} className="lift group w-[44%] flex-none snap-start overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 sm:w-[30%] md:w-[calc((100%-40px)/3)] lg:w-[calc((100%-50px)/3.4)] md:hover:ring-brand-500">
                <div className="relative aspect-[4/3] bg-brand-100">
                  <TypeArt slug={c.slug} />
                  <Image src={imageFor(c.slug)} alt={`${c.name} service in Karachi`} fill sizes="(min-width:768px) 300px, 45vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-brand-700 md:left-3 md:top-3 md:text-xs">From {rs(Math.min(...c.services.map((x) => x.price)))}</span>
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="text-sm font-bold text-brand-900 md:text-lg">{roman && c.nameUr ? c.nameUr : c.name}</h3>
                  <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-slate-500 md:text-sm">{SERVICE_BLURB[c.slug] ?? "Picked up, cleaned and delivered."}</p>
                  <p className="mt-2 hidden text-sm font-semibold text-brand-600 md:block">View rates →</p>
                </div>
              </Link>
            ))}
            <Link href="/business" className="lift group w-[44%] flex-none snap-start overflow-hidden rounded-2xl bg-brand-900 text-white sm:w-[30%] md:w-[calc((100%-40px)/3)] lg:w-[calc((100%-50px)/3.4)]">
              <div className="relative aspect-[4/3]"><TypeArt slug="corporate" /></div>
              <div className="p-3 md:p-4">
                <h3 className="text-sm font-bold md:text-lg">Corporate</h3>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-white/75 md:text-sm">Hospitals, offices, banquets and masjids.</p>
                <p className="mt-2 hidden text-sm font-semibold text-brand-100 md:block">Monthly contract →</p>
              </div>
            </Link>
          </AutoRail>
        </div>
      </section>

      {/* Popular items: quick add */}
      {popular.length > 0 && (
        <section data-reveal className="container-x pt-6 md:pt-0 md:pb-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="h-section">Popular picks</h2>
            <Link href="/bill-calculator" className="text-sm font-semibold text-brand-600">All items</Link>
          </div>
          <ul className="mt-4 grid gap-2.5 md:mt-6 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
            {popular.map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-2xl bg-white p-2.5 ring-1 ring-slate-200 md:p-3">
                <GarmentIcon name={p.name} className="h-12 w-12 md:h-14 md:w-14" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-brand-900">{p.name}{p.seg && p.seg !== "household" && <span className="font-normal text-slate-500"> · {SEGMENT_LABEL[p.seg]}</span>}</p>
                  <p className="text-xs text-slate-500">{p.type} · <b className="text-brand-700">{rs(p.price)}</b></p>
                </div>
                <Stepper item={{ serviceId: p.id, name: p.label, price: p.price, unit: p.unit }} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <ActiveOrder />

      {/* Winter is coming */}
      {winterItems.length > 0 && (
        <section data-reveal className="container-x pt-6 pb-10 md:pb-20">
          <div className="grid overflow-hidden rounded-2xl border border-brand-100 bg-brand-50 md:grid-cols-2">
            <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[360px]">
              <Image src={IMAGES.winter} alt="Clean folded blankets ready for winter" fill sizes="(min-width:768px) 560px, 100vw" className="object-cover" />
              <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-900">Winter is coming</span>
            </div>
            <div className="p-6 md:p-10">
              <h2 className="text-2xl font-bold text-brand-900 md:text-3xl">Kambal aur razai abhi wash karwayein</h2>
              <p className="mt-2 text-slate-600">Beat the November rush. Deep wash, fully dried and packed — ready the day the cold arrives.</p>
              <ul className="mt-5 space-y-3">
                {winterItems.map((w) => (
                  <li key={w.id} className="flex items-center gap-3 rounded-xl bg-white p-2.5 ring-1 ring-brand-100">
                    <GarmentIcon name={w.name} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-brand-900">{roman && w.nameUr ? w.nameUr : w.name}</p>
                      <p className="text-xs text-slate-500">{rs(w.price)} {UNIT_LABEL[w.unit]}</p>
                    </div>
                    <Stepper item={{ serviceId: w.id, name: w.name, price: w.price, unit: w.unit }} />
                  </li>
                ))}
              </ul>
              <Link href="/bill-calculator#wash-only/household" className="mt-5 inline-flex text-sm font-semibold text-brand-600">All bedding rates →</Link>
            </div>
          </div>
        </section>
      )}

      {/* Packages */}
      {packages.length > 0 && (
        <section data-reveal className="bg-brand-50 py-10 md:py-16">
          <div className="container-x">
            <div className="text-center">
              <p className="eyebrow">Save every month</p>
              <h2 className="h-section mt-1">Monthly packages</h2>
            </div>
            <div className="mt-5 md:mt-8"><PackageTabs items={packages} /></div>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/pricing" className="btn-ghost">Full price list</Link>
              <Link href="/bill-calculator" className="btn-primary">Bill calculator</Link>
            </div>
          </div>
        </section>
      )}

      <DeliveryRoad
        title={`Free pickup & delivery above ${rs(s.freeDeliveryThreshold)} — every day`}
        sub={`Pickup slots ${s.timeSlots.join(" and ")} · any order size on Sunday`}
      />

      {/* How it works */}
      <section data-reveal className="bg-brand-600 text-white">
        <div className="container-x py-10 md:py-16">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-100">{t.howItWorks}</p>
              <h2 className="mt-1 text-2xl font-bold md:text-4xl">Laundry in four easy steps</h2>
              <p className="mt-1 max-w-md text-sm text-white/80 md:text-base">From your door, through our machines, and back — usually within 48 hours.</p>
            </div>
            <WashingMachine id="how" className="hidden h-36 w-28 flex-none md:block" />
          </div>
          <ol className="mt-8 grid grid-cols-4 gap-1 md:mt-10 md:gap-4">
            {t.steps.map((st, i) => {
              const Icon = stepIcons[i];
              return (
                <li key={st.t} className="relative flex flex-col items-center text-center">
                  {i < 3 && (
                    <svg aria-hidden viewBox="0 0 40 12" className="absolute left-[calc(50%+30px)] top-[22px] w-[calc(100%-60px)] text-white/60 md:left-[calc(50%+46px)] md:top-[34px] md:w-[calc(100%-92px)]" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M0 6h36" strokeDasharray="3 3" /><path d="m33 2 4 4-4 4" />
                    </svg>
                  )}
                  <span className="relative grid h-12 w-12 place-items-center rounded-full bg-white text-brand-600 md:h-[72px] md:w-[72px]">
                    <Icon className="h-6 w-6 md:h-8 md:w-8" />
                    <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-amber-400 text-[11px] font-bold text-brand-900 md:h-6 md:w-6 md:text-xs">{i + 1}</span>
                  </span>
                  <h3 className="mt-3 text-xs font-semibold leading-tight md:text-lg">{st.t}</h3>
                  <p className="mt-1 hidden max-w-[220px] text-sm leading-relaxed text-white/80 md:block">{st.d}</p>
                </li>
              );
            })}
          </ol>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/bill-calculator" className="btn bg-white text-brand-700 hover:bg-brand-50">Book a pickup</Link>
            <a href={wa} target="_blank" rel="noopener" className="btn border border-white/60 text-white hover:bg-white/10"><IconWhatsApp className="h-5 w-5" />WhatsApp</a>
          </div>
        </div>
      </section>

      {/* Contracts */}
      <section data-reveal className="md:bg-white">
        <div className="container-x pb-4 pt-10 md:pt-20">
          <div className="md:flex md:items-end md:justify-between md:gap-10">
            <div className="max-w-2xl">
              <p className="eyebrow">For institutions</p>
              <h2 className="h-section mt-1">We take laundry contracts</h2>
              <p className="mt-2 text-sm text-slate-600 md:text-base">Fixed pickup days · per-piece rate · one monthly invoice.</p>
            </div>
            <Link href="/business#inquiry" className="btn-primary mt-4 md:mt-0">Request a quote <IconArrow className="h-4 w-4" /></Link>
          </div>
          <div className="-mx-4 mt-6 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0">
            {segments.map((g) => (
              <Link key={g.t} href="/business#inquiry" className="lift group card w-[70%] flex-none snap-start overflow-hidden md:w-auto">
                <div className="relative aspect-[4/3] bg-brand-50">
                  <Image src={g.img} alt={`Laundry service for ${g.t.toLowerCase()} in Karachi`} fill sizes="(min-width:768px) 270px, 70vw" className="object-cover transition duration-300 group-hover:scale-105" />
                </div>
                <div className="p-4"><h3 className="font-semibold text-brand-900">{g.t}</h3><p className="mt-1 text-sm text-slate-600">{g.d}</p></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContractClients logos={logos} />

      {/* Reviews */}
      {reviews.length > 0 && (
        <section data-reveal className="container-x pb-10 md:pb-20">
          <h2 className="h-section">{t.reviews}</h2>
          <div className="-mx-4 mt-6 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
            {reviews.slice(0, 3).map((r) => (
              <figure key={r.id} className="lift card w-[82%] flex-none snap-center p-5 md:w-auto">
                <div className="flex text-amber-400" aria-label={`${r.rating} out of 5`}>{Array.from({ length: r.rating }).map((_, i) => <IconStar key={i} className="h-4 w-4" />)}</div>
                <blockquote className="mt-3 text-sm leading-relaxed text-slate-700">{r.text}</blockquote>
                <figcaption className="mt-4 flex items-center gap-3 text-sm">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 font-semibold text-brand-700">{r.name[0]}</span>
                  <span><b className="block text-brand-900">{r.name}</b>{r.area && <span className="text-xs text-slate-500">{r.area}</span>}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Shop location (shows once an address or map pin is set in Admin → Settings) */}
      <div className="container-x pb-10 md:pb-16" data-reveal><ShopLocation s={s} compact /></div>

      {/* FAQ + areas */}
      <section data-reveal className="container-x grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="h-section">{t.faq}</h2>
          <div className="mt-6"><FaqList items={faqs} /></div>
        </div>
        <div>
          <h2 className="h-section">{t.areas}</h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {AREA_PAGES.map((a) => (
              <li key={a.path}>
                <Link href={`/${a.path}`} className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-3.5 py-2 text-sm text-slate-700 hover:border-brand-500 hover:text-brand-700">
                  <IconPin className="h-4 w-4 text-brand-600" />{a.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
