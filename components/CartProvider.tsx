"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = { serviceId: string; name: string; price: number; unit: "PER_PIECE" | "PER_KG"; quantity: number };

type Ctx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  setQty: (serviceId: string, qty: number) => void;
  remove: (serviceId: string) => void;
  clear: () => void;
  ready: boolean;
};

const CartContext = createContext<Ctx | null>(null);
const KEY = "dhobi-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items, ready]);

  const value = useMemo<Ctx>(() => ({
    items,
    ready,
    count: items.reduce((n, i) => n + (i.unit === "PER_KG" ? 1 : i.quantity), 0),
    subtotal: Math.round(items.reduce((s, i) => s + i.price * i.quantity, 0)),
    add: (item, qty = 1) =>
      setItems((prev) => {
        const found = prev.find((p) => p.serviceId === item.serviceId);
        if (found) return prev.map((p) => (p.serviceId === item.serviceId ? { ...p, quantity: p.quantity + qty } : p));
        return [...prev, { ...item, quantity: qty }];
      }),
    setQty: (id, qty) =>
      setItems((prev) => (qty <= 0 ? prev.filter((p) => p.serviceId !== id) : prev.map((p) => (p.serviceId === id ? { ...p, quantity: qty } : p)))),
    remove: (id) => setItems((prev) => prev.filter((p) => p.serviceId !== id)),
    clear: () => setItems([]),
  }), [items, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
