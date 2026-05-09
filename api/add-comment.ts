/**
 * Vercel Serverless Function: POST /api/add-comment
 *
 * Appends a comment (or reply) to the `comments` section of site-data.json
 * using a server-side GitHub Personal Access Token. The token never reaches
 * the browser, so any visitor can post comments without needing their own config.
 *
 * Required environment variables (set in Vercel project settings — NOT VITE_*):
 *   GITHUB_TOKEN    — PAT with "repo" (contents read + write) scope
 *   GITHUB_USERNAME — GitHub username or org
 *   GITHUB_REPO     — Repository name
 *   GITHUB_BRANCH   — Branch name (defaults to "main")
 *
 * Request body (JSON):
 *   postId   {string}  — ID of the post
 *   comment  {Comment} — Comment object (id, user, avatar, content, date, replies)
 *   parentId {string|null} — Parent comment ID for replies, or null for top-level
 *
 * Responses:
 *   200 { ok: true }
 *   400 Bad request (missing / invalid fields)
 *   503 Server not configured (missing env vars)
 *   502 GitHub API error
 *   500 Unexpected server error
 */

// Minimal inline types for Vercel request/response to avoid adding @vercel/node dependency
interface Req {
  method?: string;
  body?: unknown;
}
interface Res {
  status(code: number): Res;
  json(data: unknown): void;
}

interface Comment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  date: string;
  replies?: Comment[];
}

const MAX_CONTENT_LENGTH = 2000;
const MAX_NAME_LENGTH = 100;
const MAX_ID_LENGTH = 128;

const githubHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
});

const insertReply = (list: Comment[], parentId: string, reply: Comment): Comment[] =>
  list.map((c) => {
    if (c.id === parentId) return { ...c, replies: [...(c.replies ?? []), reply] };
    if (c.replies?.length) return { ...c, replies: insertReply(c.replies, parentId, reply) };
    return c;
  });

/** Returns true only if the value is a safe https:// URL or an empty string. */
const isSafeUrl = (value: unknown): boolean => {
  if (typeof value !== 'string' || value === '') return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
};

export default async function handler(req: Req, res: Res): Promise<void> {
  if (req.method !== 'POST') {
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

  let body: Record<string, unknown>;
  try {
    body = typeof req.body === 'string'
      ? (JSON.parse(req.body) as Record<string, unknown>)
      : ((req.body ?? {}) as Record<string, unknown>);
  } catch {
    res.status(400).json({ error: 'Invalid JSON body.' });
    return;
  }

  const { postId, comment, parentId } = body as {
    postId?: unknown;
    comment?: Record<string, unknown>;
    parentId?: unknown;
  };

  if (
    !postId ||
    typeof postId !== 'string' ||
    postId.length > MAX_ID_LENGTH ||
    !comment ||
    typeof comment !== 'object' ||
    typeof comment.id !== 'string' ||
    comment.id.length > MAX_ID_LENGTH ||
    typeof comment.user !== 'string' ||
    comment.user.length > MAX_NAME_LENGTH ||
    typeof comment.content !== 'string' ||
    !comment.content.trim() ||
    comment.content.length > MAX_CONTENT_LENGTH
  ) {
    res.status(400).json({ error: 'Missing or invalid fields.' });
    return;
  }

  if (parentId !== undefined && parentId !== null && typeof parentId !== 'string') {
    res.status(400).json({ error: 'parentId must be a string or null.' });
    return;
  }

  // Validate avatar: must be an https:// URL or empty — prevents js: or data: injection
  if (!isSafeUrl(comment.avatar)) {
    res.status(400).json({ error: 'avatar must be an https:// URL or empty string.' });
    return;
  }

  const sanitisedComment: Comment = {
    id: comment.id,
    user: String(comment.user).slice(0, MAX_NAME_LENGTH),
    avatar: typeof comment.avatar === 'string' ? comment.avatar : '',
    content: String(comment.content).trim().slice(0, MAX_CONTENT_LENGTH),
    date: typeof comment.date === 'string' ? comment.date : new Date().toISOString(),
    replies: [],
  };

  const headers = githubHeaders(token);

  try {
    // 1. Read current site-data.json
    const fileRes = await fetch(
      `https://api.github.com/repos/${username}/${repo}/contents/site-data.json?ref=${branch}`,
      { headers }
    );

    if (!fileRes.ok) {
      res.status(502).json({ error: `GitHub read failed: ${fileRes.status}` });
      return;
    }

    const file = await fileRes.json() as { content: string; sha: string };
    const siteData = JSON.parse(
      Buffer.from(file.content.replace(/\n/g, ''), 'base64').toString('utf-8')
    ) as Record<string, unknown>;
    const sha: string = file.sha;

    // 2. Insert the comment into the correct post bucket
    const allComments: Record<string, Comment[]> =
      (siteData.comments as Record<string, Comment[]>) ?? {};
    const postComments: Comment[] = allComments[postId] ?? [];

    allComments[postId] = parentId
      ? insertReply(postComments, parentId as string, sanitisedComment)
      : [...postComments, sanitisedComment];

    const updatedData = { ...siteData, comments: allComments };

    // 3. Write back to GitHub
    const content = Buffer.from(JSON.stringify(updatedData, null, 2)).toString('base64');
    const writeRes = await fetch(
      `https://api.github.com/repos/${username}/${repo}/contents/site-data.json`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: `Add comment on post ${postId}`,
          content,
          sha,
          branch,
        }),
      }
    );

    if (!writeRes.ok) {
      const errBody = await writeRes.json().catch(() => ({}));
      res.status(502).json({ error: `GitHub write failed: ${writeRes.status}`, detail: errBody });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Internal server error',
    });
  }
}
