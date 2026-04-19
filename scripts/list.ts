#!/usr/bin/env tsx
/**
 * npm run post:list [-- --status=draft|scheduled|published]
 * Prints all posts with their status and next action.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const arg = process.argv.find((a) => a.startsWith("--status="));
  const status = arg?.split("=")[1];
  const where = status ? { status } : {};
  const posts = await prisma.post.findMany({
    where,
    orderBy: [{ status: "asc" }, { scheduledFor: "asc" }, { publishedAt: "desc" }],
    include: { tags: true },
  });
  if (posts.length === 0) {
    console.log("(no posts)");
    return;
  }
  for (const p of posts) {
    const when =
      p.status === "scheduled"
        ? `→ ${p.scheduledFor?.toISOString() ?? "?"}`
        : p.status === "published"
          ? `@ ${p.publishedAt?.toISOString() ?? "?"}`
          : "";
    const tagList = p.tags.map((t) => t.name).join(", ");
    console.log(
      `${p.status.padEnd(10)} ${p.slug.padEnd(40)} ${when}  ${tagList ? `[${tagList}]` : ""}`,
    );
    console.log(`           ${p.title}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
