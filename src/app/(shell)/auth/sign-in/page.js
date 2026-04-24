import { Suspense } from "react";
import SignInGate from "./SignInGate";

function SignInFallback() {
  return (
    <div className="flex min-h-0 w-full flex-1 items-center justify-center px-4 py-10 text-sm text-zinc-500 sm:px-6 sm:py-16 dark:text-zinc-400">
      Loading…
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <Suspense fallback={<SignInFallback />}>
        <SignInGate />
      </Suspense>
    </div>
  );
}
