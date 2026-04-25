import type { NextConfig } from "next";

/**
 * Deploying behind a reverse-proxy path prefix?
 *
 *   Set BASE_PATH=/some/prefix at build & start time and Next.js will
 *   automatically rewrite every internal URL (_next/static/*, <Link>,
 *   <Image>, sitemap, etc.). Do NOT hardcode prefixes in MDX, blocks,
 *   or post content.
 *
 *   If your static assets are served from a different host (CDN), set
 *   ASSET_PREFIX to that origin (e.g. https://cdn.example.com).
 *
 * Trailing slashes are stripped to avoid double-prefix bugs.
 */
const stripTrailing = (s: string | undefined) =>
  s ? s.replace(/\/+$/, "") : s;

const basePath = stripTrailing(process.env.BASE_PATH) || undefined;
const assetPrefix = stripTrailing(process.env.ASSET_PREFIX) || undefined;

const nextConfig: NextConfig = {
  ...(basePath ? { basePath } : {}),
  ...(assetPrefix ? { assetPrefix } : {}),
};

export default nextConfig;
