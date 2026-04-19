#!/usr/bin/env tsx
/**
 * npm run post:pull -- <slug>
 * Dumps a post from the DB into content/drafts/<slug>.md so it can be edited.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import { serializeFrontmatter } from "../src/lib/markdown";

const prisma = new PrismaClient();

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error("Usage: npm run post:pull -- <slug>");
    process.exit(1);
  }
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { tags: true },
  });
  if (!post) {
    console.error(`No post found with slug: ${slug}`);
    process.exit(2);
  }
  const fm = serializeFrontmatter({
    slug: post.slug,
    title: post.title,
    description: post.description,
    excerpt: post.excerpt,
    status: post.status,
    publishedAt: post.publishedAt,
    scheduledFor: post.scheduledFor,
    coverImage: post.coverImage,
    author: post.author,
    tags: post.tags.map((t) => t.name),
  });
  const out = `${fm}\n\n${post.content}\n`;
  const dir = resolve("content/drafts");
  await mkdir(dir, { recursive: true });
  const path = `${dir}/${slug}.md`;
  await writeFile(path, out, "utf8");
  console.log(`Wrote ${path}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
