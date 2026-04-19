import type { Theme } from "./types";
import { FONT_VARS } from "./types";

export const playful: Theme = {
  name: "playful",
  description:
    "Rounded everything, Inter sans, a warm accent color, relaxed spacing.",
  colors: {
    background: "#fffaf3",
    foreground: "#1d1a17",
    muted: "#78716c",
    mutedSurface: "#fff3e0",
    border: "#f5e6cf",
    accent: "#f97316",
    accentForeground: "#ffffff",
    card: "#ffffff",
  },
  dark: {
    background: "#1a1714",
    foreground: "#fbf3e4",
    muted: "#a8a29e",
    mutedSurface: "#26211c",
    border: "#3d342a",
    accent: "#fb923c",
    accentForeground: "#1a1714",
    card: "#26211c",
  },
  fonts: {
    sansVar: FONT_VARS.inter,
    monoVar: FONT_VARS.jetbrainsMono,
    headingVar: FONT_VARS.inter,
    headingWeight: 700,
    headingTracking: "tight",
  },
  layout: {
    maxWidthClass: "max-w-5xl",
    contentMaxWidthClass: "max-w-3xl",
    radius: "1rem",
    sectionGap: "3rem",
  },
  features: {
    stickyHeader: true,
    showTagStrip: true,
    showHero: true,
    showFeaturedCard: true,
    showSidebarCategories: true,
    footerVariant: "columns",
    showReadingTime: true,
    heroStyle: "accent",
  },
};
