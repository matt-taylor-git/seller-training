import { test } from 'node:test';
import assert from 'node:assert/strict';
import fsi from '../prototype/seller-ai-training/packs/fsi.mjs';

const [bank, insurance, wealth, payments] = fsi.roleplay.scenarios;
const spoken = text => text.replace(/\[\[(.+?)\|\w+\|.+?\]\]/g, '$1');

test('Wealth introduces Microsoft 365 Copilot and meeting notes before discussing low use.', () => {
  const opening = spoken(wealth.nodes.w1.c);
  assert.match(opening, /Microsoft 365 Copilot/);
  assert.match(opening, /(?:client meeting|meeting notes)/);
  assert.match(opening, /50 minutes/);
  assert.match(opening, /20 percent/);
  assert(opening.indexOf('Microsoft 365 Copilot') < opening.indexOf('20 percent'));
});

test('Payments opens with repeated dispute details and investigates the phone handoff, not a product quiz.', () => {
  const opening = spoken(payments.nodes.p1.c);
  assert.match(opening, /(?:repeat|twice)/);
  assert.match(opening, /dispute/);
  assert.match(opening, /(?:phone|call)/);
  assert.doesNotMatch(opening, /FirstTouch|recommend|what do you need to know/i);
  assert.match(payments.nodes.p1.ch[0].t, /Which phone system/);
  assert.match(payments.nodes.p1.ch[0].t, /(?:information|details).*(?:see|receive)/);
});

test('Reported seller options are replies to the customer rather than directions to the learner.', () => {
  assert.match(wealth.nodes.w1.ch[0].t, /Could you walk me through/);
  assert.match(wealth.nodes.w1.ch[1].t, /I.*recommend.*licenses/);
  assert.match(wealth.nodes.w1.ch[2].t, /I.*show.*advisors/);
  assert.match(insurance.nodes.i2.ch[0].t, /(?:Could we|Let.s).*sample/);
  assert.match(bank.nodes.b6.ch[2].t, /(?:We can|I can).*90/);
  assert.match(payments.nodes.p4.ch[1].t, /(?:We can|I can).*cost per call/);
});

test('Measure-before-test clue names the staff, copying task, source, and destination without inventing a queue.', () => {
  const clue = fsi.jeopardy.categories[5].clues[0];
  assert.match(clue.q, /Claims staff/);
  assert.match(clue.q, /copy.*(?:claim|reference) numbers/);
  assert.match(clue.q, /scanned forms/);
  assert.match(clue.q, /claims system/);
  assert.match(clue.q, /before.*(?:test|trial)/);
  assert.match(clue.a, /before the (?:test|trial)/);
  assert.match(clue.why, /copying/);
  assert.doesNotMatch(clue.why, /queue/);
});
