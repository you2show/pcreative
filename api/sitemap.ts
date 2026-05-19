/**
 * Vercel Serverless Function: GET /api/sitemap
 * Served at: /sitemap.xml (via vercel.json rewrite)
 *
 * Generates a dynamic XML sitemap that includes:
 *  - Static pages (home, services, portfolio, team, estimator, insights)
 *  - All insight/blog articles from site-data.json (fetched via GitHub API)
 *  - All portfolio projects from site-data.json
 *
 * Falls back to a minimal static sitemap when GitHub env vars are not configured.
 *
 * Required environment variables (optional — falls back gracefully):
 *   GITHUB_TOKEN    — PAT with "repo" (contents read) scope
 *   GITHUB_USERNAME — GitHub username or org
 *   GITHUB_REPO     — Repository name
 *   GITHUB_BRANCH   — Branch name (defaults to "main")
 */

interface Req {
  method?: string;
}
interface Res {
  status(code: number): Res;
  send(body: string): void;
  setHeader(name: string, value: string): void;
}

interface Post {
  id: string;
  title?: string;
  slug?: string;
  date?: string;
}

interface Project {
  id: string;
  slug?: string;
  category?: string;
}

interface SiteData {
  insights?: Post[];
  projects?: Project[];
}

const BASE_URL = 'https://creative.ponloe.app';

const today = () => new Date().toISOString().split('T')[0];

const escXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const urlEntry = (
  loc: string,
  lastmod: string,
  changefreq: string,
  priority: string,
  hreflang = true,
): string => {
  const langs = hreflang
    ? `\n    <xhtml:link rel="alternate" hreflang="en" href="${escXml(loc)}"/>` +
      `\n    <xhtml:link rel="alternate" hreflang="km" href="${escXml(loc)}"/>` +
      `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${escXml(loc)}"/>`
    : '';
  return `  <url>\n    <loc>${escXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>${langs}\n  </url>`;
};

const staticPages = (lastmod: string): string => [
  urlEntry(`${BASE_URL}/`, lastmod, 'weekly', '1.0'),
  urlEntry(`${BASE_URL}/services`, lastmod, 'monthly', '0.9'),
  urlEntry(`${BASE_URL}/portfolio`, lastmod, 'weekly', '0.9'),
  urlEntry(`${BASE_URL}/team`, lastmod, 'monthly', '0.8'),
  urlEntry(`${BASE_URL}/estimator`, lastmod, 'monthly', '0.8'),
  urlEntry(`${BASE_URL}/insights`, lastmod, 'weekly', '0.9'),
].join('\n');

const buildSitemap = (siteData: SiteData | null): string => {
  const now = today();
  const sections: string[] = [staticPages(now)];

  // Insights / Blog articles
  if (siteData?.insights?.length) {
    for (const post of siteData.insights) {
      const slug = post.slug || post.id;
      if (!slug) continue;
      // Normalise date: try to parse "M/D/YYYY" format as well as ISO
      let lastmod = now;
      if (post.date) {
        const parsed = new Date(post.date);
        if (!isNaN(parsed.getTime())) {
          lastmod = parsed.toISOString().split('T')[0];
        }
      }
      sections.push(urlEntry(`${BASE_URL}/insights/${escXml(slug)}`, lastmod, 'monthly', '0.8', false));
    }
  }

  // Portfolio projects
  if (siteData?.projects?.length) {
    for (const project of siteData.projects) {
      const slug = project.slug || project.id;
      if (!slug) continue;
      sections.push(urlEntry(`${BASE_URL}/portfolio/${escXml(slug)}`, now, 'monthly', '0.7', false));
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n\n${sections.join('\n\n')}\n\n</urlset>`;
};

export default async function handler(req: Req, res: Res): Promise<void> {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');

  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  // If GitHub env vars are missing, return a minimal static sitemap
  if (!token || !username || !repo) {
    res.status(200).send(buildSitemap(null));
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
      // Return minimal sitemap on GitHub errors rather than failing
      res.status(200).send(buildSitemap(null));
      return;
    }

    const file = await fileRes.json() as { content?: string };
    if (typeof file.content !== 'string') {
      res.status(200).send(buildSitemap(null));
      return;
    }

    const siteData = JSON.parse(
      Buffer.from(file.content.replace(/\n/g, ''), 'base64').toString('utf-8')
    ) as SiteData;

    res.status(200).send(buildSitemap(siteData));
  } catch {
    res.status(200).send(buildSitemap(null));
  }
}
