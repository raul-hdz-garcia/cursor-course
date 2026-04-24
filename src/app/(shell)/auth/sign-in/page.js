import { Suspense } from "react";
import SignInGate from "./SignInGate";

function SignInFallback() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-6 py-16 text-sm text-zinc-500 dark:text-zinc-400">
      Loading…
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInFallback />}>
      <SignInGate />
    </Suspense>
  );
}
