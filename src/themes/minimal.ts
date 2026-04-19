import type { Theme } from "./types";
import { FONT_VARS } from "./types";

export const minimal: Theme = {
  name: "minimal",
  description:
    "Clean grayscale, tight typography, subtle borders. Good default for most blogs.",
  colors: {
    background: "#ffffff",
    foreground: "#171717",
    muted: "#737373",
    mutedSurface: "#fafafa",
    border: "#e5e5e5",
    accent: "#171717",
    accentForeground: "#ffffff",
    card: "#ffffff",
  },
  dark: {
    background: "#0a0a0a",
    foreground: "#ededed",
    muted: "#a3a3a3",
    mutedSurface: "#111111",
    border: "#262626",
    accent: "#ededed",
    accentForeground: "#0a0a0a",
    card: "#0a0a0a",
  },
  fonts: {
    sansVar: FONT_VARS.geistSans,
    monoVar: FONT_VARS.geistMono,
    headingVar: FONT_VARS.geistSans,
    headingWeight: 600,
    headingTracking: "tight",
  },
  layout: {
    maxWidthClass: "max-w-5xl",
    contentMaxWidthClass: "max-w-3xl",
    radius: "0.5rem",
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
    heroStyle: "plain",
  },
};
