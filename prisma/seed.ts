import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import matter from "gray-matter";

const prisma = new PrismaClient();

async function seedPageFromTemplate(name: string) {
  const path = resolve(`content/page-templates/${name}.mdx`);
  const raw = await readFile(path, "utf8");
  const { data, content } = matter(raw);
  const slug = String(data.slug ?? name);
  await prisma.page.upsert({
    where: { slug },
    update: {},
    create: {
      slug,
      title: String(data.title ?? name),
      description: data.description ?? null,
      content,
      template: String(data.template ?? "standard"),
      status: String(data.status ?? "published"),
      publishedAt: data.status === "published" ? new Date() : null,
      showInNav: Boolean(data.showInNav ?? false),
      navOrder: Number(data.navOrder ?? 0),
    },
  });
}

const DEMO_POSTS = [
  {
    slug: "welcome-to-blogpond",
    title: "Welcome to BlogPond",
    description:
      "BlogPond is an AI-first blog CMS — Claude writes, humans supervise. Here's a quick tour of what lives here and how it's built.",
    excerpt:
      "An AI-first blog CMS — Claude writes, humans supervise. Here's a quick tour.",
    status: "published",
    publishedAt: new Date(),
    author: "BlogPond",
    tags: ["meta", "getting-started"],
    content: `## What this is

BlogPond is a blog designed so that AI is the primary author and humans focus on editorial oversight. Posts are stored as Markdown, the schema is validated on every write, and every page ships with the OpenGraph, Twitter, and Schema.org metadata that search and AI answer engines expect.

## How posts get written

- **CLI:** drop a Markdown file in \`content/drafts/\`, run \`npm run post:sync\`.
- **REST API:** \`POST /api/posts\` with a Bearer token — ideal for agents.
- **Admin UI:** sign in at \`/admin\`, use the form, click publish.

All three paths write to the same Prisma-backed SQLite database. The DB is the source of truth.

## What's on the public site

- [Home](/) — hero, latest post, recent posts, categories, upcoming queue
- [Categories](/categories) — all topics
- [Upcoming](/schedule) — scheduled posts, visible to readers
- [RSS](/rss.xml) + [sitemap](/sitemap.xml) + [llms.txt](/llms.txt)

## Next steps

Sign into the admin panel, change the default password, and publish your first post.`,
  },
  {
    slug: "seo-checklist-for-ai-authored-posts",
    title: "An SEO checklist for AI-authored posts",
    description:
      "A short, opinionated checklist every AI-authored post should pass before being published — covering search engines and AI answer engines.",
    excerpt:
      "A short, opinionated checklist every AI-authored post should pass before publishing.",
    status: "published",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    author: "BlogPond",
    tags: ["seo", "writing"],
    content: `When the primary author is an LLM, the weak link is rarely the prose — it's the metadata discipline. Use this list on every post.

## The non-negotiables

1. **Title ≤ 60 characters.** Clear primary keyword, no clickbait.
2. **Description 140–160 characters.** Stands alone as a search snippet.
3. **Slug is kebab-case.** Readable, no stop words if avoidable.
4. **First paragraph restates the payoff.** The reader and the crawler both need it.
5. **Headings in order.** \`##\` then \`###\` — no skipping.
6. **2–5 relevant tags.** Enables internal linking.
7. **At least one internal link.** Point at another post or a category.
8. **Cover image with OG dimensions (1200×630).** Even a placeholder beats none.

## For AI answer engines specifically

- Include a short, self-contained **summary paragraph** in the first 200 words. That's the chunk that gets cited.
- Use **proper nouns** for people, products, places — LLMs cite specificity.
- Add a **data point or example** per section. It's what gets quoted.
- **Cite your sources** with full links; answer engines preserve attribution.

## Don't

- Don't stuff keywords — modern rankers and LLMs both penalize it.
- Don't hide information behind expanders; crawlers may ignore hidden content.
- Don't write multiple \`<h1>\`s. One per page.

Run the checklist on every draft. Two minutes, fewer publish regrets.`,
  },
  {
    slug: "how-to-schedule-a-post",
    title: "How to schedule a post",
    description:
      "Pick a publish time, run one command, and forget it. The cron sweeper promotes scheduled posts automatically.",
    excerpt:
      "Pick a publish time, run one command, and forget it. Here's the flow end-to-end.",
    status: "scheduled",
    scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    author: "BlogPond",
    tags: ["howto", "workflow"],
    content: `Scheduling lets you queue a post to go live automatically. This post itself is scheduled to demonstrate the flow.

## Set the status

In the frontmatter of your draft:

\`\`\`yaml
status: scheduled
scheduledFor: 2026-05-01T09:00:00Z
\`\`\`

Then sync: \`npm run post:sync -- content/drafts/your-post.md\`. The post shows up on \`/schedule\` immediately.

## Let the sweeper promote it

A tiny script, \`npm run post:tick\`, flips any post whose \`scheduledFor\` has passed to \`status: published\`. Run it on a cron — Vercel Cron, GitHub Actions, or a systemd timer every 5 minutes works fine.

## Or flip it manually

\`npm run post:publish -- <slug>\` publishes immediately regardless of the scheduled time.`,
  },
];

