import { GitHubConfig } from '../types';
export type { GitHubConfig };

const GITHUB_CONFIG_KEY = 'github_config';
const HIDDEN_STATIC_STORIES_KEY = 'hidden_static_stories';
const DEFAULT_PUBLIC_SITE_DATA = {
  username: 'you2show',
  repo: 'pcreative',
  branch: 'main',
} as const;

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

/** Public raw URL — no auth needed — for reading telegramConfig on app start */
export const getSiteDataRawUrl = (
  cfg: Pick<GitHubConfig, 'username' | 'repo' | 'branch'>
): string =>
  `https://raw.githubusercontent.com/${cfg.username}/${cfg.repo}/${cfg.branch}/site-data.json`;

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
    const ghCfg = getGitHubConfig();
    const url = getSiteDataRawUrl(
      ghCfg
        ? { username: ghCfg.username, repo: ghCfg.repo, branch: ghCfg.branch }
        : DEFAULT_PUBLIC_SITE_DATA
    );
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
