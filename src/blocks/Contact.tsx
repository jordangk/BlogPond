import { Section } from "./primitives";

type ContactProps = {
  title?: string;
  subtitle?: string;
  email?: string;
  tone?: "default" | "muted";
};

export function Contact({
  title = "Get in touch",
  subtitle,
  email,
  tone = "muted",
}: ContactProps) {
  return (
    <Section tone={tone}>
      <div className="mx-auto max-w-xl">
        <h2 className="text-3xl sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-3 text-muted">{subtitle}</p>}
        <form
          method="post"
          action="/api/contact"
          className="mt-8 space-y-4"
        >
          {email && <input type="hidden" name="to" value={email} />}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-sm font-medium">Name</span>
              <input
                name="name"
                required
                className="w-full rounded-[var(--radius)] border border-border bg-background px-3 py-2 outline-none focus:border-foreground"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-[var(--radius)] border border-border bg-background px-3 py-2 outline-none focus:border-foreground"
              />
            </label>
          </div>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Message</span>
            <textarea
              name="message"
              rows={5}
              required
              className="w-full rounded-[var(--radius)] border border-border bg-background px-3 py-2 outline-none focus:border-foreground"
            />
          </label>
          <button
            type="submit"
            className="rounded-[var(--radius)] bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            Send
          </button>
        </form>
      </div>
    </Section>
  );
}
