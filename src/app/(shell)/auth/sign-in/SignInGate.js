"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import GoogleSignInButton, { safeCallbackUrl } from "@/components/GoogleSignInButton";

export default function SignInGate() {
  const searchParams = useSearchParams();
  const callbackUrl = safeCallbackUrl(searchParams.get("callbackUrl"));

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-6 px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-black/[.08] bg-white p-8 text-center shadow-sm dark:border-white/[.12] dark:bg-zinc-950">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Sign in to continue
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          This page requires a Google account. Sign in to access the app, then you&apos;ll be
          redirected back to where you were going.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <GoogleSignInButton
            callbackUrl={callbackUrl}
            className="flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-full border border-solid border-black/[.08] px-5 text-sm font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
          />
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 underline-offset-4 hover:text-zinc-950 hover:underline dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
