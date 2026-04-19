import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  PostInput,
  createPostRecord,
  serializePost,
} from "@/lib/post-writes";
import { requireApiKey, badRequest } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const unauth = requireApiKey(req);
  if (unauth) return unauth;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;
  const take = Math.min(Number(searchParams.get("limit") ?? 50), 200);

  const posts = await prisma.post.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(tag ? { tags: { some: { slug: tag } } } : {}),
    },
    orderBy: [{ updatedAt: "desc" }],
    take,
    include: { tags: true },
  });
  return NextResponse.json({ posts: posts.map(serializePost) });
}

export async function POST(req: NextRequest) {
  const unauth = requireApiKey(req);
  if (unauth) return unauth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }
  const parsed = PostInput.safeParse(body);
  if (!parsed.success) {
    return badRequest("Validation failed", parsed.error.flatten());
  }
  try {
    const post = await createPostRecord(parsed.data);
    revalidatePath("/");
    revalidatePath(`/posts/${post.slug}`);
    revalidatePath("/sitemap.xml");
    revalidatePath("/rss.xml");
    revalidatePath("/llms.txt");
    return NextResponse.json({ post: serializePost(post) }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    if (msg.includes("Unique constraint") && msg.includes("slug")) {
      return badRequest("A post with that slug already exists");
    }
    return badRequest(msg);
  }
}
