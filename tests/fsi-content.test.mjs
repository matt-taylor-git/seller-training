import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import fsi from '../prototype/seller-ai-training/packs/fsi.mjs';
import defaultPack from '../prototype/seller-ai-training/packs/default.mjs';
import { training, createTraining } from '../prototype/seller-ai-training/shared/training.mjs';
import { checkContent } from '../scripts/check-content.mjs';

const provenance = JSON.parse(readFileSync(new URL('../content-authoring/fsi-provenance.json', import.meta.url), 'utf8'));

test('FSI contains two complete activities, revision-2 evidence, and exact-depth branches.', () => {
  const report = checkContent(fsi, provenance);
  assert.deepEqual(report.totals, { scenarios: 4, nodes: 22, choices: 66, outcomes: 12, takeaways: 16, signals: 22, categories: 6, clues: 30, finalClues: 1, evidenceItems: 35, claimEntries: 48 });
  assert.equal(report.scenarios.reduce((sum, scenario) => sum + scenario.terminalChoicePaths, 0), 1620);
  assert.deepEqual(report.scenarios.map(scenario => scenario.turnLengths), [[6], [6], [4], [4]]);
  assert(Object.isFrozen(fsi) && Object.isFrozen(fsi.roleplay.scenarios[1].nodes.pushback));
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
    test(`FSI clue ${category + 1}-${row + 1} fits the presenter reading budget.`, () => {
      assert(words(clue.q) <= 40);
      assert(words(clue.a) <= 25);
      assert(clue.a.length <= 110);
      assert(words(clue.why) <= 40);
      assert(words(clue.a) + words(clue.why) <= 65);
    });
  }
}
test('FSI Final fits the unchanged answer and coaching budgets.', () => {
  const final = fsi.jeopardy.final;
  assert(words(final.a) <= 45);
  assert(words(final.why) <= 40);
  assert(words(final.a) + words(final.why) <= 85);
});

const mutations = {
  'internal URL domains': pack => pack.jeopardy.final.why += ' See https://example.sharepoint.com/sites/AI.',
  'internal prices': pack => pack.roleplay.scenarios[0].offering.steps[0] += ' The fee is $15K.',
  'personal contact addresses': pack => pack.jeopardy.final.why += ' Email person@example.com.',
  'case-routing instructions': pack => pack.jeopardy.final.why += ' Use Case Subtype AI Infrastructure.',
  'missing half': pack => delete pack.jeopardy,
  'dangling recovery': pack => pack.roleplay.scenarios[1].nodes.pushback.ch[0].next = 'no-such-node',
  'cyclic graph': pack => pack.roleplay.scenarios[0].nodes.invitation.ch[0].next = 'counter',
  'unreachable node': pack => pack.roleplay.scenarios[0].nodes.unreachable = structuredClone(pack.roleplay.scenarios[0].nodes.invitation),
  'unequal turn depths': pack => pack.roleplay.scenarios[0].nodes.counter.ch[0].next = 'authority',
  'duplicate ideal': pack => pack.roleplay.scenarios[0].nodes.counter.ch[0].q = 'best',
  'invalid signal': pack => pack.roleplay.scenarios[0].nodes.counter.c = pack.roleplay.scenarios[0].nodes.counter.c.replace('|pain|', '|unknown|'),
  'unavailable play as ideal': pack => pack.roleplay.scenarios[2].nodes.habits.ch[2].t = 'Use Agents & Workflow Automation today.',
  'unavailable offered play': pack => pack.roleplay.scenarios[0].offering.steps.push('Deliver AI Value Assurance today.'),
  'uncorrected unavailable play': pack => pack.roleplay.scenarios[2].nodes.habits.ch[0].t = 'Use Agents & Workflow Automation today.',
  'fragmented prose': pack => pack.jeopardy.categories[0].clues[0].a = 'Document intake pain',
  'too few takeaways': pack => pack.roleplay.scenarios[0].takeaways = ['Ask about the work.']
};
for (const [name, mutate] of Object.entries(mutations)) {
  test(`Content checks reject ${name}.`, () => {
    const pack = structuredClone(fsi); mutate(pack);
    const evidence = structuredClone(provenance);
    for (const item of evidence.items) {
      const scenarioId = item.locator.match(/\[id=([^\]]+)\]/)?.[1];
      const content = scenarioId ? pack.roleplay.scenarios.find(scenario => scenario.id === scenarioId)
        : item.locator.replace(/\[(\d+)\]/g, '.$1').split('.').reduce((value, key) => value?.[key], pack);
      if (content) item.contentSha256 = createHash('sha256').update(JSON.stringify(content)).digest('hex');
    }
    assert.throws(() => checkContent(pack, evidence));
  });
}

for (const [name, mutate] of Object.entries({
  'missing item': evidence => evidence.items.pop(),
  'duplicate locator': evidence => evidence.items[1].locator = evidence.items[0].locator,
  'missing section': evidence => evidence.items[0].claims[0].section = '',
  'missing caveat': evidence => evidence.items[0].claims[0].caveat = '',
  'missing date': evidence => evidence.items[0].claims[0].date = '',
  'unknown evidence kind': evidence => evidence.items[0].claims[0].kind = 'verified-result',
  'dangling claim location': evidence => evidence.items[0].claims[0].locations = ['nodes.missing'],
  'wrong revision': evidence => evidence.packRevision++,
  'stale content digest': evidence => evidence.items[4].contentSha256 = '0'.repeat(64),
  'unmapped offering': evidence => evidence.items[0].claims = evidence.items[0].claims.filter(claim => !claim.claim.includes('Data Quality Assessment')),
  'authored suggestion mislabeled as offering evidence': evidence => evidence.items[0].claims.find(claim => claim.claim.includes('Data Quality Assessment')).kind = 'authored-recommendation'
})) {
  test(`Provenance checks reject ${name}.`, () => {
    const evidence = structuredClone(provenance); mutate(evidence);
    assert.throws(() => checkContent(fsi, evidence));
  });
}

test('Source checking requires the actual reviewed compilation, not a substituted document.', () => {
  assert.throws(() => checkContent(fsi, provenance, 'Different source.'), /Source hash/);
  assert.equal(provenance.source.sha256, '31530f3c151f34e3f18d33cdc2ced30f4733361519bef5b35ee70e763118092b');
});
