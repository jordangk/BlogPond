/**
 * Site chrome configuration.
 *
 * Everything non-visual about the site shell lives here: logo, navigation,
 * footer layout, primary CTA. For colors/fonts/spacing see `theme.config.ts`.
 *
 * AI authors: edit this file to add pages to the nav, change the CTA,
 * or restructure the footer. Every header/footer on the site reads from it.
 */

export type NavItem = { label: string; href: string; external?: boolean };

export type FooterColumn = { title: string; links: NavItem[] };

export type SiteConfig = {
  logo: {
    text: string;
    image?: string;
  };
  nav: NavItem[];
  footerColumns: FooterColumn[];
  primaryCTA?: NavItem;
  social: NavItem[];
  copyright: string;
};

export const siteConfig: SiteConfig = {
  logo: { text: process.env.SITE_NAME ?? "BlogPond" },

  nav: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Categories", href: "/categories" },
    { label: "About", href: "/about" },
  ],

  primaryCTA: { label: "Subscribe", href: "/rss.xml" },

  footerColumns: [
    {
      title: "Explore",
      links: [
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: "Categories", href: "/categories" },
        { label: "About", href: "/about" },
      ],
    },
    {
      title: "Follow",
      links: [
        { label: "RSS feed", href: "/rss.xml" },
        { label: "Sitemap", href: "/sitemap.xml" },
        { label: "llms.txt", href: "/llms.txt" },
      ],
    },
  ],

  social: [],

  copyright: `© ${new Date().getFullYear()} — Written with AI.`,
};
