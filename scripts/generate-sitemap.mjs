// Postbuild: emit sitemap.xml into the static output root. Static routes are
// listed explicitly; blog slugs + lastmod are read from the markdown sources.
import { readdir, readFile, writeFile, access } from 'node:fs/promises';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const here = dirname(fileURLToPath(import.meta.url));
const ORIGIN = 'https://www.masonkellytherapy.com'; // keep in sync with SITE.origin
const BLOG_DIR = join(here, '..', 'src', 'app', 'content', 'blog');
const OUT_DIR = join(here, '..', 'dist', 'mason-kelly-therapy', 'browser');

const SERVICE_SLUGS = [
  'trauma-ptsd-therapy',
  'addiction-recovery-therapy',
  'abuse-sexual-abuse-recovery',
  'depression-anxiety-therapy',
  'sexual-addiction-therapy',
  'couples-marriage-counseling',
  'grief-counseling',
  'eating-disorder-therapy',
  'codependency-therapy',
];

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/christian-counseling', priority: '0.9', changefreq: 'monthly' },
  { path: '/services', priority: '0.8', changefreq: 'monthly' },
  ...SERVICE_SLUGS.map((s) => ({ path: `/services/${s}`, priority: '0.8', changefreq: 'monthly' })),
  { path: '/detransition-support', priority: '0.9', changefreq: 'monthly' },
  { path: '/detransition-support/what-to-expect', priority: '0.7', changefreq: 'monthly' },
  { path: '/detransition-support/faith-and-identity', priority: '0.7', changefreq: 'monthly' },
  { path: '/groups', priority: '0.7', changefreq: 'monthly' },
  { path: '/fees-insurance', priority: '0.8', changefreq: 'monthly' },
  { path: '/faq', priority: '0.7', changefreq: 'monthly' },
  { path: '/blog', priority: '0.7', changefreq: 'weekly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
];

function iso(d) {
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  return String(d ?? '').slice(0, 10);
}

const blogFiles = (await readdir(BLOG_DIR)).filter((f) => f.endsWith('.md'));
const blogRoutes = [];
for (const f of blogFiles) {
  const { data } = matter(await readFile(join(BLOG_DIR, f), 'utf8'));
  blogRoutes.push({
    path: `/blog/${data.slug ?? basename(f, '.md')}`,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: iso(data.updated ?? data.date),
  });
}

const all = [...staticRoutes, ...blogRoutes];
const urls = all
  .map((r) => {
    const loc = `${ORIGIN}${r.path === '/' ? '/' : r.path}`;
    const lastmod = r.lastmod ? `\n    <lastmod>${r.lastmod}</lastmod>` : '';
    return `  <url>\n    <loc>${loc}</loc>${lastmod}\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

try {
  await access(OUT_DIR);
} catch {
  console.warn(`generate-sitemap: output dir not found (${OUT_DIR}); did the build run? Skipping.`);
  process.exit(0);
}

await writeFile(join(OUT_DIR, 'sitemap.xml'), xml, 'utf8');
console.log(`generate-sitemap: wrote ${all.length} URLs to sitemap.xml`);
