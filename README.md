# Gøteborg Invitational

Tournament site for the Gøteborg Invitational — 7 friends, 3 rounds, 1 trophy.
July 10–12, 2026 at Sankt Jörgen Park Golf, Göteborg.

## Stack

No build step. Plain HTML/CSS + native ES modules. Heavy libraries (Three.js,
GSAP, Lenis, canvas-confetti) load from jsDelivr via an import map, pinned to
exact versions, and every one of them fails soft — if a CDN request dies, the
site stays fully readable.

## Run locally

ES modules need a server (not `file://`). Any static server works:

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

## Deploy to GitHub Pages

No CI needed — the repo root is the site:

1. Push to GitHub.
2. Repo → Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.

All asset paths are relative, so it works both at `user.github.io/repo/` and on
a custom domain. The `.nojekyll` file keeps Pages from running Jekyll.

## Where things live

- Facts (players, tee times) → `js/data.js` — edit here, everything re-renders
- Live scores → `index.html`, the `#leaderboard` table
- Putting game tuning → constants at the top of `js/putt.js`
