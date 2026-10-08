import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import fsi from '../prototype/seller-ai-training/packs/fsi.mjs';

const original = JSON.parse(readFileSync(new URL('./fixtures/fsi-original.json', import.meta.url), 'utf8'));
const identities = new Set(['id', 'name', 'initials', 'company', 'start', 'next']);

export function segmentSequence(text) {
  const sequence = [];
  const signals = /\[\[(.+?)\|(\w+)\|(.+?)\]\]/g;
  const plain = text => (text.match(/[^.!?,;:]+[.!?,;:]*\s*/g) || []).forEach(() => sequence.push('plain'));
  let last = 0;
  for (const match of text.matchAll(signals)) {
    plain(text.slice(last, match.index));
    sequence.push(match[2]);
    last = match.index + match[0].length;
  }
  plain(text.slice(last));
  return sequence;
}

export function behaviorShape(value, path = '') {
  if (Array.isArray(value)) return value.map((item, index) => behaviorShape(item, `${path}[${index}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).map(([key, item]) => {
      const next = `${path}.${key}`;
      if (typeof item !== 'string') return [key, behaviorShape(item, next)];
      if (key === 'c' && path.includes('.nodes.')) return [key, segmentSequence(item)];
      if (key === 'q' && path.includes('.jeopardy.')) return [key, item.length > 130];
      if (identities.has(key) && !(key === 'name' && path.includes('.jeopardy.categories'))) return [key, item];
      if (key === 'q') return [key, item];
      return [key, null];
    });
  }
  return typeof value === 'string' ? null : value;
}

const assertEquivalent = candidate => assert.deepEqual(behaviorShape(candidate), behaviorShape(original));

test('Financial services copy preserves the original behavior and identities.', () => assertEquivalent(fsi));

const mutations = {
  revision: pack => pack.revision++,
  identifier: pack => pack.id = 'financial-services',
  identity: pack => pack.roleplay.scenarios[0].persona.company = 'Other Bank',
  initials: pack => pack.roleplay.scenarios[0].persona.initials = 'XX',
  difficulty: pack => pack.roleplay.scenarios[0].difficulty++,
  full: pack => pack.roleplay.scenarios[0].full = false,
  turns: pack => pack.roleplay.scenarios[0].turns++,
  start: pack => pack.roleplay.scenarios[0].start = 'b2',
  next: pack => pack.roleplay.scenarios[0].nodes.b1.ch[0].next = 'b3',
  quality: pack => pack.roleplay.scenarios[0].nodes.b1.ch[0].q = 'bad',
  score: pack => pack.roleplay.scenarios[0].nodes.b1.ch[0].s.d++,
  'node order': pack => { const nodes = pack.roleplay.scenarios[0].nodes; const first = nodes.b1; delete nodes.b1; nodes.b1 = first; },
  'choice order': pack => pack.roleplay.scenarios[0].nodes.b1.ch.reverse(),
  'scenario order': pack => pack.roleplay.scenarios.reverse(),
  'plain segment split': pack => pack.roleplay.scenarios[0].nodes.b1.c = pack.roleplay.scenarios[0].nodes.b1.c.replace('90 days.', '90 days. Wait.'),
  'signal position': pack => { const node = pack.roleplay.scenarios[0].nodes.b1; const signal = node.c.match(/\[\[.+?\]\]/)[0]; node.c = signal + node.c.replace(signal, ''); },
  'signal type': pack => pack.roleplay.scenarios[0].nodes.b1.c = pack.roleplay.scenarios[0].nodes.b1.c.replace('|red|', '|buy|'),
  'signal count': pack => pack.roleplay.scenarios[0].nodes.b1.c += '[[An extra signal.|pain|Extra.]]',
  'question size class': pack => pack.jeopardy.categories[0].clues[0].q = 'Short question?'
};

for (const [name, mutate] of Object.entries(mutations)) {
  test(`Behavior comparison rejects a changed ${name}.`, () => {
    const candidate = structuredClone(original);
    mutate(candidate);
    assert.throws(() => assertEquivalent(candidate));
  });
}

test('Behavior comparison permits copy changes with the same parsed sequence.', () => {
  const candidate = structuredClone(original);
  candidate.label = 'Financial services';
  candidate.roleplay.scenarios[0].nodes.b1.c = candidate.roleplay.scenarios[0].nodes.b1.c.replace('Our board wants a plan', 'The board needs a plan');
  assertEquivalent(candidate);
});
