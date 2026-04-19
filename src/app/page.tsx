import Link from "next/link";
import {
  getPublishedPosts,
  getAllTags,
  getPostCounts,
} from "@/lib/posts";
import { readingMinutes } from "@/lib/markdown";
import { site } from "@/lib/site";

export default async function Home() {
  const [posts, tags, counts] = await Promise.all([
    getPublishedPosts(12),
    getAllTags(),
    getPostCounts(),
  ]);

  const [featured, ...rest] = posts;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      {/* Hero */}
      <section className="mb-12 border-b border-neutral-200 pb-12 dark:border-neutral-800">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          {site.name}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          {site.description}
        </h1>
        <p className="mt-4 max-w-2xl text-neutral-600 dark:text-neutral-400">
          {counts.posts} published {counts.posts === 1 ? "post" : "posts"}
          {counts.tags > 0 && ` · ${counts.tags} categories`}
        </p>
      </section>

      {/* Featured */}
      {featured && (
        <section className="mb-12">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Latest
          </div>
          <Link
            href={`/posts/${featured.slug}`}
            className="group block rounded-lg border border-neutral-200 p-6 transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
          >
            <h2 className="text-2xl font-semibold tracking-tight group-hover:underline sm:text-3xl">
              {featured.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
              <time dateTime={featured.publishedAt?.toISOString()}>
                {featured.publishedAt?.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span>· {readingMinutes(featured.content)} min read</span>
              {featured.tags.length > 0 && (
                <span>· {featured.tags.map((t) => t.name).join(", ")}</span>
              )}
            </div>
            {featured.excerpt && (
              <p className="mt-4 text-neutral-700 dark:text-neutral-300">
                {featured.excerpt}
              </p>
            )}
            <span className="mt-4 inline-block text-sm font-medium">
              Read more →
            </span>
          </Link>
        </section>
      )}

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Recent posts */}
        <section className="lg:col-span-2">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-xl font-semibold">Recent posts</h2>
            {posts.length > 6 && (
              <Link href="/categories" className="text-xs text-neutral-500 hover:underline">
                Browse all →
              </Link>
            )}
          </div>
          {rest.length === 0 && !featured && (
            <div className="rounded-lg border border-dashed border-neutral-300 p-12 text-center text-neutral-500 dark:border-neutral-700">
              <p className="font-medium">No posts yet.</p>
              <p className="mt-1 text-sm">
                Sign into{" "}
                <Link href="/admin" className="underline">admin</Link>{" "}
                to publish your first post.
              </p>
            </div>
          )}
          <ul className="space-y-6">
            {rest.map((post) => (
              <li key={post.id}>
                <Link href={`/posts/${post.slug}`} className="group block">
                  <h3 className="text-lg font-medium tracking-tight group-hover:underline">
                    {post.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                    <time dateTime={post.publishedAt?.toISOString()}>
                      {post.publishedAt?.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    <span>· {readingMinutes(post.content)} min</span>
                    {post.tags.slice(0, 2).map((t) => (
                      <span key={t.id}>· {t.name}</span>
                    ))}
                  </div>
                  {post.excerpt && (
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Categories */}
          {tags.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
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
                      <span className="text-neutral-500">{t._count.posts}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/categories"
                className="mt-2 inline-block text-xs text-neutral-500 hover:underline"
              >
                All categories →
              </Link>
            </section>
          )}

          {/* Subscribe */}
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Follow
            </h2>
            <ul className="space-y-1 text-sm">
              <li><Link href="/rss.xml" className="hover:underline">RSS feed</Link></li>
              <li><Link href="/sitemap.xml" className="hover:underline">Sitemap</Link></li>
            </ul>
          </section>
        </aside>
      </div>
    </main>
  );
}
