import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import fsiPack from '../prototype/seller-ai-training/packs/fsi.mjs';
import { validatePack } from '../prototype/seller-ai-training/shared/pack-contract.mjs';

export const categoryNames = ['Hear the problem', 'Find a useful task', 'Ask what is missing', 'Handle the risk', 'Earn the next step', 'Judge the results'];
const offerings = ['Private AI Launch Workshop', 'AI Readiness Data Quality Assessment', 'AI Risk Assessment', 'Copilot Adoption and Change Management', 'FirstTouch AI'];
const words = text => text.trim().split(/\s+/).length;
const atPath = (value, path) => path.replace(/\[(\d+)\]/g, '.$1').split('.').reduce((part, key) => part && typeof part === 'object' && Object.hasOwn(part, key) ? part[key] : undefined, value);
const mentions = (text, offering) => text.toLowerCase().includes(offering.toLowerCase());
const containsPath = (ancestor, path) => path === ancestor || path.startsWith(ancestor + '.') || path.startsWith(ancestor + '[');

function visibleText(value, path = '', fields = new Map()) {
  if (typeof value === 'string') {
    if (!/(?:^|\.)(?:id|revision|start|next)$|\.ch\[\d+\]\.(?:q|s\.[^.]+)$/.test(path)) {
      const explanations = [];
      const displayed = /(?:^|\.)nodes\.[^.]+\.c$/.test(path)
        ? value.replace(/\[\[([^|]+)\|[^|]+\|([^\]]+)\]\]/g, (_signal, phrase, explanation) => { explanations.push(explanation); return phrase; })
        : value;
      fields.set(path, [displayed, ...explanations]);
    }
  } else if (Array.isArray(value)) value.forEach((entry, index) => visibleText(entry, `${path}[${index}]`, fields));
  else if (value && typeof value === 'object') for (const [key, entry] of Object.entries(value)) visibleText(entry, path ? `${path}.${key}` : key, fields);
  return fields;
}

function checkAvailability(pack) {
  for (const [path, texts] of visibleText(pack)) {
    for (const offering of unavailable) {
      if (!texts.some(text => mentions(text, offering))) continue;
      const choicePath = path.match(/^(.*\.ch\[\d+\])\.(?:t|fb)$/)?.[1];
      const choice = choicePath && atPath(pack, choicePath);
      assert(choice && choice.q !== 'best' && mentions(choice.t, offering)
        && choice.fb === `${offering} is unavailable. Do not recommend it.`, `Unavailable offering outside a corrected nonideal reply: ${offering} at ${path}`);
    }
  }
}

function checkEvidence(item, content) {
  assert.equal(item.contentSha256, digest(JSON.stringify(content)), `Evidence needs review after content changes: ${item.itemId}`);
  const fields = visibleText(content);
  for (const claim of item.claims) {
    assert(['source-claim', 'fictional-fact', 'authored-recommendation'].includes(claim.kind), 'Identify the kind of evidence.');
    assert(claim.locations?.length, 'Claims need locations.');
    if (claim.offering !== undefined) {
      assert.equal(claim.kind, 'source-claim', 'Offering metadata requires a source claim.');
      assert([...offerings, ...unavailable].includes(claim.offering), `Unknown offering: ${claim.offering}`);
    }
    for (const location of claim.locations) {
      assert(atPath(content, location) !== undefined, `Dangling claim location: ${item.itemId}.${location}`);
      assert([...fields.keys()].some(path => containsPath(location, path)), `Claim location must contain visible text: ${item.itemId}.${location}`);
      if (claim.offering !== undefined) assert(fields.has(location), `Offering location must be an exact visible string: ${item.itemId}.${location}`);
    }
  }
  for (const [path, texts] of fields) {
    for (const offering of [...offerings, ...unavailable]) {
      if (!texts.some(text => mentions(text, offering))) continue;
      assert(item.claims.some(claim => claim.kind === 'source-claim' && claim.offering === offering && claim.locations.includes(path)), `Unmapped offering claim: ${item.itemId}.${path} (${offering})`);
    }
  }
}
const unavailable = ['FinOps for AI', 'AI Value Assurance', 'Agents & Workflow Automation', 'Security from AI', 'Hyperscaler AI Foundation', 'AI-Accelerated Engineering', 'Modern Data Ecosystem Design Workshop'];
const digest = value => createHash('sha256').update(value).digest('hex');
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const sentence = value => assert(/[.!?]$/.test(value.replace(/\[\[([^|]+)\|[^|]+\|[^\]]+\]\]/g, '$1')), `Complete sentence required: ${value}`);

