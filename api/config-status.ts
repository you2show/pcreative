/**
 * Vercel Serverless Function: GET /api/config-status
 *
 * Returns non-sensitive configuration status so the admin UI can show
 * environment-backed integrations without requiring manual input fields.
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

  const githubUsername = process.env.GITHUB_USERNAME || '';
  const githubRepo = process.env.GITHUB_REPO || '';
  const githubBranch = process.env.GITHUB_BRANCH || 'main';
  const githubToken = process.env.GITHUB_TOKEN || '';

  const telegramToken = process.env.VITE_TELEGRAM_BOT_TOKEN || '';
  const telegramChatId = process.env.VITE_TELEGRAM_CHAT_ID || '';

  const imgbbKeyConfigured = Boolean(process.env.VITE_IMGBB_API_KEY);

  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    github: {
      configured: !!githubToken && !!githubUsername && !!githubRepo,
      username: githubUsername,
      repo: githubRepo,
      branch: githubBranch,
    },
    telegram: {
      configured: !!telegramToken && !!telegramChatId,
    },
    imgbb: {
      configured: imgbbKeyConfigured,
    },
  });
}