async function main() {
  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { username },
    update: { passwordHash, mustChangePassword: true },
    create: { username, passwordHash, mustChangePassword: true },
  });
  console.log(`Admin user ready: ${username}`);

  const existingPages = await prisma.page.count();
  if (existingPages === 0) {
    for (const name of ["home", "about"]) {
      try {
        await seedPageFromTemplate(name);
        console.log(`Seeded page: ${name}`);
      } catch (e) {
        console.warn(`Could not seed page ${name}:`, (e as Error).message);
      }
    }
  } else {
    console.log(`${existingPages} page(s) already exist — skipping.`);
  }

  const liquidExists = await prisma.page.findUnique({
    where: { slug: "liquid-demo" },
  });
  if (!liquidExists) {
    await prisma.page.create({
      data: {
        slug: "liquid-demo",
        title: "Liquid renderer demo",
        description:
          "A self-contained page rendered by Liquid with inline CSS — no Tailwind chunks, no Next layout. Editable by GrapesJS.",
        renderer: "liquid",
        content: "(See liquidSource — this row uses the Liquid renderer.)",
        template: "landing",
        status: "published",
        publishedAt: new Date(),
        liquidCss: `
.wrap{max-width:960px;margin:0 auto;padding:48px 24px}
.hero{padding:64px 0;text-align:center}
.hero h1{font-size:48px;line-height:1.1;margin:0 0 16px}
.hero p{font-size:18px;color:#525252;max-width:640px;margin:0 auto 24px}
.btn{display:inline-block;padding:10px 18px;border-radius:8px;background:#171717;color:#fff;text-decoration:none;font-weight:500}
.btn-secondary{background:#fff;color:#171717;border:1px solid #e5e5e5;margin-left:8px}
.grid{display:grid;gap:24px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));margin:48px 0}
.card{padding:20px;border:1px solid #e5e5e5;border-radius:8px}
.card h3{margin:0 0 8px;font-size:18px}
.card p{margin:0;color:#525252;font-size:14px}
.muted{color:#525252;font-size:13px}
.section{padding:48px 0;border-top:1px solid #e5e5e5}
.section h2{font-size:28px;margin:0 0 24px}
.post{padding:12px 0;border-bottom:1px solid #f5f5f5}
.post a{color:inherit;text-decoration:none;font-weight:500}
.post a:hover{text-decoration:underline}
        `,
        liquidData: JSON.stringify({
          eyebrow: "Liquid renderer",
          ctaPrimary: { label: "View source", href: "/admin/pages" },
          ctaSecondary: { label: "Read the blog", href: "/blog" },
          features: [
            { title: "No asset chunks", body: "One self-contained HTML doc." },
            { title: "Inline CSS", body: "Saved per-page; survives any proxy." },
            { title: "Editable visually", body: "GrapesJS reads/writes html+css." },
          ],
        }),
        liquidSource: `<div class="wrap">
  <section class="hero">
    <p class="muted">{{ data.eyebrow }}</p>
    <h1>{{ page.title }}</h1>
    <p>{{ page.description }}</p>
    <p>
      <a class="btn" href="{{ data.ctaPrimary.href }}">{{ data.ctaPrimary.label }}</a>
      <a class="btn btn-secondary" href="{{ data.ctaSecondary.href }}">{{ data.ctaSecondary.label }}</a>
    </p>
  </section>

  <section class="section">
    <h2>What's different</h2>
    <div class="grid">
      {% for f in data.features %}
        <div class="card">
          <h3>{{ f.title }}</h3>
          <p>{{ f.body }}</p>
        </div>
      {% endfor %}
    </div>
  </section>

  <section class="section">
    <h2>Recent posts (live from the same DB)</h2>
    {% for post in posts | limit: 3 %}
      <div class="post">
        <a href="{{ post.url }}">{{ post.title }}</a>
        <div class="muted">{{ post.publishedAt | date: "%B %d, %Y" }}{% if post.author %} · {{ post.author }}{% endif %}</div>
      </div>
    {% endfor %}
    <p class="muted" style="margin-top:24px">Drops available: <code>site, page, posts, nav, footerColumns, primaryCTA, data</code>.</p>
  </section>
</div>`,
      },
    });
    console.log("Seeded liquid-demo page (renderer=liquid).");
  }

  const existingPosts = await prisma.post.count();
  if (existingPosts === 0) {
    for (const demo of DEMO_POSTS) {
      const tags = await Promise.all(
        demo.tags.map((name) =>
          prisma.tag.upsert({
            where: { slug: name.toLowerCase().replace(/\s+/g, "-") },
            update: {},
            create: {
              slug: name.toLowerCase().replace(/\s+/g, "-"),
              name,
            },
            select: { id: true },
          }),
        ),
      );
      await prisma.post.create({
        data: {
          slug: demo.slug,
          title: demo.title,
          description: demo.description,
          excerpt: demo.excerpt,
          content: demo.content,
          status: demo.status,
          publishedAt: demo.publishedAt ?? null,
          scheduledFor: demo.scheduledFor ?? null,
          author: demo.author,
          tags: { connect: tags.map((t) => ({ id: t.id })) },
        },
      });
    }
    console.log(`Seeded ${DEMO_POSTS.length} demo post(s).`);
  } else {
    console.log(
      `${existingPosts} post(s) already exist — skipping demo content.`,
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
