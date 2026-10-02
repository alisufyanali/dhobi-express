import { cookies } from "next/headers";
import { dict, type Lang } from "./dict";

export async function getLang(): Promise<Lang> {
  const c = (await cookies()).get("lang")?.value;
  return c === "ru" ? "ru" : "en";
}

export async function getDict() {
  return dict[await getLang()];
}
