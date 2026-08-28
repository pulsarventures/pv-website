# Pulsar Ventures Website

A modern, responsive website for Pulsar Ventures built with Jekyll and deployed on GitHub Pages.

## 🚀 Quick Start

### Prerequisites

Either of:
- **Docker** — recommended, and the only path that needs no local Ruby
- **Ruby 3.4.x + Bundler** — if you'd rather run natively

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone git@github.com:pulsarventures/pv-website.git
   cd pv-website
   ```

2. **Run the preview server**

   **With Docker (recommended).** Gems are vendored into `.jekyll-bundle/`, a
   gitignored directory you populate once. On a fresh clone, run this first:

   ```bash
   docker run --rm \
     -v "$PWD":/srv/jekyll \
     -e GEM_HOME=/srv/jekyll/.jekyll-bundle \
     -e GEM_PATH=/srv/jekyll/.jekyll-bundle \
     -e BUNDLE_GEMFILE=/srv/jekyll/Gemfile \
     jekyll/jekyll:4 \
     bash -lc "cd /srv/jekyll && bundle install"
   ```

   Once `.jekyll-bundle/` exists, every later boot skips `bundle install` and comes
   up in a few seconds:

   ```bash
   docker run -d --name pv-preview \
     -v "$PWD":/srv/jekyll \
     -e GEM_HOME=/srv/jekyll/.jekyll-bundle \
     -e GEM_PATH=/srv/jekyll/.jekyll-bundle \
     -e BUNDLE_GEMFILE=/srv/jekyll/Gemfile \
     -p 4000:4000 -p 35729:35729 \
     jekyll/jekyll:4 \
     bash -lc "cd /srv/jekyll && bundle exec jekyll serve --host 0.0.0.0 \
       --watch --livereload --livereload-port 35729 --force_polling"
   ```

   Useful follow-ups:
   ```bash
   docker logs -f pv-preview     # watch the build
   docker rm -f pv-preview       # stop and remove
   ```

   The project root is bind-mounted, so edits on the host rebuild immediately.
   `--force_polling` is required for reliable file watching across the Docker/WSL
   filesystem boundary.

   **With local Ruby:**
   ```bash
   bundle install
   bundle exec jekyll serve
   ```

3. **Visit the site**
   Open http://localhost:4000 in your browser. LiveReload runs on port 35729.

### Routes

The site is currently a single-page landing plus two secondary routes. Only these build:

| Route | Source | Layout |
|---|---|---|
| `/` | `index.html` | `site` |
| `/about-us/` | `_pages/about-us.html` | `site` |
| `/blog/` | `_pages/blog.md` | `site` (meta-refresh to `/`, `noindex`, excluded from the sitemap) |

Older routes — `/services/`, `/contact/`, `/products/`, `/company/`, `/ai-musings/` —
were removed in `2065d12` when the landing page was consolidated. They now 404. No
live page links to them; the only remaining references are inside orphaned layouts
(`page-v4.html`, `page-v6.html`, `footer-v6.html`) that no built page renders.

## 📁 Project Structure

```
pv-website/
├── _config.yml                 # Jekyll configuration
├── _layouts/                   # Page layouts (see "Live vs. legacy" below)
├── _includes/                  # Reusable components
├── _pages/                     # Secondary pages (about-us, blog)
├── assets/
│   ├── css/                    # site.css (live + tokens); design-system.css, main.scss (legacy)
│   ├── js/                     # home.js, about.js, site-nav.js, main.js
│   └── img/                    # brand, clients, partners, products, team, tech-logos
├── index.html                  # Homepage
├── 404.html                    # Custom 404 page
├── v1.html … v4.html           # Design prototypes, not linked from the site
├── .jekyll-bundle/             # Vendored gems (gitignored, created by the Docker preview)
├── .github/workflows/          # GitHub Actions
├── Gemfile                     # Ruby dependencies
└── CNAME                       # Custom domain
```

There is no `_posts/` or `_sass/` directory — the blog collection and the SCSS
partials tree were both removed.

### Live vs. legacy layouts

The site currently renders through **one** layout chain. Everything else is left
over from earlier design iterations and is not reachable from any built page.

- **Live**: `_layouts/site.html` → includes `head-site.html`, `site-nav.html`, `site-footer.html`
- **Live stylesheet**: `assets/css/site.css` (the only stylesheet `head-site.html` links)
- **Used only by `404.html`**: `_layouts/default.html` → `head.html` / `header.html` / `footer.html`, which still pull in Bootstrap 5.3 and `main.css` (compiled from `main.scss`)
- **Legacy / orphaned**: `landing.html`, `landing-v3.html`, `landing-v4.html`, `landing-v6.html`, `page.html`, `page-v4.html`, `post.html`, and the `-v6` includes

Note that `_config.yml` sets the default layout for the `pages` collection to
`page-v6`, but both live pages override it with `layout: site` in their front matter.

## 🎨 Content Management

### Adding New Pages

1. Create a new file in `_pages/`, e.g. `page-name.html`
2. Add front matter — set the layout explicitly, since the collection default is stale:
   ```yaml
   ---
   layout: site
   title: "Page Title"
   description: "Used for SEO and social cards"
   permalink: /page-name/
   page_js: /assets/js/page-name.js   # optional, per-page script
   ---
   ```
3. Write your content
4. Commit and push

### Updating Navigation

Edit `_includes/site-nav.html`. (`_includes/header.html` belongs to the legacy
`default` layout and only affects the 404 page.)

## 🛠️ Customization

### Styling
- **Live styles**: `assets/css/site.css` — this is the whole live layer
- **Design tokens**: the `:root` block at the top of `site.css`. The Cosmic
  Direction palette lives there as CSS custom properties (`--page`, `--paper`,
  `--ink-display`, `--pulsar`, …); change a colour there, not at the call site
- `assets/css/design-system.css` is **orphaned** — only `_includes/head-v6.html`
  links it, and no built page renders a `-v6` layout. It still carries a stale
  `--brand: #064e35` from the retired green palette
