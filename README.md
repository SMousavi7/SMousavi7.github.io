# smousavi7.github.io

Personal site for **S. Sadra Mousavi** — computer engineering, embedded systems, IoT and edge computing.

Static HTML, CSS and vanilla JavaScript. No framework, no build step, no tracking.
Everything in this repository is exactly what the browser receives.

---

## Publishing it on GitHub Pages

The site is meant to live at **`https://smousavi7.github.io`**, which GitHub serves from a
repository named after your account.

1. **Create the repository** — on GitHub, *New repository* → name it exactly:

   ```
   SMousavi7.github.io
   ```

   Public, and **without** a README, `.gitignore` or licence (this folder already has what it needs).

2. **Push this folder into it:**

   ```bash
   cd path/to/this/folder
   git init                       # skip if the repo is already initialised
   git add .
   git commit -m "Personal site"
   git branch -M main
   git remote add origin https://github.com/SMousavi7/SMousavi7.github.io.git
   git push -u origin main
   ```

3. **Turn Pages on** — repository → *Settings* → *Pages* →
   *Source: Deploy from a branch* → branch `main`, folder `/ (root)` → *Save*.

The first build takes a minute or two. After that the site is live at
`https://smousavi7.github.io` and every `git push` republishes it.

### Using a different repository name

If you name the repository something else — say `portfolio` — the site is served from a
subpath (`https://smousavi7.github.io/portfolio/`) instead. In that case, edit `index.html`
and change the four absolute URLs (`<link rel="canonical">`, `og:url`, `og:image`, and the
`url` in the JSON-LD block) plus the `Sitemap:` line in `robots.txt` and the `<loc>` in
`sitemap.xml`. The `404.html` page uses root-absolute paths (`/assets/...`) and would need
the prefix too. Using `SMousavi7.github.io` avoids all of this.

---

## Layout

```
index.html              the whole page — every section lives here
404.html                not-found page
assets/
  css/style.css         design tokens, layout, light + dark themes
  js/config.js          >> the CV file path — the one file to edit for your own CV
  js/main.js            theme toggle, mobile menu, scroll spy, project filter
  img/favicon.svg       browser-tab icon
  img/og.png            1200×630 preview card for links shared on social/messengers
  files/…-CV.pdf        the CV the "Download CV" button serves
robots.txt, sitemap.xml
.nojekyll               tells GitHub Pages to serve the files as-is
```

## Editing it later

Everything is plain HTML — open `index.html` and change the text.

- **A new project** — copy one `<article class="card">` block in the `#projects` section and
  edit it. The `data-cat` attribute controls which filter buttons show it; the values in use
  are `hardware`, `embedded`, `security`, `systems` and `ai`, and a card can carry several
  (`data-cat="hardware security"`). Add `class="card card--wide"` to make it a double-width
  feature card.
- **A new teaching role or degree** — copy an `<li class="tl__item">` block.
- **Colours and spacing** — the `:root` block at the top of `assets/css/style.css`. The dark
  palette is redefined twice below it: once under `prefers-color-scheme` (the system default)
  and once under `[data-theme="dark"]` (the manual toggle). Change both.
- **A new CV** — put the PDF in `assets/files/` and set its path in **`assets/js/config.js`**:

  ```js
  window.SITE = {
    cvPath: 'assets/files/my-cv.pdf',      // relative to index.html, no leading slash
    cvFileName: 'S-Sadra-Mousavi-CV.pdf',  // what the visitor's browser saves it as
  };
  ```

  Both "Download CV" buttons — the one in the nav bar and the one in the hero — read from
  there, so this is the only line to change. They carry the same path inline in `index.html`
  as a fallback for visitors with JavaScript disabled; if you care about that case, update
  the two `href="assets/files/…"` values to match (they are marked with a comment).
- **The link preview image** — replace `assets/img/og.png` with another 1200×630 image.

Anything with `class="reveal"` fades in as it scrolls into view; new blocks get the same
behaviour just by carrying that class.

## Previewing locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Opening `index.html` straight from the filesystem mostly
works too, but a local server matches how GitHub Pages actually serves it.

## Notes

- The page works with JavaScript disabled — the script only adds the theme toggle, the mobile
  menu, the project filter and the scroll animations.
- Both themes were checked against WCAG AA (4.5:1 for body text), and everything respects
  `prefers-reduced-motion`.
- The phone number in the contact section comes from the CV. Delete that `<li>` in `#contact`
  if you would rather not have it on a public page.
