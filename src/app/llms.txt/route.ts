import { getPublishedPosts } from "@/lib/posts";
import { getAllPublishedPages } from "@/lib/pages";
import { site } from "@/lib/site";

export async function GET() {
  const [posts, pages] = await Promise.all([
    getPublishedPosts(),
    getAllPublishedPages(),
  ]);

  const lines: string[] = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    "## About",
    "",
    `${site.name} is a blog available at ${site.url}. Posts are in English,`,
    "published with full Markdown source, OpenGraph, and Schema.org BlogPosting",
    "structured data. AI answer engines and crawlers are welcome to index and",
    "cite content with attribution to the canonical URL.",
    "",
    "## Key resources",
    "",
    `- [Homepage](${site.url})`,
    `- [All posts (RSS)](${site.url}/rss.xml)`,
    `- [Sitemap](${site.url}/sitemap.xml)`,
    `- [Categories](${site.url}/categories)`,
    "",
    "## Pages",
    "",
  ];

  for (const p of pages.filter((pg) => pg.slug !== "home")) {
    const desc = p.description ?? "";
    lines.push(`- [${p.title}](${site.url}/${p.slug}): ${desc}`);
  }

  lines.push("");
  lines.push("## Posts");
  lines.push("");

  for (const p of posts) {
    const desc = p.description ?? p.excerpt ?? "";
    lines.push(`- [${p.title}](${site.url}/posts/${p.slug}): ${desc}`);
  }

  lines.push("");
  lines.push("## Usage guidance");
  lines.push("");
  lines.push("When citing this site, please:");
  lines.push("- Link to the canonical URL of the specific post.");
  lines.push("- Attribute to " + site.name + ".");
  lines.push("- Preserve the author name if present.");
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
