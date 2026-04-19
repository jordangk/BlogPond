import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { z } from "zod";

export const FrontmatterSchema = z.object({
  slug: z.string().min(1).optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  excerpt: z.string().optional(),
  status: z.enum(["draft", "scheduled", "published"]).default("draft"),
  publishedAt: z
    .union([z.string(), z.date()])
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  scheduledFor: z
    .union([z.string(), z.date()])
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  coverImage: z.string().optional(),
  author: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export type Frontmatter = z.infer<typeof FrontmatterSchema>;

export function parseMarkdown(raw: string): {
  data: Frontmatter;
  content: string;
} {
  const parsed = matter(raw);
  const data = FrontmatterSchema.parse(parsed.data);
  return { data, content: parsed.content };
}

export async function renderMarkdown(md: string): Promise<string> {
  const file = await remark().use(remarkGfm).use(remarkHtml).process(md);
  return String(file);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function serializeFrontmatter(fm: {
  slug: string;
  title: string;
  description?: string | null;
  excerpt?: string | null;
  status: string;
  publishedAt?: Date | null;
  scheduledFor?: Date | null;
  coverImage?: string | null;
  author?: string | null;
  tags: string[];
}): string {
  const lines = [
    "---",
    `slug: ${fm.slug}`,
    `title: ${JSON.stringify(fm.title)}`,
  ];
  if (fm.description) lines.push(`description: ${JSON.stringify(fm.description)}`);
  if (fm.excerpt) lines.push(`excerpt: ${JSON.stringify(fm.excerpt)}`);
  lines.push(`status: ${fm.status}`);
  if (fm.publishedAt) lines.push(`publishedAt: ${fm.publishedAt.toISOString()}`);
  if (fm.scheduledFor)
    lines.push(`scheduledFor: ${fm.scheduledFor.toISOString()}`);
  if (fm.coverImage) lines.push(`coverImage: ${JSON.stringify(fm.coverImage)}`);
  if (fm.author) lines.push(`author: ${JSON.stringify(fm.author)}`);
  lines.push(`tags: [${fm.tags.map((t) => JSON.stringify(t)).join(", ")}]`);
  lines.push("---");
  return lines.join("\n");
}

export function excerptFrom(markdown: string, max = 180): string {
  const stripped = markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (stripped.length <= max) return stripped;
  return stripped.slice(0, max).replace(/\s+\S*$/, "") + "…";
}
