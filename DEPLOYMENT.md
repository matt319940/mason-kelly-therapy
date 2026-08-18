# Deployment Guide

A step-by-step walkthrough for taking this site from its current staging state to a real,
Google-indexed website on a domain you own.

**What you'll have at the end:** the site live at `https://www.yourdomain.com`, served by Azure
Static Web Apps over HTTPS, deployed by hand from any laptop that has the source code, and
submitted to Google for indexing. **Nothing in the production setup depends on GitHub.**

**Roughly what it costs:** a `.com` domain is about **$10–$16/year** at Namecheap. The Azure Static
Web Apps **Free** plan covers this site (static files, no server-side API) and includes free
managed TLS certificates. Google Search Console is free.

**Roughly how long it takes:** about 2 hours of hands-on work, spread across 1–3 days, because DNS
propagation and Azure's certificate issuance both need time you can't hurry.

---

## Contents

- [Part 0 — Where things stand today](#part-0--where-things-stand-today)
- [Part 1 — Pre-launch content checklist](#part-1--pre-launch-content-checklist)
- [Part 2 — Buy the domain at Namecheap](#part-2--buy-the-domain-at-namecheap)
- [Part 3 — Point the code at the real domain](#part-3--point-the-code-at-the-real-domain)
- [Part 4 — Create the Azure Static Web App](#part-4--create-the-azure-static-web-app)
- [Part 5 — Connect your domain to Azure](#part-5--connect-your-domain-to-azure)
- [Part 6 — Deploying updates from now on](#part-6--deploying-updates-from-now-on)
- [Part 7 — Google Search Console and getting indexed](#part-7--google-search-console-and-getting-indexed)
- [Part 8 — Launch-day verification](#part-8--launch-day-verification)
- [Troubleshooting](#troubleshooting)

---

## Part 0 — Where things stand today

Read this before changing anything, because Parts 3–5 deliberately undo some of it.

| Thing | Current state |
| --- | --- |
| Live copy | GitHub Pages at `https://matt319940.github.io/mason-kelly-therapy/` |
| Served from | The `gh-pages` branch (built output — never edit that branch by hand) |
| Deploy method | Manual: `npm run build`, then `npx angular-cli-ghpages` |
| CI | None, and none is planned — production deploys are run by hand (Part 6). |
| Base path | `/mason-kelly-therapy/`, hardcoded in three files, because Pages serves from a subfolder |
| Canonical domain in code | `https://www.masonkellytherapy.com` — aspirational, not yet owned or live |

**The production setup deliberately avoids GitHub.** Azure is never connected to the repository:
you build the site locally and upload the finished files with a command-line tool. That keeps the
project portable — it can move to GitLab, a private server, or a folder on a hard drive without
breaking the live site. The two things that must survive any such move are the **source code** and
the **deployment token** from [Part 4.3](#43-get-the-deployment-token-and-keep-it-safe).

Treat GitHub Pages as **staging**. It stays useful for previewing changes after launch, but see
[Part 8](#part-8--launch-day-verification) — you'll want to retire it rather than leave a public
duplicate of your site on the web.

> `README.md` documents the GitHub Pages workflow in detail. This guide covers the production
> launch. After launch, this guide is the one that governs.

---

## Part 1 — Pre-launch content checklist

**Do this before anything else.** Everything below is real placeholder data currently baked into
the site and its structured data. Launching with it wrong means Google indexes wrong business
facts about a healthcare practice — tedious to correct and, for fees and insurance, potentially
harmful.

`src/app/core/practice.config.ts` is the single source of truth: the footer, the fees table, and
every JSON-LD block read from it. Fixing a fact there fixes it everywhere at once.

### 1.1 Business facts

| # | Item | Where | What's wrong now |
| --- | --- | --- | --- |
| 1 | **Phone number** | `practice.config.ts:66-67` | **Blank.** Both `phone` and `phoneDisplay` are empty strings, so the site hides the phone and omits `telephone` from schema. The Psychology Today profile and the old site disagree — pick the one verified number. Format: `phone: '+1-773-555-0100'`, `phoneDisplay: '(773) 555-0100'`. |
| 2 | **Contact email** | `practice.config.ts:69` | Set to `office@masonkellytherapy.com`. Confirm that mailbox exists and is monitored — it's printed on the Contact and Privacy pages as a `mailto:` link. If you buy a different domain in Part 2, this must change too. |
| 3 | **LCSW license number** | `practice.config.ts:42` | Reads `IL #149011810`. Confirm it's current and that Mason is comfortable publishing it — it's emitted in `Person` schema as a `hasCredential` claim. |
| 4 | **Other certifications** | `practice.config.ts:45-47` | NBCCH, CSOTS, and CADC are all listed as active. Confirm each one. |
| 5 | **Insurance panels** | `practice.config.ts:83-92` | Seven insurers plus the claim *"and 30+ additional plans."* Verify against the actual current panel list. An inaccurate insurance claim is the most common complaint driver on a therapy site. |
| 6 | **Fees** | `practice.config.ts:76-79` | `$130` individual, `$160` couples, `$20–$60` group sliding scale. Confirm each number. |
| 7 | **Group schedules** | `practice.config.ts:105-124` | "Third Sunday of each month, 1:30–3:00pm" and "Every other Monday, 7:30–9:00pm." These become `EventSeries` schema, so a wrong time is a wrong rich result. |
| 8 | **Psychology Today link** | `practice.config.ts:130` | Confirm the profile URL still resolves — it's a `sameAs` identity signal. |

### 1.2 Privacy policy — needs an attorney

`src/app/pages/privacy/privacy.page.ts:21-22` currently renders this **on the live page**:

> *This page is a general template and should be reviewed and finalized with a qualified attorney
> before launch.*

Have an attorney review the page. Once it's finalized, **delete that italic disclaimer** — it's the
`<p class="muted">` block at lines 20–23. Shipping a privacy policy that announces itself as an
unreviewed template is worse than shipping none.

### 1.3 Open Graph image — must become a raster file

`public/og-default.svg` is an SVG, referenced by `practice.config.ts:16`. **Facebook, LinkedIn, and
several other platforms refuse to render SVG Open Graph images** — shared links will show no
preview card at all.

1. Export the existing SVG (or a new design) to a **1200×630 PNG or JPG**.
2. Save it as `public/og-default.png`.
3. Change `practice.config.ts:16` to `defaultOgImage: '/og-default.png'`.
4. After deploying, test with the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   and the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).

### 1.4 Headshot — real photo, but far too heavy

`public/mason_kelly.jpg` is a real photo, but it's **2316×3088 pixels and 939 KB**, displayed in a
small portrait frame. It is the largest asset on the site by an order of magnitude and will
dominate your Largest Contentful Paint score.

1. Resize to roughly **800×1067** (still 2× for retina at the displayed size) and re-export as JPG
   at ~80% quality. Expect to land under 120 KB.
2. `src/app/pages/home/home.page.html:175` is currently:
   ```html
   <img src="mason_kelly.jpg" alt="Mason Kelly, LCSW" />
   ```
   Add explicit dimensions so the browser reserves space and the layout doesn't jump while it
   loads — a direct Cumulative Layout Shift fix:
   ```html
   <img src="mason_kelly.jpg" alt="Mason Kelly, LCSW" width="800" height="1067" />
   ```

### 1.5 Copy review

Have Mason read every page start to finish, with particular attention to:

- the `/detransition-support` pages — the highest-sensitivity copy on the site,
- the About page's lived-experience disclosure,
- the faith statement,
- the crisis-line language on `/contact`.

### 1.6 Confirm the checklist is actually done

```bash
# Should print only the SITE.origin TODO, which Part 3 resolves.
grep -rn "TODO" src/

# Should print two non-empty strings.
grep -n "phone:\|phoneDisplay:" src/app/core/practice.config.ts

# Should print nothing.
grep -rn "general template" src/app/pages/privacy/
```

---

## Part 2 — Buy the domain at Namecheap

### 2.1 Pick and purchase

1. Go to [namecheap.com](https://www.namecheap.com) and create an account, or sign in.
2. Search for the domain you want. The code currently assumes `masonkellytherapy.com` — if that's
   available, buying it saves you edits in Part 3.
3. Prefer a **`.com`**. Avoid hyphens and creative TLDs; for a local healthcare practice, `.com`
   carries real trust weight with exactly the kind of client who hesitates before clicking a link.
4. Click **Add to Cart**, then **Checkout**.
5. On the cart page:
   - **Auto-Renew: ON.** A practice losing its domain to an expired credit card is a genuine
     disaster — every backlink and every ranking dies at once, and the domain may be bought out
     from under you.
   - **Domain Privacy (Withheld for Privacy): ON.** It's free at Namecheap and keeps a solo
     practitioner's home address out of the public WHOIS database.
   - **Premium DNS: skip.** Free BasicDNS does everything this guide needs, including the `ALIAS`
     record in Part 5.
   - **Hosting, email, and SSL upsells: skip all of them.** Azure provides hosting and the TLS
     certificate at no cost.
6. Complete the purchase.

### 2.2 Clear out Namecheap's default parking records

**Don't skip this.** New Namecheap domains ship with parking-page records that will silently fight
the records you add in Part 5.

1. From the Namecheap dashboard, click **Domain List** in the left sidebar.
2. Click **Manage** next to your new domain.
3. Confirm **Nameservers** is set to **Namecheap BasicDNS**. If it says "Custom DNS," switch it —
   otherwise the Advanced DNS tab is ignored entirely.
4. Open the **Advanced DNS** tab.
5. Under **Host Records**, delete the default entries: typically a `CNAME` for `www` pointing at
   `parkingpage.namecheap.com`, and a `URL Redirect` for `@`. Use the trash icon on each.
6. Leave the section empty. You'll add the real records in Part 5, once Azure exists and can tell
   you what to point at.

> **Why now rather than later:** Namecheap refuses to create an `ALIAS` record on a host that
> already has a `CNAME`, `A`, `AAAA`, or `URL Redirect` record. Clearing them now avoids a
> confusing error in Part 5.

---

## Part 3 — Point the code at the real domain

The site is currently hardcoded for a GitHub Pages subfolder. Azure serves from a domain root, so
two separate groups of settings must change. Do it all in one commit.

### 3.1 Remove the `/mason-kelly-therapy/` base path

Three files carry that prefix, and all three must go back to `/`.

**File 1 — `angular.json`.** Delete the `baseHref` line (or set it to `/`):

```diff
             "inlineStyleLanguage": "scss",
-            "baseHref": "/mason-kelly-therapy/",
             "assets": [
```

**File 2 — `src/index.html`, lines 13–14:**

```diff
-  <link rel="preload" href="/mason-kelly-therapy/fonts/lora-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
-  <link rel="preload" href="/mason-kelly-therapy/fonts/open-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
+  <link rel="preload" href="/fonts/lora-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
+  <link rel="preload" href="/fonts/open-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
```

**File 3 — `src/styles/_fonts.scss`.** All four `@font-face` blocks:

```diff
-  src: url('/mason-kelly-therapy/fonts/lora-latin-wght-normal.woff2') format('woff2');
+  src: url('/fonts/lora-latin-wght-normal.woff2') format('woff2');
```

…and likewise for `lora-latin-wght-italic`, `open-sans-latin-wght-normal`, and
`open-sans-latin-wght-italic`.

Files 2 and 3 can be done in one command:

```bash
sed -i "s|/mason-kelly-therapy/fonts/|/fonts/|g" src/styles/_fonts.scss src/index.html
```

> **Why three files instead of just `baseHref`?** Setting `<base href>` does not affect
> root-absolute URLs — a browser resolves `/fonts/x.woff2` against the domain root and ignores
> `<base>` entirely. CSS `url()` resolves against the stylesheet's own location, not `<base>`
> either. So the font paths must be corrected literally. This is the most common way this
> particular site breaks; it has already happened once in this repo's history.

### 3.2 Set the canonical domain

**Skip this section if you bought `masonkellytherapy.com`** — the values are already correct.

Otherwise, three files must agree, or your canonical tags, sitemap, and robots.txt will advertise a
domain you don't own:

| File | Line | Change to |
| --- | --- | --- |
| `src/app/core/practice.config.ts` | 15 | `origin: 'https://www.yourdomain.com',` |
| `scripts/generate-sitemap.mjs` | 9 | `const ORIGIN = 'https://www.yourdomain.com';` |
| `public/robots.txt` | 4 | `Sitemap: https://www.yourdomain.com/sitemap.xml` |

Also revisit `CONTACT.email` at `practice.config.ts:69` if it used the old domain.

Decide **now** whether your canonical host is `www.yourdomain.com` or the bare `yourdomain.com`,
and use it consistently across all three. This guide assumes **`www`**, matching what the code
already does. Part 5 sets up a redirect so the other one funnels into it.

### 3.3 Build and verify locally

```bash
npm run build
```

Then confirm:

```bash
# Should print: <base href="/">
grep -o '<base[^>]*>' dist/mason-kelly-therapy/browser/index.html

# Should print your real domain.
grep -o 'https://[^<]*' dist/mason-kelly-therapy/browser/sitemap.xml | head -3

# Should print your real domain.
grep -o 'rel="canonical" href="[^"]*"' dist/mason-kelly-therapy/browser/about/index.html
```

Preview the actual production build — `ng serve` will not catch base-path mistakes:

```bash
npx http-server dist/mason-kelly-therapy/browser -p 8080
```

Open `http://localhost:8080`. Check that fonts render correctly (serif headings, sans-serif body)
and that DevTools → Network shows no 404s. Then commit:

```bash
git add -A
git commit -m "Point site at production domain, remove GitHub Pages base path"
git push
```

### 3.4 Node version on the build machine

The site is built on whatever laptop is doing the deploying, so that machine needs a current
Node.js. Angular 22 requires **Node 22.12 or newer**; an older version fails the build with a
confusing error.

```bash
node -v      # must be >= 22.12.0
```

Record that requirement in `package.json` so anyone who clones the project gets warned rather than
puzzled. Add an `engines` block right after `"private": true`:

```json
  "private": true,
  "engines": {
    "node": ">=22.12.0"
  },
```

---

## Part 4 — Create the Azure Static Web App

This site is deployed **from a laptop, not from a CI server.** You build it locally and push the
finished files straight to Azure with a command-line tool. Azure never connects to GitHub, never
reads your repository, and never needs to know where the source code lives.

That means the project can move to GitLab, to a private server, or to a folder on a hard drive at
any time, and deployment keeps working unchanged. The only things that must survive are **the
source code** and **the deployment token** from step 4.3.

### 4.1 Get an Azure account

1. Go to [portal.azure.com](https://portal.azure.com) and sign in with a Microsoft account, or
   create one.
2. If prompted, start the **free account** — it requires a credit card for identity verification.
   The Static Web Apps **Free** plan this guide uses does not charge, but the card must be on file.

### 4.2 Create the resource

1. In the portal, click **Create a resource**.
2. Search for **Static Web App**, select it, then click **Create**.
3. Fill in the **Basics** tab:

   | Field | Value |
   | --- | --- |
   | Subscription | Your subscription |
   | Resource Group | **Create new** → `mason-kelly-therapy-rg` (a folder for related resources) |
   | Name | `mason-kelly-therapy` |
   | Plan type | **Free** |
   | Region | The one closest to Illinois — e.g. **Central US** or **East US 2** |

4. Under **Deployment details**, set **Source** to **Other**.

   > **This is the important step.** The default is GitHub, which would make Azure ask for repo
   > access and commit a workflow file into your project. Choosing **Other** tells Azure that you
   > will deliver the built files yourself. No repository is linked and nothing is written to your
   > source tree.

5. Because you chose **Other**, Azure does not show the Build Details section (build presets, app
   location, output location). Those are CI settings, and there is no CI here. Nothing to fill in.

6. Click **Review + create**, then **Create**. When it finishes, click **Go to resource**.

At this point the app exists but has no content. Its URL shows an Azure placeholder page — that's
expected until step 4.5.

### 4.3 Get the deployment token and keep it safe

The deployment token is what authorizes a laptop to publish to this site. It replaces the GitHub
connection entirely.

1. In the Azure portal, open your Static Web App → **Overview**.
2. Click **Manage deployment token**.
3. Copy the value.

**Store it in a password manager right now**, labeled something like "Azure SWA deploy token —
mason-kelly-therapy." Anyone who needs to deploy the site needs this string.

> **Treat it like a password.** It grants publish access to the live site. Never commit it to the
> repository, never paste it into a public issue, and don't leave it in shell history you share.
> If it ever leaks, return to this same screen and **Reset** it — the old token stops working
> immediately and you distribute the new one.

You can also read it from the Azure CLI later, if you have one installed and signed in:

```bash
az staticwebapp secrets list --name mason-kelly-therapy --query "properties.apiKey"
```

### 4.4 Install the deployment tool

The Azure Static Web Apps CLI is a normal npm package. Install it globally on whichever machine
will do deployments:

```bash
npm install -g @azure/static-web-apps-cli
```

Confirm it's recent enough — **version 2.0.2 or newer is required**; older versions were cut off by
a security change:

```bash
swa --version
```

If you'd rather not install anything globally, every `swa` command below also works as
`npx @azure/static-web-apps-cli ...`.

### 4.5 Build and deploy for the first time

```bash
# 1. Build the site. This compiles blog markdown, prerenders all 27 routes,
#    and writes sitemap.xml — all via npm's prebuild/postbuild hooks.
npm run build

# 2. Confirm the build is correct before publishing it.
grep -o '<base[^>]*>' dist/mason-kelly-therapy/browser/index.html
#    expected: <base href="/">

# 3. Publish the built folder to Azure.
swa deploy dist/mason-kelly-therapy/browser \
  --deployment-token "PASTE_YOUR_TOKEN_HERE" \
  --env production
```

**`--env production` is not optional.** The CLI defaults to `preview`, which publishes to a
temporary staging environment instead of your live site. Leave it off and the deploy will appear to
succeed while the real site stays unchanged — a genuinely confusing failure.

To avoid pasting the token every time, set it as an environment variable in your shell session
instead:

```bash
export SWA_CLI_DEPLOYMENT_TOKEN="PASTE_YOUR_TOKEN_HERE"
swa deploy dist/mason-kelly-therapy/browser --env production
```

Add `--dry-run` to any of these to see what would happen without actually publishing.

### 4.6 Verify the deploy

In the Azure portal → your Static Web App → **Overview**, copy the **URL**. It looks like
`https://gentle-sand-0a1b2c3d4.azurestaticapps.net`. Open it — you should see the site, correctly
styled, at a domain root.

Check from the command line too:

```bash
# Replace with your actual azurestaticapps.net URL.
SWA="https://gentle-sand-0a1b2c3d4.azurestaticapps.net"

curl -sI "$SWA" | head -1                      # expect: HTTP/2 200
curl -sI "$SWA/about" | head -1                # expect: HTTP/2 200 — prerendered route
curl -s  "$SWA/sitemap.xml" | grep -c "<loc>"  # expect: 27
curl -s  "$SWA/robots.txt"                     # expect: your real domain in the Sitemap line
```

**Keep this `.azurestaticapps.net` URL.** You need it in Part 5, and it keeps working forever as a
way to check whether a problem is the site or the DNS.

### 4.7 Add a Static Web Apps config file

Azure reads an optional `staticwebapp.config.json` for routing and header rules. This site needs one
small thing from it: consistent URLs.

Create the file at **`public/staticwebapp.config.json`** — Angular copies everything in `public/` to
the output root, which is exactly where the CLI expects to find it:

```json
{
  "trailingSlash": "never",
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  }
}
```

- **`trailingSlash: "never"`** makes `/about/` permanently redirect to `/about`. Without it, Azure
  serves the same page at both URLs with a `200`, which is duplicate content. Your sitemap already
  uses the no-trailing-slash form, so this makes the site agree with itself.
- The two headers are cheap, standard hardening.

Note what is deliberately **absent**: there is no `navigationFallback` rule. Those exist so
single-page apps can serve `index.html` for unknown paths — but every route here is prerendered to
its own real HTML file, so Azure finds them without help. Adding a fallback would make typo URLs
return the home page with a `200` instead of a genuine `404`, which Google penalizes as a soft 404.

Rebuild and redeploy (step 4.5) to publish it.

---

## Part 5 — Connect your domain to Azure

Two hostnames to set up: `www.yourdomain.com` (the canonical one, a simple `CNAME`) and the bare
`yourdomain.com` (an apex domain, which needs more care).

> **Timing:** DNS changes propagate on their own schedule. Namecheap usually takes under 30
> minutes, but apex changes can take up to 72 hours. If a validation fails, wait and retry rather
> than changing things.

### 5.1 Add `www` (the canonical host)

**In Namecheap** — Domain List → Manage → **Advanced DNS** → Host Records → **Add New Record**:

| Field | Value |
| --- | --- |
| Type | `CNAME Record` |
| Host | `www` |
| Value | Your Azure hostname **without** `https://` — e.g. `gentle-sand-0a1b2c3d4.azurestaticapps.net` |
| TTL | Automatic |

Save with the green checkmark.

**In Azure** — your Static Web App → **Settings** → **Custom domains** → **+ Add** → **Custom
domain on other DNS**:

1. Enter `www.yourdomain.com`. Click **Next**.
2. Set **Hostname record type** to **CNAME**.
3. Click **Add**.

Azure verifies the CNAME resolves, then issues a free TLS certificate. This can take a few minutes
to a few hours. When the status reads **Ready**, visit `https://www.yourdomain.com` — you should
see your site with a valid padlock.

### 5.2 Add the apex domain

An apex domain (`yourdomain.com`, no subdomain) can't use a plain `CNAME` — that's a DNS rule, not
an Azure limitation. Namecheap's free BasicDNS supports `ALIAS` records, which solve exactly this,
so you can point the apex directly at Azure.

**Step 1 — prove you own the domain.**

1. In Azure → **Custom domains** → **+ Add** → **Custom domain on other DNS**.
2. Enter the bare `yourdomain.com` (no `www`). Click **Next**.
3. Set **Hostname record type** to **TXT**.
4. Click **Generate code** and wait — it takes up to a minute. Copy the generated value.
5. In Namecheap → Advanced DNS → **Add New Record**:

   | Field | Value |
   | --- | --- |
   | Type | `TXT Record` |
   | Host | `@` |
   | Value | The code you copied from Azure |
   | TTL | Automatic |

6. Save, then return to Azure and complete the validation.

**Step 2 — point the apex at Azure.**

In Namecheap → Advanced DNS → **Add New Record**:

| Field | Value |
| --- | --- |
| Type | `ALIAS Record` |
| Host | `@` |
| Value | Your Azure hostname without `https://` — e.g. `gentle-sand-0a1b2c3d4.azurestaticapps.net` |
| TTL | Automatic |

> If Namecheap rejects the `ALIAS` record, you still have a leftover `A`, `AAAA`, `CNAME`, or
> `URL Redirect` record on `@`. Delete it and retry — this is what Part 2.2 was preventing.

### 5.3 Make `www` the single canonical host

Both hostnames now serve the site, which is duplicate content. Your code declares
`https://www.yourdomain.com` as canonical, so make the apex redirect there.

In Azure → **Custom domains**, find `yourdomain.com` (the apex) and use the **"..."** menu to set
it to redirect to `www.yourdomain.com`.

If your Azure plan doesn't offer that option, delete the apex `ALIAS` record in Namecheap and
replace it with a **URL Redirect Record** instead:

| Field | Value |
| --- | --- |
| Type | `URL Redirect Record` |
| Host | `@` |
| Value | `https://www.yourdomain.com` |
| Redirect type | `Permanent (301)` |

A 301 is important — it tells Google to pass ranking signals to the `www` version rather than
treating them as two competing sites.

### 5.4 Verify both hostnames

```bash
# The canonical host: expect HTTP/2 200
curl -sI https://www.yourdomain.com | head -1

# The apex: expect a 301 whose Location is the www URL
curl -sI https://yourdomain.com | grep -iE "^(HTTP|location)"

# Certificate should be valid and not self-signed
curl -sI https://www.yourdomain.com > /dev/null && echo "TLS OK"
```

---

## Part 6 — Deploying updates from now on

Every deploy is the same three steps on a laptop: **build, check, publish.** There is no CI, no
webhook, and no dependency on where the source code is hosted.

### 6.1 What the deploying machine needs

Anyone deploying this site needs exactly four things:

1. **The source code** — a git clone, a downloaded zip, whatever. It does not need to come from
   GitHub.
2. **Node.js 22.12 or newer** (see [Part 3.4](#34-node-version-on-the-build-machine)). Check with
   `node -v`.
3. **The SWA CLI** — `npm install -g @azure/static-web-apps-cli`, version 2.0.2+.
4. **The deployment token** from [Part 4.3](#43-get-the-deployment-token-and-keep-it-safe).

That's the whole dependency list. No Azure portal login is required to deploy — the token is
sufficient.

### 6.2 The deploy procedure

```bash
# 0. Start from the current source, with your changes made and saved.
npm install          # only needed on a fresh clone, or after dependency changes

# 1. Build. Compiles blog markdown -> prerenders all 27 routes -> writes sitemap.xml.
npm run build

# 2. Check the build before publishing it.
grep -o '<base[^>]*>' dist/mason-kelly-therapy/browser/index.html   # expect <base href="/">
grep -c "<loc>" dist/mason-kelly-therapy/browser/sitemap.xml        # expect 27

# 3. Publish.
swa deploy dist/mason-kelly-therapy/browser \
  --deployment-token "YOUR_TOKEN" \
  --env production
```

The upload takes under a minute; Azure then takes another minute or two to serve the new files
globally.

**Remember `--env production`.** Without it the CLI deploys to a preview environment and your live
site silently stays on the old version.

### 6.3 A safer habit: preview first

Because `--env` picks the target, you can stage a change and look at it before it goes live:

```bash
# Deploy to a named preview environment instead of production.
swa deploy dist/mason-kelly-therapy/browser \
  --deployment-token "YOUR_TOKEN" \
  --env staging
```

Azure gives that environment its own URL (visible in the portal under **Environments**). Check it,
then rerun with `--env production` when you're happy. Worth doing for anything touching fees,
insurance, or the detransition pages.

### 6.4 Content changes still require a deploy

There is no CMS here. Editing a blog post or a fee changes the *source*; the live site only updates
after a build and a publish.

To add a blog post:

```bash
# 1. Create src/app/content/blog/your-post-slug.md with frontmatter:
#      title, description, date, category, related
# 2. Regenerate the compiled post list and preview locally:
npm run content
npm start
# 3. Build and deploy per 6.2 — the sitemap picks up the new post automatically.
```

To change a business fact — fees, insurance, phone, group times — edit
`src/app/core/practice.config.ts` and deploy. That one file drives the visible copy *and* the
structured data, so both stay consistent.

### 6.5 Verifying a deploy

Azure serves HTML with a short cache lifetime, so **your browser may show the old page for several
minutes after a successful deploy.** A stale-looking site is usually cache, not failure. Check the
server rather than the browser:

```bash
# The live HTML must reference the same hashed bundle your build produced.
curl -s https://www.yourdomain.com | grep -o 'main-[A-Z0-9]*\.js'
ls dist/mason-kelly-therapy/browser/main-*.js     # the two hashes should match
```

If they match, the deploy worked and you're looking at cache — hard-reload with `Ctrl+Shift+R` or
open a private window.

### 6.6 Keeping the source safe

Since nothing about deployment depends on GitHub, the repository is free to move — but that also
means **nothing external is backing up your source.** Azure stores only the built output; it cannot
reconstruct the project.

Whatever you do with the GitHub repo, make sure at least two copies of the source exist. A git
remote somewhere (GitLab, Codeberg, a private server, an external drive) is ideal, since it
preserves history. Push the same repository to a second remote with:

```bash
git remote add backup <url-of-the-other-remote>
git push backup main
```

Losing the source means rebuilding the site from scratch. Losing the deployment token only means
clicking **Reset** in the Azure portal.

---

## Part 7 — Google Search Console and getting indexed

Do this **after** the site is live on the real domain. Verifying a domain you're about to change is
wasted effort.

### 7.1 Verify ownership

1. Go to [search.google.com/search-console](https://search.google.com/search-console).
2. Click **Add property** and choose the **Domain** option on the left (not "URL prefix").

   > **Why Domain:** it covers `www`, the apex, `http`, and `https` in one property. A URL-prefix
   > property covers only the exact string you type, which means missing data the moment something
   > redirects.

3. Enter `yourdomain.com` (no `https://`, no `www`). Click **Continue**.
4. Google shows a TXT record. Copy the value.
5. In Namecheap → Advanced DNS → **Add New Record**:

   | Field | Value |
   | --- | --- |
   | Type | `TXT Record` |
   | Host | `@` |
   | Value | The `google-site-verification=...` string |
   | TTL | Automatic |

   This coexists fine with the Azure TXT record from Part 5 — a host can hold multiple TXT records.

6. Wait a few minutes, then click **Verify** in Search Console. If it fails, wait longer and retry;
   DNS propagation is the usual cause.

### 7.2 Submit the sitemap

1. In Search Console, open **Sitemaps** in the left sidebar.
2. Enter `sitemap.xml` in the "Add a new sitemap" box and click **Submit**.
3. Within a day or so the status should read **Success** with **27 discovered URLs**.

If it reports errors, fetch the file yourself and confirm the URLs match your real domain:

```bash
curl -s https://www.yourdomain.com/sitemap.xml | head -20
```

A mismatch here means Part 3.2 was missed in `scripts/generate-sitemap.mjs`.

### 7.3 Request indexing for your key pages

Submitting a sitemap tells Google the pages exist. Requesting indexing asks it to look now. Do this
for your most important pages — Google rate-limits these requests, so don't try all 27.

For each of the pages below: paste the full URL into the **URL Inspection** bar at the top of
Search Console, wait for the check, then click **Request Indexing**.

1. `https://www.yourdomain.com/`
2. `https://www.yourdomain.com/christian-counseling`
3. `https://www.yourdomain.com/detransition-support`
4. `https://www.yourdomain.com/about`
5. `https://www.yourdomain.com/contact`
6. `https://www.yourdomain.com/fees-insurance`

**Expect this to take time.** A brand-new domain typically takes 1–4 weeks to index meaningfully,
and ranking takes months. This is normal and there is no way to buy your way past it.

### 7.4 Check the structured data

This site emits substantial JSON-LD — `MedicalBusiness`, `Person`, `Service`, `FAQPage`,
`BreadcrumbList`, `BlogPosting`, `EventSeries`. Validate it once, live:

- [Google Rich Results Test](https://search.google.com/test/rich-results) — paste each key URL.
- [validator.schema.org](https://validator.schema.org) — use this for `FAQPage`, since Google's
  tool dropped FAQ support.

In Search Console, **Enhancements** in the sidebar will start reporting structured-data health
after a week or two of crawling.

### 7.5 Bing (five minutes, worth doing)

Go to [Bing Webmaster Tools](https://www.bing.com/webmasters) and choose **Import from Google
Search Console**. It carries over verification and your sitemap. Bing also feeds DuckDuckGo.

### 7.6 Google Business Profile

For a local practice this often drives more traffic than the website's own rankings.

1. Go to [business.google.com](https://business.google.com) and create a profile.
2. **Use exactly the same name, phone, and website URL as `practice.config.ts`.** Inconsistent
   name/address/phone data across the web is a documented local-SEO ranking leak — that consistency
   is the reason the config file exists.
3. This is an online-only telehealth practice serving all of Illinois, so configure it as a
   **service-area business** and hide the street address.
4. Verification is usually by postcard or phone and takes a week or two.

### 7.7 What to check a week after launch

In Search Console:

- **Pages** — how many URLs are indexed, and why any are excluded.
- **Sitemaps** — should show 27 discovered.
- **Performance** — first impressions usually appear within 1–2 weeks.
- **Mobile Usability / Core Web Vitals** — should be clean if Part 1.4 was done.

---

## Part 8 — Launch-day verification

Work through this once the domain is live.

**The site itself**

- [ ] `https://www.yourdomain.com` loads with a valid certificate.
- [ ] `https://yourdomain.com` 301-redirects to the `www` version.
- [ ] Fonts render correctly — serif headings, sans-serif body. Wrong fonts mean a base-path miss.
- [ ] DevTools → Network shows no 404s on any page.
- [ ] Every nav link works, including the mobile menu.
- [ ] All 27 routes load directly (not just via in-app navigation). Spot-check a deep one such as
      `/services/trauma-ptsd-therapy` and a blog post.

**Content and correctness**

- [ ] Phone and email are correct and clickable.
- [ ] The fees table matches reality.
- [ ] The insurance list matches reality.
- [ ] Group times are right.
- [ ] The privacy policy no longer says it's an unreviewed template.
- [ ] Sharing a link on Facebook or LinkedIn produces a preview card with the raster OG image.

**SEO**

- [ ] `https://www.yourdomain.com/robots.txt` returns your real domain in the `Sitemap:` line.
- [ ] `https://www.yourdomain.com/sitemap.xml` returns 27 URLs on the real domain.
- [ ] View source on two pages and confirm `<link rel="canonical">` points at the real domain.
- [ ] Search Console property verified and sitemap submitted.

**Deployment independence**

- [ ] The deployment token is saved in a password manager, not only on one laptop.
- [ ] A second copy of the source exists somewhere other than GitHub (see
      [Part 6.6](#66-keeping-the-source-safe)).
- [ ] You have deployed successfully at least once from the command line, so you know the procedure
      works before you need it urgently.

**Retire the GitHub Pages copy**

Once the real site is live, `matt319940.github.io/mason-kelly-therapy/` is a public duplicate of it.
The canonical tags now point at your real domain, so Google should consolidate them — but the
cleanest outcome is to take it down:

1. On GitHub → repo **Settings** → **Pages** → set **Source** to **None**.
2. Optionally delete the branch: `git push origin --delete gh-pages`.

Keeping it as a staging preview is possible but awkward: it needs the `/mason-kelly-therapy/` base
path that [Part 3.1](#31-remove-the-mason-kelly-therapy-base-path) removed, so you can't serve both
from the same `main` branch without reintroducing that conflict. Now that Azure supports preview
environments ([Part 6.3](#63-a-safer-habit-preview-first)), those are the better staging tool
anyway — and they don't depend on GitHub.

**When you eventually remove the project from GitHub**

Nothing about the live site breaks. Azure has no link to the repository. Before deleting it:

1. Confirm the source exists somewhere else and that a fresh clone of it builds (`npm install &&
   npm run build`).
2. Confirm you still have the deployment token.
3. If GitHub Pages is still enabled, turn it off first so the duplicate copy disappears cleanly.

---

## Troubleshooting

**The site loads but has no styling, or fonts are wrong.**
A base-path problem. Check `grep -o '<base[^>]*>' dist/mason-kelly-therapy/browser/index.html` — it
should print `<base href="/">`. If it prints `/mason-kelly-therapy/`, Part 3.1 was missed or
reverted. Check all three files.

**`npm run build` fails.**
Check your Node version first: `node -v` must be 22.12 or newer. If it's older, that's almost
certainly the cause. On a fresh clone, make sure `npm install` ran successfully before building.

**`swa deploy` says the token is invalid.**
Either the token was truncated when copied, or it's been reset. Get a fresh one from the Azure
portal → your Static Web App → **Overview** → **Manage deployment token**. Also confirm your CLI is
current — `swa --version` must be 2.0.2 or newer, since older releases can no longer authenticate.

**`swa deploy` succeeds but the live site doesn't change.**
You almost certainly omitted `--env production`, so it deployed to a preview environment. Check the
Azure portal under **Environments** — if your change is sitting in a preview there, redeploy with
`--env production`.

**`swa deploy` uploads but pages 404.**
You pointed it at the wrong folder. The argument must be `dist/mason-kelly-therapy/browser` — not
`dist`, and not `dist/mason-kelly-therapy`. Confirm `index.html` sits directly inside the folder
you're deploying:
```bash
ls dist/mason-kelly-therapy/browser/index.html
```

**Azure custom domain validation keeps failing.**
DNS hasn't propagated yet. Confirm what the world actually sees:
```bash
nslookup -type=CNAME www.yourdomain.com
nslookup -type=TXT yourdomain.com
```
If those return nothing, wait — apex changes can take up to 72 hours. Also re-check that
Nameservers is set to **Namecheap BasicDNS**; with Custom DNS selected, the Advanced DNS tab is
ignored entirely.

**Namecheap won't let me add the ALIAS record.**
There's still a conflicting `A`, `AAAA`, `CNAME`, or `URL Redirect` record on the `@` host. Delete
it first.

**I deployed but the site shows old content.**
Almost always browser cache. Compare the live bundle hash against your build (Part 6.5). If they
match, the deploy worked and you're seeing cache — hard-reload or use a private window.

**Search Console says "Discovered – currently not indexed."**
Normal for a new domain. It means Google knows the page exists but hasn't prioritized crawling it.
Time and inbound links are the fix; there's no shortcut.
