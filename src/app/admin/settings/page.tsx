import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Settings", robots: { index: false } };

async function updateCredentials(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.name) redirect("/admin/login");
  const currentUsername = session.user.name!;

  const newUsername = String(formData.get("username") ?? "").trim();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!newUsername) redirect("/admin/settings?error=username-required");
  if (!currentPassword) redirect("/admin/settings?error=current-required");
  if (!newPassword || newPassword.length < 8)
    redirect("/admin/settings?error=weak-password");
  if (newPassword !== confirmPassword)
    redirect("/admin/settings?error=mismatch");

  const user = await prisma.user.findUnique({
    where: { username: currentUsername },
  });
  if (!user) redirect("/admin/settings?error=not-found");

  const ok = await bcrypt.compare(currentPassword, user!.passwordHash);
  if (!ok) redirect("/admin/settings?error=wrong-current");

  if (newUsername !== currentUsername) {
    const taken = await prisma.user.findUnique({
      where: { username: newUsername },
    });
    if (taken) redirect("/admin/settings?error=username-taken");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user!.id },
    data: {
      username: newUsername,
      passwordHash,
      mustChangePassword: false,
    },
  });

  // Session carries old username in the JWT; force re-login.
  await signOut({ redirectTo: "/admin/login?changed=1" });
}

const ERRORS: Record<string, string> = {
  "username-required": "Username is required.",
  "current-required": "Current password is required.",
  "weak-password": "New password must be at least 8 characters.",
  mismatch: "New passwords don't match.",
  "not-found": "Account not found.",
  "wrong-current": "Current password is incorrect.",
  "username-taken": "That username is already taken.",
};

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; first?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");
  const { error, first } = await searchParams;

  const user = await prisma.user.findUnique({
    where: { username: session.user!.name! },
  });
  const forced = first === "1" || user?.mustChangePassword;

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Account settings</h1>
      {forced && (
        <div className="mt-4 rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          <strong>Security:</strong> You&apos;re using the default credentials.
          Change them before going live.
        </div>
      )}
      {error && ERRORS[error] && (
        <p className="mt-4 rounded bg-red-50 p-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {ERRORS[error]}
        </p>
      )}

      <form action={updateCredentials} className="mt-6 space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium">Username</span>
          <input
            name="username"
            defaultValue={session.user?.name ?? ""}
            required
            className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 outline-none focus:border-neutral-500 dark:border-neutral-700"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Current password</span>
          <input
            type="password"
            name="currentPassword"
            required
            autoComplete="current-password"
            className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 outline-none focus:border-neutral-500 dark:border-neutral-700"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">New password</span>
          <input
            type="password"
            name="newPassword"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 outline-none focus:border-neutral-500 dark:border-neutral-700"
          />
          <span className="block text-xs text-neutral-500">
            Minimum 8 characters.
          </span>
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Confirm new password</span>
          <input
            type="password"
            name="confirmPassword"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 outline-none focus:border-neutral-500 dark:border-neutral-700"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900"
        >
          Save (you&apos;ll be signed out)
        </button>
      </form>
    </main>
  );
}
