import type { MetadataRoute } from "next";
import { getPublishedPosts, getAllTags } from "@/lib/posts";
import { getAllPublishedPages } from "@/lib/pages";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, tags, pages] = await Promise.all([
    getPublishedPosts(),
    getAllTags(),
    getAllPublishedPages(),
  ]);

  const entries: MetadataRoute.Sitemap = [
    {
      url: site.url,
      lastModified: posts[0]?.publishedAt ?? new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${site.url}/blog`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${site.url}/categories`,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...pages
      .filter((p) => p.slug !== "home")
      .map((p) => ({
        url: `${site.url}/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ...posts.map((p) => ({
      url: `${site.url}/posts/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...tags.map((t) => ({
      url: `${site.url}/tags/${t.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
  ];

  return entries;
}
