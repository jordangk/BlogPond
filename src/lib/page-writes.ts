import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/markdown";

export const PageInput = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  content: z.string().min(1),
  template: z.enum(["standard", "landing", "minimal"]).default("standard"),
  status: z.enum(["draft", "published"]).default("draft"),
  publishedAt: z
    .union([z.string(), z.date()])
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  showInNav: z.boolean().default(false),
  navOrder: z.number().default(0),
  coverImage: z.string().url().optional().or(z.literal("")),
});
export type PageInputT = z.infer<typeof PageInput>;

export const PagePatch = PageInput.partial();
export type PagePatchT = z.infer<typeof PagePatch>;

export async function createPageRecord(input: PageInputT) {
  const slug = input.slug ? slugify(input.slug) : slugify(input.title);
  const publishedAt =
    input.status === "published"
      ? (input.publishedAt ?? new Date())
      : null;
  return prisma.page.create({
    data: {
      slug,
      title: input.title,
      description: input.description ?? null,
      content: input.content,
      template: input.template,
      status: input.status,
      publishedAt,
      showInNav: input.showInNav,
      navOrder: input.navOrder,
      coverImage: input.coverImage || null,
    },
  });
}

export async function updatePageRecord(slug: string, patch: PagePatchT) {
  const current = await prisma.page.findUnique({ where: { slug } });
  if (!current) return null;
  const newStatus = patch.status ?? current.status;
  const publishedAt =
    newStatus === "published"
      ? (patch.publishedAt ?? current.publishedAt ?? new Date())
      : null;
  return prisma.page.update({
    where: { slug },
    data: {
      title: patch.title ?? current.title,
      slug: patch.slug ? slugify(patch.slug) : current.slug,
      description:
        patch.description !== undefined ? patch.description : current.description,
      content: patch.content ?? current.content,
      template: patch.template ?? current.template,
      status: newStatus,
      publishedAt,
      showInNav:
        patch.showInNav !== undefined ? patch.showInNav : current.showInNav,
      navOrder:
        patch.navOrder !== undefined ? patch.navOrder : current.navOrder,
      coverImage:
        patch.coverImage !== undefined
          ? patch.coverImage || null
          : current.coverImage,
    },
  });
}

export function serializePage(p: NonNullable<Awaited<ReturnType<typeof createPageRecord>>>) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    content: p.content,
    template: p.template,
    status: p.status,
    publishedAt: p.publishedAt?.toISOString() ?? null,
    showInNav: p.showInNav,
    navOrder: p.navOrder,
    coverImage: p.coverImage,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}
