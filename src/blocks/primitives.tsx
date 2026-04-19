import type { ReactNode } from "react";

export function Section({
  children,
  className = "",
  tone = "default",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "muted" | "accent";
  id?: string;
}) {
  const bg =
    tone === "muted"
      ? "bg-muted-surface"
      : tone === "accent"
        ? "bg-accent text-accent-foreground"
        : "";
  return (
    <section id={id} className={`w-full py-16 sm:py-24 ${bg} ${className}`}>
      <div className="mx-auto max-w-5xl px-6">{children}</div>
    </section>
  );
}

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto max-w-5xl px-6 ${className}`}>{children}</div>;
}

export function Button({
  href,
  children,
  variant = "primary",
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center rounded-[var(--radius)] px-4 py-2 text-sm font-medium transition";
  const styles =
    variant === "primary"
      ? "bg-accent text-accent-foreground hover:opacity-90"
      : variant === "secondary"
        ? "border border-border bg-background hover:bg-muted-surface"
        : "hover:underline";
  return (
    <a
      href={href}
      className={`${base} ${styles}`}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-muted">
      {children}
    </p>
  );
}
