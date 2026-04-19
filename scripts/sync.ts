#!/usr/bin/env tsx
/**
 * npm run post:sync -- <path-to-md> [--delete-after]
 * Reads a markdown file with YAML frontmatter and upserts a Post in the DB.
 */
import { readFile, unlink } from "node:fs/promises";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import { parseMarkdown, slugify, excerptFrom } from "../src/lib/markdown";

const prisma = new PrismaClient();

async function main() {
  const [rawPath, ...flags] = process.argv.slice(2);
  if (!rawPath) {
    console.error("Usage: npm run post:sync -- <path-to-md> [--delete-after]");
    process.exit(1);
  }
  const deleteAfter = flags.includes("--delete-after");
  const filePath = resolve(rawPath);
  const raw = await readFile(filePath, "utf8");
  const { data, content } = parseMarkdown(raw);

  const slug = data.slug?.trim() || slugify(data.title);
  const excerpt = data.excerpt ?? excerptFrom(content);

  let status = data.status;
  if (status === "scheduled" && !data.scheduledFor) {
    console.warn("status=scheduled but no scheduledFor — keeping as draft.");
    status = "draft";
  }
  const publishedAt =
    status === "published" ? (data.publishedAt ?? new Date()) : null;

  const tagConnect = await Promise.all(
    data.tags.map(async (name) => {
      const tagSlug = slugify(name);
      return prisma.tag.upsert({
        where: { slug: tagSlug },
        update: { name },
        create: { slug: tagSlug, name },
        select: { id: true },
      });
    }),
  );

  const post = await prisma.post.upsert({
    where: { slug },
    update: {
      title: data.title,
      description: data.description ?? null,
      excerpt,
      content,
      status,
      publishedAt,
      scheduledFor: data.scheduledFor ?? null,
      coverImage: data.coverImage ?? null,
      author: data.author ?? null,
      tags: { set: tagConnect.map((t) => ({ id: t.id })) },
    },
    create: {
      slug,
      title: data.title,
      description: data.description ?? null,
      excerpt,
      content,
      status,
      publishedAt,
      scheduledFor: data.scheduledFor ?? null,
      coverImage: data.coverImage ?? null,
      author: data.author ?? null,
      tags: { connect: tagConnect.map((t) => ({ id: t.id })) },
    },
  });

  console.log(`Synced: ${post.slug} [${post.status}]`);
  if (deleteAfter) {
    await unlink(filePath);
    console.log(`Deleted draft: ${filePath}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
