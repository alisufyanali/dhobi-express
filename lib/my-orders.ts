/** Orders placed from this phone, kept in the browser so customers can see them without an account. */
export type SavedOrder = { code: string; phone: string };
const KEY = "my-orders";

export function readSavedOrders(): SavedOrder[] {
  try {
    const list: SavedOrder[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    const last: SavedOrder | null = JSON.parse(localStorage.getItem("last-order") ?? "null");
    if (last?.code && !list.some((o) => o.code === last.code)) list.unshift(last);
    return list.filter((o) => o?.code && o?.phone).slice(0, 30);
  } catch { return []; }
}

export function saveOrder(o: SavedOrder) {
  try {
    const list = readSavedOrders().filter((x) => x.code !== o.code);
    localStorage.setItem(KEY, JSON.stringify([o, ...list].slice(0, 30)));
    localStorage.setItem("last-order", JSON.stringify(o));
  } catch {}
}
