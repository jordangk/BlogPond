import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950/60">
      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-10 sm:grid-cols-3">
        <div>
          <div className="font-semibold">{site.name}</div>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            {site.description}
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold">Explore</div>
          <ul className="mt-2 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/categories" className="hover:underline">Categories</Link></li>
            <li><Link href="/schedule" className="hover:underline">Upcoming posts</Link></li>
            <li><Link href="/about" className="hover:underline">About</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Subscribe</div>
          <ul className="mt-2 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
            <li><Link href="/rss.xml" className="hover:underline">RSS feed</Link></li>
            <li><Link href="/sitemap.xml" className="hover:underline">Sitemap</Link></li>
            <li><Link href="/llms.txt" className="hover:underline">llms.txt</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-200 px-6 py-4 text-center text-xs text-neutral-500 dark:border-neutral-800">
        © {new Date().getFullYear()} {site.name}. Written with AI.
      </div>
    </footer>
  );
}
