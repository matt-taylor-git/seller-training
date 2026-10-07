import test from 'node:test';
import assert from 'node:assert/strict';
import { checkDefault } from '../scripts/check-default.mjs';
import { training } from '../prototype/seller-ai-training/shared/training.mjs';
import { SELLER_NAME } from '../prototype/seller-ai-training/shared/identity.mjs';

const { pack } = training.openPage('roleplay');

test('Default preserves every original content leaf except the 5 seller substitutions.', () => {
  assert.equal(checkDefault().sellerSubstitutions, 5);
  assert.equal(SELLER_NAME, 'CDW');
});

test('Both activity handles pin the same complete pack.', () => {
  assert.equal(training.openPage('jeopardy').pack, pack);
  assert.equal(training.openPage('roleplay').activity, 'roleplay');
  assert.throws(() => training.openPage('unknown'), /training activity is unknown/);
  assert(Object.isFrozen(training.openPage('jeopardy')));
});

test('Every registered content object and array is deeply frozen.', () => {
  const inspect = value => {
    if (!value || typeof value !== 'object') return;
    assert(Object.isFrozen(value));
    Object.values(value).forEach(inspect);
  };
  inspect(pack);
  assert.throws(() => { pack.roleplay.scenarios[0].nodes.c1.ch[0].s.d = 999; }, TypeError);
  assert.throws(() => { pack.jeopardy.categories[0].clues.push({}); }, TypeError);
});

test('Default retains 4 scenarios, 23 nodes, 74 choices, 30 clues, and Final.', () => {
  const scenarios = pack.roleplay.scenarios;
  assert.equal(scenarios.length, 4);
  assert.equal(scenarios.reduce((sum, item) => sum + Object.keys(item.nodes).length, 0), 23);
  assert.equal(scenarios.reduce((sum, item) => sum + Object.values(item.nodes).reduce((n, node) => n + node.ch.length, 0), 0), 74);
  assert.equal(pack.jeopardy.categories.reduce((sum, category) => sum + category.clues.length, 0), 30);
  assert(pack.jeopardy.final.q);
});
