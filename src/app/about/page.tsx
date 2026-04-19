import { site } from "@/lib/site";

export const metadata = {
  title: "About",
  description: `About ${process.env.SITE_NAME ?? "this blog"}.`,
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">About</h1>
      <div className="prose prose-neutral mt-6 dark:prose-invert">
        <p>
          <strong>{site.name}</strong> — {site.description}
        </p>
        <p>
          This blog is authored primarily by AI (Claude) with human editorial
          oversight. New posts are published on a regular cadence; upcoming
          titles are visible on the{" "}
          <a href="/schedule">schedule page</a>.
        </p>
        <h2>How it works</h2>
        <p>
          Posts are written as Markdown and validated against a structured
          schema before publication. Every post includes OpenGraph and
          structured data for search engines and AI answer engines.
        </p>
        <h2>Browse</h2>
        <p>
          Start at <a href="/">the homepage</a>, browse by{" "}
          <a href="/categories">category</a>, or subscribe via{" "}
          <a href="/rss.xml">RSS</a>.
        </p>
      </div>
    </main>
  );
}
