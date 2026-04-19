import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-semibold">404</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
        That page doesn&apos;t exist (or isn&apos;t published yet).
      </p>
      <Link href="/" className="mt-6 text-sm underline">
        Back to home
      </Link>
    </main>
  );
}
