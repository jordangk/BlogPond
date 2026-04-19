import { NextRequest, NextResponse } from "next/server";
import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { prisma } from "@/lib/prisma";
import { requireApiKey, notFound } from "@/lib/api-auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauth = requireApiKey(req);
  if (unauth) return unauth;
  const { id } = await params;
  const m = await prisma.media.findUnique({ where: { id } });
  if (!m) return notFound();
  await prisma.media.delete({ where: { id } });
  try {
    await unlink(join(process.cwd(), "public", "uploads", m.filename));
  } catch {
    // file already gone — ignore
  }
  return NextResponse.json({ ok: true, id });
}
