# Seller training

A web product for trainer-led sessions that help sellers identify AI use cases and position relevant offerings.

The repository currently contains supplied prototypes and a product record. The actual product has not been built yet.

## Product direction

Read [PRODUCT.md](PRODUCT.md) for confirmed product facts and open decisions.

Read [DESIGN.md](DESIGN.md) for the customer role-playing page's CDW-inspired dark design. It records the current colors, typography, components, and desktop layout. Jeopardy and the launcher remain outside its scope.

[The Impeccable design companion](.impeccable/design.json) contains component previews and motion guidance. Its generated color ramps are preview aids, not additional application tokens.

## Try the prototypes

From the repository root, run:

```sh
python3 -m http.server 8000 --directory prototype/seller-ai-training
```

Open http://localhost:8000 to see the launcher. Choose either activity:

- **AI Deal Jeopardy**: a team quiz with presenter scoring.
- **Customer role-play**: scripted conversations with coaching, signal spotting, and a debrief.

The prototypes use static HTML, CSS, and JavaScript modules. Serve the pages over HTTP rather than opening local files directly. They do not call a live AI model. Google Fonts requires an internet connection, but the pages include fallback fonts.

All 3 pages use CDW as the seller identity. Default preserves the original fictional customers, scenarios, and clues. Its illustrative offers are not a verified CDW catalog.

The trainer operates the shared screen. Group mode lets the trainer tally room votes manually, rather than connecting participant devices.

## Verify Default

Use Node.js 22 or later and Python 3. Run these checks from the repository root:

```sh
npm ci
npm run lint
npm run typecheck
npm test
npx playwright install chromium
npm run test:browser
```

The browser suite runs 10 named scenarios through clicks and keys. It covers all 4 customers, CFO recovery, voting, signals, scoring, both Daily Doubles, Final, saved progress, and stale typing.

The checks compare every content leaf with `tests/fixtures/default-original.json`. That immutable fixture comes from source commit `96c2e50d06524afb6050d22fed0366fac0a9141b`. Only 5 Jeopardy strings permit the seller substitution. Do not regenerate the fixture from the moved data.

The existing Final button remains hidden by inherited styling. Press **F** from the board to open Final Jeopardy.

To compare live role-play traces with that source commit, serve its worktree on a separate port. Set `CP1_BASELINE_URL` to that server's origin when running the browser suite. Set `CP1_EVIDENCE_DIR` to a local folder to retain screenshots and traces.

To compare load times, run:

```sh
node scripts/measure-training.mjs --baseline ../baseline --candidate . --samples 20
```

The probe starts Python servers and interleaves cold browser contexts with fonts blocked. It measures the playable board and picker at 1440 by 900 pixels. Each candidate route must stay within these limits:

- 1000 ms at the 95th percentile.
- 150 ms above the baseline at the 95th percentile.
- 400 KiB of decoded first-party HTML and JavaScript.

## Content and saves

`packs/default.mjs` contains one complete aggregate for both activities. `shared/identity.mjs` owns the seller name. `shared/training.mjs` validates and deeply freezes registered packs. Each engine calls `training.openPage(activity)` once and retains that pack. The game engines remain inline module scripts in their own pages.

CP1 keeps the existing save keys and formats. Jeopardy stores its teams, scores, used tiles, Daily Doubles, timer settings, and sound setting under `aiDealJeopardy.v1`. It does not save an open clue, Final stage, or undo history. Role-play stores only presenter preferences under `aiRoleplay.prefs.v1`. Meetings remain in memory. This change adds no selection screen or alternate pack.

## Supplied material

- `prototype/seller-ai-training/`: prototype pages and screenshots.
- `prototype/seller-ai-training.zip`: the original supplied archive.

Company names, personas, figures, and service claims in the scenarios are illustrative training content, not verified customer evidence.
