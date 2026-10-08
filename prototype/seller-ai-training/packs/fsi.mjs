import { deepFreeze } from '../shared/pack-contract.mjs';

/** @type {import('../shared/pack-contract.mjs').ContentPack} */
const fsiPack = {
  id: 'fsi',
  revision: 1,
  label: 'FSI',
  description: 'Practice discovery, workload qualification, and measured value in the financial services industry. Both games use the same FSI pack.',
  disclaimer: 'These are fictional training scenarios. All customer identities, dialogue, and customer metrics are invented. CDW offering descriptions reflect a supplied playbook compiled on 2026-10-07. Confirm current availability, scope, and prerequisites. Training does not establish regulatory approval, guaranteed security, financial returns, or suitability for a customer. Distribution needs a separate approved audience and hosting decision.',
  roleplay: {
    scenarios: [
      {
        id: 'fsi-bank', full: true, difficulty: 3, turns: 7,
        title: 'The bank with stalled pilots',
        persona: {
          name: 'Maya Chen', initials: 'MC', role: 'Chief Information Officer', company: 'Stonebridge Regional Bank', industry: 'Regional banking',
          size: 'This fictional bank has 42 branches and 2,100 employees.',
          quote: 'We have 6 artificial intelligence pilots and no production owner. Buying more hardware is not my answer.',
          goals: ['Give the board a credible artificial intelligence (AI) plan in 90 days.', 'Reduce staff time spent finding current lending procedures.', 'Agree on data ownership and a production decision process.'],
          personality: ['She speaks directly about failed projects.', 'She understands the technology.', 'She will trade speed for a defensible decision.'],
          pains: ['6 stalled pilots lack operational owners.', 'Staff spend an illustrative 35 minutes per day locating lending procedures.', 'Policy versions conflict across business units.', 'Security and finance disagree about the proposed hosting model.']
        },
        mission: 'Qualify one artificial intelligence (AI) workload before infrastructure. Include security, finance, data ownership, and a specific next meeting.',
        start: 'b1',
        nodes: {
          b1: {
            c: 'Our board wants a plan in 90 days. [[We have 6 pilots and none has a production owner.|red|Stalled pilots lack accountable ownership.]] I am not buying another impressive demonstration. What would you ask first?',
            ch: [
              {t: 'Which pilot addressed a business problem worth solving, and what stopped its owner from taking it into production?', q: 'best', s: {d: 12, l: 10, t: 8}, next: 'b2', fb: 'You distinguish a useful workload from a failed delivery process. Find the missing owner or approval before proposing a seventh pilot.'},
              {t: 'Let us inventory the models and hardware behind all 6 pilots before we discuss the business teams.', q: 'meh', s: {d: 3, u: -4, l: -4}, next: 'b2', fb: 'An inventory can help later. Starting with equipment leaves the ownership failure and business priority unexplained.'},
              {t: 'A Private AI Factory would put the pilots under your control. We can start with that design.', q: 'bad', s: {p: -8, t: -8, d: -6}, next: 'b2', fb: 'You name a deployment direction before learning why the pilots stalled. Control requires owners, approved data access, and operating decisions, not just hardware.'}
            ]
          },
          b2: {
            c: 'The useful one was internal policy search. [[Lending staff spend about 35 minutes a day finding the right procedure.|pain|The fictional baseline identifies internal knowledge work.]] It answered from retired documents. [[Each business unit says someone else owns the policy library.|ready|Data ownership and version quality need work.]]',
            ch: [
              {t: 'Let us identify the policy owner, authoritative versions, and access rules. Then we can test search quality and staff time against that baseline.', q: 'best', s: {d: 10, l: 10, u: 12, p: 6}, next: 'b3', fb: 'You match internal knowledge search to a specific failure. Approved content and ownership come before measuring an assistant against the fictional 35-minute baseline.'},
              {t: 'Keep the existing documents and move to a larger model. It may understand which policies are current.', q: 'bad', s: {u: -10, t: -8, p: -6}, next: 'b3', fb: 'Model size does not establish document authority. Conflicting versions can produce convincing wrong answers even with a more capable model.'},
              {t: 'Start by measuring search time for a small staff group. We can resolve the policy ownership question after that.', q: 'good', s: {d: 6, u: 4, p: 2}, next: 'b3', fb: 'A baseline is useful, but no one can approve the test corpus yet. Pair measurement with an owner who can retire or correct misleading material.'}
            ]
          },
          b3: {
            c: 'Our security lead stopped a public-tool experiment after staff pasted in customer information. [[Security will not accept an unknown data flow.|red|Security must review data access and model use.]] Finance also wants the full operating cost. Can CDW make this compliant?',
            ch: [
              {t: 'We cannot grant compliance approval. Bring security, model risk, and finance into discovery. AI Risk Assessment can inform risk decisions, while finance tests the operating costs.', q: 'best', s: {p: 12, t: 12, l: 8}, next: 'b4', fb: 'You set the assessment boundary and include the decision makers. AI Risk Assessment supports a risk review. The bank remains responsible for its approval process.'},
              {t: 'If we keep the model private, the compliance and leakage concerns should be resolved.', q: 'bad', s: {t: -12, p: -8}, next: 'b4', fb: 'Private hosting does not prove compliance or eliminate leakage. Permissions, retrieval, integrations, model behavior, and monitoring still need review.'},
              {t: 'Let us give security the platform documentation first. Finance can review costs when we have a working demonstration.', q: 'meh', s: {p: 3, d: -2, l: -4}, next: 'b4', fb: 'Platform documents are only part of the evidence. Deferring finance repeats the pilot pattern without a defensible operating case.'}
            ]
          },
          b4: {
            c: 'Our infrastructure team wants everything on premises. [[The policy-search workload needs restricted access, but not real-time transaction latency.|ready|Hosting requirements differ by workload.]] Fraud scoring has a different latency target. Finance asks whether private hosting is always cheaper.',
            ch: [
              {t: 'No hosting model wins automatically. Compare approved options for policy search using residency, access, latency, model choice, and total cost. Evaluate fraud scoring separately.', q: 'best', s: {d: 8, u: 10, p: 10, t: 8}, next: 'b5', fb: 'You separate workloads with different requirements. Include infrastructure and review labor in the comparison rather than promising a private-hosting advantage.'},
              {t: 'Owned infrastructure avoids usage bills, so it will cost less once we deploy enough pilots.', q: 'bad', s: {p: -10, t: -10, u: -6}, next: 'b5', fb: 'Avoiding one charge does not prove lower total cost. Capacity, licensing, power, operations, and utilization can change the result.'},
              {t: 'Use the cloud for policy search because it is not latency-sensitive. Keep fraud scoring on premises.', q: 'good', s: {u: 6, p: 3}, next: 'b5', fb: 'You notice the latency difference, but latency alone cannot select hosting. Residency, access controls, provider terms, and costs still constrain both decisions.'}
            ]
          },
          b5: {
            c: 'We do own an NVIDIA graphics processing unit (GPU) system. [[Its subscription status and approved configuration are not confirmed.|red|AI Factory Accelerator prerequisites remain unverified.]] The team runs Kubernetes, but the cluster is not carrying production workloads. Which CDW engagement fits now?',
            ch: [
              {t: 'Start with Private AI Launch Workshop to align the use case and owners. Before AI Factory Accelerator, verify the approved NVIDIA system and an existing NVIDIA AI Enterprise subscription.', q: 'best', s: {p: 12, d: 8, t: 8}, next: 'b6', fb: 'You distinguish foundational discovery from technical validation. AI Factory Accelerator requires an existing NVIDIA DGX or approved original equipment manufacturer GPU system and an existing NVIDIA AI Enterprise subscription.'},
              {t: 'Book AI Factory Accelerator because owning a GPU is enough to establish eligibility.', q: 'bad', s: {p: -10, t: -6}, next: 'b6', fb: 'One piece of hardware does not satisfy the prerequisites. Confirm the approved system and existing subscription before positioning the Accelerator as a fit.'},
              {t: 'Consider NVIDIA GPU Cluster Assessment for the existing Kubernetes cluster. We can return to the policy-search ownership problem afterward.', q: 'good', s: {p: 5, u: 2}, next: 'b6', fb: 'The assessment can establish utilization on an existing GPU cluster running Kubernetes. It does not replace a decision about the useful workload or its accountable owners.'}
            ]
          },
          b6: {
            c: '[[The lending operations head will sponsor policy search if we can measure it.|buy|A potential sponsor wants workload-specific evidence.]] I can assign an operating owner. What should I show the board if prerequisites and approvals take longer than 90 days?',
            ch: [
              {t: 'Show an agreed baseline, risk and data findings, and a gated plan. If the Accelerator qualifies, use its proof of concept, metrics report, runbook, and executive readout. Do not label that production.', q: 'best', s: {p: 12, u: 8, t: 10}, next: 'b7', fb: 'You offer decision evidence without guaranteeing a launch date. The Accelerator validates a scoped blueprint with a small dataset. Integration and operating approval remain separate production work.'},
              {t: 'Show a demonstration with polished answers. The board does not need the operating details at this stage.', q: 'meh', s: {p: 1, t: -4}, next: 'b7', fb: 'A demonstration may explain the concept, but it cannot answer why the prior pilots stalled. Include quality, costs, ownership, and approval dependencies.'},
              {t: 'Commit to production by day 90. We can finish the data and security reviews during rollout.', q: 'bad', s: {t: -12, p: -10}, next: 'b7', fb: 'The board deadline does not remove approval gates. A launch promise before data and risk review exposes the bank to the same failure pattern.'}
            ]
          },
          b7: {
            c: '[[I can bring lending operations, security, finance, and the policy owner next week.|buy|Qualified stakeholders can attend discovery.]] What exactly will we decide together?',
            ch: [
              {t: 'In a 60-minute scoping meeting, confirm policy search, its operating owner, approved data, baseline, and hosting criteria. Review Workshop scope and verify Accelerator prerequisites before choosing the next engagement.', q: 'best', s: {d: 8, p: 12, t: 8}, next: 'end', fb: 'The meeting has participants and decisions, not just a calendar slot. Security, finance, data ownership, and technical eligibility now constrain a qualified CDW next step.'},
              {t: 'Let us meet with your infrastructure team first to choose the GPU expansion. The other groups can approve the plan afterward.', q: 'bad', s: {l: -10, p: -8, t: -6}, next: 'end', fb: 'You exclude the people who decide whether the workload is useful and permissible. More capacity is not the bank\'s stated next decision.'},
              {t: 'I will send a Private AI Launch Workshop overview and ask you to circulate it to the other stakeholders.', q: 'good', s: {p: 4, t: 2}, next: 'end', fb: 'An accurate overview helps, but circulation is weaker than agreeing on decisions with the named owners. Keep the live scoping meeting.'}
            ]
          }
        },
        outcomes: {
          great: {title: 'The bank agrees to qualified discovery', text: 'In this fictional result, Maya convenes lending operations, security, finance, and the policy owner. They scope Private AI Launch Workshop and retain a separate prerequisite check for AI Factory Accelerator. No production or regulatory approval is implied.'},
          ok: {title: 'Interest without a complete decision process', text: 'Maya requests offering information, but data authority, costs, or operating ownership remain open. A useful follow-up must resolve those gaps before technical validation.'},
          poor: {title: 'Another pilot proposal stalls', text: 'The bank hears infrastructure promises before a governed workload plan. Security and finance will not support the proposal. Reopen discovery rather than discounting the hardware.'}
        },
        useCases: ['Evaluate internal policy search over approved lending procedures with source references and staff review.', 'Qualify latency-sensitive predictive fraud scoring as a separate future workload.'],
        offering: {headline: 'Scope Private AI Launch Workshop before qualified validation.', steps: ['Scope Private AI Launch Workshop around a business priority and accountable owners.', 'Use AI Readiness Data Quality Assessment if document authority and quality block progress.', 'Consider AI Risk Assessment with security and model-risk stakeholders. It does not grant regulatory approval.', 'Qualify AI Factory Accelerator only with an existing NVIDIA DGX or approved original equipment manufacturer GPU system and an existing NVIDIA AI Enterprise subscription.', 'Evaluate NVIDIA GPU Cluster Assessment for an existing GPU cluster running Kubernetes when utilization is the question.', 'Use a qualified proof of concept and its metrics report to inform a separate production decision.']},
        takeaways: ['Ask why a pilot stalled before proposing another one.', 'Name the data owner and operational owner separately.', 'Bring security and finance into the first substantive meeting.', 'Choose hosting per workload without guaranteed cost or security claims.', 'An Accelerator proof of concept is evidence, not production approval.']
      },
      {
        id: 'fsi-insurance', full: true, difficulty: 3, turns: 7,
        title: 'The claims intake backlog',
        persona: {
          name: 'Elena Brooks', initials: 'EB', role: 'Head of Claims Operations', company: 'Alder Mutual Insurance', industry: 'Property and casualty insurance',
          size: 'This fictional insurer has 320 claims staff across 3 regions.',
          quote: 'The queue is 12 days long. I need accurate intake, not a machine deciding who gets paid.',
          goals: ['Reduce intake delays without weakening claims review.', 'Test artificial intelligence (AI) against representative claim documents.', 'Build a business case that includes reviewers and operations.'],
          personality: ['She protects claimants.', 'She questions demonstrations that use only clean data.', 'She describes process failures precisely.'],
          pains: ['An illustrative 8,000 incoming document bundles arrive each month.', 'The illustrative intake queue is 12 days long.', 'Scans, duplicates, and missing identifiers cause rework.', 'A prior summary demonstration invented a coverage detail.']
        },
        mission: 'Qualify artificial intelligence (AI) for document intake with data quality, hallucination tests, human review, and measured outcomes. Recover if you overpromise.',
        start: 'i1',
        nodes: {
          i1: {
            c: '[[We receive 8,000 document bundles a month, and intake is 12 days behind.|pain|Fictional volume and delay identify document intake pain.]] Would your AI settle claims faster, or just give us another screen?',
            ch: [
              {t: 'Before discussing settlement, where does intake slow down? Is the team classifying documents, finding missing fields, or retyping information for an adjuster?', q: 'best', s: {d: 12, l: 10, u: 8}, next: 'i2', fb: 'You separate document assistance from a claims decision. The answer locates a bounded workflow without promising faster settlement.'},
              {t: 'Start with automatic summaries for adjusters. That seems more useful than changing the intake process.', q: 'meh', s: {u: 3, d: -4}, next: 'i2', fb: 'Summaries may help, but you have not found the delay. The described backlog sits at intake, and a summary may leave missing-field work unchanged.'},
              {t: 'We can automate settlement for straightforward claims and remove the queue.', q: 'bad', s: {t: -12, p: -8, u: -6}, next: 'ir', fb: 'You jump from document intake to payment decisions. The source does not support a blanket autonomy or backlog-removal promise. You must correct that claim.'}
            ]
          },
          ir: {
            c: '[[Our last demo invented a coverage detail.|red|A prior hallucination makes autonomy claims unacceptable.]] I asked about intake, not settlement. Staff copy identifiers from emails and scans. [[Duplicate forms and unreadable policy numbers cause rework.|ready|Recovery must address the actual document-quality problem.]] I will not let a system make settlement decisions without the right controls.',
            ch: [
              {t: 'You are right. I overstated the scope. Limit this to intake assistance with human authority. Use an approved representative sample to test duplicates, missing fields, and extraction errors. Qualify AI Readiness Data Quality Assessment.', q: 'best', s: {t: 10, l: 10, d: 8, u: 8, p: 8}, next: 'i3', fb: 'You retract the settlement promise and address the actual intake failure. Qualify data readiness with difficult documents, source evidence, error tests, and reviewers who retain decision authority. The assessment does not guarantee extraction accuracy.'},
              {t: 'I meant low-value claims only. We could set a payment limit and skip review below it.', q: 'bad', s: {t: -10, p: -8}, next: 'i3', fb: 'A payment limit does not settle consent, coverage, fairness, or accountability. You still have not addressed the intake rework or agreed on review rules.'},
              {t: 'Understood. Your adjusters can check the results. Let us test a few clean documents first.', q: 'good', s: {t: 3, p: 2}, next: 'i3', fb: 'Human review is necessary, but you have not retracted the settlement promise. Clean documents also leave the stated duplicates and unreadable identifiers out of the evidence. Narrow the task and evaluate the real document mix.'}
            ]
          },
          i2: {
            c: 'Staff sort emails and scans, then copy identifiers into the claims system. [[Some bundles have duplicate forms or unreadable policy numbers.|ready|Representative data includes duplicates and poor scans.]] The clean documents in the last demo did not look like our queue.',
            ch: [
              {t: 'Sample the actual document mix through an approved process. Measure missing fields, duplicate rates, and extraction errors. AI Readiness Data Quality Assessment can identify the readiness gaps.', q: 'best', s: {d: 10, u: 12, p: 10}, next: 'i3', fb: 'You connect the named assessment to readiness rather than promising extraction accuracy. Representative difficult documents belong in evaluation, not outside it.'},
              {t: 'Evaluate on the cleanest documents first. We can estimate how the model will handle the rest.', q: 'meh', s: {d: 2, u: -4, t: -2}, next: 'i3', fb: 'A clean subset can test a narrow capability, but it cannot establish performance on the queue. Keep bad scans and duplicates visible in the evidence.'},
              {t: 'Modern models can infer a missing policy number from the other claim details.', q: 'bad', s: {u: -10, t: -10}, next: 'i3', fb: 'A plausible identifier is not a verified identifier. Missing or unreadable fields need exception handling, not invented facts.'}
            ]
          },
          i3: {
            c: '[[Claims operations owns intake, but records management controls retention and access.|ready|Process ownership and data authority are different.]] Our compliance lead must approve the sample. Do we need a new data platform before we can learn anything?',
            ch: [
              {t: 'First assess quality, access, and ownership with those teams. The assessment produces a maturity scorecard, business case summary, prioritized action plan, and stakeholder readout. A platform decision can follow the findings.', q: 'best', s: {p: 12, l: 8, t: 8}, next: 'i4', fb: 'You describe the assessment deliverables without inventing an implementation service. The source says Modern Data Platform for AI is not a fit before a data quality assessment.'},
              {t: 'Buy Modern Data Platform for AI now. Moving everything into one place should eliminate the quality problems.', q: 'bad', s: {p: -10, u: -8, t: -6}, next: 'i4', fb: 'A new platform does not repair inaccurate or unreadable records by itself. The offering sequence requires the quality assessment first.'},
              {t: 'Use Data Governance for AI to define ownership, but we can skip the design workshop and begin implementation.', q: 'meh', s: {p: 2, t: -4}, next: 'i4', fb: 'You identified governance, then bypassed its required design step. Data Governance for AI starts with a design workshop before implementation.'}
            ]
          },
          i4: {
            c: '[[Adjusters worry that a summary could omit an exclusion or invent a loss detail.|red|Hallucinations and omissions affect claims decisions.]] Even if we limit this to intake, what would human review actually mean?',
            ch: [
              {t: 'Keep source documents beside extracted fields and draft summaries. Agree with adjusters which outputs need review, how exceptions escalate, and which errors stop the trial. Humans retain claims decisions.', q: 'best', s: {u: 10, p: 12, t: 12}, next: 'i5', fb: 'You make review operational. Grounding, error tests, escalation, and decision ownership reduce risk without claiming that review makes the system infallible.'},
              {t: 'Put a disclaimer on the summary and let adjusters use their judgment about whether to check it.', q: 'meh', s: {p: 2, t: -4}, next: 'i5', fb: 'A disclaimer does not define review or escalation. The trial needs explicit rules for missing evidence, conflicting facts, and consequential errors.'},
              {t: 'Require citations in every answer. That removes hallucination risk and lets summaries flow straight into decisions.', q: 'bad', s: {t: -12, p: -8}, next: 'i5', fb: 'Citations can be wrong or incomplete. Test whether the cited evidence supports each important fact and keep human decision authority.'}
            ]
          },
          i5: {
            c: '[[Security wants an AI inventory and clear access controls before a trial.|red|Risk review requires visibility and ownership.]] A customer-facing claims assistant is on the roadmap too. Which checks belong before that launch?',
            ch: [
              {t: 'Consider AI Risk Assessment for risk and governance. For a customer-facing large language model (LLM), qualify AI LLM Penetration Testing for prompt injection, leakage, and insecure integrations. Neither check guarantees security or approval.', q: 'best', s: {p: 12, t: 10, d: 4}, next: 'i6', fb: 'You distinguish a risk assessment from adversarial testing. LLM means large language model. AI LLM Penetration Testing includes a letter of attestation, not a certificate of guaranteed safety.'},
              {t: 'Wait for Security from AI to be ready and treat it as the current launch requirement.', q: 'meh', s: {p: -4, d: -2}, next: 'i6', fb: 'The supplied playbook describes Security from AI as under construction. Do not present that play as an available launch service. Qualify current assessment and testing options.'},
              {t: 'An AI Risk Assessment should satisfy the regulator, so a customer-facing pilot could skip penetration testing.', q: 'bad', s: {t: -12, p: -10}, next: 'i6', fb: 'An assessment cannot grant regulatory acceptance. It also does not replace tests aimed at prompt injection, leakage, and integrations.'}
            ]
          },
          i6: {
            c: '[[Finance wants a business case that counts adjuster review time.|buy|The sponsor requires net value rather than demo speed.]] We can collect baseline data next month. What would convince you that intake assistance is worth expanding?',
            ch: [
              {t: 'Compare intake cycle time, missing-field and extraction errors, reviewer effort, active use, and total operating cost. Agree on thresholds and a stop decision before the trial. Faster drafts alone are not enough.', q: 'best', s: {d: 8, u: 10, p: 10, t: 8}, next: 'i7', fb: 'You test net value and quality together. The fictional backlog is a baseline to investigate, not a promised saving. Reviewer effort can offset apparent speed gains.'},
              {t: 'Use the 12-day queue as the savings target and commit to removing it in the first month.', q: 'bad', s: {t: -10, p: -8}, next: 'i7', fb: 'Queue length is not a guaranteed saving or a direct measure of extraction performance. Arrival rates, staffing, downstream decisions, and rework also affect it.'},
              {t: 'Measure how quickly the model generates each summary and how many bundles it processes.', q: 'good', s: {d: 4, u: 4}, next: 'i7', fb: 'Throughput helps characterize the tool, but it leaves reviewers and claim quality out of the business case. Add net time, errors, adoption, and costs.'}
            ]
          },
          i7: {
            c: '[[I can invite intake, records management, compliance, security, and finance.|buy|Cross-functional scoping is possible.]] What do we prepare without exposing claimant information?',
            ch: [
              {t: 'Meet for 60 minutes to scope AI Readiness Data Quality Assessment. Bring the workflow and baseline definitions. Agree on sample approval, access, review rules, and risk work before anyone transfers documents.', q: 'best', s: {d: 6, p: 12, t: 10}, next: 'end', fb: 'You specify the first engagement and protect the sample boundary. The meeting produces an approved evidence plan rather than a casual request for live claimant files.'},
              {t: 'Send us a full month of live claims today so we can build a convincing demonstration before the meeting.', q: 'bad', s: {t: -12, p: -10}, next: 'end', fb: 'The customer explicitly asked about exposure. You bypass sample approval and data minimization before the teams have agreed on access or purpose.'},
              {t: 'I will send assessment information. You can choose a few documents and send them when ready.', q: 'good', s: {p: 4, t: 2}, next: 'end', fb: 'Offering information is appropriate, but sample selection still needs an approved process. Confirm participants and decisions instead of leaving document transfer ambiguous.'}
            ]
          }
        },
        outcomes: {
          great: {title: 'The insurer scopes evidence before automation', text: 'In this fictional result, Elena convenes intake, data, risk, security, and finance owners. They scope AI Readiness Data Quality Assessment with an approved sample process and a human-review scorecard. Claims authority remains with people.'},
          ok: {title: 'A plausible use case still needs controls', text: 'Elena sees possible intake value, but sample approval, error handling, or net value remains unclear. Resolve those decisions before a trial or customer-facing expansion.'},
          poor: {title: 'The autonomy claim stops progress', text: 'Elena will not sponsor a proposal that equates document assistance with reliable settlement decisions. Correct the claim and restart from intake, data quality, and human authority.'}
        },
        useCases: ['Evaluate document classification, field extraction, and draft summaries for claims intake with human review.', 'Qualify any future customer-facing claims assistant separately, with risk review and adversarial testing.'],
        offering: {headline: 'Scope AI Readiness Data Quality Assessment before a governed intake trial.', steps: ['Assess readiness and produce a maturity scorecard, business case summary, prioritized action plan, and stakeholder readout.', 'Use Data Governance for AI through a design workshop before implementation when access, lineage, and ownership need work.', 'Consider Data Quality and Remediation based on the assessment. Consider Modern Data Platform for AI only after that assessment.', 'Qualify AI Risk Assessment with the security leader. The insurer retains approval authority.', 'Before a customer-facing large language model launch, qualify AI LLM Penetration Testing. Testing does not guarantee security.', 'Scope any later trial separately with reviewers, error thresholds, baseline measures, and a stop decision.']},
        takeaways: ['Document intake assistance is not autonomous claims settlement.', 'Evaluate the difficult documents that caused the backlog.', 'Keep human review explicit and measure its effort.', 'Correct an unsupported claim before trying to recover trust.', 'A risk assessment and penetration test serve different purposes. Neither grants approval.']
      },
      {
        id: 'fsi-wealth', full: false, difficulty: 2, turns: 4,
        title: 'Advisor notes without lost consent',
        persona: {
          name: 'Daniel Ortiz', initials: 'DO', role: 'Director of Advisor Enablement', company: 'Juniper Wealth Partners', industry: 'Wealth management',
          size: 'This fictional firm has 180 advisors and 22 offices.',
          quote: 'Advisors bought the licenses, but they still write notes at night. Client trust matters more than another demo.',
          goals: ['Reduce time spent drafting notes and follow-up messages.', 'Keep client consent and advisor approval explicit.', 'Increase useful adoption on the chosen Microsoft platform.'],
          personality: ['He protects client relationships.', 'He cares about staff workload.', 'He questions license counts as evidence of value.'],
          pains: ['Advisors report an illustrative 50 minutes of notes after each client meeting.', 'Only an illustrative 20% of licensed users are active weekly.', 'Consent and recording rules vary by meeting type.', 'Reviewers worry about incorrect action items.']
        },
        mission: 'Find a bounded artificial intelligence (AI) workflow for advisor productivity. Qualify platform and adoption needs without implying autonomous investment advice.',
        start: 'w1',
        nodes: {
          w1: {
            c: '[[Advisors spend about 50 minutes on notes after a meeting.|pain|The fictional baseline identifies manual notes work.]] We chose Microsoft, but [[only 20% of licensed users are active each week.|ready|The chosen platform has low adoption.]] Is this a technology problem or a people problem?',
            ch: [
              {t: 'Trace one meeting through notes and follow-up. Ask advisors where time goes, which tools they trust, and why licensed users avoid them. Then separate workflow, setup, and adoption gaps.', q: 'best', s: {d: 12, l: 10, u: 8}, next: 'w2', fb: 'You investigate use rather than treating licenses as value. A chosen Microsoft platform allows qualification of the AI Assistants options, but does not prove deployment or adoption fit.'},
              {t: 'Buy more Copilot licenses so every advisor can use the same process.', q: 'bad', s: {d: -8, p: -8, l: -6}, next: 'w2', fb: 'Additional licenses do not explain why current users avoid the tool. Diagnose permissions, useful tasks, training, and review burden first.'},
              {t: 'Start with a note-generation demonstration. If advisors see the speed, adoption should follow.', q: 'good', s: {u: 5, p: 2}, next: 'w2', fb: 'A demonstration can make the task concrete, but speed alone does not resolve trust or process fit. Include advisors who currently avoid the tool.'}
            ]
          },
          w2: {
            c: 'We want meeting notes, action items, and a draft email. [[Some clients decline recording.|red|Consent limits what enters the workflow.]] Could we use the publicly described Morgan Stanley Debrief workflow as our model?',
            ch: [
              {t: 'Use it as a bounded workflow example, not a CDW product promise. Obtain client consent under your policy, offer a non-recording route, and require advisor review before any follow-up or record update.', q: 'best', s: {u: 10, p: 10, t: 12}, next: 'w3', fb: 'The disclosed Debrief example uses client consent and advisor review. Your non-recording route is a proposed training control, not a claim about that product. Qualify your own integration and policies.'},
              {t: 'If the meeting is internal to your systems, we can record it by default and let clients opt out later.', q: 'bad', s: {t: -12, p: -10}, next: 'w3', fb: 'System location does not establish consent. Do not collect meeting content before the firm has applied its consent rules and approved the workflow.'},
              {t: 'Ask compliance to draft a consent notice. Once clients agree, send generated follow-up messages automatically.', q: 'meh', s: {p: 3, t: -6}, next: 'w3', fb: 'Consent governs collection, not the accuracy or suitability of a generated message. Keep advisor approval before sending or recording consequential content.'}
            ]
          },
          w3: {
            c: '[[Advisors worry that a draft could turn a tentative discussion into a recommendation.|red|Review must preserve meaning and advice authority.]] We also have purchased Copilot seats. Which CDW play belongs here?',
            ch: [
              {t: 'Qualify AI Assistants on the chosen Microsoft 365 platform. M365 means Microsoft 365. Check deployment gaps for M365 Copilot Deployment Accelerator, and low use for Copilot Adoption and Change Management. Scope notes and drafts with advisor approval.', q: 'best', s: {p: 12, u: 10, t: 8}, next: 'w4', fb: 'M365 means Microsoft 365. M365 Copilot Deployment Accelerator covers an initial group of up to 50 users. Neither that offering nor adoption work is a promise of a turnkey wealth-specific recording integration or autonomous advice.'},
              {t: 'Use Agents & Workflow Automation now to let an agent update portfolios and email advice after every meeting.', q: 'bad', s: {p: -12, t: -12, u: -8}, next: 'w4', fb: 'The hub marks Agents & Workflow Automation as Coming Soon. The source does not evidence autonomous investment advice. Keep approval with the advisor and qualify current offerings.'},
              {t: 'Consider Copilot Adoption and Change Management, but retain the current notes process without checking why users avoid it.', q: 'good', s: {p: 5, l: 2}, next: 'w4', fb: 'The offering matches a possible adoption gap. Scope it against advisor tasks, trust, and review needs rather than assuming the current workflow is already suitable.'}
            ]
          },
          w4: {
            c: '[[I can recruit 12 advisors and bring compliance plus our Microsoft owner.|buy|A fictional pilot cohort and stakeholders are available.]] How would you decide whether this is worth expanding?',
            ch: [
              {t: 'Agree on consent compliance, advisor approval, factual corrections, net time after review, and active use. Meet with those owners to scope the current offerings. Stop or redesign if quality or trust worsens.', q: 'best', s: {d: 8, p: 12, t: 10, u: 6}, next: 'end', fb: 'The fictional 12-person cohort is a discovery input, not a service entitlement. Expansion depends on approved quality and adoption evidence, not a license count or presumed savings.'},
              {t: 'Use the number of generated notes as the success measure. More notes mean advisors are getting value.', q: 'meh', s: {d: 2, p: -4}, next: 'end', fb: 'Draft counts cannot show consent, correctness, or useful time saved. Include edits, approval effort, and active adoption in the decision.'},
              {t: 'Roll out to all 180 advisors once the first few drafts look right. We can formalize consent and review afterward.', q: 'bad', s: {t: -12, p: -10}, next: 'end', fb: 'A few acceptable drafts do not establish a safe workflow. Consent and approval rules come before expansion, not after it.'}
            ]
          }
        },
        outcomes: {
          great: {title: 'An advisor-led scoping session is agreed', text: 'In this fictional result, Daniel brings advisors, compliance, and the Microsoft owner. They qualify current AI Assistants offerings against consent, advisor approval, deployment, and adoption needs. No autonomous advice or integration outcome is promised.'},
          ok: {title: 'A productivity idea needs evidence', text: 'Daniel wants better notes but still lacks a complete consent, review, or adoption plan. Resolve those gaps before counting drafts as value.'},
          poor: {title: 'Client trust blocks the proposal', text: 'The firm rejects automatic collection or advice. Return to client consent, advisor authority, and a workflow that staff can evaluate.'}
        },
        useCases: ['Draft meeting notes, action items, and follow-up messages with client consent and advisor approval.', 'Qualify role-specific adoption support on an already chosen Microsoft platform.'],
        offering: {headline: 'Qualify AI Assistants for deployment and adoption.', steps: ['Confirm the chosen platform, licensed tools, permissions, and current workflow.', 'Consider M365 Copilot Deployment Accelerator for deployment gaps. Its initial group covers up to 50 users.', 'Consider Copilot Adoption and Change Management for low useful adoption.', 'Scope any meeting-content integration separately. The supplied playbook does not promise a turnkey wealth workflow.', 'Keep client consent and advisor approval before generated content enters client communications or consequential records.']},
        takeaways: ['Low use calls for workflow discovery, not more licenses.', 'Client consent and advisor approval are separate requirements.', 'Company disclosures illustrate a workflow. They do not guarantee another firm the same outcome.', 'Measure net time after review and useful adoption.', 'Do not sell Coming Soon automation or autonomous investment advice.']
      },
      {
        id: 'fsi-payments', full: false, difficulty: 2, turns: 4,
        title: 'The first minute of a dispute call',
        persona: {
          name: 'Priya Shah', initials: 'PS', role: 'Vice President of Customer Operations', company: 'Clearwater Payments', industry: 'Payments services',
          size: 'This fictional processor has 2 service centers and 240 support agents.',
          quote: 'Our menu collects the same facts twice. I want a better first minute, not an agent moving customer money.',
          goals: ['Reduce repetitive collection during customer contact.', 'Qualify automation against the actual contact center platform.', 'Preserve escalation and human dispute decisions.'],
          personality: ['She focuses on customer frustration.', 'She states authority limits clearly.', 'She wants a measurable first step.'],
          pains: ['An illustrative 18,000 support calls arrive monthly.', 'Customers repeat dispute details when transferred.', 'The platform decision is initially unclear to the seller.', 'Leadership confuses customer-contact automation with emerging agentic payments.']
        },
        mission: 'Qualify the platform before positioning artificial intelligence (AI) for first contact. Keep disputes and payment authority separate from automation.',
        start: 'p1',
        nodes: {
          p1: {
            c: '[[Customers repeat their dispute details after the phone menu transfers them.|pain|Repeated first-contact work creates friction.]] We handle about 18,000 calls a month. Someone recommended FirstTouch AI. What do you need to know before recommending it?',
            ch: [
              {t: 'Which contact center platform have you selected, and what happens in the first minute of a dispute call? FirstTouch AI needs a CDW-supported platform and a qualified task.', q: 'best', s: {d: 12, l: 10, p: 10}, next: 'p2', fb: 'You ask for the platform decision before positioning the service. The source excludes customers who have not chosen a contact center platform.'},
              {t: 'FirstTouch AI fits financial services, so let us propose it now and handle the platform later.', q: 'bad', s: {p: -10, d: -8, t: -6}, next: 'p2', fb: 'An industry fit does not establish platform fit. Confirm the actual platform and first-contact task before proposing FirstTouch AI.'},
              {t: 'What are your call costs and transfer rates? We can work out whether automation has value first.', q: 'good', s: {d: 6, u: 4}, next: 'p2', fb: 'Value discovery helps, but it leaves an explicit eligibility gap. Ask about the platform decision alongside those measures.'}
            ]
          },
          p2: {
            c: '[[We selected Five9, and our platform owner can join.|ready|The selected supported platform enables FirstTouch AI qualification.]] We want initial intent capture and a clean handoff, not dispute adjudication. What does FirstTouch AI actually cover?',
            ch: [
              {t: 'The supplied playbook describes FirstTouch AI as automation of the first minute of customer contact on supported platforms, including Five9. Confirm current scope, integration, identity checks, and escalation with the platform owner.', q: 'best', s: {p: 12, u: 10, t: 8}, next: 'p3', fb: 'You preserve the first-minute boundary and platform qualification. A listed platform does not prove every integration, identity flow, or dispute task is supported.'},
              {t: 'FirstTouch AI should resolve the dispute end to end, since Five9 is supported.', q: 'bad', s: {p: -10, u: -8, t: -10}, next: 'p3', fb: 'The source describes the first minute, not end-to-end dispute resolution. Platform support does not grant payment or dispute decision authority.'},
              {t: 'Start with Contact Center Strategic Consulting to map the full experience, but do not discuss the first-minute scope yet.', q: 'good', s: {p: 5, d: 3}, next: 'p3', fb: 'Broader consulting may help if the journey needs redesign. Here the buyer named a narrow task and a selected platform. Explain and qualify that task before broadening the engagement.'}
            ]
          },
          p3: {
            c: 'Our chief executive saw a story about agents making payments. [[She asks whether this could issue refunds without a person.|red|The buyer confuses emerging agentic payments with first-contact automation.]] Can we put that on the roadmap?',
            ch: [
              {t: 'Treat it as a separate, emerging question. Consent, liability, fraud, and agent identity remain unresolved in the source. FirstTouch AI is not evidence of autonomous refunds. Keep dispute and money-movement authority with approved controls.', q: 'best', s: {u: 10, p: 10, t: 12}, next: 'p4', fb: 'You distinguish contact automation from payment execution. The source describes agentic payments as emerging and does not establish deployment at scale or autonomous refund capability.'},
              {t: 'Yes. A successful first-minute trial would prove we can safely extend to autonomous refunds.', q: 'bad', s: {t: -12, p: -10, u: -8}, next: 'p4', fb: 'Intent capture does not test money movement. Refund authority needs separate evidence and controls, and the source does not support the proposed guarantee.'},
              {t: 'We can list refunds as a future idea and let the technical team decide the authority rules later.', q: 'meh', s: {u: 2, p: -4, t: -4}, next: 'p4', fb: 'A future idea is not a capability commitment. Name the unresolved consent, liability, fraud, and identity issues now, with risk and operations involved.'}
            ]
          },
          p4: {
            c: '[[The platform owner, dispute lead, security, and finance can meet next week.|buy|The right owners can scope first contact.]] We want fewer repeat questions without weakening customer verification. What will we measure?',
            ch: [
              {t: 'Scope FirstTouch AI with those owners. Baseline repeated-detail rates, transfers, verification failures, customer experience, and net cost. Define handoff and stop rules. Confirm current supported-platform scope before proposing a trial.', q: 'best', s: {d: 8, p: 12, t: 10, u: 6}, next: 'end', fb: 'The next meeting can decide a bounded task and an evidence plan. Speed is not the only measure. Include identity failures and downstream handoff quality.'},
              {t: 'Promise a lower cost per call, then select whichever metrics show that improvement most clearly.', q: 'bad', s: {t: -12, p: -8}, next: 'end', fb: 'A promised saving and selective metrics do not form a defensible business case. Agree on measures before the trial and include failure costs.'},
              {t: 'Measure first-minute duration and call volume. If those improve, expand the automation to dispute decisions.', q: 'meh', s: {d: 3, p: -4, u: -4}, next: 'end', fb: 'Duration and volume omit verification and handoff quality. They also cannot justify a new task involving consequential dispute decisions.'}
            ]
          }
        },
        outcomes: {
          great: {title: 'A bounded first-contact session is booked', text: 'In this fictional result, Priya brings the selected Five9 platform owner, disputes, security, and finance. They qualify FirstTouch AI for the first minute and agree on handoff and measurement decisions. Refund authority remains separate.'},
          ok: {title: 'Contact friction is clear, scope is incomplete', text: 'The team sees a possible first-contact improvement but still needs platform, identity, handoff, or cost evidence. Close those gaps before proposing automation.'},
          poor: {title: 'A payment promise undermines the meeting', text: 'The customer rejects a proposal that confuses platform support with autonomous refunds or dispute resolution. Return to the first minute and a qualified platform decision.'}
        },
        useCases: ['Qualify initial customer-contact assistance and handoff on a selected CDW-supported contact center platform.', 'Investigate dispute document assistance separately. Payments-specific evidence for that workflow is thin in the source.'],
        offering: {headline: 'Qualify FirstTouch AI for a selected supported platform.', steps: ['Confirm the selected platform. The source lists AWS, Cisco, Dialpad, Five9, Google, NiCE, RingCentral, and Zoom. AWS means Amazon Web Services.', 'Confirm current FirstTouch AI scope for the first minute of customer contact and the actual integration.', 'Define identity checks, escalation, and human dispute authority with operations and security.', 'Use Contact Center Strategic Consulting if discovery reveals a broader experience-design problem.', 'Measure handoff quality, verification, customer experience, and net costs before expansion.']},
        takeaways: ['An industry match does not replace platform qualification.', 'FirstTouch AI covers first contact, not a promised end-to-end dispute process.', 'Agentic payment claims remain emerging with unresolved authority and consent questions.', 'Measure verification and handoffs alongside time and cost.', 'A successful bounded trial does not approve a different consequential task.']
      }
    ]
  },
  jeopardy: {
    categories: [
      {
        name: 'Listen for the signal',
        clues: [
          {q: 'An insurer says, "Staff retype claim identifiers from scans all morning." Is the first signal document intake pain, a platform decision, or proof of autonomous claims readiness?', a: 'The signal is document intake pain. Ask where rework starts and how much time and error it creates.', why: 'Manual document work identifies a task to investigate. It does not establish data quality or authority to settle claims. Document assistance with human review is a plausible next discussion.'},
          {q: 'A bank says, "We have 6 artificial intelligence pilots, but none has an operating owner." Choose the first move. Inventory new GPUs, ask why delivery stalled, or copy a competitor?', a: 'Ask why delivery stalled and identify a useful workload, sponsor, and operating owner.', why: 'Artificial intelligence (AI) pilots can stall on data, integration, approval, skills, or ownership. Graphics processing units (GPUs) do not resolve those questions by themselves. The supplied playbook connects stalled pilots to Private AI Launch Workshop discovery.'},
          {q: 'A wealth firm says, "We chose Microsoft, but advisors avoid the assistant." Name the readiness signal and the next question. Is it more licenses, adoption discovery, or autonomous advice?', a: 'The firm has a chosen platform with low adoption. Ask which advisor tasks, permissions, training, and review burden discourage use.', why: 'For artificial intelligence (AI) work, platform selection narrows the AI Assistants discussion. Low use does not prove a licensing shortage. Qualify Copilot Adoption and Change Management against the actual workflow and barriers.'},
          {q: 'A bank says, "There is a sponsor and budget, but security stopped the trial and nobody owns the policy library." Name the buying signal and both unresolved gates.', a: 'Sponsor and budget indicate interest. Security review and authoritative data ownership remain unresolved gates.', why: 'For artificial intelligence (AI), funding is not permission to proceed. Bring the security lead and policy owner into discovery. AI Risk Assessment can inform risk work, while data readiness work addresses authority and quality. Neither guarantees approval.'},
          {q: 'A processor wants fewer repeat questions, has not chosen a contact center platform, and asks for automatic refunds. Which signal supports discovery, and which 2 claims must wait?', a: 'Qualify repeat first-contact work. FirstTouch AI needs a supported platform. Autonomous refunds remain unproven.', why: 'AI means artificial intelligence. FirstTouch AI targets the first minute on CDW-supported platforms, not autonomous refunds. No platform decision is a poor fit. Emerging agentic payments need separate consent, liability, fraud, and identity discovery.'}
        ]
      },
      {
        name: 'Match the workflow',
        clues: [
          {q: 'Claims staff sort bundles and copy fields before an adjuster sees them. Choose a bounded starting task. Document classification and extraction, autonomous settlement, or trading signals?', a: 'Start with document classification and field extraction, with review and exception handling.', why: 'Insurance document intake is a plausible generative artificial intelligence workflow in the supplied playbook. Evaluate representative records and keep consequential claims decisions with people. A task match is not a packaged implementation promise.'},
          {q: 'Bank employees search conflicting procedure versions. Which design question matters first? Model size, authoritative content and access, or customer chatbot branding?', a: 'Identify authoritative content, its owner, and access rules before evaluating internal search.', why: 'Internal knowledge search depends on retrieval quality and approved data. A model can repeat a retired policy convincingly. Source references and human review help evaluation but do not guarantee correctness.'},
          {q: 'A wealth firm wants notes, action items, and draft follow-up messages. Which boundary matches the disclosed Debrief example? Client consent and advisor review, silent recording, or automatic investment advice?', a: 'The required boundaries are client consent and advisor review. Keep draft content separate from autonomous investment advice.', why: 'AI means artificial intelligence. The 2024-06-26 disclosure describes AI @ Morgan Stanley Debrief with consent and advisor review. It evidences that firm\'s workflow, not audited returns, a CDW turnkey product, or autonomous advice.'},
          {q: 'A payments team wants help with dispute documents and money movement. Which statement fits the evidence? Both are established at scale, document work is an inference while agentic payments are emerging, or neither needs human authority?', a: 'Payments document work is an inference in the supplied playbook. Agentic payments are emerging and need separate authority and risk discovery.', why: 'Payments-specific generative artificial intelligence evidence is thin. Do not recast insurance document examples as proven payments deployments. The 2026-07-14 HM Treasury plan describes emerging payment opportunities and unresolved consent, liability, fraud, and identity issues.'},
          {q: 'A bank wants one assistant to search policies, score fraud, and execute actions. Choose a plan. Use one autonomy level, separate workloads by maturity and consequence, or host privately and skip distinctions?', a: 'Separate knowledge search, predictive fraud scoring, and bounded actions. Qualify each with its own data, latency, validation, and authority rules.', why: 'Predictive artificial intelligence is an established base. Generative workflows often need people to review output. Agents remain early and require limited permissions, approval points, logs, and a shutdown option. Shared hosting does not erase those differences.'}
        ]
      },
      {
        name: 'Choose the CDW play',
        clues: [
          {q: 'A bank needs to choose a useful workload and understand why pilots stalled. Which opening fits? Private AI Launch Workshop, immediate Private AI Factory deployment, or a security guarantee?', a: 'Qualify Private AI Launch Workshop after confirming the discovery need and stakeholders.', why: 'For artificial intelligence (AI) discovery, consider Private AI Launch Workshop for strategy, governance, private designs, or stalled pilots. It describes a 2-day workshop. Confirm current scope. The workshop is not a production commitment or regulatory approval.'},
          {q: 'An insurer cannot trust its document corpus. Choose the first data play. AI Readiness Data Quality Assessment, immediate Modern Data Platform for AI, or model replacement alone?', a: 'Lead with AI Readiness Data Quality Assessment.', why: 'AI means artificial intelligence. Deliverables are a maturity scorecard, business case summary, prioritized action plan, and stakeholder readout. Modern Data Platform for AI requires data quality assessment first. A platform alone does not establish clean data.'},
          {q: 'A customer has both risk sign-off concerns and a planned public large language model assistant. Which pair addresses different questions? AI Risk Assessment and AI LLM Penetration Testing, 2 risk assessments, or FirstTouch AI alone?', a: 'Qualify AI Risk Assessment for risk and governance. Qualify AI LLM Penetration Testing before customer-facing launch.', why: 'AI means artificial intelligence. LLM means large language model. Testing examines prompt injection, leakage, and insecure integrations, with a letter of attestation. Risk assessment informs broader governance. Neither guarantees security or regulatory approval.'},
          {q: 'A Microsoft customer has low Copilot use and is considering a first deployment group. Select current options and state a limit. Deployment and adoption work, Coming Soon automation, or unlimited rollout?', a: 'Qualify M365 Copilot Deployment Accelerator and Copilot Adoption and Change Management. The deployment offering starts with up to 50 users.', why: 'The artificial intelligence (AI) offerings in AI Assistants need a chosen platform. M365 means Microsoft 365. Separate deployment gaps from low adoption. The source does not promise every meeting or industry integration as part of either offering.'},
          {q: 'A buyer asks for FinOps for AI, AI Value Assurance, Agents & Workflow Automation, and guaranteed Salesforce implementation. What can the seller accurately commit from this source?', a: 'The 3 plays remain Coming Soon. Qualify current assessments and metrics. The listed implementation is ServiceNow only.', why: 'AI means artificial intelligence. FinOps means financial operations. Confirm current scope and availability. The catalog does not list Salesforce implementation. Assessment findings can inform a business case, not guarantee returns.'}
        ]
      },
      {
        name: 'Data and risk',
        clues: [
          {q: 'A summary confidently invents a coverage detail. Choose the correct response. Trust its confidence, treat it as a hallucination requiring checks, or accept it if it has a citation?', a: 'Treat it as a hallucination. Verify against the source and define review and exception rules.', why: 'Generated text can state unsupported facts confidently. Grounding and citations help evaluation but do not eliminate errors. Consequential insurance outputs need review, testing, and escalation.'},
          {q: 'An advisor has permission to use a tool but the client has not consented to recording. Is tool access enough, or must collection follow the firm\'s consent rules?', a: 'Collection must follow consent rules. Tool access does not supply client consent or advisor approval.', why: 'The disclosed Morgan Stanley Debrief example includes client consent and advisor review. These are separate controls. Apply the customer\'s own policies and approved alternatives before collecting meeting content.'},
          {q: 'A data team wants Data Governance for AI implementation without designing ownership and access. Accept it, require the design workshop first, or replace governance with a new model?', a: 'Qualify the design workshop first, then implementation.', why: 'For artificial intelligence (AI) governance, the playbook rejects Data Governance for AI implementation without a design workshop. Ownership, access, lineage, and decision authority need customer agreement. A model cannot choose those responsibilities.'},
          {q: 'A bank says, "Private hosting and a penetration-test letter mean the regulator has approved us." Identify both errors.', a: 'Hosting does not establish compliance or security. A penetration-test letter is not regulatory approval or a guarantee against future attacks.', why: 'AI means artificial intelligence. LLM means large language model. A letter of attestation records scoped testing of injection, leakage, and insecure integrations. The bank retains approval and ongoing controls, regardless of hosting.'},
          {q: 'A team cites the United Kingdom 2024 survey\'s 55% automated-decision figure as proof that fully autonomous financial services are normal. Which denominator and companion figure correct the claim?', a: '55% describes use cases with some automated decision-making, not firms or full autonomy. Only 2% of use cases were fully autonomous.', why: 'The Bank of England and Financial Conduct Authority 2024-11-21 survey covers 118 responding United Kingdom-regulated firms. Use cases within that sample are not a global rate or safety standard. As of 2026-10-07, 2026 results were pending.'}
        ]
      },
      {
        name: 'Qualify the workload',
        clues: [
          {q: 'A processor wants FirstTouch AI but is still choosing its platform. Offer it now, qualify the platform decision first, or assume any phone system works?', a: 'Qualify the platform decision first. No contact center platform decision is a stated poor fit.', why: 'The artificial intelligence (AI) offering FirstTouch AI runs on CDW-supported contact center platforms. It lists AWS, Cisco, Dialpad, Five9, Google, NiCE, RingCentral, and Zoom. AWS means Amazon Web Services. Confirm current platform and integration scope before proposing the offering.'},
          {q: 'A bank has an approved NVIDIA GPU system but no existing NVIDIA AI Enterprise subscription. Is AI Factory Accelerator qualified?', a: 'The workload is not yet qualified. Verify both the approved existing system and an existing NVIDIA AI Enterprise subscription.', why: 'GPU means graphics processing unit. AI means artificial intelligence. AI Factory Accelerator requires an existing NVIDIA DGX or approved original equipment manufacturer NVIDIA GPU system and an existing NVIDIA AI Enterprise subscription. Confirm both prerequisites.'},
          {q: 'A customer has an existing GPU cluster running Kubernetes and asks about unused capacity. Choose NVIDIA GPU Cluster Assessment, a generic new-hardware proposal, or FirstTouch AI.', a: 'Qualify NVIDIA GPU Cluster Assessment against its current scope.', why: 'GPU means graphics processing unit. The assessment targets existing GPU clusters running Kubernetes. It provides a utilization baseline, allocated-versus-used capacity gaps, a remaining-capacity estimate, and recommendations. It does not automatically establish a need for more equipment.'},
          {q: 'A small hosted workload needs approved residency and modest throughput. A different workload needs low-latency scoring. Choose one hosting rule or separate comparisons, and name 4 comparison factors.', a: 'Compare each workload separately using residency, latency, model choice, and total cost. Include access, throughput, and operating capacity where relevant.', why: 'The supplied playbook recommends workload-specific hosting. Hybrid is an option, not a requirement. Small usage may favor a hosted service. Owned infrastructure does not automatically cost less or provide better security. Include licenses, operations, and human review in costs.'},
          {q: 'An eligible bank wants AI Factory Accelerator to validate its entire 3-million-document archive and immediately authorize production. What scope and decision boundary need correction?', a: 'AI Factory Accelerator validates a small-dataset NVIDIA blueprint, not the full archive or production approval.', why: 'AI means artificial intelligence. The scope is 1 to 2 gigabytes or up to about 5,000 documents. Deliverables include a proof of concept, metrics report, runbook, and executive readout with roadmap. Production needs separate qualification.'}
        ]
      },
      {
        name: 'Prove the value',
        clues: [
          {q: 'An insurer wants to test intake assistance. When do you define baseline cycle time and errors? Before the trial, after the best demonstration, or only after rollout?', a: 'Define the baseline before the trial. Agree on baseline definitions and decision thresholds with the process owner.', why: 'The supplied playbook recommends a baseline before a pilot and measurement again in production. A fictional backlog motivates discovery but does not establish attainable savings. Include errors as well as speed.'},
          {q: 'An advisor tool drafts notes in 1 minute, but reviewers spend 25 minutes correcting them. Is generation speed enough, or should the team measure net time and useful adoption?', a: 'Measure net time after review, factual corrections, and useful adoption, alongside consent and advisor approval.', why: 'These timings are fictional training figures. Model speed is not the same as workflow value. Review effort, quality, and actual use determine whether the firm should expand or redesign the task.'},
          {q: 'The NVIDIA survey says 32% named document processing as a highest-return use case. A seller calls it a guaranteed 32% return. What is the correction?', a: '32% is the share of respondents naming that area, not a percentage financial return or a customer guarantee.', why: 'NVIDIA published its 2026 report in 2026-01 from 839 global respondents surveyed in 2025-08 through 2025-09 via NVIDIA channels. Responses are self-reported and self-selected. The result is not audited causal evidence or a promised return on investment.'},
          {q: 'A customer says every department measures artificial intelligence costs differently and asks for AI Value Assurance today. Choose a defensible current next step.', a: 'AI Value Assurance is Coming Soon. Pair a baseline with qualified assessments or AI Factory Accelerator metrics.', why: 'AI means artificial intelligence. FinOps means financial operations. FinOps for AI also remains Coming Soon. Include infrastructure, licenses, operations, and human review in net costs. Metrics inform decisions but do not guarantee savings.'},
          {q: 'A claims trial is faster but misses more exclusions, adds review work, and loses active users. Finance wants rollout because draft throughput doubled. Expand, stop and examine the agreed thresholds, or remove reviewers?', a: 'Use the agreed quality and net-value thresholds to stop or redesign. Do not expand on throughput alone or remove reviewers to improve the numbers.', why: 'This is a fictional evaluation result. Cycle time, errors, active adoption, human effort, and net costs can move in different directions. A defensible decision considers all of them. The supplied research contains respondent reports of value, not audited financial-return guarantees.'}
        ]
      }
    ],
    final: {
      category: 'The qualified financial-services deal',
      q: 'A fictional insurer has a 12-day intake backlog, a failed pilot, and conflicting claim identifiers. Its sponsor says private hosting guarantees approval and savings. Give one bounded task, 2 signals, a qualified CDW next step with owners, and one promise to reject.',
      a: 'Use intake classification with human review. Backlog and conflicting identifiers signal process pain and untrusted data. Qualify AI Readiness Data Quality Assessment with intake, data, compliance, security, and finance owners. Private hosting guarantees neither approval nor savings.',
      why: 'AI means artificial intelligence. Start with an approved sample and baseline errors, cycle time, review effort, and net cost. Keep settlement authority with people. Confirm assessment scope and prerequisites before committing.'
    }
  }
};

export default deepFreeze(fsiPack);
