import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import fsi from '../prototype/seller-ai-training/packs/fsi.mjs';
import { checkContent } from '../scripts/check-content.mjs';

const provenance = JSON.parse(readFileSync(new URL('../content-authoring/fsi-provenance.json', import.meta.url), 'utf8'));
const atPath = (value, path) => path.replace(/\[(\d+)\]/g, '.$1').split('.').reduce((part, key) => part[key], value);
function fixture(mutate = () => {}) {
  const pack = structuredClone(fsi);
  const evidence = structuredClone(provenance);
  mutate(pack, evidence);
  for (const item of evidence.items) {
    const scenarioId = item.locator.match(/\[id=([^\]]+)\]/)?.[1];
    const content = scenarioId ? pack.roleplay.scenarios.find(scenario => scenario.id === scenarioId) : atPath(pack, item.locator);
    item.contentSha256 = createHash('sha256').update(JSON.stringify(content)).digest('hex');
  }
  return [pack, evidence];
}

test('Fresh hashes isolate boundary checks from the parent editorial changes.', () => {
  assert.equal(checkContent(...fixture()).status, 'pass');
});

test('Fresh-hash counterexample rejects an unavailable offering headline.', () => {
  const inputs = fixture(pack => {
    pack.roleplay.scenarios[0].offering.headline = 'Agents & Workflow Automation is available today.';
  });
  assert.throws(() => checkContent(...inputs), /Unavailable offering/);
});

test('Fresh-hash counterexample rejects unrelated ancestor offering evidence.', () => {
  const inputs = fixture((_pack, evidence) => {
    const claims = evidence.items[2].claims;
    claims.find(claim => claim.claim.startsWith('Copilot Adoption')).kind = 'authored-recommendation';
    claims.find(claim => claim.claim.includes('fully autonomous advice')).locations.push('nodes', 'offering');
  });
  assert.throws(() => checkContent(...inputs), /Unmapped offering|Offering metadata requires a source claim/);
});

const visibleLocations = [
  'label', 'description', 'disclaimer',
  ...['title', 'mission', 'persona.name', 'persona.initials', 'persona.role', 'persona.company', 'persona.industry', 'persona.size', 'persona.quote',
    'persona.goals[0]', 'persona.personality[0]', 'persona.pains[0]', 'nodes.counter.c', 'nodes.counter.ch[0].t', 'nodes.counter.ch[0].fb',
    'nodes.counter.ch[1].t', 'nodes.counter.ch[1].fb', 'nodes.counter.ch[2].t', 'nodes.counter.ch[2].fb',
    'outcomes.great.title', 'outcomes.great.text', 'outcomes.ok.title', 'outcomes.ok.text', 'outcomes.poor.title', 'outcomes.poor.text',
    'offering.headline', 'offering.steps[0]', 'useCases[0]', 'takeaways[0]'].map(path => `roleplay.scenarios[0].${path}`),
  'jeopardy.categories[0].name', ...['q', 'a', 'why'].map(key => `jeopardy.categories[0].clues[0].${key}`),
  ...['category', 'q', 'a', 'why'].map(key => `jeopardy.final.${key}`)
];
for (const location of visibleLocations) {
  test(`Availability checks cover visible text at ${location}.`, () => {
    const inputs = fixture(pack => {
      const parts = location.replace(/\[(\d+)\]/g, '.$1').split('.');
      const key = parts.pop();
      const parent = parts.reduce((part, key) => part[key], pack);
      parent[key] += ' Use Agents & Workflow Automation today.';
    });
    assert.throws(() => checkContent(...inputs), /Unavailable offering/);
  });
}

for (const name of ['FinOps for AI', 'AI Value Assurance', 'Agents & Workflow Automation', 'Security from AI', 'Hyperscaler AI Foundation', 'AI-Accelerated Engineering', 'Modern Data Ecosystem Design Workshop']) {
  test(`Availability checks reject ${name} outside a corrected misconception.`, () => {
    const inputs = fixture(pack => { pack.description += ` Use ${name} today.`; });
    assert.throws(() => checkContent(...inputs), /Unavailable offering/);
  });
}

