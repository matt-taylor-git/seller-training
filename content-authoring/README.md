# FSI authoring record

FSI contains 4 fictional financial-services conversations and a complete Jeopardy board. The pack teaches discovery and qualification, not a guaranteed customer outcome.

The served pack contains 23 nodes, 69 choices, 12 outcomes, and 20 takeaways. Its bank and insurance routes each use 7 choices. Wealth and payments each use 4 choices. Insurance recovery uses an alternate second node, so it does not show an eighth turn against a 7-turn label.

The board contains 6 categories with 5 progressively harder clues each and 1 Final. The existing engine selects 2 Daily Doubles. No game rules changed.

## Presenter reading budget

Regular answers contain at most 25 words. Their coaching contains at most 40 words, with at most 65 words combined. Final allows 45 answer words, 40 coaching words, and 85 combined words. Word counts use whitespace-separated words.

Final asks for one bounded task, 2 signals, one qualified CDW next step with owners, and one rejected promise. Its model answer contains 37 words. Its coaching contains 31 words. Role-play and provenance retain the broader discovery detail.

Browser lanes 6 through 9 count actual text lines and record text height, element height, font size, and line height. They test 1440 by 900 and 1920 by 1080 pixels. Regular answers allow 3 lines. Final allows 4 answer lines. Supporting notes allow 3 lines. Tests pin the existing font sizes and wait for reveal animations to finish. They still check clipping and scoring.

## Evidence and review limits

`fsi-provenance.json` maps all 35 content items to 56 material claim entries. Scenario claims also identify their locations. Each claim names sections, dates, and limits from the supplied playbook compiled on 2026-10-07. Its SHA-256 hash identifies the exact compilation. Offering dates identify that compilation, not live catalog publication dates.

The integration task reports an independent source review of the draft with PASS and 2 minor notes. This pack spells out United Kingdom and restructures insurance recovery. The integrator also read the complete compilation and compared offering claims and answers. The readability revision rechecked all changed clue fields and Final against that compilation. Final now omits the customer-facing launch and its possible future services. Its evidence record follows the narrower scored task. The parent must review the final committed pack separately. No linked offering page or external source was independently fetched for this change.

All customers, dialogue, customer metrics, and outcomes are fictional. Scoping meetings, evaluation cohorts, sample controls, and stop rules are authored recommendations. They are not additional service deliverables.

The source is CDW Internal. This directory stays outside the served application. Neither the source file nor its prices, personal contacts, routing instructions, campaign tags, or SharePoint URLs belongs in served files. The repository does not contain a raw copy of the source.

Availability reflects the supplied snapshot. Coming Soon plays remain unavailable. Assessments do not grant regulatory approval. Penetration tests do not guarantee security. Private hosting does not establish lower costs or compliance. Survey results describe their own samples, not audited returns.

## Run content checks

From the repository root, run:

```sh
node scripts/check-content.mjs
node --test tests/fsi-content.test.mjs
```

The report must show 35 evidence items and 56 claim entries. The checks require complete games, terminating graphs, complete sentences, corrected unavailable plays, and local acronym definitions in standalone explanations.

To check the supplied compilation and exclude its named contacts, run:

```sh
node scripts/check-content.mjs --source /path/to/FSI_AI_Research_and_CDW_Seller_Playbook.md
```

The source must match the recorded hash. The report must show 4 source contacts checked. Keep the source local. Do not commit or publish it.

Distribution still requires a separately approved audience and hosting decision. Content review does not supply that approval.
