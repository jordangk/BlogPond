import type { Theme } from "./types";
import { FONT_VARS } from "./types";

export const newspaper: Theme = {
  name: "newspaper",
  description:
    "Old-school serif everywhere, black on off-white, boxy, no rounded corners.",
  colors: {
    background: "#f6f3eb",
    foreground: "#0a0a0a",
    muted: "#525252",
    mutedSurface: "#ece7da",
    border: "#171717",
    accent: "#0a0a0a",
    accentForeground: "#f6f3eb",
    card: "#f6f3eb",
  },
  dark: {
    background: "#0a0a0a",
    foreground: "#f6f3eb",
    muted: "#a3a3a3",
    mutedSurface: "#171717",
    border: "#f6f3eb",
    accent: "#f6f3eb",
    accentForeground: "#0a0a0a",
    card: "#0a0a0a",
  },
  fonts: {
    sansVar: FONT_VARS.merriweather,
    monoVar: FONT_VARS.jetbrainsMono,
    headingVar: FONT_VARS.merriweather,
    headingWeight: 800,
    headingTracking: "tight",
  },
  layout: {
    maxWidthClass: "max-w-5xl",
    contentMaxWidthClass: "max-w-2xl",
    radius: "0rem",
    sectionGap: "2.5rem",
  },
  features: {
    stickyHeader: false,
    showTagStrip: false,
    showHero: true,
    showFeaturedCard: true,
    showSidebarCategories: false,
    footerVariant: "minimal",
    showReadingTime: true,
    heroStyle: "plain",
  },
};
