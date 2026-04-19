import type { Page } from "@prisma/client";

type Props = {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  page?: Page;
};

export function PageForm({ action, submitLabel, page }: Props) {
  return (
    <form action={action} className="space-y-5">
      <Field label="Title">
        <input
          name="title"
          required
          defaultValue={page?.title ?? ""}
          className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 text-lg outline-none focus:border-neutral-500 dark:border-neutral-700"
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Slug (url path)">
          <input
            name="slug"
            defaultValue={page?.slug ?? ""}
            placeholder="auto-from-title"
            className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-neutral-500 dark:border-neutral-700"
          />
        </Field>
        <Field label="Cover image URL">
          <input
            name="coverImage"
            defaultValue={page?.coverImage ?? ""}
            className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 outline-none focus:border-neutral-500 dark:border-neutral-700"
          />
        </Field>
      </div>
      <Field label="Description (meta, ~155 chars)">
        <textarea
          name="description"
          rows={2}
          defaultValue={page?.description ?? ""}
          className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 outline-none focus:border-neutral-500 dark:border-neutral-700"
        />
      </Field>
      <Field
        label="MDX content"
        hint="Markdown + JSX blocks (Hero, Features, CTA, Pricing, FAQ, Testimonials, Gallery, Logos, Stats, Split, Contact, Prose)."
      >
        <textarea
          name="content"
          rows={28}
          required
          defaultValue={page?.content ?? ""}
          className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-neutral-500 dark:border-neutral-700"
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Template">
          <select
            name="template"
            defaultValue={page?.template ?? "standard"}
            className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 outline-none focus:border-neutral-500 dark:border-neutral-700"
          >
            <option value="standard">Standard (with title header)</option>
            <option value="landing">Landing (full-width, no header)</option>
            <option value="minimal">Minimal</option>
          </select>
        </Field>
        <Field label="Status">
          <select
            name="status"
            defaultValue={page?.status ?? "draft"}
            className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 outline-none focus:border-neutral-500 dark:border-neutral-700"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </Field>
        <Field label="Nav order" hint="lower = leftmost">
          <input
            type="number"
            name="navOrder"
            defaultValue={page?.navOrder ?? 0}
            className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 outline-none focus:border-neutral-500 dark:border-neutral-700"
          />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="showInNav"
          defaultChecked={page?.showInNav ?? false}
        />
        Show in main navigation
      </label>
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          className="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="block text-xs text-neutral-500">{hint}</span>}
    </label>
  );
}
