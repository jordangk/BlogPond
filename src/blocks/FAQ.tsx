import { Section } from "./primitives";

export type FAQItem = { question: string; answer: string };

type FAQProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items: FAQItem[];
};

export function FAQ({
  eyebrow,
  title = "Frequently asked questions",
  subtitle,
  items,
}: FAQProps) {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
  return (
    <Section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <div className="mb-10 max-w-2xl">
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
            {eyebrow}
          </p>
        )}
        {title && <h2 className="text-3xl sm:text-4xl">{title}</h2>}
        {subtitle && <p className="mt-3 text-muted">{subtitle}</p>}
      </div>
      <dl className="divide-y divide-border">
        {items.map((q, i) => (
          <details key={i} className="group py-4">
            <summary className="flex cursor-pointer items-center justify-between text-left text-lg font-medium">
              {q.question}
              <span className="ml-4 text-muted transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-muted">{q.answer}</p>
          </details>
        ))}
      </dl>
    </Section>
  );
}
