# Drafts

Put new posts here as `.md` files. Each file needs YAML frontmatter (see `../templates/`).

## Workflow

1. Copy a template from `../templates/` into this folder, or create a new `.md` file.
2. Fill in the frontmatter + body.
3. Run `npm run post:sync -- content/drafts/your-file.md` to push it to the DB.
4. Delete the draft file after syncing, or keep it as a backup (the DB is the source of truth once synced).

To pull an existing post back out for editing, run `npm run post:pull -- <slug>` — it writes `content/drafts/<slug>.md`.

See the top-level `CLAUDE.md` for the full AI authoring guide.
