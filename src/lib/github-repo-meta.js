/**
 * Parse owner/repo from a GitHub repository URL.
 * @param {string} githubUrl
 * @returns {{ owner: string, repo: string } | null}
 */
export function parseGithubRepoUrl(githubUrl) {
  const urlPattern = /^https:\/\/github\.com\/([^/]+)\/([^/]+)(\/|$|\?|#)/;
  const match = String(githubUrl).trim().match(urlPattern);
  if (!match) return null;
  let repo = match[2];
  if (repo.endsWith(".git")) repo = repo.slice(0, -4);
  return { owner: match[1], repo };
}

/**
 * Public repository metadata from the GitHub REST API (stars, latest release tag, homepage, license).
 * @param {string} githubUrl
 * @returns {Promise<{ stars: number, latest_version: string | null, website_url: string | null, license_type: string | null }>}
 */
export async function fetchGithubRepositoryInfo(githubUrl) {
  const parsed = parseGithubRepoUrl(githubUrl);
  if (!parsed) {
    throw new Error("Invalid GitHub URL format. Use https://github.com/:owner/:repo");
  }
  const { owner, repo } = parsed;

  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers,
  });

  if (!repoRes.ok) {
    const message =
      repoRes.status === 404
        ? "Repository not found"
        : `GitHub repository lookup failed (${repoRes.status})`;
    throw new Error(message);
  }

  const data = await repoRes.json();

  let latest_version = null;
  const releaseRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
    { headers }
  );
  if (releaseRes.ok) {
    const rel = await releaseRes.json();
    if (typeof rel.tag_name === "string" && rel.tag_name.trim()) {
      latest_version = rel.tag_name.trim();
    } else if (typeof rel.name === "string" && rel.name.trim()) {
      latest_version = rel.name.trim();
    }
  }

  const homepage = typeof data.homepage === "string" ? data.homepage.trim() : "";
  let license_type = null;
  if (data.license && typeof data.license === "object") {
    const spdx = data.license.spdx_id;
    if (typeof spdx === "string" && spdx && spdx !== "NOASSERTION") {
      license_type = spdx;
    } else if (typeof data.license.name === "string" && data.license.name) {
      license_type = data.license.name;
    }
  }

  return {
    stars: typeof data.stargazers_count === "number" ? data.stargazers_count : 0,
    latest_version,
    website_url: homepage || null,
    license_type,
  };
}
