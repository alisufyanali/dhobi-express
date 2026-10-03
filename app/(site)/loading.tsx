import { LoadingLabel, Sk } from "@/components/Skeleton";

/** Default for content pages: title band + paragraphs. */
export default function PageLoading() {
  return (
    <div>
      <LoadingLabel />
      <div className="border-b border-brand-100 bg-brand-50">
        <div className="container-x max-w-3xl py-8 md:py-12"><Sk className="h-8 w-3/4 bg-brand-100" /><Sk className="mt-3 h-4 w-full bg-brand-100" /><Sk className="mt-2 h-4 w-2/3 bg-brand-100" /></div>
      </div>
      <div className="container-x max-w-3xl space-y-3 pt-8">
        <Sk className="h-5 w-1/3" />
        {[0, 1, 2, 3].map((i) => <Sk key={i} className="h-3.5" />)}
        <Sk className="mt-6 h-5 w-1/4" />
        {[0, 1, 2].map((i) => <Sk key={i} className="h-3.5" />)}
      </div>
    </div>
  );
}
