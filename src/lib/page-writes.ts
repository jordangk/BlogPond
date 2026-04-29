import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/markdown";

export const PageInput = z
  .object({
    title: z.string().min(1),
    slug: z.string().min(1).optional(),
    description: z.string().optional(),
    // For renderer === "mdx" (default) `content` is the MDX body.
    // For renderer === "liquid" `content` may be empty — the Liquid template
    // body lives in `liquidSource` instead. We require ≥1 char on at least
    // one of them in `.refine()` below.
    content: z.string().default(""),
    renderer: z.enum(["mdx", "liquid"]).default("mdx"),
    // Liquid-renderer fields. Ignored when renderer !== "liquid".
    liquidSource: z.string().optional(),
    liquidCss: z.string().optional(),
    liquidData: z.string().optional(), // JSON string passed verbatim to the engine
    template: z.enum(["standard", "landing", "minimal"]).default("standard"),
    status: z.enum(["draft", "published"]).default("draft"),
    publishedAt: z
      .union([z.string(), z.date()])
      .optional()
      .transform((v) => (v ? new Date(v) : undefined)),
    showInNav: z.boolean().default(false),
    navOrder: z.number().default(0),
    coverImage: z.string().url().optional().or(z.literal("")),
  })
  .refine(
    (data) =>
      data.renderer === "liquid"
        ? !!(data.liquidSource && data.liquidSource.length)
        : !!(data.content && data.content.length),
    {
      message:
        "MDX pages need `content`; Liquid pages need `liquidSource`.",
      path: ["content"],
    },
  )
  .refine(
    (data) => {
      if (!data.liquidData) return true;
      try {
        JSON.parse(data.liquidData);
        return true;
      } catch {
        return false;
      }
    },
    { message: "`liquidData` must be a valid JSON string.", path: ["liquidData"] },
  );
export type PageInputT = z.infer<typeof PageInput>;

// PATCH accepts the same shape, all fields optional, but we still want to
// validate `liquidData` JSON when present.
export const PagePatch = z
  .object({
    title: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    description: z.string().optional(),
    content: z.string().optional(),
    renderer: z.enum(["mdx", "liquid"]).optional(),
    liquidSource: z.string().optional(),
    liquidCss: z.string().optional(),
    liquidData: z.string().optional(),
    template: z.enum(["standard", "landing", "minimal"]).optional(),
    status: z.enum(["draft", "published"]).optional(),
    publishedAt: z
      .union([z.string(), z.date()])
      .optional()
      .transform((v) => (v ? new Date(v) : undefined)),
    showInNav: z.boolean().optional(),
    navOrder: z.number().optional(),
    coverImage: z.string().url().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (!data.liquidData) return true;
      try {
        JSON.parse(data.liquidData);
        return true;
      } catch {
        return false;
      }
    },
    { message: "`liquidData` must be a valid JSON string.", path: ["liquidData"] },
  );
export type PagePatchT = z.infer<typeof PagePatch>;

export async function createPageRecord(input: PageInputT) {
  const slug = input.slug ? slugify(input.slug) : slugify(input.title);
  const publishedAt =
    input.status === "published"
      ? (input.publishedAt ?? new Date())
      : null;
  const isLiquid = input.renderer === "liquid";
  return prisma.page.create({
    data: {
      slug,
      title: input.title,
      description: input.description ?? null,
      renderer: input.renderer,
      // For Liquid pages we still store the raw template body in `content` too
      // so existing MDX-aware code paths don't choke on an empty value.
      content: isLiquid ? (input.content || input.liquidSource || "") : input.content,
      liquidSource: isLiquid ? (input.liquidSource ?? null) : null,
      liquidCss: isLiquid ? (input.liquidCss ?? null) : null,
      liquidData: isLiquid ? (input.liquidData ?? null) : null,
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
  const newRenderer = patch.renderer ?? current.renderer;
  const isLiquid = newRenderer === "liquid";
  return prisma.page.update({
    where: { slug },
    data: {
      title: patch.title ?? current.title,
      slug: patch.slug ? slugify(patch.slug) : current.slug,
      description:
        patch.description !== undefined ? patch.description : current.description,
      content: patch.content !== undefined ? patch.content : current.content,
      renderer: newRenderer,
      liquidSource: isLiquid
        ? (patch.liquidSource !== undefined ? patch.liquidSource : current.liquidSource)
        : null,
      liquidCss: isLiquid
        ? (patch.liquidCss !== undefined ? patch.liquidCss : current.liquidCss)
        : null,
      liquidData: isLiquid
        ? (patch.liquidData !== undefined ? patch.liquidData : current.liquidData)
        : null,
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
    renderer: p.renderer,
    liquidSource: p.liquidSource,
    liquidCss: p.liquidCss,
    liquidData: p.liquidData,
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
