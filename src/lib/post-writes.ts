import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify, excerptFrom } from "@/lib/markdown";

export const PostInput = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  status: z.enum(["draft", "scheduled", "published"]).default("draft"),
  publishedAt: z
    .union([z.string(), z.date()])
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  scheduledFor: z
    .union([z.string(), z.date()])
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  coverImage: z.string().url().optional().or(z.literal("")),
  author: z.string().optional(),
  tags: z.array(z.string()).default([]),
});
export type PostInputT = z.infer<typeof PostInput>;

export const PostPatch = PostInput.partial();
export type PostPatchT = z.infer<typeof PostPatch>;

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

export async function createPostRecord(input: PostInputT) {
  const slug = input.slug ? slugify(input.slug) : slugify(input.title);
  const excerpt = input.excerpt ?? excerptFrom(input.content);
  const tags = await upsertTags(input.tags);
  const publishedAt =
    input.status === "published"
      ? (input.publishedAt ?? new Date())
      : null;
  const scheduledFor =
    input.status === "scheduled" ? (input.scheduledFor ?? null) : null;

  return prisma.post.create({
    data: {
      slug,
      title: input.title,
      description: input.description ?? null,
      excerpt,
      content: input.content,
      status: input.status,
      publishedAt,
      scheduledFor,
      coverImage: input.coverImage || null,
      author: input.author ?? null,
      tags: { connect: tags.map((t) => ({ id: t.id })) },
    },
    include: { tags: true },
  });
}

export async function updatePostRecord(slug: string, patch: PostPatchT) {
  const current = await prisma.post.findUnique({ where: { slug } });
  if (!current) return null;

  const newStatus = patch.status ?? current.status;
  const publishedAt =
    newStatus === "published"
      ? (patch.publishedAt ?? current.publishedAt ?? new Date())
      : null;
  const scheduledFor =
    newStatus === "scheduled"
      ? (patch.scheduledFor ?? current.scheduledFor ?? null)
      : null;

  const tagsUpdate = patch.tags !== undefined
    ? { set: (await upsertTags(patch.tags)).map((t) => ({ id: t.id })) }
    : undefined;

  const content = patch.content ?? current.content;
  const excerpt =
    patch.excerpt !== undefined
      ? patch.excerpt
      : (patch.content !== undefined ? excerptFrom(content) : current.excerpt);

  return prisma.post.update({
    where: { slug },
    data: {
      title: patch.title ?? current.title,
      slug: patch.slug ? slugify(patch.slug) : current.slug,
      description:
        patch.description !== undefined ? patch.description : current.description,
      excerpt,
      content,
      status: newStatus,
      publishedAt,
      scheduledFor,
      coverImage:
        patch.coverImage !== undefined
          ? patch.coverImage || null
          : current.coverImage,
      author: patch.author !== undefined ? patch.author : current.author,
      ...(tagsUpdate ? { tags: tagsUpdate } : {}),
    },
    include: { tags: true },
  });
}

export function serializePost(
  p: NonNullable<Awaited<ReturnType<typeof createPostRecord>>>,
) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    excerpt: p.excerpt,
    content: p.content,
    status: p.status,
    publishedAt: p.publishedAt?.toISOString() ?? null,
    scheduledFor: p.scheduledFor?.toISOString() ?? null,
    coverImage: p.coverImage,
    author: p.author,
    tags: p.tags.map((t) => t.name),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}
