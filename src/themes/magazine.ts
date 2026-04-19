import type { Theme } from "./types";
import { FONT_VARS } from "./types";

export const magazine: Theme = {
  name: "magazine",
  description:
    "Editorial feel: Playfair display headings, Source Serif body, generous spacing.",
  colors: {
    background: "#fbf9f5",
    foreground: "#1a1814",
    muted: "#6b6458",
    mutedSurface: "#f3eee4",
    border: "#d8cfbd",
    accent: "#8b1e1e",
    accentForeground: "#fbf9f5",
    card: "#ffffff",
  },
  dark: {
    background: "#141210",
    foreground: "#eeeae2",
    muted: "#a39b8b",
    mutedSurface: "#1d1b17",
    border: "#3a342a",
    accent: "#d4a574",
    accentForeground: "#141210",
    card: "#1d1b17",
  },
  fonts: {
    sansVar: FONT_VARS.inter,
    monoVar: FONT_VARS.jetbrainsMono,
    headingVar: FONT_VARS.playfair,
    headingWeight: 700,
    headingTracking: "tight",
  },
  layout: {
    maxWidthClass: "max-w-6xl",
    contentMaxWidthClass: "max-w-2xl",
    radius: "0.125rem",
    sectionGap: "4rem",
  },
  features: {
    stickyHeader: false,
    showTagStrip: true,
    showHero: true,
    showFeaturedCard: true,
    showSidebarCategories: true,
    footerVariant: "columns",
    showReadingTime: true,
    heroStyle: "accent",
  },
};
