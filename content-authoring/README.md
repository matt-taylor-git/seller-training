# Financial services authoring record

Revision 2 replaces the earlier financial-services curriculum. The product contract is [PRODUCT.md](../PRODUCT.md). The [lesson map](fsi-lesson-map.md) records the outline written before the pack, each node's knowledge progression, and every quiz premise.

The pack contains:

- 4 fictional situations across banking, insurance, wealth management, and payments.
- 2 full scenarios with 6 turns each and 2 quick scenarios with 4 turns each.
- 22 reachable nodes, 66 seller replies, and 22 marked signals.
- 12 outcome descriptions and 16 takeaways.
- 30 standalone clues across 6 skill categories and 1 Final.
- 1,620 terminating choice routes, all at the advertised turn depth.

The bank and insurance each have an alternate second turn. Early premature suggestions cause a different customer response. Recovery can improve the score without adding a turn. Outcomes assess the approach rather than claiming that a high score booked a meeting.

## Reading budgets

Regular questions contain 18 to 29 words. Answers contain 7 to 14 words and at most 82 characters. Explanations contain 18 to 26 words. Final contains 34 answer words and 28 explanation words.

The limits remain 25 answer words, 110 answer characters, and 40 explanation words for regular clues. Final allows 45 answer words and 40 explanation words. The tests also preserve the combined limits of 65 and 85 words.

Browser checks render all 30 answers at 1440 by 900 and 1920 by 1080 pixels. They preserve the existing limits of 3 answer lines, 3 explanation lines, and 4 Final answer lines. The observed regular maximum is 2 answer lines and 2 explanation lines at both sizes. Final uses 3 answer lines and 2 explanation lines.

The browser tests pin the original answer font sizes. They check clipping and exercise the longest seller reply in group mode at both sizes. They do not shrink fonts or change layout. The test browser blocks remote font requests and uses the existing fallback fonts.

## Evidence

[fsi-provenance.json](fsi-provenance.json) maps all 35 items to 48 evidence entries. Each entry distinguishes a source claim, a fictional fact, or an authored recommendation. Source claims carry section references, dates, limits, and content locations.

Each item also carries a hash of its complete authored content. If that content changes, review the evidence before updating its hash. Within each evidence item, the checker requires each visible offering mention to have a source claim for the same offering at the exact text location. It checks known names without relying on capitalization. A hash or location check does not prove that the source supports the claim.

The evidence refers to the complete internal compilation dated 2026-10-07. Its SHA-256 is `31530f3c151f34e3f18d33cdc2ced30f4733361519bef5b35ee70e763118092b`. The author read that supplied compilation. Linked research and offering pages were not independently retrieved, and current availability remains unverified.

All people, companies, dialogue, figures, work practices, and outcomes are fictional. Working meetings, document samples, consent rules, test designs, and measures are authored recommendations. They are not extra service deliverables or guaranteed returns.

The pack uses only these source-described offers:

- Private AI Launch Workshop.
- AI Readiness Data Quality Assessment.
- AI Risk Assessment.
- Copilot Adoption and Change Management.
- FirstTouch AI.

The pack does not claim a turnkey claims or wealth integration. FirstTouch AI's first-contact scope does not imply refund authority. Private hosting does not guarantee security or approval. An assessment does not grant regulatory approval.

The raw source stays private and outside this repository's served tree. Prices, personal contacts, internal links, campaign tags, and routing instructions do not belong in the lessons. Coming Soon and under-construction exclusions remain in the checker and evidence policy even though those offers do not appear in this curriculum.

### Claim locations and offering identity

The record remains schema 1. A source claim can now carry an optional `offering` string. This additive authoring metadata does not change the served pack or storage contract.

The checker accepts only the 5 selected offering names listed above and the 7 unavailable names in `authoringPolicy.availability`. Fictional facts and authored recommendations cannot carry `offering`. A source claim without that field cannot cover an offering mention, even if its prose contains the name.

Offering claims use exact visible string locations, such as `nodes.transfer.ch[1].t`, `offering.steps[1]`, or `why`. Every mention within an item needs a source claim whose `offering` matches the named service and whose `locations` contains that exact path. Ancestor objects such as `nodes`, `offering`, and a whole choice cannot supply offering coverage. Human review still checks whether the cited source actually supports the mapped text.

Other claims can use broader locations when they contain authored visible text. The checker traverses only own properties. Locations that resolve only to identifiers, revisions, graph links, choice quality, scores, numbers, array length, or functions do not count. Paths use dot-separated property names and bracketed array indexes.

### Unavailable offering mentions

The checker covers every visible text field, including headings, persona text, signals, coaching, outcomes, quiz text, labels, descriptions, and disclaimers. No unavailable offering appears in the current curriculum.

The sole permitted exception pairs a nonideal seller reply with this exact immediate coaching template:

```text
<official offering name> is unavailable. Do not recommend it.
```

Both fields also need exact source-claim locations with matching `offering` metadata. The same coaching cannot excuse a mention elsewhere or an ideal reply. Headings do not need sentence punctuation. A negated explanation outside this pair still fails, because the local policy does not attempt to interpret arbitrary negation.

## Checks

From the repository root, run:

```sh
npm run lint
npm run typecheck
npm test
node scripts/check-content.mjs --source /path/to/FSI_AI_Research_and_CDW_Seller_Playbook.md
npm run test:browser
```

The source-aware check must report 35 evidence items, 48 evidence entries, and 4 excluded source contacts. Keep the supplied source local.

The final correction run passed 281 Node tests and 42 browser tests. The Node total includes 88 boundary tests with fresh content hashes. Browser coverage includes all 4 scenarios, both recoveries, a poor route, all clues, Final, Daily Doubles, signals, group voting, Settings, and persistence. Revision-1 progress remains intact. The trainer can recover valid team names, but must explicitly create revision-2 progress.

The original author's first full browser run timed out opening Settings from a Default clue. The unchanged test passed on a focused retry and on the next full run. No engine or generic assertion changed to hide that failure. The evidence retains the first log and trace.

## Retired revision-1 assumptions

The old behavior fixture froze identities, scores, graph structure, signal positions, and question size classes. Those expectations contradicted the approved fresh curriculum. The unused `tests/fixtures/fsi-original.json` was removed. A small revision-1 checkpoint fixture preserves compatibility testing without keeping the old lessons active.

The old copy tests also froze quiz meanings and positions, ordered catalog lists, 11 option-list questions, and technical prerequisites. New tests cover the new goals, exact route depths, score dimensions, attainable outcomes, independent premises, and evidence locations. Headings no longer need sentence punctuation. The old minimum of 56 claims no longer forces unrelated catalog content into the lessons.

The reduced test count does not remove generic engine tests. Default checks, pack validation, generic state tests, and generic browser suites remain intact. The only Settings test change uses the current FSI revision key and asserts that a save actually exists.

## Review limits

[The author review](fsi-author-review.md) records branch checks and concrete editorial corrections. No test proves natural dialogue or an eighth-grade reading level. No independent reader or learner study ran in this task.

The parent still owns independent review, final Linux and performance checks, audience approval, and publication. This local commit does not authorize distribution.
