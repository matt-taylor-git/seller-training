import { test } from 'node:test';
import assert from 'node:assert/strict';
import fsi from '../prototype/seller-ai-training/packs/fsi.mjs';

const reviewedOrder = [
  {
    steps: [/^Agree what Private AI Launch Workshop/, /^Use AI Readiness Data Quality Assessment/, /^Consider AI Risk Assessment.*model-risk team/, /^For AI Factory Accelerator.*NVIDIA DGX.*NVIDIA graphics processing units.*existing NVIDIA AI Enterprise subscription/, /^If existing graphics processing units use Kubernetes/, /^Use a small working test.*separate decision about letting staff rely on policy search/],
    takeaways: [/^Ask why a trial stopped/, /^Name the person who owns the policy documents separately from the person responsible for running policy search/, /^Bring security and finance/, /^Choose where each job runs/, /^An AI Factory Accelerator test provides evidence, not approval for staff to rely on policy search/]
  },
  {
    steps: [/^Provide scores showing readiness.*business case summary.*plan in priority order.*briefing for decision makers/, /^If access, data history, or ownership needs work/, /^Consider Data Quality and Remediation.*Modern Data Platform for AI only after/, /^Check whether AI Risk Assessment fits/, /^For software that generates answers for customers/, /^Plan any later trial separately/],
    takeaways: [/^Help with incoming documents does not mean/, /^Test the difficult documents/, /^State who reviews results/, /^Correct a claim you cannot support/, /^A risk assessment reviews risks/]
  },
  {
    steps: [/^Confirm the chosen tools/, /^Consider M365 Copilot Deployment Accelerator.*up to 50 users/, /^Consider Copilot Adoption and Change Management/, /^Plan any connection that collects meeting information separately/, /^Keep client consent and advisor approval/],
    takeaways: [/^If few people use a tool/, /^Client consent and advisor approval are separate/, /^A company's public example/, /^Measure total time including review/, /^Do not sell services that are not available yet\. Do not promise investment advice without advisor approval\.$/]
  },
  {
    steps: [/^Confirm the chosen system\./, /^Confirm what FirstTouch AI currently covers/, /^Agree on identity checks/, /^Use Contact Center Strategic Consulting/, /^Before expanding, measure/],
    takeaways: [/^Serving an industry does not prove/, /^FirstTouch AI covers first contact/, /^Payments by artificial intelligence agents are emerging\..*agents can take actions for someone/, /^Measure identity checks/, /^A successful trial of one job does not approve/]
  }
];

for (const [index, expected] of reviewedOrder.entries()) {
  const scenario = fsi.roleplay.scenarios[index];
  for (const [name, patterns] of Object.entries(expected)) {
    const entries = name === 'steps' ? scenario.offering.steps : scenario.takeaways;
    const check = copy => {
      assert.equal(copy.length, patterns.length);
      for (const [position, pattern] of patterns.entries()) assert.match(copy[position], pattern);
    };
    test(`${scenario.id} keeps the reviewed ${name} in order and rejects every pair swap.`, () => {
      check(entries);
      for (let left = 0; left < entries.length; left++) {
        for (let right = left + 1; right < entries.length; right++) {
          const swapped = [...entries];
          [swapped[left], swapped[right]] = [swapped[right], swapped[left]];
          assert.throws(() => check(swapped), `${name} swap ${left} and ${right} must fail.`);
        }
      }
    });
  }
}

test('Reviewed copy spells out percentages and leaves M365 only in the official offering name.', () => {
  const copy = JSON.stringify(fsi).replaceAll('M365 Copilot Deployment Accelerator', '');
  assert(!/%|\bM365\b/.test(copy));
  assert(!/daily use|time after review|automatic payments are emerging|software-driven payments/i.test(copy));
});

test('The 11 reviewed option lists stay inside complete questions.', () => {
  const locations = [[0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2], [2, 3], [3, 0], [5, 0]];
  for (const [category, row] of locations) {
    const question = fsi.jeopardy.categories[category].clues[row].q;
    assert.match(question, /(?:Should you|Does the published Morgan Stanley Debrief example).*\?$/);
    assert.equal((question.match(/\?/g) || []).length, 1);
  }
});

test('Bank eligibility and risk review retain their specific requirements.', () => {
  const bank = fsi.roleplay.scenarios[0];
  assert.match(bank.nodes.b3.ch[0].t, /security, finance, and your model-risk team/);
  assert.match(bank.nodes.b3.ch[0].t, /Finance would check running costs while your model-risk team checks whether the software gives reliable answers for lending staff/);
  assert.match(bank.nodes.b3.ch[0].fb, /Security checks data protection, the model-risk team checks model reliability and suitability, and finance checks costs/);
  assert.match(bank.nodes.b5.ch[0].fb, /existing NVIDIA DGX or approved manufacturer system with NVIDIA graphics processing units, plus an existing NVIDIA AI Enterprise subscription/);
  assert.match(bank.nodes.b6.ch[0].t, /That isn't approval for staff to rely on it/);
  assert.match(bank.outcomes.great.text, /does not approve staff relying on policy search or imply regulatory approval/);
});

test('Payments coaching limits the refund claim to FirstTouch AI and keeps agent payments distinct.', () => {
  const payments = fsi.roleplay.scenarios[3];
  assert.match(payments.nodes.p3.c, /Agents are software that can take actions for someone/);
  assert.match(payments.nodes.p3.ch[0].t, /Payments by agents still raise questions about consent, who covers losses, fraud, and proving which agent is acting/);
  assert.match(payments.nodes.p3.ch[0].t, /can't promise FirstTouch AI can issue refunds without a person/);
  assert.match(payments.nodes.p3.ch[0].fb, /payments by artificial intelligence agents/);
  assert.match(payments.nodes.p3.ch[0].fb, /emerging without evidence of widespread use.*source does not show refunds without people for FirstTouch AI/);
});
