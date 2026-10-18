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

Production is **Azure Static Web Apps** at <https://www.masonkellytherapist.com>, deployed by
hand from a laptop. There is no CI, and nothing in the deploy depends on GitHub. **`DEPLOYMENT.md`
is the full guide**; the routine update is:

```bash
npm run build
grep -o '<base[^>]*>' dist/mason-kelly-therapy/browser/index.html   # expect <base href="/">
swa deploy dist/mason-kelly-therapy/browser --deployment-token "YOUR_TOKEN" --env production
```

### ⚠️ Root-absolute font paths

The site serves from the domain root. `src/index.html` (font preloads) and
`src/styles/_fonts.scss` (`@font-face`) reference `/fonts/…` literally, because neither a
root-absolute URL nor a CSS `url()` is affected by `<base href>`. If the site ever moves under a
subpath, those files must change along with `baseHref` in `angular.json`, or fonts break.

## ⚠️ Pre-launch checklist (data the client must confirm)

These are intentionally left as placeholders/TODOs in `practice.config.ts`:

- [ ] **Verified phone** — the Psychology Today profile and the old site disagree. Set
  `CONTACT.phone` and `CONTACT.phoneDisplay`. (Phone is currently blank and hidden until set;
  `telephone` is omitted from schema while blank.) `CONTACT.email` is intentionally blank —
  enquiries route to `CONTACT.contactUrl` instead.
- [x] **Canonical domain** — `SITE.origin` is `https://www.masonkellytherapist.com` (not
  `masonkellytherapy.com`, which is the client's separate contact-form site). Keep `ORIGIN` in
  `scripts/generate-sitemap.mjs` and the URL in `public/robots.txt` in sync with it.
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
