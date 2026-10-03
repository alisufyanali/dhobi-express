import Link from "next/link";
import Image from "next/image";
import { getCatalog, getFaqs, getLogos, getReviews } from "@/lib/data";
import { getDict, getLang } from "@/lib/i18n";
import { getSettings } from "@/lib/settings";
import { FaqList } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { HeroSlider, type Slide } from "@/components/HeroSlider";
import { ContractClients } from "@/components/ContractClients";
import { InstallApp } from "@/components/InstallApp";
import { ActiveOrder } from "@/components/ActiveOrder";
import { Packages } from "@/components/Packages";
import { Stepper } from "@/components/Stepper";
import {
  IconArrow, IconBox, IconCheck, IconClock, IconDrop, IconIron, IconPin, IconShield, IconStar, IconTag, IconTruck, IconWhatsApp,
} from "@/components/Icons";
import { AREA_PAGES } from "@/lib/areas";
import { B2B_IMAGES, IMAGES, imageFor } from "@/lib/images";
import { rs, SITE, UNIT_LABEL, waLink } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [t, lang, s, catalog, logos, reviews, faqs] = await Promise.all([
    getDict(), getLang(), getSettings(), getCatalog(), getLogos(), getReviews(), getFaqs(),
  ]);
  const roman = lang === "ru";
  const cats = catalog.filter((c) => c.services.length && c.slug !== "packages");
  const packages = catalog.find((c) => c.slug === "packages")?.services ?? [];
  const winterItems = (catalog.find((c) => c.slug === "bedding")?.services ?? [])
    .filter((x) => /quilt|blanket|comforter|razai|kambal/i.test(x.name)).slice(0, 3);
  const wa = waLink(s.whatsappNumber, "Assalam o Alaikum, I want to book a laundry pickup.");
  const stepIcons = [IconTruck, IconDrop, IconIron, IconBox];

  const slides: Slide[] = [
    {
      eyebrow: "Special deal", title: "10% off your", highlight: "first order", code: "WELCOME10",
      text: "Wash, press and dry clean with free pickup and delivery across Karachi.", image: IMAGES.hero, alt: "Freshly washed and folded shirts",
      primary: { label: "Book now", href: "/services" }, secondary: { label: t.whatsapp, href: wa, external: true },
    },
    {
      eyebrow: "Winter is coming", title: "Kambal & razai", highlight: "deep wash", tone: "deep",
      text: "Fully dried, no musty smell — ready before the cold sets in.", image: IMAGES.winter, alt: "Stack of clean folded blankets",
      primary: { label: "Book kambal wash", href: "/services#bedding" },
    },
    {
      eyebrow: "Free pickup & delivery", title: `Every day above ${rs(s.freeDeliveryThreshold)}`, highlight: "· any size on Sunday",
      text: "Pickup slots 10am–1pm and 4pm–7pm.", image: IMAGES.machines, alt: "Row of washing machines",
      primary: { label: "Schedule pickup", href: "/services" },
    },
    {
      eyebrow: "For institutions", title: "Laundry contracts", highlight: "for hospitals & factories", tone: "deep",
      text: "Fixed pickup days, per-piece rates and one monthly invoice.", image: B2B_IMAGES.company, alt: "Commercial laundry staff folding linen",
      primary: { label: "Get a quote", href: "/business#inquiry" }, secondary: { label: "Learn more", href: "/business" },
    },
  ];

  const why = [
    { I: IconTruck, t: "Free pickup & delivery", d: `Above ${rs(s.freeDeliveryThreshold)} every day, any size on Sunday.` },
    { I: IconClock, t: "Ready in 24–48 hours", d: "We give you a delivery date at pickup and keep it." },
    { I: IconTag, t: "Never mixed up", d: "Every order is tagged and washed separately." },
    { I: IconDrop, t: "Hygienic wash", d: "Household, hospital and business loads are kept apart." },
    { I: IconShield, t: "Clear prices", d: "Rates are published. What you see is what you pay." },
    { I: IconCheck, t: "Pay your way", d: "Cash on delivery, JazzCash, Easypaisa or monthly invoice." },
  ];

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
        address: { "@type": "PostalAddress", addressLocality: "Karachi", addressRegion: "Sindh", addressCountry: "PK" },
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
        <Link href="/services?focus=search" className="mt-3 flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 text-sm text-slate-400 ring-1 ring-slate-200 active:bg-slate-50">
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

      {/* Services: Laundo-style tiles */}
      <section className="pt-6 pb-2 md:py-14">
        <div className="container-x flex items-end justify-between gap-4">
          <h2 className="h-section">Services</h2>
          <Link href="/services" className="text-sm font-semibold text-brand-600">See all</Link>
        </div>
        <div className="container-x mt-3 md:mt-6">
          <div className="no-scrollbar -mx-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-6 md:gap-5 md:overflow-visible md:px-0">
            {cats.map((c) => (
              <Link key={c.id} href={`/services#${c.slug}`} className="group w-[84px] flex-none snap-start rounded-2xl bg-white p-1.5 ring-1 ring-slate-200 transition active:scale-[.97] md:w-auto md:p-2 md:hover:ring-brand-500">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-brand-50">
                  <Image src={imageFor(c.slug)} alt={`${c.name} service in Karachi`} fill sizes="(min-width:768px) 180px, 84px" className="object-cover transition duration-300 group-hover:scale-105" />
                </div>
                <p className="mt-1.5 rounded-lg bg-brand-500 px-1 py-1 text-center text-[10px] font-semibold leading-tight text-white md:py-1.5 md:text-sm">{roman && c.nameUr ? c.nameUr : c.name}</p>
                <p className="mt-1 hidden text-center text-xs text-slate-500 md:block">From {rs(Math.min(...c.services.map((x) => x.price)))}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ActiveOrder />

      {/* Winter is coming */}
      {winterItems.length > 0 && (
        <section className="container-x pt-6 pb-10 md:pb-20">
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
                  <li key={w.id} className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-brand-100">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-brand-900">{roman && w.nameUr ? w.nameUr : w.name}</p>
                      <p className="text-xs text-slate-500">{rs(w.price)} {UNIT_LABEL[w.unit]}</p>
                    </div>
                    <Stepper item={{ serviceId: w.id, name: w.name, price: w.price, unit: w.unit }} />
                  </li>
                ))}
              </ul>
              <Link href="/services#bedding" className="mt-5 inline-flex text-sm font-semibold text-brand-600">All bedding rates →</Link>
            </div>
          </div>
        </section>
      )}

      {/* Packages */}
      {packages.length > 0 && (
        <section className="container-x pb-10 md:pb-20">
          <div className="flex items-end justify-between gap-4">
            <div><p className="eyebrow">Packages</p><h2 className="h-section mt-1">Save with a bundle</h2></div>
            <Link href="/services#packages" className="text-sm font-semibold text-brand-600">All packages →</Link>
          </div>
          <div className="mt-6"><Packages items={packages} label={t.addToCart} addedLabel={t.added} /></div>
        </section>
      )}

      {/* Why choose us */}
      <section className="border-y border-brand-100 bg-brand-50">
        <div className="container-x py-10 md:py-20">
          <div className="flex items-end justify-between gap-4"><div className="max-w-2xl"><p className="eyebrow">Why choose us</p><h2 className="h-section mt-1">Laundry you don&apos;t have to think about</h2></div><Link href="/why-choose-us" className="flex-none text-sm font-semibold text-brand-600">Learn more</Link></div>
          <ul className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:gap-4 lg:grid-cols-3">
            {why.map(({ I, t: title, d }) => (
              <li key={title} className="rounded-2xl bg-white p-4 ring-1 ring-brand-100 md:flex md:gap-4 md:p-5">
                <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-brand-600 text-white md:h-11 md:w-11"><I className="h-5 w-5" /></span>
                <div className="mt-3 md:mt-0">
                  <h3 className="text-sm font-semibold leading-snug text-brand-900 md:text-base">{title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 md:text-sm">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="container-x py-10 md:py-20">
        <p className="eyebrow">{t.howItWorks}</p>
        <h2 className="h-section mt-1">Four simple steps</h2>
        <ol className="no-scrollbar -mx-4 mt-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:mt-8 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0">
          {t.steps.map((st, i) => {
            const Icon = stepIcons[i];
            return (
              <li key={st.t} className="w-[46%] flex-none snap-start rounded-2xl bg-brand-50 p-4 ring-1 ring-brand-100 md:w-auto md:bg-transparent md:p-0 md:ring-0">
                <span className="relative grid h-12 w-12 flex-none place-items-center rounded-full bg-white text-brand-700 ring-1 ring-brand-100 md:bg-brand-100 md:ring-0">
                  <Icon className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-brand-600 text-[11px] font-bold text-white">{i + 1}</span>
                </span>
                <div className="mt-3"><h3 className="font-semibold text-brand-900">{st.t}</h3><p className="mt-1 text-xs leading-relaxed text-slate-600 md:text-sm">{st.d}</p></div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Contracts */}
      <section className="md:bg-white">
        <div className="container-x pb-4">
          <div className="md:flex md:items-end md:justify-between md:gap-10">
            <div className="max-w-2xl">
              <p className="eyebrow">For institutions</p>
              <h2 className="h-section mt-1">We take laundry contracts</h2>
              <p className="mt-3 text-slate-600">Monthly contracts for hospitals, companies, lawns and masjids. Fixed pickup days, a per-piece rate and one invoice at the end of the month.</p>
            </div>
            <Link href="/business#inquiry" className="btn-primary mt-5 hidden md:inline-flex">Request a quote <IconArrow className="h-4 w-4" /></Link>
          </div>
          <div className="-mx-4 mt-6 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0">
            {segments.map((g) => (
              <Link key={g.t} href="/business#inquiry" className="group card w-[70%] flex-none snap-start overflow-hidden md:w-auto">
                <div className="relative aspect-[4/3] bg-brand-50">
                  <Image src={g.img} alt={`Laundry service for ${g.t.toLowerCase()} in Karachi`} fill sizes="(min-width:768px) 270px, 70vw" className="object-cover transition duration-300 group-hover:scale-105" />
                </div>
                <div className="p-4"><h3 className="font-semibold text-brand-900">{g.t}</h3><p className="mt-1 text-sm text-slate-600">{g.d}</p></div>
              </Link>
            ))}
          </div>
          <div className="mt-6 grid gap-6 rounded-2xl bg-brand-900 p-6 text-white md:grid-cols-[1.3fr_1fr] md:items-center md:p-8">
            <div>
              <h3 className="text-xl font-bold">Become a contract client</h3>
              <ul className="mt-4 grid gap-2.5 text-sm text-white/85 sm:grid-cols-2">
                {["Fixed weekly pickup schedule", "Per-piece rate, agreed upfront", "Monthly invoice with order details", "First batch at a trial rate"].map((x) => (
                  <li key={x} className="flex gap-2"><IconCheck className="h-5 w-5 flex-none text-brand-500" />{x}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row lg:justify-end">
              <Link href="/business#inquiry" className="btn bg-white text-brand-900 hover:bg-brand-50">Request a quote</Link>
              <a href={waLink(s.whatsappNumber, "Assalam o Alaikum, I want a quote for a laundry contract.")} target="_blank" rel="noopener" className="btn bg-wa text-white"><IconWhatsApp className="h-5 w-5" />WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      <ContractClients logos={logos} />

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="container-x pb-10 md:pb-20">
          <h2 className="h-section">{t.reviews}</h2>
          <div className="-mx-4 mt-6 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
            {reviews.slice(0, 3).map((r) => (
              <figure key={r.id} className="card w-[82%] flex-none snap-center p-5 md:w-auto">
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

      {/* FAQ + areas */}
      <section className="container-x grid gap-10 md:grid-cols-[1.4fr_1fr]">
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
