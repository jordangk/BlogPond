import type { ReactNode } from "react";
import { Section, Button } from "./primitives";

type HeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  image?: string;
  imageAlt?: string;
  align?: "left" | "center";
  tone?: "default" | "muted" | "accent";
  children?: ReactNode;
};

export function Hero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  image,
  imageAlt = "",
  align = "left",
  tone = "default",
  children,
}: HeroProps) {
  const isCenter = align === "center";
  return (
    <Section tone={tone} className={isCenter ? "text-center" : ""}>
      <div
        className={`grid gap-10 ${image ? "lg:grid-cols-2 lg:items-center" : ""}`}
      >
        <div>
          {eyebrow && (
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
              {eyebrow}
            </p>
          )}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl">{title}</h1>
          {subtitle && (
            <p className="mt-5 max-w-2xl text-lg text-muted">{subtitle}</p>
          )}
          {(primaryCta || secondaryCta || children) && (
            <div
              className={`mt-8 flex flex-wrap gap-3 ${isCenter ? "justify-center" : ""}`}
            >
              {primaryCta && (
                <Button href={primaryCta.href}>{primaryCta.label}</Button>
              )}
              {secondaryCta && (
                <Button href={secondaryCta.href} variant="secondary">
                  {secondaryCta.label}
                </Button>
              )}
              {children}
            </div>
          )}
        </div>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={imageAlt}
            className="w-full rounded-[var(--radius)] border border-border"
          />
        )}
      </div>
    </Section>
  );
}
