@AGENTS.md

# AI authoring guide for this blog

This blog CMS is designed for you — an AI assistant — to be the primary author.
Humans mostly supervise, edit copy, and click publish. Follow this guide.

## How content is stored

- Posts live in a **SQLite DB** (`prisma/dev.db`) — the DB is the source of truth.
- Posts have markdown bodies + structured frontmatter (title, slug, status, tags, etc.).
- You author posts by writing `.md` files with YAML frontmatter, then syncing
  them into the DB with a CLI script.
- Templates you can copy from: `content/templates/*.md`.
- Your working drafts go in: `content/drafts/*.md` (gitignored).

## The authoring loop

### Create a new post

1. Copy a template: `cp content/templates/standard-post.md content/drafts/<slug>.md`
2. Edit the frontmatter (title, slug, description, tags) and the body.
3. Sync to DB: `npm run post:sync -- content/drafts/<slug>.md`
4. Verify: `npm run post:list`

### Edit an existing post

1. Pull it out: `npm run post:pull -- <slug>` → writes `content/drafts/<slug>.md`
2. Edit the file.
3. Sync it back: `npm run post:sync -- content/drafts/<slug>.md`

### Publish now / schedule / draft

Control via the `status` and date fields in frontmatter:

```yaml
status: draft          # not shown publicly
# ---
status: scheduled
scheduledFor: 2026-05-01T09:00:00Z   # queued privately; goes live at this time
# ---
status: published
publishedAt: 2026-04-18T10:00:00Z    # live on the public site immediately
```

Then `npm run post:sync -- <file>`. Or use the shortcut:

- `npm run post:publish -- <slug>` — flip a post to published *now*.
- `npm run post:tick` — promote any scheduled posts whose time has passed.
  Run this on a cron (e.g. Vercel Cron, GitHub Action).

## Frontmatter schema

See `src/lib/markdown.ts` (`FrontmatterSchema`). Fields:

| Field          | Required | Notes                                                              |
| -------------- | -------- | ------------------------------------------------------------------ |
| `title`        | yes      | Shown as `<h1>` and page title                                     |
| `slug`         | no       | Auto-derived from title if omitted                                 |
| `description`  | rec.     | ~155 chars, used for `<meta description>`, OG, Twitter             |
| `excerpt`      | no       | Shown in post lists; auto-derived from body if omitted             |
| `status`       | yes      | `draft` \| `scheduled` \| `published`                              |
| `publishedAt`  | if pub.  | ISO 8601 (e.g. `2026-04-18T10:00:00Z`)                             |
| `scheduledFor` | if sched | ISO 8601                                                           |
| `coverImage`   | no       | URL, used for OG image                                             |
| `author`       | no       | Display name                                                       |
| `tags`         | no       | `["foo", "bar"]`                                                   |

## SEO requirements for every post

You are expected to always produce SEO-ready posts. Checklist:

- [ ] `title` is a clear, keyword-bearing headline (≤ 60 chars preferred)
- [ ] `description` is ~140–160 chars, stands alone as a search snippet
- [ ] `slug` is kebab-case, readable, no stop words if avoidable
- [ ] First paragraph restates the main keyword and the reader payoff
- [ ] Headings use `##` and `###` in logical hierarchy (no skipping levels)
- [ ] Internal links where natural (use `/posts/<other-slug>` or `/tags/<tag>`)
- [ ] External links use descriptive anchor text (not "click here")
- [ ] Add 2–5 relevant `tags`
- [ ] `coverImage` set if available (1200×630 for OG)

The site auto-generates: `sitemap.xml`, `robots.txt`, `rss.xml`,
OpenGraph + Twitter meta tags, and `BlogPosting` JSON-LD.
You do not need to add meta tags manually — just fill frontmatter well.

## REST API (preferred for programmatic authoring)

All endpoints require an API key. Send either header:

- `Authorization: Bearer $API_KEY`
- `X-API-Key: $API_KEY`

Key is set via the `API_KEY` env var. Generate with `openssl rand -hex 32`.

### Endpoints

| Method | Path                            | Purpose                                  |
| ------ | ------------------------------- | ---------------------------------------- |
| GET    | `/api/posts`                    | List posts. Query: `status`, `tag`, `limit` |
| POST   | `/api/posts`                    | Create a post                            |
| GET    | `/api/posts/:slug`              | Read one post (any status)               |
| PATCH  | `/api/posts/:slug`              | Partial update                           |
| DELETE | `/api/posts/:slug`              | Delete                                   |
| POST   | `/api/posts/:slug/publish`      | Flip to published now                    |
| GET    | `/api/tags`                     | List all tags with post counts           |

