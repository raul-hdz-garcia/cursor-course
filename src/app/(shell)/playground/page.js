"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const router = useRouter();

  function showToast(type, message) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = apiKey.trim();
    if (!trimmed) return;

    setLoading(true);
    setToast(null);

    const res = await fetch("/api/validate-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey: trimmed }),
    });

    let body;
    try {
      body = await res.json();
    } catch {
      body = {};
    }

    setLoading(false);

    if (res.ok && body?.valid) {
      showToast("success", "Valid api key, /protected can be accessed");
      setTimeout(() => router.push("/protected"), 800);
      return;
    }

    showToast("error", typeof body.error === "string" ? body.error : "Invalid API key");
  }

  return (
    <div className="min-h-0 w-full min-w-0 flex-1 p-4 sm:p-6 md:p-10">
      <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        API Playground
      </h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Enter your API key to validate and access the protected area.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-md min-w-0">
        <label htmlFor="api-key" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          API Key
        </label>
        <input
          id="api-key"
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="dandi_..."
          className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-950 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500"
          disabled={loading}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "Validating…" : "Validate API Key"}
        </button>
      </form>

      {toast && (
        <div
          role="alert"
          className={`fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm rounded-lg px-4 py-3 text-center text-sm font-medium shadow-lg [padding-bottom:max(1rem,env(safe-area-inset-bottom))] [padding-left:max(1rem,env(safe-area-inset-left))] [padding-right:max(1rem,env(safe-area-inset-right))] sm:bottom-6 sm:left-auto sm:right-6 sm:mx-0 ${
            toast.type === "success"
              ? "bg-emerald-600 text-white dark:bg-emerald-500"
              : "bg-red-600 text-white dark:bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
