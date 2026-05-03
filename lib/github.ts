import { GitHubConfig } from '../types';

export interface SiteData {
    services: any[];
    projects: any[];
    team: any[];
    insights: any[];
    jobs: any[];
    partners: any[];
}

const CONFIG_KEY = 'github_config';

export function getGitHubConfig(): GitHubConfig | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(CONFIG_KEY);
    if (!stored) return null;
    try { return JSON.parse(stored); } catch { return null; }
}

export function saveGitHubConfigLocal(config: GitHubConfig): void {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function clearGitHubConfig(): void {
    localStorage.removeItem(CONFIG_KEY);
}

export function isGitHubConfigured(): boolean {
    const cfg = getGitHubConfig();
    return !!(cfg?.username && cfg?.repo && cfg?.branch && cfg?.token);
}

/** Read site-data.json from GitHub (public, no auth needed) */
export async function fetchSiteData(config: GitHubConfig): Promise<SiteData | null> {
    const { username, repo, branch } = config;
    const url = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/site-data.json?t=${Date.now()}`;
    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

/** Write the entire site-data.json back to GitHub via a commit */
export async function saveSiteData(config: GitHubConfig, data: SiteData): Promise<void> {
    const { username, repo, branch, token } = config;
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/site-data.json`;

    // Get current file SHA (required for updates)
    let sha: string | undefined;
    const getRes = await fetch(apiUrl, {
        headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
        },
    });
    if (getRes.ok) {
        const getData = await getRes.json();
        sha = getData.sha;
    }

    // Encode content as base64
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

    const body: Record<string, unknown> = {
        message: 'Update site data via Admin Dashboard',
        content,
        branch,
    };
    if (sha) body.sha = sha;

    const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!putRes.ok) {
        const err = await putRes.json().catch(() => ({}));
        throw new Error((err as any).message || 'Failed to save data to GitHub');
    }
}
