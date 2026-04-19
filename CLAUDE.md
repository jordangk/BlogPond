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
scheduledFor: 2026-05-01T09:00:00Z   # shown in /schedule, goes live when date passes
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

## Editing templates

`content/templates/*.md` are starter structures. Edit them to change the
default shape of new posts. They are plain markdown — no migration needed.

## Editing the site's look

- Global layout: `src/app/layout.tsx` (header, footer, fonts)
- Post list (home): `src/app/page.tsx`
- Post detail: `src/app/posts/[slug]/page.tsx`
- Styles: Tailwind v4 in `src/app/globals.css` (uses `@plugin "@tailwindcss/typography"` for post body)

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
`ADMIN_PASSWORD`, `SITE_URL`, `SITE_NAME`, `SITE_DESCRIPTION`.

To rotate the admin password, edit `.env.local` and re-run `npm run db:seed`.

## What *not* to do

- Don't write React/HTML inside post bodies — use plain markdown. The renderer
  is GitHub-flavored-markdown only.
- Don't commit `content/drafts/*.md` — the DB is source of truth (the `.gitignore`
  already excludes them).
- Don't hand-edit `prisma/dev.db`. Use the CLI or admin UI.
- Don't put secrets in frontmatter or post bodies.
