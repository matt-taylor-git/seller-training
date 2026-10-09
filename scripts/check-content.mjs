import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import fsiPack from '../prototype/seller-ai-training/packs/fsi.mjs';
import { validatePack } from '../prototype/seller-ai-training/shared/pack-contract.mjs';

export const categoryNames = ['Listen for the signal', 'Match the workflow', 'Choose the CDW play', 'Data and risk', 'Qualify the workload', 'Prove the value'];
const expansions = { AI: 'artificial intelligence', GPU: 'graphics processing unit', LLM: 'large language model', M365: 'Microsoft 365', AWS: 'Amazon Web Services', FinOps: 'financial operations' };
const unavailable = ['FinOps for AI', 'AI Value Assurance', 'Agents & Workflow Automation', 'Security from AI', 'Hyperscaler AI Foundation', 'AI-Accelerated Engineering', 'Modern Data Ecosystem Design Workshop'];
const digest = value => createHash('sha256').update(value).digest('hex');
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const sentence = value => assert(/[.!?]$/.test(value.replace(/\[\[([^|]+)\|[^|]+\|[^\]]+\]\]/g, '$1')), `Complete sentence required: ${value}`);

export function checkContent(pack, provenance, source) {
  validatePack(pack);
  assert.equal(pack.id, 'fsi');
  assert.equal(pack.revision, 1);
  assert.equal(pack.label, 'FSI');
  assert.equal(pack.roleplay.scenarios.length, 4);
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
    assert(item.claims.every(claim => claim.locations?.length), 'Scenario material claims need locations.');
    for (const claim of item.claims) {
      for (const location of claim.locations) {
        let value = scenario;
        for (const part of location.replace(/\[(\d+)\]/g, '.$1').split('.')) value = value?.[part];
        assert(value !== undefined, `Dangling claim location: ${scenario.id}.${location}`);
      }
    }
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
        if (choice.q === 'best') {
          for (const play of unavailable) assert(!choice.t.includes(play), `Unavailable ideal offering: ${play}`);
        } else {
          for (const play of unavailable) {
            if (choice.t.includes(play)) assert(/Coming Soon|under construction|unavailable|not.*available/i.test(choice.fb), `Availability correction required: ${play}`);
          }
        }
      }
    }
    for (const step of scenario.offering.steps) {
      sentence(step);
      for (const play of unavailable) assert(!step.includes(play), `Unavailable offered play: ${play}`);
    }
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
      assert(items.has(`jeopardy.categories[${categoryIndex}].clues[${clueIndex}]`), 'Missing clue evidence.');
      for (const value of Object.values(clue)) sentence(value);
    }
  }
  assert(items.has('jeopardy.final'), 'Final evidence required.');
  for (const clue of [...pack.jeopardy.categories.flatMap(category => category.clues), pack.jeopardy.final]) {
    for (const [abbreviation, expansion] of Object.entries(expansions)) {
      if (new RegExp(`\\b${abbreviation}\\b`).test(clue.why)) assert(clue.why.toLowerCase().includes(expansion.toLowerCase()), `Expand ${abbreviation} locally.`);
    }
  }
  assert(!/\bUK\b/.test(pack.jeopardy.categories[3].clues[4].q + pack.jeopardy.categories[3].clues[4].why));
  const totals = { scenarios: scenarios.length, nodes: scenarios.reduce((n, s) => n + s.nodes, 0), choices: scenarios.reduce((n, s) => n + s.choices, 0), outcomes: scenarios.reduce((n, s) => n + s.outcomes, 0),
    takeaways: scenarios.reduce((n, s) => n + s.takeaways, 0), signals: scenarios.reduce((n, s) => n + s.signals, 0), categories: 6, clues: 30, finalClues: 1, evidenceItems: items.size,
    claimEntries: provenance.items.reduce((sum, item) => sum + item.claims.length, 0) };
  assert(totals.nodes >= 22 && totals.choices >= 66 && totals.outcomes >= 12);
  assert(totals.claimEntries >= 56, 'Keep all reviewed material claims.');
  return { status: 'pass', totals, scenarios, sourceSha256: provenance.source.sha256, sourceContactsChecked,
    scope: 'Contract, terminating graphs, copy, exclusions, and evidence coverage. Source citations refer to the supplied compilation, not independently fetched live pages.' };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  const sourceIndex = args.indexOf('--source');
  const source = sourceIndex >= 0 ? readFileSync(args[sourceIndex + 1], 'utf8') : undefined;
  const provenance = JSON.parse(readFileSync(new URL('../content-authoring/fsi-provenance.json', import.meta.url), 'utf8'));
  console.log(JSON.stringify(checkContent(fsiPack, provenance, source), null, 2));
}
