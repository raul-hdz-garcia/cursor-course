import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { consumeApiKeyQuota, verifyApiKeyExists } from "@/lib/api-key-quota";
import { summarizeGithubReadme } from "@/lib/chain";
import { fetchGithubReadme } from "@/lib/github-readme";

/** CORS headers so browser-based clients (e.g. Postman Web) can call this API */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-api-key",
  "Access-Control-Max-Age": "86400",
};

function jsonWithCors(data, init = {}) {
  return NextResponse.json(data, {
    ...init,
    headers: { ...corsHeaders, ...init.headers },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request) {
  let body;
  try {
    const text = await request.text();
    body = text ? JSON.parse(text) : {};
  } catch {
    return jsonWithCors(
      { valid: false, error: "Invalid request body: must be valid JSON" },
      { status: 400 }
    );
  }

  try {
    const apiKey = request.headers.get("x-api-key")?.trim() ?? "";

    if (!apiKey) {
      return jsonWithCors(
        { valid: false, error: "Missing or empty x-api-key header" },
        { status: 400 }
      );
    }

    const supabase = getServerSupabase();
    const keyCheck = await verifyApiKeyExists(supabase, apiKey);

    if (!keyCheck.ok && keyCheck.reason === "db_error") {
      const isDev = process.env.NODE_ENV === "development";
      return jsonWithCors(
        {
          valid: false,
          error: "Failed to validate API key",
          ...(isDev && { detail: keyCheck.message }),
        },
        { status: 500 }
      );
    }

    if (!keyCheck.ok) {
      return jsonWithCors(
        { valid: false, error: "Invalid API key" },
        { status: 401 }
      );
    }

    const githubUrl = body?.githubUrl?.trim();
    if (!githubUrl) {
      return jsonWithCors(
        { valid: false, error: "Missing githubUrl in request body" },
        { status: 400 }
      );
    }

    const quota = await consumeApiKeyQuota(supabase, apiKey);

    if (!quota.ok && quota.reason === "rpc_error") {
      const isDev = process.env.NODE_ENV === "development";
      return jsonWithCors(
        {
          valid: false,
          error: "Failed to update API key usage",
          ...(isDev && { detail: quota.message }),
        },
        { status: 500 }
      );
    }

    if (!quota.ok && quota.reason === "invalid_key") {
      return jsonWithCors(
        { valid: false, error: "Invalid API key" },
        { status: 401 }
      );
    }

    if (!quota.ok && quota.reason === "rate_limited") {
      return jsonWithCors(
        {
          valid: false,
          error: "Rate limit exceeded for this API key",
        },
        { status: 429 }
      );
    }

    const readmeContent = await fetchGithubReadme(githubUrl);
    const result = await summarizeGithubReadme(readmeContent);
    return jsonWithCors({
      valid: true,
      usageQuota: {
        usage: quota.usage,
        usageLimit: quota.usageLimit,
      },
      ...result,
    });
  } catch (err) {
    const isDev = process.env.NODE_ENV === "development";
    const message = err instanceof Error ? err.message : "Request failed";
    return jsonWithCors(
      {
        valid: false,
        error: isDev ? message : "Request failed",
        ...(isDev && err instanceof Error && { detail: String(err) }),
      },
      { status: 500 }
    );
  }
}
