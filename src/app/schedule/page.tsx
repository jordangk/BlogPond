import { getScheduledPosts } from "@/lib/posts";

export const metadata = {
  title: "Upcoming posts",
  description: "Posts scheduled to publish soon.",
};

export default async function SchedulePage() {
  const posts = await getScheduledPosts();
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Upcoming posts</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
        Posts queued to publish at a future date.
      </p>
      {posts.length === 0 ? (
        <p className="mt-8 text-neutral-500">Nothing on deck.</p>
      ) : (
        <ul className="mt-8 space-y-6">
          {posts.map((post) => (
            <li key={post.id}>
              <div className="text-lg font-medium">{post.title}</div>
              <div className="mt-1 text-xs text-neutral-500">
                {post.scheduledFor && (
                  <time dateTime={post.scheduledFor.toISOString()}>
                    Publishes {post.scheduledFor.toLocaleString()}
                  </time>
                )}
              </div>
              {post.excerpt && (
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {post.excerpt}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
