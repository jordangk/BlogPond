import Link from "next/link";
import { getPublishedPosts, getAllTags, getPostCounts } from "@/lib/posts";
import { readingMinutes } from "@/lib/markdown";
import { site } from "@/lib/site";
import { theme } from "@/theme.config";

export const metadata = {
  title: "Blog",
  description: "Latest posts.",
};

export default async function BlogFeed() {
  const { features, layout } = theme;
  const [posts, tags, counts] = await Promise.all([
    getPublishedPosts(12),
    getAllTags(),
    getPostCounts(),
  ]);

  const [featured, ...rest] = posts;
  const showFeatured = features.showFeaturedCard && featured;
  const showSidebar = features.showSidebarCategories;

  return (
    <main className={`mx-auto ${layout.maxWidthClass} px-6 py-12`}>
      <section className="mb-10 border-b border-border pb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Blog
        </p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Latest posts</h1>
        <p className="mt-4 max-w-2xl text-muted">
          {counts.posts} published {counts.posts === 1 ? "post" : "posts"}
          {counts.tags > 0 && ` · ${counts.tags} categories`}
        </p>
      </section>

      {showFeatured && (
        <section className="mb-12">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
            Latest
          </div>
          <Link
            href={`/posts/${featured.slug}`}
            className="group block rounded-[var(--radius)] border border-border bg-card p-6 transition hover:border-foreground/40"
          >
            <h2 className="text-2xl group-hover:underline sm:text-3xl">
              {featured.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
              <time dateTime={featured.publishedAt?.toISOString()}>
                {featured.publishedAt?.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {features.showReadingTime && (
                <span>· {readingMinutes(featured.content)} min read</span>
              )}
              {featured.tags.length > 0 && (
                <span>· {featured.tags.map((t) => t.name).join(", ")}</span>
              )}
            </div>
            {featured.excerpt && (
              <p className="mt-4 text-foreground/80">{featured.excerpt}</p>
            )}
            <span className="mt-4 inline-block text-sm font-medium">
              Read more →
            </span>
          </Link>
        </section>
      )}

      <div className={`grid gap-12 ${showSidebar ? "lg:grid-cols-3" : ""}`}>
        <section className={showSidebar ? "lg:col-span-2" : ""}>
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-xl">Recent posts</h2>
            {posts.length > 6 && (
              <Link
                href="/categories"
                className="text-xs text-muted hover:underline"
              >
                Browse all →
              </Link>
            )}
          </div>
          {!showFeatured && rest.length === 0 && (
            <div className="rounded-[var(--radius)] border border-dashed border-border p-12 text-center text-muted">
              <p className="font-medium">No posts yet.</p>
              <p className="mt-1 text-sm">
                Sign into{" "}
                <Link href="/admin" className="underline">
                  admin
                </Link>{" "}
                to publish your first post.
              </p>
            </div>
          )}
          <ul className="space-y-6">
            {(showFeatured ? rest : posts).map((post) => (
              <li key={post.id}>
                <Link href={`/posts/${post.slug}`} className="group block">
                  <h3 className="text-lg group-hover:underline">{post.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                    <time dateTime={post.publishedAt?.toISOString()}>
                      {post.publishedAt?.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    {features.showReadingTime && (
                      <span>· {readingMinutes(post.content)} min</span>
                    )}
                    {post.tags.slice(0, 2).map((t) => (
                      <span key={t.id}>· {t.name}</span>
                    ))}
                  </div>
                  {post.excerpt && (
                    <p className="mt-1 text-sm text-muted">{post.excerpt}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {showSidebar && (
          <aside className="space-y-8">
            {tags.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                  Categories
                </h2>
                <ul className="space-y-1 text-sm">
                  {tags.slice(0, 10).map((t) => (
                    <li key={t.id}>
                      <Link
                        href={`/tags/${t.slug}`}
                        className="flex justify-between py-0.5 hover:underline"
                      >
                        <span>{t.name}</span>
                        <span className="text-muted">{t._count.posts}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/categories"
                  className="mt-2 inline-block text-xs text-muted hover:underline"
                >
                  All categories →
                </Link>
              </section>
            )}
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                Follow
              </h2>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href="/rss.xml" className="hover:underline">
                    RSS feed
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap.xml" className="hover:underline">
                    Sitemap
                  </Link>
                </li>
              </ul>
            </section>
          </aside>
        )}
      </div>
    </main>
  );
}
