import { SectionLabel } from "@/components/ui/SectionLabel";
import type { HOME_QUERY_RESULT } from "@/sanity/types";

type Review = NonNullable<HOME_QUERY_RESULT>["reviews"][number];

function Stars({ rating }: { rating: number }) {
  const value = Math.max(1, Math.min(5, Math.round(rating)));
  return (
    <p className="text-grenat" aria-label={`Note : ${value} sur 5`}>
      <span aria-hidden>{"★".repeat(value)}</span>
    </p>
  );
}

export function ReviewsSection({
  reviews,
  googleReviewsUrl,
}: {
  reviews: Review[] | null | undefined;
  googleReviewsUrl: string | null | undefined;
}) {
  const list = (reviews ?? []).filter((r) => r.text);

  return (
    <section className="px-sp-4 py-sp-6 md:px-sp-5 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-grenat">
          <SectionLabel>Avis Google</SectionLabel>
        </div>
        <h2 className="mt-sp-3 font-bonny text-4xl font-bold leading-[1.05] text-encre md:text-5xl">
          Ils ont poussé la porte
        </h2>

        {list.length > 0 ? (
          <div className="mt-sp-5 grid gap-sp-3 md:mt-sp-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((review) => (
              <figure key={review._id} className="rounded-panel bg-blush-2 p-sp-4">
                {review.rating != null && <Stars rating={review.rating} />}
                <blockquote className="mt-sp-2 font-light leading-relaxed text-encre">
                  {review.text}
                </blockquote>
                {review.author && (
                  <figcaption className="mt-sp-3 font-normal text-encre-douce">
                    {review.author}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-sp-5 max-w-xl rounded-panel bg-creme p-sp-5 text-center md:mt-sp-6">
            <p className="font-light leading-relaxed text-encre-douce">
              Les avis de nos clients apparaîtront ici très bientôt.
            </p>
            {googleReviewsUrl && (
              <a
                href={googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-sp-3 inline-block text-grenat underline decoration-grenat/40 underline-offset-8 transition-colors hover:decoration-grenat"
              >
                Voir notre fiche Google →
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
