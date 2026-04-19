import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostsByTag, getAllTags } from "@/lib/posts";
import { theme } from "@/theme.config";

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((t) => ({ tag: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${tag}`, description: `Posts tagged #${tag}` };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);
  if (posts.length === 0) notFound();

  return (
    <main className={`mx-auto ${theme.layout.contentMaxWidthClass} px-6 py-12`}>
      <h1 className="text-2xl">#{tag}</h1>
      <ul className="mt-8 space-y-6">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/posts/${post.slug}`}
              className="text-lg font-medium hover:underline"
            >
              {post.title}
            </Link>
            <div className="text-xs text-muted">
              {post.publishedAt?.toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
