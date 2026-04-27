import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { summarizeGithubReadme } from "@/lib/chain";
import { fetchGithubReadme } from "@/lib/github-readme";

const TABLE = "api_keys";

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
    const { data, error } = await supabase
      .from(TABLE)
      .select("id")
      .eq("key", apiKey)
      .maybeSingle();

    if (error) {
      const isDev = process.env.NODE_ENV === "development";
      const detail = isDev
        ? { message: error.message, ...(error.cause && { cause: String(error.cause) }) }
        : undefined;
      return jsonWithCors(
        {
          valid: false,
          error: "Invalid API key",
          ...(detail && { detail }),
        },
        { status: 401 }
      );
    }

    if (!data) {
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

    const readmeContent = await fetchGithubReadme(githubUrl);
    const result = await summarizeGithubReadme(readmeContent);
    return jsonWithCors({ valid: true, ...result });
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