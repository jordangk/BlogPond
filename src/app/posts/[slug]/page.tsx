import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getPublishedPosts } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown";
import { site } from "@/lib/site";

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") return { title: "Not found" };
  const url = `${site.url}/posts/${post.slug}`;
  return {
    title: post.title,
    description: post.description ?? post.excerpt ?? site.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description ?? post.excerpt ?? undefined,
      url,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: post.author ? [post.author] : undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
      tags: post.tags.map((t) => t.name),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description ?? post.excerpt ?? undefined,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const now = new Date();
  const isPublished =
    post.status === "published" && post.publishedAt && post.publishedAt <= now;
  if (!isPublished) notFound();

  const html = await renderMarkdown(post.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description ?? post.excerpt ?? undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: post.author ? { "@type": "Person", name: post.author } : undefined,
    image: post.coverImage ?? undefined,
    mainEntityOfPage: `${site.url}/posts/${post.slug}`,
    publisher: { "@type": "Organization", name: site.name },
    keywords: post.tags.map((t) => t.name).join(", ") || undefined,
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            {post.title}
          </h1>
          <div className="mt-2 text-sm text-neutral-500">
            <time dateTime={post.publishedAt?.toISOString()}>
              {post.publishedAt?.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {post.author && <> · {post.author}</>}
          </div>
          {post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {post.tags.map((t) => (
                <Link
                  key={t.id}
                  href={`/tags/${t.slug}`}
                  className="rounded border border-neutral-300 px-2 py-0.5 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-900"
                >
                  {t.name}
                </Link>
              ))}
            </div>
          )}
        </header>
        <div
          className="prose prose-neutral dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
      <p className="mt-12">
        <Link href="/" className="text-sm text-neutral-500 hover:underline">
          ← All posts
        </Link>
      </p>
    </main>
  );
}
