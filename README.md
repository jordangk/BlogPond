# Blog

AI-first blog CMS. Markdown content, SQLite + Prisma, Next.js 16 App Router, Tailwind v4, NextAuth credentials.

The primary author is an AI assistant (see `CLAUDE.md`). Humans log in to `/admin` to supervise, edit, and publish.

## Quick start

```bash
cp .env.example .env.local       # then edit SITE_URL, ADMIN_PASSWORD, AUTH_SECRET
npm install                       # also runs prisma generate
npm run db:migrate                # create the sqlite DB
npm run db:seed                   # seed admin user from .env
npm run dev
```

Open http://localhost:3000 for the blog, http://localhost:3000/admin to sign in.

## AI authoring

Full guide in [`CLAUDE.md`](./CLAUDE.md). Short version:

```bash
cp content/templates/standard-post.md content/drafts/my-post.md
# edit the file — frontmatter + markdown body
npm run post:sync -- content/drafts/my-post.md
npm run post:list
```

## Deployment

- Vercel: set env vars, add a Cron job hitting a route that calls `post:tick`
  (or run the CLI script on a schedule).
- Self-hosted: `npm run build && npm start` behind a reverse proxy. Run
  `npm run post:tick` every few minutes via cron/systemd.

For a hosted SQLite replacement consider Turso (libsql) or switch the Prisma
provider to `postgresql`.
