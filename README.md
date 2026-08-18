# Mason L. Kelly, LCSW — Faith-Centered Christian Counseling

A gold-standard, SEO-optimized marketing website for a solo licensed therapist offering
online, faith-centered Christian therapy across Illinois — including a distinctive
client-led detransition / transition-regret specialty.

Built with **Angular v22** as a **fully static, prerendered (SSG)** site: every route is
emitted as crawler-ready HTML with per-route metadata and JSON-LD structured data, deployable
to any CDN with no server to run.

## Tech & rendering

- **Angular v22**, standalone components, signals, zoneless change detection.
- **Static Site Generation**: `outputMode: "static"` + `RenderMode.Prerender` for every route
  (see `src/app/app.routes.server.ts`). Output is pure static HTML/CSS/JS in
  `dist/mason-kelly-therapy/browser`.
- **Incremental hydration** (`provideClientHydration(withIncrementalHydration())`) so static
  pages become interactive with minimal JS.
- **Self-hosted variable fonts** (Lora + Open Sans) in `public/fonts`, preloaded in `index.html`.

## Commands

```bash
npm start        # dev server (regenerates blog content first)
npm run build    # generate content -> prerender all routes -> generate sitemap
npm run content  # regenerate blog posts from markdown only
npm run sitemap  # regenerate sitemap.xml into dist (after a build)
```

The production build runs three steps automatically:
1. `prebuild` → `scripts/build-content.mjs` compiles `src/app/content/blog/*.md` into
   `generated-posts.ts`.
2. `build` → `ng build` prerenders all 27 routes to static HTML.
3. `postbuild` → `scripts/generate-sitemap.mjs` writes `sitemap.xml` into the output.

## Where to edit content

| What | Where |
| --- | --- |
| **Business facts** (NAP, credentials, fees, insurance, groups, crisis line, **canonical domain**) | `src/app/core/practice.config.ts` — single source of truth for copy **and** schema |
| Navigation | `src/app/core/navigation.ts` |
| Service pillar pages (copy, FAQs, links) | `src/app/pages/services/service-content.ts` |
| Home / About / other pages | `src/app/pages/**` |
| Blog posts | Add a markdown file in `src/app/content/blog/` (frontmatter: `title`, `description`, `date`, `category`, `related`), then `npm run content` |
| JSON-LD builders | `src/app/core/schema.ts` |
| Design tokens (colors, type, spacing) | `src/styles/_tokens.scss` |

`practice.config.ts` drives the footer, fees table, and all structured data, so NAP and
credentials stay byte-consistent everywhere.

## SEO features

- Per-route `<title>`, meta description, canonical, Open Graph & Twitter cards (`SeoService`).
- One JSON-LD block per route (`StructuredDataService`): `MedicalBusiness`, `Person`
  (with `hasCredential`), `WebSite`, `Service`, `FAQPage`, `BreadcrumbList`, `BlogPosting`,
  `EventSeries`. **No** self-serving `aggregateRating` (renders no stars, policy risk).
- `sitemap.xml` (27 URLs) + `robots.txt`.
- `NgOptimizedImage` is available for any future raster images; current hero/portrait use CSS.
- Core Web Vitals: preloaded self-hosted WOFF2, minimal JS, native `<details>` FAQ accordion
  (no JS), no layout-shift sources.

## Deployment

The live site is published to **GitHub Pages** at
<https://matt319940.github.io/mason-kelly-therapy/>, served from the **`gh-pages` branch**
(built output only — never edit that branch by hand).

> **There is no CI workflow.** Pushing to `main` does **not** update the live site. Every
> deploy is a manual build-and-publish — follow the steps below.

### Deploying an update to GitHub Pages

From `main`, with your source changes committed and pushed:

```bash
# 1. Build: blog markdown -> prerender all 27 routes -> sitemap.xml
npm run build

# 2. Verify the build picked up the project base path (see below). This is the #1 failure mode.
grep -o '<base[^>]*>' dist/mason-kelly-therapy/browser/index.html
#    expected: <base href="/mason-kelly-therapy/">

# 3. Publish the built output to gh-pages. Force-pushes the branch, adds .nojekyll,
#    and copies index.html -> 404.html for SPA fallback.
npx angular-cli-ghpages --dir=dist/mason-kelly-therapy/browser
```

Then give GitHub ~1–3 minutes to build and serve the new commit.

Step 2 matters because `dist/` is not cleaned between builds — a leftover build made without
`baseHref` will look fine locally and deploy a broken site.

### Verifying a deploy

