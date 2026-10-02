import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getDict, getLang } from "@/lib/i18n";
import { getSettings } from "@/lib/settings";
import { FaqList } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { HeroPhone } from "@/components/HeroPhone";
import { CategoryIcon } from "@/components/CategoryIcon";
import { IconArrow, IconBox, IconClock, IconDrop, IconIron, IconPin, IconShield, IconStar, IconTag, IconTruck, IconWhatsApp } from "@/components/Icons";
import { AREA_PAGES } from "@/lib/areas";
import { rs, SITE, UNIT_LABEL, waLink } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [t, lang, s, cats, rateCard, logos, reviews, faqs] = await Promise.all([
    getDict(), getLang(), getSettings(),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, include: { services: { where: { active: true }, orderBy: { price: "asc" }, take: 1 } } }),
    prisma.service.findMany({ where: { active: true }, orderBy: [{ featured: "desc" }, { sortOrder: "asc" }], take: 8, include: { category: true } }),
    prisma.clientLogo.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.review.findMany({ where: { approved: true }, orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.faq.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  const roman = lang === "ru";
  const stepIcons = [IconTruck, IconDrop, IconIron, IconBox];
  const wa = waLink(s.whatsappNumber, "Assalam o Alaikum, I want to book a laundry pickup.");

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "DryCleaningOrLaundry", name: SITE.name, url: SITE.url,
        telephone: s.phone, email: s.email, priceRange: "Rs. 40 - Rs. 1200",
        address: { "@type": "PostalAddress", addressLocality: "Karachi", addressRegion: "Sindh", addressCountry: "PK" },
        areaServed: AREA_PAGES.map((a) => ({ "@type": "Place", name: `${a.name}, Karachi` })),
        openingHours: "Mo-Su 10:00-19:00",
      }} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
      }} />

      {/* ───── HERO: navy app-style gradient with wave edge ───── */}
      <section className="bg-navy-glow relative overflow-hidden text-white">
        <div className="container-x grid items-center gap-12 pb-24 pt-10 md:pb-36 md:pt-16 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-glow ring-1 ring-white/15">
              <span className="h-2 w-2 animate-pulse rounded-full bg-glow" /> Now serving {AREA_PAGES.length} areas in Karachi
            </p>
            <h1 className="mt-5 text-[2.1rem] font-extrabold leading-[1.1] tracking-tight md:text-6xl">
              Pani ka masla?<br />Time nahi?<br />
              <span className="bg-gradient-to-r from-glow to-brand-200 bg-clip-text text-transparent">Kapray hum dhoyenge.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-brand-100 md:text-lg">{t.heroSub}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/services" className="btn-sun text-base">{t.orderNow} <IconArrow className="h-4 w-4" /></Link>
              <a href={wa} target="_blank" rel="noopener" className="btn-glass text-base"><IconWhatsApp className="h-5 w-5 text-wa" /> {t.whatsapp}</a>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-brand-100 sm:flex sm:flex-wrap">
              {[[IconTruck, "Free pickup & delivery"], [IconTag, "Tagged, never mixed"], [IconClock, "24–48h turnaround"], [IconShield, "Cash on delivery"]].map(([I, l]) => {
                const Ic = I as typeof IconTruck;
                return <li key={l as string} className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-xl bg-white/10"><Ic className="h-4 w-4 text-glow" /></span>{l as string}</li>;
              })}
            </ul>
          </div>
          <div className="hidden lg:block"><HeroPhone /></div>
        </div>
        <svg className="absolute inset-x-0 -bottom-px h-14 w-full text-[#f6f8fc] md:h-24" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden>
          <path fill="currentColor" d="M0 60c240 40 480 40 720 10S1200 20 1440 50v50H0z" />
        </svg>
      </section>

      {/* ───── SERVICE CATEGORY TILES ───── */}
      <section className="container-x relative -mt-8 md:-mt-14">
        <div className="card p-4 md:p-8">
          <div className="flex items-end justify-between gap-4 px-1">
            <div><p className="eyebrow">Our services</p><h2 className="mt-1 text-xl font-extrabold text-brand-900 md:text-3xl">Care for every fabric</h2></div>
            <Link href="/services" className="hidden text-sm font-semibold text-brand-600 sm:block">{t.viewAll} →</Link>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2.5 md:grid-cols-6 md:gap-4">
            {cats.filter((c) => c.services.length).map((c) => (
              <Link key={c.id} href={`/services#${c.slug}`} className="group flex flex-col items-center rounded-2xl border border-slate-100 bg-brand-50/50 p-3 text-center transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-white hover:shadow-lg md:p-5">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-brand-600 shadow-sm ring-1 ring-brand-100 transition group-hover:bg-brand-600 group-hover:text-white md:h-14 md:w-14">
                  <CategoryIcon slug={c.slug} className="h-6 w-6 md:h-7 md:w-7" />
                </span>
                <span className="mt-2.5 text-xs font-bold leading-tight text-brand-900 md:text-sm">{roman && c.nameUr ? c.nameUr : c.name}</span>
                <span className="mt-0.5 text-[11px] text-slate-500">from {rs(c.services[0].price)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section className="container-x py-16 md:py-24">
        <div className="text-center"><p className="eyebrow">{t.howItWorks}</p><h2 className="h-section mt-2">4 simple steps</h2></div>
        <ol className="mt-10 grid gap-4 md:grid-cols-4 md:gap-6">
          {t.steps.map((st, i) => {
            const Icon = stepIcons[i];
            return (
              <li key={st.t} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
                {i < 3 && <span className="absolute left-7 top-16 h-[calc(100%-3rem)] w-px bg-brand-200 md:left-[calc(50%+40px)] md:top-8 md:h-px md:w-[calc(100%-80px)] md:border-t md:border-dashed md:border-brand-200 md:bg-transparent" aria-hidden />}
                <span className="relative grid h-14 w-14 flex-none place-items-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/30 ring-8 ring-brand-50 md:h-16 md:w-16">
                  <Icon className="h-6 w-6 md:h-7 md:w-7" />
                  <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-sun-400 text-[11px] font-bold text-brand-900">{i + 1}</span>
                </span>
                <div className="pb-4 md:mt-4">
                  <h3 className="font-bold text-brand-900">{st.t}</h3>
                  <p className="mt-1 text-sm text-slate-600">{st.d}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ───── STATS BAND ───── */}
      <section className="container-x">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-brand-500 md:grid-cols-4">
          {[["24–48h", "Standard turnaround"], [String(AREA_PAGES.length), "Karachi areas covered"], [rs(cats.flatMap((c) => c.services).reduce((m, x) => Math.min(m, x.price), 99999)), "Starting price"], ["7 days", "Pickups every day"]].map(([v, l]) => (
            <div key={l} className="bg-brand-600 p-5 text-center text-white md:p-7">
              <p className="text-2xl font-extrabold md:text-4xl">{v}</p><p className="mt-1 text-xs text-brand-100 md:text-sm">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── RATE CARD ───── */}
      <section className="container-x py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:items-center">
          <div>
            <p className="eyebrow">Transparent pricing</p>
            <h2 className="h-section mt-2">Laundry rate card</h2>
            <p className="mt-3 text-slate-600">No hidden charges. Per-kg items are weighed at pickup and you pay the actual weight.</p>
            <Link href="/services" className="btn-primary mt-6">See all rates</Link>
          </div>
          <div className="card overflow-hidden">
            <div className="grid grid-cols-[1fr_auto] bg-brand-600 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white"><span>Item</span><span>Rate</span></div>
            <ul className="divide-y divide-slate-100">
              {rateCard.map((r) => (
                <li key={r.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-3.5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600"><CategoryIcon slug={r.category.slug} className="h-4 w-4" /></span>
                  <span><span className="block text-sm font-semibold text-brand-900">{roman && r.nameUr ? r.nameUr : r.name}</span><span className="text-xs text-slate-500">{r.category.name}</span></span>
                  <span className="text-right"><span className="font-extrabold text-brand-600">{rs(r.price)}</span><span className="block text-[11px] text-slate-500">{UNIT_LABEL[r.unit]}</span></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───── SUNDAY PROMO BAND ───── */}
      <section className="container-x">
        <div className="bg-navy-glow relative overflow-hidden rounded-[32px] p-7 text-white md:flex md:items-center md:justify-between md:p-12">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border-[28px] border-white/5" aria-hidden />
          <div className="relative">
            <p className="eyebrow !text-glow">Har Itwar · Every Sunday</p>
            <h2 className="mt-2 text-2xl font-extrabold md:text-4xl">Free pickup & delivery — any order size</h2>
            <p className="mt-2 max-w-xl text-brand-100">Pickup and delivery both on Sunday. On other days it&apos;s free above {rs(s.freeDeliveryThreshold)}, otherwise {rs(s.deliveryFee)}.</p>
          </div>
          <Link href="/services" className="btn-sun relative mt-6 md:mt-0">Book Sunday pickup</Link>
        </div>
      </section>

      {/* ───── CLIENTS ───── */}
      {logos.length > 0 && (
        <section className="container-x pt-16">
          <p className="text-center text-xs font-bold uppercase tracking-[.2em] text-slate-400">{t.clients}</p>
          <div className="mt-6 flex snap-x gap-10 overflow-x-auto pb-2 md:flex-wrap md:justify-center">
            {logos.map((l) => (
              <div key={l.id} className="relative h-12 w-32 flex-none snap-center opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0">
                <Image src={l.imageUrl} alt={l.name} fill sizes="128px" className="object-contain" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ───── REVIEWS ───── */}
      {reviews.length > 0 && (
        <section className="container-x py-16 md:py-24">
          <div className="text-center"><p className="eyebrow">{t.reviews}</p><h2 className="h-section mt-2">Loved across Karachi</h2></div>
          <div className="-mx-4 mt-8 flex snap-x gap-4 overflow-x-auto px-4 pb-3 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
            {reviews.map((r) => (
              <figure key={r.id} className="card relative w-[82%] flex-none snap-center p-6 md:w-auto">
                <span className="absolute right-5 top-3 text-6xl font-serif leading-none text-brand-100" aria-hidden>”</span>
                <div className="flex text-sun-400">{Array.from({ length: r.rating }).map((_, i) => <IconStar key={i} className="h-4 w-4" />)}</div>
                <blockquote className="mt-3 text-sm leading-relaxed text-slate-700">{r.text}</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">{r.name[0]}</span>
                  <span className="text-sm"><b className="block text-brand-900">{r.name}</b>{r.area && <span className="text-slate-500">{r.area}</span>}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ───── AREAS + FAQ ───── */}
      <section className="container-x grid gap-10 pb-8 md:grid-cols-2">
        <div>
          <p className="eyebrow">Coverage</p>
          <h2 className="h-section mt-2">{t.areas}</h2>
          <ul className="mt-6 grid grid-cols-2 gap-2.5">
            {AREA_PAGES.map((a) => (
              <li key={a.path}>
                <Link href={`/${a.path}`} className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white p-3.5 text-sm font-semibold text-brand-900 transition hover:border-brand-500 hover:shadow-md">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-50"><IconPin className="h-4 w-4 text-brand-600" /></span>{a.name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-slate-500">More of Karachi soon. Not listed? <a href={wa} className="font-semibold text-brand-600">WhatsApp us</a>.</p>
        </div>
        <div>
          <p className="eyebrow">Help</p>
          <h2 className="h-section mt-2">{t.faq}</h2>
          <div className="mt-6"><FaqList items={faqs} /></div>
        </div>
      </section>
    </>
  );
}
