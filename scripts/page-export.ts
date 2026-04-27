#!/usr/bin/env tsx
/**
 * npm run page:export -- <slug> [--all]
 *
 * Manually exports a page (or all pages) from the DB to content/page-templates/
 * and commits + pushes. Forces EXPORT_TO_REPO=1 for this invocation.
 */
import { PrismaClient } from "@prisma/client";

process.env.EXPORT_TO_REPO = "1";

import { exportPageToRepo } from "../src/lib/repo-export";

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const all = args.includes("--all");
  const slug = args.find((a) => !a.startsWith("--"));

  if (!all && !slug) {
    console.error("Usage: npm run page:export -- <slug>  |  -- --all");
    process.exit(1);
  }

  const pages = all
    ? await prisma.page.findMany()
    : (await prisma.page.findUnique({ where: { slug: slug! } })
        .then((p) => (p ? [p] : [])));

  if (pages.length === 0) {
    console.error("No matching pages.");
    process.exit(2);
  }

  for (const p of pages) {
    await exportPageToRepo(p);
    console.log(`exported: ${p.slug} (${p.renderer})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
