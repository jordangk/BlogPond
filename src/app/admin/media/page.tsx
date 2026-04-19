import { prisma } from "@/lib/prisma";
import { uploadMedia, deleteMedia } from "./_actions";

export const metadata = { title: "Media", robots: { index: false } };

export default async function MediaPage() {
  const items = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Media</h1>
      <form
        action={uploadMedia}
        encType="multipart/form-data"
        className="mb-10 flex flex-wrap items-end gap-3 rounded border border-neutral-200 p-4 dark:border-neutral-800"
      >
        <label className="flex-1 space-y-1">
          <span className="text-sm font-medium">File</span>
          <input
            type="file"
            name="file"
            required
            accept="image/*"
            className="block w-full text-sm"
          />
        </label>
        <label className="flex-1 space-y-1">
          <span className="text-sm font-medium">Alt text</span>
          <input
            name="alt"
            className="block w-full rounded border border-neutral-300 bg-transparent px-3 py-2 outline-none dark:border-neutral-700"
          />
        </label>
        <button
          type="submit"
          className="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900"
        >
          Upload
        </button>
      </form>

      {items.length === 0 ? (
        <p className="text-sm text-neutral-500">No media yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((m) => (
            <li
              key={m.id}
              className="rounded border border-neutral-200 p-2 text-xs dark:border-neutral-800"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.url}
                alt={m.alt ?? ""}
                className="mb-2 aspect-video w-full rounded object-cover"
              />
              <div className="truncate font-mono">{m.filename}</div>
              <div className="mt-1 flex items-center justify-between">
                <code className="truncate text-neutral-500">{m.url}</code>
                <form action={deleteMedia.bind(null, m.id)}>
                  <button
                    type="submit"
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
