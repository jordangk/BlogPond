#!/usr/bin/env tsx
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error("Usage: npm run page:pull -- <slug>");
    process.exit(1);
  }
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) {
    console.error(`No page with slug: ${slug}`);
    process.exit(2);
  }
  const fm = [
    "---",
    `slug: ${page.slug}`,
    `title: ${JSON.stringify(page.title)}`,
    page.description ? `description: ${JSON.stringify(page.description)}` : "",
    `template: ${page.template}`,
    `status: ${page.status}`,
    page.publishedAt ? `publishedAt: ${page.publishedAt.toISOString()}` : "",
    `showInNav: ${page.showInNav}`,
    `navOrder: ${page.navOrder}`,
    page.coverImage ? `coverImage: ${JSON.stringify(page.coverImage)}` : "",
    "---",
  ]
    .filter(Boolean)
    .join("\n");
  const dir = resolve("content/page-drafts");
  await mkdir(dir, { recursive: true });
  const path = `${dir}/${slug}.mdx`;
  await writeFile(path, `${fm}\n\n${page.content}\n`, "utf8");
  console.log(`Wrote ${path}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
