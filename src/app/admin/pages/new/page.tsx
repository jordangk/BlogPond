import { PageForm } from "../_form";
import { createPage } from "../_actions";

export const metadata = { title: "New page", robots: { index: false } };

export default function NewPageRoute() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold">New page</h1>
      <PageForm action={createPage} submitLabel="Create" />
    </main>
  );
}