for (const text of [
  'Do not delay. Agents & Workflow Automation is available today.',
  'Agents & Workflow Automation is not unavailable. Recommend it today.',
  'Agents & Workflow Automation is unavailable.'
]) {
  test(`Availability does not infer an exception from headline wording: ${text}`, () => {
    const inputs = fixture(pack => { pack.roleplay.scenarios[0].offering.headline = text; });
    assert.throws(() => checkContent(...inputs), /Unavailable offering/);
  });
}

function misconception(pack, evidence) {
  const choice = pack.roleplay.scenarios[0].nodes.counter.ch[0];
  choice.t = 'Use Agents & Workflow Automation today.';
  choice.fb = 'Agents & Workflow Automation is unavailable. Do not recommend it.';
  evidence.items[0].claims.push({ kind: 'source-claim', offering: 'Agents & Workflow Automation', claim: 'Agents & Workflow Automation is Coming Soon.',
    section: '6.E', date: '2026-10-07', caveat: 'The nonideal reply is false and receives immediate correction.', locations: ['nodes.counter.ch[0].t', 'nodes.counter.ch[0].fb'] });
}

test('A nonideal reply can teach unavailable scope only with its explicit paired correction and evidence.', () => {
  assert.equal(checkContent(...fixture(misconception)).status, 'pass');
});
for (const [name, mutate] of Object.entries({
  'unrelated not wording': choice => { choice.fb = 'Do not assume all services are available. Recommend this one.'; },
  'correction for another service': choice => { choice.fb = 'FinOps for AI is unavailable. Do not recommend it.'; },
  'corrective coaching without the misconception': choice => { choice.t = 'Could we ask about the work first?'; },
  'misconception promoted to ideal': (choice, pack) => { choice.q = 'best'; pack.roleplay.scenarios[0].nodes.counter.ch[1].q = 'bad'; }
})) {
  test(`Availability rejects ${name}.`, () => {
    const inputs = fixture((pack, evidence) => { misconception(pack, evidence); mutate(pack.roleplay.scenarios[0].nodes.counter.ch[0], pack); });
    assert.throws(() => checkContent(...inputs), /Unavailable offering/);
  });
}

test('Visible signal explanations cannot recommend unavailable offerings.', () => {
  const inputs = fixture(pack => {
    pack.roleplay.scenarios[0].nodes.counter.c = pack.roleplay.scenarios[0].nodes.counter.c.replace('Staff are giving inconsistent procedure answers.', 'Use Agents & Workflow Automation today.');
  });
  assert.throws(() => checkContent(...inputs), /Unavailable offering/);
});

for (const location of ['constructor', 'persona.constructor', '__proto__', 'nodes.counter.ch[0].t.length', 'takeaways.length', 'id', 'start', 'turns', 'difficulty', 'full', 'nodes.counter.ch[0].next', 'nodes.counter.ch[0].q', 'nodes.counter.ch[0].s', 'nodes.counter.ch[0].s.d']) {
  test(`Evidence rejects inherited or metadata-only location ${location}.`, () => {
    const inputs = fixture((_pack, evidence) => { evidence.items[0].claims[0].locations = [location]; });
    assert.throws(() => checkContent(...inputs), /Claim location must contain visible text|Dangling claim location/);
  });
}

for (const [name, mutate] of Object.entries({
  'missing offering identity': claim => { delete claim.offering; },
  'different offering identity': claim => { claim.offering = 'AI Risk Assessment'; },
  'unknown offering identity': claim => { claim.offering = 'Imaginary Service'; },
  'ancestor object instead of exact text': claim => { claim.locations = ['nodes', 'offering']; },
  'ancestor choice instead of exact text': claim => { claim.locations = ['nodes.habits.ch[2]', 'offering.steps[2]']; },
  'metadata instead of exact text': claim => { claim.locations = ['id']; },
  'fiction instead of source evidence': claim => { claim.kind = 'fictional-fact'; },
  'different text leaves': claim => { claim.locations = ['nodes.usefulness.ch[2].t', 'nodes.usefulness.ch[2].fb']; }
})) {
  test(`Offering evidence rejects ${name}.`, () => {
    const inputs = fixture((_pack, evidence) => { mutate(evidence.items[2].claims.find(claim => claim.claim.startsWith('Copilot Adoption'))); });
    assert.throws(() => checkContent(...inputs), /Unmapped offering|Unknown offering|Offering.*(?:source claim|visible string)|Claim location must contain visible text/);
  });
}

