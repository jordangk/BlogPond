"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify, excerptFrom } from "@/lib/markdown";

async function requireAdmin() {
  const session = await auth();
  if (!session) redirect("/admin/login");
}

function parseTags(input: string): string[] {
  return input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseDate(input: string | null | undefined): Date | null {
  if (!input) return null;
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function upsertTags(names: string[]) {
  return Promise.all(
    names.map(async (name) => {
      const slug = slugify(name);
      return prisma.tag.upsert({
        where: { slug },
        update: { name },
        create: { slug, name },
        select: { id: true },
      });
    }),
  );
}

export async function createPost(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const slug = rawSlug ? slugify(rawSlug) : slugify(title || `post-${Date.now()}`);
  const description = String(formData.get("description") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "");
  const excerpt =
    String(formData.get("excerpt") ?? "").trim() || excerptFrom(content);
  const status = String(formData.get("status") ?? "draft");
  const scheduledFor = parseDate(formData.get("scheduledFor") as string);
  const coverImage =
    String(formData.get("coverImage") ?? "").trim() || null;
  const author = String(formData.get("author") ?? "").trim() || null;
  const tagNames = parseTags(String(formData.get("tags") ?? ""));
  const tags = await upsertTags(tagNames);

  const publishedAt = status === "published" ? new Date() : null;

  const post = await prisma.post.create({
    data: {
      title: title || "(untitled)",
      slug,
      description,
      excerpt,
      content,
      status,
      scheduledFor,
      publishedAt,
      coverImage,
      author,
      tags: { connect: tags.map((t) => ({ id: t.id })) },
    },
  });

  revalidatePath("/");
  revalidatePath(`/posts/${post.slug}`);
  revalidatePath("/sitemap.xml");
  redirect(`/admin/posts/${post.id}`);
}

export async function updatePost(id: string, formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "");
  const excerpt =
    String(formData.get("excerpt") ?? "").trim() || excerptFrom(content);
  const status = String(formData.get("status") ?? "draft");
  const scheduledFor = parseDate(formData.get("scheduledFor") as string);
  const coverImage =
    String(formData.get("coverImage") ?? "").trim() || null;
  const author = String(formData.get("author") ?? "").trim() || null;
  const tagNames = parseTags(String(formData.get("tags") ?? ""));
  const tags = await upsertTags(tagNames);

  const current = await prisma.post.findUniqueOrThrow({ where: { id } });
  const slug = rawSlug ? slugify(rawSlug) : current.slug;

  const publishedAt =
    status === "published"
      ? (current.publishedAt ?? new Date())
      : null;

  const post = await prisma.post.update({
    where: { id },
    data: {
      title: title || current.title,
      slug,
      description,
      excerpt,
      content,
      status,
      scheduledFor,
      publishedAt,
      coverImage,
      author,
      tags: { set: tags.map((t) => ({ id: t.id })) },
    },
  });

  revalidatePath("/");
  revalidatePath(`/posts/${current.slug}`);
  if (current.slug !== post.slug) revalidatePath(`/posts/${post.slug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/rss.xml");
}

export async function deletePost(id: string) {
  await requireAdmin();
  const post = await prisma.post.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath(`/posts/${post.slug}`);
  revalidatePath("/sitemap.xml");
  redirect("/admin");
}
