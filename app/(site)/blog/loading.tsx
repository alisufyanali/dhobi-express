import { LoadingLabel, Sk } from "@/components/Skeleton";

export default function BlogLoading() {
  return (
    <div className="container-x py-8 md:py-14">
      <LoadingLabel />
      <Sk className="h-8 w-56" />
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card overflow-hidden"><Sk className="aspect-[16/9] w-full rounded-none" /><div className="space-y-2 p-5"><Sk className="h-5 w-4/5" /><Sk className="h-3.5" /><Sk className="h-3.5 w-2/3" /></div></div>
        ))}
      </div>
    </div>
  );
}
