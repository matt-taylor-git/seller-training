import { test } from 'node:test';
import assert from 'node:assert/strict';
import fsi from '../prototype/seller-ai-training/packs/fsi.mjs';

const dimensions = ['d', 'l', 'u', 'p', 't'];
function paths(scenario, id = scenario.start, history = []) {
  if (id === 'end') return [history];
  const node = scenario.nodes[id];
  return node.ch.flatMap(choice => paths(scenario, choice.next, [...history, { id, node, choice }]));
}
function overall(history, signalFraction = 0) {
  const scores = dimensions.map(key => {
    const earned = history.reduce((sum, turn) => sum + (turn.choice.s[key] || 0), 0);
    const ideal = history.reduce((sum, turn) => sum + Math.max(0, ...turn.node.ch.map(choice => choice.s[key] || 0)), 0);
    return Math.max(0, Math.min(100, Math.round(50 + 50 * earned / Math.max(ideal, 20))));
  });
  return Math.round(.85 * scores.reduce((sum, score) => sum + score, 0) / dimensions.length + 15 * signalFraction);
}
const outcome = score => score >= 78 ? 'great' : score >= 58 ? 'ok' : 'poor';

for (const scenario of fsi.roleplay.scenarios) {
  const routes = paths(scenario);
  test(`${scenario.id} reaches every node and ends every choice route at the advertised depth.`, () => {
    assert.deepEqual(new Set(routes.map(route => route.length)), new Set([scenario.turns]));
    assert.deepEqual(new Set(routes.flatMap(route => route.map(turn => turn.id))), new Set(Object.keys(scenario.nodes)));
    assert.equal(routes.length, 3 ** scenario.turns);
    assert.equal(Object.isFrozen(scenario.nodes), true);
    for (const node of Object.values(scenario.nodes)) assert.equal(node.ch.filter(choice => choice.q === 'best').length, 1);
  });
  test(`${scenario.id} rewards all five skills and makes all outcomes attainable without signal bonuses.`, () => {
    const ideal = routes.find(route => route.every(turn => turn.choice.q === 'best'));
    const poor = routes.find(route => route.every(turn => turn.choice.q === 'bad'));
    assert(ideal && poor);
    for (const key of dimensions) {
      assert(ideal.reduce((sum, turn) => sum + (turn.choice.s[key] || 0), 0) >= 20, `Meaningful ideal opportunity for ${key}.`);
    }
    for (const turn of ideal) {
      const total = choice => Object.values(choice.s).reduce((sum, score) => sum + score, 0);
      assert(turn.node.ch.filter(choice => choice.q !== 'best').every(choice => total(choice) < total(turn.choice)));
    }
    assert.equal(outcome(overall(ideal)), 'great');
    assert.equal(outcome(overall(poor, 1)), 'poor', 'Signals cannot rescue uniformly poor replies.');
    assert.deepEqual(new Set(routes.map(route => outcome(overall(route)))), new Set(['great', 'ok', 'poor']));
    for (const route of routes) {
      assert(overall(route) >= 0 && overall(route, 1) <= 100);
      assert(overall(route, 1) >= overall(route));
    }
  });
  test(`${scenario.id} includes comparable incomplete choices, not only perfect and reckless options.`, () => {
    for (const node of Object.values(scenario.nodes)) {
      const good = node.ch.find(choice => choice.q === 'good');
      assert(good && Object.values(good.s).some(score => score > 0));
      assert(Object.values(node.ch.find(choice => choice.q === 'bad').s).some(score => score < 0));
    }
  });
}

for (const [id, normal, recovery, destination] of [
  ['branch-answers', 'folders', 'reset', 'authority'],
  ['claim-handoff', 'handoff', 'pushback', 'missing']
]) {
  test(`${id} gives an early mistake a distinct response and a same-depth recovery.`, () => {
    const scenario = fsi.roleplay.scenarios.find(scenario => scenario.id === id);
    const opening = scenario.nodes[scenario.start];
    assert.equal(opening.ch.find(choice => choice.q === 'best').next, normal);
    assert.equal(opening.ch.find(choice => choice.q === 'bad').next, recovery);
    assert.notEqual(scenario.nodes[normal].c, scenario.nodes[recovery].c);
    for (const nodeId of [normal, recovery]) assert(scenario.nodes[nodeId].ch.every(choice => choice.next === destination));
    const routes = paths(scenario);
    const recovered = routes.find(route => route[0].choice.q === 'bad' && route.slice(1).every(turn => turn.choice.q === 'best'));
    const continued = routes.find(route => route.every(turn => turn.choice.q === 'bad'));
    assert(overall(recovered) > overall(continued));
    assert(overall(recovered) >= 58, 'A recovered conversation can reach at least the middle outcome.');
  });
}

test('Best replies do not occupy a fixed authored position.', () => {
  const positions = fsi.roleplay.scenarios.flatMap(scenario => Object.values(scenario.nodes).map(node => node.ch.findIndex(choice => choice.q === 'best')));
  assert.deepEqual(new Set(positions), new Set([0, 1, 2]));
});
