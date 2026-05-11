# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static personal portfolio site — vanilla HTML/CSS/JS, no build step, no framework. Served via Nginx on a self-hosted Raspberry Pi 400 at `work.czvck.com`.

## Development

No build pipeline. Edit files directly and serve them:

```powershell
# Quick local dev server (Python)
python -m http.server 8080

# Or with Node
npx serve .
```

There are no lint, test, or type-check commands configured.

## Architecture

**Frontend** (`index.html`, `assets/css/style.css`, `assets/js/main.js`):
- Single HTML page with semantic sections: nav, hero, projects, about, contact, footer
- `main.js` handles two responsibilities:
  1. Chart.js initialization — fetches `/api/speedtest` on load and every 15 minutes to render the network speed dashboard
  2. Contact form — POSTs to `https://work.czvck.com/contact/` with client-side validation and honeypot spam protection

**Backend** (separate repo, not in this directory):
- Flask API on the Raspberry Pi
- `GET /api/speedtest` — returns JSON array of `{timestamp, download, upload, ping}` readings
- `POST /contact/` — handles contact form submissions

**MTG Price Oracle** project card embeds an iframe from a separate ECharts-based service (also self-hosted).

## Styling Conventions

- All colors are CSS custom properties defined at `:root` — use `--color-*` variables, never hardcode hex values
- Dark terminal aesthetic: `#0d0f0e` background, `#1D9E75` teal accent
- Typography: JetBrains Mono for code/technical content, Syne for headings
- Responsive breakpoints: `<640px` and `<600px` (media queries in style.css)
- Animations: staggered fade-up on load via `.fade-up` class and `animation-delay`

## Key Design Patterns

- Grid background is a fixed `::before` pseudo-element on `body` — don't add background to child elements that need the grid to show through
- Project cards use `.project-card` with a `.stack` badge list at the bottom
- Terminal aesthetic uses `>` prefixes and monospace font for CLI-style text elements
