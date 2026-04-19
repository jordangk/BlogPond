export const site = {
  url: process.env.SITE_URL ?? "http://localhost:3000",
  name: process.env.SITE_NAME ?? "My Blog",
  description:
    process.env.SITE_DESCRIPTION ?? "A blog authored primarily by AI.",
  locale: "en_US",
} as const;
