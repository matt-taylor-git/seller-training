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
        title: 'The bank needs a plan beyond another trial.',
        persona: {
          name: 'Maya Chen', initials: 'MC', role: 'Chief Information Officer', company: 'Stonebridge Regional Bank', industry: 'Regional banking',
          size: 'This fictional bank has 42 branches and 2,100 employees.',
          quote: 'We have 6 artificial intelligence trials. Nobody\'s responsible for getting them ready for staff to use. More hardware won\'t fix that.',
          goals: ['Give the board a believable plan for artificial intelligence in 90 days.', 'Reduce staff time spent finding current lending procedures.', 'Agree who owns the policy documents and who decides when staff can rely on the search tool.'],
          personality: ['She speaks directly about failed projects.', 'She understands the technology.', 'She will wait longer for a decision she can explain and defend.'],
          pains: ['All 6 trials have stopped without anyone responsible for getting them ready for staff to use.', 'In this fictional example, staff spend 35 minutes per day finding lending procedures.', 'Business teams use conflicting versions of the same policy.', 'Security and finance disagree about using a cloud provider or the bank\'s own computers.']
        },
        mission: 'Find one useful job for artificial intelligence before discussing equipment. Bring security, finance, and the data owner into a meeting with clear decisions to make.',
        start: 'b1',
        nodes: {
          b1: {
            c: 'Our board wants an artificial intelligence plan in 90 days. [[We have 6 trials but nobody\'s responsible for getting them ready for staff to use.|red|The trials have stopped without anyone responsible for putting them into operation.]] I don\'t want to pay for another demonstration that goes nowhere. Where would you start?',
            ch: [
              {t: 'Which trial would make the biggest difference to your staff? What stopped it, and who would be responsible for putting it into operation?', q: 'best', s: {d: 12, l: 10, t: 8}, next: 'b2', fb: 'You checked whether the idea was useful and why the project stopped. Find out who must own or approve the work before suggesting another trial.'},
              {t: 'Let\'s list the software and equipment in all 6 trials first. We can talk about the business teams afterward.', q: 'meh', s: {d: 3, u: -4, l: -4}, next: 'b2', fb: 'That list can help later. Starting with equipment leaves you unsure who owns the work and which business problem matters most.'},
              {t: 'I\'d start with Private AI Factory so you can run artificial intelligence on your own equipment. That gives us a design to work from.', q: 'bad', s: {p: -8, t: -8, d: -6}, next: 'b2', fb: 'You chose where the system should run before asking why the trials stopped. Control also needs responsible owners, approved access to data, and operating rules.'}
            ]
          },
          b2: {
            c: 'The useful trial let staff ask questions about our lending procedures. [[Lending staff spend about 35 minutes a day finding the right procedure.|pain|This fictional starting measurement shows time spent finding lending procedures.]] The search tool kept answering from outdated policies. [[Each business team says someone else owns the policy library.|ready|Find who owns the documents and which versions staff should use.]]',
            ch: [
              {t: 'Who can confirm which policies are current and who may read them? Let\'s bring that person in before we compare search accuracy and staff time with today\'s results.', q: 'best', s: {d: 10, l: 10, u: 12, p: 6}, next: 'b3', fb: 'You found why the search failed. Agree on approved documents and their owner before comparing results with the fictional 35-minute starting point.'},
              {t: 'I\'d keep your documents and try more powerful software to answer the questions. It may be better at working out which policies are current.', q: 'bad', s: {u: -10, t: -8, p: -6}, next: 'b3', fb: 'More powerful software cannot decide which documents the bank approves. Conflicting versions can still produce convincing wrong answers.'},
              {t: 'Could we measure search time with a small group of staff first? We can decide who owns the policies afterward.', q: 'good', s: {d: 6, u: 4, p: 2}, next: 'b3', fb: 'A starting measurement helps, but nobody can approve the test documents yet. Involve an owner who can remove or correct misleading documents.'}
            ]
          },
          b3: {
            c: 'Our security lead stopped a trial after staff pasted customer information into a public tool. [[Security won\'t let us continue without knowing where that information goes.|red|Security must check who can access information and how the software uses it.]] Finance wants to know what policy search would cost to run. Can CDW get us approved?',
            ch: [
              {t: 'We can\'t give regulatory approval. Could we meet with security, finance, and your model-risk team? AI Risk Assessment can help review risks while finance checks running costs and model risk checks whether the model gives reliable answers for lending staff.', q: 'best', s: {p: 12, t: 12, l: 8}, next: 'b4', fb: 'You kept the bank responsible for approval and included separate decision makers. Security checks data protection, the model-risk team checks model reliability and suitability, and finance checks costs.'},
              {t: 'If we run the software on your own computers, that should settle your concerns about compliance and leaked information.', q: 'bad', s: {t: -12, p: -8}, next: 'b4', fb: 'Running privately does not prove compliance with the rules or prevent information leaks. Review access, document searches, connections, software behavior, and monitoring too.'},
              {t: 'I\'ll give security the system documentation first. We can bring finance in once we have a working demonstration.', q: 'meh', s: {p: 3, d: -2, l: -4}, next: 'b4', fb: 'System documents provide only some of the evidence. Leaving finance until later repeats the trial pattern without showing that the bank can afford to run policy search.'}
            ]
          },
          b4: {
            c: 'The team that runs our computers wants everything in our own data center. [[Only authorized staff should see lending policies but their searches don\'t need split-second answers.|ready|Policy search and fraud checks have different access and response-time needs.]] Fraud checks have to respond while a payment is happening. Would using our own computers always cost less?',
            ch: [
              {t: 'Not always. Let\'s compare where policy data can go, who can see it, response speed, software choices, and full costs. We\'d need a separate comparison for fraud checks.', q: 'best', s: {d: 8, u: 10, p: 10, t: 8}, next: 'b5', fb: 'You separated jobs with different needs. Include equipment and staff review costs rather than promising that running privately will be better.'},
              {t: 'Your own equipment avoids cloud usage bills. It\'ll cost less once enough of your trial projects become services your staff use.', q: 'bad', s: {p: -10, t: -10, u: -6}, next: 'b5', fb: 'Avoiding one bill does not prove lower total cost. Available capacity, licenses, electricity, operating work, and how much equipment gets used can change the result.'},
              {t: 'I\'d put policy search with a cloud provider since it doesn\'t need instant answers. I\'d keep fraud scoring in your data center.', q: 'good', s: {u: 6, p: 3}, next: 'b5', fb: 'You noticed the difference in response speed, but that cannot decide where either job runs. Check data location, access rules, provider terms, and costs too.'}
            ]
          },
          b5: {
            c: 'We already own an NVIDIA system that we bought for artificial intelligence trials. [[I\'d need my team to check which NVIDIA system we own and whether we have an NVIDIA AI Enterprise subscription.|red|AI Factory Accelerator requires approved NVIDIA equipment and an existing NVIDIA AI Enterprise subscription.]] Our team uses Kubernetes to organize computing work, but that equipment only runs tests so far. Where would you suggest we start?',
            ch: [
              {t: 'I\'d start with Private AI Launch Workshop to agree on policy search and its owners. Before we consider AI Factory Accelerator, can your team confirm the approved NVIDIA equipment and an existing NVIDIA AI Enterprise subscription?', q: 'best', s: {p: 12, d: 8, t: 8}, next: 'b6', fb: 'You separated planning from technical testing. AI Factory Accelerator needs an existing NVIDIA DGX or approved manufacturer system with NVIDIA graphics processing units, plus an existing NVIDIA AI Enterprise subscription.'},
              {t: 'I\'d book AI Factory Accelerator. Since you already own NVIDIA equipment, you should qualify.', q: 'bad', s: {p: -10, t: -6}, next: 'b6', fb: 'Owning one piece of equipment does not meet all the requirements. Check the approved system and existing subscription before recommending AI Factory Accelerator.'},
              {t: 'I\'d suggest NVIDIA GPU Cluster Assessment to see how much of that equipment you\'re using. We can sort out the policy-search owner afterward.', q: 'good', s: {p: 5, u: 2}, next: 'b6', fb: 'The assessment checks use of graphics processing units, chips for demanding calculations, on existing systems managed by Kubernetes. It can\'t choose the business priority or its owner.'}
            ]
          },
          b6: {
            c: '[[The lending operations head will back policy search if we can measure its results.|buy|A possible sponsor wants evidence for policy search rather than another demonstration.]] I can name someone responsible for running it once staff rely on it. What can I show the board if approval takes longer than 90 days?',
            ch: [
              {t: 'You can show current search times and accuracy, data and risk findings, and a plan with approval steps. If you qualify for AI Factory Accelerator, you\'d also get a working test, results report, operating instructions, and leadership briefing. That isn\'t approval for staff to rely on it.', q: 'best', s: {p: 12, u: 8, t: 10}, next: 'b7', fb: 'You offered evidence without promising a launch date. AI Factory Accelerator tests a defined NVIDIA design with limited data, while system connections and operating approval remain separate work.'},
              {t: 'I\'d show the board a demonstration with polished answers. They don\'t need the operating details at this stage.', q: 'meh', s: {p: 1, t: -4}, next: 'b7', fb: 'A demonstration can explain the idea, but it cannot explain why earlier trials stopped. Include answer quality, costs, owners, and required approvals.'},
              {t: 'We can have staff relying on policy search by day 90. We\'ll finish the data and security checks as we launch.', q: 'bad', s: {t: -12, p: -10}, next: 'b7', fb: 'The board deadline does not remove required approvals. Promising a launch before checking data and risks repeats the bank\'s earlier mistakes.'}
            ]
          },
          b7: {
            c: '[[I can bring lending operations, security, finance, and the policy owner next week.|buy|The people who own the decisions can join the first discussion.]] What exactly will we decide together?',
            ch: [
              {t: 'Let\'s use 60 minutes to agree on policy search, its owner, approved data, starting measurements, and where it can run. We can then check Private AI Launch Workshop coverage and AI Factory Accelerator requirements before choosing a service.', q: 'best', s: {d: 8, p: 12, t: 8}, next: 'end', fb: 'You gave the meeting clear participants and decisions. The next CDW service must fit security requirements, costs, data ownership, and technical requirements.'},
              {t: 'Let\'s meet with the team that runs your computers first to choose more equipment for the trials. The other groups can approve our plan afterward.', q: 'bad', s: {l: -10, p: -8, t: -6}, next: 'end', fb: 'You left out the people who decide whether the job is useful and allowed. Buying more equipment is not the bank\'s next decision.'},
              {t: 'I\'ll send you an overview of Private AI Launch Workshop to share with the other decision makers.', q: 'good', s: {p: 4, t: 2}, next: 'end', fb: 'Accurate information helps, but sharing it is weaker than agreeing on decisions with the owners. Keep the meeting with those people.'}
            ]
          }
        },
        outcomes: {
          great: {title: 'The bank agrees to meet with the owners.', text: 'In this fictional result, Maya brings lending operations, security, finance, and the policy owner together. They agree what Private AI Launch Workshop should cover and keep a separate check of requirements for AI Factory Accelerator. This does not approve staff relying on policy search or imply regulatory approval.'},
          ok: {title: 'The bank needs to settle who decides.', text: 'Maya asks about the services, but approved policy documents, costs, or responsibility for running policy search still need decisions. Settle those questions before technical testing.'},
          poor: {title: 'Another trial proposal stops.', text: 'The bank hears promises about equipment before a plan for useful policy search and the checks it needs. Security and finance will not support the proposal. Ask more questions rather than offering cheaper equipment.'}
        },
        useCases: ['Test staff searches of approved lending procedures with links to the documents and staff review.', 'Consider fraud scoring that predicts suspicious transactions as a separate future job needing fast answers.'],
        offering: {headline: 'Plan Private AI Launch Workshop before technical testing.', steps: ['Agree what Private AI Launch Workshop should cover around a business priority and responsible owners.', 'Use AI Readiness Data Quality Assessment if unclear document ownership or poor documents stop progress.', 'Consider AI Risk Assessment with security and the model-risk team that checks whether models are reliable and suitable. It does not grant regulatory approval.', 'For AI Factory Accelerator, confirm an existing NVIDIA DGX or approved manufacturer system with NVIDIA graphics processing units and an existing NVIDIA AI Enterprise subscription.', 'If existing graphics processing units use Kubernetes to manage their work, consider NVIDIA GPU Cluster Assessment to check equipment usage.', 'Use a small working test and its results report to help make a separate decision about letting staff rely on policy search.']},
        takeaways: ['Ask why a trial stopped before proposing another one.', 'Name the person who owns the policy documents separately from the person responsible for running policy search.', 'Bring security and finance into the first detailed meeting.', 'Choose where each job runs without promising lower costs or better security.', 'An AI Factory Accelerator test provides evidence, not approval for staff to rely on policy search.']
      },
      {
        id: 'fsi-insurance', full: true, difficulty: 3, turns: 7,
        title: 'Claims staff need help sorting and copying paperwork.',
        persona: {
          name: 'Elena Brooks', initials: 'EB', role: 'Head of Claims Operations', company: 'Alder Mutual Insurance', industry: 'Property and casualty insurance',
          size: 'This fictional insurer has 320 claims staff across 3 regions.',
          quote: 'We\'re 12 days behind on sorting claim forms and copying their details. I need accurate information, not a machine deciding who gets paid.',
          goals: ['Get claim forms ready for adjusters faster without weakening review.', 'Test artificial intelligence on the emails and scans that claims staff actually receive.', 'Check whether sorting and copying take less time after counting review and operating costs.'],
          personality: ['She protects claimants.', 'She questions demonstrations that use only clean data.', 'She describes process failures precisely.'],
          pains: ['In this fictional example, 8,000 bundles of claim forms and supporting documents arrive each month.', 'Staff are 12 days behind on sorting documents and copying details for adjusters in this fictional example.', 'Poor scans, duplicates, and missing reference numbers make staff redo work.', 'An earlier demonstration produced a summary with an invented coverage detail.']
        },
        mission: 'Find where artificial intelligence could help staff sort claim forms or copy their details. Check document quality, invented answers, review work, and costs, and correct any promise you cannot support.',
        start: 'i1',
        nodes: {
          i1: {
            c: '[[My team gets 8,000 bundles of claim forms and supporting documents a month and is 12 days behind on preparing them for adjusters.|pain|This fictional team needs help getting claim documents ready for review.]] Could artificial intelligence help us settle claims sooner, or would it just give staff another screen to check?',
            ch: [
              {t: 'Before we talk about settlement, where do your staff lose time? Are they sorting forms, chasing missing information, or copying details into the claims system for an adjuster?', q: 'best', s: {d: 12, l: 10, u: 8}, next: 'i2', fb: 'You separated help with documents from decisions about claims. The question finds a specific job without promising faster settlement.'},
              {t: 'I\'d start with automatic summaries for your adjusters. That seems more useful than changing how your team handles incoming claim forms.', q: 'meh', s: {u: 3, d: -4}, next: 'i2', fb: 'Summaries may help, but you have not found what causes the delay. Staff may still have to chase missing information before an adjuster sees a claim.'},
              {t: 'We can settle your straightforward claims automatically. That should clear the queue.', q: 'bad', s: {t: -12, p: -8, u: -6}, next: 'ir', fb: 'You jumped from processing documents to deciding payments. The source does not support promising automatic decisions or an empty queue, so correct that claim.'}
            ]
          },
          ir: {
            c: '[[The software in our last demonstration invented what a policy covered.|red|The earlier invented answer makes promises of automatic decisions unacceptable.]] I need help preparing claim forms, not deciding payments. Staff copy reference numbers from emails and scans into our claims system. [[Duplicate forms and unreadable policy numbers make us redo work.|ready|To recover trust you must address the actual problems with these documents.]] I won\'t let software decide settlements without the right checks.',
            ch: [
              {t: 'I take back the settlement promise. Your staff should keep those decisions. Let\'s check AI Readiness Data Quality Assessment using an approved sample that reflects actual documents, including duplicates and missing details. We can test copying errors against the originals.', q: 'best', s: {t: 10, l: 10, d: 8, u: 8, p: 8}, next: 'i3', fb: 'You withdrew the settlement promise and addressed the document problem. Test difficult documents against their sources with reviewers who still make decisions, without promising that the assessment guarantees accurate copying.'},
              {t: 'I meant small claims only. We could set a payment limit and skip review below it.', q: 'bad', s: {t: -10, p: -8}, next: 'i3', fb: 'A payment limit does not settle consent, coverage, fairness, or responsibility. You still have not addressed repeated document work or agreed on review rules.'},
              {t: 'I understand. Your adjusters can check the results. Let\'s test a few clean claim forms first.', q: 'good', s: {t: 3, p: 2}, next: 'i3', fb: 'People must review results, but you have not withdrawn the settlement promise. Limit the task and test the real document mix, including duplicates and unreadable numbers.'}
            ]
          },
          i2: {
            c: 'Staff sort claim emails and scans, then copy reference numbers into the claims system. [[Some bundles have duplicate forms or unreadable policy numbers.|ready|A realistic sample includes duplicates and poor scans.]] The clean forms in the last demonstration didn\'t look like what we receive.',
            ch: [
              {t: 'Could we get approval for a sample of the claim forms your team actually receives? AI Readiness Data Quality Assessment can help us find what needs fixing. Let\'s measure missing details, duplicates, and copying errors.', q: 'best', s: {d: 10, u: 12, p: 10}, next: 'i3', fb: 'You used the assessment to find problems instead of promising accurate copying. Include difficult documents in testing because they reflect the real queue.'},
              {t: 'Let\'s test your cleanest forms first. We can estimate how the software will handle the rest.', q: 'meh', s: {d: 2, u: -4, t: -2}, next: 'i3', fb: 'Clean documents can test one small task, but they cannot show performance on the whole queue. Include poor scans and duplicates in the evidence.'},
              {t: 'If a policy number is missing, the software should be able to work it out from your other claim details.', q: 'bad', s: {u: -10, t: -10}, next: 'i3', fb: 'A believable reference number is not a checked reference number. Send missing or unreadable information for review rather than inventing facts.'}
            ]
          },
          i3: {
            c: '[[Claims operations handles incoming documents but records management decides who can see them and how long we keep them.|ready|Owning the work is different from controlling the data.]] Our compliance lead must approve the sample. Do we need a new data system before we can learn anything?',
            ch: [
              {t: 'Not yet. Let\'s check document quality, access, and ownership with those teams first. The assessment gives you scores showing how ready your data is, a business case summary, a plan in priority order, and a briefing for decision makers. Then you can decide whether you need a new data system.', q: 'best', s: {p: 12, l: 8, t: 8}, next: 'i4', fb: 'You described what the assessment provides without inventing a service that builds the system. Modern Data Platform for AI needs a data quality assessment first.'},
              {t: 'I\'d recommend Modern Data Platform for AI now. Moving your records into one place should fix the quality problems.', q: 'bad', s: {p: -10, u: -8, t: -6}, next: 'i4', fb: 'A new data system cannot fix inaccurate or unreadable records by itself. This offering requires the quality assessment first.'},
              {t: 'Data Governance for AI could help you decide ownership. We can skip the design workshop and start building your solution.', q: 'meh', s: {p: 2, t: -4}, next: 'i4', fb: 'You found the need for data rules, then skipped the required design step. Data Governance for AI requires a design workshop before building the solution.'}
            ]
          },
          i4: {
            c: '[[My adjusters worry a summary might leave out something the policy doesn\'t cover or invent details about a loss.|red|Invented or missing facts can change claims decisions.]] If we only use the software to prepare claim documents, what would my staff have to check?',
            ch: [
              {t: 'I\'d put the original documents beside copied details and draft summaries. Let\'s agree with your adjusters what they must check, who handles problems, and which errors stop the trial. Your people would still decide claims.', q: 'best', s: {u: 10, p: 12, t: 12}, next: 'i5', fb: 'You explained how review works. Checking original evidence, testing errors, assigning problems, and keeping people responsible can reduce risk but cannot prevent every mistake.'},
              {t: 'We could put a warning on each summary. Your adjusters can decide whether they need to check it.', q: 'meh', s: {p: 2, t: -4}, next: 'i5', fb: 'A warning does not say what to review or who handles problems. Set clear rules for missing evidence, conflicting facts, and errors that affect decisions.'},
              {t: 'I\'d require a source reference in every answer. That prevents invented facts, so your adjusters could use summaries to decide claims without more checks.', q: 'bad', s: {t: -12, p: -8}, next: 'i5', fb: 'Source references can be wrong or incomplete. Check whether the evidence supports each important fact and keep people responsible for decisions.'}
            ]
          },
          i5: {
            c: '[[Security wants to know which artificial intelligence tools we use and who can access them before we test claim documents.|red|The risk review needs to show what tools exist and who owns them.]] We\'re also planning an assistant that answers customers\' claims questions. What would we need to check before letting customers use it?',
            ch: [
              {t: 'I\'d consider AI Risk Assessment for risks and operating rules. For your customer assistant, we should check AI LLM Penetration Testing for malicious instructions, leaked data, and unsafe connections. Neither check guarantees security or approval.', q: 'best', s: {p: 12, t: 10, d: 4}, next: 'i6', fb: 'You separated risk review from attack testing of text-generating software, called a large language model. AI LLM Penetration Testing provides a letter describing the testing, not guaranteed safety.'},
              {t: 'I\'d make Security from AI your required launch service. We can wait until it\'s ready.', q: 'meh', s: {p: -4, d: -2}, next: 'i6', fb: 'The playbook says Security from AI is still under construction. Do not sell it as an available launch service, and check current assessment and testing options instead.'},
              {t: 'AI Risk Assessment should satisfy your regulator. Then we could skip attack testing for the customer trial.', q: 'bad', s: {t: -12, p: -10}, next: 'i6', fb: 'An assessment cannot grant regulatory acceptance. It also cannot replace tests for malicious instructions, leaked information, and unsafe system connections.'}
            ]
          },
          i6: {
            c: '[[Finance wants to know whether we still save time after adjusters check and correct the results.|buy|The sponsor wants benefits after review effort and costs rather than a fast demonstration.]] We can start measuring how staff prepare claim documents next month. How would we decide whether to expand a test?',
            ch: [
              {t: 'Let\'s compare time spent preparing claim documents, missing or wrongly copied details, review effort, actual use, and full costs. We should agree which results mean continuing or stopping before the trial. Faster drafts alone wouldn\'t convince me.', q: 'best', s: {d: 8, u: 10, p: 10, t: 8}, next: 'i7', fb: 'You checked benefits after costs alongside quality. The fictional queue needs investigation rather than a savings promise, because extra review can erase apparent time savings.'},
              {t: 'We can clear your 12-day queue in the first month. I\'d make that our savings target.', q: 'bad', s: {t: -10, p: -8}, next: 'i7', fb: 'The queue is not a guaranteed saving or a direct measure of copying accuracy. Incoming volume, staffing, later decisions, and repeated work also affect it.'},
              {t: 'I\'d measure how fast the software writes each summary and how many bundles it processes.', q: 'good', s: {d: 4, u: 4}, next: 'i7', fb: 'Processing speed tells you something about the tool, but leaves out reviewers and claim quality. Add total time including review, errors, actual use, and costs.'}
            ]
          },
          i7: {
            c: '[[I can invite document processing staff, records management, compliance, security, and finance.|buy|The teams can meet to agree what the work should cover.]] What do we prepare without exposing claimant information?',
            ch: [
              {t: 'Could we meet for 60 minutes to plan AI Readiness Data Quality Assessment? Could you bring a description of how staff prepare claim documents and today\'s measurements? Let\'s agree on sample approval, access, review rules, and risk checks before anyone sends documents.', q: 'best', s: {d: 6, p: 12, t: 10}, next: 'end', fb: 'You named the first service and kept sample approval clear. Everyone agrees what evidence to gather instead of asking casually for real claimant files.'},
              {t: 'Could you send us a full month of real claim files today? We can build a convincing demonstration before the meeting.', q: 'bad', s: {t: -12, p: -10}, next: 'end', fb: 'The customer asked how to avoid exposure. You skipped sample approval and limiting data before the teams agreed who needs access or why.'},
              {t: 'I\'ll send you the assessment information. You can choose a few claim documents and send them when you\'re ready.', q: 'good', s: {p: 4, t: 2}, next: 'end', fb: 'Service information helps, but choosing samples still needs approval. Confirm the people and decisions rather than leaving document transfer unclear.'}
            ]
          }
        },
        outcomes: {
          great: {title: 'The insurer agrees to check evidence first.', text: 'In this fictional result, Elena brings document processing, data, risk, security, and finance owners together. They plan AI Readiness Data Quality Assessment with approved sample handling and a form recording the results of human review. People still decide claims.'},
          ok: {title: 'The document idea still needs clear rules.', text: 'Elena sees a way to help staff prepare claim documents, but sample approval, error handling, or benefits after review costs remain unclear. Settle those questions before a trial or any expansion to customers.'},
          poor: {title: 'The promise of automatic decisions stops progress.', text: 'Elena will not back a proposal that treats document help as reliable settlement decisions. Correct that claim and return to sorting claim forms, copying accurate details, and keeping decisions with people.'}
        },
        useCases: ['Test sorting claim forms, copying reference numbers into the claims system, and drafting summaries with human review.', 'Check any future assistant that answers customers\' claims questions separately through risk review and tests that try to attack it.'],
        offering: {headline: 'Plan AI Readiness Data Quality Assessment before a document trial.', steps: ['Provide scores showing readiness, a business case summary, a plan in priority order, and a briefing for decision makers.', 'If access, data history, or ownership needs work, use Data Governance for AI with a design workshop before building the solution.', 'Consider Data Quality and Remediation based on the assessment. Consider Modern Data Platform for AI only after that assessment.', 'Check whether AI Risk Assessment fits with the security leader. The insurer still decides approval.', 'For software that generates answers for customers, check whether AI LLM Penetration Testing fits before launch. Testing does not guarantee security.', 'Plan any later trial separately with reviewers, acceptable error limits, starting measurements, and rules for stopping.']},
        takeaways: ['Help with incoming documents does not mean the system can settle claims on its own.', 'Test the difficult documents that caused the queue to grow.', 'State who reviews results and measure how much work review takes.', 'Correct a claim you cannot support before trying to recover trust.', 'A risk assessment reviews risks, while a penetration test tries attacks. Neither grants approval.']
      },
      {
        id: 'fsi-wealth', full: false, difficulty: 2, turns: 4,
        title: 'Advisors need better notes that respect client consent.',
        persona: {
          name: 'Daniel Ortiz', initials: 'DO', role: 'Director of Advisor Enablement', company: 'Juniper Wealth Partners', industry: 'Wealth management',
          size: 'This fictional firm has 180 advisors and 22 offices.',
          quote: 'We bought Microsoft 365 Copilot to help with meeting notes, but advisors still write them at night. Client trust matters more than another demonstration.',
          goals: ['Reduce time spent drafting notes and follow-up messages after client meetings.', 'Make client consent and advisor approval clear.', 'Help advisors use Microsoft 365 Copilot for meeting notes they can trust.'],
          personality: ['He protects client relationships.', 'He cares about how much work staff have.', 'He questions license counts as evidence of value.'],
          pains: ['In this fictional example, advisors spend 50 minutes on notes after each client meeting.', 'In this fictional example, only 20 percent of people with Microsoft 365 Copilot licenses use it each week.', 'Consent and recording rules vary by meeting type.', 'Reviewers worry that notes will get agreed tasks wrong.']
        },
        mission: 'Find why Microsoft 365 Copilot hasn\'t helped advisors finish meeting notes sooner. Check their process, setup, and reasons for low use without suggesting that software can give investment advice on its own.',
        start: 'w1',
        nodes: {
          w1: {
            c: '[[We bought Microsoft 365 Copilot for notes after client meetings but advisors still spend about 50 minutes writing them.|pain|This fictional starting measurement shows time spent writing meeting notes.]] We checked usage, and [[only 20 percent of people with licenses use it each week.|ready|The firm chose Microsoft 365 Copilot but few licensed users use it.]] I\'m trying to understand why it hasn\'t helped.',
            ch: [
              {t: 'Could you walk me through how an advisor prepares meeting notes and follow-up today? Where have they tried Copilot, and what made them stop using it?', q: 'best', s: {d: 12, l: 10, u: 8}, next: 'w2', fb: 'You asked how advisors work rather than assuming more licenses would help. AI Assistants helps staff use artificial intelligence for tasks like drafting notes, so check Copilot setup, review effort, and reasons for low use.'},
              {t: 'I\'d recommend more Microsoft 365 Copilot licenses so every advisor can use the same notes process.', q: 'bad', s: {d: -8, p: -8, l: -6}, next: 'w2', fb: 'More licenses do not explain why staff avoid the tool. Check access, useful tasks, training, and review work first.'},
              {t: 'I could show your advisors how quickly Copilot drafts meeting notes. Once they see the speed, I think they\'ll start using it.', q: 'good', s: {u: 5, p: 2}, next: 'w2', fb: 'A demonstration can show the task, but speed alone cannot settle trust or whether the process fits. Include advisors who currently avoid the tool.'}
            ]
          },
          w2: {
            c: 'We need meeting notes, a list of agreed tasks, and a draft follow-up email. [[Some clients don\'t want us to record meetings.|red|Client consent limits which information the process can collect.]] Could we do something like Morgan Stanley\'s Debrief tool?',
            ch: [
              {t: 'We can learn from Debrief, but I can\'t promise the same setup here. Let\'s follow your client consent policy and offer notes without recording. I\'d keep advisor review before sending follow-up or updating records.', q: 'best', s: {u: 10, p: 10, t: 12}, next: 'w3', fb: 'Debrief uses client consent and advisor review. The option without recording is our suggested training rule, not a claim about Debrief, so check your own connections and policies.'},
              {t: 'Since the recording would stay in your systems, we could record by default and let clients opt out later.', q: 'bad', s: {t: -12, p: -10}, next: 'w3', fb: 'Where a system runs does not establish consent. Apply the firm\'s consent rules and approve the process before collecting meeting information.'},
              {t: 'Could your compliance team write a consent notice? Once clients agree, we could send Copilot\'s follow-up messages automatically.', q: 'meh', s: {p: 3, t: -6}, next: 'w3', fb: 'Consent allows collection but does not prove a message is accurate or suitable. Keep advisor approval before sending messages or saving information that affects decisions.'}
            ]
          },
          w3: {
            c: '[[Advisors worry that a draft could make something they only discussed sound like investment advice.|red|Review must keep the original meaning and leave advice decisions with advisors.]] I don\'t want those Copilot licenses to sit unused. How could CDW help us get this right?',
            ch: [
              {t: 'I\'d look at our AI Assistants services. M365 Copilot Deployment Accelerator could help with setup, and Copilot Adoption and Change Management could help us address low use. We\'d plan around your notes process and keep advisor approval of drafts.', q: 'best', s: {p: 12, u: 10, t: 8}, next: 'w4', fb: 'M365 Copilot Deployment Accelerator helps set up Microsoft 365 tools and starts with up to 50 users. Neither service promises a ready-made recording connection for wealth firms or investment advice without advisor approval.'},
              {t: 'I\'d use Agents & Workflow Automation now. We could have software update portfolios and email advice after each meeting without waiting for an advisor.', q: 'bad', s: {p: -12, t: -12, u: -8}, next: 'w4', fb: 'Agents & Workflow Automation is not available yet. The source does not show investment advice without advisor approval, so keep that approval and check available services.'},
              {t: 'I\'d suggest Copilot Adoption and Change Management. We can focus on training your advisors and keep your current notes process.', q: 'good', s: {p: 5, l: 2}, next: 'w4', fb: 'The service may help with low use. Plan it around advisor tasks, trust, and review needs rather than assuming today\'s process already fits.'}
            ]
          },
          w4: {
            c: '[[I can recruit 12 advisors and bring compliance plus the person responsible for Microsoft 365 Copilot.|buy|This fictional test group and the decision makers are available.]] How will we know whether to offer this notes process to more advisors?',
            ch: [
              {t: 'Let\'s meet with them to plan the available services and agree how we\'ll check consent, advisor approval, corrections, total time including review, and actual use. If note quality or trust gets worse, we should stop or change the process.', q: 'best', s: {d: 8, p: 12, t: 10, u: 6}, next: 'end', fb: 'The fictional group of 12 informs the discussion, not how many users a service includes. Expansion needs agreed evidence about quality and use rather than licenses or assumed savings.'},
              {t: 'I\'d count how many notes Copilot produces. If it writes more notes, your advisors are getting more benefit.', q: 'meh', s: {d: 2, p: -4}, next: 'end', fb: 'Counting drafts cannot show consent, accuracy, or useful time saved. Include corrections, approval work, and actual use in the decision.'},
              {t: 'Once the first few drafts look right, I\'d expand to all 180 advisors. We can write consent and review rules afterward.', q: 'bad', s: {t: -12, p: -10}, next: 'end', fb: 'A few good drafts do not prove the process is safe. Set consent and approval rules before expansion, not afterward.'}
            ]
          }
        },
        outcomes: {
          great: {title: 'The advisors agree to a planning meeting.', text: 'In this fictional result, Daniel brings advisors, compliance, and the person responsible for Microsoft 365 Copilot. They check current AI Assistants services against consent, advisor approval, setup, and staff use. Nobody promises investment advice without advisor approval or a completed connection to other systems.'},
          ok: {title: 'The idea needs evidence of useful results.', text: 'Daniel wants better notes but still needs a complete plan for consent, review, or staff use. Settle those questions before counting drafts as benefits.'},
          poor: {title: 'Client trust stops the proposal.', text: 'The firm rejects automatic collection or advice. Return to client consent, advisor decisions, and a process that staff can test.'}
        },
        useCases: ['Draft meeting notes, agreed tasks, and follow-up messages with client consent and advisor approval.', 'Check setup and training needs for advisors using the firm\'s chosen Microsoft 365 Copilot.'],
        offering: {headline: 'Check AI Assistants for setup and staff use.', steps: ['Confirm the chosen tools, Microsoft 365 Copilot licenses, access rules, and how advisors prepare notes today.', 'Consider M365 Copilot Deployment Accelerator for Microsoft 365 setup problems. Its initial group covers up to 50 users.', 'Consider Copilot Adoption and Change Management if staff rarely use the tools for useful work.', 'Plan any connection that collects meeting information separately. The playbook does not promise a ready-made process for wealth firms.', 'Keep client consent and advisor approval before software drafts enter client messages or records that affect decisions.']},
        takeaways: ['If few people use a tool, ask about their work before selling more licenses.', 'Client consent and advisor approval are separate requirements.', 'A company\'s public example shows its process. It does not guarantee another firm the same result.', 'Measure total time including review and whether staff use the tool for useful work.', 'Do not sell services that are not available yet. Do not promise investment advice without advisor approval.']
      },
      {
        id: 'fsi-payments', full: false, difficulty: 2, turns: 4,
        title: 'Customers should not repeat their dispute details.',
        persona: {
          name: 'Priya Shah', initials: 'PS', role: 'Vice President of Customer Operations', company: 'Clearwater Payments', industry: 'Payments services',
          size: 'This fictional processor has 2 service centers and 240 support agents.',
          quote: 'Callers tell the phone system about a dispute, then have to tell our staff again. I want to stop that, not let software move customer money.',
          goals: ['Pass callers\' dispute details to staff so customers don\'t have to repeat them.', 'Check whether automation fits the phone system the service centers actually use.', 'Agree when staff take over if problems arise and leave dispute decisions with people.'],
          personality: ['She focuses on customer frustration.', 'She says clearly who can make which decisions.', 'She wants a first step with results she can measure.'],
          pains: ['In this fictional example, 18,000 support calls arrive monthly.', 'Customers repeat dispute details when transferred.', 'The seller does not yet know which system the firm chose for handling customer calls and messages.', 'Leaders confuse automatic customer contact with emerging payments by artificial intelligence agents, software that can take actions for someone.']
        },
        mission: 'Find which phone system the customer uses and what dispute details reach staff after a transfer. Check whether FirstTouch AI fits before recommending it, and keep dispute and payment decisions separate.',
        start: 'p1',
        nodes: {
          p1: {
            c: '[[Customers tell our phone system about a dispute and then have to repeat everything when someone answers.|pain|Dispute details collected during first contact aren\'t reaching the staff who answer.]] We handle about 18,000 calls a month. My team can\'t keep asking people to start over. Can you help us fix that?',
            ch: [
              {t: 'Which phone system do you use? When a call reaches your team, what information can they already see?', q: 'best', s: {d: 12, l: 10, p: 10}, next: 'p2', fb: 'You checked the phone system and what reaches staff before recommending a product. FirstTouch AI covers the first minute of contact on supported systems and isn\'t a fit before the customer chooses a system.'},
              {t: 'FirstTouch AI serves financial services firms like yours. I\'d propose it now, and we can work out the phone system details later.', q: 'bad', s: {p: -10, d: -8, t: -6}, next: 'p2', fb: 'Serving this industry does not prove the service fits the customer\'s system. Confirm that system and the first-contact job before proposing FirstTouch AI.'},
              {t: 'What does each call cost, and how often do you transfer callers? We can work out whether automation would save you money first.', q: 'good', s: {d: 6, u: 4}, next: 'p2', fb: 'Asking about benefits helps, but you still do not know whether the customer qualifies. Ask which system they chose alongside those measurements.'}
            ]
          },
          p2: {
            c: '[[We chose Five9 and the person who manages it can join us.|ready|Choosing a supported system lets the seller check whether FirstTouch AI fits.]] We want the reason for the call to reach our staff, not software deciding disputes. Does CDW have something that could help with that?',
            ch: [
              {t: 'FirstTouch AI covers the first minute of customer contact on supported systems, including Five9. Could we meet with your system owner to check current coverage, how details reach staff, identity checks, and when a person takes over?', q: 'best', s: {p: 12, u: 10, t: 8}, next: 'p3', fb: 'You kept the first-minute limit and checked the system. A supported system does not prove every connection, identity check, or dispute task is supported.'},
              {t: 'Since FirstTouch AI supports Five9, it should be able to resolve the whole dispute for you.', q: 'bad', s: {p: -10, u: -8, t: -10}, next: 'p3', fb: 'The source describes the first minute, not resolving the whole dispute. Supporting a system does not give authority to decide payments or disputes.'},
              {t: 'I\'d start with Contact Center Strategic Consulting to map your whole customer experience. We can leave the first-minute details until later.', q: 'good', s: {p: 5, d: 3}, next: 'p3', fb: 'Broader advice may help if the whole process needs changing. This buyer chose a system and a specific job, so explain and check that job before expanding the work.'}
            ]
          },
          p3: {
            c: 'Our chief executive read about artificial intelligence agents making payments for people. [[She wants to know whether FirstTouch AI could issue refunds without a person approving them.|red|Agents are software that can take actions for someone. Their use in payments is emerging and differs from automatic first contact.]] Is that something we could plan for later?',
            ch: [
              {t: 'That would be a separate discussion. I can\'t promise FirstTouch AI can issue refunds without a person. Payments by agents still raise questions about consent, who covers losses, fraud, and proving which agent is acting. Let\'s keep your approved rules for disputes and moving money.', q: 'best', s: {u: 10, p: 10, t: 12}, next: 'p4', fb: 'You separated automatic contact from payments by artificial intelligence agents. Those payments are emerging without evidence of widespread use, and the source does not show refunds without people for FirstTouch AI.'},
              {t: 'Yes. If our first-minute trial succeeds, that would prove we can safely add refunds without human approval.', q: 'bad', s: {t: -12, p: -10, u: -8}, next: 'p4', fb: 'Learning why someone called does not test moving money. Refund decisions need separate evidence and rules, and the source does not support that guarantee.'},
              {t: 'We can put refunds in your future plans. Your technical team can decide who has authority later.', q: 'meh', s: {u: 2, p: -4, t: -4}, next: 'p4', fb: 'A future idea is not a promise that the service can do it. Discuss unresolved consent, loss responsibility, fraud, and identity now with risk and operations teams.'}
            ]
          },
          p4: {
            c: '[[The system owner, dispute lead, security, and finance can meet next week.|buy|The people who own the decisions can plan first contact.]] We want fewer repeat questions without weakening checks of who customers are. What will we measure?',
            ch: [
              {t: 'Let\'s measure repeated questions, transfers, failed identity checks, customer experience, and full costs before a trial. With those owners, we can check FirstTouch AI\'s current coverage and agree when staff take over or we stop the test.', q: 'best', s: {d: 8, p: 12, t: 10, u: 6}, next: 'end', fb: 'The meeting can agree on a specific job and how to test it. Measure failed identity checks and whether staff receive useful details, not just speed.'},
              {t: 'We can lower your cost per call. I\'ll choose the measurements that show those savings most clearly.', q: 'bad', s: {t: -12, p: -8}, next: 'end', fb: 'Promising savings and picking favorable measurements cannot support a sound business case. Agree on measurements before the trial and include the costs of failures.'},
              {t: 'I\'d measure how long first contact takes and how many calls it handles. If those improve, we could let the software decide disputes too.', q: 'meh', s: {d: 3, p: -4, u: -4}, next: 'end', fb: 'Time and call counts leave out identity checks and whether staff receive useful details. They also cannot justify adding dispute decisions that affect customers.'}
            ]
          }
        },
        outcomes: {
          great: {title: 'The team books a meeting about first contact.', text: 'In this fictional result, Priya brings the Five9 system owner, disputes, security, and finance together. They check FirstTouch AI for the first minute and agree how to pass details on and measure results. Authority to issue refunds stays separate.'},
          ok: {title: 'The team still needs to agree on the details.', text: 'The team sees a possible improvement to first contact but still needs evidence about systems, identity checks, passing details to staff, or costs. Answer those questions before proposing automation.'},
          poor: {title: 'The payment promise harms the meeting.', text: 'The customer rejects a proposal that treats system support as permission for automatic refunds or dispute decisions. Return to the first minute and check the chosen system.'}
        },
        useCases: ['Check whether FirstTouch AI can collect dispute details and pass them to staff on the customer\'s chosen supported phone system.', 'Investigate help with dispute documents separately. The source has little evidence for that work specifically in payments.'],
        offering: {headline: 'Check FirstTouch AI against the chosen supported system.', steps: ['Confirm the chosen system. The source lists Amazon Web Services, Cisco, Dialpad, Five9, Google, NiCE, RingCentral, and Zoom.', 'Confirm what FirstTouch AI currently covers in the first minute and how it connects to the actual system.', 'Agree on identity checks, who handles problems, and who decides disputes with operations and security.', 'Use Contact Center Strategic Consulting if the questions reveal a problem with the wider customer experience.', 'Before expanding, measure whether staff receive useful details, identity checks work, customers have a better experience, and full costs improve.']},
        takeaways: ['Serving an industry does not prove a service supports the customer\'s system.', 'FirstTouch AI covers first contact, not a promise to handle the whole dispute.', 'Payments by artificial intelligence agents are emerging. These agents can take actions for someone, but authority and consent questions remain unanswered.', 'Measure identity checks and how well details reach staff alongside time and cost.', 'A successful trial of one job does not approve a different job that affects customers\' money or decisions.']
      }
    ]
  },
  jeopardy: {
    categories: [
      {
        name: 'Listen for what the customer needs.',
        clues: [
          {q: 'An insurer says, "Staff spend all morning copying claim numbers from scanned forms into our claims system." Does this reveal repetitive document work, a chosen software product, or readiness to settle claims automatically?', a: 'They are redoing document work. Ask where it happens, how long it takes, and what goes wrong.', why: 'Copying claim numbers gives you a specific task to investigate, not proof of accurate records or permission to settle claims. Ask where staff repeat work and what they need to check.'},
          {q: 'A bank says, "We tested 6 artificial intelligence tools, but nobody is responsible for getting them ready for staff to use." Should you list new equipment, ask why the trials stopped, or copy a competitor first?', a: 'Ask why the trials stopped. Find a useful job, a sponsor, and someone responsible for running it.', why: 'Artificial intelligence trials can stop because of data, system connections, approvals, skills, or ownership. More equipment cannot settle those questions, but Private AI Launch Workshop can help explore them.'},
          {q: 'A wealth firm bought Microsoft 365 Copilot to help advisors write notes after client meetings, but few use it. Should you ask about buying more licenses, why advisors avoid Copilot, or whether it can give investment advice alone?', a: 'The tools are chosen but rarely used. Ask about tasks, access, training, and review work.', why: 'AI Assistants helps staff use artificial intelligence for tasks like drafting meeting notes, but low use doesn\'t prove a license shortage. Check Copilot Adoption and Change Management against advisors\' notes process and reasons for avoiding Copilot.'},
          {q: 'A bank is testing a tool that answers staff questions about lending policies. It has a sponsor and budget, but security stopped testing and nobody owns the policy documents. What shows buying interest, and which 2 decisions still need work?', a: 'A sponsor and budget show interest. Security approval and an owner for approved data are missing.', why: 'Funding artificial intelligence does not give permission to proceed, so include security and the policy owner. AI Risk Assessment can inform risks while data checks address ownership and quality, but neither guarantees approval.'},
          {q: 'A payments firm says callers repeat dispute details after transfers. It hasn\'t chosen a new phone system but wants FirstTouch AI and automatic refunds. What problem can you explore, and which 2 promises must wait?', a: 'Explore repeated questions. FirstTouch AI needs a supported system. Do not promise it can issue refunds.', why: 'FirstTouch AI needs a chosen supported system and covers first contact, not refunds. Payments by artificial intelligence agents, software acting for someone, are emerging with consent, responsibility for losses, fraud, and agent identity questions unresolved.'}
        ]
      },
      {
        name: 'Match the tool to the job.',
        clues: [
          {q: 'Claims staff sort scanned forms and copy claim numbers into the claims system before an adjuster reviews them. Should you start with help sorting and copying, automatic settlement decisions, or tools to spot trading opportunities?', a: 'Start with sorting documents and copying details. Have people review results and handle problems.', why: 'Artificial intelligence could help sort forms and copy claim numbers, but test the documents staff actually receive and keep claims decisions with people. A useful task doesn\'t prove CDW has a service ready to set it up.'},
          {q: 'A bank\'s search tool gives staff conflicting answers about lending procedures because it uses different policy versions. Should you first check software power, approved documents and who can access them, or branding for a customer assistant?', a: 'Find the approved documents, their owner, and access rules before testing staff searches.', why: 'Staff search needs approved data and help finding the right documents because software can repeat an outdated policy convincingly. References to original documents and human review help testing but cannot guarantee correct answers.'},
          {q: 'A wealth firm wants software to turn client meetings into notes, agreed tasks, and draft follow-up emails. Does the published Morgan Stanley Debrief example call for client consent and advisor review, secret recording, or automatic investment advice?', a: 'Get client consent and advisor review. Drafting notes does not mean giving advice without approval.', why: 'The 2024-06-26 disclosure describes AI @ Morgan Stanley Debrief, an artificial intelligence tool with consent and advisor review. It shows that firm\'s process, not audited returns, a ready-made CDW product, or advice without approval.'},
          {q: 'A payments team wants software to read dispute documents and agents to make payments for customers. Does research show widespread use of both, suggest document help while agent-initiated payments are emerging, or remove the need for human decisions?', a: 'Document help is suggested. Payments by artificial intelligence agents are emerging. Check each separately.', why: 'Evidence for reading payments documents is thin, so insurance examples don\'t prove payments use. The 2026-07-14 HM Treasury plan leaves consent, loss responsibility, fraud, and identity unresolved for artificial intelligence agents, software that takes actions for someone.'},
          {q: 'A bank wants one assistant to find lending policies, score transactions for fraud, and act on staff requests. Should all 3 jobs have the same freedom, have separate rules based on maturity and consequences, or skip distinctions on bank-owned computers?', a: 'Separate search, fraud prediction, and limited actions. Check data, speed, accuracy, and authority for each.', why: 'Artificial intelligence that predicts outcomes is established, while software generating answers is expanding with human review. Agents that take actions for someone remain early and need limited access, approvals, records, and a stop option even when jobs run together.'}
        ]
      },
      {
        name: 'Choose the CDW service that fits.',
        clues: [
          {q: 'A bank\'s artificial intelligence trials have stopped without a useful task or anyone responsible for putting them into operation. Should you explore priorities through Private AI Launch Workshop, install Private AI Factory immediately, or promise security?', a: 'Check Private AI Launch Workshop once you confirm what needs exploring and who must join.', why: 'Private AI Launch Workshop helps explore useful tasks, operating rules, and plans for artificial intelligence, including stopped trials. The source describes 2 days, but confirm current coverage without promising a working business service or regulatory approval.'},
          {q: 'An insurer\'s scanned claim forms contain unreadable policy numbers and duplicate pages. Should you start with AI Readiness Data Quality Assessment, buy Modern Data Platform for AI immediately, or just replace the software reading the forms?', a: 'Start with AI Readiness Data Quality Assessment.', why: 'The assessment gives scores showing readiness for artificial intelligence, a business case summary, a plan in priority order, and a leadership briefing. Modern Data Platform for AI needs it first, because moving records won\'t fix unreadable numbers.'},
          {q: 'An insurer needs approval for a claims assistant and wants to test whether attackers could trick it into leaking customer details. Should you consider AI Risk Assessment and AI LLM Penetration Testing, 2 risk assessments, or FirstTouch AI alone?', a: 'Use AI Risk Assessment for risks and rules. Check AI LLM Penetration Testing before customer launch.', why: 'Risk assessment reviews artificial intelligence rules, while attack testing checks text-generating software called a large language model. Testing covers malicious instructions, leaks, and unsafe connections, with a letter describing tests, not guaranteed security or regulatory approval.'},
          {q: 'A wealth firm bought Microsoft 365 Copilot for meeting notes but few advisors use it, and it needs help setting up an initial group. Should you offer setup and staff-use support, unavailable automation, or unlimited rollout, and what is the group limit?', a: 'Use M365 Copilot Deployment Accelerator and Copilot Adoption and Change Management. Start with up to 50 users.', why: 'AI Assistants helps staff use artificial intelligence on chosen tools like Microsoft 365 for documents and meetings. Check setup and reasons for low use separately, because neither service promises every connection needed for advisors\' meeting notes.'},
          {q: 'A bank wants help tracking artificial intelligence costs, automating staff tasks, and adding Salesforce features. It asks for FinOps for AI, AI Value Assurance, Agents & Workflow Automation, and Salesforce implementation. What can you offer from the supplied catalog?', a: 'The 3 are not available yet. Use current assessments. The catalog lists implementation for ServiceNow only.', why: 'FinOps means financial operations for managing costs, here for artificial intelligence, so confirm current availability and coverage. The catalog does not list Salesforce implementation, and assessment findings can support a business case but cannot guarantee returns.'}
        ]
      },
      {
        name: 'Check the data and the risks.',
        clues: [
          {q: 'An adjuster uses software to summarize a claim, but the summary says a policy covers a loss when it doesn\'t. Should you trust its confident wording, check the invented answer against the policy, or accept it because it lists a source?', a: 'Check the invented answer against the source. Set review rules and decide who handles errors.', why: 'An invented answer is called a hallucination, and a source reference doesn\'t prove the summary matches the policy. Check important facts against original documents and agree who reviews errors before an adjuster relies on the summary.'},
          {q: 'An advisor has access to software that records client meetings and drafts notes, but the client hasn\'t agreed to recording. Does tool access permit recording, or must the firm apply its consent rules first?', a: 'Follow consent rules before collecting information. Tool access is not consent or advisor approval.', why: 'The published Morgan Stanley Debrief example includes client consent and advisor review, which are separate checks. Apply the customer\'s own policies and approved alternatives before collecting meeting information.'},
          {q: 'A bank wants Data Governance for AI to control who owns lending records and who can read them, but wants to skip the design workshop. Should you accept, require that workshop before building, or replace data rules with more powerful software?', a: 'Start with the design workshop. Build the solution afterward.', why: 'For artificial intelligence, Data Governance for AI needs a design workshop before building. Agree who owns data, who can access it, its history, and who decides, because software cannot choose those responsibilities.'},
          {q: 'A bank says, "Our own computers and an attack-test letter mean our policy assistant has regulatory approval." Name both errors.', a: 'Running privately does not prove compliance or security. A test letter is not approval or future safety.', why: 'A letter records defined artificial intelligence tests for malicious instructions, leaks, and unsafe connections, not regulatory approval. The bank still owns approval and ongoing checks wherever the system runs.'},
          {q: 'A team says the United Kingdom 2024 survey proves fully automatic financial services are normal because 55 percent of artificial intelligence uses involved automatic decisions. What does 55 percent count, and which second number corrects the claim?', a: '55 percent counts uses with some automatic decisions, not firms. Only 2 percent of uses were fully automatic.', why: 'The Bank of England and Financial Conduct Authority survey dated 2024-11-21 covers 118 responding United Kingdom-regulated firms. This sample is not a global rate or safety standard, and on 2026-10-07 the 2026 results remained unpublished.'}
        ]
      },
      {
        name: 'Check whether the customer qualifies.',
        clues: [
          {q: 'A payments firm wants FirstTouch AI to collect callers\' dispute details, but it hasn\'t chosen a phone system. Should you offer it now, check the system choice first, or assume any phone system works?', a: 'Check the system choice first. FirstTouch AI does not fit customers who have not chosen one.', why: 'FirstTouch AI uses artificial intelligence on supported systems including Amazon Web Services, Cisco, Dialpad, Five9, Google, NiCE, RingCentral, and Zoom. Confirm current system support and connections before proposing it.'},
          {q: 'A bank has approved NVIDIA hardware but no NVIDIA AI Enterprise subscription. Can AI Factory Accelerator test policy search?', a: 'It does not qualify. It needs an approved existing system and an existing NVIDIA AI Enterprise subscription.', why: 'AI Factory Accelerator tests artificial intelligence on an existing NVIDIA DGX or approved manufacturer system with NVIDIA graphics processing units. It also requires an existing NVIDIA AI Enterprise subscription, so confirm both requirements.'},
          {q: 'A bank wants to know how much spare computing power it has. Its graphics processing units, chips for demanding calculations, use Kubernetes to organize computing work. Should you suggest NVIDIA GPU Cluster Assessment, new equipment, or FirstTouch AI?', a: 'Check whether NVIDIA GPU Cluster Assessment fits the existing system and current service coverage.', why: 'NVIDIA GPU Cluster Assessment checks existing graphics processing units managed by Kubernetes and reports current use and reserved computing power compared with actual use. It estimates spare capacity and recommends changes, but does not automatically justify buying more equipment.'},
          {q: 'A bank runs a small policy-search tool on a cloud provider\'s computers and restricts where policy data can go. Its fraud checks need answers during payments. Should you compare where each task runs separately or use one rule? Name 4 comparison factors.', a: 'Compare each job by data location, response speed, software choice, and total cost.', why: 'Check access, processing volume, and operating capacity too, with provider and customer equipment together only if needed. Small jobs may favor providers, and owning equipment guarantees neither lower costs nor security, so count licenses, operations, and review.'},
          {q: 'A bank meets AI Factory Accelerator requirements and wants it to test policy search across all 3 million archived documents, then approve staff relying on it. What does the service actually test, and which approval remains separate?', a: 'It tests an NVIDIA design with limited data, not the whole archive or approval for staff to rely on it.', why: 'The artificial intelligence test uses 1 to 2 gigabytes or up to about 5,000 documents. You get a working test, results report, operating instructions, and leadership briefing with a plan, but letting staff rely on it needs separate approval.'}
        ]
      },
      {
        name: 'Check whether the results are worth it.',
        clues: [
          {q: 'Claims staff copy claim numbers from scanned forms into the insurer\'s claims system. The insurer wants to test software that does this. Should you measure copying time and mistakes before the test, after a demonstration, or only after launch?', a: 'Measure before the trial. Agree with the owner what to measure and which results mean continuing or stopping.', why: 'Measure staff copying time and mistakes before testing the software, then again when staff use it for actual claims. Count review and corrections too, because faster copying alone doesn\'t prove savings.'},
          {q: 'Software drafts notes after an advisor\'s client meeting in 1 minute, but reviewers spend 25 minutes fixing them. Is drafting speed enough, or should the team measure total time including review and whether advisors find it useful?', a: 'Measure total time including review, corrections, and actual use. Also check consent and advisor approval.', why: 'These timings are fictional, and fast software is not the same as useful work. Review effort, quality, and actual use help decide whether to expand or change the process.'},
          {q: 'In NVIDIA\'s survey, 32 percent named document processing among the uses with the best financial returns. A seller promises a 32 percent return to a customer. What is wrong with that claim?', a: '32 percent counts respondents who named that area. It is not a financial return or a customer guarantee.', why: 'NVIDIA\'s 2026-01 report covers 839 global respondents surveyed during 2025-08 through 2025-09 via NVIDIA channels. Answers are self-reported and self-selected, not audited proof of cause and effect or a promised financial return.'},
          {q: 'A bank can\'t compare costs across its artificial intelligence projects because departments count different expenses. It asks for AI Value Assurance today. What available next step can you recommend without promising savings?', a: 'AI Value Assurance is not available yet. Use starting measures and current assessments or Accelerator results.', why: 'For artificial intelligence costs, FinOps means financial operations, and FinOps for AI is also not available yet. Count equipment, licenses, operations, and review, using assessment or AI Factory Accelerator results to inform decisions, not guarantee savings.'},
          {q: 'An insurer tests software that drafts claim summaries. It writes twice as many drafts but misses more things the policy doesn\'t cover, needs extra review, and loses users. Should you expand, check agreed limits and stop or change it, or remove reviewers?', a: 'Stop or change the trial using agreed quality and cost limits. Do not remove review to raise output.', why: 'In this fictional result, time, errors, actual use, staff effort, and costs can move differently. Consider them together, because the research reports respondents\' accounts of benefits, not audited proof or guaranteed financial returns.'}
        ]
      }
    ],
    final: {
      category: 'Agree on a next step the customer qualifies for.',
      q: 'A fictional insurer is 12 days behind on sorting claim forms and copying reference numbers for adjusters. A software trial failed on conflicting numbers. Its sponsor says using its own computers guarantees approval and savings. Name one specific job, 2 signs of need, a suitable CDW next step with owners, and one promise to reject.',
      a: 'Sort incoming documents with human review. Delays and conflicting numbers show process and data problems. Check AI Readiness Data Quality Assessment with document processing, data, compliance, security, and finance owners. Running privately guarantees neither approval nor savings.',
      why: 'Before testing artificial intelligence, get sample approval and measure sorting and copying time, errors, review effort, and full costs. People still decide settlements, so confirm what the assessment covers and its requirements before promising work.'
    }
  }
};

export default deepFreeze(fsiPack);
