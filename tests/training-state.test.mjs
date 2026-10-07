import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createTraining, decodeCheckpoint, decodeState, decodeSelection, decodePreferences } from '../prototype/seller-ai-training/shared/training.mjs';
import defaultPack from '../prototype/seller-ai-training/packs/default.mjs';
import alternate from './fixtures/alternate-pack.mjs';
import { readFileSync, readdirSync } from 'node:fs';

const key = 'aiDealJeopardy.v2.default.1';
const selectionKey = 'aiTraining.selection.v1';
const legacyKey = 'aiDealJeopardy.v1';
const state = () => ({ teams: [{ name: 'Alpha', score: 200 }, { name: 'Beta', score: -100 }], used: ['0-0'], dd: ['1-1', '2-2'], timerOn: true, muted: true, timerSecs: 30 });
const envelope = (s = state(), pack = defaultPack) => JSON.stringify({ schema: 2, packId: pack.id, packRevision: pack.revision, state: s });
function setup(entries = {}) {
  const records = new Map(Object.entries(entries));
  const writes = [];
  const store = { getItem: key => records.get(key) ?? null, setItem: (key, value) => { writes.push(key); records.set(key, value); }, key: index => [...records.keys()][index] ?? null, get length() { return records.size; } };
  const events = new EventTarget();
  const training = createTraining({ packs: [defaultPack, alternate], storage: () => store, events });
  return { records, writes, store, events, training, page: () => training.openPage('jeopardy') };
}

test('First visit pins one complete frozen Default pack without writing selection or preferences.', () => {
  const { training, page, writes } = setup();
  assert.deepEqual(training.readSelection(), { packId: 'default', valid: true, status: 'missing', message: '' });
  assert.equal(page().pack, training.openPage('roleplay').pack);
  assert.equal(Object.isFrozen(page().pack.roleplay.scenarios[0].nodes), true);
  assert.equal(page().readCheckpoint().state, null);
  assert.deepEqual(training.openPage('roleplay').readPreferences().prefs, { group: false, spot: true, ideal: false });
  assert.deepEqual(writes, []);
});

for (const raw of ['{', 'null', '[]', '{}', '{"schema":2,"packId":"default"}', '{"schema":1,"packId":"unknown"}']) {
  test(`Invalid selection ${raw} falls back without repair until an explicit save.`, () => {
    const { training, records } = setup({ [selectionKey]: raw });
    assert.equal(training.readSelection().valid, false);
    assert.equal(training.openPage('roleplay').pack.id, 'default');
    assert.equal(records.get(selectionKey), raw);
    assert.equal(training.selectPack('default').ok, true);
    assert.deepEqual(JSON.parse(records.get(selectionKey)), { schema: 1, packId: 'default' });
    assert.equal(training.readSelection().valid, true);
  });
}

test('Selection writes once, remains pinned, and fails without effective change.', () => {
  const { training, store, writes, page } = setup();
  const pinned = page();
  assert.equal(training.selectPack('alternate').ok, true);
  assert.equal(training.selectPack('alternate').ok, true);
  assert.equal(writes.filter(key => key === selectionKey).length, 1);
  assert.equal(pinned.pack.id, 'default');
  assert.equal(page().pack.id, 'alternate');
  store.setItem = () => { throw new Error('quota'); };
  const result = training.selectPack('default');
  assert.equal(result.ok, false);
  assert.equal(result.message, 'Settings could not be saved. Selection unchanged.');
  assert.equal(result.selection.packId, 'alternate');
  assert.equal(training.readSelection().packId, 'alternate');
  assert.equal(training.selectPack('missing').ok, false);
});

test('Known invalid packs are blocked, never relabeled Default.', () => {
  const bad = structuredClone(alternate); bad.roleplay.scenarios = [];
  const { store } = setup({ [selectionKey]: '{"schema":1,"packId":"alternate"}' });
  const training = createTraining({ packs: [defaultPack, bad], storage: () => store });
  assert.equal(training.readSelection().status, 'blocked');
  assert.throws(() => training.openPage('roleplay'), /could not be loaded/);
  assert.equal(training.selectPack('alternate').ok, false);
  assert.deepEqual(training.listPacks().map(pack => pack.id), ['default']);
});

