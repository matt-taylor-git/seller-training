import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import fsi from '../prototype/seller-ai-training/packs/fsi.mjs';
import defaultPack from '../prototype/seller-ai-training/packs/default.mjs';
import { training, createTraining } from '../prototype/seller-ai-training/shared/training.mjs';
import { checkContent } from '../scripts/check-content.mjs';

const provenance = JSON.parse(readFileSync(new URL('../content-authoring/fsi-provenance.json', import.meta.url), 'utf8'));

test('FSI contains both complete games, reviewed claim coverage, and equal-depth recovery.', () => {
  const report = checkContent(fsi, provenance);
  assert.deepEqual(report.totals, { scenarios: 4, nodes: 23, choices: 69, outcomes: 12, takeaways: 20, signals: 26, categories: 6, clues: 30, finalClues: 1, evidenceItems: 35, claimEntries: 56 });
  assert.equal(report.scenarios.reduce((sum, scenario) => sum + scenario.terminalChoicePaths, 0), 4536);
  assert.deepEqual(report.scenarios.map(scenario => scenario.turnLengths), [[7], [7], [4], [4]]);
  assert(Object.isFrozen(fsi) && Object.isFrozen(fsi.roleplay.scenarios[1].nodes.ir));
});

test('The production registry exposes exactly Default and FSI as complete aggregates.', () => {
  assert.deepEqual(training.listPacks().map(pack => pack.id), ['default', 'fsi']);
  let raw = null;
  const store = { getItem: key => key === 'aiTraining.selection.v1' ? raw : null, setItem: (_key, value) => { raw = value; }, key: () => null, length: 0 };
  const service = createTraining({ storage: () => store });
  const pinned = service.openPage('roleplay');
  assert.equal(pinned.pack, defaultPack);
  assert.equal(service.selectPack('fsi').ok, true);
  assert.equal(service.openPage('roleplay').pack, fsi);
  assert.equal(service.openPage('jeopardy').pack, fsi);
  assert.equal(pinned.pack, defaultPack);
});

const words = text => text.trim().split(/\s+/).length;
for (const [category, group] of fsi.jeopardy.categories.entries()) {
  for (const [row, clue] of group.clues.entries()) {
    test(`FSI authored clue ${category + 1}-${row + 1} fits the presenter reading budget.`, () => {
      assert(words(clue.a) <= 25, `Answer has ${words(clue.a)} words, maximum 25.`);
      assert(words(clue.why) <= 40, `Coaching has ${words(clue.why)} words, maximum 40.`);
      assert(words(clue.a) + words(clue.why) <= 65, 'Combined answer and coaching exceed 65 words.');
    });
  }
}
test('FSI authored Final fits a focused response and coaching budget.', () => {
  const final = fsi.jeopardy.final;
  assert(words(final.a) <= 45, `Final answer has ${words(final.a)} words, maximum 45.`);
  assert(words(final.why) <= 40, `Final coaching has ${words(final.why)} words, maximum 40.`);
  assert(words(final.a) + words(final.why) <= 85, 'Combined Final answer and coaching exceed 85 words.');
});

const mutations = {
  'internal URL domains': pack => pack.jeopardy.final.why += ' See https://example.sharepoint.com/sites/AI.',
  'internal prices': pack => pack.roleplay.scenarios[0].offering.steps[0] += ' The fee is $15K.',
  'personal contact addresses': pack => pack.jeopardy.final.why += ' Email person@example.com.',
  'case-routing instructions': pack => pack.jeopardy.final.why += ' Use Case Subtype AI Infrastructure.',
  'missing half': pack => delete pack.jeopardy,
  'dangling recovery': pack => pack.roleplay.scenarios[1].nodes.ir.ch[0].next = 'missing',
  'cyclic graph': pack => pack.roleplay.scenarios[0].nodes.b7.ch[0].next = 'b1',
  'unavailable play as ideal': pack => pack.roleplay.scenarios[2].nodes.w3.ch[0].t = 'Use Agents & Workflow Automation today.',
  'unavailable offered play': pack => pack.roleplay.scenarios[0].offering.steps.push('Deliver AI Value Assurance today.'),
  'missing availability correction': pack => pack.roleplay.scenarios[2].nodes.w3.ch[1].fb = 'This is a useful next step.',
  'fragmented copy': pack => pack.jeopardy.categories[0].clues[0].a = 'Document intake pain',
  'missing local acronym': pack => pack.jeopardy.categories[0].clues[1].why = 'AI pilots can stall.',
  'abbreviated country': pack => pack.jeopardy.categories[3].clues[4].why += ' This covers UK firms.',
  'too few takeaways': pack => pack.roleplay.scenarios[0].takeaways = ['Ask why a pilot stalled.']
};
for (const [name, mutate] of Object.entries(mutations)) {
  test(`Content checks reject ${name}.`, () => {
    const pack = structuredClone(fsi);
    mutate(pack);
    assert.throws(() => checkContent(pack, provenance));
  });
}

for (const [name, mutate] of Object.entries({
  'missing item': evidence => evidence.items.pop(),
  'missing material claim': evidence => evidence.items[0].claims.pop(),
  'duplicate locator': evidence => evidence.items[1].locator = evidence.items[0].locator,
  'missing section': evidence => evidence.items[0].claims[0].section = '',
  'missing caveat': evidence => evidence.items[0].claims[0].caveat = '',
  'missing date': evidence => evidence.items[0].claims[0].date = '',
  'dangling claim location': evidence => evidence.items[0].claims[0].locations = ['nodes.missing'],
  'wrong revision': evidence => evidence.packRevision++
})) {
  test(`Provenance checks reject ${name}.`, () => {
    const evidence = structuredClone(provenance); mutate(evidence);
    assert.throws(() => checkContent(fsi, evidence));
  });
}

test('Source checking requires the actual reviewed compilation, not a substituted document.', () => {
  assert.throws(() => checkContent(fsi, provenance, 'Different source.'), /Source hash/);
});

test('Standalone survey clues preserve their sample, dates, units, and limits.', () => {
  const uk = fsi.jeopardy.categories[3].clues[4];
  for (const phrase of ['118', '2024-11-21', 'United Kingdom', 'sample', 'not a global rate', '2026-10-07']) assert(uk.why.includes(phrase), phrase);
  assert(uk.a.includes('2%') && uk.a.includes('uses'));
  const nvidia = fsi.jeopardy.categories[5].clues[2];
  for (const phrase of ['839', '2026-01', '2025-08', '2025-09', 'NVIDIA channels', 'self-reported', 'self-selected', 'not audited']) assert(nvidia.why.includes(phrase), phrase);
  assert(nvidia.a.includes('not a financial return'));
});
