export function FaqList({ items }: { items: { id: string; question: string; answer: string }[] }) {
  return (
    <div className="card divide-y divide-slate-100 overflow-hidden">
      {items.map((f) => (
        <details key={f.id} className="group p-4 md:p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-slate-900">
            {f.question}
            <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-brand-50 text-lg text-brand-600 transition group-open:rotate-45 group-open:bg-brand-600 group-open:text-white">+</span>
          </summary>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
