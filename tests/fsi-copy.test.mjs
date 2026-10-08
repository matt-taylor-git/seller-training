import { test } from 'node:test';
import assert from 'node:assert/strict';
import fsi from '../prototype/seller-ai-training/packs/fsi.mjs';

const officialNames = ['Private AI Launch Workshop', 'AI Readiness Data Quality Assessment', 'AI Risk Assessment', 'Copilot Adoption and Change Management', 'Microsoft 365 Copilot', 'FirstTouch AI'];
const spoken = text => text.replace(/\[\[([^|]+)\|[^|]+\|[^\]]+\]\]/g, '$1');
const sentences = text => (text.match(/[^.!?]+[.!?]+/g) || []).length;
const words = text => text.trim().split(/\s+/).length;

function checkCopy(pack) {
  const prose = [];
  for (const scenario of pack.roleplay.scenarios) {
    prose.push(scenario.mission, scenario.persona.quote, ...scenario.persona.goals, ...scenario.persona.personality, ...scenario.persona.pains, ...scenario.useCases, ...scenario.offering.steps, ...scenario.takeaways, ...Object.values(scenario.outcomes).map(outcome => outcome.text));
    for (const node of Object.values(scenario.nodes)) {
      prose.push(spoken(node.c), ...[...node.c.matchAll(/\[\[([^|]+)\|[^|]+\|([^\]]+)\]\]/g)].map(match => match[2]));
      for (const choice of node.ch) {
        prose.push(choice.t, choice.fb);
        assert(sentences(choice.fb) >= 1 && sentences(choice.fb) <= 2, 'Coaching uses 1 or 2 sentences.');
        assert(words(choice.t) <= 45, 'Keep spoken replies short enough for the existing choice panel.');
      }
    }
  }
  for (const category of pack.jeopardy.categories) {
    assert(category.name.length <= 22, 'Short category labels fit the board.');
    for (const clue of category.clues) {
      assert(clue.a.length <= 110, 'Keep the regular answer character budget.');
      assert(words(clue.a) <= 25 && words(clue.why) <= 40);
      assert(words(clue.q) >= 15 && words(clue.q) <= 40, 'Questions provide a short independent situation.');
    }
  }
  for (const clue of [...pack.jeopardy.categories.flatMap(category => category.clues), pack.jeopardy.final]) {
    prose.push(clue.q, clue.a, clue.why);
    assert(sentences(clue.why) >= 1 && sentences(clue.why) <= 2);
  }
  for (const text of prose) {
    assert(/[.!?]$/.test(text), `Sentence ending required: ${text}`);
    assert(!/[/→⇒+]|[\u2013\u2014]/.test(text), `No symbol shorthand: ${text}`);
    const plain = officialNames.reduce((copy, name) => copy.replaceAll(name, ''), text);
    assert(!/\b(?:AI|GPU|LLM|FSI|UK|M365|CRM|KPI|ROI|RAG)\b/.test(plain), `Unexplained abbreviation: ${text}`);
  }
}

test('Revision 2 preserves reading budgets while allowing short labels and natural speech.', () => checkCopy(fsi));
for (const [name, mutate] of Object.entries({
  'oversized answer': pack => pack.jeopardy.categories[0].clues[0].a = 'Long answer. '.repeat(10),
  'excessive coaching': pack => pack.roleplay.scenarios[0].nodes.counter.ch[0].fb = 'First sentence. Second sentence. Third sentence.',
  'symbol shorthand': pack => pack.roleplay.scenarios[0].mission = 'Ask security/finance to join.',
  'unexplained abbreviation': pack => pack.roleplay.scenarios[0].mission = 'Ask about RAG.',
  'sentence fragment in prose': pack => pack.roleplay.scenarios[0].mission = 'The next meeting'
})) {
  test(`Copy checks reject ${name}.`, () => {
    const pack = structuredClone(fsi); mutate(pack);
    assert.throws(() => checkCopy(pack));
  });
}

test('Labels are labels, and regular questions use open decisions rather than fixed option lists.', () => {
  assert(fsi.roleplay.scenarios.every(scenario => !/[.!?]$/.test(scenario.title)));
  assert(fsi.jeopardy.categories.every(category => !/[.!?]$/.test(category.name)));
  for (const category of fsi.jeopardy.categories) for (const clue of category.clues) assert(clue.q.endsWith('?'));
});
