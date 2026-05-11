import { GitHubConfig, Comment } from '../types';
export type { GitHubConfig };

const GITHUB_CONFIG_KEY = 'github_config';
const HIDDEN_STATIC_STORIES_KEY = 'hidden_static_stories';

export const getGitHubConfig = (): GitHubConfig | null => {
  try {
    const raw = localStorage.getItem(GITHUB_CONFIG_KEY);
    if (!raw) return null;
    const cfg = JSON.parse(raw);
    if (cfg.username && cfg.repo && cfg.branch && cfg.token) return cfg;
    return null;
  } catch {
    return null;
  }
};

export const saveGitHubConfig = (cfg: GitHubConfig): void => {
  localStorage.setItem(GITHUB_CONFIG_KEY, JSON.stringify(cfg));
};

export const clearGitHubConfig = (): void => {
  localStorage.removeItem(GITHUB_CONFIG_KEY);
};

/**
 * Update only the PAT token in the stored GitHub config, leaving username/repo/branch intact.
 * Returns false if no config exists to update.
 */
export const saveGitHubToken = (token: string): boolean => {
  const cfg = getGitHubConfig();
  if (!cfg) return false;
  localStorage.setItem(GITHUB_CONFIG_KEY, JSON.stringify({ ...cfg, token }));
  return true;
};

interface SiteDataFile {
  content: Record<string, unknown>;
  sha: string;
}

const githubHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
});

