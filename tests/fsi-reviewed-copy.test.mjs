import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import fsi from '../prototype/seller-ai-training/packs/fsi.mjs';

const map = readFileSync(new URL('../content-authoring/fsi-lesson-map.md', import.meta.url), 'utf8');
const provenance = JSON.parse(readFileSync(new URL('../content-authoring/fsi-provenance.json', import.meta.url), 'utf8'));

test('The authoring map covers every node and standalone quiz premise.', () => {
  for (const scenario of fsi.roleplay.scenarios) for (const nodeId of Object.keys(scenario.nodes)) assert(map.includes(`| ${nodeId} |`), nodeId);
  for (let category = 0; category < 6; category++) for (let row = 0; row < 5; row++) assert(map.includes(`| ${category}-${row} |`));
  assert(map.includes('| Final |'));
  assert.match(map, /Already visible.*Customer reveals now.*Seller decision/);
});

test('Evidence distinguishes fiction, authored plans, and source claims without inheriting an approval.', () => {
  assert.equal(provenance.packRevision, 2);
  assert.match(provenance.reviewStatus, /No earlier PASS status carries forward/);
  assert.match(provenance.reviewStatus, /independent parent review/);
  const kinds = new Set(provenance.items.flatMap(item => item.claims.map(claim => claim.kind)));
  assert.deepEqual(kinds, new Set(['fictional-fact', 'authored-recommendation', 'source-claim']));
});

test('The new curriculum omits catalog prerequisites, availability trivia, and survey recall.', () => {
  const copy = JSON.stringify(fsi);
  assert.doesNotMatch(copy, /NVIDIA|GPU|Kubernetes|Factory Accelerator|FinOps|AI Value Assurance|Coming Soon|percent of respondents/);
  const names = ['Private AI Launch Workshop', 'AI Readiness Data Quality Assessment', 'AI Risk Assessment', 'Copilot Adoption and Change Management', 'FirstTouch AI'];
  for (const name of names) assert(copy.includes(name));
});

test('Score-selected outcomes assess the approach rather than asserting a customer commitment.', () => {
  for (const scenario of fsi.roleplay.scenarios) {
    assert.match(scenario.outcomes.great.text, /still need|still require/);
    for (const result of Object.values(scenario.outcomes)) {
      assert.match(result.text, /your approach/i);
      assert.doesNotMatch(result.text, /booked|signed|greenlit|approved the|agreed to buy|introduces you/);
    }
  }
});

test('Official offering limits remain next to the claims that need them.', () => {
  const bank = fsi.roleplay.scenarios[0];
  assert.match(bank.offering.steps[2], /If document problems.*AI Readiness Data Quality Assessment.*confirm its current scope/);
  const wealth = fsi.roleplay.scenarios[2];
  assert.match(wealth.offering.steps[3], /integration separately/);
  const payments = fsi.roleplay.scenarios[3];
  assert.match(payments.nodes.transfer.ch[0].fb, /does not guarantee.*handoff or integration/);
  assert.match(payments.nodes.authority.ch[0].fb, /does not prove it can decide or issue refunds/);
  const risk = fsi.jeopardy.categories[3].clues[3];
  assert.match(risk.a, /does not grant approval/);
});
