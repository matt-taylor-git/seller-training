---
name: CDW-inspired dark mode
description: Restrained, high-contrast styling for desktop customer role playing and Settings.
colors:
  primary: "#cc0000"
  action-ink: "#ffffff"
  accent: "#ff8585"
  accent-ink: "#160b0d"
  accent-soft: "#2e1c22"
  accent-line: "#8e444d"
  accent-text: "#f2bfc3"
  data: "#eb626b"
  bg: "#101216"
  panel: "#191d23"
  panel2: "#22272f"
  ink: "#f4f5f7"
  muted: "#b0b7c2"
  line: "#424a56"
  green: "#9cc3a5"
  amber: "#d9b77a"
  red: "#e6a59b"
  sky: "#a4bfd0"
  control: "rgba(255,255,255,.05)"
  control-hover: "rgba(255,255,255,.1)"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.5px"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
  body:
    fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
    fontSize: "16px"
    fontWeight: 400
  conversation:
    fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
    fontWeight: 400
    lineHeight: 1.55
  button:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 700
  button-ghost:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12.5px"
    fontWeight: 700
    letterSpacing: "1.6px"
  chip:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  tag: "4px"
  control: "6px"
  panel: "8px"
  utility: "10px"
  signal-row: "12px"
  path-row: "14px"
  pill: "999px"
spacing:
  chip-inline: "8px"
  choice-gap: "10px"
  action-gap: "12px"
  panel-gap: "16px"
  panel-block: "20px"
  card-inset: "22px"
  button-inline: "24px"
  profile-inset: "26px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.action-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "10px 24px"
  button-ghost:
    backgroundColor: "{colors.control}"
    textColor: "{colors.ink}"
    typography: "{typography.button-ghost}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "52px"
  button-ghost-hover:
    backgroundColor: "{colors.control-hover}"
  presenter-toggle:
    backgroundColor: "{colors.control}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "8px 13px"
  presenter-toggle-active:
    backgroundColor: "{colors.accent-soft}"
  scenario-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "22px"
  scenario-card-hover:
    backgroundColor: "{colors.panel2}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.chip}"
    rounded: "{rounded.tag}"
    padding: "4px 8px"
  customer-message:
    backgroundColor: "{colors.panel2}"
    textColor: "{colors.ink}"
    typography: "{typography.conversation}"
    rounded: "{rounded.panel}"
    padding: "14px 18px"
  seller-message:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.conversation}"
    rounded: "{rounded.panel}"
    padding: "14px 18px"
  response-choice:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 14px"
  feedback:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "16px 18px"
---

# Design system: CDW-inspired dark mode

## Overview

**Design direction: "CDW-inspired dark mode"**

This design applies to `prototype/seller-ai-training/roleplay.html` and the standalone `settings.html` screen. It is a CDW-inspired treatment, not an official CDW brand standard. Jeopardy and Home keep their independent designs. Their new navigation uses their existing controls.

The interface is restrained, high-contrast, and task-focused. Cool near-black backgrounds support white text and red primary actions. The layout serves desktop trainer-led sessions and screen sharing. Mobile use is out of scope.

Panels remain flat. Background tones and thin borders separate content without decorative shadows. Components are restrained and direct, with red primary buttons, compact controls, and clear keyboard focus.

**Key characteristics:**
- Cool dark backgrounds with readable white and muted text.
- Solid red primary actions and brighter red focus indicators.
- Flat panels, thin borders, and compact controls.
- Separate coaching colors with explicit text labels.
- The existing scenarios, scoring, and user journey stay intact.

The implementation supplies the values in the frontmatter. Color keys match CSS custom properties, except `primary`, which maps to `--action`. The `control` colors describe recurring literal CSS values. Typography, shape, and spacing names catalog observed styles rather than an existing token library.

## Colors

Action red provides emphasis against a near-black canvas and slate panels. The frontmatter owns exact color values.

### Primary

- **Action red** (`primary`): primary buttons, active switch tracks, and the header's conversation icon.
- **Action white** (`action-ink`): text and icons on solid red controls.
- **Bright red accent** (`accent`): keyboard focus, interactive borders, and scenario action text. Do not substitute the darker action red for small text on dark backgrounds.
- **Red-tinted surface** (`accent-soft`): seller messages, active presenter controls, and the leading room response.
- **Red boundary** (`accent-line`): borders around these red-tinted surfaces.
- **Red-tinted text** (`accent-text`): speaker labels on seller messages.
- **Selection ink** (`accent-ink`): text inside the browser's bright red selection highlight.
- **Chart red** (`data`): score bars, completed turns, and the skills chart. It does not indicate poor performance.

### Neutral