export const fetchSiteDataFromGitHub = async (cfg: GitHubConfig): Promise<SiteDataFile | null> => {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${cfg.username}/${cfg.repo}/contents/site-data.json?ref=${cfg.branch}`,
      { headers: githubHeaders(cfg.token) }
    );
    if (!res.ok) return null;
    const file = await res.json();
    const decoded = JSON.parse(atob(file.content.replace(/\n/g, '')));
    return { content: decoded, sha: file.sha };
  } catch {
    return null;
  }
};

export const writeSiteDataToGitHub = async (
  cfg: GitHubConfig,
  data: Record<string, unknown>,
  sha: string,
  commitMessage = 'Update Telegram config via Admin Panel'
): Promise<boolean> => {
  try {
    // Encode as UTF-8 base64 (supports Khmer characters)
    const bytes = new TextEncoder().encode(JSON.stringify(data, null, 2));
    const content = btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(''));
    const res = await fetch(
      `https://api.github.com/repos/${cfg.username}/${cfg.repo}/contents/site-data.json`,
      {
        method: 'PUT',
        headers: { ...githubHeaders(cfg.token), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: commitMessage,
          content,
          sha,
          branch: cfg.branch,
        }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
};

/** Public raw URL — no auth needed — for reading site-data.json from a public repo. */
export const getSiteDataRawUrl = (
  cfg: Pick<GitHubConfig, 'username' | 'repo' | 'branch'>
): string =>
  `https://raw.githubusercontent.com/${cfg.username}/${cfg.repo}/${cfg.branch}/site-data.json`;

/**
 * Resolve the best URL to read site-data.json.
 * Priority order:
 *  1. raw.githubusercontent.com — when the admin has a localStorage GitHub config
 *  2. VITE_SITE_DATA_URL        — explicit env-var override (useful for public repos)
 *  3. /api/site-data            — Vercel serverless proxy (works for private repos)
 *
 * Always returns a non-empty string; callers do not need a null check.
 */
const resolveSiteDataUrl = (): string => {
  const ghCfg = getGitHubConfig();
  if (ghCfg) {
    return getSiteDataRawUrl({ username: ghCfg.username, repo: ghCfg.repo, branch: ghCfg.branch });
  }
  const envUrl = (import.meta.env.VITE_SITE_DATA_URL as string | undefined)?.trim();
  return envUrl || '/api/site-data';
};

export const getLocalHiddenStaticStories = (): string[] => {
  try {
    const raw = localStorage.getItem(HIDDEN_STATIC_STORIES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === 'string');
  } catch {
    return [];
  }
};

export const saveLocalHiddenStaticStories = (ids: string[]): void => {
  localStorage.setItem(HIDDEN_STATIC_STORIES_KEY, JSON.stringify(ids));
};

const parseHiddenStaticStories = (data: Record<string, unknown> | null): string[] => {
  const value = data?.hiddenStaticStories;
  if (!Array.isArray(value)) return [];
  return value.filter((id): id is string => typeof id === 'string');
};

const fetchHiddenStaticStoriesPublic = async (): Promise<string[]> => {
  try {
    const url = resolveSiteDataUrl();
    const res = await fetch(`${url}?t=${Date.now()}`);
    if (!res.ok) return [];
    const data = await res.json();
    return parseHiddenStaticStories(data);
  } catch {
    return [];
  }
};

export const getMergedHiddenStaticStories = async (): Promise<string[]> => {
  const [localIds, globalIds] = await Promise.all([
    Promise.resolve(getLocalHiddenStaticStories()),
    fetchHiddenStaticStoriesPublic(),
  ]);
  return [...new Set([...globalIds, ...localIds])];
};

export const syncHiddenStaticStoriesToGitHub = async (
  cfg: GitHubConfig,
  ids: string[]
): Promise<boolean> => {
  const file = await fetchSiteDataFromGitHub(cfg);
  if (!file) return false;
  const updated = { ...file.content, hiddenStaticStories: ids };
  return writeSiteDataToGitHub(cfg, updated, file.sha, 'Update hidden static stories via Admin Panel');
};

/**
 * Upsert a team member coverImage in site-data.json.
 * Match priority: id -> slug -> normalized name.
 */
export const upsertTeamCoverImageToGitHub = async (member: {
  id?: string;
  slug?: string;
  name?: string;
  coverImage?: string;
}): Promise<boolean> => {
  const cfg = getGitHubConfig();
  if (!cfg) return false;
  if (typeof member.coverImage !== 'string') return false;

  const normalize = (value?: string): string =>
    (value ?? '').toString().trim().toLowerCase().replace(/\s+/g, ' ');

  const targetId = normalize(member.id);
  const targetSlug = normalize(member.slug);
  const targetName = normalize(member.name);

  try {
    const file = await fetchSiteDataFromGitHub(cfg);
    if (!file) return false;

    const teamRaw = file.content.team;
    const team = Array.isArray(teamRaw) ? [...teamRaw] : [];

    const index = team.findIndex((entry) => {
      if (!entry || typeof entry !== 'object') return false;
      const item = entry as Record<string, unknown>;
      const itemId = normalize(typeof item.id === 'string' ? item.id : '');
      const itemSlug = normalize(typeof item.slug === 'string' ? item.slug : '');
      const itemName = normalize(typeof item.name === 'string' ? item.name : '');
      if (targetId && itemId === targetId) return true;
      if (targetSlug && itemSlug === targetSlug) return true;
      if (targetName && itemName === targetName) return true;
      return false;
    });

    if (index >= 0) {
      const existing = team[index] as Record<string, unknown>;
      team[index] = {
        ...existing,
        ...(member.id ? { id: member.id } : {}),
        ...(member.slug ? { slug: member.slug } : {}),
        ...(member.name ? { name: member.name } : {}),
        coverImage: member.coverImage,
      };
    } else {
      team.push({
        ...(member.id ? { id: member.id } : {}),
        ...(member.slug ? { slug: member.slug } : {}),
        ...(member.name ? { name: member.name } : {}),
        coverImage: member.coverImage,
      });
    }

    const updated = { ...file.content, team };
    return writeSiteDataToGitHub(cfg, updated, file.sha, `Update team cover image for ${member.name || member.id || 'member'}`);
  } catch {
    return false;
  }
};

/**
 * Verify that the GitHub config is valid by reading site-data.json.
 * Returns ok=true with the current SHA on success, or an error message on failure.
 */
export const testGitHubConnection = async (
  cfg: GitHubConfig
): Promise<{ ok: boolean; sha?: string; error?: string }> => {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${cfg.username}/${cfg.repo}/contents/site-data.json?ref=${cfg.branch}`,
      { headers: githubHeaders(cfg.token) }
    );
    if (res.status === 401) return { ok: false, error: 'Invalid token or missing repo scope. Check your Personal Access Token.' };
    if (res.status === 403) return { ok: false, error: 'Access forbidden. Ensure the token has "repo" (contents write) scope.' };
    if (res.status === 404) return { ok: false, error: 'Repository or file not found. Check username, repo name, and branch.' };
    if (!res.ok) return { ok: false, error: `GitHub API error ${res.status}.` };
    const file = await res.json();
    return { ok: true, sha: file.sha };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
  }
};

// ---------------------------------------------------------------------------
// Comment helpers — stored in site-data.json under the "comments" key,
// keyed by post ID.
// ---------------------------------------------------------------------------

/** Fetch comments for a post from site-data.json (via serverless proxy for private repos). */
export const fetchPostCommentsPublic = async (postId: string): Promise<Comment[]> => {
  try {
    const url = resolveSiteDataUrl();
    const res = await fetch(`${url}?t=${Date.now()}`);
    if (!res.ok) return [];
    const data = await res.json();
    const allComments = data?.comments as Record<string, Comment[]> | undefined;
    return allComments?.[postId] ?? [];
  } catch {
    return [];
  }
};

/**
 * Fetch the raw site-data.json.
 * Uses the admin's localStorage GitHub config when available (fastest),
 * then VITE_SITE_DATA_URL, then falls back to the /api/site-data serverless
 * proxy so private-repo deployments work for every visitor.
 */
export const fetchSiteDataPublic = async (): Promise<Record<string, unknown> | null> => {
  try {
    const url = resolveSiteDataUrl();
    const res = await fetch(`${url}?t=${Date.now()}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

/**
 * Post a comment (or reply) via the Vercel serverless function /api/add-comment.
 * The serverless function uses server-side env vars for the GitHub token so any
 * visitor can post without supplying credentials.
 * Returns true on success, false if the endpoint is unavailable or returns an error.
 */
export const addPostCommentViaAPI = async (
  postId: string,
  comment: Comment,
  parentId?: string | null
): Promise<boolean> => {
  try {
    const res = await fetch('/api/add-comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, comment, parentId: parentId ?? null }),
    });
    return res.ok;
  } catch {
    return false;
  }
};

/**
 * Append a comment (or reply) to site-data.json via the GitHub API.
 * Returns true on success, false if no GitHub config or on any error.
 */
export const addPostCommentToGitHub = async (
  postId: string,
  comment: Comment,
  parentId?: string | null
): Promise<boolean> => {
  const cfg = getGitHubConfig();
  if (!cfg) return false;
  try {
    const file = await fetchSiteDataFromGitHub(cfg);
    if (!file) return false;

    const allComments = ((file.content.comments as Record<string, Comment[]> | undefined) ?? {});
    const postComments: Comment[] = allComments[postId] ?? [];

    const insertReply = (list: Comment[], pid: string): { list: Comment[]; inserted: boolean } => {
      let inserted = false;
      const next = list.map(c => {
        if (c.id === pid) {
          inserted = true;
          return { ...c, replies: [...(c.replies ?? []), comment] };
        }
        if (!c.replies?.length) return c;
        const nested = insertReply(c.replies, pid);
        if (nested.inserted) inserted = true;
        return { ...c, replies: nested.list };
      });
      return { list: next, inserted };
    };

    const nextComments = (() => {
      if (!parentId) return [...postComments, comment];
      const insertedReply = insertReply(postComments, parentId);
      return insertedReply.inserted ? insertedReply.list : [...postComments, comment];
    })();

    const updated = {
      ...file.content,
      comments: {
        ...allComments,
        [postId]: nextComments,
      },
    };

    return writeSiteDataToGitHub(cfg, updated, file.sha, `Add comment on post ${postId}`);
  } catch {
    return false;
  }
};
