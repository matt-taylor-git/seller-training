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

The Default browser suite runs 10 named scenarios through clicks and keys. It covers all 4 customers, CFO recovery, voting, signals, scoring, both Daily Doubles, Final, saved progress, and stale typing.

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

`packs/default.mjs` and `packs/fsi.mjs` each contain one complete aggregate for both activities. `shared/identity.mjs` owns the seller name. `shared/training.mjs` validates and deeply freezes registered packs. Each engine calls `training.openPage(activity)` once and retains that pack. The game engines remain inline module scripts in their own pages.

Each page pins its pack when it opens. Reset, Replay, timers, and Final keep that pack. Selection changes update a notice, never an active game. Reopening an activity adopts the saved selection. Storage events, focus, and browser history restoration refresh the notice.

Selection uses `aiTraining.selection.v1` with `{schema: 1, packId}`. A missing selection uses Default. An invalid or unknown selection also uses Default, but retains an invalid status until an explicit save repairs it. A known pack that fails content checks blocks entry instead of showing another pack under its name. The registry contains Default and FSI. No Settings screen exists yet. Browser test setup selects FSI until the later Settings change.

Jeopardy uses durable `localStorage` under `aiDealJeopardy.v2.<packId>.<revision>`. Each record contains `{schema: 2, packId, packRevision, state}`. The state contains teams, scores, used tiles, Daily Doubles, timer settings, and sound settings. It does not contain an open clue, Final stage, or undo history. Different packs and revisions never share a board.

A valid `aiDealJeopardy.v1` record imports once into Default revision 1 when its destination is absent. The legacy record remains unchanged. The separate `aiDealJeopardy.imported.v1` receipt prevents later deletion of the new save from resurrecting legacy progress. The receipt precedes the destination write. If either write fails, the page reports unsaved progress and keeps playing in memory.

Invalid records and unsupported schemas or revisions remain untouched. Recovery play starts with zero scores and fresh clues. The **Start fresh saved game** button asks before replacing a rejected destination. Cancel leaves the record unchanged. Ordinary scoring and **New game** never approve replacement. A saved game from another revision remains at its original key after recovery.

If storage reads fail, the page plays in memory until reopened. If writes fail, the page shows a save error without stopping play. A failed selection save keeps the prior selection and reports failure. Browser data clearing, private browsing policies, or another origin can remove or isolate these saves. Settings and saves do not sync across devices.

One trainer should host each pack's Jeopardy board in one tab. Concurrent same-pack tabs remain last-write-wins. They do not reconcile active boards or lock other tabs.

Role-play stores only the validated `group`, `spot`, and `ideal` booleans under `aiRoleplay.prefs.v1`. Meetings remain in memory. Opening the page does not overwrite malformed preferences. A deliberate toggle saves the new preferences.

### Shared state API

`training.listPacks()` returns complete frozen packs. `training.selectPack(id)` returns an explicit success or failure result. Settings owns selection writes. `training.openPage(activity)` returns a pinned pack and its state handle. `training.observeSelection(listener)` sends the current selection and later changes, and returns an unsubscribe function.

Jeopardy handles expose `readCheckpoint()`, `saveCheckpoint(state)`, and `replaceCheckpoint(state)`. Only explicit trainer approval permits `replaceCheckpoint`. Role-play handles expose `readPreferences()` and `savePreferences(prefs)`. `selectionNotice(selection)` supplies the current-versus-selected message. The shared module owns browser keys, decoding, migration, and failure policy.

### Verify storage behavior

Run the state checks and the 10 browser lanes:

```sh
node --test tests/training-state.test.mjs
CP2_EVIDENCE_DIR=/tmp/cp2-evidence PORT=8182 npx playwright test tests/browser/pack-state.spec.mjs
node scripts/measure-training.mjs --storage --baseline ../baseline --candidate . --samples 100
```

The browser lanes cover migration, rejected records, isolated packs, pinned play, history, storage failures, durable saves, and same-pack writes. `PORT` gives independent browser runs separate servers. The alternate fixture stays under `tests/fixtures`, outside the served application. Test-only route replacement registers it without a production URL override.

The storage probe times real browser reads and writes with a maximal valid board. Every operation must stay within 10 ms at p95. Checkpoint JSON must stay below 16 KiB. The probe also retains the page-load limits above. Trunk has no selection feature, so its absent-key read appears separately from candidate selection resolution.

## Verify FSI

FSI adds fictional bank, insurance, wealth, and payments conversations. It teaches data ownership, human review, platform qualification, workload-specific hosting, and measured value. Its board contains 6 categories, 30 clues, and 1 Final. Both activities share one pack.

The pack contains 23 nodes, 69 choices, 12 outcomes, and 5 takeaways per scenario. Bank and insurance each take 7 choices. Insurance recovery uses an alternate second node without changing the engine. Wealth and payments each take 4 choices.

Read [the FSI authoring record](content-authoring/README.md) for source dates, claim coverage, review status, and distribution limits. All 35 items have evidence records with 56 claim entries. The source compilation is not copied into the repository. Provenance stays outside the web root.

Run the content and 10 browser lanes:

```sh
node scripts/check-content.mjs
node --test tests/fsi-content.test.mjs
CP3_EVIDENCE_DIR=/tmp/cp3-evidence PORT=8183 npx playwright test tests/browser/fsi.spec.mjs
node scripts/measure-training.mjs --baseline ../baseline --candidate . --samples 20 --packs default,fsi
```

The browser lanes select FSI through declared localStorage setup, then use actual clicks and keys. They cover ideal play, risky bank play, insurance recovery, all 31 quiz answers, both Daily Doubles, Final scoring, Default return, and group-mode density. Readability checks run at 1440 by 900 and 1920 by 1080 pixels. They count rendered lines, record text and element heights, and pin existing font sizes. Regular answers allow 3 lines, Final answers allow 4, and supporting notes allow 3. Authored word ceilings also prevent oversized copy before browser testing. `CP3_EVIDENCE_DIR` retains screenshots, answer records, and browser error logs. Playwright saves videos and traces under `test-results`.

The performance probe measures actual candidate Default and FSI entries against equivalent baseline Default screens. It records 20 cold samples per route and version, interleaves baseline and candidate, and blocks remote fonts. The same 1000 ms, 150 ms delta, and 400 KiB limits apply. Run a separate comparison against the CP2 worktree to retain its Default baseline.

Coming Soon plays remain unavailable. Offering descriptions reflect the supplied compilation on 2026-10-07, not a verified live catalog. Confirm current scope and prerequisites before customer use. The integration task reports a source-reviewed draft with PASS and 2 minor notes, which this change addresses. Parent review of the final committed pack remains open. Public hosting and distribution are not approved by this change.

## Supplied material

- `prototype/seller-ai-training/`: prototype pages and screenshots.
- `prototype/seller-ai-training.zip`: the original supplied archive.

Company names, personas, figures, and service claims in the scenarios are illustrative training content, not verified customer evidence.