GitHub Pages sends `Cache-Control: max-age=600` on HTML, so **your browser will keep serving
the old page from cache for up to 10 minutes.** A stale-looking site is almost never a failed
deploy. Check the server, not the browser:

```bash
# The live HTML must reference the same hashed bundle the build just produced
curl -s https://matt319940.github.io/mason-kelly-therapy/ | grep -o 'main-[A-Z0-9]*\.js'
ls dist/mason-kelly-therapy/browser/main-*.js      # the two hashes must match

# Assets must resolve under the project subpath (expect "200 OK" from both)
curl -sI https://matt319940.github.io/mason-kelly-therapy/fonts/lora-latin-wght-normal.woff2 | head -1
curl -sI https://matt319940.github.io/mason-kelly-therapy/ | head -1
```

To confirm in a browser, hard-reload with `Ctrl+Shift+R` or open a private window.

### ⚠️ The `/mason-kelly-therapy/` base path

Pages serves this site from a **project subpath**, not a domain root, so three files hardcode
that prefix. All three must stay in sync, or the deploy renders as a blank page or unstyled
text:

| File | What it holds |
| --- | --- |
| `angular.json` | `"baseHref": "/mason-kelly-therapy/"` in the `build` options |
| `src/index.html` | The two `<link rel="preload">` font `href`s |
| `src/styles/_fonts.scss` | All four `@font-face` `src: url(...)` paths |

Setting `baseHref` alone is **not** sufficient: root-absolute URLs like `/fonts/…` ignore
`<base href>` entirely, and CSS `url()` resolves against the stylesheet's own location. That is
why the last two files must carry the prefix literally.

Note that `sitemap.xml`, `robots.txt`, and every canonical/OG tag still emit
`https://www.masonkellytherapy.com` URLs (from `SITE.origin`). That is intended for the eventual
production domain — don't submit the sitemap to Search Console while the Pages URL is the only
live host.

### Moving to the real domain, or another host (Cloudflare Pages / Netlify)

These serve from the domain root, so **remove** the `/mason-kelly-therapy/` prefix from all
three files above first. Then deploy the static output as-is:
- **Build command:** `npm run build`
- **Output directory:** `dist/mason-kelly-therapy/browser`
- Force HTTPS and a single canonical host (301 `www` ↔ apex).
- After launch: submit `sitemap.xml` in Google Search Console; create/optimize the Google
  Business Profile once the verified NAP is set.

## ⚠️ Pre-launch checklist (data the client must confirm)

These are intentionally left as placeholders/TODOs in `practice.config.ts`:

- [ ] **Verified phone + email** — the Psychology Today profile and the old site disagree. Set
  `CONTACT.phone`, `CONTACT.phoneDisplay`, and `CONTACT.email`. (Phone is currently blank and
  hidden until set; `telephone` is omitted from schema while blank.)
- [ ] **Canonical domain** — confirm and set `SITE.origin` (used for canonical/OG/sitemap), and
  keep `ORIGIN` in `scripts/generate-sitemap.mjs` and the URL in `public/robots.txt` in sync.
- [ ] **Credentials/license** — confirm the LCSW license # and certifications are current and OK
  to publish.
- [ ] **Insurance panels** — verify the accepted-plan list (`FEES.insurers`) is current.
- [ ] **Fees & group schedules** — confirm `$130 / $160 / $20–$60` and the two group times.
- [ ] **OG image** — replace `public/og-default.svg` with a **1200×630 raster (PNG/JPG)**; some
  social platforms (e.g. Facebook) don't render SVG OG images.
- [ ] **Professional headshot** — add a real photo for the About/Home portrait (currently a
  styled placeholder). Use `NgOptimizedImage` with explicit width/height.
- [ ] **Copy review** — have the clinician review all pages, especially the detransition pages,
  About (lived-experience disclosure), and the faith statement.
- [ ] **Privacy policy** — have an attorney finalize `src/app/pages/privacy/privacy.page.ts`.

## Verification

- **Lighthouse:** measure the **deployed** build (or `npx http-server dist/mason-kelly-therapy/browser`),
  not `ng serve`. Target ~100 across Performance / SEO / Accessibility / Best Practices.
- **Structured data:** validate each route in Google Rich Results Test and validator.schema.org
  (use the schema.org validator for `FAQPage`, since Rich Results dropped FAQ support).
- **Accessibility:** WCAG 2.2 AA — skip link, focus rings, focus-trapped mobile menu, semantic
  landmarks, `prefers-reduced-motion`. Run axe/Lighthouse a11y and a manual keyboard pass.
