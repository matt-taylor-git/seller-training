import { deepFreeze } from '../shared/pack-contract.mjs';

/** @type {import('../shared/pack-contract.mjs').ContentPack} */
const fsiPack = {
  id: 'fsi',
  revision: 2,
  label: 'Financial services',
  description: 'Find the useful task, understand the work, and earn a next step with four financial-services customers.',
  disclaimer: 'Fictional training scenarios, figures, and outcomes. Offering descriptions use an internal compilation dated 2026-10-07. Confirm current scope and availability before real use. Distribution requires separate approval.',
  roleplay: {
    scenarios: [
      {
        id: 'branch-answers', full: true, difficulty: 2, turns: 6,
        title: 'One answer at the counter',
        persona: {
          name: 'Elena Park', initials: 'EP', role: 'Head of Branch Operations', company: 'Alder Crossing Bank', industry: 'Banking',
          size: 'Fictional regional bank with 24 branches.',
          quote: "I shouldn't have to settle the same procedure question every week.",
          goals: ['Give customers consistent answers.', 'Help branch staff find instructions without calling a manager.', 'Keep procedure changes under the right owner.'],
          personality: ['She gets straight to the problem.', 'She knows the branch teams well.', 'She distrusts promises that skip the details.'],
          pains: ['Staff keep old copies of procedures alongside the staff site.', 'Operations updates the staff site but cannot control every saved copy.', 'Staff need a clear way to handle conflicting instructions.']
        },
        mission: 'Find out how staff get procedure answers today and propose a next step Elena can use.',
        start: 'counter',
        nodes: {
          counter: {
            c: "I had two branches call me yesterday about changing a customer's address. [[They gave different answers about which form to use.|pain|Staff are giving inconsistent procedure answers.]] I can't keep being the person everyone phones.",
            ch: [
              { t: 'A search assistant could give everyone the same answer. Could I show you one?', q: 'bad', s: { d: -8, l: -6, t: -6 }, next: 'reset', fb: 'A shared answer is useful only if it comes from the right instructions. You offered a solution before learning where staff look.' },
              { t: 'That sounds frustrating. What did those two branches look at before they called you?', q: 'best', s: { d: 12, l: 12, t: 8 }, next: 'folders', fb: 'You followed her example instead of asking for a general wish list. The answer can show where the inconsistency starts.' },
              { t: 'Would a refresher session on address changes help the branch teams?', q: 'good', s: { l: 3, u: 2 }, next: 'reset', fb: 'Training might help, but you do not yet know whether staff lack knowledge or have conflicting instructions.' }
            ]
          },
          folders: {
            c: "One used the staff site. The other had a PDF saved on her desktop. [[Then they asked in the branch chat, which gave them another answer.|ready|Staff have several sources and no clear way to choose between them.]] Nobody wanted to give the customer the wrong form.",
            ch: [
              { t: 'Who decides which version staff should use, and how do updates reach them?', q: 'best', s: { d: 12, l: 8, u: 6 }, next: 'authority', fb: 'You asked about authority and updates before treating every document as equally trustworthy.' },
              { t: 'Could we put the site, PDFs, and chat into one search so staff can see everything?', q: 'bad', s: { u: -8, t: -6 }, next: 'authority', fb: 'Searching more sources can spread the same conflict. First establish which instructions are approved.' },
              { t: 'How long did they spend searching before they called you?', q: 'good', s: { d: 5, l: 4 }, next: 'authority', fb: 'Search time will help measure the problem. The conflicting answers also need an owner who can settle them.' }
            ]
          },
          reset: {
            c: "I'm not sure that's the answer yet. One branch used the staff site and the other a saved PDF. [[The branch chat offered a third answer.|ready|The problem includes conflicting sources, not just finding text.]] We need to settle which answer staff should trust.",
            ch: [
              { t: 'Then we could have the assistant pick the newest file each time.', q: 'bad', s: { d: -6, u: -8, t: -8 }, next: 'authority', fb: 'The newest file is not necessarily the approved procedure. A date cannot replace the document owner.' },
              { t: "You're right, I got ahead of myself. Who decides which version staff should use, and how do updates reach them?", q: 'best', s: { d: 12, l: 8, u: 6, t: 8 }, next: 'authority', fb: 'You acknowledged the premature suggestion and returned to document authority. That gives Elena a reason to keep talking.' },
              { t: 'Could we start by counting how often the branches call you?', q: 'good', s: { d: 4, l: 3 }, next: 'authority', fb: 'The count could show the size of the problem, but it would not explain which answer staff should trust.' }
            ]
          },
          authority: {
            c: "Our operations team owns the staff site. [[That's where the approved procedure lives.|ready|There is an identified owner and an approved source.]] The trouble is that people save a copy for busy days and keep using it after we make a change.",
            ch: [
              { t: 'We should replace the staff site with a new document platform first.', q: 'bad', s: { d: -4, u: -8, p: -6 }, next: 'boundaries', fb: 'A platform change is a large prescription for a problem you have only begun to understand. It would not settle how staff use saved copies.' },
              { t: 'Could operations remind everyone to delete their old copies?', q: 'good', s: { u: 5, l: 4 }, next: 'boundaries', fb: 'That may reduce confusion now. You still need to learn how staff would reliably find and check the current procedure.' },
              { t: 'Could we test helping staff find the approved procedure, with a link back to the staff site?', q: 'best', s: { u: 12, l: 8, p: 8, t: 6 }, next: 'boundaries', fb: 'You bounded the task to finding an approved procedure. A source link helps staff check the answer, but does not guarantee it is right.' }
            ]
          },
          boundaries: {
            c: "Any new way of finding answers has to go through our risk lead. [[Some instructions are only for branch managers.|red|Access rules matter even for an internal tool.]] And if two instructions disagree, I need staff to stop and ask, not guess.",
            ch: [
              { t: 'Could your risk lead and operations owner agree access rules and what staff should do when an answer is unclear?', q: 'best', s: { d: 6, p: 12, t: 12 }, next: 'evidence', fb: 'You brought the people who own the information and risk into the decision. The proposed rules still need their review.' },
              { t: 'We can keep it inside the bank, so that should take care of the risk review.', q: 'bad', s: { p: -6, t: -12 }, next: 'evidence', fb: 'Private hosting does not guarantee security or approval. Access rules and unreliable answers still need review.' },
              { t: 'Could your risk lead review the answers after a small demonstration?', q: 'good', s: { p: 4, t: 2 }, next: 'evidence', fb: 'Reviewing examples helps, but the risk lead should shape the data and access rules before the demonstration uses bank information.' }
            ]
          },
          evidence: {
            c: "A quick answer isn't much use if it's wrong. [[I'd rather a teller take an extra minute than hand over the wrong form.|red|Accuracy matters more than search speed alone.]] How would I know this is actually helping?",
            ch: [
              { t: 'We can compare how quickly the first answer appears.', q: 'good', s: { p: 3, u: 2 }, next: 'invitation', fb: 'Speed is one measure, but Elena just explained why it is not enough. Count checking time and incorrect answers too.' },
              { t: 'We can compare correct answers and total checking time on everyday questions, including ones staff should pass to a manager.', q: 'best', s: { u: 10, p: 12, l: 10, t: 8 }, next: 'invitation', fb: 'You matched the test to Elena\'s concern. Questions that require help matter as much as questions the tool can answer.' },
              { t: "If each answer includes a source link, you can trust it without checking every example.", q: 'bad', s: { u: -6, t: -10, l: -6 }, next: 'invitation', fb: 'A link can point to an outdated or irrelevant passage. It is evidence to inspect, not proof that the answer is correct.' }
            ]
          },
          invitation: {
            c: "I can spare a branch supervisor for a short meeting. [[Operations needs to be there too, since they own the instructions.|buy|Elena can involve the people who understand the work and documents.]] What would you want us to bring?",
            ch: [
              { t: 'Please bring approved procedure examples and questions staff struggle with. Could we meet with operations and your risk lead to decide what is worth testing?', q: 'best', s: { d: 8, p: 12, t: 8 }, next: 'end', fb: 'You proposed a meeting with a concrete purpose and relevant people. That earns more than asking Elena to buy before the document questions are settled.' },
              { t: "I'll send an overview of our search options so you can pick a tool before the meeting.", q: 'good', s: { p: 3, t: 1 }, next: 'end', fb: 'An overview can help later, but choosing a tool now skips the document and risk decisions the meeting needs to address.' },
              { t: 'Bring the full procedure library and we can start the rollout from there.', q: 'bad', s: { p: -8, t: -10 }, next: 'end', fb: 'Neither the data use nor a rollout has been approved. Start with examples the bank permits you to review.' }
            ]
          }
        },
        outcomes: {
          great: { title: 'A grounded direction', text: 'Your approach gives Elena a useful basis for planning procedure search. A meeting, approved examples, and any later test still need agreement.' },
          ok: { title: 'Useful questions remain', text: 'Parts of your approach fit Elena\'s concern. Revisit document authority and how staff will check answers before proposing a test.' },
          poor: { title: 'Return to the branch problem', text: 'Your approach risks making conflicting instructions easier to find. Start again with what staff read and who approves it.' }
        },
        useCases: ['Help branch staff find and check approved procedures.', 'Identify conflicting or outdated copies for the operations owner to review.'],
        offering: {
          headline: 'Understand the documents before choosing a tool',
          steps: ['Map a recent procedure question with the branch supervisor and operations owner.', 'Agree with the risk lead which examples may be shared and who may see each procedure.', 'If document problems need structured investigation, consider AI Readiness Data Quality Assessment and confirm its current scope.', 'Agree how to compare answer quality, checking time, and escalation before a separate test.']
        },
        takeaways: ['Ask what staff looked at before offering better search.', 'Finding a document and knowing it is approved are different problems.', 'Include the document owner and risk lead before using bank information.', 'Measure correct answers and checking effort together.']
      },
      {
        id: 'claim-handoff', full: true, difficulty: 3, turns: 6,
        title: 'The file that keeps waiting',
        persona: {
          name: 'Marcus Bell', initials: 'MB', role: 'Property Claims Manager', company: 'Juniper Mutual', industry: 'Insurance',
          size: 'Fictional insurer with a regional property claims team.',
          quote: "My team is working late, and customers still want to know why their claim hasn't moved.",
          goals: ['Relieve pressure on claims staff.', 'Reduce avoidable waiting between teams.', 'Keep claim decisions with qualified adjusters.'],
          personality: ['He worries about the team.', 'He wants a practical change soon.', 'He challenges answers that sound too easy.'],
          pains: ['Coordinators copy loss dates and property addresses from incoming emails.', 'Adjusters find missing repair estimates after assignment.', 'Nobody has separated checking effort from time spent waiting for documents.']
        },
        mission: 'Understand where a claim slows down and help Marcus choose a useful first change.',
        start: 'backlog',
        nodes: {
          backlog: {
            c: "It's been a rough month. [[My claims team is staying late, but customers are still chasing us.|pain|Staff pressure and customer delays need investigation.]] I wondered if faster summaries would take some work off their hands.",
            ch: [
              { t: 'They might help. Could you walk me through one claim that got held up this week?', q: 'best', s: { d: 12, l: 12, t: 8 }, next: 'handoff', fb: 'You treated summaries as a possibility, not a diagnosis. A real claim can reveal where the delay occurs.' },
              { t: 'We could start with automatic summaries and measure how much quicker the drafts appear.', q: 'good', s: { u: 4, p: 2 }, next: 'pushback', fb: 'A small test sounds practical, but draft speed may not address the reason claims are waiting.' },
              { t: 'For straightforward claims, we could automate settlement and remove the queue.', q: 'bad', s: { d: -8, u: -8, t: -12 }, next: 'pushback', fb: 'You promised a consequential decision without understanding the work or authority. The source does not establish a ready-made autonomous settlement service.' }
            ]
          },
          handoff: {
            c: "Take a roof claim from Monday. Our coordinator copied the address and loss date from an email into the claims system. [[Then the file sat there waiting for a repair estimate.|pain|The claim waits for missing information after the copying step.]] The customer called twice while it waited.",
            ch: [
              { t: 'Could we reduce the copying first? It sounds like work the team does on every claim.', q: 'good', s: { u: 6, l: 4 }, next: 'missing', fb: 'Copying may be worth improving. You still need to understand the missing estimate before linking that change to faster claim resolution.' },
              { t: 'Who notices that the estimate is missing, and when does someone ask for it?', q: 'best', s: { d: 12, l: 8, u: 6 }, next: 'missing', fb: 'You followed the point where this claim stopped. That can reveal a useful handoff change rather than just a faster draft.' },
              { t: 'A summary of the email should give the adjuster enough to move ahead.', q: 'bad', s: { l: -8, u: -8, t: -6 }, next: 'missing', fb: 'A summary cannot supply an absent repair estimate. Moving ahead may still require information the file does not contain.' }
            ]
          },
          pushback: {
            c: "We can't move a claim along if the file is missing something. We copy the address and loss date from the customer's email. [[Then the claim waits for a repair estimate.|pain|Missing information can hold up the claim even if writing gets faster.]] That was the problem with Monday's roof claim.",
            ch: [
              { t: "You're right. Let's set my suggestion aside. Who notices the missing estimate, and when does someone ask for it?", q: 'best', s: { d: 12, l: 8, u: 6, t: 10 }, next: 'missing', fb: 'You withdrew the premature suggestion and investigated the actual wait. Recovery means changing your approach, not repeating the offer more carefully.' },
              { t: 'Then I would still start with summaries, so the adjuster can spot gaps faster.', q: 'good', s: { u: 3, l: 1 }, next: 'missing', fb: 'That is a possible use, but you have not learned who checks the file or when. Ask before deciding where summaries belong.' },
              { t: 'We could estimate the missing repair cost from similar claims and avoid waiting.', q: 'bad', s: { u: -8, t: -12 }, next: 'missing', fb: 'An estimate generated from other claims is not the missing document. You cannot assume the insurer authorizes that substitute for a claim decision.' }
            ]
          },
          missing: {
            c: "The adjuster catches it after the file is assigned. [[She sends it back to the coordinator to chase the estimate.|pain|The missing document creates a return between teams.]] I'd like us to catch that gap before an adjuster has to pick up the file.",
            ch: [
              { t: 'Could we test a check for required documents before assignment, with unclear files going to a coordinator?', q: 'best', s: { u: 12, l: 10, p: 8, t: 6 }, next: 'trial', fb: 'You matched the proposed task to the return between teams. Checking for a document does not decide the claim or invent missing information.' },
              { t: 'Could we give coordinators a checklist before changing any software?', q: 'good', s: { u: 8, p: 4, t: 4 }, next: 'trial', fb: 'A checklist may be enough to improve the handoff. Also test whether staff can apply it reliably across the files they receive.' },
              { t: 'We can require the system to fill every field before assigning a claim.', q: 'bad', s: { u: -6, t: -8 }, next: 'trial', fb: 'A filled field is not proof that the information is present or correct. Missing and uncertain information needs a visible path for people to handle.' }
            ]
          },
          trial: {
            c: "My claims lead can check flagged files. [[Some estimates arrive as clear forms, others as photos of handwritten pages.|ready|The test needs to reflect the different documents staff receive.]] I don't want a nice demonstration that falls apart on Monday morning.",
            ch: [
              { t: 'We can start with the clear forms to get a quick result, then count those results as the case for rollout.', q: 'bad', s: { u: -6, p: -6, t: -8 }, next: 'measure', fb: 'Clear forms can support a narrow test, not a claim about every file. A rollout case must account for the harder documents too.' },
              { t: 'Could your claims lead choose an approved mix of files and record missed documents, false warnings, and time spent checking?', q: 'best', s: { d: 6, u: 8, p: 12, t: 12 }, next: 'measure', fb: 'You made the test reflect the work Marcus described. Review effort and wrong warnings can erase the benefit of faster checks.' },
              { t: 'Could we show the team a few examples and ask whether the warnings look useful?', q: 'good', s: { d: 3, l: 3, p: 3 }, next: 'measure', fb: 'Staff feedback matters, but a few convincing examples do not show how often the check misses documents or creates extra work.' }
            ]
          },
          measure: {
            c: "A supervisor already tried a checklist on a few files. [[She says checking got quicker, but claims still took just as long to finish.|pain|A faster step has not yet changed total resolution time.]] I need to explain that without making her work sound pointless.",
            ch: [
              { t: 'We can call the quicker checks a reduction in claim turnaround time.', q: 'bad', s: { p: -8, t: -10 }, next: 'next', fb: 'That would misstate the result. The checks got quicker, but Marcus explicitly said total resolution time did not improve.' },
              { t: 'Could we count how many files the supervisor checks each day?', q: 'good', s: { d: 4, p: 3 }, next: 'next', fb: 'Daily volume adds context, but it does not explain the remaining wait or the time spent correcting checks.' },
              { t: "Quicker checking may still help her day. Let's measure checking and corrections separately from waiting for estimates and finishing the claim.", q: 'best', s: { d: 8, l: 10, p: 12, t: 10 }, next: 'next', fb: 'You preserved the possible local benefit without claiming faster resolution. Separate measures can show what improved and what still needs work.' }
            ]
          },
          next: {
            c: "I can make time for a short working session, not a big program. [[The coordinator and adjuster leads both need to see what happens to a file.|buy|The handoff owners can help define the next step.]] What would we try to settle?",
            ch: [
              { t: "We'd decide where to check for missing documents, who handles uncertain files, and what to measure. Could both leads bring approved examples of a completed file and a returned one?", q: 'best', s: { d: 8, p: 12, t: 8 }, next: 'end', fb: 'The meeting has a decision to make and evidence to examine. It does not depend on a claim that a new tool will fix every delay.' },
              { t: 'We can review a summary demonstration and decide if the team likes the writing.', q: 'good', s: { p: 2, u: 2 }, next: 'end', fb: 'Useful writing is only one possible benefit. Marcus has described a handoff problem that a summary demonstration might never test.' },
              { t: 'We can agree a date to automate all intake and settle the detailed rules afterward.', q: 'bad', s: { l: -6, p: -8, t: -10 }, next: 'end', fb: 'A date does not resolve missing information or review responsibility. Agree those rules before committing to automation.' }
            ]
          }
        },
        outcomes: {
          great: { title: 'The handoff comes into focus', text: 'Your approach separates useful checks from promises about settling claims faster. The working session and any test still require agreement.' },
          ok: { title: 'A task needs sharper boundaries', text: 'Your approach identifies some useful work, but the handoff and measures need another look. Do not turn faster drafts into a claim about faster resolution.' },
          poor: { title: 'The wait is still unexplained', text: 'Your approach risks changing a step without addressing why the file waits. Return to the coordinator and adjuster handoff.' }
        },
        useCases: ['Check whether required claim documents are present before assignment, with people handling uncertain files.', 'Explore copying loss dates and addresses only after measuring that work separately.'],
        offering: {
          headline: 'A working meeting before a service proposal',
          steps: ['Trace approved examples with the coordinator and adjuster leads.', 'Decide where a completeness check belongs and who handles uncertain files.', 'Agree what information may be used in a test with the insurer\'s data and risk owners.', 'Compare checking time, corrections, missing documents, and total resolution time separately.']
        },
        takeaways: ['Treat the customer\'s proposed solution as a hypothesis.', 'Repetitive copying does not prove that staff are correcting earlier mistakes.', 'A summary cannot supply a missing document.', 'Time saved at one step is not proof of faster claim resolution.']
      },
      {
        id: 'advisor-notes', full: false, difficulty: 2, turns: 4,
        title: 'Notes after everyone leaves',
        persona: {
          name: 'Priya Shah', initials: 'PS', role: 'Director of Advisory Teams', company: 'Linden Row Wealth', industry: 'Wealth management',
          size: 'Fictional wealth firm with 18 advisors.',
          quote: "I want advisors to leave on time without wondering whether the client record is right.",
          goals: ['Keep reliable notes and follow-up after client meetings.', 'Reduce evening writing and corrections.', 'Respect client choices about recording.'],
          personality: ['She values client trust.', 'She is open to tools that help advisors.', 'She dislikes adoption targets that ignore the work.'],
          pains: ['Advisors correct who promised each action in draft notes.', 'Some clients decline recording.', 'Training covered tool controls rather than reviewing actual meeting notes.']
        },
        mission: 'Find out why the chosen tool has not relieved evening work and agree how to judge useful help.',
        start: 'evenings',
        nodes: {
          evenings: {
            c: "We bought Microsoft 365 Copilot to help with notes after client meetings. [[Advisors are still finishing those notes at home.|pain|The purchase has not yet relieved the reported evening work.]] I'd rather understand why than send another reminder to use it.",
            ch: [
              { t: 'Could we set a weekly usage target so advisors give it a fair chance?', q: 'bad', s: { d: -6, l: -8, t: -6 }, next: 'corrections', fb: 'A usage target ignores Priya\'s concern. More use does not establish that the tool helps advisors finish reliable notes.' },
              { t: 'What happens between the end of a meeting and a note the advisor is ready to save?', q: 'best', s: { d: 12, l: 12, t: 8 }, next: 'corrections', fb: 'You asked about the whole task. That leaves room for problems in collecting, drafting, checking, or saving the note.' },
              { t: 'Could we give advisors a demonstration of useful prompts for meeting notes?', q: 'good', s: { u: 4, p: 3 }, next: 'corrections', fb: 'Examples may help, but you do not yet know which part of the work keeps advisors late.' }
            ]
          },
          corrections: {
            c: "The draft helps some of them get started. [[They still spend time fixing who promised to do each action.|pain|Corrections are part of the work, not an optional extra.]] Some clients don't want a recording at all, and I don't want them feeling pushed.",
            ch: [
              { t: 'Could we keep a non-recording route and have advisors check actions before saving notes or sending follow-up?', q: 'best', s: { u: 12, l: 10, p: 8, t: 12 }, next: 'habits', fb: 'You respected client choice and kept advisor approval separate from consent. Those are proposed work rules, not proof that every draft will be correct.' },
              { t: 'Could advisors check the action list at the end of the day?', q: 'good', s: { u: 4, t: 2 }, next: 'habits', fb: 'A review step helps, but end-of-day checking could preserve the evening workload. It also leaves the recording concern unanswered.' },
              { t: 'Since the firm approved the tool, we can record every meeting and let clients opt out afterward.', q: 'bad', s: { l: -8, t: -12 }, next: 'habits', fb: 'Tool approval is not client consent. Resolve the firm\'s consent rules before collecting meeting information.' }
            ]
          },
          habits: {
            c: "There are a few advisors who find it useful. [[Others open a draft, see the corrections, and write their own instead.|pain|Use varies because the result is not consistently useful to advisors.]] Our training showed the buttons, but not how to check a real meeting note.",
            ch: [
              { t: 'We should buy more licenses so the rest of the firm can build the habit.', q: 'bad', s: { l: -8, u: -6, p: -8 }, next: 'usefulness', fb: 'More licenses do not fix the correction work or the training gap. Learn from the current advisors before expanding.' },
              { t: 'Could the advisors who like it show the rest of the team what they do?', q: 'good', s: { d: 4, u: 5, p: 3 }, next: 'usefulness', fb: 'Peer examples may help. Include advisors who abandon drafts so the discussion does not overlook the reasons it fails them.' },
              { t: 'Could we compare both groups\' work first? Copilot Adoption and Change Management may help with work-specific support, if its current scope fits.', q: 'best', s: { d: 10, u: 8, p: 12, t: 8 }, next: 'usefulness', fb: 'You linked a source-described service to an observed support gap without assuming training explains every problem. Confirm scope before offering a specific notes solution.' }
            ]
          },
          usefulness: {
            c: "I don't need a report saying everyone logged in. [[I need reliable records and fewer evenings spent fixing them.|buy|Priya defines useful results in terms of quality and total work.]] What would you put in front of the advisors?",
            ch: [
              { t: "I'd suggest comparing finished notes, correction time, and total work after meetings. Could advisors and compliance agree the consent and review rules first?", q: 'best', s: { d: 8, u: 6, p: 12, l: 8, t: 8 }, next: 'end', fb: 'You proposed evidence Priya can use. Include advisors with different experiences and count review effort rather than draft speed alone.' },
              { t: 'We could count generated notes each week to see whether use is growing.', q: 'good', s: { p: 3, u: 1 }, next: 'end', fb: 'Generated notes show activity, not whether the records are reliable or evening work has fallen.' },
              { t: 'We could send each draft directly to the client through an automatic follow-up process.', q: 'bad', s: { u: -8, p: -8, t: -12 }, next: 'end', fb: 'Automatic sending skips the corrections Priya described. The source does not establish autonomous advice or approval-free client follow-up.' }
            ]
          }
        },
        outcomes: {
          great: { title: 'Usefulness before usage', text: 'Your approach connects the chosen tool to reliable records and less evening work. Consent rules, service fit, and a trial still need agreement.' },
          ok: { title: 'Support needs more discovery', text: 'Your approach offers some help, but usage alone cannot show value. Revisit corrections and the different advisor experiences.' },
          poor: { title: 'More activity, uncertain benefit', text: 'Your approach risks asking advisors to use a tool without making their work easier or their records more reliable.' }
        },
        useCases: ['Draft meeting notes and follow-up for advisor checking under the firm\'s consent rules.', 'Compare useful work patterns across advisors before expanding adoption support.'],
        offering: {
          headline: 'Support the work on the chosen platform',
          steps: ['Observe how advisors collect information, draft, check, and save notes.', 'Agree a non-recording route and approval rules with advisors and compliance.', 'Consider Copilot Adoption and Change Management for the support gap, subject to current scope.', 'Check any proposed recording or records integration separately rather than assuming it is included.']
        },
        takeaways: ['A purchased tool is not evidence of useful adoption.', 'Client consent and advisor approval are separate decisions.', 'Review time belongs in the measure of total work.', 'Do not promise a ready-made integration from an offering name.']
      },
      {
        id: 'dispute-transfer', full: false, difficulty: 2, turns: 4,
        title: "Please don't make me say it again",
        persona: {
          name: 'Owen Reed', initials: 'OR', role: 'Head of Customer Service', company: 'Clearpath Payments', industry: 'Payments',
          size: 'Fictional payments provider with a customer service team.',
          quote: "By the time callers reach us, they're annoyed about explaining the dispute twice.",
          goals: ['Stop asking callers to repeat details after transfer.', 'Give staff the information they need to start helping.', 'Keep dispute decisions with the authorized team.'],
          personality: ['He focuses on the caller\'s experience.', 'He prefers concrete examples.', 'He asks whether a small change can solve a bigger problem.'],
          pains: ['The chosen Five9 phone system passes a caller number but not the dispute reason to staff.', 'Nobody has checked where the captured reason is lost.', 'Faster intake does not settle refund authority.']
        },
        mission: 'Find out what callers already said and what reaches staff, then agree a bounded next step.',
        start: 'repeat',
        nodes: {
          repeat: {
            c: "Callers tell us why they're disputing a payment before we transfer them. [[Then our people ask them to explain it all again.|pain|The caller repeats information across the transfer.]] They think nobody was listening, and I can see why.",
            ch: [
              { t: 'Which phone system have you chosen, and what information reaches the employee after the transfer?', q: 'best', s: { d: 12, l: 12, t: 8 }, next: 'transfer', fb: 'You asked about the system and the missing handoff together. That is more useful than choosing a product from the complaint alone.' },
              { t: 'Could we shorten the phone menu so callers reach someone sooner?', q: 'good', s: { u: 4, l: 2 }, next: 'transfer', fb: 'A shorter menu might reduce waiting. It would not necessarily stop callers from repeating what they already said.' },
              { t: 'We can replace the opening with an assistant that resolves the dispute before transfer.', q: 'bad', s: { d: -8, u: -8, t: -10 }, next: 'transfer', fb: 'You expanded a handoff problem into dispute resolution before checking the system or decision authority.' }
            ]
          },
          transfer: {
            c: "We chose Five9 last year. [[The employee gets the caller's number, but not the reason for the dispute.|ready|The platform is chosen, and a specific piece of information is missing at transfer.]] I don't know whether we lose the reason or never pass it across.",
            ch: [
              { t: 'Five9 is on the supported list, so FirstTouch AI will carry the full dispute across without further changes.', q: 'bad', s: { p: -8, t: -10 }, next: 'authority', fb: 'Platform support does not guarantee this handoff or integration. Confirm current scope and trace what the existing setup captures and passes.' },
              { t: "Let's trace one approved example with your phone owner. FirstTouch AI covers the first minute of contact, but we'd need to confirm this handoff fits.", q: 'best', s: { d: 10, u: 12, p: 12, t: 8 }, next: 'authority', fb: 'You placed a source-described offer behind discovery. Five9 is listed as supported in the supplied source, but that does not establish this integration.' },
              { t: 'Could we first show staff everything the phone system already stores?', q: 'good', s: { d: 4, u: 4 }, next: 'authority', fb: 'Checking existing information may help. Access should follow the task and the firm\'s rules rather than exposing every stored detail.' }
            ]
          },
          authority: {
            c: "That missing reason is one thing I want fixed. [[But people really want their money back.|pain|Better intake and a refund decision are different customer needs.]] Could a better start to the call mean we refund straightforward disputes right away?",
            ch: [
              { t: 'Could we focus on passing the reason correctly first? Refund decisions need separate rules and approval from whoever owns disputes.', q: 'best', s: { u: 10, p: 8, l: 8, t: 12 }, next: 'compare', fb: 'You acknowledged the broader need without giving intake software refund authority. FirstTouch AI\'s described scope does not prove it can decide or issue refunds.' },
              { t: 'Could we add refund automation once the transfer test works?', q: 'good', s: { u: 2, p: 1 }, next: 'compare', fb: 'It can be a separate discovery topic, but a successful transfer test would not establish permission or readiness for refunds.' },
              { t: 'Yes, a good intake answer should let us refund small disputes automatically.', q: 'bad', s: { u: -8, t: -12 }, next: 'compare', fb: 'The size of a dispute does not establish refund authority. The source does not support that promise for FirstTouch AI.' }
            ]
          },
          compare: {
            c: "I want to start with the transfer problem. [[If callers repeat less but staff miss important details, we haven't improved much.|red|The handoff must preserve useful information as well as reduce repetition.]] How would we check that?",
            ch: [
              { t: 'We can compare average call length before and after the change.', q: 'good', s: { p: 3, u: 2 }, next: 'end', fb: 'Call length is useful context, but a shorter call can still lose details or force a caller to repeat them.' },
              { t: 'We can count every automated opening as a successfully handled dispute.', q: 'bad', s: { l: -8, p: -8, t: -10 }, next: 'end', fb: 'An automated opening does not resolve a dispute. Count the actual handoff result rather than treating tool activity as success.' },
              { t: 'Could your phone owner and dispute supervisor compare repeated questions, missing details, and staff checking time on approved calls before and after?', q: 'best', s: { d: 8, u: 6, p: 12, l: 10, t: 8 }, next: 'end', fb: 'You matched the evidence to Owen\'s concern and named the people who can judge it. The proposed comparison is not a promised service result.' }
            ]
          }
        },
        outcomes: {
          great: { title: 'A clear handoff to investigate', text: 'Your approach keeps the caller\'s repeated explanation in focus. The team still needs to verify the transfer, service fit, and test permissions.' },
          ok: { title: 'The result needs a clearer measure', text: 'Your approach offers some useful ideas. Check what reaches staff and avoid treating shorter calls as resolved disputes.' },
          poor: { title: 'The promise outran the evidence', text: 'Your approach risks promising resolution before understanding the transfer. Keep refund authority separate and investigate the missing reason first.' }
        },
        useCases: ['Explore preserving the dispute reason through first contact and transfer.', 'Compare what staff receive with what callers already supplied.'],
        offering: {
          headline: 'Qualify the handoff before FirstTouch AI',
          steps: ['Trace an approved call example with the phone owner and dispute supervisor.', 'Confirm current FirstTouch AI scope on the chosen Five9 platform before recommending it.', 'Agree what information may pass to staff and how they check uncertain details.', 'Compare repetition, missing details, and checking time while leaving refund authority separate.']
        },
        takeaways: ['Ask what crosses the transfer, not just which tool is installed.', 'A supported platform does not prove that a particular handoff is ready.', 'First contact is not the same task as deciding a refund.', 'Measure the caller\'s problem rather than only the call length.']
      }
    ]
  },
  jeopardy: {
    categories: [
      {
        name: 'Hear the problem',
        clues: [
          { q: 'Claims staff copy loss dates from forms into a claims system every day. What does this tell you, without assuming errors?', a: 'There is repetitive work worth asking about, not proven rework.', why: 'Ask how much time copying takes and whether corrections occur. Repetition alone does not establish that staff are doing the same work again after a mistake.' },
          { q: 'A branch manager says staff put callers on hold to find a procedure. What would you ask next?', a: 'What do staff search, and where does the search slow down?', why: 'Follow a recent example before naming a search tool. The delay could involve finding, choosing, or checking the procedure.' },
          { q: 'A wealth firm bought Microsoft 365 Copilot for meeting notes. Advisors still write after hours. What should you explore before offering more training?', a: 'What happens between the meeting and the finished note?', why: 'Evening work may reflect poor drafts, review effort, or habits. Training is one possibility, not a diagnosis established by the purchase.' },
          { q: "A bank's board wants an artificial intelligence plan, but nobody has agreed to own it. What does the board request establish?", a: 'It establishes urgency, not a confirmed sponsor.', why: 'Ask who will own the decision and what result the board expects. Pressure does not prove that someone has accepted responsibility or committed resources.' },
          { q: 'A payments manager wants a new phone menu because callers repeat dispute details after transfer. Which problem should you investigate first?', a: 'Find out what callers already say and what information reaches staff.', why: 'The proposed menu is a possible solution. Trace the transfer before deciding whether the menu, the handoff, or something else needs changing.' }
        ]
      },
      {
        name: 'Find a useful task',
        clues: [
          { q: 'Insurance adjusters read long claim files to prepare a short account of events. They must still decide each claim. What bounded task might help?', a: 'Draft a summary for the adjuster to check against the file.', why: 'A draft may help with reading and writing. It does not establish authority to approve the claim or invent missing information.' },
          { q: 'Branch staff need approved address-change instructions while helping customers. What task could you explore without giving the tool authority to change accounts?', a: 'Help staff find the approved procedure and check its source.', why: 'Finding instructions is different from changing a customer record. Document authority, access, and answer quality still need checking.' },
          { q: 'Advisors want help with meeting notes and follow-up emails, but they must approve advice. What would you keep inside the first test?', a: 'Draft notes and follow-up for advisor review, not automatic advice.', why: 'Agree consent and review rules before using meeting information. A useful draft does not authorize sending it or acting on it without approval.' },
          { q: 'An insurer already produces quick claim summaries. Files still wait for missing repair estimates. What task is worth exploring before making summaries faster?', a: 'Flag missing estimates before the file reaches an adjuster.', why: 'The stated delay concerns absent information. A completeness check may help staff request it earlier, but the test must show whether it changes the wait.' },
          { q: 'Payment staff receive no dispute reason after transfer. Refund rules are still unsettled. Which task gives a bounded starting point?', a: 'Preserve the dispute reason at transfer, with staff checking it.', why: 'The missing reason is a known handoff problem. Refund automation introduces a separate authority decision that the firm has not settled.' }
        ]
      },
      {
        name: 'Ask what is missing',
        clues: [
          { q: 'An insurer wants help copying loss dates into its claims system. You have not seen the incoming documents. What should you ask to understand the input?', a: 'Where do the dates come from, and what do those documents look like?', why: 'Source formats and missing or unclear dates affect the task. Do not assume every document resembles a clean demonstration form.' },
          { q: 'A bank has two versions of an address-change procedure with conflicting instructions. What must you establish before using them for search?', a: 'Which version is approved, and who can decide that?', why: 'A model cannot settle document authority from a file date alone. The owner must resolve the conflict and how future changes reach staff.' },
          { q: 'A payments system records the dispute reason, but the next employee cannot see it after transfer. What would you inspect together?', a: 'Trace one approved call from capture through transfer to the employee screen.', why: 'The reason exists somewhere, so do not assume callers need another question. Trace where it stops reaching the next person.' },
          { q: 'A claims manager says checking a file takes 10 minutes. You want to compare a new check fairly. What is missing from that measure?', a: 'Ask which work the 10 minutes includes, such as searching and corrections.', why: 'A fair comparison needs the same start and end points. Faster checking can hide extra work elsewhere if the measure excludes it.' },
          { q: 'A processor wants help with the first minute of customer calls but has not chosen a phone system. What must happen before recommending FirstTouch AI?', a: 'Settle the platform choice and confirm current service fit.', why: 'The supplied source excludes customers without a platform decision. A supported platform is still only part of checking the proposed task and integration.' }
        ]
      },
      {
        name: 'Handle the risk',
        clues: [
          { q: 'A draft claim summary includes a loss date that appears nowhere in the file. What should the adjuster do with that date?', a: 'Treat it as unsupported and check the source before using it.', why: 'Confident wording is not evidence. Record the error and decide how uncertain or missing facts should reach a person for review.' },
          { q: 'An advisor has access to a meeting-recording tool, but the client has not consented. What should happen before recording?', a: "Resolve client consent under the firm's rules before collecting the recording.", why: 'Tool access is not consent. Advisor approval of a later note is another decision and cannot replace permission to collect meeting information.' },
          { q: 'A bank search test gives branch staff answers from manager-only procedures. What must the team address before expanding the test?', a: 'Enforce access rules and test that restricted material stays restricted.', why: 'Internal use is not permission for every employee to see every document. Correct answers can still expose information to the wrong people.' },
          { q: 'A bank wants an AI Risk Assessment to replace its own approval decision for a staff assistant. How should the seller respond?', a: 'The assessment informs risk decisions. It does not grant approval.', why: 'The bank still owns its approval process. Confirm current assessment scope rather than promising compliance or guaranteed security.' },
          { q: 'A payments test passes dispute details accurately to staff. The manager now wants automatic refunds. Does the successful test justify that change?', a: 'No. Refund authority and risks need a separate decision.', why: 'Evidence for transferring information does not establish permission to move money. Keep the new task separate even when the first test succeeds.' }
        ]
      },
      {
        name: 'Earn the next step',
        clues: [
          { q: 'A claims manager offers files containing customer details for an initial discussion. What should you agree before accepting them?', a: 'Agree which examples may be shared and how to protect customer information.', why: 'Use approved examples that still help explain the work. A willing manager does not settle every data-use or access rule.' },
          { q: 'Claim files return from adjusters to coordinators for missing documents. The teams disagree about when gaps get noticed. Who should join the next meeting, and what should they examine?', a: 'Invite both handoff owners with approved examples of returned and completed files.', why: 'The disagreement concerns work across teams. Comparing actual examples can establish where a check belongs and who handles gaps.' },
          { q: 'A wealth firm chose Microsoft 365 Copilot. Advisors have access, but training skipped how to review meeting notes. What support could you explore?', a: 'Explore Copilot Adoption and Change Management after confirming current scope.', why: 'The stated gap concerns using the chosen tool in daily work. Observe correction effort too, rather than assuming support will solve every issue.' },
          { q: 'A bank needs a board update in 6 weeks. Procedure documents and risk approvals remain unchecked. What next step can you offer without promising a launch?', a: 'Offer a dated review of document readiness, risks, and what a test must prove.', why: 'A decision plan gives the board something concrete without turning a deadline into evidence that the tool is ready.' },
          { q: 'A bank has several artificial intelligence ideas, no agreed task, and privacy concerns. What should a first working session settle?', a: 'Agree one useful task, its information needs, and the people who must decide.', why: 'Private AI Launch Workshop may fit this exploration, subject to current scope. A working session does not commit the bank to a deployment or hosting choice.' }
        ]
      },
      {
        name: 'Judge the results',
        clues: [
          { q: 'Claims staff will test help copying loss dates from scanned forms into a claims system. What should they measure before the test?', a: 'Measure current copying and checking time, including errors and corrections.', why: 'Agree the same measures for the test with the claims lead. Without a starting comparison, faster-looking output does not show a useful improvement.' },
          { q: 'An advisor note now takes 3 minutes to draft and 12 to check. The old process took 10 minutes total. Has this saved time?', a: 'No. Total work is 15 minutes, which is 5 minutes longer.', why: 'Draft speed is not net time saved. Compare equivalent finished notes and include review and corrections in both measures.' },
          { q: 'Payment calls are shorter after a change, but callers still repeat their dispute details after transfer. What result has not been demonstrated?', a: 'Less repetition at transfer has not been demonstrated.', why: 'Measure repeated questions and missing details at the handoff. Shorter calls alone do not show that staff received the information they needed.' },
          { q: 'An insurance test saves checking time on clear forms but misses documents in handwritten files. What should happen before a wider rollout?', a: 'Test a representative mix and agree how people handle failures.', why: 'The result supports only the tested conditions. Include errors and review effort for difficult files rather than extending the best result to all claims.' },
          { q: 'Claim intake is faster, but files still wait for repair estimates and total resolution time is unchanged. What can you honestly report?', a: 'The intake step improved. Faster claim resolution is not yet shown.', why: 'Keep local benefits separate from the overall result. Measure the remaining wait and correction effort before making broader value claims.' }
        ]
      }
    ],
    final: {
      category: 'A useful first meeting',
      q: 'Claims staff copy loss dates from emails. Adjusters return files when repair estimates are missing. The manager asks for faster summaries, but nobody has measured the work. Propose a first task to explore, the people to involve, and how to judge it.',
      a: 'Explore checking for missing estimates before assignment. Involve coordinator and adjuster leads. Compare missed documents, checking and correction time, and total resolution time. Treat faster summaries as an untested idea, not a promised fix.',
      why: 'The returned files support investigating a completeness check. The proposed meeting and measures are discovery steps, not proof that automation will reduce delays or permission to settle claims.'
    }
  }
};

export default deepFreeze(fsiPack);
