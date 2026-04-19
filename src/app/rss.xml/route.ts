import { getPublishedPosts } from "@/lib/posts";
import { site } from "@/lib/site";

function escape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getPublishedPosts();
  const items = posts
    .map(
      (p) => `
    <item>
      <title>${escape(p.title)}</title>
      <link>${site.url}/posts/${p.slug}</link>
      <guid isPermaLink="true">${site.url}/posts/${p.slug}</guid>
      <pubDate>${p.publishedAt?.toUTCString() ?? ""}</pubDate>
      ${p.description ? `<description>${escape(p.description)}</description>` : ""}
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site.name)}</title>
    <link>${site.url}</link>
    <description>${escape(site.description)}</description>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
