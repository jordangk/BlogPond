import type { ReactNode } from "react";
import { Section } from "./primitives";

export function Prose({
  children,
  narrow = false,
}: {
  children: ReactNode;
  narrow?: boolean;
}) {
  return (
    <Section>
      <div className={narrow ? "mx-auto max-w-2xl" : "mx-auto max-w-3xl"}>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {children}
        </div>
      </div>
    </Section>
  );
}
