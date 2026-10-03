import { LoadingLabel, Sk } from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <div className="container-x pt-4 md:pt-8">
      <LoadingLabel />
      <div className="md:hidden"><Sk className="h-3.5 w-28" /><Sk className="mt-2 h-6 w-64" /><Sk className="mt-3 h-12 w-full rounded-2xl" /></div>
      <Sk className="mt-4 h-44 w-full rounded-2xl md:mt-0 md:h-[380px] md:rounded-3xl" />
      <div className="mt-3 flex gap-2 overflow-hidden">{[0, 1, 2].map((i) => <Sk key={i} className="h-9 w-40 flex-none rounded-full" />)}</div>
      <Sk className="mt-6 h-5 w-24" />
      <div className="mt-3 flex gap-3 overflow-hidden md:grid md:grid-cols-6">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-[84px] flex-none rounded-2xl bg-white p-1.5 ring-1 ring-slate-200 md:w-auto">
            <Sk className="aspect-square w-full" /><Sk className="mt-1.5 h-5 w-full rounded-lg" />
          </div>
        ))}
      </div>
      <Sk className="mt-6 h-64 w-full rounded-2xl" />
    </div>
  );
}
