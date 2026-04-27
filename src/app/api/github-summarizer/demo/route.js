import { NextResponse } from "next/server";
import { summarizeGithubReadme } from "@/lib/chain";
import { fetchGithubReadme } from "@/lib/github-readme";

/**
 * Public demo: same summary as POST /api/github-summarizer, but no API key (server-only LLM + fetch).
 * For rate limiting / abuse protection in production, add edge middleware or a WAF rule.
 */
export async function POST(request) {
  let body;
  try {
    const text = await request.text();
    body = text ? JSON.parse(text) : {};
  } catch {
    return NextResponse.json(
      { valid: false, error: "Invalid request body: must be valid JSON" },
      { status: 400 }
    );
  }

  try {
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
    const message = err instanceof Error ? err.message : "Request failed";
    return NextResponse.json(
      {
        valid: false,
        error: isDev ? message : "Request failed",
        ...(isDev && err instanceof Error && { detail: String(err) }),
      },
      { status: 500 }
    );
  }
}
