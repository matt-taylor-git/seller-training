import { deepFreeze } from '../shared/pack-contract.mjs';

/** @type {import('../shared/pack-contract.mjs').ContentPack} */
const fsiPack = {
  id: 'fsi',
  revision: 1,
  label: 'Financial services',
  description: 'Practice asking questions, finding useful ways to use artificial intelligence, and measuring results. Both games use this financial services content.',
  disclaimer: 'These are fictional training scenarios. We invented every customer, conversation, and customer measurement. CDW offering descriptions come from a supplied playbook compiled on 2026-10-07. Check what is available now, what each service covers, and what customers need before starting. This training does not prove regulatory approval, security, financial returns, or a fit for any customer. Distribution requires separate approval of the audience and where the training will run.',
  roleplay: {
    scenarios: [
      {
        id: 'fsi-bank', full: true, difficulty: 3, turns: 7,
        title: 'The bank needs to get its trials working.',
        persona: {
          name: 'Maya Chen', initials: 'MC', role: 'Chief Information Officer', company: 'Stonebridge Regional Bank', industry: 'Regional banking',
          size: 'This fictional bank has 42 branches and 2,100 employees.',
          quote: 'We have 6 trial projects. Nobody\'s responsible for putting them into daily use. More hardware won\'t fix that.',
          goals: ['Give the board a believable plan for artificial intelligence in 90 days.', 'Reduce staff time spent finding current lending procedures.', 'Agree who owns the data and who decides when a trial is ready for daily use.'],
          personality: ['She speaks directly about failed projects.', 'She understands the technology.', 'She will wait longer for a decision she can explain and defend.'],
          pains: ['All 6 trials have stopped because nobody owns the work of putting them into daily use.', 'In this fictional example, staff spend 35 minutes per day finding lending procedures.', 'Business teams use conflicting versions of the same policy.', 'Security and finance disagree about where the system should run.']
        },
        mission: 'Find one useful job for artificial intelligence before discussing equipment. Bring security, finance, and the data owner into a meeting with clear decisions to make.',
        start: 'b1',
        nodes: {
          b1: {
            c: 'Our board wants a plan in 90 days. [[We have 6 trials and nobody owns the work of putting them into daily use.|red|The trials have stopped because nobody owns the next step.]] I am not buying another impressive demonstration. What would you ask first?',
            ch: [
              {t: 'Which trial was meant to solve a real business problem? What kept its owner from putting it into daily use?', q: 'best', s: {d: 12, l: 10, t: 8}, next: 'b2', fb: 'You checked whether the idea was useful and why the project stopped. Find out who must own or approve the work before suggesting another trial.'},
              {t: 'Let us list the software and equipment in all 6 trials before we talk about the business teams.', q: 'meh', s: {d: 3, u: -4, l: -4}, next: 'b2', fb: 'That list can help later. Starting with equipment leaves you unsure who owns the work and which business problem matters most.'},
              {t: 'A Private AI Factory would put the trials under your control. We can start with that design.', q: 'bad', s: {p: -8, t: -8, d: -6}, next: 'b2', fb: 'You chose where the system should run before asking why the trials stopped. Control also needs responsible owners, approved access to data, and operating rules.'}
            ]
          },
          b2: {
            c: 'The useful one helped staff find our policies. [[Lending staff spend about 35 minutes a day finding the right procedure.|pain|This fictional starting measurement shows time spent looking for internal information.]] It gave answers from outdated documents. [[Each business team says someone else owns the policy library.|ready|Find who owns the documents and which versions staff should use.]]',
            ch: [
              {t: 'Let us find the policy owner, the approved versions, and the access rules. Then compare answer quality and staff time with today\'s results.', q: 'best', s: {d: 10, l: 10, u: 12, p: 6}, next: 'b3', fb: 'You found why the search failed. Agree on approved documents and their owner before comparing results with the fictional 35-minute starting point.'},
              {t: 'Keep the documents and use a more powerful model, the software that produces answers. It may know which policies are current.', q: 'bad', s: {u: -10, t: -8, p: -6}, next: 'b3', fb: 'More powerful software cannot decide which documents the bank approves. Conflicting versions can still produce convincing wrong answers.'},
              {t: 'Start by measuring how long a small staff group spends searching. We can decide who owns the policies afterward.', q: 'good', s: {d: 6, u: 4, p: 2}, next: 'b3', fb: 'A starting measurement helps, but nobody can approve the test documents yet. Involve an owner who can remove or correct misleading documents.'}
            ]
          },
          b3: {
            c: 'Our security lead stopped a trial after staff pasted customer information into a public tool. [[Security needs to know where the information goes.|red|Security must check who can access information and how the software uses it.]] Finance also wants the full cost of running it. Can CDW make this meet the rules?',
            ch: [
              {t: 'We cannot give regulatory approval. Bring security, the team that checks software risks, and finance into the discussion. AI Risk Assessment can help them review risks while finance checks running costs.', q: 'best', s: {p: 12, t: 12, l: 8}, next: 'b4', fb: 'You explained what the assessment can do and included the decision makers. AI Risk Assessment helps review risks, but the bank still owns its approval process.'},
              {t: 'If we run the software privately, that should settle the concerns about rules and leaked information.', q: 'bad', s: {t: -12, p: -8}, next: 'b4', fb: 'Running privately does not prove compliance with the rules or prevent information leaks. Review access, document searches, connections, software behavior, and monitoring too.'},
              {t: 'Let us give security the system documentation first. Finance can check costs once we have a working demonstration.', q: 'meh', s: {p: 3, d: -2, l: -4}, next: 'b4', fb: 'System documents provide only some of the evidence. Leaving finance until later repeats the trial pattern without showing that the bank can afford daily use.'}
            ]
          },
          b4: {
            c: 'Our equipment team wants everything in our own data center. [[Policy search needs restricted access but does not need to answer as fast as a live transaction.|ready|Different jobs need different places and conditions to run.]] Fraud checks need faster answers. Finance asks whether running privately is always cheaper.',
            ch: [
              {t: 'Neither option is always better. Compare data location, access, response speed, software choices, and total cost for policy search. Check fraud scoring separately.', q: 'best', s: {d: 8, u: 10, p: 10, t: 8}, next: 'b5', fb: 'You separated jobs with different needs. Include equipment and staff review costs rather than promising that running privately will be better.'},
              {t: 'Our own equipment avoids usage bills. It will cost less once we put enough trials into daily use.', q: 'bad', s: {p: -10, t: -10, u: -6}, next: 'b5', fb: 'Avoiding one bill does not prove lower total cost. Available capacity, licenses, electricity, operating work, and how much equipment gets used can change the result.'},
              {t: 'Run policy search with a cloud provider because it does not need instant answers. Keep fraud scoring in your data center.', q: 'good', s: {u: 6, p: 3}, next: 'b5', fb: 'You noticed the difference in response speed, but that cannot decide where either job runs. Check data location, access rules, provider terms, and costs too.'}
            ]
          },
          b5: {
            c: 'We own an NVIDIA system with graphics processing units that do heavy computing work. [[We have not confirmed its subscription or whether the system meets the approved requirements.|red|The bank has not checked whether it qualifies for AI Factory Accelerator.]] The team uses Kubernetes to manage those computers, but they do not run daily business work. Which CDW service fits now?',
            ch: [
              {t: 'Start with Private AI Launch Workshop to agree on the job and its owners. Before AI Factory Accelerator, check the approved NVIDIA system and an existing NVIDIA AI Enterprise subscription.', q: 'best', s: {p: 12, d: 8, t: 8}, next: 'b6', fb: 'You separated planning from technical testing. AI Factory Accelerator needs an existing NVIDIA DGX or approved manufacturer system with graphics processing units, plus an existing NVIDIA AI Enterprise subscription.'},
              {t: 'Book AI Factory Accelerator. Owning a graphics processing unit should be enough to qualify.', q: 'bad', s: {p: -10, t: -6}, next: 'b6', fb: 'Owning one piece of equipment does not meet all the requirements. Check the approved system and existing subscription before recommending AI Factory Accelerator.'},
              {t: 'Consider NVIDIA GPU Cluster Assessment to check how much those computers get used. We can sort out the policy-search owner afterward.', q: 'good', s: {p: 5, u: 2}, next: 'b6', fb: 'The assessment checks usage of existing graphics processing units managed by Kubernetes. It cannot decide which business job matters or who should own it.'}
            ]
          },
          b6: {
            c: '[[The lending operations head will back policy search if we can measure its results.|buy|A possible sponsor wants evidence for this particular job.]] I can name someone to own its daily use. What should I show the board if the required checks and approvals take longer than 90 days?',
            ch: [
              {t: 'Show starting measurements, findings about risks and data, and a plan with approval steps. If you qualify for AI Factory Accelerator, show its test, results report, operating instructions, and leadership briefing. That is not daily use.', q: 'best', s: {p: 12, u: 8, t: 10}, next: 'b7', fb: 'You offered evidence without promising a launch date. AI Factory Accelerator tests a defined NVIDIA design with limited data, while system connections and operating approval remain separate work.'},
              {t: 'Show a demonstration with polished answers. The board does not need the operating details at this stage.', q: 'meh', s: {p: 1, t: -4}, next: 'b7', fb: 'A demonstration can explain the idea, but it cannot explain why earlier trials stopped. Include answer quality, costs, owners, and required approvals.'},
              {t: 'Promise daily use by day 90. We can finish checking data and security while launching it.', q: 'bad', s: {t: -12, p: -10}, next: 'b7', fb: 'The board deadline does not remove required approvals. Promising a launch before checking data and risks repeats the bank\'s earlier mistakes.'}
            ]
          },
          b7: {
            c: '[[I can bring lending operations, security, finance, and the policy owner next week.|buy|The people who own the decisions can join the first discussion.]] What exactly will we decide together?',
            ch: [
              {t: 'Use 60 minutes to agree on policy search, its daily owner, approved data, starting measurements, and where it can run. Check what Private AI Launch Workshop covers and whether you qualify for AI Factory Accelerator before choosing a service.', q: 'best', s: {d: 8, p: 12, t: 8}, next: 'end', fb: 'You gave the meeting clear participants and decisions. The next CDW service must fit security requirements, costs, data ownership, and technical requirements.'},
              {t: 'Let us meet with the equipment team first to choose more graphics processing units. The other groups can approve the plan afterward.', q: 'bad', s: {l: -10, p: -8, t: -6}, next: 'end', fb: 'You left out the people who decide whether the job is useful and allowed. Buying more equipment is not the bank\'s next decision.'},
              {t: 'I will send an overview of Private AI Launch Workshop for you to share with the other decision makers.', q: 'good', s: {p: 4, t: 2}, next: 'end', fb: 'Accurate information helps, but sharing it is weaker than agreeing on decisions with the owners. Keep the meeting with those people.'}
            ]
          }
        },
        outcomes: {
          great: {title: 'The bank agrees to meet with the owners.', text: 'In this fictional result, Maya brings lending operations, security, finance, and the policy owner together. They agree what Private AI Launch Workshop should cover and keep a separate check of requirements for AI Factory Accelerator. This does not approve daily use or imply regulatory approval.'},
          ok: {title: 'The bank needs to settle who decides.', text: 'Maya asks about the services, but approved data, costs, or ownership of daily use still need decisions. Settle those questions before technical testing.'},
          poor: {title: 'Another trial proposal stops.', text: 'The bank hears promises about equipment before a plan for the business job and its rules. Security and finance will not support the proposal. Ask more questions rather than offering cheaper equipment.'}
        },
        useCases: ['Test staff searches of approved lending procedures with links to the documents and staff review.', 'Consider fraud scoring that predicts suspicious transactions as a separate future job needing fast answers.'],
        offering: {headline: 'Plan Private AI Launch Workshop before technical testing.', steps: ['Agree what Private AI Launch Workshop should cover around a business priority and responsible owners.', 'Use AI Readiness Data Quality Assessment if unclear document ownership or poor documents stop progress.', 'Consider AI Risk Assessment with security and the team that checks software risks. It does not grant regulatory approval.', 'For AI Factory Accelerator, confirm an existing NVIDIA DGX or approved manufacturer system with graphics processing units and an existing NVIDIA AI Enterprise subscription.', 'If existing graphics processing units use Kubernetes to manage their work, consider NVIDIA GPU Cluster Assessment to check equipment usage.', 'Use a small working test and its results report to help make a separate decision about daily use.']},
        takeaways: ['Ask why a trial stopped before proposing another one.', 'Name the person who owns the data separately from the person who owns daily use.', 'Bring security and finance into the first detailed meeting.', 'Choose where each job runs without promising lower costs or better security.', 'An AI Factory Accelerator test provides evidence, not approval for daily use.']
      },
      {
        id: 'fsi-insurance', full: true, difficulty: 3, turns: 7,
        title: 'The insurer needs to clear incoming paperwork.',
        persona: {
          name: 'Elena Brooks', initials: 'EB', role: 'Head of Claims Operations', company: 'Alder Mutual Insurance', industry: 'Property and casualty insurance',
          size: 'This fictional insurer has 320 claims staff across 3 regions.',
          quote: 'We are 12 days behind on incoming paperwork. I need accurate information, not a machine deciding who gets paid.',
          goals: ['Process incoming documents faster without weakening claims review.', 'Test artificial intelligence on documents that reflect the actual claims queue.', 'Show whether the work pays off after counting review and operating costs.'],
          personality: ['She protects claimants.', 'She questions demonstrations that use only clean data.', 'She describes process failures precisely.'],
          pains: ['In this fictional example, 8,000 document bundles arrive each month.', 'The fictional queue of incoming documents is 12 days long.', 'Poor scans, duplicates, and missing reference numbers make staff redo work.', 'An earlier demonstration produced a summary with an invented coverage detail.']
        },
        mission: 'Find where artificial intelligence could help with incoming documents. Check data quality, invented answers, human review, and results, and correct any promise you cannot support.',
        start: 'i1',
        nodes: {
          i1: {
            c: '[[We receive 8,000 document bundles a month and are 12 days behind on processing them.|pain|The fictional volume and delay show a problem with incoming documents.]] Would your artificial intelligence settle claims faster, or just give us another screen?',
            ch: [
              {t: 'Before talking about settlement, where does processing slow down? Are staff sorting documents, finding missing information, or retyping details for an adjuster?', q: 'best', s: {d: 12, l: 10, u: 8}, next: 'i2', fb: 'You separated help with documents from decisions about claims. The question finds a specific job without promising faster settlement.'},
              {t: 'Start with automatic summaries for adjusters. That seems more useful than changing how incoming documents get processed.', q: 'meh', s: {u: 3, d: -4}, next: 'i2', fb: 'Summaries may help, but you have not found what causes the delay. Staff may still have to chase missing information before an adjuster sees a claim.'},
              {t: 'We can settle straightforward claims automatically and clear the queue.', q: 'bad', s: {t: -12, p: -8, u: -6}, next: 'ir', fb: 'You jumped from processing documents to deciding payments. The source does not support promising automatic decisions or an empty queue, so correct that claim.'}
            ]
          },
          ir: {
            c: '[[Our last demonstration invented a coverage detail.|red|The earlier invented answer makes promises of automatic decisions unacceptable.]] I asked about incoming documents, not settlement. Staff copy reference numbers from emails and scans. [[Duplicate forms and unreadable policy numbers make us redo work.|ready|To recover trust you must address the actual problems with these documents.]] I will not let a system decide settlements without the right checks.',
            ch: [
              {t: 'I take back the settlement promise. Keep people in charge and limit this to document help. Check AI Readiness Data Quality Assessment with an approved representative sample. Test duplicates, missing information, and copying errors.', q: 'best', s: {t: 10, l: 10, d: 8, u: 8, p: 8}, next: 'i3', fb: 'You withdrew the settlement promise and addressed the document problem. Test difficult documents against their sources with reviewers who retain decisions, without promising that the assessment guarantees accurate copying.'},
              {t: 'I meant small claims only. We could set a payment limit and skip review below it.', q: 'bad', s: {t: -10, p: -8}, next: 'i3', fb: 'A payment limit does not settle consent, coverage, fairness, or responsibility. You still have not addressed repeated document work or agreed on review rules.'},
              {t: 'I understand. Your adjusters can check the results. Let us test a few clean documents first.', q: 'good', s: {t: 3, p: 2}, next: 'i3', fb: 'People must review results, but you have not withdrawn the settlement promise. Limit the task and test the real document mix, including duplicates and unreadable numbers.'}
            ]
          },
          i2: {
            c: 'Staff sort emails and scans, then copy reference numbers into the claims system. [[Some bundles have duplicate forms or unreadable policy numbers.|ready|A realistic sample includes duplicates and poor scans.]] The clean documents in the last demonstration did not look like our queue.',
            ch: [
              {t: 'Get approval for a sample that reflects the actual documents. Measure missing information, duplicates, and copying errors. AI Readiness Data Quality Assessment can show what needs fixing.', q: 'best', s: {d: 10, u: 12, p: 10}, next: 'i3', fb: 'You used the assessment to find problems instead of promising accurate copying. Include difficult documents in testing because they reflect the real queue.'},
              {t: 'Test the cleanest documents first. We can estimate how the software will handle the rest.', q: 'meh', s: {d: 2, u: -4, t: -2}, next: 'i3', fb: 'Clean documents can test one small task, but they cannot show performance on the whole queue. Include poor scans and duplicates in the evidence.'},
              {t: 'Modern software can work out a missing policy number from the other claim details.', q: 'bad', s: {u: -10, t: -10}, next: 'i3', fb: 'A believable reference number is not a checked reference number. Send missing or unreadable information for review rather than inventing facts.'}
            ]
          },
          i3: {
            c: '[[Claims operations handles incoming documents but records management decides who can see them and how long we keep them.|ready|Owning the work is different from controlling the data.]] Our compliance lead must approve the sample. Do we need a new data system before we can learn anything?',
            ch: [
              {t: 'First check data quality, access, and ownership with those teams. The assessment provides readiness ratings, a business case summary, an ordered action plan, and a briefing for decision makers. Choose a data system after seeing the findings.', q: 'best', s: {p: 12, l: 8, t: 8}, next: 'i4', fb: 'You described what the assessment provides without inventing a service that builds the system. Modern Data Platform for AI needs a data quality assessment first.'},
              {t: 'Buy Modern Data Platform for AI now. Moving everything into one place should fix the quality problems.', q: 'bad', s: {p: -10, u: -8, t: -6}, next: 'i4', fb: 'A new data system cannot fix inaccurate or unreadable records by itself. This offering requires the quality assessment first.'},
              {t: 'Use Data Governance for AI to decide ownership. We can skip the design workshop and start building it.', q: 'meh', s: {p: 2, t: -4}, next: 'i4', fb: 'You found the need for data rules, then skipped the required design step. Data Governance for AI requires a design workshop before building the solution.'}
            ]
          },
          i4: {
            c: '[[Adjusters worry that a summary could leave out a coverage exclusion or invent a loss detail.|red|Invented or missing facts can change claims decisions.]] Even if we limit this to incoming documents, what would human review actually mean?',
            ch: [
              {t: 'Show the original documents beside copied information and draft summaries. Agree what adjusters must review, who handles problems, and which errors stop the trial. People still decide claims.', q: 'best', s: {u: 10, p: 12, t: 12}, next: 'i5', fb: 'You explained how review works. Checking original evidence, testing errors, assigning problems, and keeping people responsible can reduce risk but cannot prevent every mistake.'},
              {t: 'Put a warning on the summary. Let adjusters decide whether they need to check it.', q: 'meh', s: {p: 2, t: -4}, next: 'i5', fb: 'A warning does not say what to review or who handles problems. Set clear rules for missing evidence, conflicting facts, and errors that affect decisions.'},
              {t: 'Require source references in every answer. That prevents invented answers and lets summaries go straight into decisions.', q: 'bad', s: {t: -12, p: -8}, next: 'i5', fb: 'Source references can be wrong or incomplete. Check whether the evidence supports each important fact and keep people responsible for decisions.'}
            ]
          },
          i5: {
            c: '[[Security wants a list of our artificial intelligence tools and clear access rules before a trial.|red|The risk review needs to show what tools exist and who owns them.]] We also plan an assistant that talks to customers about claims. Which checks belong before that launch?',
            ch: [
              {t: 'Consider AI Risk Assessment for risks and operating rules. For software that generates customer answers, check AI LLM Penetration Testing for malicious instructions, leaked data, and unsafe connections. Neither check guarantees security or approval.', q: 'best', s: {p: 12, t: 10, d: 4}, next: 'i6', fb: 'You separated risk review from attack testing of text-generating software, called a large language model. AI LLM Penetration Testing provides a letter describing the testing, not guaranteed safety.'},
              {t: 'Wait for Security from AI and treat it as the service required for launch now.', q: 'meh', s: {p: -4, d: -2}, next: 'i6', fb: 'The playbook says Security from AI is still under construction. Do not sell it as an available launch service, and check current assessment and testing options instead.'},
              {t: 'AI Risk Assessment should satisfy the regulator. A trial with customers could then skip attack testing.', q: 'bad', s: {t: -12, p: -10}, next: 'i6', fb: 'An assessment cannot grant regulatory acceptance. It also cannot replace tests for malicious instructions, leaked information, and unsafe system connections.'}
            ]
          },
          i6: {
            c: '[[Finance wants a business case that counts adjuster review time.|buy|The sponsor wants benefits after costs rather than a fast demonstration.]] We can measure today\'s results next month. What would convince you that help with incoming documents is worth expanding?',
            ch: [
              {t: 'Compare processing time, missing or wrongly copied information, review effort, actual use, and full running costs. Agree what results mean continue or stop before the trial. Faster drafts are not enough.', q: 'best', s: {d: 8, u: 10, p: 10, t: 8}, next: 'i7', fb: 'You checked benefits after costs alongside quality. The fictional queue needs investigation rather than a savings promise, because extra review can erase apparent time savings.'},
              {t: 'Make clearing the 12-day queue our savings target. Promise to remove it in the first month.', q: 'bad', s: {t: -10, p: -8}, next: 'i7', fb: 'The queue is not a guaranteed saving or a direct measure of copying accuracy. Incoming volume, staffing, later decisions, and repeated work also affect it.'},
              {t: 'Measure how fast the software writes each summary and how many bundles it processes.', q: 'good', s: {d: 4, u: 4}, next: 'i7', fb: 'Processing speed tells you something about the tool, but leaves out reviewers and claim quality. Add time after review, errors, actual use, and costs.'}
            ]
          },
          i7: {
            c: '[[I can invite document processing staff, records management, compliance, security, and finance.|buy|The teams can meet to agree what the work should cover.]] What do we prepare without exposing claimant information?',
            ch: [
              {t: 'Meet for 60 minutes to agree what AI Readiness Data Quality Assessment should cover. Bring the process and starting measurements. Agree on sample approval, access, review rules, and risk checks before anyone sends documents.', q: 'best', s: {d: 6, p: 12, t: 10}, next: 'end', fb: 'You named the first service and kept sample approval clear. The meeting agrees an evidence plan instead of asking casually for real claimant files.'},
              {t: 'Send us a full month of real claims today. We can build a convincing demonstration before the meeting.', q: 'bad', s: {t: -12, p: -10}, next: 'end', fb: 'The customer asked how to avoid exposure. You skipped sample approval and limiting data before the teams agreed who needs access or why.'},
              {t: 'I will send assessment information. You can choose a few documents and send them when ready.', q: 'good', s: {p: 4, t: 2}, next: 'end', fb: 'Service information helps, but choosing samples still needs approval. Confirm the people and decisions rather than leaving document transfer unclear.'}
            ]
          }
        },
        outcomes: {
          great: {title: 'The insurer agrees to check evidence first.', text: 'In this fictional result, Elena brings document processing, data, risk, security, and finance owners together. They plan AI Readiness Data Quality Assessment with approved sample handling and a scorecard for human review. People still decide claims.'},
          ok: {title: 'The document idea still needs clear rules.', text: 'Elena sees possible benefits, but sample approval, handling errors, or benefits after costs remain unclear. Settle those questions before a trial or any expansion to customers.'},
          poor: {title: 'The promise of automatic decisions stops progress.', text: 'Elena will not back a proposal that treats document help as reliable settlement decisions. Correct that claim and return to incoming documents, data quality, and human decisions.'}
        },
        useCases: ['Test sorting documents, copying information, and drafting summaries for incoming claims with human review.', 'Check any future claims assistant for customers separately through risk review and tests that try to attack it.'],
        offering: {headline: 'Plan AI Readiness Data Quality Assessment before a document trial.', steps: ['Check readiness and provide ratings, a business case summary, an ordered action plan, and a briefing for decision makers.', 'If access, data history, or ownership needs work, use Data Governance for AI with a design workshop before building the solution.', 'Consider Data Quality and Remediation based on the assessment. Consider Modern Data Platform for AI only after that assessment.', 'Check whether AI Risk Assessment fits with the security leader. The insurer still decides approval.', 'For software that generates answers for customers, check whether AI LLM Penetration Testing fits before launch. Testing does not guarantee security.', 'Plan any later trial separately with reviewers, acceptable error limits, starting measurements, and rules for stopping.']},
        takeaways: ['Help with incoming documents does not mean the system can settle claims on its own.', 'Test the difficult documents that caused the queue to grow.', 'State who reviews results and measure how much work review takes.', 'Correct a claim you cannot support before trying to recover trust.', 'A risk assessment reviews risks, while a penetration test tries attacks. Neither grants approval.']
      },
      {
        id: 'fsi-wealth', full: false, difficulty: 2, turns: 4,
        title: 'Advisors need better notes without losing consent.',
        persona: {
          name: 'Daniel Ortiz', initials: 'DO', role: 'Director of Advisor Enablement', company: 'Juniper Wealth Partners', industry: 'Wealth management',
          size: 'This fictional firm has 180 advisors and 22 offices.',
          quote: 'Advisors bought the licenses, but they still write notes at night. Client trust matters more than another demonstration.',
          goals: ['Reduce time spent drafting notes and follow-up messages.', 'Make client consent and advisor approval clear.', 'Help staff use the chosen Microsoft tools for useful work.'],
          personality: ['He protects client relationships.', 'He cares about how much work staff have.', 'He questions license counts as evidence of value.'],
          pains: ['In this fictional example, advisors spend 50 minutes on notes after each client meeting.', 'In this fictional example, only 20% of licensed users use the tools each week.', 'Consent and recording rules vary by meeting type.', 'Reviewers worry that notes will get agreed tasks wrong.']
        },
        mission: 'Find a specific job where artificial intelligence could save advisors time. Check their tools and reasons for low use without suggesting that software can give investment advice on its own.',
        start: 'w1',
        nodes: {
          w1: {
            c: '[[Advisors spend about 50 minutes on notes after a meeting.|pain|This fictional starting measurement shows time spent writing notes by hand.]] We chose Microsoft, but [[only 20% of licensed users use it each week.|ready|The firm chose its tools but few people use them.]] Is this a technology problem or a people problem?',
            ch: [
              {t: 'Follow one meeting through notes and follow-up. Ask advisors where time goes, which tools they trust, and why they avoid others. Then separate problems with the process, setup, and staff use.', q: 'best', s: {d: 12, l: 10, u: 8}, next: 'w2', fb: 'You asked about actual use rather than counting licenses as benefits. Choosing Microsoft lets you discuss AI Assistants, but you still need to check setup and staff needs.'},
              {t: 'Buy more Copilot licenses so every advisor can use the same process.', q: 'bad', s: {d: -8, p: -8, l: -6}, next: 'w2', fb: 'More licenses do not explain why staff avoid the tool. Check access, useful tasks, training, and review work first.'},
              {t: 'Start by showing how the software writes notes. If advisors see the speed, they should start using it.', q: 'good', s: {u: 5, p: 2}, next: 'w2', fb: 'A demonstration can show the task, but speed alone cannot settle trust or whether the process fits. Include advisors who currently avoid the tool.'}
            ]
          },
          w2: {
            c: 'We want meeting notes, agreed tasks, and a draft email. [[Some clients decline recording.|red|Client consent limits which information the process can collect.]] Could we follow the publicly described Morgan Stanley Debrief process?',
            ch: [
              {t: 'Use it as an example, not a CDW product promise. Get client consent under your policy and offer a way without recording. Require advisor review before sending follow-up or updating records.', q: 'best', s: {u: 10, p: 10, t: 12}, next: 'w3', fb: 'Debrief uses client consent and advisor review. The option without recording is our suggested training rule, not a claim about Debrief, so check your own connections and policies.'},
              {t: 'If the meeting stays in your systems, we can record by default and let clients opt out later.', q: 'bad', s: {t: -12, p: -10}, next: 'w3', fb: 'Where a system runs does not establish consent. Apply the firm\'s consent rules and approve the process before collecting meeting information.'},
              {t: 'Ask compliance to write a consent notice. Once clients agree, send the software\'s follow-up messages automatically.', q: 'meh', s: {p: 3, t: -6}, next: 'w3', fb: 'Consent allows collection but does not prove a message is accurate or suitable. Keep advisor approval before sending messages or saving information that affects decisions.'}
            ]
          },
          w3: {
            c: '[[Advisors worry that a draft could turn a tentative discussion into a recommendation.|red|Review must keep the original meaning and leave advice decisions with advisors.]] We have also bought Copilot licenses. Which CDW service belongs here?',
            ch: [
              {t: 'Check AI Assistants for the chosen Microsoft 365 tools. For setup, consider M365 Copilot Deployment Accelerator, where M365 means Microsoft 365. For low use, consider Copilot Adoption and Change Management. Keep advisor approval of notes and drafts.', q: 'best', s: {p: 12, u: 10, t: 8}, next: 'w4', fb: 'M365 means Microsoft 365, and M365 Copilot Deployment Accelerator starts with up to 50 users. Neither service promises a ready-made recording connection for wealth firms or investment advice without advisor approval.'},
              {t: 'Use Agents & Workflow Automation now. Let software update portfolios and email advice after every meeting without waiting for an advisor.', q: 'bad', s: {p: -12, t: -12, u: -8}, next: 'w4', fb: 'Agents & Workflow Automation is Coming Soon. The source does not show investment advice without advisor approval, so keep that approval and check available services.'},
              {t: 'Consider Copilot Adoption and Change Management. Keep today\'s notes process without asking why staff avoid it.', q: 'good', s: {p: 5, l: 2}, next: 'w4', fb: 'The service may help with low use. Plan it around advisor tasks, trust, and review needs rather than assuming today\'s process already fits.'}
            ]
          },
          w4: {
            c: '[[I can recruit 12 advisors and bring compliance plus our Microsoft owner.|buy|This fictional trial group and the decision makers are available.]] How would you decide whether this is worth expanding?',
            ch: [
              {t: 'Agree how to check client consent, advisor approval, factual corrections, time after review, and actual use. Meet with those owners to plan current services. Stop or change the process if quality or trust worsens.', q: 'best', s: {d: 8, p: 12, t: 10, u: 6}, next: 'end', fb: 'The fictional group of 12 informs the discussion, not how many users a service includes. Expansion needs agreed evidence about quality and use rather than licenses or assumed savings.'},
              {t: 'Count the notes the software produces to measure success. More notes mean advisors are getting benefits.', q: 'meh', s: {d: 2, p: -4}, next: 'end', fb: 'Counting drafts cannot show consent, accuracy, or useful time saved. Include corrections, approval work, and actual use in the decision.'},
              {t: 'Expand to all 180 advisors once the first few drafts look right. We can write consent and review rules afterward.', q: 'bad', s: {t: -12, p: -10}, next: 'end', fb: 'A few good drafts do not prove the process is safe. Set consent and approval rules before expansion, not afterward.'}
            ]
          }
        },
        outcomes: {
          great: {title: 'The advisors agree to a planning meeting.', text: 'In this fictional result, Daniel brings advisors, compliance, and the Microsoft owner. They check current AI Assistants services against consent, advisor approval, setup, and staff use. Nobody promises investment advice without advisor approval or a completed connection to other systems.'},
          ok: {title: 'The idea needs evidence of useful results.', text: 'Daniel wants better notes but still needs a complete plan for consent, review, or staff use. Settle those questions before counting drafts as benefits.'},
          poor: {title: 'Client trust stops the proposal.', text: 'The firm rejects automatic collection or advice. Return to client consent, advisor decisions, and a process that staff can test.'}
        },
        useCases: ['Draft meeting notes, agreed tasks, and follow-up messages with client consent and advisor approval.', 'Check support for staff tasks and tool use after the firm has chosen Microsoft.'],
        offering: {headline: 'Check AI Assistants for setup and staff use.', steps: ['Confirm the chosen tools, licenses, access rules, and current process.', 'Consider M365 Copilot Deployment Accelerator for Microsoft 365 setup problems. Its initial group covers up to 50 users.', 'Consider Copilot Adoption and Change Management if staff rarely use the tools for useful work.', 'Plan any connection that collects meeting information separately. The playbook does not promise a ready-made process for wealth firms.', 'Keep client consent and advisor approval before software drafts enter client messages or records that affect decisions.']},
        takeaways: ['If few people use a tool, ask about their work before selling more licenses.', 'Client consent and advisor approval are separate requirements.', 'A company\'s public example shows its process. It does not guarantee another firm the same result.', 'Measure time after review and whether staff use the tool for useful work.', 'Do not sell Coming Soon automation or investment advice without advisor approval.']
      },
      {
        id: 'fsi-payments', full: false, difficulty: 2, turns: 4,
        title: 'Customers should not repeat their dispute details.',
        persona: {
          name: 'Priya Shah', initials: 'PS', role: 'Vice President of Customer Operations', company: 'Clearwater Payments', industry: 'Payments services',
          size: 'This fictional processor has 2 service centers and 240 support agents.',
          quote: 'Our menu collects the same facts twice. I want a better first minute, not software moving customer money.',
          goals: ['Stop asking customers for the same information repeatedly.', 'Check whether automation fits the system the service centers actually use.', 'Keep clear handoffs for problems and leave dispute decisions with people.'],
          personality: ['She focuses on customer frustration.', 'She says clearly who can make which decisions.', 'She wants a first step with results she can measure.'],
          pains: ['In this fictional example, 18,000 support calls arrive monthly.', 'Customers repeat dispute details when transferred.', 'The seller does not yet know which service center system the firm chose.', 'Leaders confuse automatic customer contact with new software that makes payments.']
        },
        mission: 'Check the service center system before recommending artificial intelligence for first contact. Keep decisions about disputes and payments separate from automatic information collection.',
        start: 'p1',
        nodes: {
          p1: {
            c: '[[Customers repeat their dispute details after the phone menu transfers them.|pain|Asking for the same details again makes first contact harder for customers.]] We handle about 18,000 calls a month. Someone recommended FirstTouch AI. What do you need to know before recommending it?',
            ch: [
              {t: 'Which system have your service centers chosen? What happens in the first minute of a dispute call? FirstTouch AI needs a system CDW supports and a job it can handle.', q: 'best', s: {d: 12, l: 10, p: 10}, next: 'p2', fb: 'You checked the system choice before recommending the service. The source excludes customers who have not chosen their contact center system.'},
              {t: 'FirstTouch AI fits financial services. Let us propose it now and sort out the service center system later.', q: 'bad', s: {p: -10, d: -8, t: -6}, next: 'p2', fb: 'Serving this industry does not prove the service fits the customer\'s system. Confirm that system and the first-contact job before proposing FirstTouch AI.'},
              {t: 'What does each call cost and how often do you transfer callers? We can work out whether automation helps first.', q: 'good', s: {d: 6, u: 4}, next: 'p2', fb: 'Asking about benefits helps, but you still do not know whether the customer qualifies. Ask which system they chose alongside those measurements.'}
            ]
          },
          p2: {
            c: '[[We selected Five9 and our system owner can join.|ready|Choosing a supported system lets the seller check whether FirstTouch AI fits.]] We want to understand why someone called and pass the details on, not decide disputes. What does FirstTouch AI actually cover?',
            ch: [
              {t: 'The playbook says FirstTouch AI automates the first minute of customer contact on supported systems, including Five9. Check what it currently covers, system connections, identity checks, and problem handoffs with the system owner.', q: 'best', s: {p: 12, u: 10, t: 8}, next: 'p3', fb: 'You kept the first-minute limit and checked the system. A supported system does not prove every connection, identity check, or dispute task is supported.'},
              {t: 'FirstTouch AI should resolve the whole dispute because Five9 is supported.', q: 'bad', s: {p: -10, u: -8, t: -10}, next: 'p3', fb: 'The source describes the first minute, not resolving the whole dispute. Supporting a system does not give authority to decide payments or disputes.'},
              {t: 'Start with Contact Center Strategic Consulting to map the whole experience. Leave the first-minute details until later.', q: 'good', s: {p: 5, d: 3}, next: 'p3', fb: 'Broader advice may help if the whole process needs changing. This buyer chose a system and a specific job, so explain and check that job before expanding the work.'}
            ]
          },
          p3: {
            c: 'Our chief executive saw a story about software making payments. [[She asks whether this could issue refunds without a person.|red|The buyer confuses emerging software-driven payments with automatic first contact.]] Can we put that in our future plans?',
            ch: [
              {t: 'That is a separate new idea. The source leaves consent, responsibility for losses, fraud, and software identity unresolved. FirstTouch AI does not prove automatic refunds work. Keep approved rules about who can decide disputes or move money.', q: 'best', s: {u: 10, p: 10, t: 12}, next: 'p4', fb: 'You separated automatic contact from making payments. The source describes software-driven payments as emerging and does not show widespread use or an ability to refund without people.'},
              {t: 'Yes. A successful first-minute trial would prove we can safely add refunds without human approval.', q: 'bad', s: {t: -12, p: -10, u: -8}, next: 'p4', fb: 'Learning why someone called does not test moving money. Refund decisions need separate evidence and rules, and the source does not support that guarantee.'},
              {t: 'We can list refunds as a future idea. Let the technical team decide who has authority later.', q: 'meh', s: {u: 2, p: -4, t: -4}, next: 'p4', fb: 'A future idea is not a promise that the service can do it. Discuss unresolved consent, loss responsibility, fraud, and identity now with risk and operations teams.'}
            ]
          },
          p4: {
            c: '[[The system owner, dispute lead, security, and finance can meet next week.|buy|The people who own the decisions can plan first contact.]] We want fewer repeat questions without weakening checks of who customers are. What will we measure?',
            ch: [
              {t: 'Plan FirstTouch AI with those owners. Measure repeated questions, transfers, failed identity checks, customer experience, and full costs before starting. Set handoff and stop rules. Confirm what the service supports now before proposing a trial.', q: 'best', s: {d: 8, p: 12, t: 10, u: 6}, next: 'end', fb: 'The meeting can agree on a specific job and how to test it. Measure failed identity checks and whether staff receive useful details, not just speed.'},
              {t: 'Promise a lower cost per call. Then choose whichever measurements show that improvement most clearly.', q: 'bad', s: {t: -12, p: -8}, next: 'end', fb: 'Promising savings and picking favorable measurements cannot support a sound business case. Agree on measurements before the trial and include the costs of failures.'},
              {t: 'Measure how long first contact takes and how many calls it handles. If those improve, let automation decide disputes too.', q: 'meh', s: {d: 3, p: -4, u: -4}, next: 'end', fb: 'Time and call counts leave out identity checks and whether staff receive useful details. They also cannot justify adding dispute decisions that affect customers.'}
            ]
          }
        },
        outcomes: {
          great: {title: 'The team books a meeting about first contact.', text: 'In this fictional result, Priya brings the Five9 system owner, disputes, security, and finance together. They check FirstTouch AI for the first minute and agree how to pass details on and measure results. Authority to issue refunds stays separate.'},
          ok: {title: 'The team still needs to agree on the details.', text: 'The team sees a possible improvement to first contact but still needs evidence about systems, identity checks, handoffs, or costs. Answer those questions before proposing automation.'},
          poor: {title: 'The payment promise harms the meeting.', text: 'The customer rejects a proposal that treats system support as permission for automatic refunds or dispute decisions. Return to the first minute and check the chosen system.'}
        },
        useCases: ['Check first-contact help and passing details to staff on a chosen contact center system that CDW supports.', 'Investigate help with dispute documents separately. The source has little evidence for that work specifically in payments.'],
        offering: {headline: 'Check FirstTouch AI against the chosen supported system.', steps: ['Confirm the chosen system. The source lists Amazon Web Services, Cisco, Dialpad, Five9, Google, NiCE, RingCentral, and Zoom.', 'Confirm what FirstTouch AI currently covers in the first minute and how it connects to the actual system.', 'Agree on identity checks, who handles problems, and who decides disputes with operations and security.', 'Use Contact Center Strategic Consulting if the questions reveal a problem with the wider customer experience.', 'Before expanding, measure whether staff receive useful details, identity checks work, customers have a better experience, and full costs improve.']},
        takeaways: ['Serving an industry does not prove a service supports the customer\'s system.', 'FirstTouch AI covers first contact, not a promise to handle the whole dispute.', 'Software-driven payments are still emerging, with unanswered questions about authority and consent.', 'Measure identity checks and handoffs alongside time and cost.', 'A successful trial of one job does not approve a different job that affects customers\' money or decisions.']
      }
    ]
  },
  jeopardy: {
    categories: [
      {
        name: 'Listen for what the customer needs.',
        clues: [
          {q: 'An insurer says, "Staff retype claim reference numbers from scans all morning." Does this show a problem with incoming documents, a chosen system, or readiness to settle claims automatically?', a: 'They are redoing document work. Ask where it happens, how long it takes, and what goes wrong.', why: 'Writing information by hand shows a job to investigate, not good data or permission to settle claims. Discuss help with incoming documents that people review.'},
          {q: 'A bank says, "We have 6 artificial intelligence trials, but nobody owns their daily use." What comes first? List new equipment, ask why the trials stopped, or copy a competitor?', a: 'Ask why the trials stopped. Find a useful job, a sponsor, and an owner for daily use.', why: 'Artificial intelligence trials can stop because of data, system connections, approvals, skills, or ownership. More equipment cannot settle those questions, but Private AI Launch Workshop can help explore them.'},
          {q: 'A wealth firm says, "We chose Microsoft, but advisors avoid the assistant." What should you ask next? Whether to buy more licenses, why staff avoid it, or whether it can give advice alone?', a: 'The tools are chosen but rarely used. Ask about tasks, access, training, and review work.', why: 'Choosing Microsoft narrows the AI Assistants discussion about artificial intelligence, but low use does not prove a need for more licenses. Check Copilot Adoption and Change Management against staff tasks and reasons for avoiding the tools.'},
          {q: 'A bank says, "We have a sponsor and budget, but security stopped the trial and nobody owns the policies." What shows buying interest, and which 2 decisions still need work?', a: 'A sponsor and budget show interest. Security approval and an owner for approved data are missing.', why: 'Funding artificial intelligence does not give permission to proceed, so include security and the policy owner. AI Risk Assessment can inform risks while data checks address ownership and quality, but neither guarantees approval.'},
          {q: 'A payments firm wants fewer repeated questions but has not chosen its service center system. It also wants automatic refunds. What problem can you explore, and which 2 promises must wait?', a: 'Explore repeated questions. FirstTouch AI needs a supported system. Automatic refunds are unproven.', why: 'FirstTouch AI uses artificial intelligence for the first minute, not refunds, and needs a chosen system CDW supports. Software-driven payments are emerging, with unanswered questions about consent, responsibility for losses, fraud, and software identity.'}
        ]
      },
      {
        name: 'Match the tool to the job.',
        clues: [
          {q: 'Claims staff sort bundles and copy details before an adjuster sees them. Which specific job should you start with? Sorting and copying documents, settling claims automatically, or spotting trading opportunities?', a: 'Start with sorting documents and copying details. Have people review results and handle problems.', why: 'Artificial intelligence could help with incoming insurance documents, but test records that reflect the real queue and keep claims decisions with people. A useful job does not mean CDW offers a ready-made implementation.'},
          {q: 'Bank staff find conflicting versions of procedures. What should you check first? How powerful the software is, which documents are approved and who can access them, or the branding of a customer assistant?', a: 'Find the approved documents, their owner, and access rules before testing staff searches.', why: 'Staff search needs approved data and accurate document retrieval because software can repeat an outdated policy convincingly. References to original documents and human review help testing but cannot guarantee correct answers.'},
          {q: 'A wealth firm wants meeting notes, agreed tasks, and draft follow-up messages. Which rules match the published Debrief example? Client consent and advisor review, secret recording, or automatic investment advice?', a: 'Get client consent and advisor review. Drafting notes does not mean giving advice without approval.', why: 'The 2024-06-26 disclosure describes AI @ Morgan Stanley Debrief, an artificial intelligence tool with consent and advisor review. It shows that firm\'s process, not audited returns, a ready-made CDW product, or advice without approval.'},
          {q: 'A payments team wants document help and software that moves money. Which claim fits the source? Both are widely proven, document help is a suggested possibility while automatic payments are emerging, or neither needs human decisions?', a: 'Document help is a suggested possibility. Automatic payments are emerging and need separate checks.', why: 'The source has little payments-specific evidence for artificial intelligence document work, and insurance examples do not prove payments use. The 2026-07-14 HM Treasury plan leaves consent, responsibility for losses, fraud, and software identity unresolved for emerging payments.'},
          {q: 'A bank wants one assistant to search policies, score fraud, and take actions. Should each job have the same freedom, have separate rules based on its maturity and consequences, or skip distinctions because it runs privately?', a: 'Separate search, fraud prediction, and limited actions. Check data, speed, accuracy, and authority for each.', why: 'Artificial intelligence that predicts outcomes is established, while generated answers often need human review. Software that acts is early and needs limited access, approvals, logs, and a stop option, even when jobs run together.'}
        ]
      },
      {
        name: 'Choose the CDW service that fits.',
        clues: [
          {q: 'A bank needs a useful job for artificial intelligence and an explanation for stopped trials. Which opening fits? Private AI Launch Workshop, installing Private AI Factory immediately, or promising security?', a: 'Check Private AI Launch Workshop once you confirm what needs exploring and who must join.', why: 'Private AI Launch Workshop explores artificial intelligence plans, operating rules, private designs, or stopped trials. The source describes 2 days, but confirm current coverage without promising daily use or regulatory approval.'},
          {q: 'An insurer cannot trust its documents. Which data service comes first? AI Readiness Data Quality Assessment, buying Modern Data Platform for AI immediately, or just replacing the software that generates answers?', a: 'Start with AI Readiness Data Quality Assessment.', why: 'For artificial intelligence, the assessment gives readiness ratings, a business case summary, an ordered action plan, and a decision-maker briefing. Modern Data Platform for AI needs that assessment first because a system alone cannot fix data.'},
          {q: 'A customer needs risk approval and plans software that generates answers for the public. Which pair fits these different needs? AI Risk Assessment and AI LLM Penetration Testing, 2 risk assessments, or FirstTouch AI alone?', a: 'Use AI Risk Assessment for risks and rules. Check AI LLM Penetration Testing before customer launch.', why: 'Risk assessment reviews artificial intelligence rules, while attack testing checks text-generating software called a large language model. Testing covers malicious instructions, leaks, and unsafe connections, with a letter describing tests, not guaranteed security or regulatory approval.'},
          {q: 'A Microsoft customer rarely uses Copilot and is planning its first setup group. Which current services fit, and what is the group limit? Setup and staff-use support, Coming Soon automation, or unlimited rollout?', a: 'Use M365 Copilot Deployment Accelerator and Copilot Adoption and Change Management. Start with up to 50 users.', why: 'AI Assistants services for artificial intelligence need a chosen platform, and M365 means Microsoft 365. Separate setup problems from low use, as neither service promises every connection to meetings or industry systems.'},
          {q: 'A buyer asks for FinOps for AI, AI Value Assurance, Agents & Workflow Automation, and guaranteed Salesforce implementation. What can you honestly offer based on this source?', a: 'The 3 services are Coming Soon. Use current assessments and results. Implementation covers ServiceNow only.', why: 'FinOps means financial operations for managing costs, here for artificial intelligence, so confirm current availability and coverage. The catalog does not list Salesforce implementation, and assessment findings can support a business case but cannot guarantee returns.'}
        ]
      },
      {
        name: 'Check the data and the risks.',
        clues: [
          {q: 'A summary confidently invents a coverage detail. What should you do? Trust its confidence, check the invented answer against the original documents, or accept it because it lists a source?', a: 'Check the invented answer against the source. Set review rules and decide who handles errors.', why: 'An invented answer is called a hallucination, and checking original evidence and references helps testing but cannot prevent every error. Insurance answers that affect decisions need review, tests, and a clear route for problems.'},
          {q: 'An advisor can access a tool, but the client has not agreed to recording. Does access give permission to collect meeting information, or must the firm apply its consent rules first?', a: 'Follow consent rules before collecting information. Tool access is not consent or advisor approval.', why: 'The published Morgan Stanley Debrief example includes client consent and advisor review, which are separate checks. Apply the customer\'s own policies and approved alternatives before collecting meeting information.'},
          {q: 'A team wants Data Governance for AI without first designing data ownership and access. Should you accept, require the design workshop before building it, or replace data rules with more powerful software?', a: 'Start with the design workshop. Build the solution afterward.', why: 'For artificial intelligence, Data Governance for AI needs a design workshop before building. Agree who owns data, who can access it, its history, and who decides, because software cannot choose those responsibilities.'},
          {q: 'A bank says, "Running privately and a letter about attack testing mean the regulator approved us." Name both errors.', a: 'Running privately does not prove compliance or security. A test letter is not approval or future safety.', why: 'A letter records defined artificial intelligence tests for malicious instructions, leaks, and unsafe connections, not regulatory approval. The bank still owns approval and ongoing checks wherever the system runs.'},
          {q: 'A team says the United Kingdom 2024 survey proves fully automatic financial services are normal because 55% of uses involved automatic decisions. What does 55% count, and which second number corrects the claim?', a: '55% counts uses with some automatic decisions, not firms. Only 2% of uses were fully automatic.', why: 'The Bank of England and Financial Conduct Authority survey dated 2024-11-21 covers 118 responding United Kingdom-regulated firms. This sample is not a global rate or safety standard, and on 2026-10-07 the 2026 results remained unpublished.'}
        ]
      },
      {
        name: 'Check whether the customer qualifies.',
        clues: [
          {q: 'A payments firm wants FirstTouch AI but is still choosing its service center system. Should you offer it now, check the system choice first, or assume any phone system works?', a: 'Check the system choice first. FirstTouch AI does not fit customers who have not chosen one.', why: 'FirstTouch AI uses artificial intelligence on supported systems including Amazon Web Services, Cisco, Dialpad, Five9, Google, NiCE, RingCentral, and Zoom. Confirm current system support and connections before proposing it.'},
          {q: 'A bank has approved NVIDIA equipment but no NVIDIA AI Enterprise subscription. Does it qualify for AI Factory Accelerator?', a: 'It does not qualify. It needs an approved existing system and an existing NVIDIA AI Enterprise subscription.', why: 'AI Factory Accelerator tests artificial intelligence on an existing NVIDIA DGX or approved manufacturer system with NVIDIA graphics processing units. It also requires an existing NVIDIA AI Enterprise subscription, so confirm both requirements.'},
          {q: 'A customer has graphics processing units managed by Kubernetes, software that organizes computing work, and asks about unused capacity. Choose NVIDIA GPU Cluster Assessment, new equipment, or FirstTouch AI.', a: 'Check whether NVIDIA GPU Cluster Assessment fits the existing system and current service coverage.', why: 'NVIDIA GPU Cluster Assessment checks existing graphics processing units managed by Kubernetes and reports current use and assigned versus used capacity. It estimates spare capacity and recommends changes, but does not automatically justify buying more equipment.'},
          {q: 'One small job runs with a provider and needs approved data locations but little processing. Another needs fast fraud scores. Should you compare each job separately or use one rule for both? Name 4 comparison factors.', a: 'Compare each job by data location, response speed, software choice, and total cost.', why: 'Check access, processing volume, and operating capacity too, with provider and customer equipment together only if needed. Small jobs may favor providers, and owning equipment guarantees neither lower costs nor security, so count licenses, operations, and review.'},
          {q: 'A qualified bank wants AI Factory Accelerator to test all 3 million archived documents and immediately approve daily use. What does the service actually test, and which approval remains separate?', a: 'It tests an NVIDIA design with limited data, not the whole archive or approval for daily use.', why: 'The artificial intelligence test uses 1 to 2 gigabytes or up to about 5,000 documents. It provides a working test, results report, operating instructions, and leadership briefing with a plan, but daily use needs separate checks.'}
        ]
      },
      {
        name: 'Check whether the results are worth it.',
        clues: [
          {q: 'An insurer wants help with incoming documents. When should you measure today\'s processing time and errors? Before the trial, after the best demonstration, or only after launch?', a: 'Measure before the trial. Agree what to measure and what results mean continue or stop with the owner.', why: 'Measure before a trial and again in daily use, counting errors as well as speed. The fictional queue gives a reason to ask questions, not a promise of savings.'},
          {q: 'An advisor tool drafts notes in 1 minute, but reviewers spend 25 minutes fixing them. Is drafting speed enough, or should the team measure time after review and whether staff find it useful?', a: 'Measure time after review, corrections, and actual use. Also check consent and advisor approval.', why: 'These timings are fictional, and fast software is not the same as useful work. Review effort, quality, and actual use help decide whether to expand or change the process.'},
          {q: 'In NVIDIA\'s survey, 32% named document processing among the uses with the best financial returns. A seller promises a 32% return to a customer. What is wrong with that claim?', a: '32% counts respondents who named that area. It is not a financial return or a customer guarantee.', why: 'NVIDIA\'s 2026-01 report covers 839 global respondents surveyed during 2025-08 through 2025-09 via NVIDIA channels. Answers are self-reported and self-selected, not audited proof of cause and effect or a promised financial return.'},
          {q: 'A customer says every department measures artificial intelligence costs differently and asks for AI Value Assurance today. What available next step can you recommend without promising results?', a: 'AI Value Assurance is Coming Soon. Use starting measurements and current assessments or Accelerator results.', why: 'For artificial intelligence costs, FinOps means financial operations, and FinOps for AI is also Coming Soon. Count equipment, licenses, operations, and review, using assessment or AI Factory Accelerator results to inform decisions, not guarantee savings.'},
          {q: 'A claims trial is faster but misses more coverage exclusions, needs extra review, and loses users. Finance wants to expand because it doubles draft output. Should you expand, check agreed limits and stop or change it, or remove reviewers?', a: 'Stop or change the trial using agreed quality and cost limits. Do not remove review to raise output.', why: 'In this fictional result, time, errors, actual use, staff effort, and costs can move differently. Consider them together, because the research reports respondents\' accounts of benefits, not audited proof or guaranteed financial returns.'}
        ]
      }
    ],
    final: {
      category: 'Agree on a next step the customer qualifies for.',
      q: 'A fictional insurer is 12 days behind on incoming documents, has a failed trial, and has conflicting claim reference numbers. Its sponsor says running privately guarantees approval and savings. Name one specific job, 2 signs of need, a suitable CDW next step with owners, and one promise to reject.',
      a: 'Sort incoming documents with human review. Delays and conflicting numbers show process and data problems. Check AI Readiness Data Quality Assessment with document processing, data, compliance, security, and finance owners. Running privately guarantees neither approval nor savings.',
      why: 'For artificial intelligence, get sample approval and measure errors, processing time, review effort, and full costs before starting. People still decide settlements, so confirm what the assessment covers and its requirements before promising work.'
    }
  }
};

export default deepFreeze(fsiPack);
