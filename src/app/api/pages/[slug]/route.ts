import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  PagePatch,
  updatePageRecord,
  serializePage,
} from "@/lib/page-writes";
import { requireApiKey, badRequest, notFound } from "@/lib/api-auth";
import { exportPageToRepo, deletePageFromRepo } from "@/lib/repo-export";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const unauth = requireApiKey(req);
  if (unauth) return unauth;
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) return notFound();
  return NextResponse.json({ page: serializePage(page) });
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
    return badRequest("Invalid JSON");
  }
  const parsed = PagePatch.safeParse(body);
  if (!parsed.success) return badRequest("Validation failed", parsed.error.flatten());
  const page = await updatePageRecord(slug, parsed.data);
  if (!page) return notFound();
  revalidatePath("/");
  revalidatePath(`/${slug}`);
  if (page.slug !== slug) revalidatePath(`/${page.slug}`);
  revalidatePath("/sitemap.xml");
  await exportPageToRepo(page);
  return NextResponse.json({ page: serializePage(page) });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const unauth = requireApiKey(req);
  if (unauth) return unauth;
  const { slug } = await params;
  const existing = await prisma.page.findUnique({ where: { slug } });
  if (!existing) return notFound();
  await prisma.page.delete({ where: { slug } });
  revalidatePath("/");
  revalidatePath(`/${slug}`);
  revalidatePath("/sitemap.xml");
  await deletePageFromRepo(slug, existing.renderer);
  return NextResponse.json({ ok: true, slug });
}
