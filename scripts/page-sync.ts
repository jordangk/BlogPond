#!/usr/bin/env tsx
/**
 * npm run page:sync -- <path-to-mdx>
 * Reads an MDX file with YAML frontmatter and upserts a Page.
 */
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import matter from "gray-matter";
import { z } from "zod";

const prisma = new PrismaClient();

const Frontmatter = z.object({
  slug: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  template: z.enum(["standard", "landing", "minimal"]).default("standard"),
  status: z.enum(["draft", "published"]).default("draft"),
  publishedAt: z.union([z.string(), z.date()]).optional(),
  showInNav: z.boolean().default(false),
  navOrder: z.number().default(0),
  coverImage: z.string().optional(),
});

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: npm run page:sync -- <path-to-mdx>");
    process.exit(1);
  }
  const raw = await readFile(resolve(file), "utf8");
  const { data, content } = matter(raw);
  const fm = Frontmatter.parse(data);
  const slug = (fm.slug ?? fm.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const publishedAt =
    fm.status === "published" ? new Date(fm.publishedAt ?? new Date()) : null;

  const page = await prisma.page.upsert({
    where: { slug },
    update: {
      title: fm.title,
      description: fm.description ?? null,
      content,
      template: fm.template,
      status: fm.status,
      publishedAt,
      showInNav: fm.showInNav,
      navOrder: fm.navOrder,
      coverImage: fm.coverImage ?? null,
    },
    create: {
      slug,
      title: fm.title,
      description: fm.description ?? null,
      content,
      template: fm.template,
      status: fm.status,
      publishedAt,
      showInNav: fm.showInNav,
      navOrder: fm.navOrder,
      coverImage: fm.coverImage ?? null,
    },
  });
  console.log(`Synced page: ${page.slug} [${page.status}/${page.template}]`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
