import { Section } from "./primitives";

export type GalleryItem = { src: string; alt?: string; caption?: string };

type GalleryProps = {
  title?: string;
  items: GalleryItem[];
  columns?: 2 | 3 | 4;
};

export function Gallery({ title, items, columns = 3 }: GalleryProps) {
  const grid = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns];
  return (
    <Section>
      {title && <h2 className="mb-8 text-3xl sm:text-4xl">{title}</h2>}
      <ul className={`grid gap-4 ${grid}`}>
        {items.map((g, i) => (
          <li key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={g.src}
              alt={g.alt ?? ""}
              className="w-full rounded-[var(--radius)] border border-border object-cover"
            />
            {g.caption && (
              <p className="mt-2 text-xs text-muted">{g.caption}</p>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}
