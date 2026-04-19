import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

export const metadata = { robots: { index: false } };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <div className="min-h-full">
      {session ? (
        <div className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3 text-sm">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="font-semibold">Admin</Link>
              <Link href="/admin" className="hover:underline">Posts</Link>
              <Link href="/admin/pages" className="hover:underline">Pages</Link>
              <Link href="/admin/media" className="hover:underline">Media</Link>
              <Link href="/admin/settings" className="hover:underline">Settings</Link>
              <Link href="/" className="text-neutral-500 hover:underline">View site</Link>
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button
                type="submit"
                className="text-neutral-500 hover:text-foreground"
              >
                Sign out ({session.user?.name})
              </button>
            </form>
          </div>
        </div>
      ) : null}
      {children}
    </div>
  );
}

// Redirect signed-out users reaching any non-login admin path
export async function RedirectGate() {
  const session = await auth();
  if (!session) redirect("/admin/login");
}
