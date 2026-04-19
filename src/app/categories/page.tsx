import Link from "next/link";
import { getAllTags } from "@/lib/posts";
import { theme } from "@/theme.config";

export const metadata = {
  title: "Categories",
  description: "Browse posts by topic.",
};

export default async function CategoriesPage() {
  const tags = await getAllTags();
  return (
    <main className={`mx-auto ${theme.layout.maxWidthClass} px-6 py-12`}>
      <h1 className="text-3xl">Categories</h1>
      <p className="mt-2 text-muted">Browse posts by topic.</p>

      {tags.length === 0 ? (
        <p className="mt-8 text-muted">No categories yet.</p>
      ) : (
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tags.map((t) => (
            <li key={t.id}>
              <Link
                href={`/tags/${t.slug}`}
                className="flex items-center justify-between rounded-[var(--radius)] border border-border px-4 py-3 transition hover:border-foreground/40"
              >
                <span className="font-medium">{t.name}</span>
                <span className="text-xs text-muted">
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
