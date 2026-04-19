import type { ReactNode } from "react";
import { Section, Button } from "./primitives";

type SplitProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  reverse?: boolean;
  tone?: "default" | "muted";
  cta?: { label: string; href: string };
  children?: ReactNode;
};

export function Split({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt = "",
  reverse = false,
  tone = "default",
  cta,
  children,
}: SplitProps) {
  return (
    <Section tone={tone}>
      <div
        className={`grid gap-10 lg:grid-cols-2 lg:items-center ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
      >
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={imageAlt}
            className="w-full rounded-[var(--radius)] border border-border"
          />
        )}
        <div>
          {eyebrow && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl sm:text-4xl">{title}</h2>
          {subtitle && <p className="mt-4 text-muted">{subtitle}</p>}
          {children && <div className="mt-6 text-foreground">{children}</div>}
          {cta && (
            <div className="mt-6">
              <Button href={cta.href}>{cta.label}</Button>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
