import { test } from 'node:test';
import assert from 'node:assert/strict';
import fsi from '../prototype/seller-ai-training/packs/fsi.mjs';

const [bank, insurance, wealth, payments] = fsi.roleplay.scenarios;
const spoken = text => text.replace(/\[\[([^|]+)\|[^|]+\|[^\]]+\]\]/g, '$1');
const ideal = node => node.ch.find(choice => choice.q === 'best');

test('The bank opens on a procedure disagreement, not equipment or a service quiz.', () => {
  const opening = spoken(bank.nodes.counter.c);
  assert.match(opening, /changing a customer's address/);
  assert.match(opening, /different answers/);
  assert.match(ideal(bank.nodes.counter).t, /What did those two branches look at/);
  assert.doesNotMatch(JSON.stringify(bank), /GPU|Kubernetes|Factory Accelerator/);
});

test('Both bank second turns reveal all three sources before asking about document authority.', () => {
  for (const id of ['folders', 'reset']) {
    const line = spoken(bank.nodes[id].c);
    for (const source of ['staff site', 'PDF', 'branch chat']) assert(line.includes(source));
    assert.match(ideal(bank.nodes[id]).t, /Who decides which version/);
  }
  const authority = spoken(bank.nodes.authority.c);
  assert.match(authority, /haven't counted the calls or timed the searches yet/);
  assert.match(authority, /operations team owns the staff site/);
  assert.match(bank.nodes.folders.ch.find(choice => choice.q === 'good').t, /How long/);
  assert.match(bank.nodes.reset.ch.find(choice => choice.q === 'good').t, /counting how often/);
  for (const id of ['folders', 'reset']) for (const choice of bank.nodes[id].ch) assert.equal(choice.next, 'authority');
});

test('Insurance establishes actual returned work only after discovering the missing estimate.', () => {
  for (const id of ['handoff', 'pushback']) {
    const line = spoken(insurance.nodes[id].c);
    assert.match(line, /address and loss date/);
    assert.match(line, /repair estimate/);
    assert.match(ideal(insurance.nodes[id]).t, /Who notices/i);
  }
  assert.match(spoken(insurance.nodes.missing.c), /sends it back to the coordinator/);
  assert.match(ideal(insurance.nodes.missing).t, /required documents before assignment/);
});

test('Insurance does not turn quicker checks into faster claim resolution.', () => {
  assert.match(spoken(insurance.nodes.measure.c), /claims still took just as long/);
  assert.match(ideal(insurance.nodes.measure).t, /checking and corrections separately from waiting/);
  const premature = insurance.nodes.measure.ch.find(choice => choice.q === 'bad');
  assert.match(premature.t, /roll the quicker checks out.*claims should start finishing sooner/);
  assert.match(premature.fb, /has not reduced total claim time/);
  assert.match(premature.fb, /does not prove the wait for estimates will shrink/);
  const clue = fsi.jeopardy.categories[5].clues[4];
  assert.match(clue.q, /total resolution time is unchanged/);
  assert.match(clue.a, /Faster claim resolution is not yet shown/);
});

test('Wealth names the chosen product and its purpose before asking about the work.', () => {
  const opening = spoken(wealth.nodes.evenings.c);
  assert.match(opening, /Microsoft 365 Copilot to help with notes after client meetings/);
  assert.match(opening, /finishing those notes at home/);
  assert.match(ideal(wealth.nodes.evenings).t, /between the end of a meeting and a note/);
});

test('Wealth reveals corrections and recording concerns before asking for a review plan.', () => {
  const line = spoken(wealth.nodes.corrections.c);
  assert.match(line, /fixing who promised/);
  assert.match(line, /clients don't want a recording/);
  assert.match(ideal(wealth.nodes.corrections).t, /non-recording route/);
  assert.match(ideal(wealth.nodes.corrections).t, /check actions before saving notes or sending follow-up/);
  const consentError = wealth.nodes.corrections.ch.find(choice => choice.q === 'bad');
  assert.match(consentError.t, /firm has approved the tool.*cover recording/);
  assert.match(consentError.fb, /Tool approval is not client consent/);
  for (const choice of wealth.nodes.corrections.ch) assert.equal(choice.next, 'habits');
  const habits = spoken(wealth.nodes.habits.c);
  assert.match(habits, /won't ask clients to record against their wishes/);
  assert.match(habits, /advisors still need to check the notes/);
  assert.match(habits, /Others open a draft, see the corrections/);
  assert.match(ideal(wealth.nodes.habits).t, /current scope fits/);
});

test('Payments discovers the chosen phone system before qualifying FirstTouch AI.', () => {
  assert.doesNotMatch(spoken(payments.nodes.repeat.c), /FirstTouch|Five9|recommend/);
  assert.match(ideal(payments.nodes.repeat).t, /Which phone system/);
  assert.match(ideal(payments.nodes.repeat).t, /what information reaches/);
  assert.match(spoken(payments.nodes.transfer.c), /Five9/);
  assert.match(spoken(payments.nodes.transfer.c), /not the reason/);
  assert.match(ideal(payments.nodes.transfer).t, /confirm this handoff fits/);
});

test('Payments distinguishes technical completion from useful transfer evidence.', () => {
  const premature = payments.nodes.compare.ch.find(choice => choice.q === 'bad');
  assert.match(premature.t, /automated openings finish without a technical error/);
  assert.match(premature.t, /completion rate would show the transfer is working/);
  assert.match(premature.fb, /does not show whether useful details reached staff/);
  assert.match(ideal(payments.nodes.compare).t, /repeated questions, missing details, and staff checking time/);
});

test('The FirstTouch clue teaches its prerequisites before asking the learner to apply them.', () => {
  const clue = fsi.jeopardy.categories[2].clues[4];
  assert.match(clue.q, /FirstTouch AI covers the first minute of customer calls/);
  assert.match(clue.q, /requires a chosen, supported phone system/);
  assert.match(clue.q, /hasn't chosen one/);
  assert.match(clue.a, /Settle the platform choice and confirm current service fit/);
});

test('The adoption clue accepts work-specific support without requiring catalog recall.', () => {
  const clue = fsi.jeopardy.categories[4].clues[2];
  assert.match(clue.q, /training skipped how to review meeting notes/);
  assert.match(clue.a, /work-specific training and support for reviewing meeting notes/);
  assert.doesNotMatch(clue.q + clue.a, /Copilot Adoption and Change Management/);
  assert.match(clue.why, /Copilot Adoption and Change Management may fit.*subject to current scope/);
});

test('The procedure clue names search software when explaining document authority.', () => {
  const clue = fsi.jeopardy.categories[2].clues[1];
  assert.match(clue.q, /two versions.*conflicting instructions/);
  assert.match(clue.a, /Which version is approved, and who can decide/);
  assert.match(clue.why, /Search software cannot settle document authority/);
});

test('The copying and board clues reject diagnoses that their facts do not establish.', () => {
  const copying = fsi.jeopardy.categories[0].clues[0];
  assert.match(copying.q, /copy loss dates from forms into a claims system/);
  assert.match(copying.a, /not proven rework/);
  const board = fsi.jeopardy.categories[0].clues[3];
  assert.match(board.q, /nobody has agreed to own it/);
  assert.match(board.a, /not a confirmed sponsor/);
});

test('The time-comparison clue states every number needed for its answer.', () => {
  const clue = fsi.jeopardy.categories[5].clues[1];
  for (const number of ['3 minutes', '12 to check', '10 minutes total']) assert(clue.q.includes(number));
  assert.match(clue.a, /15 minutes.*5 minutes longer/);
});

test('Final supplies a real handoff problem without requiring a role-play or earlier clue.', () => {
  const final = fsi.jeopardy.final;
  for (const premise of ['copy loss dates from emails', 'Adjusters return files', 'repair estimates are missing', 'nobody has measured']) assert(final.q.includes(premise));
  assert.match(final.a, /checking for missing estimates before assignment/);
  assert.match(final.a, /coordinator and adjuster leads/);
  assert.match(final.a, /checking and correction time.*total resolution time/);
});