export function checkContent(pack, provenance, source) {
  validatePack(pack);
  checkAvailability(pack);
  assert.equal(pack.id, 'fsi');
  assert.equal(pack.revision, 2);
  assert.equal(pack.label, 'Financial services');
  assert.equal(pack.roleplay.scenarios.length, 4);
  assert.deepEqual(pack.roleplay.scenarios.map(scenario => scenario.full), [true, true, false, false]);
  assert.deepEqual(pack.roleplay.scenarios.map(scenario => scenario.persona.industry), ['Banking', 'Insurance', 'Wealth management', 'Payments']);
  assert.deepEqual(pack.jeopardy.categories.map(category => category.name), categoryNames);
  assert.match(pack.disclaimer, /fictional training scenarios/i);
  assert.match(pack.disclaimer, /2026-10-07/);
  assert.match(pack.disclaimer, /Distribution/);
  const served = JSON.stringify(pack);
  for (const pattern of [/https?:\/\//i, /sharepoint|cdw\.com\/sites|\.internal\b/i, /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, /\$\s*\d|\b(?:USD|GBP)\s*\d/i, /\bcase (?:subtype|type)\b|campaign tag|Power Plays AI/i, /[\u2013\u2014\u2018\u2019\u201c\u201d]/]) {
    assert(!pattern.test(served), `Excluded served content: ${pattern}`);
  }
  assert.equal(provenance.schema, 1);
  assert.equal(provenance.packId, pack.id);
  assert.equal(provenance.packRevision, pack.revision);
  assert.equal(provenance.source.compiledDate, '2026-10-07');
  assert(nonempty(provenance.reviewStatus) && /independent.*review/i.test(provenance.reviewStatus), 'Record review limits.');
  for (const key of ['fiction', 'measurement', 'misconceptions', 'proposedControls', 'availability', 'distribution']) assert(nonempty(provenance.authoringPolicy[key]));
  assert(provenance.authoringPolicy.exclusions.length >= 6, 'Keep private-source exclusions.');
  assert.match(provenance.source.sha256, /^[a-f0-9]{64}$/);
  let sourceContactsChecked = null;
  if (source !== undefined) {
    assert.equal(digest(source), provenance.source.sha256, 'Source hash must match reviewed compilation.');
    const block = source.match(/\*\*Contacts named in play materials:\*\*([\s\S]*?)\*\*Discovery questions/);
    assert(block, 'Expected source contacts section.');
    const contacts = [...block[1].matchAll(/^- \*\*([^*]+)\*\*/gm)].map(match => match[1]);
    assert.equal(contacts.length, 4, 'Review exclusions if the source changes.');
    for (const name of contacts) assert(!served.toLowerCase().includes(name.toLowerCase()), 'Source contact excluded.');
    sourceContactsChecked = contacts.length;
  }
  const items = new Map(provenance.items.map(item => [item.locator, item]));
  assert.equal(items.size, 35, '35 unique provenance locators required.');
  assert.equal(provenance.items.length, 35);
  assert.equal(new Set(provenance.items.map(item => item.itemId)).size, 35);
  for (const item of items.values()) {
    assert(['roleplay', 'jeopardy'].includes(item.activity));
    assert(item.claims.length, `Missing claims: ${item.itemId}`);
    for (const claim of item.claims) {
      for (const key of ['claim', 'section', 'date', 'caveat']) assert(nonempty(claim[key]), `Missing ${key}: ${item.itemId}`);
      assert(/^\d{4}-\d{2}(?:-\d{2})?$/.test(claim.date), 'Source date required.');
      for (const section of claim.section.split(';')) assert(/^\s*(?:[1-9]|10)(?:\.|,|\s|$)/.test(section), 'Specific supplied-source section required.');
    }
  }
  const scenarios = pack.roleplay.scenarios.map(scenario => {
    const item = items.get(`roleplay.scenarios[id=${scenario.id}]`);
    assert(item?.fictionalCustomer, `Missing scenario evidence: ${scenario.id}`);
    checkEvidence(item, scenario);
    assert(item.claims.some(claim => claim.kind === 'fictional-fact'), 'Mark fictional scenario facts.');
    assert(item.claims.some(claim => claim.kind === 'authored-recommendation'), 'Mark authored recommendations.');
    assert.match(scenario.persona.size, /fictional/i);
    assert(scenario.takeaways.length >= 4);
    const nodes = Object.values(scenario.nodes);
    const coaching = nodes.flatMap(node => node.ch.map(choice => choice.fb));
    assert.equal(new Set(coaching).size, coaching.length, 'Distinct coaching required.');
    for (const node of nodes) {
      assert(node.c.includes('[['), 'Every node needs a marked signal.');
      sentence(node.c);
      for (const signal of node.c.matchAll(/\[\[([^|]+)\|[^|]+\|([^\]]+)\]\]/g)) sentence(signal[2]);
      for (const choice of node.ch) {
        sentence(choice.t); sentence(choice.fb);
        assert(Object.values(choice.s).some(score => score !== 0), 'Nonzero score deltas required.');
      }
    }
    for (const step of scenario.offering.steps) sentence(step);
    for (const value of [scenario.mission, scenario.persona.quote, ...scenario.persona.goals, ...scenario.persona.personality, ...scenario.persona.pains, ...scenario.useCases, ...scenario.takeaways, ...Object.values(scenario.outcomes).map(outcome => outcome.text)]) sentence(value);
    const lengths = new Set();
    let terminalChoicePaths = 0;
    function walk(id, turns) {
      if (id === 'end') { lengths.add(turns); terminalChoicePaths++; return; }
      for (const choice of scenario.nodes[id].ch) walk(choice.next, turns + 1);
    }
    walk(scenario.start, 0);
    assert.deepEqual([...lengths], [scenario.turns], 'All authored routes keep nominal turns.');
    return { id: scenario.id, nodes: nodes.length, choices: coaching.length, outcomes: Object.keys(scenario.outcomes).length, takeaways: scenario.takeaways.length,
      signals: nodes.reduce((sum, node) => sum + [...node.c.matchAll(/\[\[/g)].length, 0), turnLengths: [...lengths], terminalChoicePaths, allPathsTerminate: true };
  });
  for (const [categoryIndex, category] of pack.jeopardy.categories.entries()) {
    for (const [clueIndex, clue] of category.clues.entries()) {
      const item = items.get(`jeopardy.categories[${categoryIndex}].clues[${clueIndex}]`);
      assert(item?.fictionalSituation, 'Missing clue evidence.');
      checkEvidence(item, clue);
      for (const value of Object.values(clue)) sentence(value);
      assert(words(clue.q) <= 40, 'Regular questions allow at most 40 words.');
      assert(words(clue.a) <= 25 && clue.a.length <= 110, 'Regular answer reading budget.');
      assert(words(clue.why) <= 40 && words(clue.a) + words(clue.why) <= 65, 'Regular explanation reading budget.');
    }
  }
  const finalItem = items.get('jeopardy.final');
  assert(finalItem?.fictionalSituation, 'Final evidence required.');
  checkEvidence(finalItem, pack.jeopardy.final);
  const final = pack.jeopardy.final;
  for (const value of [final.q, final.a, final.why]) sentence(value);
  assert(words(final.a) <= 45 && words(final.why) <= 40 && words(final.a) + words(final.why) <= 85, 'Final reading budget.');
  const totals = { scenarios: scenarios.length, nodes: scenarios.reduce((n, s) => n + s.nodes, 0), choices: scenarios.reduce((n, s) => n + s.choices, 0), outcomes: scenarios.reduce((n, s) => n + s.outcomes, 0),
    takeaways: scenarios.reduce((n, s) => n + s.takeaways, 0), signals: scenarios.reduce((n, s) => n + s.signals, 0), categories: 6, clues: 30, finalClues: 1, evidenceItems: items.size,
    claimEntries: provenance.items.reduce((sum, item) => sum + item.claims.length, 0) };
  assert(totals.nodes >= 22 && totals.choices >= 66 && totals.outcomes >= 12);
  return { status: 'pass', totals, scenarios, sourceSha256: provenance.source.sha256, sourceContactsChecked,
    scope: 'Contract, exact-depth graphs, reading budgets, exclusions, all visible availability mentions, evidence hashes, and same-offering exact text locations. These checks do not prove natural speech or source entailment. Citations refer to the supplied compilation, not independently fetched live pages.' };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  const sourceIndex = args.indexOf('--source');
  const source = sourceIndex >= 0 ? readFileSync(args[sourceIndex + 1], 'utf8') : undefined;
  const provenance = JSON.parse(readFileSync(new URL('../content-authoring/fsi-provenance.json', import.meta.url), 'utf8'));
  console.log(JSON.stringify(checkContent(fsiPack, provenance, source), null, 2));
}
