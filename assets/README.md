# Portfolio site — static HTML/CSS/JS

## Why this stack
Plain HTML, CSS and vanilla JS — no build step, no framework. For a one-person
portfolio this is the right call: pages are indexable by search engines the
moment they load (nothing waits on JavaScript to render), it loads fast on any
device, and you can host it anywhere for free (GitHub Pages, Netlify,
Cloudflare Pages) or drop it on any shared host as-is.

## Run it on localhost
Pick whichever you have installed:

**Python (already on most machines):**
```
cd portfolio
python3 -m http.server 8000
```
Open http://localhost:8000

**Node:**
```
cd portfolio
npx serve .
```

**VS Code:** install the "Live Server" extension, right-click `index.html` →
"Open with Live Server".

## Before you publish — replace the placeholders
- Every `[bracketed]` string in `index.html` — your name, headline, bio, project
  copy, credentials.
- The three project cards in `#projects` — swap in real case studies and links.
- `about-layout__photo` and `profile__avatar` — replace the initials block with
  an actual `<img>` (remember descriptive `alt` text).
- Social links in the sidebar (LinkedIn, GitHub, Facebook `href="#"`).
- `your-domain.com` throughout `index.html`, `robots.txt` and `sitemap.xml`.
- The contact form posts nowhere yet — wire `js/script.js`'s submit handler to
  an email service or a form endpoint such as Formspree.

## Accessibility notes
- Base text size starts larger than the typical 16px default, with an A-/A/A+
  control in the sidebar for further adjustment.
- Full keyboard navigation with a visible focus ring, and a skip-to-content
  link for screen reader and keyboard users.
- Color palette (Toxic Violet `#FF9030` on Soft Chrome `#111827`, and dark
  text on white) meets WCAG AA contrast at minimum.
- The tools marquee pauses on hover/focus and respects
  `prefers-reduced-motion`.

## Structure
```
portfolio/
├── index.html
├── css/style.css
├── js/script.js
├── robots.txt
└── sitemap.xml
```
