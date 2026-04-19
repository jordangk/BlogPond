import Link from "next/link";
import { site } from "@/lib/site";
import { theme } from "@/theme.config";

export function SiteFooter() {
  const { features, layout } = theme;
  if (features.footerVariant === "minimal") {
    return (
      <footer className="mt-16 border-t border-border py-8 text-center text-sm text-muted">
        © {new Date().getFullYear()} {site.name}. Written with AI.
      </footer>
    );
  }
  return (
    <footer className="mt-16 border-t border-border bg-muted-surface">
      <div
        className={`mx-auto grid ${layout.maxWidthClass} gap-8 px-6 py-10 sm:grid-cols-3`}
      >
        <div>
          <div className="font-semibold">{site.name}</div>
          <p className="mt-2 text-sm text-muted">{site.description}</p>
        </div>
        <div>
          <div className="text-sm font-semibold">Explore</div>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/categories" className="hover:underline">Categories</Link></li>
            <li><Link href="/about" className="hover:underline">About</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Subscribe</div>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            <li><Link href="/rss.xml" className="hover:underline">RSS feed</Link></li>
            <li><Link href="/sitemap.xml" className="hover:underline">Sitemap</Link></li>
            <li><Link href="/llms.txt" className="hover:underline">llms.txt</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-6 py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {site.name}. Written with AI.
      </div>
    </footer>
  );
}
