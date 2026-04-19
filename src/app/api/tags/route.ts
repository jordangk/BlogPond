import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiKey } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const unauth = requireApiKey(req);
  if (unauth) return unauth;
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });
  return NextResponse.json({
    tags: tags.map((t) => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      count: t._count.posts,
    })),
  });
}
