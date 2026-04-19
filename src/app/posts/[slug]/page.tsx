import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getPublishedPosts } from "@/lib/posts";
import { renderMarkdown, readingMinutes, wordCount } from "@/lib/markdown";
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
  const description = post.description ?? post.excerpt ?? site.description;
  const keywords = post.tags.map((t) => t.name);
  return {
    title: post.title,
    description,
    keywords,
    authors: post.author ? [{ name: post.author }] : undefined,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      url,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: post.author ? [post.author] : undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
      tags: keywords,
      siteName: site.name,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
    other: {
      "article:published_time": post.publishedAt?.toISOString() ?? "",
      "article:modified_time": post.updatedAt.toISOString(),
      ...(post.author ? { "article:author": post.author } : {}),
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
  const minutes = readingMinutes(post.content);
  const words = wordCount(post.content);
  const url = `${site.url}/posts/${post.slug}`;

  const blogPostingLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description ?? post.excerpt ?? undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: post.author
      ? { "@type": "Person", name: post.author }
      : { "@type": "Organization", name: site.name },
    image: post.coverImage ?? undefined,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    keywords: post.tags.map((t) => t.name).join(", ") || undefined,
    articleSection: post.tags[0]?.name ?? undefined,
    inLanguage: site.locale.replace("_", "-"),
    wordCount: words,
    timeRequired: `PT${minutes}M`,
    articleBody: post.content,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      {
        "@type": "ListItem",
        position: 2,
        name: post.tags[0]?.name ?? "Posts",
        item: post.tags[0]
          ? `${site.url}/tags/${post.tags[0].slug}`
          : site.url,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: url,
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <nav className="mb-6 text-xs text-neutral-500">
        <Link href="/" className="hover:underline">Home</Link>
        <span> / </span>
        {post.tags[0] ? (
          <>
            <Link
              href={`/tags/${post.tags[0].slug}`}
              className="hover:underline"
            >
              {post.tags[0].name}
            </Link>
            <span> / </span>
          </>
        ) : null}
        <span className="text-neutral-400">{post.title}</span>
      </nav>
      <article>
        <header className="mb-8 border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          {post.description && (
            <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-400">
              {post.description}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
            <time dateTime={post.publishedAt?.toISOString()}>
              {post.publishedAt?.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>· {minutes} min read</span>
            {post.author && <span>· {post.author}</span>}
          </div>
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
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
      <footer className="mt-12 flex items-center justify-between border-t border-neutral-200 pt-6 text-sm text-neutral-500 dark:border-neutral-800">
        <Link href="/" className="hover:underline">
          ← All posts
        </Link>
        <Link href="/categories" className="hover:underline">
          Browse categories →
        </Link>
      </footer>
    </main>
  );
}
