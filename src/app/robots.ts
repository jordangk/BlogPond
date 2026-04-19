import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Explicitly allow AI answer-engine crawlers so posts can be cited in
// ChatGPT, Claude, Perplexity, Google AI Overviews, etc.
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "CCBot",
  "Bytespider",
  "Applebot-Extended",
  "Amazonbot",
  "DuckAssistBot",
  "MistralAI-User",
  "Cohere-AI",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
      ...AI_BOTS.map((bot) => ({
        userAgent: bot,
        allow: ["/", "/posts/", "/tags/", "/categories", "/about"],
        disallow: ["/admin", "/api"],
      })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
