import { Section } from "./primitives";

export type Testimonial = {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
};

type TestimonialsProps = {
  eyebrow?: string;
  title?: string;
  items: Testimonial[];
  tone?: "default" | "muted";
};

export function Testimonials({
  eyebrow,
  title,
  items,
  tone = "muted",
}: TestimonialsProps) {
  return (
    <Section tone={tone}>
      {(eyebrow || title) && (
        <div className="mb-10 max-w-2xl">
          {eyebrow && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
              {eyebrow}
            </p>
          )}
          {title && <h2 className="text-3xl sm:text-4xl">{title}</h2>}
        </div>
      )}
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <li
            key={i}
            className="rounded-[var(--radius)] border border-border bg-background p-6"
          >
            <p className="text-foreground">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-4 flex items-center gap-3">
              {t.avatar && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.avatar}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
              )}
              <div className="text-sm">
                <div className="font-medium">{t.author}</div>
                {t.role && <div className="text-muted">{t.role}</div>}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
