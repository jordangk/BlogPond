import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  PostPatch,
  updatePostRecord,
  serializePost,
} from "@/lib/post-writes";
import { requireApiKey, badRequest, notFound } from "@/lib/api-auth";

async function load(slug: string) {
  return prisma.post.findUnique({ where: { slug }, include: { tags: true } });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const unauth = requireApiKey(req);
  if (unauth) return unauth;
  const { slug } = await params;
  const post = await load(slug);
  if (!post) return notFound();
  return NextResponse.json({ post: serializePost(post) });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const unauth = requireApiKey(req);
  if (unauth) return unauth;
  const { slug } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }
  const parsed = PostPatch.safeParse(body);
  if (!parsed.success) {
    return badRequest("Validation failed", parsed.error.flatten());
  }
  const post = await updatePostRecord(slug, parsed.data);
  if (!post) return notFound();
  revalidatePath("/");
  revalidatePath(`/posts/${slug}`);
  if (post.slug !== slug) revalidatePath(`/posts/${post.slug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/rss.xml");
  revalidatePath("/llms.txt");
  return NextResponse.json({ post: serializePost(post) });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const unauth = requireApiKey(req);
  if (unauth) return unauth;
  const { slug } = await params;
  const existing = await load(slug);
  if (!existing) return notFound();
  await prisma.post.delete({ where: { slug } });
  revalidatePath("/");
  revalidatePath(`/posts/${slug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/rss.xml");
  revalidatePath("/llms.txt");
  return NextResponse.json({ ok: true, slug });
}
