import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { imageUrl } from "@/sanity/lib/image";
import type { HOME_QUERY_RESULT } from "@/sanity/types";

type Product = NonNullable<HOME_QUERY_RESULT>["featuredProducts"][number];

type Item = {
  key: string;
  title: string;
  categoryTitle: string | null;
  slug: string | null;
  src: string | null;
  alt: string;
};

const FALLBACK: Item[] = [
  { key: "tapis-khal", title: "Tapis Khal Mohammadi", categoryTitle: "Tapis" },
  { key: "toshak", title: "Toshak brodé main", categoryTitle: "Décoration" },
  { key: "plateau", title: "Plateau en cuivre martelé", categoryTitle: "Décoration" },
  { key: "pistaches", title: "Pistaches de Kandahar", categoryTitle: "Fruits secs" },
  { key: "coussin", title: "Coussin suzani", categoryTitle: "Décoration" },
].map((i) => ({ ...i, slug: null, src: null, alt: "" }));

/** Dégradés du placeholder — variés pour que les 5 cartes ne soient pas jumelles. */
const GRADIENTS = [
  "bg-gradient-to-br from-grenat to-petrole",
  "bg-gradient-to-tr from-petrole to-grenat-vif",
  "bg-gradient-to-b from-grenat-vif to-grenat-profond",
  "bg-gradient-to-bl from-petrole-clair to-petrole",
  "bg-gradient-to-tl from-grenat-profond to-petrole",
];

/** Placement bento (md+) : la première pièce occupe un carré 2×2, les autres 1×1. */
const PLACEMENT = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1",
  "md:col-span-1",
  "md:col-span-1",
  "md:col-span-1",
];

function toItems(products: Product[] | null | undefined): Item[] {
  const items: Item[] = [];
  for (const p of products ?? []) {
    if (!p.title) continue;
    const cover = p.images?.[0] ?? null;
    items.push({
      key: p.slug ?? p.title,
      title: p.title,
      categoryTitle: p.categoryTitle,
      slug: p.slug,
      src: imageUrl(cover, 900),
      alt: cover?.alt ?? "",
    });
  }
  return items.length > 0 ? items : FALLBACK;
}

function Card({ item, index }: { item: Item; index: number }) {
  const content = (
    <>
      {item.src ? (
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          style={{ transitionTimingFunction: "var(--ease-signature)" }}
        />
      ) : (
        <div
          className={`absolute inset-0 transition-transform duration-500 group-hover:scale-[1.04] ${
            GRADIENTS[index % GRADIENTS.length]
          }`}
          style={{ transitionTimingFunction: "var(--ease-signature)" }}
          aria-hidden
        />
      )}
      <div
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-encre/75 to-transparent"
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 p-sp-4">
        <p className="font-bonny text-2xl font-medium leading-tight text-white md:text-3xl">
          {item.title}
        </p>
        {item.categoryTitle && (
          <p className="mt-sp-1 text-sm font-light text-blush">{item.categoryTitle}</p>
        )}
      </div>
    </>
  );

  const shell = `group relative overflow-hidden rounded-panel ${PLACEMENT[index] ?? "md:col-span-1"} ${
    index === 0 ? "col-span-2 aspect-[4/3] md:aspect-auto" : "aspect-square md:aspect-auto"
  }`;

  if (item.slug) {
    return (
      <Link href={`/produit/${item.slug}`} className={shell}>
        {content}
      </Link>
    );
  }
  return <div className={shell}>{content}</div>;
}

export function FeaturedBento({ products }: { products: Product[] | null | undefined }) {
  const items = toItems(products);

  return (
    <section className="bg-blush-2 px-sp-4 py-sp-6 md:px-sp-5 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-grenat">
          <SectionLabel>Nos coups de cœur</SectionLabel>
        </div>
        <h2 className="mt-sp-3 max-w-2xl font-bonny text-4xl font-bold leading-[1.05] text-encre md:text-5xl">
          Cinq pièces qui font la maison
        </h2>

        <div className="mt-sp-5 grid grid-cols-2 gap-sp-3 md:mt-sp-6 md:auto-rows-[15rem] md:grid-cols-4 lg:auto-rows-[17rem]">
          {items.map((item, index) => (
            <Card key={item.key} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
