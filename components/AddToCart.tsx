"use client";
import { useState } from "react";
import { useCart, type CartItem } from "./CartProvider";

export function AddToCart({ item, label, addedLabel }: { item: Omit<CartItem, "quantity">; label: string; addedLabel: string }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  return (
    <button
      className={done ? "btn bg-emerald-600 text-white" : "btn-primary"}
      onClick={() => { add(item, 1); setDone(true); setTimeout(() => setDone(false), 1200); }}
    >
      {done ? `✓ ${addedLabel}` : label}
    </button>
  );
}
