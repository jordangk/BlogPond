import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  PageInput,
  createPageRecord,
  serializePage,
} from "@/lib/page-writes";
import { requireApiKey, badRequest } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const unauth = requireApiKey(req);
  if (unauth) return unauth;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? undefined;
  const pages = await prisma.page.findMany({
    where: { ...(status ? { status } : {}) },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ pages: pages.map(serializePage) });
}

export async function POST(req: NextRequest) {
  const unauth = requireApiKey(req);
  if (unauth) return unauth;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON");
  }
  const parsed = PageInput.safeParse(body);
  if (!parsed.success) return badRequest("Validation failed", parsed.error.flatten());
  try {
    const page = await createPageRecord(parsed.data);
    revalidatePath("/");
    revalidatePath(`/${page.slug}`);
    revalidatePath("/sitemap.xml");
    return NextResponse.json({ page: serializePage(page) }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    if (msg.includes("Unique constraint") && msg.includes("slug")) {
      return badRequest("A page with that slug already exists");
    }
    return badRequest(msg);
  }
}
