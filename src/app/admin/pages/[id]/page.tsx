import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageForm } from "../_form";
import { updatePage, deletePage } from "../_actions";

export const metadata = { robots: { index: false } };

export default async function EditPageRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) notFound();

  const update = updatePage.bind(null, id);
  const del = deletePage.bind(null, id);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit page</h1>
        <form action={del}>
          <button
            type="submit"
            className="text-sm text-red-600 hover:underline"
          >
            Delete
          </button>
        </form>
      </div>
      <PageForm action={update} submitLabel="Save" page={page} />
    </main>
  );
}
