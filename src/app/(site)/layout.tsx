import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader, type NavCategory } from "@/components/layout/SiteHeader";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { FALLBACK_CATEGORIES } from "@/lib/fallback-content";
import { whatsappUrl } from "@/lib/whatsapp";
import { sanityFetch } from "@/sanity/lib/fetch";
import { NAV_CATEGORIES_QUERY, SETTINGS_QUERY } from "@/sanity/queries";

/** Écarte les univers sans slug : ils ne mèneraient nulle part. */
function toNavCategories(
  categories: { title: string | null; slug: string | null }[] | null,
): NavCategory[] {
  const utilisables =
    categories?.flatMap((c) => (c.slug && c.title ? [{ slug: c.slug, title: c.title }] : [])) ?? [];
  return utilisables.length > 0
    ? utilisables
    : FALLBACK_CATEGORIES.map((c) => ({ slug: c.slug, title: c.title }));
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([
    sanityFetch({ query: SETTINGS_QUERY, tags: ["settings"] }),
    sanityFetch({ query: NAV_CATEGORIES_QUERY, tags: ["category"] }),
  ]);

  return (
    <>
      <SmoothScrollProvider />
      <SiteHeader
        whatsappHref={whatsappUrl(settings?.whatsapp)}
        categories={toNavCategories(categories)}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
    </>
  );
}
