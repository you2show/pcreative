/**
 * Vercel Serverless Function: GET /api/site-data
 *
 * Proxies site-data.json from the private GitHub repository using a
 * server-side Personal Access Token.  The token never reaches the browser,
 * so any visitor can read the data without needing their own credentials.
 *
 * Required environment variables (set in Vercel project settings — NOT VITE_*):
 *   GITHUB_TOKEN    — PAT with "repo" (contents read) scope
 *   GITHUB_USERNAME — GitHub username or org
 *   GITHUB_REPO     — Repository name
 *   GITHUB_BRANCH   — Branch name (defaults to "main")
 *
 * Responses:
 *   200  site-data.json content as JSON
 *   503  Server not configured (missing env vars)
 *   502  GitHub API error
 *   500  Unexpected server error
 */

// Minimal inline types for Vercel request/response to avoid adding @vercel/node dependency
interface Req {
  method?: string;
}
interface Res {
  status(code: number): Res;
  json(data: unknown): void;
  setHeader(name: string, value: string): void;
}

export default async function handler(req: Req, res: Res): Promise<void> {
  // Allow GET and HEAD only
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token || !username || !repo) {
    res.status(503).json({ error: 'GitHub integration not configured on server.' });
    return;
  }

  try {
    const fileRes = await fetch(
      `https://api.github.com/repos/${username}/${repo}/contents/site-data.json?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );

    if (!fileRes.ok) {
      res.status(502).json({ error: `GitHub read failed: ${fileRes.status}` });
      return;
    }

    const file = await fileRes.json() as { content?: unknown };
    if (typeof file.content !== 'string') {
      res.status(502).json({ error: 'Unexpected GitHub API response format.' });
      return;
    }

    const data = JSON.parse(
      Buffer.from(file.content.replace(/\n/g, ''), 'base64').toString('utf-8')
    );

    // Short-lived cache: browsers / CDN may cache up to 30 s, but always revalidate
    res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Internal server error',
    });
  }
}
