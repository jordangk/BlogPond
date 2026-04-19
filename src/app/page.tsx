import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export default async function Home() {
  const posts = await getPublishedPosts();
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <section className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight">{site.name}</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          {site.description}
        </p>
      </section>

      <section className="space-y-8">
        {posts.length === 0 && (
          <p className="text-neutral-500">No posts yet. Check back soon.</p>
        )}
        {posts.map((post) => (
          <article key={post.id} className="group">
            <Link href={`/posts/${post.slug}`} className="block">
              <h2 className="text-xl font-medium tracking-tight group-hover:underline">
                {post.title}
              </h2>
              <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
                <time dateTime={post.publishedAt?.toISOString()}>
                  {post.publishedAt?.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                {post.tags.length > 0 && (
                  <span>· {post.tags.map((t) => t.name).join(", ")}</span>
                )}
              </div>
              {post.excerpt && (
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                  {post.excerpt}
                </p>
              )}
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
