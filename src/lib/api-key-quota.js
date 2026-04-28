import { API_KEYS_TABLE } from "@/lib/api-key-utils";

const RPC_INCREMENT = "increment_api_key_usage";

function firstRpcRow(data) {
  if (data == null) return undefined;
  if (Array.isArray(data)) return data[0];
  return data;
}

function coerceQuota(row) {
  if (!row || typeof row !== "object") return null;
  const usage = Number(row.usage ?? row.USAGE);
  const usageLimit = Number(row.usage_limit ?? row.usageLimit ?? row.USAGE_LIMIT);
  if (!Number.isFinite(usage) || !Number.isFinite(usageLimit)) return null;
  return { usage, usageLimit };
}

/**
 * Confirms an API key secret exists (cheap lookup before validating body / consuming quota).
 *
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} apiKey
 * @returns {Promise<
 *   | { ok: true }
 *   | { ok: false; reason: "not_found" }
 *   | { ok: false; reason: "db_error"; message: string }
 * >}
 */
export async function verifyApiKeyExists(supabase, apiKey) {
  const { data, error } = await supabase
    .from(API_KEYS_TABLE)
    .select("id")
    .eq("key", apiKey)
    .maybeSingle();

  if (error) {
    return { ok: false, reason: "db_error", message: error.message };
  }
  if (!data) {
    return { ok: false, reason: "not_found" };
  }
  return { ok: true };
}

/**
 * Increments usage for this key and checks against usage_limit (increment-then-compare).
 * Calls `increment_api_key_usage` RPC when available; falls back to a direct row update by id.
 *
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} apiKey
 * @returns {Promise<
 *   | { ok: true; usage: number; usageLimit: number }
 *   | { ok: false; reason: "invalid_key" }
 *   | { ok: false; reason: "rate_limited"; usage: number; usageLimit: number }
 *   | { ok: false; reason: "rpc_error"; message: string }
 * >}
 */
export async function consumeApiKeyQuota(supabase, apiKey) {
  const { data: rpcData, error: rpcErr } = await supabase.rpc(RPC_INCREMENT, {
    p_key: apiKey,
  });

  if (!rpcErr) {
    const raw = firstRpcRow(rpcData);
    if (raw) {
      const parsed = coerceQuota(raw);
      if (parsed) {
        if (parsed.usage > parsed.usageLimit) {
          return {
            ok: false,
            reason: "rate_limited",
            usage: parsed.usage,
            usageLimit: parsed.usageLimit,
          };
        }
        return { ok: true, usage: parsed.usage, usageLimit: parsed.usageLimit };
      }
      return {
        ok: false,
        reason: "rpc_error",
        message:
          "increment_api_key_usage returned an unexpected payload; check the DB function.",
      };
    }
  }

  return incrementUsageDirect(supabase, apiKey);
}

/**
 * Bump usage by row id only (no `.eq("usage", …)` — avoids filters on column `usage` when value is 0).
 */
async function incrementUsageDirect(supabase, apiKey) {
  const { data: row, error: selErr } = await supabase
    .from(API_KEYS_TABLE)
    .select("id, usage, usage_limit")
    .eq("key", apiKey)
    .maybeSingle();

  if (selErr) {
    return {
      ok: false,
      reason: "rpc_error",
      message: selErr.message,
    };
  }
  if (!row) {
    return { ok: false, reason: "invalid_key" };
  }

  const prevUsage = Number(row.usage);
  const usageLimit = Number(row.usage_limit);
  if (!Number.isFinite(prevUsage) || !Number.isFinite(usageLimit)) {
    return {
      ok: false,
      reason: "rpc_error",
      message: "Invalid usage or usage_limit on api_keys row",
    };
  }

  const nextUsage = prevUsage + 1;
  const now = new Date().toISOString();

  const { data: updated, error: upErr } = await supabase
    .from(API_KEYS_TABLE)
    .update({
      usage: nextUsage,
      updated_at: now,
    })
    .eq("id", row.id)
    .select("usage, usage_limit")
    .maybeSingle();

  if (upErr) {
    return {
      ok: false,
      reason: "rpc_error",
      message: upErr.message,
    };
  }
  if (!updated) {
    return {
      ok: false,
      reason: "rpc_error",
      message: "Update returned no row (check RLS and privileges).",
    };
  }

  const u = Number(updated.usage);
  const ul = Number(updated.usage_limit);
  if (!Number.isFinite(u) || !Number.isFinite(ul)) {
    return {
      ok: false,
      reason: "rpc_error",
      message: "Invalid usage after update",
    };
  }

  if (u > ul) {
    return { ok: false, reason: "rate_limited", usage: u, usageLimit: ul };
  }

  return { ok: true, usage: u, usageLimit: ul };
}
