import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { summarizeGithubReadme } from "@/lib/chain";

const TABLE = "api_keys";

export async function POST(request) {
  try {
    const apiKey = request.headers.get("x-api-key")?.trim() ?? "";

    if (!apiKey) {
      return NextResponse.json(
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
      return NextResponse.json(
        {
          valid: false,
          error: "Invalid API key",
          ...(detail && { detail }),
        },
        { status: 401 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { valid: false, error: "Invalid API key" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const githubUrl = body?.githubUrl?.trim();
    if (!githubUrl) {
      return NextResponse.json(
        { valid: false, error: "Missing githubUrl in request body" },
        { status: 400 }
      );
    }

    const readmeContent = await fetchGithubReadme(githubUrl);
    const result = await summarizeGithubReadme(readmeContent);
    return NextResponse.json({ valid: true, ...result });
  } catch (err) {
    const isDev = process.env.NODE_ENV === "development";
    return NextResponse.json(
      {
        valid: false,
        error: "Invalid request body",
        ...(isDev && err instanceof Error && { detail: err.message }),
      },
      { status: 400 }
    );
  }
}

/**
 * Fetches the README.md content from a given GitHub repository URL.
 * @param {string} githubUrl - The GitHub repository URL (https://github.com/:owner/:repo).
 * @returns {Promise<string>} The content of the README.md file.
 */
async function fetchGithubReadme(githubUrl) {
  const urlPattern = /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\/|$)/;
  const match = githubUrl.match(urlPattern);
  if (!match) {
    throw new Error("Invalid GitHub URL format. Use https://github.com/:owner/:repo");
  }
  const [, owner, repo] = match;

  for (const branch of ["main", "master"]) {
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
    const res = await fetch(rawUrl);
    if (res.ok) return await res.text();
  }

  throw new Error("README.md not found in main or master branch for this repository.");
}