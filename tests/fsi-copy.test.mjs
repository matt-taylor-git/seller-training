import { test } from 'node:test';
import assert from 'node:assert/strict';
import fsi from '../prototype/seller-ai-training/packs/fsi.mjs';

const serviceNames = [
  'Private AI Launch Workshop', 'Private AI Factory', 'AI Factory Accelerator', 'NVIDIA AI Enterprise',
  'AI Readiness Data Quality Assessment', 'Modern Data Platform for AI', 'Data Governance for AI',
  'AI Risk Assessment', 'AI LLM Penetration Testing', 'Security from AI', 'AI Assistants',
  'M365 Copilot Deployment Accelerator', 'NVIDIA GPU Cluster Assessment', 'FirstTouch AI',
  'FinOps for AI', 'AI Value Assurance', 'AI @ Morgan Stanley Debrief'
];
const metadata = new Set(['id', 'initials', 'start', 'next']);

export function visibleCopy(pack) {
  const fields = [];
  function visit(value, path = '') {
    if (Array.isArray(value)) value.forEach((item, index) => visit(item, `${path}[${index}]`));
    else if (value && typeof value === 'object') {
      for (const [key, item] of Object.entries(value)) {
        if (metadata.has(key) || key === 'q' && path.includes('.nodes.')) continue;
        visit(item, path ? `${path}.${key}` : key);
      }
    } else if (typeof value === 'string') {
      if (path.endsWith('.c')) {
        const signals = [...value.matchAll(/\[\[(.+?)\|(\w+)\|(.+?)\]\]/g)];
        fields.push({ path, text: value.replace(/\[\[(.+?)\|\w+\|.+?\]\]/g, '$1') });
        signals.forEach((signal, index) => fields.push({ path: `${path}.signal[${index}].explanation`, text: signal[3] }));
      } else fields.push({ path, text: value });
    }
  }
  visit(pack);
  return fields;
}

export function checkPlainCopy(pack) {
  const fields = visibleCopy(pack);
  for (const { path, text } of fields) {
    const withoutNames = serviceNames.reduce((copy, name) => copy.replaceAll(name, ''), text);
    assert(!/\b(?:AI|GPU|LLM|FSI|UK)\b/.test(withoutNames), `Unexplained shorthand in ${path}.`);
    assert(!/\b(?:pilot|workload|corpus|latency|residency|agentic|turnkey|cohort|demo|baseline|grounding)\b/i.test(withoutNames), `Unexplained jargon in ${path}.`);
    assert(!/[/→⇒+]|[\u2013\u2014]/.test(text), `Symbol shorthand in ${path}.`);
    const identity = path === 'label' || /\.persona\.(?:name|role|company|industry)$/.test(path);
    if (!identity) assert(/[.!?]$/.test(text), `Complete sentence required in ${path}.`);
  }
  for (const scenario of pack.roleplay.scenarios) {
    for (const node of Object.values(scenario.nodes)) {
      for (const choice of node.ch) {
        const sentences = [...choice.fb.matchAll(/[^.!?]+[.!?]+/g)];
        assert(sentences.length >= 1 && sentences.length <= 2, 'Each choice gets 1 or 2 coaching sentences.');
      }
    }
  }
  for (const category of pack.jeopardy.categories) {
    for (const clue of category.clues) assert(clue.a.length <= 110, 'Regular answers must fit the fallback-font character budget.');
  }
  for (const clue of [...pack.jeopardy.categories.flatMap(category => category.clues), pack.jeopardy.final]) {
    const sentences = [...clue.why.matchAll(/[^.!?]+[.!?]+/g)];
    assert(sentences.length >= 1 && sentences.length <= 2, 'Each quiz clue gets 1 or 2 coaching sentences.');
  }
  return fields;
}

test('Every financial-services field follows the approved plain-language rules.', () => checkPlainCopy(fsi));

