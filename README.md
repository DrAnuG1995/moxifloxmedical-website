# Moxiflox Medical — site

Static site for moxifloxmedical.com. No build step, no framework — just HTML, CSS, and a small JS file. Deploys to GitHub Pages.

```
moxiflox/
├── index.html       # homepage (services, approach, who we serve, about, CTA)
├── book.html        # 3-tier booking page with Cal.com embed slots
├── css/styles.css   # all styles (palette, layout, responsive)
├── js/main.js       # footer year + Cal.com embed loader
├── img/             # site images (currently empty)
├── CNAME            # custom domain for GitHub Pages
└── README.md        # this file
```

---

## Hosting decision (read this first)

GitHub Pages allows **one custom domain per repository**. The `statdoctor` repo currently serves the CRM app at `dranug1995.github.io/statdoctor/`. You have two options:

### Option A — Dedicated repo (recommended)

Create a new public repo (e.g. `moxifloxmedical-site`), copy this `moxiflox/` folder to its root, and enable Pages there. This keeps the moxiflox custom domain isolated from the statdoctor app and is the cleanest long-term setup.

```bash
# from this worktree
cp -r moxiflox /tmp/moxiflox-site
cd /tmp/moxiflox-site
git init -b main
git add .
git commit -m "Initial commit: moxiflox medical site"
gh repo create DrAnuG1995/moxifloxmedical-site --public --source=. --push
```

Then in the new repo: **Settings → Pages → Source: GitHub Actions**, and the `deploy-moxiflox.yml` workflow (copy it across) runs on push.

### Option B — Subpath of the existing repo

Leave it here and deploy via the workflow at `.github/workflows/deploy-moxiflox.yml`. The site will serve at `dranug1995.github.io/statdoctor/`. Trade-off: it shares the Pages slot with the statdoctor app — only one of the two can claim the custom domain.

---

## Step 1 — Cal.com setup (5 min)

The booking page renders Cal.com widgets inline. Until you configure Cal.com, the page shows placeholder cards with "Book on Cal.com" links.

1. Sign up at **[cal.com](https://cal.com)** using your **Google account** — this auto-syncs your Google Calendar both ways.
2. **Apple Calendar:** subscribe to the same Google Calendar from Apple's *Calendar → Settings → Add Account → Google*. Bookings will appear on your iPhone and Mac automatically.
3. Connect Stripe: **Cal.com → Apps → Stripe → Install**, sign into your Stripe account.
4. Create three event types with these slugs (Cal.com uses them as URLs):

   | Event type | Slug | Duration | Price |
   |---|---|---|---|
   | 30-minute intro session | `intro-30` | 30 min | $150 AUD (Stripe) |
   | 60-minute deep dive | `deep-dive-60` | 60 min | $250 AUD (Stripe) |
   | Fractional CMO discovery | `fcmo-discovery` | 30 min | Free |

   For the paid events: under the event → *Apps → Stripe* → enable, set price + currency to AUD.

5. Open `js/main.js` and set `CAL_USERNAME` to your Cal.com username (the part after `cal.com/` — e.g. `"anurag-ganugapati"`):

   ```js
   const CAL_USERNAME = "your-cal-username";
   ```

6. Optionally update the fallback "Book on Cal.com →" links in `book.html` (search for `REPLACE-WITH-YOUR-CAL-LINK`) so they work for visitors with JS disabled.

That's it — push, and the booking widgets are live with payment + calendar sync.

---

## Step 2 — Custom domain (DNS)

The `CNAME` file in this folder tells Pages to serve the site at `moxifloxmedical.com`. You also need DNS records at your registrar (the company that sold you the domain — likely Lovable's registrar, GoDaddy, Namecheap, or similar).

Point the domain at GitHub Pages:

```
Type   Host   Value
A      @      185.199.108.153
A      @      185.199.109.153
A      @      185.199.110.153
A      @      185.199.111.153
CNAME  www    dranug1995.github.io   (replace with the username of whichever repo hosts Pages)
```

After DNS propagates (usually < 1 hour), in repo **Settings → Pages**:

- Custom domain: `moxifloxmedical.com`
- Enforce HTTPS: ✓ (wait until the cert provisions, may take a few minutes)

If the domain is currently pointed at Lovable, switching the DNS records above is what completes the migration — Lovable's hosting becomes orphaned and can be cancelled.

---

## Step 3 — Enable the deploy workflow

The workflow at `.github/workflows/deploy-moxiflox.yml` is **manual-only by default** so it doesn't accidentally clobber the existing statdoctor Pages deployment.

To enable auto-deploy on push:

1. Pick your hosting option (A or B above) and configure Pages source to **GitHub Actions**.
2. In `deploy-moxiflox.yml`, uncomment the `push:` trigger block.
3. Trigger the first deploy manually: **Actions tab → Deploy Moxiflox Medical site → Run workflow**.

---

## Local development

```bash
# from the repo root
python3 -m http.server 8091 --directory moxiflox
# then open http://localhost:8091
```

No build step, no node_modules, no watcher — edit and refresh.

---

## Editing content

All copy lives in the two HTML files. Common edits:

- **Hero headline / lede:** `index.html`, search for `class="hero-copy"`
- **Service descriptions / prices:** `index.html` `#services` and `book.html` (keep both in sync)
- **About section:** `index.html` `#about` — bio is a placeholder; drop in real credentials when ready
- **Contact email:** search both files for `hello@moxifloxmedical.com`
- **Color palette:** top of `css/styles.css` (`:root` block)