test('An unrelated source claim at the exact leaf cannot cover a different offering.', () => {
  const inputs = fixture((_pack, evidence) => {
    const claims = evidence.items[2].claims;
    const adoption = claims.find(claim => claim.claim.startsWith('Copilot Adoption'));
    delete adoption.offering;
    adoption.kind = 'authored-recommendation';
    claims.find(claim => claim.claim.includes('fully autonomous advice')).locations.push(...adoption.locations);
  });
  assert.throws(() => checkContent(...inputs), /Unmapped offering/);
});

test('Unrelated ancestor evidence cannot cover an offering after its source metadata is removed.', () => {
  const inputs = fixture((_pack, evidence) => {
    const claims = evidence.items[2].claims;
    const adoption = claims.find(claim => claim.claim.startsWith('Copilot Adoption'));
    delete adoption.offering;
    adoption.kind = 'authored-recommendation';
    claims.find(claim => claim.claim.includes('fully autonomous advice')).locations.push('nodes', 'offering');
  });
  assert.throws(() => checkContent(...inputs), /Unmapped offering/);
});

test('Mentioning an offering in unrelated claim prose does not supply offering identity.', () => {
  const inputs = fixture((_pack, evidence) => {
    const claims = evidence.items[2].claims;
    const adoption = claims.find(claim => claim.claim.startsWith('Copilot Adoption'));
    delete adoption.offering;
    adoption.kind = 'authored-recommendation';
    const unrelated = claims.find(claim => claim.claim.includes('fully autonomous advice'));
    unrelated.claim += ' Copilot Adoption and Change Management.';
    unrelated.locations.push(...adoption.locations);
  });
  assert.throws(() => checkContent(...inputs), /Unmapped offering/);
});

test('Offering detection does not depend on capitalization.', () => {
  const inputs = fixture(pack => { pack.description += ' Use agents & workflow automation today.'; });
  assert.throws(() => checkContent(...inputs), /Unavailable offering/);
});

test('Evidence rejects an own function instead of visible text.', () => {
  const inputs = fixture((pack, evidence) => {
    pack.roleplay.scenarios[0].helper = () => 'not rendered';
    evidence.items[0].claims[0].locations = ['helper'];
  });
  assert.throws(() => checkContent(...inputs), /Claim location must contain visible text/);
});

test('Broad fiction and authored recommendations remain valid when they include visible text.', () => {
  const inputs = fixture((_pack, evidence) => {
    evidence.items[0].claims[0].locations = ['persona', 'nodes', 'outcomes'];
    evidence.items[0].claims[1].locations = ['nodes', 'offering'];
  });
  assert.equal(checkContent(...inputs).status, 'pass');
});

test('Rendered signals cannot hide an unavailable offering name.', () => {
  const inputs = fixture(pack => {
    pack.roleplay.scenarios[0].nodes.counter.c = 'Use Agents & [[Workflow Automation|ready|This service is available today.]] today.';
  });
  assert.throws(() => checkContent(...inputs), /Unavailable offering/);
});

test('Rendered signals cannot hide an offering from its evidence requirement.', () => {
  const inputs = fixture(pack => {
    pack.roleplay.scenarios[0].nodes.counter.c = 'We might use First[[Touch|ready|A service to consider.]] AI.';
  });
  assert.throws(() => checkContent(...inputs), /Unmapped offering/);
});

test('Rendered offering mentions keep the original dialogue leaf for evidence.', () => {
  const inputs = fixture((pack, evidence) => {
    pack.roleplay.scenarios[0].nodes.counter.c = 'We might use First[[Touch|ready|A service to consider.]] AI.';
    evidence.items[0].claims.push({ kind: 'source-claim', offering: 'FirstTouch AI', claim: 'FirstTouch AI covers the first minute of contact.',
      section: '6.F', date: '2026-10-07', caveat: 'Check current scope and platform support.', locations: ['nodes.counter.c'] });
  });
  assert.equal(checkContent(...inputs).status, 'pass');
});

test('Headings remain labels without full-sentence punctuation.', () => {
  const inputs = fixture(pack => { pack.roleplay.scenarios[0].offering.headline = 'Check the documents'; });
  assert.equal(checkContent(...inputs).status, 'pass');
});
