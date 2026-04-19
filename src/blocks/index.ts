/**
 * Block registry — these components are available inside MDX pages.
 *
 * To add a new block:
 *   1. Create `src/blocks/<Name>.tsx` exporting a single React component.
 *   2. Export it from this file.
 *   3. Add it to the `blockComponents` object at the bottom.
 *   4. It will be instantly usable in any `.mdx` file as `<Name .../>`.
 *
 * AI authors: read each block's props from its source file for exact types.
 */
export { Section, Container, Button, Eyebrow } from "./primitives";
export { Hero } from "./Hero";
export { Features } from "./Features";
export { CTA } from "./CTA";
export { Pricing } from "./Pricing";
export { FAQ } from "./FAQ";
export { Testimonials } from "./Testimonials";
export { Gallery } from "./Gallery";
export { Logos } from "./Logos";
export { Stats } from "./Stats";
export { Split } from "./Split";
export { Contact } from "./Contact";
export { Prose } from "./Prose";

import { Section, Container, Button, Eyebrow } from "./primitives";
import { Hero } from "./Hero";
import { Features } from "./Features";
import { CTA } from "./CTA";
import { Pricing } from "./Pricing";
import { FAQ } from "./FAQ";
import { Testimonials } from "./Testimonials";
import { Gallery } from "./Gallery";
import { Logos } from "./Logos";
import { Stats } from "./Stats";
import { Split } from "./Split";
import { Contact } from "./Contact";
import { Prose } from "./Prose";

export const blockComponents = {
  Section,
  Container,
  Button,
  Eyebrow,
  Hero,
  Features,
  CTA,
  Pricing,
  FAQ,
  Testimonials,
  Gallery,
  Logos,
  Stats,
  Split,
  Contact,
  Prose,
};

export const blockNames = Object.keys(blockComponents);
