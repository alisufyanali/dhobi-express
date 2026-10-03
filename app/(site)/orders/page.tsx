import type { Metadata } from "next";
import Link from "next/link";
import { OrdersList } from "./OrdersList";

export const metadata: Metadata = { title: "My orders", robots: { index: false } };

export default function OrdersPage() {
  return (
    <div className="container-x max-w-2xl py-5 md:py-12">
      <div className="mb-4 hidden items-end justify-between md:flex">
        <h1 className="text-3xl font-bold text-brand-900">My orders</h1>
        <Link href="/track" className="text-sm font-semibold text-brand-600">Find an order by ID →</Link>
      </div>
      <h1 className="sr-only md:hidden">My orders</h1>
      <OrdersList />
      <p className="mt-6 text-center text-xs text-slate-500">
        Ordered from another phone? <Link href="/track" className="font-semibold text-brand-600">Track with order ID and phone</Link>
      </p>
    </div>
  );
}
