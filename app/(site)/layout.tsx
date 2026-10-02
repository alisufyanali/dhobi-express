import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyActions } from "@/components/StickyActions";
import { getDict, getLang } from "@/lib/i18n";
import { getSettings } from "@/lib/settings";
import { IS_DEMO } from "@/lib/demo";
import { ChatBot } from "@/components/ChatBot";
import { getCatalog } from "@/lib/data";
import { AREA_PAGES } from "@/lib/areas";
import { UNIT_LABEL } from "@/lib/site";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [t, lang, s, catalog] = await Promise.all([getDict(), getLang(), getSettings(), getCatalog()]);
  const toPrice = (x: { name: string; price: number; unit: "PER_PIECE" | "PER_KG" }) => ({ name: x.name, price: x.price, unit: UNIT_LABEL[x.unit] });
  const chatInfo = {
    whatsapp: s.whatsappNumber, phone: s.phone, threshold: s.freeDeliveryThreshold, fee: s.deliveryFee, slots: s.timeSlots,
    areas: AREA_PAGES.map((a) => a.name),
    prices: catalog.filter((c) => c.slug !== "packages").flatMap((c) => c.services).map(toPrice),
    packages: (catalog.find((c) => c.slug === "packages")?.services ?? []).map(toPrice),
  };
  return (
    <CartProvider>
      {IS_DEMO && (
        <div className="bg-brand-100 px-4 py-2 text-center text-xs font-medium text-brand-900">
          Demo preview — orders are not saved yet. Book on WhatsApp.
        </div>
      )}
      <Header t={t} lang={lang} phone={s.phone} whatsapp={s.whatsappNumber} />
      <main>{children}</main>
      <Footer s={s} />
      <ChatBot info={chatInfo} />
      <StickyActions orderLabel={t.orderNow} />
    </CartProvider>
  );
}
