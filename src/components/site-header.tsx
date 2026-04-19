import Link from "next/link";
import { getAllTags } from "@/lib/posts";
import { theme } from "@/theme.config";
import { siteConfig, type NavItem } from "@/site.config";
import { prisma } from "@/lib/prisma";

export async function SiteHeader() {
  const { features, layout } = theme;

  const [tags, navPages] = await Promise.all([
    features.showTagStrip ? getAllTags() : Promise.resolve([]),
    prisma.page.findMany({
      where: { showInNav: true, status: "published" },
      orderBy: { navOrder: "asc" },
      select: { slug: true, title: true },
    }),
  ]);

  const nav: NavItem[] = [
    ...siteConfig.nav,
    ...navPages.map((p) => ({ label: p.title, href: `/${p.slug}` })),
  ];
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
          {siteConfig.logo.text}
        </Link>
        <div className="flex items-center gap-5 text-sm text-muted">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-foreground"
              {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              {item.label}
            </Link>
          ))}
          {siteConfig.primaryCTA && (
            <Link
              href={siteConfig.primaryCTA.href}
              className="rounded-[var(--radius)] bg-accent px-3 py-1.5 text-accent-foreground hover:opacity-90"
            >
              {siteConfig.primaryCTA.label}
            </Link>
          )}
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
