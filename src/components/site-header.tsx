import Link from "next/link";
import { site } from "@/lib/site";
import { getAllTags } from "@/lib/posts";
import { theme } from "@/theme.config";

export async function SiteHeader() {
  const { features, layout } = theme;
  const tags = features.showTagStrip ? await getAllTags() : [];
  const topTags = tags.slice(0, 6);
  const headerClass = [
    "border-b border-border",
    features.stickyHeader
      ? "sticky top-0 z-20 bg-background/90 backdrop-blur"
      : "bg-background",
  ].join(" ");

  return (
    <header className={headerClass}>
      <nav
        className={`mx-auto flex ${layout.maxWidthClass} items-center justify-between px-6 py-4`}
      >
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {site.name}
        </Link>
        <div className="flex items-center gap-5 text-sm text-muted">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <Link href="/categories" className="hover:text-foreground">Categories</Link>
          <Link href="/about" className="hover:text-foreground">About</Link>
          <Link href="/rss.xml" className="hover:text-foreground" aria-label="RSS feed">RSS</Link>
        </div>
      </nav>
      {features.showTagStrip && topTags.length > 0 && (
        <div className="border-t border-border bg-muted-surface">
          <div
            className={`mx-auto flex ${layout.maxWidthClass} flex-wrap items-center gap-3 px-6 py-2 text-xs text-muted`}
          >
            <span className="uppercase tracking-wide">Browse:</span>
            {topTags.map((t) => (
              <Link
                key={t.id}
                href={`/tags/${t.slug}`}
                className="rounded-[var(--radius)] border border-border px-2.5 py-0.5 hover:bg-card"
              >
                {t.name}
              </Link>
            ))}
            <Link href="/categories" className="ml-auto hover:underline">
              All →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
