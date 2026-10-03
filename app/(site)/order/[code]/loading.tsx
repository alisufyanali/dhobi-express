import { LoadingLabel, Sk } from "@/components/Skeleton";

export default function OrderLoading() {
  return (
    <div className="container-x max-w-3xl py-10">
      <LoadingLabel />
      <Sk className="h-4 w-28" /><Sk className="mt-2 h-8 w-56" /><Sk className="mt-3 h-4 w-72" />
      <div className="mt-8 flex justify-between">{[0, 1, 2, 3, 4, 5].map((i) => <Sk key={i} className="h-8 w-8 rounded-full" />)}</div>
      <div className="card mt-8 space-y-3 p-5">{[0, 1, 2, 3].map((i) => <Sk key={i} className="h-4" />)}</div>
    </div>
  );
}
