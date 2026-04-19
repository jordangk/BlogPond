import { Section, Button } from "./primitives";

export type PricingTier = {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
};

type PricingProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  tiers: PricingTier[];
};

export function Pricing({ eyebrow, title, subtitle, tiers }: PricingProps) {
  return (
    <Section>
      <div className="mx-auto mb-12 max-w-2xl text-center">
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
            {eyebrow}
          </p>
        )}
        {title && <h2 className="text-3xl sm:text-4xl">{title}</h2>}
        {subtitle && <p className="mt-3 text-muted">{subtitle}</p>}
      </div>
      <div
        className={`grid gap-6 ${
          tiers.length === 2
            ? "md:grid-cols-2"
            : "md:grid-cols-2 lg:grid-cols-" + Math.min(tiers.length, 4)
        }`}
      >
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`flex flex-col rounded-[var(--radius)] border p-6 ${
              t.featured
                ? "border-accent bg-card shadow-lg"
                : "border-border bg-card"
            }`}
          >
            <div className="text-sm font-semibold uppercase tracking-wide text-muted">
              {t.name}
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-semibold">{t.price}</span>
              {t.period && (
                <span className="text-sm text-muted">/ {t.period}</span>
              )}
            </div>
            {t.description && (
              <p className="mt-3 text-sm text-muted">{t.description}</p>
            )}
            <ul className="mt-6 space-y-2 text-sm">
              {t.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span aria-hidden>✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6">
              <Button
                href={t.cta.href}
                variant={t.featured ? "primary" : "secondary"}
              >
                {t.cta.label}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
