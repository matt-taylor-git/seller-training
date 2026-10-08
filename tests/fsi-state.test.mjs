import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createTraining, decodeCheckpoint } from '../prototype/seller-ai-training/shared/training.mjs';
import fsi from '../prototype/seller-ai-training/packs/fsi.mjs';

const prior = readFileSync(new URL('./fixtures/fsi-revision-1-checkpoint.json', import.meta.url), 'utf8');
const oldKey = 'aiDealJeopardy.v2.fsi.1';
const newKey = 'aiDealJeopardy.v2.fsi.2';
function setup(raw = prior) {
  const records = new Map([[oldKey, raw], ['aiTraining.selection.v1', '{"schema":1,"packId":"fsi"}']]);
  const writes = [];
  const store = { getItem: key => records.get(key) ?? null, setItem: (key, value) => { writes.push(key); records.set(key, value); }, key: index => [...records.keys()][index] ?? null, get length() { return records.size; } };
  const training = createTraining({ storage: () => store });
  return { records, writes, training, page: training.openPage('jeopardy') };
}

test('Revision-1 FSI progress is incompatible with revision 2 but valid old team names can be recovered.', () => {
  assert.equal(decodeCheckpoint(prior, fsi), null);
  assert(decodeCheckpoint(prior, { ...fsi, revision: 1 }));
  const { page, records, writes } = setup();
  const result = page.readCheckpoint();
  assert.equal(result.status, 'rejected');
  assert.equal(result.state, null);
  assert.deepEqual(result.teams, [{ name: 'Branch team', score: 0 }, { name: 'Claims team', score: 0 }]);
  assert.match(result.message, /another content revision/);
  assert.equal(page.saveCheckpoint(JSON.parse(prior).state).ok, false);
  assert.equal(records.has(newKey), false);
  assert.equal(records.get(oldKey), prior);
  assert.deepEqual(writes, []);
});

test('Explicit replacement creates revision-2 progress without editing the revision-1 record.', () => {
  const { page, records, training } = setup();
  const teams = page.readCheckpoint().teams;
  const fresh = { teams, used: [], dd: ['0-1', '3-2'], timerOn: true, muted: false, timerSecs: 30 };
  assert.equal(page.replaceCheckpoint(fresh).ok, true);
  const saved = JSON.parse(records.get(newKey));
  assert.equal(saved.packRevision, 2);
  assert.deepEqual(saved.state, fresh);
  assert.deepEqual(training.openPage('jeopardy').readCheckpoint().state, fresh);
  assert.equal(records.get(oldKey), prior);
});

test('Invalid revision-1 FSI records remain untouched and do not supply names.', () => {
  for (const raw of ['{', prior.replace('Branch team', ''), prior.replace('"5-4"', '"9-9"'), prior.replace('"fsi"', '"default"')]) {
    const { page, records, writes } = setup(raw);
    assert.equal(page.readCheckpoint().state, null);
    assert.equal(page.readCheckpoint().teams, undefined);
    assert.equal(records.get(oldKey), raw);
    assert.equal(records.has(newKey), false);
    assert.deepEqual(writes, []);
  }
});