for (const [name, copy] of Object.entries({
  shorthand: 'Ask about AI before the trial.',
  jargon: 'Qualify the workload before buying equipment.',
  symbols: 'Ask security/finance to join.',
  fragment: 'The next meeting'
})) {
  test(`Plain-language checks reject ${name}.`, () => {
    const pack = structuredClone(fsi);
    pack.roleplay.scenarios[0].mission = copy;
    assert.throws(() => checkPlainCopy(pack));
  });
}

test('Plain-language checks reject an oversized answer and excessive coaching.', () => {
  const pack = structuredClone(fsi);
  pack.jeopardy.categories[0].clues[0].a = 'Long answer. '.repeat(10);
  assert.throws(() => checkPlainCopy(pack));
  pack.jeopardy.categories[0].clues[0].a = fsi.jeopardy.categories[0].clues[0].a;
  pack.roleplay.scenarios[0].nodes.b1.ch[0].fb = 'First sentence. Second sentence. Third sentence.';
  assert.throws(() => checkPlainCopy(pack));
});

const answerMeaning = [
  [/redoing document work/, /where it happens/, /what goes wrong/],
  [/why the trials stopped/, /useful job/, /sponsor/, /owner for live business use/],
  [/tools are chosen/, /rarely used/, /access/, /training/, /review work/],
  [/sponsor and budget/, /Security approval/, /owner for approved data/],
  [/repeated questions/, /supported system/, /FirstTouch AI.*Do not promise it can issue refunds/],
  [/sorting documents/, /copying details/, /people review/, /handle problems/],
  [/approved documents/, /owner/, /access rules/],
  [/client consent/, /advisor review/, /without approval/],
  [/Document help is suggested/, /Payments by artificial intelligence agents are emerging/, /Check each separately/],
  [/Separate search/, /fraud prediction/, /limited actions/, /data, speed, accuracy, and authority/],
  [/Private AI Launch Workshop/, /needs exploring/, /who must join/],
  [/Start with AI Readiness Data Quality Assessment/],
  [/AI Risk Assessment/, /AI LLM Penetration Testing/, /before customer launch/],
  [/M365 Copilot Deployment Accelerator/, /Copilot Adoption and Change Management/, /up to 50 users/],
  [/3 are not available yet/, /current assessments/, /catalog lists implementation for ServiceNow only/],
  [/invented answer/, /against the source/, /review rules/, /handles errors/],
  [/consent rules before collecting/, /not consent or advisor approval/],
  [/design workshop/, /Build the solution afterward/],
  [/does not prove compliance or security/, /not approval or future safety/],
  [/55 percent counts uses/, /some automatic decisions/, /not firms/, /2 percent of uses were fully automatic/],
  [/system choice first/, /does not fit customers who have not chosen/],
  [/does not qualify/, /approved existing system/, /existing NVIDIA AI Enterprise subscription/],
  [/NVIDIA GPU Cluster Assessment/, /existing system/, /current service coverage/],
  [/each job/, /data location/, /response speed/, /software choice/, /total cost/],
  [/NVIDIA design with limited data/, /not the whole archive/, /approval for live business use/],
  [/before the trial/, /what to measure/, /continuing or stopping/, /Agree with the owner/],
  [/total time including review/, /corrections/, /actual use/, /consent and advisor approval/],
  [/32 percent counts respondents/, /not a financial return/, /customer guarantee/],
  [/AI Value Assurance is not available yet/, /starting measures/, /current assessments or Accelerator results/],
  [/Stop or change/, /quality and cost limits/, /Do not remove review/],
  [/Sort incoming documents with human review/, /Delays and conflicting numbers/, /AI Readiness Data Quality Assessment/, /compliance, security, and finance owners/, /guarantees neither approval nor savings/]
];
const clues = [...fsi.jeopardy.categories.flatMap(category => category.clues), fsi.jeopardy.final];
for (const [index, meaning] of answerMeaning.entries()) {
  test(`Quiz answer ${index + 1} keeps its reviewed meaning and position.`, () => {
    for (const phrase of meaning) assert.match(clues[index].a, phrase);
  });
}
