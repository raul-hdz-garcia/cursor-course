/**
 * Fetches the README.md content from a given GitHub repository URL.
 * @param {string} githubUrl - The GitHub repository URL (https://github.com/:owner/:repo).
 * @returns {Promise<string>} The content of the README.md file.
 */
export async function fetchGithubReadme(githubUrl) {
  const urlPattern = /^https:\/\/github\.com\/([^/]+)\/([^/]+)(\/|$)/;
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
