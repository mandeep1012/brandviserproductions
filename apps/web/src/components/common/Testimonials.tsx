import type { Testimonial } from '@brandviserproductions/contracts';

/** Three cards on desktop; on mobile a swipeable row with scroll snapping. */
export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;
  return (
    <ul
      aria-label="Client testimonials"
      className="-mr-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pr-4 pb-2 md:mr-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pr-0"
    >
      {testimonials.map((t) => (
        <li key={t.id} className="w-[85%] flex-none snap-start md:w-auto">
          <figure className="flex h-full flex-col gap-4 rounded-md border border-rule bg-card p-6 md:gap-6 md:p-8">
            <blockquote className="min-h-28">{t.quote}</blockquote>
            <figcaption className="mt-auto">
              <p className="font-semibold">{t.name}</p>
              <p className="text-small text-slate">
                {t.role}, {t.company}
              </p>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
