import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiKey, badRequest } from "@/lib/api-auth";
import { saveUpload } from "@/lib/media";

export async function GET(req: NextRequest) {
  const unauth = requireApiKey(req);
  if (unauth) return unauth;
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ media });
}

export async function POST(req: NextRequest) {
  const unauth = requireApiKey(req);
  if (unauth) return unauth;
  const form = await req.formData().catch(() => null);
  if (!form) return badRequest("Expected multipart/form-data");
  const file = form.get("file");
  const alt = form.get("alt");
  if (!(file instanceof File)) return badRequest("Missing file field");
  const media = await saveUpload(file, typeof alt === "string" ? alt : undefined);
  return NextResponse.json({ media }, { status: 201 });
}
