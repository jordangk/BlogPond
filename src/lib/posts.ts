import { prisma } from "@/lib/prisma";

export type PostStatus = "draft" | "scheduled" | "published";

export async function getPublishedPosts() {
  const now = new Date();
  return prisma.post.findMany({
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
  });
}

export async function getScheduledPosts() {
  return prisma.post.findMany({
    where: { status: "scheduled" },
    orderBy: { scheduledFor: "asc" },
    include: { tags: true },
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
