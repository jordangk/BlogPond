"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { saveUpload } from "@/lib/media";

async function requireAdmin() {
  const s = await auth();
  if (!s) redirect("/admin/login");
}

export async function uploadMedia(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  const alt = formData.get("alt");
  if (!(file instanceof File) || file.size === 0) return;
  await saveUpload(file, typeof alt === "string" ? alt : undefined);
  revalidatePath("/admin/media");
}

export async function deleteMedia(id: string) {
  await requireAdmin();
  const m = await prisma.media.findUnique({ where: { id } });
  if (!m) return;
  await prisma.media.delete({ where: { id } });
  try {
    await unlink(join(process.cwd(), "public", "uploads", m.filename));
  } catch {}
  revalidatePath("/admin/media");
}
