import Link from "next/link";
import Image from "next/image";
import { getCatalog, getFaqs, getLogos, getReviews } from "@/lib/data";
import { getDict, getLang } from "@/lib/i18n";
import { getSettings } from "@/lib/settings";
import { IS_DEMO } from "@/lib/demo";
import { FaqList } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { IconArrow, IconBox, IconCheck, IconClock, IconDrop, IconIron, IconPin, IconShield, IconStar, IconTag, IconTruck, IconWhatsApp } from "@/components/Icons";
import { AREA_PAGES } from "@/lib/areas";
import { B2B_IMAGES, CATEGORY_IMAGE, IMAGES, imageFor } from "@/lib/images";
import { PromoBanners, type Banner } from "@/components/PromoBanners";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ClientSlider } from "@/components/ClientSlider";
import { Packages } from "@/components/Packages";
import { rs, SITE, waLink } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [t, lang, s, catalog, logos, reviews, faqs] = await Promise.all([
    getDict(), getLang(), getSettings(), getCatalog(), getLogos(), getReviews(), getFaqs(),
  ]);
  const roman = lang === "ru";
  const cats = catalog.filter((c) => c.services.length && c.slug !== "packages");
  const packages = catalog.find((c) => c.slug === "packages")?.services ?? [];
  const stepIcons = [IconTruck, IconDrop, IconIron, IconBox];
  const wa = waLink(s.whatsappNumber, "Assalam o Alaikum, I want to book a laundry pickup.");
  const showClients = logos.length > 0 || IS_DEMO;

  const banners: Banner[] = [
    { title: "Free pickup every Sunday", text: "Any order size when pickup and delivery are both on Sunday.", cta: "Book Sunday", href: "/services", image: IMAGES.hero, tone: "blue" },
    { title: "Laundry contracts for institutions", text: "Hospitals, companies, banquets and masjids.", cta: "Get a quote", href: "/business#inquiry", image: B2B_IMAGES.company, tone: "navy" },
    { title: "Razai & kambal deep wash", text: "Quilts and blankets washed and fully dried.", cta: "See rates", href: "/services#bedding", image: CATEGORY_IMAGE.bedding, tone: "light" },
  ];

  const segments = [
    { t: "Hospitals & clinics", d: "Bed sheets, gowns and linen, washed separately from household laundry.", img: B2B_IMAGES.hospital },
    { t: "Companies & factories", d: "Staff uniforms on a fixed weekly schedule.", img: B2B_IMAGES.company },
    { t: "Lawns & banquets", d: "Tablecloths and chair covers back before your next event.", img: B2B_IMAGES.banquet },
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

      {/* Hero */}
      <section className="bg-brand-50">
        <div className="container-x grid items-center gap-8 py-8 md:grid-cols-2 md:gap-12 md:py-16">
          <div>
            <p className="eyebrow">Laundry pickup & delivery · Karachi</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-brand-900 md:text-5xl">
              Pani ka masla? Time nahi? <span className="text-brand-600">Kapray hum dhoyenge.</span>
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600">{t.heroSub}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/services" className="btn-primary text-base">{t.orderNow}</Link>
              <a href={wa} target="_blank" rel="noopener" className="btn-ghost text-base"><IconWhatsApp className="h-5 w-5 text-wa" />{t.whatsapp}</a>
            </div>
            <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-700">
              {([[IconTruck, "Free pickup & delivery on Sundays"], [IconClock, "Ready in 24–48 hours"], [IconTag, "Every order tagged separately"], [IconShield, "Cash on delivery"]] as const).map(([I, l]) => (
                <li key={l} className="flex items-center gap-2.5"><I className="h-5 w-5 flex-none text-brand-600" />{l}</li>
              ))}
            </ul>
          </div>
          <div className="relative hidden aspect-[5/4] overflow-hidden rounded-2xl md:block">
            <Image src={IMAGES.hero} alt="Freshly washed and folded shirts ready for delivery" fill priority sizes="(min-width:768px) 560px, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* Mobile: category shortcuts */}
      <section className="container-x pt-6 md:hidden" aria-label="Categories">
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
          {cats.map((c) => (
            <Link key={c.id} href={`/services#${c.slug}`} className="flex w-[72px] flex-none flex-col items-center gap-1.5 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                <CategoryIcon slug={c.slug} className="h-6 w-6" />
              </span>
              <span className="text-[11px] font-medium leading-tight text-brand-900">{roman && c.nameUr ? c.nameUr : c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo banners */}
      <section className="pt-6 md:container-x md:pt-14">
        <PromoBanners banners={banners} />
      </section>

      {/* Services (photo grid; mobile uses the category row above) */}
      <section className="container-x hidden py-14 md:block md:py-20">
        <div className="flex items-end justify-between gap-4">
          <div><p className="eyebrow">Services</p><h2 className="h-section mt-1">What we clean</h2></div>
          <Link href="/services" className="text-sm font-semibold text-brand-600">{t.viewAll} →</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {cats.map((c) => {
            const from = Math.min(...c.services.map((x) => x.price));
            return (
              <Link key={c.id} href={`/services#${c.slug}`} className="group card overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden bg-brand-50">
                  <Image src={imageFor(c.slug)} alt={`${c.name} service in Karachi`} fill sizes="(min-width:768px) 360px, 50vw" className="object-cover transition duration-300 group-hover:scale-105" />
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="text-sm font-semibold text-brand-900 md:text-base">{roman && c.nameUr ? c.nameUr : c.name}</h3>
                  <p className="text-xs text-slate-500 md:text-sm">From {rs(from)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Packages */}
      {packages.length > 0 && (
        <section className="container-x py-14 md:pb-20 md:pt-0">
          <div className="flex items-end justify-between gap-4">
            <div><p className="eyebrow">Packages</p><h2 className="h-section mt-1">Save with a bundle</h2></div>
            <Link href="/services#packages" className="text-sm font-semibold text-brand-600">All packages →</Link>
          </div>
          <div className="mt-6"><Packages items={packages} label={t.addToCart} addedLabel={t.added} /></div>
        </section>
      )}

      {/* How it works */}
      <section className="border-y border-brand-100 bg-brand-50">
        <div className="container-x py-14 md:py-16">
          <p className="eyebrow">{t.howItWorks}</p>
          <ol className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {t.steps.map((st, i) => {
              const Icon = stepIcons[i];
              return (
                <li key={st.t} className="flex gap-4 md:block">
                  <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-white text-brand-600 ring-1 ring-brand-200"><Icon className="h-5 w-5" /></span>
                  <div className="md:mt-3">
                    <h3 className="font-semibold text-brand-900"><span className="text-brand-600">{i + 1}.</span> {st.t}</h3>
                    <p className="mt-1 text-sm text-slate-600">{st.d}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="mt-8 text-sm text-slate-600">
            Pickup and delivery are free when both are on Sunday, and any day above {rs(s.freeDeliveryThreshold)}. Otherwise {rs(s.deliveryFee)}.
          </p>
        </div>
      </section>

      {/* Contracts / B2B */}
      <section className="container-x py-14 md:py-20">
        <div className="md:flex md:items-end md:justify-between md:gap-10">
          <div className="max-w-2xl">
            <p className="eyebrow">For institutions</p>
            <h2 className="h-section mt-1">We take laundry contracts</h2>
            <p className="mt-3 text-slate-600">Monthly contracts for hospitals, companies, lawns and masjids. Fixed pickup days, a per-piece rate and one invoice at the end of the month.</p>
          </div>
          <Link href="/business#inquiry" className="btn-primary mt-5 hidden md:inline-flex">Request a quote <IconArrow className="h-4 w-4" /></Link>
        </div>

        <div className="-mx-4 mt-6 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0">
          {segments.map((g) => (
            <Link key={g.t} href="/business#inquiry" className="group card w-[70%] flex-none snap-start overflow-hidden md:w-auto">
              <div className="relative aspect-[4/3] bg-brand-50">
                <Image src={g.img} alt={`Laundry service for ${g.t.toLowerCase()} in Karachi`} fill sizes="(min-width:768px) 270px, 70vw" className="object-cover transition duration-300 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-brand-900">{g.t}</h3>
                <p className="mt-1 text-sm text-slate-600">{g.d}</p>
              </div>
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
      </section>

      {/* Clients */}
      {showClients && (
        <section className="pb-14 md:pb-20">
          <div className="container-x mb-6 flex items-end justify-between gap-4">
            <div><p className="eyebrow">Our contract clients</p><h2 className="h-section mt-1">{t.clients}</h2></div>
          </div>
          <ClientSlider logos={logos} placeholder={IS_DEMO} />
        </section>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="container-x pb-14 md:pb-20">
          <h2 className="h-section">{t.reviews}</h2>
          <div className="-mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
            {reviews.slice(0, 3).map((r) => (
              <figure key={r.id} className="card w-[82%] flex-none snap-center p-5 md:w-auto">
                <div className="flex text-amber-400" aria-label={`${r.rating} out of 5`}>{Array.from({ length: r.rating }).map((_, i) => <IconStar key={i} className="h-4 w-4" />)}</div>
                <blockquote className="mt-3 text-sm leading-relaxed text-slate-700">{r.text}</blockquote>
                <figcaption className="mt-4 text-sm"><b className="text-brand-900">{r.name}</b>{r.area && <span className="text-slate-500"> · {r.area}</span>}</figcaption>
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
