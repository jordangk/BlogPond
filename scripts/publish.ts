#!/usr/bin/env tsx
/**
 * npm run post:publish -- <slug>
 * Transitions a post to published with publishedAt=now.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error("Usage: npm run post:publish -- <slug>");
    process.exit(1);
  }
  const post = await prisma.post.update({
    where: { slug },
    data: { status: "published", publishedAt: new Date(), scheduledFor: null },
  });
  console.log(`Published: ${post.slug} @ ${post.publishedAt?.toISOString()}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