### Create a post

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My first API post",
    "description": "A 140–160 char search snippet.",
    "status": "published",
    "tags": ["howto", "api"],
    "content": "## Heading\n\nBody in markdown."
  }'
```

Body schema (`PostInput` in `src/lib/post-writes.ts`):

```ts
{
  title: string;           // required
  slug?: string;           // defaults to slugify(title)
  description?: string;
  excerpt?: string;        // defaults to auto-derived from content
  content: string;         // markdown, required
  status?: "draft" | "scheduled" | "published";  // default "draft"
  publishedAt?: string;    // ISO 8601; only used when status=published
  scheduledFor?: string;   // ISO 8601; only used when status=scheduled
  coverImage?: string;     // URL
  author?: string;
  tags?: string[];         // upserted automatically
}
```

### Update a post

PATCH accepts any subset of the same fields:

```bash
curl -X PATCH http://localhost:3000/api/posts/my-slug \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status":"published"}'
```

### Response shape

```json
{
  "post": {
    "id": "cl...",
    "slug": "my-slug",
    "title": "...",
    "status": "published",
    "publishedAt": "2026-04-19T12:34:56.789Z",
    "tags": ["howto", "api"],
    "...": "..."
  }
}
```

The API triggers `revalidatePath` on the affected pages — you do not need to restart or manually invalidate caches.

## Editing templates

`content/templates/*.md` are starter structures. Edit them to change the
default shape of new posts. They are plain markdown — no migration needed.

## Deploying behind a reverse-proxy path prefix

If the site is served at something like
`https://example.com/m/abc/sites/blogpond/` rather than the root,
set environment variables — **never** hardcode prefixes in MDX, blocks,
post content, or `<Link>` hrefs.

```bash
BASE_PATH="/m/abc/sites/blogpond"     # path prefix the proxy mounts
ASSET_PREFIX="https://cdn.example.com" # only if assets live on a CDN
SITE_URL="https://example.com/m/abc/sites/blogpond"  # full canonical URL
```

Next.js (configured in `next.config.ts`) automatically rewrites:
- every `_next/static/*` asset URL
- every internal `<Link href="/foo">` (becomes `/m/abc/sites/blogpond/foo`)
- `<Image>` srcs
- the sitemap, RSS, robots, and llms.txt routes

**The takeaway for AI authors:** always write hrefs and image paths as
if the site were at root (`/about`, `/posts/x`). Don't insert prefixes —
the framework adds them. If a deployed page is missing styles, the fix
is the env var, not the content.

## Pages (beyond the blog)

The site is a full website builder. Alongside blog posts, you have **pages**
authored in MDX — they live at arbitrary URLs (`/about`, `/pricing`, `/contact`)
and can use composable blocks alongside markdown prose.

### Anatomy of a page

```mdx
---
slug: pricing
title: "Pricing"
description: "Simple, transparent pricing."
template: landing           # standard | landing | minimal
status: published           # draft | published
showInNav: true             # show in header nav
navOrder: 30                # lower = leftmost
---

<Hero title="Simple pricing" subtitle="…" align="center" />
<Pricing tiers={[...]} />
<FAQ items={[...]} />
```

### Blocks

All blocks are auto-registered from `src/blocks/index.ts` and available inside
any MDX. Read each block's source file for exact prop types:

| Block           | Best for                                    |
| --------------- | ------------------------------------------- |
| `<Hero>`        | Top-of-page pitch                           |
| `<Features>`    | Icon grid of 3–4 feature points             |
| `<Split>`       | Image-left / text-right (or reverse)        |
| `<Stats>`       | Big numbers                                 |
| `<Pricing>`     | Tier comparison + CTA                       |
| `<FAQ>`         | Q&A list (emits FAQPage JSON-LD)            |
| `<Testimonials>`| Quote cards                                 |
| `<Gallery>`     | Image grid                                  |
| `<Logos>`       | Client / partner logo strip                 |
| `<CTA>`         | Call-to-action band                         |
| `<Contact>`     | Contact form posting to `/api/contact`      |
| `<Prose>`       | Long-form article wrapped in typography     |
| `<Section>`     | Generic wrapper (tone: default/muted/accent)|
| `<Button>`      | Styled link                                 |

To add a new block: create `src/blocks/<Name>.tsx`, export it from
`src/blocks/index.ts`, add to the `blockComponents` registry.

### Templates

`template` in frontmatter changes the layout:
- `standard` — renders title + description as a page header, content underneath
- `landing` — no auto-header, MDX fills the whole frame (use `<Hero>`)
- `minimal` — no header, tight spacing

Starter templates are in `content/page-templates/*.mdx`.

### The authoring loop

```bash
cp content/page-templates/pricing.mdx content/page-drafts/pricing.mdx
# edit it
npm run page:sync -- content/page-drafts/pricing.mdx
npm run page:list
```

Pull a page back for editing:

```bash
npm run page:pull -- pricing
```

### REST API for pages

| Method | Path                | Purpose           |
| ------ | ------------------- | ----------------- |
| GET    | `/api/pages`        | list (`?status=`) |
| POST   | `/api/pages`        | create            |
| GET    | `/api/pages/:slug`  | read              |
| PATCH  | `/api/pages/:slug`  | update            |
| DELETE | `/api/pages/:slug`  | delete            |

Same Bearer auth as posts.

### Root URL (`/`) behavior

If a page with `slug: home` exists, it's rendered at `/`. Otherwise `/`
redirects to `/blog`. To make `/` a proper landing, edit the
`content/page-templates/home.mdx` and resync, or edit the "home" page
directly in the admin UI.

## Sync admin edits back to template files

Set `EXPORT_TO_REPO=1` in `.env.local` and every page save (admin UI,
REST API, server action) writes the row out to
`content/page-templates/<slug>.{mdx | json+liquid+css}`.

**Disk only — no git commit, no git push.** You review with `git status`
and commit/push when you want a checkpoint. Deletes remove the matching
files. Errors are logged but never fail the save — DB stays the source
of truth.

CLI for one-off syncs:

```bash
npm run page:export -- <slug>     # export a single page
npm run page:export -- --all      # export every page in the DB
```

Off by default so local dev doesn't accidentally write template files
every time you save in the admin.

## Two renderers: MDX vs Liquid

Pages have a `renderer` field. Pick per page based on what's authoring it:

| Renderer | Use for                                          | URL          | Layout |
| -------- | ------------------------------------------------ | ------------ | ------ |
| `mdx`    | Designer/AI-authored pages with the block library | `/<slug>`    | wrapped by Next.js header/footer |
| `liquid` | Visually edited pages (GrapesJS) — totally self-contained HTML | `/p/<slug>` | none — the page IS the document |

### Liquid pages

Stored as three columns on `Page`:
- `liquidSource` — the Liquid template (HTML + `{{ }}` placeholders)
- `liquidCss` — CSS string, inlined into a `<style>` tag at render time
- `liquidData` — JSON blob (page-specific data), exposed inside the template as `data`

A request to `/p/<slug>` runs Liquid against these drops:

| Drop          | What it is                                       |
| ------------- | ------------------------------------------------ |
| `site`        | name, url, description, logo, copyright          |
| `page`        | slug, title, description, coverImage, url        |
| `data`        | the page's `liquidData` JSON (page-specific)     |
| `posts`       | up to 50 most-recent published posts             |
| `nav`         | `siteConfig.nav`                                 |
| `footerColumns` | `siteConfig.footerColumns`                     |
| `primaryCTA`  | `siteConfig.primaryCTA`                          |

Built-in filters: `limit`, `where`, `date` (with `%Y %m %d %B %b` tokens).

Example: `/p/liquid-demo` is seeded as a working reference. View its
`liquidSource`, `liquidCss`, `liquidData` in `/admin/pages` (it has no MDX
content; the renderer reads the Liquid columns directly).

When to pick which:
- Use **MDX** for posts and SEO-tuned structured pages (sitemap, JSON-LD,
  ISR work better here).
- Use **Liquid** when the page must be a single self-contained HTML doc
  (no `_next/static/*.css` chunks), survive arbitrary reverse proxies,
  and be edited by humans in a visual builder (GrapesJS).

For GrapesJS integration: save `editor.getHtml()` into `liquidSource`
and `editor.getCss()` into `liquidCss`. Use `{{ }}` placeholders in the
HTML where you want dynamic data.

## Site chrome (nav, footer, logo)

Edit `src/site.config.ts`:

```ts
export const siteConfig: SiteConfig = {
  logo: { text: "YourBrand" },
  nav: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Pricing", href: "/pricing" },
  ],
  primaryCTA: { label: "Get started", href: "/contact" },
  footerColumns: [...],
  copyright: "© 2026 …",
};
```

Any page with `showInNav: true` is **automatically** added to the header nav
after the static entries (sorted by `navOrder`). You don't need to edit
site.config when adding nav-visible pages.

## Media uploads

Local filesystem for now (saves to `public/uploads/`). Admin UI at
`/admin/media`. REST:

```bash
curl -X POST http://localhost:3000/api/media \
  -H "Authorization: Bearer $API_KEY" \
  -F file=@image.jpg -F alt="description"
```

Response includes a URL like `/uploads/image-abcd.jpg` — use it in MDX or
post frontmatter as `coverImage`.

For production on Vercel (no persistent disk) swap `src/lib/media.ts` to
upload to S3/R2/Blob storage. The `Media` model and API shape stay the same.

## Changing the design

**Everything visual is controlled by one file:** `src/theme.config.ts`.
It exports a typed `theme` object. Every page, header, footer, card, and
color class reads from it. You can change the entire look of the site without
touching a single component.

### The three ways to change the look

1. **Switch presets** — fastest. In `.env.local`:
   ```
   THEME=magazine   # one of: minimal | magazine | newspaper | playful
   ```
   Then restart the dev server.

2. **Tweak one field** — edit the bottom of `src/theme.config.ts`:
   ```ts
   export const theme: Theme = {
     ...picked,
     colors: { ...picked.colors, accent: "#ff0066" },
   };
   ```

3. **Edit a preset** — in `src/themes/<name>.ts`. Change colors, fonts,
   radii, feature flags.

### Theme shape (see `src/themes/types.ts`)

```ts
type Theme = {
  colors: {        // both `colors` (light) and `dark` override
    background, foreground,
    muted, mutedSurface,
    border,
    accent, accentForeground,
    card,
  };
  fonts: {
    sansVar, monoVar, headingVar,       // CSS variables from next/font
    headingWeight, headingTracking,
  };
  layout: {
    maxWidthClass,          // header/home/category page width (Tailwind class)
    contentMaxWidthClass,   // article/post width
    radius,                 // used via rounded-[var(--radius)]
  };
  features: {
    stickyHeader,
    showTagStrip,           // horizontal tag strip in the header
    showHero,               // home hero section
    showFeaturedCard,       // big "Latest" card on the home page
    showSidebarCategories,  // 3-col home layout with sidebar
    footerVariant,          // "minimal" | "columns"
    showReadingTime,
    heroStyle,              // "plain" | "accent" (accent uses bg-muted-surface)
  };
};
```

### How colors flow

- The theme defines hex colors.
- `src/components/theme-vars.tsx` emits a `<style>` tag that sets CSS
  variables on `:root` (including a dark-mode override).
- `src/app/globals.css` maps those CSS vars to Tailwind theme tokens via
  `@theme inline`, so classes like `bg-background`, `text-foreground`,
  `text-muted`, `border-border`, `bg-card`, `bg-muted-surface` just work.
- Components only use **semantic color classes** — never hardcoded
  `bg-neutral-50` / `text-neutral-600` etc.

### How fonts flow

- All supported fonts are loaded once in `src/lib/fonts.ts` using
  `next/font/google`. Each exposes a CSS variable.
- The theme picks which variable is active (`fonts.sansVar`,
  `fonts.headingVar`, `fonts.monoVar`).
- `theme-vars.tsx` sets `--font-sans`, `--font-heading`, `--font-mono` to
  those variables. `globals.css` applies them and sets heading weight +
  tracking automatically.

To add a new font: add it to `src/lib/fonts.ts`, add the variable name to
`FONT_VARS` in `src/themes/types.ts`, and reference it from a preset.

### Feature flags vs. hand-editing

For cosmetic changes, prefer flags (`theme.features.showHero = false`).
For structural changes (new homepage section, different post layout),
edit the component file — but read from `theme` for colors, widths, fonts.

## Useful commands

```bash
npm run dev                 # start dev server on :3000
npm run build               # production build (runs prisma generate first)
npm run db:migrate          # apply schema changes
npm run db:seed             # (re)create the admin user from .env
npm run db:studio           # browse the DB in a GUI

npm run post:list                                    # all posts + status
npm run post:list -- --status=scheduled              # filter
npm run post:sync -- content/drafts/<slug>.md        # push draft → DB
npm run post:sync -- content/drafts/<slug>.md --delete-after
npm run post:pull -- <slug>                          # DB → content/drafts/<slug>.md
npm run post:publish -- <slug>                       # flip to published now
npm run post:tick                                    # release any due scheduled posts
```

## Environment variables

See `.env.example`. Required: `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_USERNAME`,
`ADMIN_PASSWORD`, `SITE_URL`, `SITE_NAME`, `SITE_DESCRIPTION`, `API_KEY`.

To rotate the admin password, sign into `/admin/settings` and change it there
(recommended). Re-seeding via `npm run db:seed` sets `mustChangePassword=true`
and forces a change on next login.

## What *not* to do

- Don't write React/HTML inside post bodies — use plain markdown. The renderer
  is GitHub-flavored-markdown only.
- Don't commit `content/drafts/*.md` — the DB is source of truth (the `.gitignore`
  already excludes them).
- Don't hand-edit `prisma/dev.db`. Use the CLI or admin UI.
- Don't put secrets in frontmatter or post bodies.
