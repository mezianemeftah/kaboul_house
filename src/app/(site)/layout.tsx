import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { whatsappUrl } from "@/lib/whatsapp";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SETTINGS_QUERY } from "@/sanity/queries";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await sanityFetch({ query: SETTINGS_QUERY, tags: ["settings"] });
  return (
    <>
      <SmoothScrollProvider />
      <SiteHeader whatsappHref={whatsappUrl(settings?.whatsapp)} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
    </>
  );
}
