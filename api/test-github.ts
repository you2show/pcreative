/**
 * Vercel Serverless Function: GET /api/test-github
 *
 * Validates server-side GitHub environment credentials by reading metadata for
 * site-data.json from the configured repository and branch.
 */

interface Req {
  method?: string;
}

interface Res {
  status(code: number): Res;
  json(data: unknown): void;
  setHeader(name: string, value: string): void;
}

export default async function handler(req: Req, res: Res): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token || !username || !repo) {
    res.status(503).json({ ok: false, error: 'GitHub integration not configured on server.' });
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
      res.status(502).json({ ok: false, error: `GitHub API error ${fileRes.status}` });
      return;
    }

    const file = await fileRes.json() as { sha?: string };
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({
      ok: true,
      username,
      repo,
      branch,
      sha: file.sha || '',
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err instanceof Error ? err.message : 'Internal server error',
    });
  }
}
