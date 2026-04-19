import { Section } from "./primitives";

export type Stat = { value: string; label: string; description?: string };

type StatsProps = {
  title?: string;
  subtitle?: string;
  items: Stat[];
  tone?: "default" | "muted";
};

export function Stats({ title, subtitle, items, tone = "default" }: StatsProps) {
  return (
    <Section tone={tone}>
      {(title || subtitle) && (
        <div className="mb-10 max-w-2xl">
          {title && <h2 className="text-3xl sm:text-4xl">{title}</h2>}
          {subtitle && <p className="mt-3 text-muted">{subtitle}</p>}
        </div>
      )}
      <dl
        className={`grid gap-8 ${items.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-" + Math.min(items.length, 4)}`}
      >
        {items.map((s, i) => (
          <div key={i}>
            <dt className="text-sm text-muted">{s.label}</dt>
            <dd className="mt-2 text-4xl font-semibold tracking-tight">
              {s.value}
            </dd>
            {s.description && (
              <p className="mt-2 text-sm text-muted">{s.description}</p>
            )}
          </div>
        ))}
      </dl>
    </Section>
  );
}
