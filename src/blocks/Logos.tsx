import { Section } from "./primitives";

export type Logo = { name: string; src?: string; href?: string };

type LogosProps = {
  title?: string;
  items: Logo[];
  tone?: "default" | "muted";
};

export function Logos({ title, items, tone = "muted" }: LogosProps) {
  return (
    <Section tone={tone} className="py-12">
      {title && (
        <p className="mb-8 text-center text-sm text-muted">{title}</p>
      )}
      <ul className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
        {items.map((logo, i) => (
          <li key={i} className="text-muted">
            {logo.src ? (
              logo.href ? (
                <a href={logo.href}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className="h-8 w-auto opacity-70 hover:opacity-100"
                  />
                </a>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="h-8 w-auto opacity-70"
                />
              )
            ) : (
              <span className="text-lg font-semibold opacity-70">
                {logo.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}
