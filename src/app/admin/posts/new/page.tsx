import { PostForm } from "../_form";
import { createPost } from "../../_actions";

export const metadata = { title: "New post", robots: { index: false } };

export default function NewPostPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold">New post</h1>
      <PostForm action={createPost} submitLabel="Create" />
    </main>
  );
}
