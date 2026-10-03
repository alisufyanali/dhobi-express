import Link from "next/link";

/** Shared layout for About, Why choose us and policy pages: light-blue title band + readable text column. */
export function InfoPage({ title, intro, updated, children, cta = true }: {
  title: string; intro?: string; updated?: string; children: React.ReactNode; cta?: boolean;
}) {
  return (
    <div className="pb-10">
      <section className="border-b border-brand-100 bg-brand-50">
        <div className="container-x max-w-3xl py-8 md:py-12">
          <h1 className="text-2xl font-bold tracking-tight text-brand-900 md:text-4xl">{title}</h1>
          {intro && <p className="mt-3 text-slate-600 md:text-lg">{intro}</p>}
          {updated && <p className="mt-3 text-xs text-slate-500">Last updated: {updated}</p>}
        </div>
      </section>
      <div className="container-x max-w-3xl pt-6 md:pt-10">
        <div className="prose-de">{children}</div>
        {cta && (
          <div className="mt-10 flex flex-col gap-3 rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="font-semibold text-brand-900">Ready for fresh clothes?</p><p className="text-sm text-slate-600">Free pickup &amp; delivery across Karachi.</p></div>
            <Link href="/services" className="btn-primary">Book a pickup</Link>
          </div>
        )}
      </div>
    </div>
  );
}
