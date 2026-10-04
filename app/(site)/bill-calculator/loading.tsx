import { LoadingLabel, Sk, SkRow } from "@/components/Skeleton";

export default function ServicesLoading() {
  return (
    <div className="container-x pb-10 md:mx-auto md:max-w-3xl md:py-10">
      <LoadingLabel />
      <Sk className="mt-4 h-12 w-full rounded-2xl md:mt-6" />
      <Sk className="mt-5 h-5 w-20" />
      <div className="mt-3 flex gap-3 overflow-hidden">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="w-[84px] flex-none rounded-2xl bg-white p-1.5 ring-1 ring-slate-200">
            <Sk className="aspect-square w-full" /><Sk className="mt-1.5 h-5 w-full rounded-lg" />
          </div>
        ))}
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
        <div className="border-b border-slate-100 px-4 py-3"><Sk className="h-5 w-32" /></div>
        <div className="divide-y divide-slate-100">{[0, 1, 2, 3, 4, 5].map((i) => <SkRow key={i} />)}</div>
      </div>
    </div>
  );
}
