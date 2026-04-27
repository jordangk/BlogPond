import { Liquid } from "liquidjs";
import type { Page } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/site.config";
import { site } from "@/lib/site";

const engine = new Liquid({
  cache: process.env.NODE_ENV === "production",
  jsTruthy: true,
});

// Convenience filters that mirror common Shopify/Liquid usage.
engine.registerFilter("limit", (arr: unknown[], n: number) =>
  Array.isArray(arr) ? arr.slice(0, n) : arr,
);
engine.registerFilter(
  "where",
  (arr: Record<string, unknown>[], key: string, value: unknown) =>
    Array.isArray(arr) ? arr.filter((item) => item?.[key] === value) : arr,
);
engine.registerFilter("date", (input: unknown, fmt?: string) => {
  if (!input) return "";
  const d = input instanceof Date ? input : new Date(String(input));
  if (Number.isNaN(d.getTime())) return "";
  if (!fmt) return d.toLocaleDateString();
  // very small subset of strftime
  return fmt
    .replace("%Y", String(d.getFullYear()))
    .replace("%m", String(d.getMonth() + 1).padStart(2, "0"))
    .replace("%d", String(d.getDate()).padStart(2, "0"))
    .replace("%B", d.toLocaleString(undefined, { month: "long" }))
    .replace("%b", d.toLocaleString(undefined, { month: "short" }));
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function buildDrops(page: Page) {
  const data = page.liquidData ? safeJson(page.liquidData) : {};
  const recentPosts = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    take: 50,
    include: { tags: true },
  });
  return {
    site: {
      name: site.name,
      url: site.url,
      description: site.description,
      logo: siteConfig.logo,
      copyright: siteConfig.copyright,
    },
    nav: siteConfig.nav,
    footerColumns: siteConfig.footerColumns,
    primaryCTA: siteConfig.primaryCTA,
    page: {
      slug: page.slug,
      title: page.title,
      description: page.description,
      coverImage: page.coverImage,
      url: `${site.url}/p/${page.slug}`,
    },
    posts: recentPosts.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      excerpt: p.excerpt,
      url: `${site.url}/posts/${p.slug}`,
      publishedAt: p.publishedAt,
      author: p.author,
      tags: p.tags.map((t) => ({ name: t.name, slug: t.slug })),
    })),
    data,
  };
}

function safeJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}

export async function renderLiquidPage(page: Page): Promise<string> {
  const drops = await buildDrops(page);
  const body = await engine.parseAndRender(page.liquidSource ?? "", drops);
  const css = page.liquidCss ?? "";
  const title = `${page.title} — ${site.name}`;
  const desc = page.description ?? site.description;
  const url = `${site.url}/p/${page.slug}`;

  const ogImage = page.coverImage
    ? `<meta property="og:image" content="${escapeHtml(page.coverImage)}" />`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(desc)}" />
<link rel="canonical" href="${escapeHtml(url)}" />
<meta property="og:title" content="${escapeHtml(page.title)}" />
<meta property="og:description" content="${escapeHtml(desc)}" />
<meta property="og:url" content="${escapeHtml(url)}" />
<meta property="og:type" content="website" />
${ogImage}
<style>
*,*::before,*::after{box-sizing:border-box}
html,body{margin:0;padding:0}
body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.5;color:#171717;background:#fff}
img{max-width:100%;height:auto;display:block}
${css}
</style>
</head>
<body>
${body}
</body>
</html>`;
}