- **Near-black canvas** (`bg`): page, header, sidebar, and response dock.
- **Slate panels** (`panel`): scenario cards, response choices, feedback, and debrief sections.
- **Raised slate tone** (`panel2`): customer messages, mission panel, hover states, and debrief summary. This is a color change, not a shadow.
- **Primary text** (`ink`): headings, conversation content, points, and numeric scores.
- **Muted text** (`muted`): secondary descriptions, metadata, and section labels.
- **Panel boundary** (`line`): thin borders and separators.
- **Control overlays** (`control`, `control-hover`): secondary buttons on dark backgrounds. Their appearance depends on the surface beneath them.

### Coaching colors

- **Sage** (`green`): buying signals, ideal moves, and positive score changes.
- **Amber** (`amber`): pain points and missed opportunities. Keep amber for coaching, not as the general page accent.
- **Soft red** (`red`): red flags, risky moves, and negative score changes. Labels distinguish these from red brand controls.
- **Pale blue** (`sky`): AI readiness cues and solid responses.

**The semantic separation rule.** Keep action, chart, and coaching roles distinct. A red primary button is not an error state. Preserve words, signs, signal labels, and score values alongside color.

Normal text must meet a contrast ratio of at least 4.5:1. Large text and meaningful graphical indicators must meet at least 3:1. The current white-on-red primary button measures 5.89:1. Bright red accent text on the raised slate tone measures 6.39:1.

The legacy CSS names `--teal`, `--gold`, and `--violet` are compatibility aliases for accent, primary text, and muted text. They do not authorize teal, gold, or violet brand colors.

## Typography

Inter serves headings, body copy, controls, and scores. Use the existing system fallbacks if the Google Fonts request fails. Do not introduce a separate display face or monospace styling for ordinary content.

### Hierarchy

- **Display:** the scenario-picker question uses `clamp(30px, 3.2vw, 48px)`, weight 600, and balanced wrapping. Its maximum width is 1100px.
- **Headline:** persona names use the fixed headline token. Debrief titles use `clamp(26px, 2.4vw, 38px)` and a line height of 1.1.
- **Title:** the customer-selection heading uses the title token. Card names range from 18px to 22px.
- **Body:** the browser base is 16px. Supporting copy uses context-specific sizes rather than one universal paragraph size. Picker descriptions range from 15px to 19px, with a line height of 1.5 and an 820px maximum width.
- **Conversation:** customer and seller text uses `clamp(15.5px, 1.2vw, 19px)` with a line height of 1.55.
- **Response choices:** text uses `clamp(14px, 1.05vw, 17px)`, weight 500, and a line height of 1.45.
- **Labels:** brief and debrief section labels use the label token and uppercase text. Other compact labels vary by context.
- **Numbers:** points, skill values, debrief statistics, and room votes use tabular numerals.

Group mode multiplies conversation, choice, and feedback text sizes by 1.06. At widths of 1700px or greater, this multiplier becomes 1.12.

## Layout

Preserve the desktop journey: choose a customer, read the brief, conduct the meeting, and review the debrief. Do not redesign this sequence while applying visual changes.

- **Application frame:** a viewport-height column with a persistent header. Screens and their content regions manage scrolling independently.
- **Scenario picker:** a centered container capped at 1500px, with 4 columns of scenario cards. The card gap uses `clamp(12px, 1.4vw, 22px)`.
- **Persona brief:** a container capped at 1240px, with a 340px identity column and a flexible content column. The column gap is 22px.
- **Meeting:** a sidebar sized with `clamp(260px, 21vw, 340px)` and a flexible conversation column. Conversation and response areas scroll separately. The response dock has a maximum height of 52vh.
- **Response choices:** 2 columns with a 10px gap.
- **Debrief:** a centered 12-column grid capped at 1400px, with a 16px gap. The summary spans the full width.

Horizontal page padding generally uses `clamp(16px, 3vw, 48px)`. Keep related labels and controls close together. Use larger gaps between sections rather than adding extra boxes.

### Desktop adjustments

- At widths of 1100px or less, the existing picker uses 2 columns. The brief and debrief sections stack. This supports narrower desktop windows, not a separate mobile design.
- At heights of 860px or less, header, sidebar, and choice padding becomes more compact.
- At widths of 1700px or greater, the header scales to 1.12 and the sidebar to 1.18 through the existing CSS zoom rules.
- Printing removes the header and debrief actions and permits document-height content.

## Elevation & Depth

**The flat panel rule.** Separate content with background tones and thin borders, not decorative shadows, glows, glass effects, or gradients.

Primary panels, cards, buttons, and the help sheet have no drop shadow. The help overlay darkens the page without a backdrop blur. Thin separators organize the sidebar instead of nested cards.

Functional effects remain distinct from decoration. Hidden pains use a blur until the presenter reveals them. Found signals use an inset underline. Existing floating score feedback has a small text shadow, not a panel shadow.

## Shapes

Use compact rounded rectangles rather than oversized pill-shaped containers. The frontmatter records the observed radii.

