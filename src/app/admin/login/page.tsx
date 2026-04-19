import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin Login", robots: { index: false } };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const { error, callbackUrl } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");
    try {
      await signIn("credentials", {
        username,
        password,
        redirectTo: "/admin",
      });
    } catch (e) {
      if ((e as Error).message === "NEXT_REDIRECT") throw e;
      redirect("/admin/login?error=invalid");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6">
      <form
        action={login}
        className="w-full space-y-4 rounded-lg border border-neutral-200 p-8 shadow-sm dark:border-neutral-800"
      >
        <h1 className="text-2xl font-semibold">Sign in</h1>
        {error && (
          <p className="rounded bg-red-50 p-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            Invalid username or password.
          </p>
        )}
        <label className="block space-y-1">
          <span className="text-sm font-medium">Username</span>
          <input
            name="username"
            type="text"
            required
            autoComplete="username"
            className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 outline-none focus:border-neutral-500 dark:border-neutral-700"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Password</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 outline-none focus:border-neutral-500 dark:border-neutral-700"
          />
        </label>
        <input type="hidden" name="callbackUrl" value={callbackUrl ?? "/admin"} />
        <button
          type="submit"
          className="w-full rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
