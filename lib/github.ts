import { GitHubConfig } from '../types';
export type { GitHubConfig };

const GITHUB_CONFIG_KEY = 'github_config';

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
  sha: string
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
          message: 'Update Telegram config via Admin Panel',
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
