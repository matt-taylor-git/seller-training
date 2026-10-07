/**
 * @typedef {'d' | 'l' | 'u' | 'p' | 't'} ScoreKey
 * @typedef {{t: string, q: 'best' | 'good' | 'meh' | 'bad', s: Partial<Record<ScoreKey, number>>, next: string, fb: string}} Choice
 * @typedef {{c: string, ch: Choice[]}} ConversationNode
 * @typedef {{name: string, initials: string, role: string, company: string, industry: string, size: string, quote: string, goals: string[], personality: string[], pains: string[]}} Persona
 * @typedef {{title: string, text: string}} Outcome
 * @typedef {{id: string, full: boolean, difficulty: number, turns: number, title: string, persona: Persona, mission: string, start: string, nodes: Record<string, ConversationNode>, outcomes: {great: Outcome, ok: Outcome, poor: Outcome}, useCases: string[], offering: {headline: string, steps: string[]}, takeaways: string[]}} Scenario
 * @typedef {{q: string, a: string, why: string}} Clue
 * @typedef {{name: string, clues: Clue[]}} Category
 * @typedef {{id: string, revision: number, label: string, description: string, disclaimer: string, roleplay: {scenarios: Scenario[]}, jeopardy: {categories: Category[], final: Clue & {category: string}}}} ContentPack
 */

/** @param {unknown} value @param {string} path @returns {Record<string, unknown>} */
function object(value, path) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${path} must be an object.`);
  return /** @type {Record<string, unknown>} */ (value);
}

/** @param {unknown} value @param {string} path @returns {string} */
function text(value, path) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${path} must be nonempty text.`);
  return value;
}

/** @param {unknown} value @param {string} path @returns {unknown[]} */
function list(value, path) {
  if (!Array.isArray(value) || !value.length) throw new Error(`${path} must be a nonempty array.`);
  return value;
}

/** @param {unknown} value @param {string} path */
function textList(value, path) {
  list(value, path).forEach((item, index) => text(item, `${path}[${index}]`));
}

/** @param {unknown} value @param {string} path */
function positiveInteger(value, path) {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) throw new Error(`${path} must be a positive integer.`);
}

/** @param {unknown} value @param {string} path */
function clue(value, path) {
  const entry = object(value, path);
  for (const key of ['q', 'a', 'why']) text(entry[key], `${path}.${key}`);
}

/** @param {string} value @param {string} path */
function signals(value, path) {
  const remainder = value.replace(/\[\[([^\[\]|]+)\|(buy|pain|ready|red)\|([^\[\]|]+)\]\]/g, (_, phrase, _type, label) => {
    text(phrase, `${path}.signal.phrase`);
    text(label, `${path}.signal.label`);
    return '';
  });
  if (remainder.includes('[[') || remainder.includes(']]')) throw new Error(`${path} has invalid signal grammar or type.`);
}

