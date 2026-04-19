import { Section, Button } from "./primitives";

type CTAProps = {
  title: string;
  subtitle?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  tone?: "default" | "muted" | "accent";
};

export function CTA({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  tone = "muted",
}: CTAProps) {
  return (
    <Section tone={tone}>
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl">{title}</h2>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-muted">{subtitle}</p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href={primaryCta.href}>{primaryCta.label}</Button>
          {secondaryCta && (
            <Button href={secondaryCta.href} variant="secondary">
              {secondaryCta.label}
            </Button>
          )}
        </div>
      </div>
    </Section>
  );
}
