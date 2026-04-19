import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireApiKey, notFound } from "@/lib/api-auth";
import { serializePost } from "@/lib/post-writes";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const unauth = requireApiKey(req);
  if (unauth) return unauth;
  const { slug } = await params;
  const existing = await prisma.post.findUnique({ where: { slug } });
  if (!existing) return notFound();

  const post = await prisma.post.update({
    where: { slug },
    data: {
      status: "published",
      publishedAt: new Date(),
      scheduledFor: null,
    },
    include: { tags: true },
  });
  revalidatePath("/");
  revalidatePath(`/posts/${slug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/rss.xml");
  revalidatePath("/llms.txt");
  return NextResponse.json({ post: serializePost(post) });
}
