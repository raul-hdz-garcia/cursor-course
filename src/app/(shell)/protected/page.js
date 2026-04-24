"use client";

import Link from "next/link";

export default function ProtectedPage() {
  return (
    <div className="min-h-0 w-full min-w-0 flex-1 p-4 sm:p-6 md:p-10">
      <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        Protected
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        You have accessed this page with a valid API key.
      </p>
      <Link
        href="/playground"
        className="mt-4 inline-block text-sm font-medium text-zinc-600 underline hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        Back to API Playground
      </Link>
    </div>
  );
}
