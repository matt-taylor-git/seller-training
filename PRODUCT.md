# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

The product runs in desktop browsers for trainer-led sessions. Mobile use is out of scope. No native app requirement has been established.

## Users

- Trainers lead sessions and operate the training activities.
- Sellers participate in trainer-led sessions to practice selling AI services.

Trainer-led sessions are the confirmed primary use. Independent seller training is not an established requirement.

## Product Purpose

Help sellers identify AI use cases and position offerings against customer needs.

Success means sellers can recognize a relevant AI use case in a customer conversation and explain which offering addresses it. How to measure this improvement remains undecided.

## Operating Context

The user likes the existing prototypes as references for building the actual product. They are not the finished product or a fixed specification.

The prototypes support training in a room or over screen share. A presenter operates the shared screen, records team scores, and enters room votes. Group voting does not currently connect participant devices.

## Capabilities and Constraints

### Existing prototype capabilities

- A launcher connects the team quiz and customer role-play activities.
- AI Deal Jeopardy has 6 categories, 30 clues, 2 Daily Doubles, and a final round. It supports 2 to 4 teams, presenter scoring, a timer, sound, and browser-local game state.
- Customer role-play uses 4 scripted customer personas with branching responses, coaching, signal spotting, group voting, and a debrief scorecard.
- Role-play scores discovery, listening, use-case identification, positioning, and trust.
- The prototypes use static HTML, CSS, and JavaScript. Conversations and coaching come from authored content, not a live AI model.

These describe the current prototypes. They do not commit the actual product to the same activities, scoring, technical stack, or conversation mechanism.

### Open product decisions

- The approved offering catalog. The prototype uses CDW as the seller identity, but Default's illustrative offers do not establish catalog approval.
- The scope of the first release and which prototype capabilities it should retain.
- Whether the actual product uses scripted conversations, live AI conversations, or both.
- The production stack and deployment target.
- Any need for accounts, participant devices, saved learning history, or trainer reports.
- A measure of improved seller performance.
- Product-specific accessibility requirements.
- The final product name.

## Evidence on Hand

- `prototype/seller-ai-training/index.html`: the existing launcher.
- `prototype/seller-ai-training/jeopardy.html`: quiz content and presenter controls.
- `prototype/seller-ai-training/roleplay.html`: customer scenarios, authored coaching, and scoring logic.
- `prototype/seller-ai-training/screenshots/`: 12 supplied captures of prototype screens and states.
- `prototype/seller-ai-training.zip`: the supplied prototype archive.

The prototype calls itself "AI Seller Academy" and uses CDW as the seller identity. The original fictional content now lives in one Default pack shared by both activities. The change preserves customers, branches, choices, scores, and signals. Exactly 5 Jeopardy strings replace the original seller placeholder with CDW.

Default shows this notice. "Fictional training scenarios. Default's illustrative offers are not a verified CDW catalog." The prototype retains its existing browser saves and game rules. FSI supplies a second complete pack for both activities. Settings saves one browser-local choice for both games. Home previews reflect that choice. Open games retain their current pack until the trainer deliberately reopens them.

Customer personas, company names, financial figures, and service claims in the scenarios are training examples. Do not treat them as customer evidence or confirmed facts about the actual offerings. No real testimonials, measured training results, or approved offering catalog have been supplied.

### FSI content

FSI adds 4 fictional scenarios about banking, insurance, wealth, and payments. Its conversations contain 23 nodes, 69 choices, 12 outcomes, and 20 takeaways. Bank and insurance take 7 choices, including insurance recovery. Wealth and payments take 4 choices. Its quiz contains 6 categories, 30 clues, and 1 Final. The engines and Default content remain unchanged.

The content teaches governed data, human review, stakeholder discovery, platform qualification, workload-specific hosting, and measured value. It does not promise autonomous investment advice, claims settlement, refunds, regulatory approval, security, or financial returns.

`content-authoring/fsi-provenance.json` covers 35 items with 56 material claims. It cites the supplied compilation dated 2026-10-07. It does not independently verify the linked reports or current offering pages. The task reports independent review of the draft with PASS and 2 minor notes. The integrated pack addresses both notes and still needs parent review at its final head.

All FSI customers, dialogue, customer metrics, and outcomes are invented. Coming Soon offerings remain unavailable. The source is internal and stays outside the repository. Provenance stays outside the web root. Distribution requires a separate approved audience and hosting decision.

### Shared Settings

Trainers choose Default or FSI once, then launch either activity from Home. Radio changes are drafts until Save succeeds. Native radio controls, visible keyboard focus, and a polite status message support keyboard use.

Games open Settings in a separate tab. Switching the saved choice never interrupts an active meeting, clue, or Final stage. A deliberate relaunch asks before losing an unfinished meeting or Jeopardy stage. Jeopardy restores only the selected pack's compatible board. Reset and Replay stay on the current pack.

Settings and saves remain local to one browser profile and origin. Role-play meetings, open clues, Final stages, and undo history do not persist. Same-pack Jeopardy tabs remain last-write-wins. This feature adds no accounts, backend, live AI calls, uploads, cross-device settings, or hosting approval.

## Product Principles

- Make trainer-led sessions the primary workflow.
- Center learning on identifying AI use cases and positioning relevant offerings.
- Use the liked prototypes as references for the actual product, not as a fixed specification.
