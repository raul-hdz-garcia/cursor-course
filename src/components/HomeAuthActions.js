"use client";

import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function HomeAuthActions() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <span className="flex h-10 items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
        Checking session…
      </span>
    );
  }

  if (session) {
    const label = session.user?.name ?? session.user?.email ?? "Signed in";
    const photo = session.user?.image;

    return (
      <div className="flex items-center gap-2">
        <div
          className="flex h-10 items-center justify-center gap-3 px-2 sm:justify-start"
          title={session.user?.email ?? label}
        >
          {photo ? (
            <Image
              src={photo}
              alt={`${label} profile photo`}
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-black/[.08] dark:ring-white/[.12]"
            />
          ) : (
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              aria-hidden
            >
              {(label.trim().charAt(0) || "?").toUpperCase()}
            </span>
          )}
          <span className="truncate text-sm text-zinc-600 dark:text-zinc-400 sm:max-w-[200px]">
            {label}
          </span>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex h-10 items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
        >
          Sign out
        </button>
      </div>
    );
  }

  return <GoogleSignInButton callbackUrl="/" />;
}
