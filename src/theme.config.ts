/**
 * Theme configuration for the blog.
 *
 * To change the entire look of the site, edit this file.
 *
 *   1. Swap which preset is active (edit `ACTIVE_THEME` below) or set the
 *      `THEME` env var in `.env.local`.
 *   2. Or: edit/create a preset in `src/themes/*.ts`.
 *   3. Or: override individual fields on the final `theme` export below.
 *
 * Every page, header, footer, and component reads from `theme`.
 * See CLAUDE.md ("Changing the design") for the full guide.
 */
import type { Theme } from "./themes/types";
import { minimal } from "./themes/minimal";
import { magazine } from "./themes/magazine";
import { newspaper } from "./themes/newspaper";
import { playful } from "./themes/playful";

export const themes = { minimal, magazine, newspaper, playful } as const;
export type ThemeName = keyof typeof themes;

// Edit this line to change the default preset when no THEME env var is set.
const ACTIVE_THEME: ThemeName = "minimal";

const envName = (process.env.THEME ?? "").toLowerCase() as ThemeName;
const picked =
  envName && envName in themes ? themes[envName] : themes[ACTIVE_THEME];

// To fine-tune the active theme without forking a preset, add overrides here.
// Example:  export const theme: Theme = { ...picked, colors: { ...picked.colors, accent: "#ff0066" } };
export const theme: Theme = picked;

export type { Theme } from "./themes/types";
