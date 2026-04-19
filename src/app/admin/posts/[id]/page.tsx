import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostForm } from "../_form";
import { updatePost, deletePost } from "../../_actions";

export const metadata = { robots: { index: false } };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { tags: true },
  });
  if (!post) notFound();

  const update = updatePost.bind(null, id);
  const del = deletePost.bind(null, id);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit post</h1>
        <form action={del}>
          <button
            type="submit"
            className="text-sm text-red-600 hover:underline"
          >
            Delete
          </button>
        </form>
      </div>
      <PostForm action={update} submitLabel="Save" post={post} />
    </main>
  );
}
