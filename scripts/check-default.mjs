import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { training } from '../prototype/seller-ai-training/shared/training.mjs';

export const original = JSON.parse(readFileSync(new URL('../tests/fixtures/default-original.json', import.meta.url), 'utf8'));

export function canonical(value) {
  return JSON.stringify(value, (_, item) => item && typeof item === 'object' && !Array.isArray(item)
    ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item);
}

export const digest = value => createHash('sha256').update(canonical(value)).digest('hex');

export function checkDefault() {
  const { metadata, roleplay, jeopardy } = original;
  assert.equal(metadata.sourceSha, '96c2e50d06524afb6050d22fed0366fac0a9141b');
  assert.equal(digest({ roleplay, jeopardy }), '63bb0ef18f215af02f2e0b359dec9eb154216affd8661d7b76418befb9742df1', 'The immutable source fixture must not change.');
  assert.equal(metadata.canonicalContentSha256, digest({ roleplay, jeopardy }));
  const { pack } = training.openPage('roleplay');
  assert.deepEqual(pack.roleplay, roleplay, 'All role-play data must remain unchanged.');
  const expected = structuredClone(jeopardy);
  const allowed = [
    ['categories', 2, 'clues', 3, 'q'],
    ['categories', 2, 'clues', 3, 'why'],
    ['categories', 3, 'clues', 1, 'why'],
    ['categories', 4, 'clues', 3, 'why'],
    ['final', 'q']
  ];
  for (const path of allowed) {
    const leaf = path.pop();
    const parent = path.reduce((value, key) => value[key], expected);
    assert(parent[leaf].includes('Your Company'));
    parent[leaf] = parent[leaf].replaceAll('Your Company', 'CDW');
  }
  assert.deepEqual(pack.jeopardy, expected, 'Only the 5 approved seller strings may change.');
  const contentSha256 = digest({ roleplay: pack.roleplay, jeopardy: pack.jeopardy });
  assert.equal(contentSha256, '02df69b4e8b972295a1b3192b5ce804c571edaa7f988be09df24367a2c126fac');
  assert.equal(metadata.cdwContentSha256, contentSha256);
  return { sourceSha: metadata.sourceSha, roleplayUnchanged: true, sellerSubstitutions: 5, contentSha256 };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) console.log(JSON.stringify(checkDefault(), null, 2));
