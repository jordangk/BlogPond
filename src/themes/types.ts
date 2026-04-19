export type ThemeColors = {
  background: string;
  foreground: string;
  muted: string;
  mutedSurface: string;
  border: string;
  accent: string;
  accentForeground: string;
  card: string;
};

export type ThemeFonts = {
  sansVar: string;
  monoVar: string;
  headingVar: string;
  headingWeight: 400 | 500 | 600 | 700 | 800;
  headingTracking: "tight" | "normal" | "wide";
};

export type ThemeLayout = {
  maxWidthClass: string;
  contentMaxWidthClass: string;
  radius: string;
  sectionGap: string;
};

export type ThemeFeatures = {
  stickyHeader: boolean;
  showTagStrip: boolean;
  showHero: boolean;
  showFeaturedCard: boolean;
  showSidebarCategories: boolean;
  footerVariant: "minimal" | "columns";
  showReadingTime: boolean;
  heroStyle: "plain" | "accent";
};

export type Theme = {
  name: string;
  description: string;
  colors: ThemeColors;
  dark: ThemeColors;
  fonts: ThemeFonts;
  layout: ThemeLayout;
  features: ThemeFeatures;
};

export const FONT_VARS = {
  geistSans: "--font-geist-sans",
  geistMono: "--font-geist-mono",
  inter: "--font-inter",
  merriweather: "--font-merriweather",
  playfair: "--font-playfair",
  sourceSerif: "--font-source-serif",
  lora: "--font-lora",
  jetbrainsMono: "--font-jetbrains-mono",
} as const;
