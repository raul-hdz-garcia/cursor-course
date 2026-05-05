"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DEFAULT_GITHUB_URL = "https://github.com/raul-hdz-garcia/screenmatch-web-backend";

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState("");
  const [githubUrl, setGithubUrl] = useState(DEFAULT_GITHUB_URL);
  const [loading, setLoading] = useState(false);
  const [summarizeLoading, setSummarizeLoading] = useState(false);
  const [summarizeResult, setSummarizeResult] = useState(null);
  const [summarizeError, setSummarizeError] = useState(null);
  const [toast, setToast] = useState(null);

  const router = useRouter();

  function showToast(type, message) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleSummarize(e) {
    e.preventDefault();
    const key = apiKey.trim();
    const url = githubUrl.trim();
    if (!key) {
      showToast("error", "Enter an API key first");
      return;
    }
    if (!url) return;

    setSummarizeLoading(true);
    setSummarizeResult(null);
    setSummarizeError(null);
    setToast(null);

    try {
      const res = await fetch("/api/github-summarizer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
        },
        body: JSON.stringify({ githubUrl: url }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      setSummarizeLoading(false);

      if (!res.ok) {
        const msg =
          typeof data.error === "string" ? data.error : `Request failed (${res.status})`;
        setSummarizeError(msg);
        return;
      }

      if (data.valid === true) {
        setSummarizeResult(data);
        return;
      }

      setSummarizeError(typeof data.error === "string" ? data.error : "Unexpected response");
    } catch {
      setSummarizeLoading(false);
      setSummarizeError("Network error");
    }
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
        Enter your API key to validate access, or call{" "}
        <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">
          POST /api/github-summarizer
        </code>{" "}
        with a public GitHub repository URL.
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

      <form onSubmit={handleSummarize} className="mt-12 w-full max-w-2xl min-w-0 border-t border-zinc-200 pt-10 dark:border-zinc-700">
        <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">GitHub summarizer</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Sends your key as the{" "}
          <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">x-api-key</code>{" "}
          header and{" "}
          <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">
            {"{ githubUrl }"}
          </code>{" "}
          in the body.
        </p>

        <label htmlFor="github-url" className="mt-6 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          GitHub repository URL
        </label>
        <input
          id="github-url"
          type="url"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="https://github.com/owner/repo"
          className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-950 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500"
          disabled={summarizeLoading}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={summarizeLoading || !apiKey.trim() || !githubUrl.trim()}
          className="mt-4 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {summarizeLoading ? "Summarizing…" : "Summarize repository"}
        </button>

        <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950/50">
          <div className="border-b border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
            Response
          </div>
          <div className="min-h-[12rem] p-4">
            {summarizeLoading && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Fetching README and generating summary…</p>
            )}
            {summarizeError && !summarizeLoading && (
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                {summarizeError}
              </p>
            )}
            {summarizeResult && !summarizeLoading && (
              <div className="space-y-4 text-sm">
                {summarizeResult.usageQuota != null && (
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Usage: {summarizeResult.usageQuota.usage} / {summarizeResult.usageQuota.usageLimit}
                  </p>
                )}
                <div>
                  <h3 className="font-medium text-zinc-950 dark:text-zinc-50">Summary</h3>
                  <p className="mt-1 whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                    {summarizeResult.summary}
                  </p>
                </div>
                {Array.isArray(summarizeResult.cool_facts) && summarizeResult.cool_facts.length > 0 && (
                  <div>
                    <h3 className="font-medium text-zinc-950 dark:text-zinc-50">Cool facts</h3>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-zinc-700 dark:text-zinc-300">
                      {summarizeResult.cool_facts.map((fact, i) => (
                        <li key={i}>{fact}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <details className="text-zinc-600 dark:text-zinc-400">
                  <summary className="cursor-pointer text-xs font-medium">Raw JSON</summary>
                  <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-zinc-900 p-3 font-mono text-xs text-zinc-100 dark:bg-zinc-900">
                    {JSON.stringify(summarizeResult, null, 2)}
                  </pre>
                </details>
              </div>
            )}
            {!summarizeLoading && !summarizeError && !summarizeResult && (
              <p className="text-sm text-zinc-500 dark:text-zinc-500">
                Results appear here after you summarize a repository.
              </p>
            )}
          </div>
        </div>
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
