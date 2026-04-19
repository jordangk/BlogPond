import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";

const UPLOADS_DIR = join(process.cwd(), "public", "uploads");

function sanitize(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function saveUpload(file: File, alt?: string) {
  const buf = Buffer.from(await file.arrayBuffer());
  const ext = (file.name.split(".").pop() ?? "").toLowerCase().slice(0, 10);
  const base = sanitize(file.name.replace(/\.[^.]+$/, "")) || "upload";
  const id = randomBytes(4).toString("hex");
  const filename = ext ? `${base}-${id}.${ext}` : `${base}-${id}`;
  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(join(UPLOADS_DIR, filename), buf);
  const url = `/uploads/${filename}`;
  const media = await prisma.media.create({
    data: {
      filename,
      url,
      mimeType: file.type || "application/octet-stream",
      size: buf.length,
      alt: alt ?? null,
    },
  });
  return media;
}
