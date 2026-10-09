import defaultPack from '../packs/default.mjs';
import { deepFreeze, validatePack } from './pack-contract.mjs';

const packs = deepFreeze({ default: deepFreeze(validatePack(defaultPack)) });

/** @param {'roleplay' | 'jeopardy'} activity */
function openPage(activity) {
  if (activity !== 'roleplay' && activity !== 'jeopardy') throw new Error('The training activity is unknown.');
  return Object.freeze({ activity, pack: packs.default });
}

export const training = Object.freeze({ openPage });
