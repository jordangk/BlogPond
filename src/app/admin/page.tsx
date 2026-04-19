import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getAllPostsForAdmin } from "@/lib/posts";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const me = await prisma.user.findUnique({
    where: { username: session.user!.name! },
    select: { mustChangePassword: true },
  });
  if (me?.mustChangePassword) redirect("/admin/settings?first=1");

  const posts = await getAllPostsForAdmin();
  const groups: Record<string, typeof posts> = {
    draft: [],
    scheduled: [],
    published: [],
  };
  for (const p of posts) (groups[p.status] ??= []).push(p);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Posts</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/settings"
            className="text-sm text-neutral-500 hover:underline"
          >
            Settings
          </Link>
          <Link
            href="/admin/posts/new"
            className="rounded bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900"
          >
            New post
          </Link>
        </div>
      </div>

      {(["draft", "scheduled", "published"] as const).map((status) => (
        <section key={status} className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            {status} ({groups[status]?.length ?? 0})
          </h2>
          {(groups[status]?.length ?? 0) === 0 ? (
            <p className="text-sm text-neutral-500">None.</p>
          ) : (
            <ul className="divide-y divide-neutral-200 rounded border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
              {groups[status]!.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-4 p-3">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/posts/${p.id}`}
                      className="font-medium hover:underline"
                    >
                      {p.title || "(untitled)"}
                    </Link>
                    <div className="text-xs text-neutral-500">
                      <code>{p.slug}</code>
                      {status === "scheduled" && p.scheduledFor && (
                        <> · publishes {p.scheduledFor.toLocaleString()}</>
                      )}
                      {status === "published" && p.publishedAt && (
                        <> · published {p.publishedAt.toLocaleDateString()}</>
                      )}
                      {p.tags.length > 0 && (
                        <> · {p.tags.map((t) => t.name).join(", ")}</>
                      )}
                    </div>
                  </div>
                  {status === "published" && (
                    <Link
                      href={`/posts/${p.slug}`}
                      target="_blank"
                      className="text-xs text-neutral-500 hover:underline"
                    >
                      View →
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </main>
  );
}
