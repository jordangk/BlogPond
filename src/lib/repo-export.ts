import { mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Page } from "@prisma/client";

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

/**
 * Write the page out to its template files. Does NOT git commit or push —
 * the working tree is updated and the user can review + commit when ready.
 * Gated by EXPORT_TO_REPO=1. Errors are logged, never thrown.
 */
export async function exportPageToRepo(page: Page): Promise<void> {
  if (!isEnabled()) return;
  try {
    await mkdir(TEMPLATE_DIR, { recursive: true });
    if (page.renderer === "liquid") {
      await writeFile(
        resolve(TEMPLATE_DIR, `${page.slug}.json`),
        pageToLiquidJson(page),
        "utf8",
      );
      await writeFile(
        resolve(TEMPLATE_DIR, `${page.slug}.liquid`),
        page.liquidSource ?? "",
        "utf8",
      );
      await writeFile(
        resolve(TEMPLATE_DIR, `${page.slug}.css`),
        page.liquidCss ?? "",
        "utf8",
      );
    } else {
      await writeFile(
        resolve(TEMPLATE_DIR, `${page.slug}.mdx`),
        pageToMdx(page),
        "utf8",
      );
    }
  } catch (e) {
    console.warn("[repo-export] failed:", (e as Error).message);
  }
}

/**
 * Remove the page's template files from disk. Does NOT git commit.
 */
export async function deletePageFromRepo(
  slug: string,
  renderer: string,
): Promise<void> {
  if (!isEnabled()) return;
  try {
    if (renderer === "liquid") {
      for (const ext of ["json", "liquid", "css"]) {
        await rm(resolve(TEMPLATE_DIR, `${slug}.${ext}`), { force: true });
      }
    } else {
      await rm(resolve(TEMPLATE_DIR, `${slug}.mdx`), { force: true });
    }
  } catch (e) {
    console.warn("[repo-export] delete failed:", (e as Error).message);
  }
}
