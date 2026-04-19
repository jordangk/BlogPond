import Link from "next/link";
import { site } from "@/lib/site";
import { getAllTags } from "@/lib/posts";

export async function SiteHeader() {
  const tags = await getAllTags();
  const topTags = tags.slice(0, 6);
  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-[color:var(--background)]/90 backdrop-blur dark:border-neutral-800">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {site.name}
        </Link>
        <div className="flex items-center gap-5 text-sm text-neutral-600 dark:text-neutral-400">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <Link href="/categories" className="hover:text-foreground">Categories</Link>
          <Link href="/schedule" className="hover:text-foreground">Upcoming</Link>
          <Link href="/about" className="hover:text-foreground">About</Link>
          <Link href="/rss.xml" className="hover:text-foreground" aria-label="RSS feed">RSS</Link>
        </div>
      </nav>
      {topTags.length > 0 && (
        <div className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950/60">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-6 py-2 text-xs text-neutral-500">
            <span className="uppercase tracking-wide">Browse:</span>
            {topTags.map((t) => (
              <Link
                key={t.id}
                href={`/tags/${t.slug}`}
                className="rounded-full border border-neutral-300 px-2.5 py-0.5 hover:bg-white dark:border-neutral-700 dark:hover:bg-neutral-900"
              >
                {t.name}
              </Link>
            ))}
            <Link
              href="/categories"
              className="ml-auto hover:underline"
            >
              All →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
