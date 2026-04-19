import type { Post, Tag } from "@prisma/client";

type Props = {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  post?: Post & { tags: Tag[] };
};

function toInputDateTime(d: Date | null | undefined): string {
  if (!d) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function PostForm({ action, submitLabel, post }: Props) {
  return (
    <form action={action} className="space-y-5">
      <Field label="Title">
        <input
          name="title"
          defaultValue={post?.title ?? ""}
          required
          className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 text-lg outline-none focus:border-neutral-500 dark:border-neutral-700"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Slug (url)">
          <input
            name="slug"
            defaultValue={post?.slug ?? ""}
            placeholder="auto-from-title"
            className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-neutral-500 dark:border-neutral-700"
          />
        </Field>
        <Field label="Author">
          <input
            name="author"
            defaultValue={post?.author ?? ""}
            className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 outline-none focus:border-neutral-500 dark:border-neutral-700"
          />
        </Field>
      </div>

      <Field
        label="Description (meta, ~155 chars)"
        hint="Shown in search results and social shares."
      >
        <textarea
          name="description"
          defaultValue={post?.description ?? ""}
          rows={2}
          className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 outline-none focus:border-neutral-500 dark:border-neutral-700"
        />
      </Field>

      <Field label="Excerpt (shown in lists)">
        <textarea
          name="excerpt"
          defaultValue={post?.excerpt ?? ""}
          rows={2}
          className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 outline-none focus:border-neutral-500 dark:border-neutral-700"
        />
      </Field>

      <Field label="Content (Markdown)">
        <textarea
          name="content"
          defaultValue={post?.content ?? ""}
          rows={24}
          className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-neutral-500 dark:border-neutral-700"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Status">
          <select
            name="status"
            defaultValue={post?.status ?? "draft"}
            className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 outline-none focus:border-neutral-500 dark:border-neutral-700"
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </Field>
        <Field label="Scheduled for" hint="Only used when status=scheduled">
          <input
            type="datetime-local"
            name="scheduledFor"
            defaultValue={toInputDateTime(post?.scheduledFor)}
            className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 outline-none focus:border-neutral-500 dark:border-neutral-700"
          />
        </Field>
        <Field label="Cover image URL">
          <input
            name="coverImage"
            defaultValue={post?.coverImage ?? ""}
            className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 outline-none focus:border-neutral-500 dark:border-neutral-700"
          />
        </Field>
      </div>

      <Field label="Tags (comma separated)">
        <input
          name="tags"
          defaultValue={post?.tags.map((t) => t.name).join(", ") ?? ""}
          className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 outline-none focus:border-neutral-500 dark:border-neutral-700"
        />
      </Field>

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
