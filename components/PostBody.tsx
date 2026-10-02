/** Renders the simple post format: "## Heading", "- bullet" lines and blank-line paragraphs. No HTML is injected. */
export function PostBody({ body }: { body: string }) {
  const blocks = body.trim().split(/\n\s*\n/);
  return (
    <div className="space-y-4 text-[17px] leading-relaxed text-slate-700">
      {blocks.map((b, i) => {
        const lines = b.split("\n").map((l) => l.trim()).filter(Boolean);
        if (lines[0]?.startsWith("## ")) {
          const rest = lines.slice(1);
          return (
            <div key={i} className="space-y-3 pt-4">
              <h2 className="text-xl font-bold text-brand-900">{lines[0].slice(3)}</h2>
              {rest.length > 0 && <Lines lines={rest} />}
            </div>
          );
        }
        return <Lines key={i} lines={lines} />;
      })}
    </div>
  );
}

function Lines({ lines }: { lines: string[] }) {
  if (lines.every((l) => l.startsWith("- "))) {
    return <ul className="list-disc space-y-1.5 pl-5">{lines.map((l, i) => <li key={i}>{l.slice(2)}</li>)}</ul>;
  }
  return <p>{lines.join(" ")}</p>;
}
