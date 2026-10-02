import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyActions } from "@/components/StickyActions";
import { getDict, getLang } from "@/lib/i18n";
import { getSettings } from "@/lib/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [t, lang, s] = await Promise.all([getDict(), getLang(), getSettings()]);
  return (
    <CartProvider>
      <Header t={t} lang={lang} phone={s.phone} />
      <main>{children}</main>
      <Footer s={s} />
      <StickyActions whatsapp={s.whatsappNumber} orderLabel={t.orderNow} waLabel={t.whatsapp} />
    </CartProvider>
  );
}