/** @param {unknown} value @param {string} path @returns {string} */
function scenario(value, path) {
  const entry = object(value, path);
  const id = text(entry.id, `${path}.id`);
  for (const key of ['title', 'mission', 'start']) text(entry[key], `${path}.${key}`);
  if (typeof entry.full !== 'boolean') throw new Error(`${path}.full must be boolean.`);
  positiveInteger(entry.turns, `${path}.turns`);
  if (![1, 2, 3].includes(/** @type {number} */ (entry.difficulty))) throw new Error(`${path}.difficulty must be 1, 2, or 3.`);
  const persona = object(entry.persona, `${path}.persona`);
  for (const key of ['name', 'initials', 'role', 'company', 'industry', 'size', 'quote']) text(persona[key], `${path}.persona.${key}`);
  for (const key of ['goals', 'personality', 'pains']) textList(persona[key], `${path}.persona.${key}`);
  const outcomes = object(entry.outcomes, `${path}.outcomes`);
  for (const key of ['great', 'ok', 'poor']) {
    const outcome = object(outcomes[key], `${path}.outcomes.${key}`);
    text(outcome.title, `${path}.outcomes.${key}.title`);
    text(outcome.text, `${path}.outcomes.${key}.text`);
  }
  textList(entry.useCases, `${path}.useCases`);
  textList(entry.takeaways, `${path}.takeaways`);
  const offering = object(entry.offering, `${path}.offering`);
  text(offering.headline, `${path}.offering.headline`);
  textList(offering.steps, `${path}.offering.steps`);
  const nodes = object(entry.nodes, `${path}.nodes`);
  if (!Object.keys(nodes).length || Object.hasOwn(nodes, 'end')) throw new Error(`${path}.nodes must contain nodes without an end key.`);
  /** @type {Map<string, string[]>} */
  const edges = new Map();
  for (const [nodeId, raw] of Object.entries(nodes)) {
    text(nodeId, `${path}.nodeId`);
    const node = object(raw, `${path}.nodes.${nodeId}`);
    signals(text(node.c, `${path}.${nodeId}.c`), `${path}.${nodeId}.c`);
    const choices = list(node.ch, `${path}.${nodeId}.ch`);
    if (choices.length < 3 || choices.length > 4) throw new Error(`${path}.${nodeId} must have 3 or 4 choices.`);
    let best = 0;
    const targets = [];
    const responses = new Set();
    for (const [index, rawChoice] of choices.entries()) {
      const at = `${path}.${nodeId}.ch[${index}]`;
      const choice = object(rawChoice, at);
      const response = text(choice.t, `${at}.t`);
      if (responses.has(response)) throw new Error(`${at} duplicates a response.`);
      responses.add(response);
      text(choice.fb, `${at}.fb`);
      if (!['best', 'good', 'meh', 'bad'].includes(/** @type {string} */ (choice.q))) throw new Error(`${at}.q has invalid choice quality.`);
      if (choice.q === 'best') best++;
      const scores = object(choice.s, `${at}.s`);
      if (!Object.keys(scores).length) throw new Error(`${at}.s must contain scores.`);
      for (const [key, score] of Object.entries(scores)) {
        if (!['d', 'l', 'u', 'p', 't'].includes(key) || typeof score !== 'number' || !Number.isFinite(score)) throw new Error(`${at}.s has an invalid score key or value.`);
      }
      const next = text(choice.next, `${at}.next`);
      if (next !== 'end' && !Object.hasOwn(nodes, next)) throw new Error(`${at}.next has a dangling branch.`);
      targets.push(next);
    }
    if (best !== 1) throw new Error(`${path}.${nodeId} must have exactly 1 ideal choice.`);
    edges.set(nodeId, targets);
  }
  const start = text(entry.start, `${path}.start`);
  if (!edges.has(start)) throw new Error(`${path}.start has a dangling branch.`);
  const visiting = new Set();
  const visited = new Set();
  /** @param {string} nodeId */
  function visit(nodeId) {
    if (nodeId === 'end' || visited.has(nodeId)) return;
    if (visiting.has(nodeId)) throw new Error(`${path} has a cycle at ${nodeId}.`);
    visiting.add(nodeId);
    for (const next of edges.get(nodeId) || []) visit(next);
    visiting.delete(nodeId);
    visited.add(nodeId);
  }
  visit(start);
  if (visited.size !== edges.size) throw new Error(`${path} has unreachable nodes.`);
  return id;
}

/** Validate complete content before it enters the registry. @param {unknown} value @returns {ContentPack} */
export function validatePack(value) {
  const pack = object(value, 'pack');
  for (const key of ['id', 'label', 'description', 'disclaimer']) text(pack[key], `pack.${key}`);
  if (!/^[a-z][a-z0-9-]*$/.test(/** @type {string} */ (pack.id))) throw new Error('pack.id must be a lowercase identifier.');
  positiveInteger(pack.revision, 'pack.revision');
  const roleplay = object(pack.roleplay, 'pack.roleplay');
  const ids = new Set();
  for (const [index, raw] of list(roleplay.scenarios, 'pack.roleplay.scenarios').entries()) {
    const id = scenario(raw, `pack.roleplay.scenarios[${index}]`);
    if (ids.has(id)) throw new Error(`Scenario ID ${id} is duplicated.`);
    ids.add(id);
  }
  const jeopardy = object(pack.jeopardy, 'pack.jeopardy');
  const categories = list(jeopardy.categories, 'pack.jeopardy.categories');
  if (categories.length !== 6) throw new Error('Jeopardy must have 6 categories.');
  const names = new Set();
  categories.forEach((raw, index) => {
    const at = `pack.jeopardy.categories[${index}]`;
    const category = object(raw, at);
    const name = text(category.name, `${at}.name`);
    if (names.has(name)) throw new Error('Jeopardy category names must be unique.');
    names.add(name);
    const clues = list(category.clues, `${at}.clues`);
    if (clues.length !== 5) throw new Error(`${at} must have 5 clues.`);
    clues.forEach((rawClue, row) => clue(rawClue, `${at}.clues[${row}]`));
  });
  clue(jeopardy.final, 'pack.jeopardy.final');
  text(object(jeopardy.final, 'pack.jeopardy.final').category, 'pack.jeopardy.final.category');
  return /** @type {ContentPack} */ (value);
}

/** @template T @param {T} value @returns {Readonly<T>} */
export function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}
