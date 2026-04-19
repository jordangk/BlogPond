import { theme } from "@/theme.config";

export function ThemeVars() {
  const c = theme.colors;
  const d = theme.dark;
  const f = theme.fonts;
  const l = theme.layout;

  const css = `
:root {
  --background: ${c.background};
  --foreground: ${c.foreground};
  --muted: ${c.muted};
  --muted-surface: ${c.mutedSurface};
  --border: ${c.border};
  --accent: ${c.accent};
  --accent-foreground: ${c.accentForeground};
  --card: ${c.card};
  --font-sans: var(${f.sansVar});
  --font-mono: var(${f.monoVar});
  --font-heading: var(${f.headingVar});
  --heading-weight: ${f.headingWeight};
  --heading-tracking: ${f.headingTracking === "tight" ? "-0.02em" : f.headingTracking === "wide" ? "0.02em" : "0"};
  --radius: ${l.radius};
}
@media (prefers-color-scheme: dark) {
  :root {
    --background: ${d.background};
    --foreground: ${d.foreground};
    --muted: ${d.muted};
    --muted-surface: ${d.mutedSurface};
    --border: ${d.border};
    --accent: ${d.accent};
    --accent-foreground: ${d.accentForeground};
    --card: ${d.card};
  }
}
`.trim();

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