test('Legacy import is whole, preserves its source, and never replaces newer progress or resurrects a deleted destination.', () => {
  const legacy = JSON.stringify(state());
  const { page, records, writes } = setup({ [legacyKey]: legacy });
  const handle = page();
  assert.deepEqual(handle.readCheckpoint().state, state());
  assert.equal(records.get(key), envelope());
  assert.equal(records.get(legacyKey), legacy);
  handle.readCheckpoint();
  assert.equal(writes.filter(item => item === key).length, 1);
  const next = state(); next.teams[0].score = 800;
  assert.equal(handle.saveCheckpoint(next).ok, true);
  assert.equal(page().readCheckpoint().state.teams[0].score, 800);
  records.delete(key);
  assert.equal(page().readCheckpoint().state, null);
  assert.equal(records.has(key), false);
  assert.equal(records.get(legacyKey), legacy);
});

for (const raw of ['{', 'null', JSON.stringify({ schema: 3, packId: 'default', packRevision: 1, state: state() }), JSON.stringify({ schema: 2, packId: 'default', packRevision: 0, state: state() }), envelope(state(), alternate)]) {
  test(`Rejected destination survives boot, play, repeated load, and reset until replacement: ${raw.slice(0, 35)}`, () => {
    const { page, records } = setup({ [key]: raw, [legacyKey]: JSON.stringify(state()) });
    const handle = page();
    assert.equal(handle.readCheckpoint().status, 'rejected');
    assert.equal(handle.readCheckpoint().state, null);
    assert.equal(handle.saveCheckpoint(state()).ok, false);
    assert.equal(records.get(key), raw);
    assert.equal(page().readCheckpoint().state, null);
    const fresh = state(); fresh.teams.forEach(team => team.score = 0); fresh.used = [];
    assert.equal(handle.replaceCheckpoint(fresh).ok, true);
    assert.deepEqual(page().readCheckpoint().state, fresh);
  });
}

test('Old revision keys block silent import and remain intact after new revision approval.', () => {
  const oldKey = 'aiDealJeopardy.v2.default.0';
  const { page, records } = setup({ [oldKey]: envelope(), [legacyKey]: JSON.stringify(state()) });
  const handle = page();
  assert.match(handle.readCheckpoint().message, /another content revision/);
  assert.equal(handle.saveCheckpoint(state()).ok, false);
  assert.equal(records.has(key), false);
  assert.equal(handle.replaceCheckpoint(state()).ok, true);
  assert.equal(records.get(oldKey), envelope());
});

test('Recovery keeps only valid names with zero scores.', () => {
  const wrong = state(); wrong.used = ['100-0'];
  const { page } = setup({ [key]: envelope(wrong) });
  assert.deepEqual(page().readCheckpoint().teams, [{ name: 'Alpha', score: 0 }, { name: 'Beta', score: 0 }]);
  wrong.teams[0].name = '';
  assert.equal(setup({ [key]: envelope(wrong) }).page().readCheckpoint().teams, undefined);
});

test('Default and alternate checkpoints never cross and switching back restores the original.', () => {
  const { training, page, records } = setup({ [key]: envelope() });
  const pinned = page();
  training.selectPack('alternate');
  const other = page();
  assert.equal(other.readCheckpoint().state, null);
  const changed = state(); changed.teams[0].score = 900;
  assert.equal(other.saveCheckpoint(changed).ok, true);
  assert.equal(pinned.pack.id, 'default');
  assert.equal(records.get(key), envelope());
  training.selectPack('default');
  assert.equal(page().readCheckpoint().state.teams[0].score, 200);
  training.selectPack('alternate');
  assert.equal(page().readCheckpoint().state.teams[0].score, 900);
});

const invalidStates = {
  'team count': s => s.teams.pop(),
  'too many teams': s => s.teams.push(...s.teams, ...s.teams),
  'empty names': s => s.teams[0].name = '',
  'long names': s => s.teams[0].name = 'a'.repeat(29),
  'whitespace names': s => s.teams[0].name = ' Alpha ',
  'fractional scores': s => s.teams[0].score = 1.5,
  'infinite scores': s => s.teams[0].score = Infinity,
  'string scores': s => s.teams[0].score = '100',
  'unsafe scores': s => s.teams[0].score = Number.MAX_SAFE_INTEGER + 1,
  'tile ranges': s => s.used = ['6-0'],
  'tile rows': s => s.used = ['0-5'],
  'tile syntax': s => s.used = ['00-1'],
  'duplicate tiles': s => s.used = ['0-0', '0-0'],
  'duplicate doubles': s => s.dd = ['1-1', '1-1'],
  'same category doubles': s => s.dd = ['1-1', '1-2'],
  'first-row doubles': s => s.dd = ['0-0', '1-1'],
  'missing doubles': s => s.dd = [],
  'timer choices': s => s.timerSecs = 25,
  'string timer': s => s.timerSecs = '20',
  'timer boolean': s => s.timerOn = 'true',
  'sound boolean': s => s.muted = 0
};
for (const [name, mutate] of Object.entries(invalidStates)) {
  test(`Checkpoint decoder rejects ${name}.`, () => {
    const value = state(); mutate(value);
    assert.equal(decodeState(value, defaultPack), null);
    assert.equal(decodeCheckpoint(envelope(value), defaultPack), null);
  });
}

