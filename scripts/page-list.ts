#!/usr/bin/env tsx
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.page.findMany({
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
  });
  if (pages.length === 0) {
    console.log("(no pages)");
    return;
  }
  for (const p of pages) {
    const nav = p.showInNav ? ` nav#${p.navOrder}` : "";
    console.log(
      `${p.status.padEnd(10)} ${p.template.padEnd(10)} ${p.slug.padEnd(30)}${nav}  ${p.title}`,
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
