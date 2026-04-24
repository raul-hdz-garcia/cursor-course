"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

const TABLE = "api_keys";

function randomKey() {
  const a = Math.random().toString(16).slice(2);
  const b = Math.random().toString(16).slice(2);
  const c = Date.now().toString(16);
  return `dandi_${c}_${a}${b}`.slice(0, 48);
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function rowToItem(row) {
  return {
    id: row.id,
    name: row.name ?? "",
    key: row.key ?? "",
    prefix: row.prefix ?? "",
    createdAt: row.created_at ?? "",
    updatedAt: row.updated_at ?? "",
  };
}

export default function DashboardsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [actionError, setActionError] = useState(null);
  const copyTimerRef = useRef(null);

  const fetchKeys = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from(TABLE)
      .select("id, name, key, prefix, created_at, updated_at")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (fetchError) {
      setError(fetchError.message);
      setItems([]);
      return;
    }
    setItems((data ?? []).map(rowToItem));
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((x) => {
      return (
        (x.name || "").toLowerCase().includes(q) ||
        (x.prefix || "").toLowerCase().includes(q)
      );
    });
  }, [items, query]);

  async function createKey(e) {
    e.preventDefault();
    setActionError(null);
    const trimmed = name.trim();
    if (!trimmed) return;

    const key = randomKey();
    const now = new Date().toISOString();
    const row = {
      name: trimmed,
      key,
      prefix: key.slice(0, 12),
      created_at: now,
      updated_at: now,
    };
    const { data, error: insertError } = await supabase.from(TABLE).insert(row).select("id, name, key, prefix, created_at, updated_at").single();
    if (insertError) {
      setActionError(insertError.message);
      return;
    }
    setItems((prev) => [rowToItem(data), ...prev]);
    setName("");
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditingName(item.name || "");
    setActionError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingName("");
  }

  async function saveEdit(id) {
    setActionError(null);
    const trimmed = editingName.trim();
    if (!trimmed) return;
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from(TABLE)
      .update({ name: trimmed, updated_at: now })
      .eq("id", id);
    if (updateError) {
      setActionError(updateError.message);
      return;
    }
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, name: trimmed, updatedAt: now } : x))
    );
    cancelEdit();
  }

  async function regenerate(id) {
    setActionError(null);
    const key = randomKey();
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from(TABLE)
      .update({ key, prefix: key.slice(0, 12), updated_at: now })
      .eq("id", id);
    if (updateError) {
      setActionError(updateError.message);
      return;
    }
    setItems((prev) =>
      prev.map((x) =>
        x.id === id ? { ...x, key, prefix: key.slice(0, 12), updatedAt: now } : x
      )
    );
  }

  async function remove(id) {
    setActionError(null);
    const { error: deleteError } = await supabase.from(TABLE).delete().eq("id", id);
    if (deleteError) {
      setActionError(deleteError.message);
      return;
    }
    setItems((prev) => prev.filter((x) => x.id !== id));
    if (editingId === id) cancelEdit();
  }

  async function copyKey(item) {
    try {
      await navigator.clipboard.writeText(item.key);
      setCopiedId(item.id);
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopiedId(null), 1200);
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-0 w-full flex-1 bg-zinc-50 font-sans text-zinc-950 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto w-full min-w-0 max-w-5xl px-4 py-8 sm:px-6 sm:py-10 md:py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">API Key Dashboard</h1>
            <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
              Create, rename, rotate, copy, and delete API keys. Keys are stored in
              Supabase and synced across sessions.
            </p>
          </div>
          <div className="shrink-0 self-start sm:self-auto">
            <Link
              href="/"
              className="inline-flex h-10 min-h-10 w-full items-center justify-center rounded-full border border-white/10 bg-white px-4 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 sm:w-auto dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Back home
            </Link>
          </div>
        </div>

        {(error || actionError) && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
            {error ?? actionError}
          </div>
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-black/[.08] bg-white p-5 shadow-sm dark:border-white/[.12] dark:bg-zinc-950">
            <h2 className="text-base font-semibold">Create API key</h2>
            <form onSubmit={createKey} className="mt-4 flex flex-col gap-3">
              <label className="text-sm text-zinc-700 dark:text-zinc-300">
                Key name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Production server"
                  className="mt-2 w-full rounded-xl border border-black/[.08] bg-white px-4 py-3 text-sm outline-none ring-0 transition focus:border-black/20 dark:border-white/[.12] dark:bg-black dark:focus:border-white/30"
                />
              </label>
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
              >
                Create key
              </button>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                Tip: use “Rotate” periodically to regenerate a key.
              </p>
            </form>
          </section>

          <section className="rounded-2xl border border-black/[.08] bg-white p-5 shadow-sm dark:border-white/[.12] dark:bg-zinc-950">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold">Your keys</h2>
              <span className="text-xs text-zinc-500 dark:text-zinc-500">
                {items.length} total
              </span>
            </div>

            <div className="mt-4">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or prefix…"
                className="w-full rounded-xl border border-black/[.08] bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20 dark:border-white/[.12] dark:bg-black dark:focus:border-white/30"
              />
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {loading ? (
                <div className="rounded-xl border border-dashed border-black/[.10] p-4 text-sm text-zinc-600 dark:border-white/[.14] dark:text-zinc-400">
                  Loading keys…
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-xl border border-dashed border-black/[.10] p-4 text-sm text-zinc-600 dark:border-white/[.14] dark:text-zinc-400">
                  No keys yet. Create your first one on the left.
                </div>
              ) : (
                filtered.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-black/[.08] p-4 dark:border-white/[.12]"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        {editingId === item.id ? (
                          <div className="flex flex-col gap-2">
                            <input
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm outline-none transition focus:border-black/20 dark:border-white/[.12] dark:bg-black dark:focus:border-white/30"
                            />
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => saveEdit(item.id)}
                                className="inline-flex h-9 items-center justify-center rounded-full bg-zinc-900 px-4 text-xs font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                className="inline-flex h-9 items-center justify-center rounded-full border border-black/[.08] px-4 text-xs font-medium transition hover:bg-black/[.04] dark:border-white/[.12] dark:hover:bg-white/[.06]"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="text-sm font-semibold">{item.name}</div>
                            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                              Prefix: <span className="font-mono">{item.prefix}</span>
                            </div>
                          </>
                        )}

                        <div className="mt-3 break-all rounded-lg bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-700 [overflow-wrap:anywhere] dark:bg-black dark:text-zinc-300">
                          {item.key}
                        </div>
                        <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                          Created {formatDate(item.createdAt)} · Updated{" "}
                          {formatDate(item.updatedAt)}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 sm:justify-end">
                        <button
                          type="button"
                          onClick={() => copyKey(item)}
                          className="inline-flex h-9 items-center justify-center rounded-full border border-black/[.08] px-4 text-xs font-medium transition hover:bg-black/[.04] dark:border-white/[.12] dark:hover:bg-white/[.06]"
                        >
                          {copiedId === item.id ? "Copied" : "Copy"}
                        </button>
                        <button
                          type="button"
                          onClick={() => regenerate(item.id)}
                          className="inline-flex h-9 items-center justify-center rounded-full border border-black/[.08] px-4 text-xs font-medium transition hover:bg-black/[.04] dark:border-white/[.12] dark:hover:bg-white/[.06]"
                        >
                          Rotate
                        </button>
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="inline-flex h-9 items-center justify-center rounded-full border border-black/[.08] px-4 text-xs font-medium transition hover:bg-black/[.04] dark:border-white/[.12] dark:hover:bg-white/[.06]"
                        >
                          Rename
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(item.id)}
                          className="inline-flex h-9 items-center justify-center rounded-full border border-red-500/30 bg-red-50 px-4 text-xs font-medium text-red-700 transition hover:bg-red-100 dark:border-red-500/30 dark:bg-red-950/30 dark:text-red-200 dark:hover:bg-red-950/50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