- Tags, letter markers, and coaching badges use the small tag radius.
- Primary buttons, secondary buttons, and response choices use the control radius.
- Scenario cards, content panels, feedback, and message bubbles use the panel radius.
- Utility controls, signal rows, and path rows retain their larger context-specific radii.
- Avatars remain circular and neutral. Do not restore rainbow avatar fills.
- Switch tracks, progress tracks, and small ideal-answer labels retain pill shapes where they serve the existing control or indicator.
- Most boundaries are 1px. Do not use thick colored card edges as decoration.

## Components

### Buttons

Primary buttons are solid Action red with Action white text. They have a minimum height of 52px. Hover increases brightness to 1.08, and pressing scales the button to 0.98. Secondary buttons use the translucent neutral control surface and a thin boundary.

Keyboard focus uses a 2px bright red outline with a 4px offset. Response choices use a 2px offset. Disabled buttons reduce opacity to 0.5 and use a not-allowed cursor.

### Presenter controls

The header groups compact labeled controls. Toggle buttons have a minimum height of 38px, a 30px by 18px switch track, and a white thumb. Active controls combine a red-tinted surface, red boundary, and solid red track. Thumb position also indicates state.

Preserve the visible labels and existing keyboard shortcuts. This design does not replace them with icon-only controls.

### Scenario cards and panels

Scenario cards show a neutral initial avatar, customer identity, scenario title, quote, metadata, and a briefing action. Hover changes the background to the raised slate tone and the border to bright red. The card does not lift or gain a shadow.

Brief and debrief panels share the same flat treatment. The mission panel uses the raised slate tone rather than a decorative color wash.

### Chips

Metadata chips have transparent backgrounds, thin neutral borders, muted text, and compact padding. Full-scenario metadata uses primary text. These chips describe the scenario and are not filter controls.

### Conversation and response choices

Customer messages use raised slate backgrounds and neutral boundaries. Seller messages use red-tinted backgrounds and red boundaries. Speaker labels, avatar placement, and alignment also distinguish the participants.

Message bubbles reduce the speaker-side top corner to 6px. Each message remains capped at the smaller of 880px and 90% of its container.

Response choices retain their letter markers and optional room-vote controls. Hover brightens the boundary and makes the letter marker solid red. The ideal response displays an explicit label when the presenter enables that feature. The leading room response uses a red-tinted background.

### Coaching and debrief

Coaching combines a quality label, point change, explanation, and signed skill changes. A thin divider separates a stronger suggested response. Keep the existing colors tied to the coaching categories, not decoration.

Skills bars and the radar chart use Chart red consistently. Score numbers remain readable text. The debrief ring uses the existing performance thresholds and coaching colors. Do not change scoring thresholds as a visual adjustment.

### Motion and browser details

New messages enter over 250ms with `cubic-bezier(.16, 1, .3, 1)`. Other existing motion supports control state, score updates, typing feedback, or signal feedback. Do not add decorative ambient animation.

Honor `prefers-reduced-motion`: disable animations, transitions, and smooth scrolling, and hide floating score effects. Preserve themed selection, visible keyboard focus, thin scrollbars, and tabular numbers.

Settings adds native radio inputs, not a text-input component. Other form workflows remain outside this design change.

## Settings

Settings is a desktop task screen. It uses the same dark canvas, flat panels, Inter/system font stack, red Save button, and bright focus outline as role playing. It does not introduce a framework or a new visual identity.

A centered column has a 760px maximum width and 24px side padding. The header pairs seller identity with Home navigation. A 30px heading introduces one labeled radio group. Each option contains the pack's name, description, and derived activity counts. The selected option combines the native radio mark, red boundary, and tinted background. Selection never relies on color alone.

Save and Cancel follow the choices. A polite status message reports unsaved drafts, success, external changes, and errors. Return to Home remains a separate navigation link. The pack's disclaimer follows the controls. The page scrolls vertically at 200 percent CSS zoom, with no fixed action bar or clipped controls. This check does not verify browser zoom. It adds no motion, and it respects reduced-motion preferences.

Home previews use the selected pack without changing the launcher layout. Game links open Settings in a new tab. The changed-selection action appears beside the pinned-pack notice. Jeopardy also exposes it within clues and Final, so a trainer does not need to close a stage just to open Settings.

## Do's and Don'ts

### Do

- Do keep this design scoped to customer role playing and Settings.
- Do preserve desktop-only use and the existing training journey.
- Do use solid red for primary actions and brighter red for focus and small accent text.
- Do retain explicit coaching labels and signed score changes alongside color.
- Do separate flat panels with background tones and thin borders.
- Do preserve visible keyboard focus and reduced-motion support.
- Do check text contrast whenever a foreground or background color changes.

### Don't

- Don't restyle Jeopardy or the launcher without a separate request.
- Don't describe this document as an official CDW brand standard.
- Don't restore brown page backgrounds, decorative gradients, glows, or rainbow avatars.
- Don't replace the working scenarios, scoring, controls, or journey during visual refinement.
- Don't use brand red as the only indication of an error or coaching outcome.
- Don't introduce a mobile layout or participant-device workflow without a new requirement.
