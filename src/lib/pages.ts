import { prisma } from "@/lib/prisma";

export async function getPublishedPage(slug: string) {
  const now = new Date();
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page || page.status !== "published") return null;
  if (page.publishedAt && page.publishedAt > now) return null;
  return page;
}

export async function getAnyPage(slug: string) {
  return prisma.page.findUnique({ where: { slug } });
}

export async function listPages() {
  return prisma.page.findMany({
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
  });
}

export async function getAllPublishedPages() {
  const now = new Date();
  return prisma.page.findMany({
    where: {
      status: "published",
      OR: [{ publishedAt: null }, { publishedAt: { lte: now } }],
    },
    orderBy: { updatedAt: "desc" },
  });
}
