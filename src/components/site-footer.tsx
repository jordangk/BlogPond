import Link from "next/link";
import { site } from "@/lib/site";
import { theme } from "@/theme.config";
import { siteConfig } from "@/site.config";

export function SiteFooter() {
  const { features, layout } = theme;
  if (features.footerVariant === "minimal") {
    return (
      <footer className="mt-16 border-t border-border py-8 text-center text-sm text-muted">
        {siteConfig.copyright}
      </footer>
    );
  }
  return (
    <footer className="mt-16 border-t border-border bg-muted-surface">
      <div
        className={`mx-auto grid ${layout.maxWidthClass} gap-8 px-6 py-10 sm:grid-cols-${Math.min(siteConfig.footerColumns.length + 1, 4)}`}
      >
        <div>
          <div className="font-semibold">{siteConfig.logo.text}</div>
          <p className="mt-2 text-sm text-muted">{site.description}</p>
          {siteConfig.social.length > 0 && (
            <ul className="mt-4 flex gap-3 text-sm">
              {siteConfig.social.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="hover:underline">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        {siteConfig.footerColumns.map((col) => (
          <div key={col.title}>
            <div className="text-sm font-semibold">{col.title}</div>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-6 py-4 text-center text-xs text-muted">
        {siteConfig.copyright}
      </div>
    </footer>
  );
}
