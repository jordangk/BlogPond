import {
  Geist,
  Geist_Mono,
  Inter,
  JetBrains_Mono,
  Lora,
  Merriweather,
  Playfair_Display,
  Source_Serif_4,
} from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});
export const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});
export const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});
export const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});
export const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const allFontVariables = [
  geistSans.variable,
  geistMono.variable,
  inter.variable,
  jetbrainsMono.variable,
  lora.variable,
  merriweather.variable,
  playfair.variable,
  sourceSerif.variable,
].join(" ");
