import defaultPack from '../packs/default.mjs';
import { deepFreeze, validatePack } from './pack-contract.mjs';

/** @typedef {import('./pack-contract.mjs').ContentPack} ContentPack */
/** @typedef {{name: string, score: number}} Team */
/** @typedef {{teams: Team[], used: string[], dd: string[], timerOn: boolean, muted: boolean, timerSecs: number}} Checkpoint */
/** @typedef {{group: boolean, spot: boolean, ideal: boolean}} Preferences */
/** @typedef {{packId: string, valid: boolean, status: 'valid'|'missing'|'invalid'|'unavailable'|'blocked', message: string}} Selection */
/** @typedef {Pick<Storage, 'getItem'|'setItem'|'key'|'length'>} Store */

const SELECTION_KEY = 'aiTraining.selection.v1';
const LEGACY_KEY = 'aiDealJeopardy.v1';
const IMPORT_KEY = 'aiDealJeopardy.imported.v1';
const PREFS_KEY = 'aiRoleplay.prefs.v1';
const SAVE_FAILED = 'Progress could not be saved. Play can continue in memory. Try reopening when browser storage is available.';
const READ_FAILED = 'Browser storage is unavailable. Play can continue in memory. Reopen this activity to retry.';
const REJECTED = 'Saved game is invalid or incompatible. It has not been changed. Play stays in memory until you approve a fresh saved game.';

/** @param {unknown} value @returns {value is Record<string, unknown>} */
const record = value => typeof value === 'object' && value !== null && !Array.isArray(value);
/** @param {string|null} raw @returns {unknown} */
function parse(raw) { try { return raw === null ? null : JSON.parse(raw); } catch { return undefined; } }
/** @param {unknown} value @returns {value is string} */
const teamName = value => typeof value === 'string' && value.trim() === value && value.length > 0 && value.length <= 28;

/** @param {unknown} value @param {ContentPack} pack @returns {Checkpoint|null} */
export function decodeState(value, pack) {
  if (!record(value) || !Array.isArray(value.teams) || value.teams.length < 2 || value.teams.length > 4) return null;
  if (!value.teams.every(team => record(team) && teamName(team.name) && Number.isSafeInteger(team.score))) return null;
  /** @param {unknown} key */
  const tile = key => {
    if (typeof key !== 'string' || !/^\d+-\d+$/.test(key)) return false;
    const [category, row] = key.split('-').map(Number);
    return key === `${category}-${row}` && Boolean(pack.jeopardy.categories[category]?.clues[row]);
  };
  if (!Array.isArray(value.used) || !value.used.every(tile) || new Set(value.used).size !== value.used.length) return null;
  if (!Array.isArray(value.dd) || value.dd.length !== 2 || !value.dd.every(tile) || new Set(value.dd).size !== 2) return null;
  if (value.dd.some(key => key.endsWith('-0')) || new Set(value.dd.map(key => key.split('-')[0])).size !== 2) return null;
  if (typeof value.timerOn !== 'boolean' || typeof value.muted !== 'boolean' || typeof value.timerSecs !== 'number' || ![15, 20, 30, 45, 60].includes(value.timerSecs)) return null;
  return { teams: value.teams.map(team => ({ name: team.name, score: team.score })), used: [...value.used], dd: [...value.dd], timerOn: value.timerOn, muted: value.muted, timerSecs: value.timerSecs };
}

/** @param {string|null} raw @param {ContentPack} pack */
export function decodeCheckpoint(raw, pack) {
  const value = parse(raw);
  if (!record(value) || value.schema !== 2 || value.packId !== pack.id || value.packRevision !== pack.revision) return null;
  return decodeState(value.state, pack);
}

/** @param {string|null} raw @param {string[]} ids @returns {Selection} */
export function decodeSelection(raw, ids) {
  if (raw === null) return { packId: 'default', valid: true, status: 'missing', message: '' };
  const value = parse(raw);
  if (!record(value) || value.schema !== 1 || typeof value.packId !== 'string' || !ids.includes(value.packId)) {
    return { packId: 'default', valid: false, status: 'invalid', message: 'Saved selection is invalid. Using Default. Save Default in Settings to repair it.' };
  }
  return { packId: value.packId, valid: true, status: 'valid', message: '' };
}

/** @param {string|null} raw @returns {Preferences} */
export function decodePreferences(raw) {
  const value = parse(raw);
  if (!record(value) || !['group', 'spot', 'ideal'].every(key => typeof value[key] === 'boolean')) return { group: false, spot: true, ideal: false };
  return { group: Boolean(value.group), spot: Boolean(value.spot), ideal: Boolean(value.ideal) };
}

