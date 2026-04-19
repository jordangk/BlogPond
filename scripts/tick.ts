#!/usr/bin/env tsx
/**
 * npm run post:tick
 * Promotes any post whose scheduledFor has passed to status=published.
 * Run on a cron (Vercel Cron, GitHub Action, or systemd timer).
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const now = new Date();
  const due = await prisma.post.findMany({
    where: { status: "scheduled", scheduledFor: { lte: now } },
    select: { id: true, slug: true, scheduledFor: true },
  });
  if (due.length === 0) {
    console.log("Nothing due.");
    return;
  }
  await prisma.$transaction(
    due.map((p) =>
      prisma.post.update({
        where: { id: p.id },
        data: {
          status: "published",
          publishedAt: p.scheduledFor ?? now,
          scheduledFor: null,
        },
      }),
    ),
  );
  console.log(`Published ${due.length} scheduled post(s):`);
  for (const p of due) console.log(`  - ${p.slug}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
