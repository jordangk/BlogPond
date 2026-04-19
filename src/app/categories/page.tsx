import Link from "next/link";
import { getAllTags } from "@/lib/posts";

export const metadata = {
  title: "Categories",
  description: "Browse posts by topic.",
};

export default async function CategoriesPage() {
  const tags = await getAllTags();
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Categories</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
        Browse posts by topic.
      </p>

      {tags.length === 0 ? (
        <p className="mt-8 text-neutral-500">No categories yet.</p>
      ) : (
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tags.map((t) => (
            <li key={t.id}>
              <Link
                href={`/tags/${t.slug}`}
                className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3 transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
              >
                <span className="font-medium">{t.name}</span>
                <span className="text-xs text-neutral-500">
                  {t._count.posts} {t._count.posts === 1 ? "post" : "posts"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
