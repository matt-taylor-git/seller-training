import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePack } from '../prototype/seller-ai-training/shared/pack-contract.mjs';
import defaultPack from '../prototype/seller-ai-training/packs/default.mjs';

const invalid = (name, mutate, pattern) => test(name, () => {
  const pack = structuredClone(defaultPack);
  mutate(pack);
  assert.throws(() => validatePack(pack), pattern);
});

test('The contract accepts the preserved CFO recovery route with 8 choices.', () => {
  assert.equal(validatePack(defaultPack), defaultPack);
  const cfo = defaultPack.roleplay.scenarios[0];
  let id = cfo.start;
  let turns = 0;
  while (id !== 'end') {
    const choice = id === cfo.start ? cfo.nodes[id].ch[1] : cfo.nodes[id].ch.find(item => item.q === 'best');
    id = choice.next;
    turns++;
  }
  assert.equal(cfo.turns, 7);
  assert.equal(turns, 8);
});

for (const half of ['roleplay', 'jeopardy']) invalid(`Missing ${half} is rejected.`, pack => { delete pack[half]; }, /must be an object/);
invalid('Duplicate scenario IDs are rejected.', pack => { pack.roleplay.scenarios[1].id = 'cfo'; }, /Scenario ID .* is duplicated/);
invalid('Missing choices are rejected.', pack => { pack.roleplay.scenarios[0].nodes.c1.ch = []; }, /nonempty array/);
invalid('Too few choices are rejected.', pack => { pack.roleplay.scenarios[0].nodes.c1.ch.pop(); pack.roleplay.scenarios[0].nodes.c1.ch.pop(); }, /3 or 4 choices/);
invalid('Invalid choice quality is rejected.', pack => { pack.roleplay.scenarios[0].nodes.c1.ch[0].q = 'perfect'; }, /invalid choice quality/);
invalid('Multiple ideal choices are rejected.', pack => { pack.roleplay.scenarios[0].nodes.c1.ch[1].q = 'best'; }, /exactly 1 ideal/);
invalid('No ideal choice is rejected.', pack => { pack.roleplay.scenarios[0].nodes.c1.ch[0].q = 'good'; }, /exactly 1 ideal/);
invalid('Empty coaching is rejected.', pack => { pack.roleplay.scenarios[0].nodes.c1.ch[0].fb = ' '; }, /nonempty text/);
invalid('Duplicate responses are rejected.', pack => { pack.roleplay.scenarios[0].nodes.c1.ch[1].t = pack.roleplay.scenarios[0].nodes.c1.ch[0].t; }, /duplicates a response/);
invalid('Bad signal types are rejected.', pack => { pack.roleplay.scenarios[0].nodes.c1.c = '[[Signal|unknown|Reason]]'; }, /invalid signal/);
invalid('Malformed signal grammar is rejected.', pack => { pack.roleplay.scenarios[0].nodes.c1.c = '[[Signal|buy]]'; }, /invalid signal/);
invalid('Dangling branches are rejected.', pack => { pack.roleplay.scenarios[0].nodes.c1.ch[0].next = 'missing'; }, /dangling branch/);
invalid('Dangling starts are rejected.', pack => { pack.roleplay.scenarios[0].start = 'missing'; }, /dangling branch/);
invalid('Cycles are rejected.', pack => { pack.roleplay.scenarios[0].nodes.c7.ch[0].next = 'c1'; }, /cycle/);
invalid('Unreachable nodes are rejected.', pack => { pack.roleplay.scenarios[0].nodes.unreachable = structuredClone(pack.roleplay.scenarios[0].nodes.c7); }, /unreachable/);
invalid('Invalid score keys are rejected.', pack => { pack.roleplay.scenarios[0].nodes.c1.ch[0].s.other = 1; }, /invalid score/);
invalid('Nonfinite scores are rejected.', pack => { pack.roleplay.scenarios[0].nodes.c1.ch[0].s.d = Infinity; }, /invalid score/);
for (const field of ['outcomes', 'useCases', 'offering', 'takeaways', 'persona']) invalid(`Missing ${field} is rejected.`, pack => { delete pack.roleplay.scenarios[0][field]; }, /must be/);
invalid('Missing outcome text is rejected.', pack => { delete pack.roleplay.scenarios[0].outcomes.great.text; }, /nonempty text/);
invalid('Incomplete clue boards are rejected.', pack => { pack.jeopardy.categories[0].clues.pop(); }, /5 clues/);
invalid('Incomplete categories are rejected.', pack => { pack.jeopardy.categories.pop(); }, /6 categories/);
invalid('Missing Final is rejected.', pack => { delete pack.jeopardy.final; }, /must be an object/);
invalid('Missing clue explanations are rejected.', pack => { delete pack.jeopardy.categories[0].clues[0].why; }, /nonempty text/);
invalid('Bad pack revisions are rejected.', pack => { pack.revision = 0; }, /positive integer/);
invalid('Missing pack descriptions are rejected.', pack => { pack.description = ''; }, /nonempty text/);
invalid('Invalid pack IDs are rejected.', pack => { pack.id = '../default'; }, /lowercase identifier/);
