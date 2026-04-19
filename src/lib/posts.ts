import { prisma } from "@/lib/prisma";

export type PostStatus = "draft" | "scheduled" | "published";

export async function getPublishedPosts(take?: number) {
  const now = new Date();
  return prisma.post.findMany({
    where: { status: "published", publishedAt: { lte: now } },
    orderBy: { publishedAt: "desc" },
    include: { tags: true },
    ...(take ? { take } : {}),
  });
}

export async function getFeaturedPost() {
  const now = new Date();
  return prisma.post.findFirst({
    where: { status: "published", publishedAt: { lte: now } },
    orderBy: { publishedAt: "desc" },
    include: { tags: true },
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    include: { tags: true },
  });
}

export async function getPostsByTag(tagSlug: string) {
  const now = new Date();
  return prisma.post.findMany({
    where: {
      status: "published",
      publishedAt: { lte: now },
      tags: { some: { slug: tagSlug } },
    },
    orderBy: { publishedAt: "desc" },
    include: { tags: true },
  });
}

export async function getAllTags() {
  return prisma.tag.findMany({
    where: { posts: { some: { status: "published" } } },
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });
}

export async function getScheduledPosts(take?: number) {
  return prisma.post.findMany({
    where: { status: "scheduled" },
    orderBy: { scheduledFor: "asc" },
    include: { tags: true },
    ...(take ? { take } : {}),
  });
}

export async function getAllPostsForAdmin() {
  return prisma.post.findMany({
    orderBy: [
      { status: "asc" },
      { scheduledFor: "asc" },
      { publishedAt: "desc" },
      { updatedAt: "desc" },
    ],
    include: { tags: true },
  });
}

export async function getPostCounts() {
  const [posts, tags, scheduled] = await Promise.all([
    prisma.post.count({ where: { status: "published" } }),
    prisma.tag.count(),
    prisma.post.count({ where: { status: "scheduled" } }),
  ]);
  return { posts, tags, scheduled };
}
