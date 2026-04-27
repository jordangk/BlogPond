import { exec as execCb } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";
import type { Page } from "@prisma/client";

const exec = promisify(execCb);

const REPO_ROOT = process.cwd();
const TEMPLATE_DIR = resolve(REPO_ROOT, "content/page-templates");

function isEnabled(): boolean {
  return process.env.EXPORT_TO_REPO === "1";
}

function escapeYamlString(s: string): string {
  return JSON.stringify(s);
}

function pageToMdx(page: Page): string {
  const lines = [
    "---",
    `slug: ${page.slug}`,
    `title: ${escapeYamlString(page.title)}`,
  ];
  if (page.description) lines.push(`description: ${escapeYamlString(page.description)}`);
  lines.push(`template: ${page.template}`);
  lines.push(`status: ${page.status}`);
  if (page.publishedAt) lines.push(`publishedAt: ${page.publishedAt.toISOString()}`);
  lines.push(`showInNav: ${page.showInNav}`);
  lines.push(`navOrder: ${page.navOrder}`);
  if (page.coverImage) lines.push(`coverImage: ${escapeYamlString(page.coverImage)}`);
  lines.push("---");
  return `${lines.join("\n")}\n\n${page.content}\n`;
}

function pageToLiquidJson(page: Page): string {
  let data: unknown = {};
  if (page.liquidData) {
    try {
      data = JSON.parse(page.liquidData);
    } catch {
      data = {};
    }
  }
  return (
    JSON.stringify(
      {
        slug: page.slug,
        title: page.title,
        description: page.description,
        renderer: page.renderer,
        template: page.template,
        status: page.status,
        showInNav: page.showInNav,
        navOrder: page.navOrder,
        coverImage: page.coverImage,
        data,
      },
      null,
      2,
    ) + "\n"
  );
}

async function git(args: string): Promise<{ stdout: string; stderr: string }> {
  return exec(`git ${args}`, { cwd: REPO_ROOT, maxBuffer: 1024 * 1024 * 8 });
}

async function commitAndPush(files: string[], message: string): Promise<void> {
  if (files.length === 0) return;
  await git(`add ${files.map((f) => `"${f}"`).join(" ")}`);
  // No-op if nothing changed
  const { stdout: status } = await git("status --porcelain -- " + files.map((f) => `"${f}"`).join(" "));
  if (!status.trim()) return;
  const safeMessage = message.replace(/"/g, '\\"');
  await git(`commit -m "${safeMessage}"`);
  await git("push").catch(async (err: Error) => {
    console.warn("[repo-export] push failed:", err.message);
  });
}

/**
 * Write the page out to its template files and (if EXPORT_TO_REPO=1)
 * commit + push. Errors are logged, never thrown — saves must not fail
 * if git is unhappy.
 */
export async function exportPageToRepo(page: Page): Promise<void> {
  if (!isEnabled()) return;
  try {
    await mkdir(TEMPLATE_DIR, { recursive: true });
    const written: string[] = [];

    if (page.renderer === "liquid") {
      const jsonPath = resolve(TEMPLATE_DIR, `${page.slug}.json`);
      const liquidPath = resolve(TEMPLATE_DIR, `${page.slug}.liquid`);
      const cssPath = resolve(TEMPLATE_DIR, `${page.slug}.css`);
      await writeFile(jsonPath, pageToLiquidJson(page), "utf8");
      await writeFile(liquidPath, page.liquidSource ?? "", "utf8");
      await writeFile(cssPath, page.liquidCss ?? "", "utf8");
      written.push(jsonPath, liquidPath, cssPath);
    } else {
      const mdxPath = resolve(TEMPLATE_DIR, `${page.slug}.mdx`);
      await writeFile(mdxPath, pageToMdx(page), "utf8");
      written.push(mdxPath);
    }

    await commitAndPush(written, `Sync page from admin: ${page.slug}`);
  } catch (e) {
    console.warn("[repo-export] failed:", (e as Error).message);
  }
}

/**
 * Delete the page's template files from the repo and commit.
 */
export async function deletePageFromRepo(slug: string, renderer: string): Promise<void> {
  if (!isEnabled()) return;
  try {
    const removed: string[] = [];
    if (renderer === "liquid") {
      for (const ext of ["json", "liquid", "css"]) {
        const p = resolve(TEMPLATE_DIR, `${slug}.${ext}`);
        await rm(p, { force: true });
        removed.push(p);
      }
    } else {
      const p = resolve(TEMPLATE_DIR, `${slug}.mdx`);
      await rm(p, { force: true });
      removed.push(p);
    }
    await commitAndPush(removed, `Sync delete from admin: ${slug}`);
  } catch (e) {
    console.warn("[repo-export] delete failed:", (e as Error).message);
  }
}
