import type { ReactNode } from "react";
import { Section } from "./primitives";

export type Feature = {
  title: string;
  description: string;
  icon?: string; // emoji or short text; AI-friendly
};

type FeaturesProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items: Feature[];
  columns?: 2 | 3 | 4;
  tone?: "default" | "muted";
  children?: ReactNode;
};

export function Features({
  eyebrow,
  title,
  subtitle,
  items,
  columns = 3,
  tone = "default",
  children,
}: FeaturesProps) {
  const grid = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <Section tone={tone}>
      {(eyebrow || title || subtitle) && (
        <div className="mb-12 max-w-2xl">
          {eyebrow && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
              {eyebrow}
            </p>
          )}
          {title && <h2 className="text-3xl sm:text-4xl">{title}</h2>}
          {subtitle && <p className="mt-3 text-muted">{subtitle}</p>}
        </div>
      )}
      <ul className={`grid gap-8 ${grid}`}>
        {items.map((f, i) => (
          <li key={i}>
            {f.icon && <div className="mb-3 text-2xl">{f.icon}</div>}
            <div className="text-lg font-medium">{f.title}</div>
            <p className="mt-1 text-sm text-muted">{f.description}</p>
          </li>
        ))}
      </ul>
      {children && <div className="mt-10">{children}</div>}
    </Section>
  );
}
