import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedPage } from "@/lib/pages";
import { MDX } from "@/lib/mdx";
import { site } from "@/lib/site";
import { theme } from "@/theme.config";

// Reserved slugs served by explicit routes — do not let them also resolve here.
const RESERVED = new Set([
  "home",
  "blog",
  "posts",
  "categories",
  "tags",
  "admin",
  "api",
  "rss.xml",
  "sitemap.xml",
  "robots.txt",
  "llms.txt",
]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED.has(slug)) return { title: "Not found" };
  const page = await getPublishedPage(slug);
  if (!page) return { title: "Not found" };
  const url = `${site.url}/${page.slug}`;
  return {
    title: page.title,
    description: page.description ?? site.description,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.description ?? site.description,
      url,
      type: "website",
      siteName: site.name,
      images: page.coverImage ? [page.coverImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description ?? site.description,
    },
  };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (RESERVED.has(slug)) notFound();
  const page = await getPublishedPage(slug);
  if (!page) notFound();

  const isLanding = page.template === "landing";
  const wrapperClass = isLanding
    ? ""
    : `mx-auto ${theme.layout.maxWidthClass} px-6 py-12`;

  return (
    <>
      {!isLanding && (
        <header
          className={`mx-auto ${theme.layout.contentMaxWidthClass} px-6 pt-12`}
        >
          <h1 className="text-4xl sm:text-5xl">{page.title}</h1>
          {page.description && (
            <p className="mt-3 text-lg text-muted">{page.description}</p>
          )}
        </header>
      )}
      <div className={wrapperClass}>
        <MDX source={page.content} />
      </div>
    </>
  );
}
