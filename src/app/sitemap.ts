import type { MetadataRoute } from "next";
import { getPublishedPosts, getAllTags } from "@/lib/posts";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, tags] = await Promise.all([
    getPublishedPosts(),
    getAllTags(),
  ]);

  const entries: MetadataRoute.Sitemap = [
    {
      url: site.url,
      lastModified: posts[0]?.publishedAt ?? new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${site.url}/schedule`,
      changeFrequency: "daily",
      priority: 0.3,
    },
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