/** @param {unknown} value @returns {Team[]|undefined} */
function recoverTeams(value) {
  if (!record(value) || !Array.isArray(value.teams) || value.teams.length < 2 || value.teams.length > 4 || !value.teams.every(team => record(team) && teamName(team.name))) return undefined;
  return value.teams.map(team => ({ name: team.name, score: 0 }));
}

/** @param {{packs?: ContentPack[], storage?: () => Store, events?: EventTarget}} [options] */
export function createTraining({ packs = [defaultPack], storage = () => globalThis.localStorage, events = globalThis.window } = {}) {
  /** @type {Map<string, {pack: Readonly<ContentPack>|null, error: string}>} */
  const registry = new Map();
  for (const pack of packs) {
    try { registry.set(pack.id, { pack: deepFreeze(validatePack(pack)), error: '' }); }
    catch { registry.set(pack.id, { pack: null, error: `The ${pack.label} pack could not be loaded. Choose another pack in Settings.` }); }
  }
  /** @type {Set<(selection: Selection) => void>} */
  const listeners = new Set();
  /** @returns {Selection} */
  function readSelection() {
    let selection;
    try { selection = decodeSelection(storage().getItem(SELECTION_KEY), [...registry.keys()]); }
    catch { return { packId: 'default', valid: false, status: 'unavailable', message: READ_FAILED }; }
    const entry = registry.get(selection.packId);
    if (!entry?.pack) return { ...selection, valid: false, status: 'blocked', message: entry?.error || 'Default could not be loaded.' };
    return selection;
  }
  function notify() { const selection = readSelection(); listeners.forEach(listener => listener(selection)); }
  /** @param {Event} event */
  function onStorage(event) { if (!('key' in event) || event.key === null || event.key === SELECTION_KEY) notify(); }
  /** @param {(selection: Selection) => void} listener */
  function observeSelection(listener) {
    if (!listeners.size) {
      events?.addEventListener('storage', onStorage);
      events?.addEventListener('pageshow', notify);
      events?.addEventListener('focus', notify);
    }
    listeners.add(listener);
    listener(readSelection());
    return () => {
      listeners.delete(listener);
      if (!listeners.size) {
        events?.removeEventListener('storage', onStorage);
        events?.removeEventListener('pageshow', notify);
        events?.removeEventListener('focus', notify);
      }
    };
  }
  /** @param {string} id */
  function selectPack(id) {
    const prior = readSelection();
    if (prior.status === 'unavailable') return { ok: false, selection: prior, message: 'Settings could not be saved. Selection unchanged.' };
    const entry = registry.get(id);
    if (!entry?.pack) return { ok: false, selection: prior, message: entry?.error || 'This content pack is unknown.' };
    if (prior.valid && prior.status === 'valid' && prior.packId === id) return { ok: true, selection: prior, message: '' };
    try { storage().setItem(SELECTION_KEY, JSON.stringify({ schema: 1, packId: id })); }
    catch { return { ok: false, selection: prior, message: 'Settings could not be saved. Selection unchanged.' }; }
    const confirmed = readSelection();
    if (!confirmed.valid || confirmed.status !== 'valid' || confirmed.packId !== id) {
      return { ok: false, selection: confirmed, message: 'Settings confirmation is unavailable. Reopen Settings to check the saved selection.' };
    }
    notify();
    return { ok: true, selection: confirmed, message: `${entry.pack.label} selected for both activities. Open games keep their current pack.` };
  }
  /** @param {'roleplay'|'jeopardy'} activity */
  function openPage(activity) {
    if (activity !== 'roleplay' && activity !== 'jeopardy') throw new Error('The training activity is unknown.');
    const selection = readSelection();
    const resolved = registry.get(selection.packId)?.pack;
    if (!resolved) throw new Error(selection.message);
    const pack = resolved;
    const prefix = `aiDealJeopardy.v2.${pack.id}.`;
    const key = prefix + pack.revision;
    /** @type {'unread'|'ready'|'rejected'|'unavailable'} */
    let checkpointStatus = 'unread';
    /** @type {{state: Checkpoint|null, teams: Team[]|undefined, message: string, status: string}|undefined} */
    let restored;
    /** @param {Store} store */
    function repairImportMarker(store) {
      if (pack.id !== 'default' || pack.revision !== 1) return '';
      try {
        if (store.getItem(IMPORT_KEY) === null) store.setItem(IMPORT_KEY, '1');
        return '';
      } catch { return 'Progress is saved, but the legacy import marker could not be saved. A later save or reopening will retry.'; }
    }
    function readCheckpoint() {
      if (activity !== 'jeopardy') throw new Error('Only Jeopardy saves checkpoints.');
      if (restored) return restored;
      /** @type {Checkpoint|null} */
      let state = null;
      /** @type {Team[]|undefined} */
      let teams;
      let message = '';
      try {
        const store = storage();
        const raw = store.getItem(key);
        checkpointStatus = 'ready';
        if (raw !== null) {
          state = decodeCheckpoint(raw, pack);
          if (!state) {
            checkpointStatus = 'rejected'; message = REJECTED;
            const value = parse(raw);
            teams = recoverTeams(record(value) ? value.state : null);
          } else { message = repairImportMarker(store); }
        } else {
          const priorKeys = Array.from({ length: store.length }, (_, i) => store.key(i)).filter(item => item?.startsWith(prefix));
          if (priorKeys.length) {
            checkpointStatus = 'rejected'; message = 'A saved game uses another content revision. ' + REJECTED;
            const revisions = priorKeys.map(item => Number(item?.slice(prefix.length)))
              .filter(revision => Number.isSafeInteger(revision) && revision > 0 && revision < pack.revision && priorKeys.includes(prefix + revision))
              .sort((a, b) => b - a);
            for (const revision of revisions) {
              const prior = decodeCheckpoint(store.getItem(prefix + revision), { ...pack, revision });
              if (prior) { teams = recoverTeams(prior); break; }
            }
          } else if (pack.id === 'default' && pack.revision === 1 && store.getItem(IMPORT_KEY) === null) {
            const legacy = store.getItem(LEGACY_KEY);
            if (legacy !== null) {
              state = decodeState(parse(legacy), pack);
              if (state) {
                try {
                  store.setItem(key, JSON.stringify({ schema: 2, packId: pack.id, packRevision: pack.revision, state }));
                  message = repairImportMarker(store);
                } catch { message = SAVE_FAILED; }
              } else { checkpointStatus = 'rejected'; message = REJECTED; teams = recoverTeams(parse(legacy)); }
            }
          }
        }
      } catch { checkpointStatus = 'unavailable'; message = READ_FAILED; }
      restored = { state, teams, message, status: checkpointStatus };
      return restored;
    }
    /** @param {Checkpoint} state @param {boolean} replace */
    function writeCheckpoint(state, replace) {
      readCheckpoint();
      if (checkpointStatus === 'unavailable') return { ok: false, message: READ_FAILED };
      if (checkpointStatus === 'rejected' && !replace) return { ok: false, message: REJECTED };
      try {
        const store = storage();
        const current = store.getItem(key);
        if (!replace && current !== null && !decodeCheckpoint(current, pack)) {
          checkpointStatus = 'rejected'; return { ok: false, message: REJECTED };
        }
        store.setItem(key, JSON.stringify({ schema: 2, packId: pack.id, packRevision: pack.revision, state }));
        checkpointStatus = 'ready';
        return { ok: true, message: repairImportMarker(store) };
      } catch { return { ok: false, message: SAVE_FAILED }; }
    }
    function readPreferences() {
      try { return { prefs: decodePreferences(storage().getItem(PREFS_KEY)), message: '' }; }
      catch { return { prefs: decodePreferences(null), message: READ_FAILED }; }
    }
    /** @param {Preferences} prefs */
    function savePreferences(prefs) {
      try { storage().setItem(PREFS_KEY, JSON.stringify(prefs)); return { ok: true, message: '' }; }
      catch { return { ok: false, message: 'Presenter preferences could not be saved. This meeting can continue.' }; }
    }
    /** @param {Selection} selected */
    function selectionNotice(selected) {
      const selectedPack = registry.get(selected.packId)?.pack;
      const changed = selected.packId !== pack.id;
      return [`Current pack: ${pack.label}.`, selected.message, changed ? `${selectedPack?.label || selected.packId} is selected for new activities. Reopen this activity to use it.` : ''].filter(Boolean).join(' ');
    }
    return Object.freeze({ activity, pack, selection, selectionNotice, readCheckpoint,
      saveCheckpoint: (/** @type {Checkpoint} */ state) => writeCheckpoint(state, false),
      replaceCheckpoint: (/** @type {Checkpoint} */ state) => writeCheckpoint(state, true),
      readPreferences, savePreferences,
      get checkpointStatus() { return checkpointStatus; }
    });
  }
  return Object.freeze({ openPage, readSelection, selectPack, observeSelection,
    listPacks: () => [...registry.values()].flatMap(entry => entry.pack ? [entry.pack] : [])
  });
}

export const training = createTraining();