test('Blocked reads cannot authorize overwriting an unread destination.', () => {
  const { training, store, page, records } = setup({ [key]: 'future record' });
  store.getItem = () => { throw new Error('denied'); };
  assert.equal(training.readSelection().status, 'unavailable');
  const handle = page();
  assert.equal(handle.readCheckpoint().status, 'unavailable');
  assert.equal(handle.saveCheckpoint(state()).ok, false);
  assert.equal(handle.replaceCheckpoint(state()).ok, false);
  assert.equal(records.get(key), 'future record');
  assert.match(handle.readPreferences().message, /unavailable/);
});

test('Quota failure preserves destination, reports failure, and permits a later retry.', () => {
  const { page, store, records } = setup({ [key]: envelope() });
  const write = store.setItem;
  const handle = page(); handle.readCheckpoint();
  store.setItem = () => { throw new Error('quota'); };
  const next = state(); next.teams[0].score = 900;
  assert.equal(handle.saveCheckpoint(next).ok, false);
  assert.equal(records.get(key), envelope());
  store.setItem = write;
  assert.equal(handle.saveCheckpoint(next).ok, true);
  assert.equal(page().readCheckpoint().state.teams[0].score, 900);
});

test('A rejected record written by another tab is protected on the next save.', () => {
  const { page, records } = setup();
  const handle = page(); handle.readCheckpoint();
  records.set(key, 'future');
  assert.equal(handle.saveCheckpoint(state()).ok, false);
  assert.equal(handle.checkpointStatus, 'rejected');
  assert.equal(records.get(key), 'future');
});

test('Import write failures retain the source and do not claim saved progress.', () => {
  for (const blocked of ['aiDealJeopardy.imported.v1', key]) {
    const { store, page, records } = setup({ [legacyKey]: JSON.stringify(state()) });
    const write = store.setItem;
    store.setItem = (key, value) => { if (key === blocked) throw new Error('quota'); write(key, value); };
    const restored = page().readCheckpoint();
    assert.deepEqual(restored.state, state());
    assert.match(restored.message, /could not be saved/);
    assert.equal(records.get(legacyKey), JSON.stringify(state()));
    assert.equal(records.has(key), false);
  }
});

test('Selection observation rereads on storage, pageshow, and focus and unsubscribes without replacing packs.', () => {
  const { training, records, events, page } = setup();
  const pinned = page();
  const seen = [];
  const stop = training.observeSelection(selection => seen.push(selection.packId));
  records.set(selectionKey, '{"schema":1,"packId":"alternate"}');
  for (const name of ['storage', 'pageshow', 'focus']) events.dispatchEvent(new Event(name));
  assert.deepEqual(seen, ['default', 'alternate', 'alternate', 'alternate']);
  assert.equal(pinned.pack.id, 'default');
  stop(); events.dispatchEvent(new Event('focus'));
  assert.equal(seen.length, 4);
});

test('Presenter preferences require exactly three validated booleans and never store runs.', () => {
  for (const raw of ['{', '{}', 'null', '{"group":true,"spot":"yes","ideal":false}']) {
    assert.deepEqual(decodePreferences(raw), { group: false, spot: true, ideal: false });
  }
  const { training, records, store } = setup();
  const handle = training.openPage('roleplay');
  assert.equal(handle.savePreferences({ group: true, spot: false, ideal: true }).ok, true);
  assert.deepEqual(handle.readPreferences().prefs, { group: true, spot: false, ideal: true });
  assert.deepEqual([...records.keys()], ['aiRoleplay.prefs.v1']);
  assert.throws(() => handle.readCheckpoint(), /Only Jeopardy/);
  store.setItem = () => { throw new Error('quota'); };
  assert.equal(handle.savePreferences({ group: false, spot: true, ideal: false }).ok, false);
  assert.equal(decodeSelection(null, ['default']).valid, true);
});

test('Alternate fixtures and selection overrides stay outside the served application.', () => {
  assert.equal(readdirSync('prototype/seller-ai-training/packs').some(name => /alternate|fixture/.test(name)), false);
  const module = readFileSync('prototype/seller-ai-training/shared/training.mjs', 'utf8');
  assert.doesNotMatch(module, /alternate|URLSearchParams|location\.search/);
});
