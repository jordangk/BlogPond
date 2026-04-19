import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { robots: { index: false } };

export default async function PagesDashboard() {
  const pages = await prisma.page.findMany({
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pages</h1>
        <Link
          href="/admin/pages/new"
          className="rounded bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900"
        >
          New page
        </Link>
      </div>

      {pages.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No pages yet. Try copying a template from <code>content/page-templates/</code> and running{" "}
          <code>npm run page:sync -- content/page-templates/pricing.mdx</code>.
        </p>
      ) : (
        <ul className="divide-y divide-neutral-200 rounded border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
          {pages.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-4 p-3">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/pages/${p.id}`}
                  className="font-medium hover:underline"
                >
                  {p.title}
                </Link>
                <div className="text-xs text-neutral-500">
                  <code>/{p.slug}</code> · {p.status} · {p.template}
                  {p.showInNav && <> · in nav (#{p.navOrder})</>}
                </div>
              </div>
              {p.status === "published" && (
                <Link
                  href={`/${p.slug}`}
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
    </main>
  );
}
