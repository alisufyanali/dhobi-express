"use client";
export function PrintButton() {
  return <button onClick={() => window.print()} className="btn-ghost w-full">Print invoice / receipt</button>;
}
