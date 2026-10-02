import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyActions } from "@/components/StickyActions";
import { getDict, getLang } from "@/lib/i18n";
import { getSettings } from "@/lib/settings";
import { IS_DEMO } from "@/lib/demo";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [t, lang, s] = await Promise.all([getDict(), getLang(), getSettings()]);
  return (
    <CartProvider>
      {IS_DEMO && (
        <div className="bg-brand-100 px-4 py-2 text-center text-xs font-medium text-brand-900">
          Demo preview — orders are not saved yet. Book on WhatsApp.
        </div>
      )}
      <Header t={t} lang={lang} phone={s.phone} />
      <main>{children}</main>
      <Footer s={s} />
      <StickyActions whatsapp={s.whatsappNumber} orderLabel={t.orderNow} waLabel={t.whatsapp} />
    </CartProvider>
  );
}
