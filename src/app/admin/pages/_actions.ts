"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/markdown";
import { exportPageToRepo, deletePageFromRepo } from "@/lib/repo-export";

async function requireAdmin() {
  const s = await auth();
  if (!s) redirect("/admin/login");
}

export async function createPage(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const slug = rawSlug ? slugify(rawSlug) : slugify(title || `page-${Date.now()}`);
  const description = String(formData.get("description") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "");
  const template = String(formData.get("template") ?? "standard");
  const status = String(formData.get("status") ?? "draft");
  const showInNav = formData.get("showInNav") === "on";
  const navOrder = Number(formData.get("navOrder") ?? 0);
  const coverImage = String(formData.get("coverImage") ?? "").trim() || null;
  const publishedAt = status === "published" ? new Date() : null;

  const page = await prisma.page.create({
    data: {
      title: title || "(untitled)",
      slug,
      description,
      content,
      template,
      status,
      publishedAt,
      showInNav,
      navOrder,
      coverImage,
    },
  });
  revalidatePath("/");
  revalidatePath(`/${slug}`);
  revalidatePath("/sitemap.xml");
  await exportPageToRepo(page);
  redirect(`/admin/pages/${page.id}`);
}

export async function updatePage(id: string, formData: FormData) {
  await requireAdmin();
  const current = await prisma.page.findUniqueOrThrow({ where: { id } });
  const title = String(formData.get("title") ?? "").trim() || current.title;
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "");
  const template = String(formData.get("template") ?? "standard");
  const status = String(formData.get("status") ?? "draft");
  const showInNav = formData.get("showInNav") === "on";
  const navOrder = Number(formData.get("navOrder") ?? 0);
  const coverImage = String(formData.get("coverImage") ?? "").trim() || null;
  const slug = rawSlug ? slugify(rawSlug) : current.slug;
  const publishedAt =
    status === "published" ? (current.publishedAt ?? new Date()) : null;

  const page = await prisma.page.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      content,
      template,
      status,
      publishedAt,
      showInNav,
      navOrder,
      coverImage,
    },
  });
  revalidatePath("/");
  revalidatePath(`/${current.slug}`);
  if (current.slug !== page.slug) revalidatePath(`/${page.slug}`);
  revalidatePath("/sitemap.xml");
  await exportPageToRepo(page);
}

export async function deletePage(id: string) {
  await requireAdmin();
  const page = await prisma.page.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath(`/${page.slug}`);
  revalidatePath("/sitemap.xml");
  await deletePageFromRepo(page.slug, page.renderer);
  redirect("/admin/pages");
}