- `assets/css/main.scss` is legacy and only affects `404.html`. It builds clean —
  it uses `@use "sass:color"` with `color.adjust()`, not the deprecated global
  `darken()`/`lighten()`. Keep it that way if you touch it.

### Scripts
Per-page JS is opted into via the `page_js` front-matter key, which the `site`
layout renders as a script tag. `site-nav.js` loads on every page.

## 🔧 Configuration

### Jekyll Settings (`_config.yml`)
- Site title and description
- URL configuration
- Plugins: `jekyll-feed`, `jekyll-seo-tag`, `jekyll-sitemap`
- Collection and default-layout definitions

### Custom Domain
- Domain: pulsarventures.co
- CNAME file included in repository
- DNS configured for GitHub Pages

## 🚀 Deployment

- **Live Site**: https://pulsarventures.co
- **GitHub Pages**: https://pulsarventures.github.io/pv-website

Deployment runs through `.github/workflows/deploy.yml` (Ruby → `bundle exec jekyll build`
→ `peaceiris/actions-gh-pages`, publishing `./_site` with the CNAME).

> **Deploys are manual.** The `push` and `pull_request` triggers in `deploy.yml` are
> currently commented out — the workflow is `workflow_dispatch` only. Pushing to `main`
> will **not** publish. Run the workflow from the Actions tab, or uncomment the `push`
> trigger to restore automatic deploys.

The deploy job additionally guards on `github.ref == 'refs/heads/main'`, so a
dispatch from another branch builds but does not publish.

## 🔍 SEO

- Meta tags generated by `jekyll-seo-tag`, driven by each page's `title`/`description`
- Sitemap generated by `jekyll-sitemap`
- Open Graph and Twitter card tags in `_includes/head-site.html`

## 🐛 Known Issues

None outstanding. No built page links to a route that 404s, and the build is clean
apart from one unrelated notice from Ruby itself (`logger was loaded from the
standard library…`), which comes from `jekyll` and not from this repo.

The legacy layouts (`landing*.html`, `page.html`, `page-v4.html`, `page-v6.html`,
`post.html`) and their `-v6` includes are still checked in and still contain dead
`/products/`, `/services/` and `/company/` links, but no built page renders them.
They are dead weight rather than a live defect — delete them when someone is
confident the design iterations are finished with.

## 🐛 Troubleshooting

1. **`Gem::LoadError: You have already activated rake …, but your Gemfile requires rake 13.3.0`**
   The `jekyll/jekyll:4` image ships a newer rake than the lockfile pins. Always
   prefix with `bundle exec` — never call `jekyll` directly inside the container.

2. **`bundle install` hangs on "Fetching source index from https://rubygems.org/"**
   You only need it once. After `.jekyll-bundle/` is populated, the ABI (Ruby 3.4.0)
   matches the `jekyll/jekyll:4` image, so set `GEM_HOME`/`GEM_PATH` as in the Quick
   Start and go straight to `bundle exec jekyll serve` on every later boot. Run the
   install step natively rather than under `sudo`, and delete a half-written
   `.jekyll-bundle/` before retrying.

3. **Edits don't trigger a rebuild**
   Confirm `--force_polling` is in the serve command. Without it, file-change events
   don't cross the Docker/WSL boundary.

4. **Port 4000 already in use**
   A previous preview is probably still up: `docker rm -f pv-preview`.

5. **Site not updating after push**
   Expected — see the deployment note above. Deploys are `workflow_dispatch` only.

## 📄 License

This project is proprietary to Pulsar Ventures.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test locally
4. Submit a pull request
5. Wait for review and merge

---

**Built with ❤️ by Pulsar Ventures**
