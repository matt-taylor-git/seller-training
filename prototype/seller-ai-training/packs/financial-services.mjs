import { deepFreeze } from '../shared/pack-contract.mjs';

// Supplied financial-services-pack.json; only the display label was changed.
// Source SHA-256: aeabb3505a3509dda4c4410f87c4df8ed7375fa543e2b1af160bf61a77c8c08e
/** @type {import('../shared/pack-contract.mjs').ContentPack} */
const fsiV2Pack = {
  "id": "financial-services",
  "revision": 1,
  "label": "FSI v2",
  "description": "Practice AI discovery and positioning with fictional bank, credit union, insurance, payments and wealth customers.",
  "disclaimer": "Fictional training scenarios and companies. CDW offer names come from the AI Imperatives Power Plays as of October 2026; confirm current scope and pricing before quoting. Industry statistics are self-reported survey results, not audited ROI.",
  "roleplay": {
    "scenarios": [
      {
        "id": "fsi-cfo",
        "full": true,
        "difficulty": 3,
        "turns": 7,
        "title": "Six AI Tools and No Answers",
        "persona": {
          "name": "Linda Okafor",
          "initials": "LO",
          "role": "Chief Financial Officer",
          "company": "Prairie Shield Mutual Insurance",
          "industry": "Property & Casualty Insurance",
          "size": "$780M written premium · 6 states · 1,400 employees",
          "quote": "I've approved six AI line items this year. Tell me what I got for any of them.",
          "goals": [
            "Bring the expense ratio down without layoffs",
            "Get control of AI spending that's scattered across departments",
            "Speed up commercial quotes so agents stop sending business elsewhere"
          ],
          "personality": [
            "Numbers-first",
            "Blunt",
            "Allergic to hype",
            "Fair if you're straight with her"
          ],
          "pains": [
            "Six AI tools bought by different departments; the usage-based AI bill tripled in a year",
            "Commercial underwriters re-key broker submissions by hand; quotes take six days",
            "Only about 60% of commercial submissions ever get a quote",
            "Underwriting data lives half in the policy system, half in spreadsheets and email",
            "A claims chatbot pilot stalled after eight months"
          ]
        },
        "mission": "Earn a skeptical CFO's trust, tie AI to a number she owns, and turn scattered AI spend into one governed, measurable first step.",
        "start": "f1",
        "nodes": {
          "f1": {
            "c": "Let me save us both some time. I've approved six AI line items this year. [[Claims bought a chatbot, marketing bought a writing tool, IT has some cloud AI service, and my usage bill has tripled.|red|AI sprawl: lots of spend, no owner, no measurement]] [[Nobody can tell me what we got for any of it.|pain|Can't prove AI ROI: the missing piece is the business case, not more technology]] So before you pitch me number seven, tell me why I should keep listening.",
            "ch": [
              {
                "t": "That's fair, and I'm not here to sell you a seventh. If you had to cut three of those six tomorrow, which ones would you keep, and how would you decide?",
                "q": "best",
                "s": {
                  "d": 12,
                  "l": 10,
                  "t": 12
                },
                "next": "f2",
                "fb": "You took her frustration seriously and turned it into discovery. Her answer tells you what 'value' means to her, which you'll need for the business case."
              },
              {
                "t": "Totally fair. What are the two or three numbers you're measured on this year?",
                "q": "good",
                "s": {
                  "d": 8,
                  "l": 2,
                  "t": 4
                },
                "next": "f2",
                "fb": "Pivoting to her metrics is smart, but you skipped right past the AI sprawl she just described. That was your opening."
              },
              {
                "t": "We partner with Microsoft, AWS, Google and NVIDIA, so we can help you pick the best platform going forward.",
                "q": "meh",
                "s": {
                  "p": 2,
                  "t": -5,
                  "l": -5
                },
                "next": "f1b",
                "fb": "She didn't ask about platforms. She asked what she got for her money. Partner breadth matters later, not in your first answer."
              },
              {
                "t": "You're in good company. Industry research says 89% of financial firms see higher revenue from AI, so you're on the right track.",
                "q": "bad",
                "s": {
                  "t": -12,
                  "l": -8,
                  "d": -6
                },
                "next": "f1b",
                "fb": "That number comes from a vendor survey where firms reported their own results. It isn't audited ROI. Quoting it to a CFO who just asked for proof is how you lose her."
              }
            ]
          },
          "f1b": {
            "c": "[[That's what the last three vendors said.|red|Trust slipping: she's lumping you in with the AI vendors she already regrets]] Look, I'm measured on our expense ratio. I can't add people, and I'm not cutting the ones I have so I can pay for more software.",
            "ch": [
              {
                "t": "Understood, and that's fair. Let's forget the tools for a minute. Where are your people spending the most time on manual, repetitive work right now?",
                "q": "best",
                "s": {
                  "d": 10,
                  "l": 8,
                  "t": 8
                },
                "next": "f2",
                "fb": "Good recovery. You dropped the pitch and asked an open question tied to the constraint she just gave you."
              },
              {
                "t": "AI can bring that expense ratio down a lot. Most carriers see 30% savings.",
                "q": "bad",
                "s": {
                  "t": -10,
                  "p": -4
                },
                "next": "f2",
                "fb": "Another number you can't back up. Earn the right to talk about savings by using her numbers, not generic ones."
              },
              {
                "t": "Would it help if I shared how another carrier pulled all their AI tools together?",
                "q": "good",
                "s": {
                  "p": 4,
                  "t": 2
                },
                "next": "f2",
                "fb": "A story can help, but it's early. You don't know her biggest pain yet, so you can't pick the right one."
              }
            ]
          },
          "f2": {
            "c": "I'd keep the claims one if anyone could prove it saves adjusters time. But here's what actually keeps me up at night. [[Commercial quotes take us six days. Independent agents send their best accounts to whoever quotes first.|pain|Revenue pain: slow quoting is losing business to competitors]] [[Our underwriters spend half their day re-keying broker submissions into the policy system.|pain|Manual, document-heavy work: a strong fit for AI that reads documents, with people reviewing the output]]",
            "ch": [
              {
                "t": "Six days when the competition is faster, and half your underwriters' time on data entry. That's money on both sides. Roughly how many submissions come in a month, and how many never get quoted at all?",
                "q": "best",
                "s": {
                  "d": 12,
                  "l": 12,
                  "u": 8
                },
                "next": "f3",
                "fb": "You played back her words and dug in to put a number on the pain. That's the raw material for a business case a CFO will believe."
              },
              {
                "t": "That's a great fit for AI that reads submissions and fills in the policy system. Carriers are doing this today.",
                "q": "good",
                "s": {
                  "u": 12,
                  "d": -2,
                  "p": 4
                },
                "next": "f3",
                "fb": "Right use case! But you jumped to the answer before you had any numbers, so you still can't show her what it's worth."
              },
              {
                "t": "Have you thought about hiring a few more underwriting assistants?",
                "q": "meh",
                "s": {
                  "u": -6,
                  "p": -6
                },
                "next": "f3",
                "fb": "She told you she can't add headcount. This also walks right past a clear AI opportunity."
              },
              {
                "t": "We could build a chatbot so agents can check on their quote status.",
                "q": "bad",
                "s": {
                  "u": -8,
                  "l": -8
                },
                "next": "f3",
                "fb": "A chatbot doesn't fix the re-keying, which is the real problem. That's leading with a solution instead of listening."
              }
            ]
          },
          "f3": {
            "c": "About 2,200 submissions a month. [[We quote maybe 60% of them. The rest just sit until the agent gives up.|buy|Value she can measure: lost premium she can put a number on]] They come in as PDFs, spreadsheets, scanned loss runs, you name it. [[And our underwriting data is half in the policy system and half in spreadsheets and people's inboxes.|ready|Data readiness cue: scattered, ungoverned underwriting data]]",
            "ch": [
              {
                "t": "So 40% of submissions never even get a quote. That's premium walking out the door before we count a single underwriter hour. The spreadsheets-and-inboxes part matters too, because AI is only as good as the data behind it. Who owns that underwriting data today, and has anyone checked how clean it is?",
                "q": "best",
                "s": {
                  "l": 12,
                  "u": 8,
                  "d": 8,
                  "p": 6
                },
                "next": "f4",
                "fb": "You summed up the value AND caught the data warning. Now data quality work is part of the plan instead of a surprise that sinks the pilot later."
              },
              {
                "t": "Today's AI handles PDFs, spreadsheets and scans, and it can feed right into your policy system.",
                "q": "good",
                "s": {
                  "u": 6,
                  "p": 6,
                  "l": -2
                },
                "next": "f4",
                "fb": "True and reassuring, but you skipped her warning about messy data. That risk will come back to bite you."
              },
              {
                "t": "Great. So if you quote all 2,200, you'll grow premium by 40% this year.",
                "q": "bad",
                "s": {
                  "t": -12,
                  "p": -6
                },
                "next": "f4",
                "fb": "Over-promising to a skeptic. Not every submission is business she'd want to write anyway. Build the case with her, don't guarantee it."
              }
            ]
          },
          "f4": {
            "c": "Owned by nobody, honestly. And it gets better. [[My CIO wants to buy a rack of GPUs and build our own AI.|red|Hardware-first thinking: figure out the right place to run each workload before anyone buys gear]] [[Our CISO will want to know exactly where policyholder data goes before anything happens.|red|Security gate: bring the CISO in early]] I'm not signing off on hardware I don't understand.",
            "ch": [
              {
                "t": "Then let's not start with hardware. Where AI should run depends on the workload: how sensitive the data is, how much you'll use it, how fast it needs to be, and what it costs. For a workload your size, a governed cloud service might be the smarter answer, and we can show you the math both ways. I'd also want your CISO involved from day one. Could we get both of them in the room?",
                "q": "best",
                "s": {
                  "p": 12,
                  "t": 12,
                  "l": 8
                },
                "next": "f5",
                "fb": "You recommended choosing where AI runs one workload at a time instead of selling hardware, which is exactly what a CFO wants to hear. And you brought the CISO in early. That's how a trusted advisor sounds."
              },
              {
                "t": "We're an NVIDIA Elite Partner, so we can get your CIO great pricing on GPUs.",
                "q": "meh",
                "s": {
                  "p": 4,
                  "t": -6
                },
                "next": "f5",
                "fb": "It's a real credential, but the wrong moment. She just said she won't sign off on hardware she doesn't understand. Lead with control, governance and value, not GPUs."
              },
              {
                "t": "Maybe we leave the CISO out until we've proven the value?",
                "q": "bad",
                "s": {
                  "t": -12,
                  "p": -8
                },
                "next": "f5",
                "fb": "A side project with policyholder data at a regulated insurer is a huge red flag. Going around security kills deals and your credibility."
              }
            ]
          },
          "f5": {
            "c": "Okay. So what are you actually proposing? [[I'm not funding another open-ended pilot.|red|Budget scar: avoid open-ended or giant proposals]] [[But if you can show me a real number within a quarter, I can find the money.|buy|Budget available for fast, measurable value]]",
            "ch": [
              {
                "t": "Here's what I'd suggest. Start with a two-day, fixed-fee Private AI Launch Workshop with you, your CIO and your CISO to pick one use case, probably submission intake, and agree on how we'll measure it. At the same time, a data quality assessment on your underwriting data so we know what we're working with. Then a pilot on your most common submission types, with numbers measured before and after: quote turnaround, re-keying hours and quote rate. If it doesn't move those numbers, you'll know fast.",
                "q": "best",
                "s": {
                  "p": 15,
                  "u": 8,
                  "t": 8
                },
                "next": "f6",
                "fb": "Right-sized, fixed in scope and tied to her numbers. It speaks directly to her stalled-pilot scar and gives her a way to judge success."
              },
              {
                "t": "We'd start with a pilot on submission intake and see what we learn.",
                "q": "good",
                "s": {
                  "p": 5,
                  "u": 4
                },
                "next": "f6",
                "fb": "Right direction, but 'see what we learn' is exactly how her claims chatbot stalled. Agree on success measures up front."
              },
              {
                "t": "Our AI transformation program covers strategy, data, platform and a dozen use cases. It's the best way to get value at scale.",
                "q": "bad",
                "s": {
                  "l": -12,
                  "p": -8,
                  "t": -6
                },
                "next": "f6",
                "fb": "She just told you she won't fund anything open-ended. This shows you weren't listening."
              },
              {
                "t": "We could do a free proof of concept so there's no risk to you.",
                "q": "meh",
                "s": {
                  "p": -2,
                  "t": 2
                },
                "next": "f6",
                "fb": "Free proofs of concept rarely get leadership attention or make it to production. A small, paid, fixed-scope engagement with clear measures beats free."
              }
            ]
          },
          "f6": {
            "c": "And once it's live? [[I don't have anyone who can babysit AI models,|pain|Skills gap: position ongoing support and managed services]] [[and my underwriters are already asking if they're being replaced.|red|Adoption risk: fear of job loss, so plan for change management]]",
            "ch": [
              {
                "t": "Two parts. After go-live, CDW can provide ongoing support and managed services: watching accuracy, tuning it and keeping it secure, so you're not hiring data scientists. For your underwriters, the honest message is that the AI handles the data entry, they review it and spend their time actually underwriting. A person stays in the loop on every decision, and we'd build change management into the plan.",
                "q": "best",
                "s": {
                  "p": 12,
                  "t": 10,
                  "l": 6
                },
                "next": "f7",
                "fb": "You handled both concerns: ongoing support for the skills gap and change management for her people. That's how pilots make it to production."
              },
              {
                "t": "We'll train your IT team so they can support it.",
                "q": "good",
                "s": {
                  "p": 4,
                  "l": -2
                },
                "next": "f7",
                "fb": "Training helps, but she just told you she doesn't have the people, and you ignored her underwriters' worries."
              },
              {
                "t": "Honestly, you could probably run commercial underwriting with half the staff.",
                "q": "bad",
                "s": {
                  "t": -12,
                  "l": -8
                },
                "next": "f7",
                "fb": "She raised her team's fear and you confirmed it. That sinks adoption and her trust in you."
              }
            ]
          },
          "f7": {
            "c": "Alright. [[You're the first one this year who didn't try to sell me a platform.|buy|Trust earned: she's open to a next step]] What happens next?",
            "ch": [
              {
                "t": "Let's get an hour on the calendar next week with you, your CIO, your CISO and your head of commercial underwriting. I'll bring a draft business case built on your numbers, 2,200 submissions and a 60% quote rate, plus a one-page summary for your CISO on how policyholder data would be protected.",
                "q": "best",
                "s": {
                  "p": 10,
                  "t": 8,
                  "d": 4
                },
                "next": "end",
                "fb": "A specific next step with the right people, and each thing you're bringing answers a concern she raised. Strong close."
              },
              {
                "t": "I'll send you a proposal by Friday.",
                "q": "good",
                "s": {
                  "p": 4
                },
                "next": "end",
                "fb": "Fine, but it's just you and her. A proposal without the CIO, CISO and underwriting leader on board will stall."
              },
              {
                "t": "Can we get a signature on the full pilot this week?",
                "q": "bad",
                "s": {
                  "t": -10,
                  "p": -4
                },
                "next": "end",
                "fb": "Too much, too soon, for a skeptical buyer who still needs her CIO and CISO on board."
              }
            ]
          }
        },
        "outcomes": {
          "great": {
            "title": "Workshop booked with the CIO and CISO",
            "text": "Linda books the session, invites her CIO, CISO and head of underwriting, and asks you to bring the business case. You're on track for a paid workshop and assessment."
          },
          "ok": {
            "title": "Interested but cautious",
            "text": "Linda asks for a proposal but hasn't brought anyone else in. Without the CIO and CISO on board, this could stall."
          },
          "poor": {
            "title": "Filed with the other six",
            "text": "Linda thanks you and says she'll 'circle back after budget season.' To her, you sounded like every other AI vendor this year."
          }
        },
        "useCases": [
          "AI-assisted submission intake for commercial underwriting: read broker submissions, loss runs and schedules, pre-fill the policy system, and have an underwriter review every file",
          "Foundation: underwriting data quality and ownership",
          "Later: one view of AI spend and results across departments, so every tool has an owner and a number"
        ],
        "offering": {
          "headline": "Private AI Launch Workshop → Data Quality Assessment → Measured pilot → Ongoing support",
          "steps": [
            "Private AI Launch Workshop (two days, fixed fee): pick the first use case and agree on how to measure it with the CFO, CIO and CISO",
            "AI Readiness Data Quality Assessment on underwriting data: scorecard, business case and action plan",
            "Submission-intake pilot on the most common submission types, measured on quote turnaround, re-keying hours and quote rate",
            "Hosting chosen for this workload (cloud or on-prem) with the cost math shown, plus a security review for the CISO",
            "Change management for underwriters, then ongoing support and managed services after go-live"
          ]
        },
        "takeaways": [
          "With a skeptical CFO, ask about what she's already spent before pitching anything new.",
          "Don't quote industry survey numbers as proof. Build the case on the customer's own numbers.",
          "Lead with control, governance and measurable value, not GPUs. Where AI runs is a per-workload decision.",
          "Bring security and finance in early. In financial services, they decide whether anything ships.",
          "Every pilot needs a 'before' number and a clear target, or it becomes the next line item nobody can explain."
        ]
      },
      {
        "id": "fsi-ops",
        "full": true,
        "difficulty": 2,
        "turns": 7,
        "title": "\"Can AI Agents Do Our KYC?\"",
        "persona": {
          "name": "Marcus Bell",
          "initials": "MB",
          "role": "SVP, Bank Operations",
          "company": "Cardinal Ridge Bank",
          "industry": "Regional Banking",
          "size": "$6.5B assets · 48 branches · 1,100 employees",
          "quote": "I want AI agents doing our KYC reviews. Our CEO keeps asking why we're not.",
          "goals": [
            "Open new business accounts in days, not three weeks",
            "Clear the AML alert backlog before the next exam",
            "Get real value from the Copilot licenses the bank already bought"
          ],
          "personality": [
            "Action-oriented",
            "Process-minded",
            "Impatient",
            "Protective of his team"
          ],
          "pains": [
            "Commercial account opening takes 15 business days; KYC analysts chase documents by email",
            "About a third of onboarding files get sent back at least once for missing information",
            "Bought 300 Copilot licenses last year; roughly 50 people use them",
            "Procedures exist in three versions across SharePoint, shared drives and binders",
            "AML alert reviews are three weeks behind"
          ]
        },
        "mission": "Find the real work underneath the 'agents' request, bring compliance in as a partner, and land a governed first step the board will believe.",
        "start": "o1",
        "nodes": {
          "o1": {
            "c": "Thanks for coming in. I'll cut right to it. [[I want AI agents doing our KYC reviews. Our CEO heard a big bank is doing it and asked why we aren't.|buy|Executive interest: pressure from the top creates urgency and a likely sponsor]] [[Right now it takes us fifteen business days to open a commercial account.|pain|Measurable pain: slow onboarding costs deposits and relationships]]",
            "ch": [
              {
                "t": "Fifteen days is a long time when a business wants to move its money now. Before we talk about agents, can you walk me through those fifteen days? Where does the time actually go?",
                "q": "best",
                "s": {
                  "d": 12,
                  "l": 10,
                  "t": 6
                },
                "next": "o2",
                "fb": "You respected his goal but went after the real problem first. Knowing where the days go tells you what AI should actually do."
              },
              {
                "t": "Agents are definitely coming to KYC. What would success look like for you a year from now?",
                "q": "good",
                "s": {
                  "d": 8,
                  "u": 2
                },
                "next": "o2",
                "fb": "Asking about success is good, but you skipped the fifteen days he handed you. That's the most measurable thing he's said."
              },
              {
                "t": "Absolutely. We can have agents handling your KYC reviews within six months.",
                "q": "bad",
                "s": {
                  "t": -10,
                  "p": -8,
                  "d": -6
                },
                "next": "o1b",
                "fb": "You promised a self-running process in a regulated area before asking a single question. In banking, that alarms everyone from compliance to the examiners."
              },
              {
                "t": "What kind of budget do you have for this?",
                "q": "meh",
                "s": {
                  "d": 2,
                  "t": -4
                },
                "next": "o2",
                "fb": "Budget matters, but asking first feels transactional. Earn it by understanding the problem."
              }
            ]
          },
          "o1b": {
            "c": "[[Six months? Our BSA officer would have a heart attack.|red|Over-promising automation in a regulated process: compliance will block it]] Look, I need to fix onboarding, not start a fight with compliance.",
            "ch": [
              {
                "t": "That's fair, and I got ahead of myself. AI making KYC decisions on its own isn't where anyone should start. Help me understand where the fifteen days go, and we'll figure out where AI can help safely.",
                "q": "best",
                "s": {
                  "d": 10,
                  "l": 8,
                  "t": 8
                },
                "next": "o2",
                "fb": "Good recovery. You owned the mistake, reset expectations and went back to discovery."
              },
              {
                "t": "Compliance always slows things down. We can help you make the case to work around them.",
                "q": "bad",
                "s": {
                  "t": -12,
                  "p": -6
                },
                "next": "o2",
                "fb": "Working around compliance at a bank is a deal-killer. He just told you he doesn't want that fight."
              },
              {
                "t": "Okay. Which part of onboarding causes the most rework?",
                "q": "good",
                "s": {
                  "d": 6,
                  "l": 4
                },
                "next": "o2",
                "fb": "Solid question, but you didn't acknowledge the overreach. A quick 'I got ahead of myself' rebuilds trust."
              }
            ]
          },
          "o2": {
            "c": "Honestly, most of it is waiting. [[Our KYC analysts email customers for ownership forms, articles of incorporation and signer IDs, then key everything into the onboarding system.|pain|Document-heavy manual work (KYC means 'know your customer' identity checks): a fit for AI that reads documents, with an analyst checking the results]] [[About a third of files get sent back at least once because something's missing.|pain|Rework rate: a clear 'before' number for a pilot]]",
            "ch": [
              {
                "t": "So the real drag is chasing documents, re-keying them and redoing files. If something could read those documents as they arrive, flag what's missing right away, and pre-fill the system for an analyst to check, how much of those fifteen days do you think would go away?",
                "q": "best",
                "s": {
                  "u": 12,
                  "l": 10,
                  "d": 8
                },
                "next": "o3",
                "fb": "You described a specific, realistic use case in plain terms, kept the analyst in charge, and let him put a value on it himself."
              },
              {
                "t": "That sounds like a fit for document extraction. We've done that before.",
                "q": "good",
                "s": {
                  "u": 10,
                  "d": -2
                },
                "next": "o3",
                "fb": "Right use case, but you could have connected it to his fifteen days and the rework rate."
              },
              {
                "t": "An AI agent could handle the whole thing, from chasing documents to approving the account.",
                "q": "meh",
                "s": {
                  "u": -4,
                  "t": -6
                },
                "next": "o3",
                "fb": "Don't promise full automation. Even in the most advanced firms, very few AI uses are fully hands-off. In banking, people approve accounts; AI prepares the file."
              },
              {
                "t": "Honestly, that sounds like a staffing problem. You may just need more analysts.",
                "q": "bad",
                "s": {
                  "u": -8,
                  "l": -6
                },
                "next": "o3",
                "fb": "You missed a clear AI opportunity and gave him an answer he can't fund."
              }
            ]
          },
          "o3": {
            "c": "Probably a week, if it actually worked. But we've been burned. [[We bought 300 Copilot licenses last year and maybe 50 people use them.|red|Adoption problem: licenses bought, value not realized]] And [[our procedures exist in three different versions across SharePoint, shared drives and actual binders.|ready|Data readiness cue: messy, duplicated content means AI gives bad answers]]",
            "ch": [
              {
                "t": "Both of those are really common, and they're connected. Copilot answers from whatever content it can find, so three versions of the same procedure means mixed answers, and people stop trusting it. Who owns your procedures today? Cleaning up and governing that content would help Copilot now and anything we build for KYC later.",
                "q": "best",
                "s": {
                  "l": 12,
                  "u": 8,
                  "d": 8,
                  "p": 6
                },
                "next": "o4",
                "fb": "You connected low adoption to messy content, which positions data governance as the fix instead of blaming the tool or the users."
              },
              {
                "t": "We have a Copilot adoption program that can get your usage up.",
                "q": "good",
                "s": {
                  "p": 6,
                  "u": 2,
                  "l": -2
                },
                "next": "o4",
                "fb": "Right offering, but you skipped the content problem, which is probably why adoption stalled in the first place."
              },
              {
                "t": "It sounds like Copilot might not be the right tool. You could switch to a different AI platform.",
                "q": "bad",
                "s": {
                  "t": -8,
                  "p": -6
                },
                "next": "o4",
                "fb": "Telling him to throw away licenses he already paid for won't win him over. The problem is content and adoption, not the tool."
              }
            ]
          },
          "o4": {
            "c": "Technically, compliance owns the procedures. Which brings me to the hard part. [[Our BSA officer and our second line of defense will have to sign off on anything that touches KYC.|red|Governance gate: the BSA officer (who owns anti-money-laundering compliance) and the bank's independent risk team must approve]] [[And the examiners asked us last cycle what AI we're using. We didn't have a great answer.|red|Regulatory pressure: they need an AI inventory and a governance story]]",
            "ch": [
              {
                "t": "Then let's bring them in now, not at the end. The examiner question actually helps you: it's a good reason to build an AI inventory and governance plan before you scale anything. We'd design it so analysts review every file, AI never approves an account, and everything is logged. Would your BSA officer be open to helping design the guardrails?",
                "q": "best",
                "s": {
                  "p": 12,
                  "t": 12,
                  "l": 6
                },
                "next": "o5",
                "fb": "You turned two blockers into a reason to act, positioned governance as part of the solution, and invited compliance to co-design."
              },
              {
                "t": "Our AI partners are SOC 2 certified, so compliance shouldn't have any concerns.",
                "q": "meh",
                "s": {
                  "p": 2,
                  "t": -4
                },
                "next": "o5",
                "fb": "A certification isn't a governance plan. Compliance and the second line still need to see how the bank controls its own AI use."
              },
              {
                "t": "Let's build a demo first and show compliance once it's working.",
                "q": "bad",
                "s": {
                  "t": -14,
                  "p": -8
                },
                "next": "o5",
                "fb": "At a bank, surprising compliance with customer data in a demo ends the project and your credibility."
              }
            ]
          },
          "o5": {
            "c": "She'd like that more than you'd think. [[If this cuts onboarding time, our Chief Banking Officer will sponsor it. Deposits are his number.|buy|Executive sponsor tied to a number he owns: deposits]] [[What about the AML alert backlog, though? We're three weeks behind.|pain|Second use case: AI-assisted AML alert review, with analysts making the call]]",
            "ch": [
              {
                "t": "AML is a strong second wave. AI can summarize each alert and pull together the related history so analysts decide faster, with the analyst still making the call. But I'd sequence it: prove onboarding first, where the documents and the measures are clear, then reuse the same governance and content work for AML. Doing both at once would stretch your team thin.",
                "q": "best",
                "s": {
                  "u": 10,
                  "p": 10,
                  "d": 4
                },
                "next": "o6",
                "fb": "You took his second pain seriously, kept people in charge, and sequenced it on a roadmap instead of piling on."
              },
              {
                "t": "Let's do both at the same time so you see value faster.",
                "q": "good",
                "s": {
                  "u": 6,
                  "p": -2
                },
                "next": "o6",
                "fb": "Ambitious, but two pilots at once will stretch a team that's just starting out. Sequence them."
              },
              {
                "t": "AML is too risky for AI. I'd leave that alone.",
                "q": "meh",
                "s": {
                  "u": -4,
                  "l": -4
                },
                "next": "o6",
                "fb": "Fraud and AML are some of the most established AI uses in financial services. Don't dismiss a real pain; put it on the roadmap."
              }
            ]
          },
          "o6": {
            "c": "Makes sense. [[Can I tell my CEO something real at the January board meeting?|buy|Deadline with board visibility: strong urgency]]",
            "ch": [
              {
                "t": "Yes, if we keep it focused. Over the next few weeks we'd put an AI inventory and governance plan together with your BSA officer, clean up the core KYC procedures, and relaunch Copilot for your onboarding team with real training. Then a document-intake pilot on one account type, measured against today: days to open, files sent back and analyst hours. In January, you'd show early results, a governance plan compliance signed off on, and a roadmap that includes AML.",
                "q": "best",
                "s": {
                  "p": 12,
                  "t": 8,
                  "u": 4
                },
                "next": "o7",
                "fb": "Realistic, it hits his board date, and it gives him a story with numbers and a compliance sign-off behind it."
              },
              {
                "t": "Absolutely. We'll have agents handling KYC in production by January.",
                "q": "bad",
                "s": {
                  "t": -10,
                  "p": -4
                },
                "next": "o7",
                "fb": "Over-promising again. Governance reviews, testing and training at a bank won't all fit in three months."
              },
              {
                "t": "January's tight. Let's see how the first phase goes.",
                "q": "good",
                "s": {
                  "t": 4,
                  "p": -2
                },
                "next": "o7",
                "fb": "Honest, but there's no plan. He needs something to tell the board, so give him realistic milestones."
              }
            ]
          },
          "o7": {
            "c": "This is a lot more practical than I expected. [[Who do you need from my side?|buy|Asking about stakeholders: a strong buying signal]]",
            "ch": [
              {
                "t": "Your Chief Banking Officer as sponsor, your BSA officer, someone from second-line risk, your onboarding team lead, and whoever runs Microsoft 365 in IT. I'll send a short agenda and a one-page governance outline for compliance ahead of time. Can we hold a date in the next two weeks?",
                "q": "best",
                "s": {
                  "p": 10,
                  "d": 4,
                  "t": 6
                },
                "next": "end",
                "fb": "Sponsor, compliance, the people doing the work and IT, each with a reason to be there. Great close."
              },
              {
                "t": "Just you for now. We can bring others in later.",
                "q": "good",
                "s": {
                  "p": -2,
                  "d": -2
                },
                "next": "end",
                "fb": "Deals that live with one enthusiastic leader often die in compliance or with the executive who controls the budget."
              },
              {
                "t": "Just procurement, so we can get the paperwork started.",
                "q": "bad",
                "s": {
                  "t": -6,
                  "p": -4
                },
                "next": "end",
                "fb": "Too early. Nobody has agreed on what's being bought, and compliance hasn't weighed in."
              }
            ]
          }
        },
        "outcomes": {
          "great": {
            "title": "Working session booked, with compliance at the table",
            "text": "Marcus books the session with his Chief Banking Officer, BSA officer and second-line risk. You've gone from 'AI agents' to a governed first step with a board story."
          },
          "ok": {
            "title": "Excited, but it's just the two of you",
            "text": "Marcus likes the plan, but compliance and his sponsor aren't involved yet. Expect it to slow down once they hear about it."
          },
          "poor": {
            "title": "Stopped by compliance",
            "text": "The BSA officer hears about the conversation secondhand and asks Marcus to pause all AI work. Your credibility with the bank takes a hit."
          }
        },
        "useCases": [
          "AI-assisted document intake for commercial KYC onboarding: read ownership forms and IDs, flag missing items, pre-fill the system for analyst review",
          "Copilot relaunch built on clean, governed procedure content",
          "Second wave: AI-written AML alert summaries that help analysts decide faster (the analyst makes the call)"
        ],
        "offering": {
          "headline": "AI governance and inventory → Content cleanup + Copilot relaunch → KYC intake pilot → AML as wave two",
          "steps": [
            "AI Risk Assessment (aligned to NIST or ISO 42001) to map the AI in use and build the governance plan examiners asked about",
            "Data Governance for AI: clean up and govern procedure content, starting with KYC (for example, with Microsoft Purview)",
            "Copilot Adoption and Change Management to relaunch Copilot with the onboarding team",
            "KYC document-intake pilot (for example, an Azure AI Foundry MVP) with analysts reviewing every file, measured on days to open and rework",
            "Wave two: AML alert summaries, plus ongoing support and managed services"
          ]
        },
        "takeaways": [
          "When a buyer asks for 'agents,' find the work underneath first. Usually it's documents, waiting and rework.",
          "Don't promise full automation. In banking, people approve; AI prepares, flags and summarizes.",
          "Low Copilot adoption is usually a content and change-management problem, not a tool problem.",
          "Examiner questions about AI are an opening for governance work, not a roadblock.",
          "Sequence use cases. Prove one, then reuse the governance and data work for the next."
        ]
      },
      {
        "id": "fsi-itdir",
        "full": true,
        "difficulty": 3,
        "turns": 7,
        "title": "The GPUs Nobody Can Explain",
        "persona": {
          "name": "Evan Brooks",
          "initials": "EB",
          "role": "Director of IT Infrastructure",
          "company": "Tollgate Payments",
          "industry": "Payments Processing",
          "size": "$310M revenue · 40,000 merchants · 2 data centers",
          "quote": "We bought GPU systems last year. Half the time they sit idle, and the other half people are waiting in line for them.",
          "goals": [
            "Show the CFO the GPU investment is paying off",
            "Keep fraud scoring fast enough for card authorizations",
            "Keep card data inside the company's own data centers"
          ],
          "personality": [
            "Practical",
            "Defensive about the GPU purchase",
            "Wary of vendors",
            "Thinks in budgets and uptime"
          ],
          "pains": [
            "Two NVIDIA DGX systems, bought for the fraud data science team, are idle half the time while other teams wait",
            "The CFO keeps asking what the GPU spend is producing",
            "Dispute analysts read through 18,000 chargeback cases a month; missed deadlines cost about $1.4M a year",
            "The data center is at its power limit; more racks means a facilities project",
            "Nobody owns AI: data science and IT each think it's theirs"
          ]
        },
        "mission": "Help an IT director prove the value of what he already owns, find a business use case worth running on it, and avoid selling hardware nobody is ready for.",
        "start": "g1",
        "nodes": {
          "g1": {
            "c": "I'll be honest, I took this meeting because [[my CFO keeps asking what we got for the GPU systems we bought last year.|red|Investment under scrutiny: he has to show value, and fast]] [[Half the time they sit idle, and the other half people are waiting in line for them.|pain|GPU usage problem: a fit for a GPU cluster assessment]]",
            "ch": [
              {
                "t": "That's a tough spot: expensive equipment and a CFO asking hard questions. When you say people are waiting in line, who's waiting, and what are they trying to run?",
                "q": "best",
                "s": {
                  "d": 12,
                  "l": 10,
                  "t": 8
                },
                "next": "g2",
                "fb": "You acknowledged the pressure he's under and asked about the people and the work, not the hardware specs. That's where the business story is."
              },
              {
                "t": "Usage problems like that are really common. Do you know your actual utilization numbers?",
                "q": "good",
                "s": {
                  "d": 8,
                  "l": 4
                },
                "next": "g2",
                "fb": "A fair question, but it jumps straight to the technical metric. Get the business story first; that's what his CFO cares about."
              },
              {
                "t": "You're in good hands. CDW is an NVIDIA Elite Partner with the DGX SuperPOD partner designation.",
                "q": "meh",
                "s": {
                  "p": 2,
                  "t": -4,
                  "l": -4
                },
                "next": "g1b",
                "fb": "Real credentials, but he didn't ask about them. He told you he has a problem with his CFO. Respond to that."
              },
              {
                "t": "Sounds like you need more GPUs. We can get you a great deal on a bigger cluster.",
                "q": "bad",
                "s": {
                  "t": -12,
                  "p": -8,
                  "l": -8
                },
                "next": "g1b",
                "fb": "He just told you half his capacity is idle and his CFO is questioning the spend. Pitching more hardware puts you on the wrong side of his CFO."
              }
            ]
          },
          "g1b": {
            "c": "[[More hardware is the last thing my CFO wants to hear about.|red|Hardware-first pitch: you just sided against his CFO]] I need to prove the stuff we already have is worth it.",
            "ch": [
              {
                "t": "Fair, and that's the right priority. Let's start with what you have. Who's using the systems today, and what are they trying to get done?",
                "q": "best",
                "s": {
                  "d": 10,
                  "l": 8,
                  "t": 8
                },
                "next": "g2",
                "fb": "Good recovery. You dropped the pitch and went back to the people and the work."
              },
              {
                "t": "Once your CFO sees what more GPUs can do, he'll come around.",
                "q": "bad",
                "s": {
                  "t": -10,
                  "p": -6
                },
                "next": "g2",
                "fb": "Doubling down on hardware. You're making his problem with the CFO worse, not better."
              },
              {
                "t": "Got it. What does your CFO need to see?",
                "q": "good",
                "s": {
                  "d": 6,
                  "t": 4
                },
                "next": "g2",
                "fb": "Good instinct to focus on the CFO, but first understand how the systems are being used today."
              }
            ]
          },
          "g2": {
            "c": "The fraud data science team runs their model training on them through our OpenShift platform. We also have the NVIDIA AI Enterprise software licenses that came with them, which nobody's really touched. [[Our fraud scoring has to happen inside the card authorization window, which is a few dozen milliseconds.|ready|Speed requirement: where AI runs matters for fraud scoring]] Now [[the disputes team and customer support want generative AI too, and card data can't leave our data centers.|buy|New demand plus a data residency rule: private AI on the systems he already owns]]",
            "ch": [
              {
                "t": "So there are two very different jobs: fraud scoring that has to stay right next to the transaction, and new generative AI demand from teams handling card data. That's actually good news for your GPU story. Of those new requests, which one would make the biggest difference to the business if it worked?",
                "q": "best",
                "s": {
                  "u": 12,
                  "l": 10,
                  "d": 8
                },
                "next": "g3",
                "fb": "You separated the two workloads, connected the new demand to his GPU problem, and asked him to pick the one with the most business value."
              },
              {
                "t": "Generative AI for disputes is a great use case. We could stand that up in the cloud quickly.",
                "q": "good",
                "s": {
                  "u": 6,
                  "l": -6
                },
                "next": "g3",
                "fb": "Right use case, but he just said card data can't leave his data centers. Listen for the rules before suggesting where things run."
              },
              {
                "t": "Let's move everything to the public cloud and stop worrying about GPUs.",
                "q": "bad",
                "s": {
                  "t": -8,
                  "l": -8,
                  "u": -4
                },
                "next": "g3",
                "fb": "That ignores his speed and data residency requirements. Where AI runs should be decided workload by workload, not with one blanket answer."
              }
            ]
          },
          "g3": {
            "c": "Disputes, for sure. [[Our analysts read through chargeback documents, merchant responses and transaction history for every case. About 18,000 cases a month.|pain|High-volume document work: AI-drafted case summaries, with analysts deciding]] [[If we miss a response deadline, we lose the case and eat the chargeback.|buy|Hard dollar cost: missed deadlines turn into direct losses]]",
            "ch": [
              {
                "t": "Eighteen thousand cases with hard deadlines. That's a very clear use case: AI that pulls the documents and transaction history together and drafts a case summary for the analyst to check. Do you know roughly how much you lose to missed deadlines today, and how long an average case takes?",
                "q": "best",
                "s": {
                  "u": 12,
                  "d": 10,
                  "l": 8
                },
                "next": "g4",
                "fb": "You named a specific use case in plain English, kept the analyst in charge, and went after the numbers that will matter to his CFO."
              },
              {
                "t": "That's a great fit for an AI tool that summarizes cases.",
                "q": "good",
                "s": {
                  "u": 10,
                  "d": -2
                },
                "next": "g4",
                "fb": "Right use case, but without the dollar figure and the time per case, there's no business case for his CFO."
              },
              {
                "t": "You could let an AI agent decide the disputes automatically.",
                "q": "bad",
                "s": {
                  "u": -6,
                  "t": -8
                },
                "next": "g4",
                "fb": "Don't promise full automation, especially when money and customers are involved. AI prepares the case; a person decides."
              }
            ]
          },
          "g4": {
            "c": "About $1.4 million a year in chargebacks we lose on deadlines alone, and a case takes around 40 minutes. [[Problem is, nobody really owns AI here. Data science thinks it's theirs, and IT thinks it's ours.|red|No clear owner: a warning sign before any big AI build]] [[And our data center is maxed out on power. Adding racks means a facilities project.|ready|Infrastructure limit: power and cooling]]",
            "ch": [
              {
                "t": "Both of those matter, and I'd rather name them now than have them sink the project later. A project like this needs a business owner, probably whoever runs disputes, with IT and data science both at the table. On power, before anyone talks about more racks, let's find out how much room you actually have on the systems you already own. You may have more capacity than you think.",
                "q": "best",
                "s": {
                  "p": 12,
                  "t": 10,
                  "l": 8
                },
                "next": "g5",
                "fb": "You raised the ownership gap honestly, suggested a business owner, and pointed him back to the capacity he already has. That's an advisor, not a box-pusher."
              },
              {
                "t": "Ownership is an internal issue. We just need IT to approve the project.",
                "q": "meh",
                "s": {
                  "p": -2,
                  "l": -4,
                  "t": -2
                },
                "next": "g5",
                "fb": "Projects with no business owner stall after the proof of concept. Help him solve it, don't sidestep it."
              },
              {
                "t": "We'll just add a few racks. Power is really a facilities problem.",
                "q": "bad",
                "s": {
                  "t": -10,
                  "l": -8,
                  "p": -4
                },
                "next": "g5",
                "fb": "He just told you power is maxed and his CFO doesn't want more hardware. You weren't listening."
              }
            ]
          },
          "g5": {
            "c": "Okay, so what would you actually do? [[I need something I can show my CFO this quarter.|buy|Deadline plus an executive audience: the CFO]] [[And our CISO will want to review anything that touches card data.|red|Security gate: plan for a security review up front]]",
            "ch": [
              {
                "t": "Two things, both short and fixed in scope. First, a GPU cluster assessment on your OpenShift environment: a real baseline of how your systems are used, how much capacity is allocated versus actually used, and how much room is left. That's your CFO's answer. Second, an AI Factory Accelerator: we pick disputes as the use case and prove it on your own GPU systems with a small set of real cases, so card data never leaves your data center. You'd get a working proof of concept, a metrics report and a roadmap to production. And we bring your CISO in from the start.",
                "q": "best",
                "s": {
                  "p": 15,
                  "u": 8,
                  "t": 8
                },
                "next": "g6",
                "fb": "Right-sized, it uses what he already owns, it gives his CFO numbers, and it respects the CISO and the data residency rule."
              },
              {
                "t": "Let's do a proof of concept on disputes and see how it goes.",
                "q": "good",
                "s": {
                  "p": 4,
                  "u": 4
                },
                "next": "g6",
                "fb": "Right direction, but too vague for a CFO audience. Tie it to measurable results and a path to production."
              },
              {
                "t": "We'd recommend a full Private AI Factory build-out with new racks, networking and power upgrades.",
                "q": "bad",
                "s": {
                  "l": -10,
                  "p": -8,
                  "t": -6
                },
                "next": "g6",
                "fb": "A big build-out is where this could go later, not where it starts. He has idle capacity, no owner and a power limit."
              },
              {
                "t": "Let's skip the CISO for now and bring them in once the proof of concept works.",
                "q": "meh",
                "s": {
                  "t": -8,
                  "p": -4
                },
                "next": "g6",
                "fb": "With card data involved, a late security review can kill the project. Bring the CISO in at the start."
              }
            ]
          },
          "g6": {
            "c": "I like that. [[But my team doesn't have time to run another platform,|pain|Skills and capacity gap: position ongoing support and managed services]] and [[the dispute analysts already think AI is coming for their jobs.|red|Adoption risk: plan for change management]]",
            "ch": [
              {
                "t": "Fair on both. After go-live, CDW can provide ongoing support and managed services for the platform, so your team isn't carrying it alone. For the analysts, the AI drafts the summary and they make the call, so every case still gets a person's review. If cases take less time, they hit their deadlines instead of drowning. We'd build that message, and the training, into the rollout.",
                "q": "best",
                "s": {
                  "p": 12,
                  "t": 10,
                  "l": 6
                },
                "next": "g7",
                "fb": "You covered the capacity gap with ongoing support and the people concern with an honest change-management message."
              },
              {
                "t": "We'll train your team to run it themselves.",
                "q": "good",
                "s": {
                  "p": 4,
                  "l": -2
                },
                "next": "g7",
                "fb": "Training is helpful, but he just said his team has no time. And you skipped the analysts' worries."
              },
              {
                "t": "With AI, you probably won't need as many dispute analysts.",
                "q": "bad",
                "s": {
                  "t": -12,
                  "l": -8
                },
                "next": "g7",
                "fb": "He raised the fear and you confirmed it. That kills adoption and makes him look bad to his peers."
              }
            ]
          },
          "g7": {
            "c": "Okay. [[I can take this to my CFO.|buy|Champion emerging: he'll carry it to the executive who controls the budget]] What do you need from me?",
            "ch": [
              {
                "t": "Let's get an hour with you, your CFO, the head of disputes, your CISO and the data science lead. I'll bring an outline of the GPU assessment so your CFO can see how we'll measure what you have, plus a one-page summary of how card data stays inside your environment for your CISO. Does next week work?",
                "q": "best",
                "s": {
                  "p": 10,
                  "t": 8,
                  "d": 4
                },
                "next": "end",
                "fb": "Every key person is in the room, and each one gets something they care about. Strong close."
              },
              {
                "t": "Just send me access to your cluster and we'll start the assessment.",
                "q": "good",
                "s": {
                  "p": 2,
                  "d": -2
                },
                "next": "end",
                "fb": "You went straight to technical access and skipped the people. Without the CFO and disputes leader on board, the results won't go anywhere."
              },
              {
                "t": "Let's put together a quote for expansion hardware so it's ready when you need it.",
                "q": "bad",
                "s": {
                  "t": -10,
                  "p": -6
                },
                "next": "end",
                "fb": "After a whole conversation about proving value on what he owns, this undoes the trust you built."
              }
            ]
          }
        },
        "outcomes": {
          "great": {
            "title": "CFO meeting booked: assessment and accelerator in play",
            "text": "Evan sets up the meeting with his CFO, head of disputes, CISO and data science lead. You're positioned as the partner who helps him prove value, not just sell gear."
          },
          "ok": {
            "title": "Interested, but no owner",
            "text": "Evan likes the ideas, but there's no business owner or CFO involvement yet. The assessment may happen, but the use case could stall."
          },
          "poor": {
            "title": "Seen as a hardware pusher",
            "text": "Evan tells his CFO a vendor tried to sell him more GPUs. Your next call goes to voicemail."
          }
        },
        "useCases": [
          "AI-drafted dispute and chargeback case summaries running on their own GPUs, with analysts making every decision",
          "GPU usage: get more out of the systems they already own before buying more",
          "Keep fraud scoring close to the transaction, where speed matters"
        ],
        "offering": {
          "headline": "GPU Cluster Assessment + AI Factory Accelerator → Private AI Factory (when ready) → Ongoing support",
          "steps": [
            "NVIDIA GPU Cluster Assessment: usage baseline, allocated vs. actually used capacity, and remaining headroom for the CFO",
            "AI Factory Accelerator: prove the disputes use case on their own GPU systems with a small set of real cases; working proof of concept, metrics report, runbook and roadmap",
            "Security review with the CISO up front; card data stays in their data centers",
            "Name a business owner (disputes), with IT and data science at the table",
            "Expand to Private AI Factory, plus power and cooling planning, only when the numbers support it; ongoing support and managed services after go-live"
          ]
        },
        "takeaways": [
          "Never answer an under-used-hardware problem by selling more hardware. Prove value on what they own first.",
          "Where AI runs depends on the workload: speed and data residency decide, not vendor preference.",
          "An AI project with no business owner isn't ready for a big build. Help them name one early.",
          "Give the IT director something to take to his CFO: a baseline and a measurable result.",
          "When card or customer data is involved, bring security in at the start."
        ]
      },
      {
        "id": "fsi-wealth",
        "full": false,
        "difficulty": 2,
        "turns": 4,
        "title": "Shadow AI at the Wealth Firm",
        "persona": {
          "name": "Andrea Costa",
          "initials": "AC",
          "role": "Chief Operating Officer",
          "company": "Harbor & Pine Wealth Partners",
          "industry": "Wealth Management",
          "size": "$14B assets under management · 85 advisors · 12 offices",
          "quote": "I just found out some of my advisors are pasting client notes into ChatGPT on their phones.",
          "goals": [
            "Give advisors more time with clients",
            "Stay on the right side of compliance and record-keeping rules",
            "Get an approved AI tool in place before something goes wrong"
          ],
          "personality": [
            "Organized",
            "Risk-aware",
            "Direct",
            "Protective of her advisors"
          ],
          "pains": [
            "Advisors spend about 45 minutes after each client meeting writing notes and follow-up emails",
            "Some advisors are using public AI tools on personal phones with client information",
            "Compliance is worried about record-keeping and client privacy",
            "CRM notes are inconsistent; some advisors barely update them"
          ]
        },
        "mission": "Treat shadow AI as both a risk and a signal, bring compliance in first, and replace the risky habit with an approved tool advisors will actually use.",
        "start": "w1",
        "nodes": {
          "w1": {
            "c": "I found out last week that [[some of our advisors are pasting client meeting notes into ChatGPT on their personal phones.|red|Shadow AI with client data: a security and compliance risk to deal with first]] I get why they're doing it. [[They spend about 45 minutes after every client meeting writing notes and follow-up emails.|pain|Measurable pain: after-meeting admin work is a strong use case]]",
            "ch": [
              {
                "t": "That's a real risk, and it's also a really clear signal: your advisors are telling you exactly what they need. How many meetings does a typical advisor have in a week, and what does compliance know so far?",
                "q": "best",
                "s": {
                  "d": 12,
                  "l": 10,
                  "t": 6
                },
                "next": "w2",
                "fb": "You saw both sides: the risk and the need behind it. Then you asked for the numbers and checked on compliance."
              },
              {
                "t": "We can help you lock down public AI tools so that stops.",
                "q": "good",
                "s": {
                  "p": 6,
                  "t": 2,
                  "d": -2
                },
                "next": "w2",
                "fb": "Security matters, but blocking alone just pushes the habit further underground. Meet the need too."
              },
              {
                "t": "Honestly, ChatGPT is pretty secure these days. I wouldn't worry too much.",
                "q": "bad",
                "s": {
                  "t": -12,
                  "p": -6
                },
                "next": "w2",
                "fb": "Client data on personal devices in a public tool is a real compliance problem. Brushing it off destroys your credibility."
              }
            ]
          },
          "w2": {
            "c": "Probably 12 to 15 meetings a week each. [[Compliance is upset. They're asking whether we could even tell regulators which AI tools are in use here.|red|Regulatory pressure: they need an AI inventory and governance]] [[And our CRM notes are all over the place. Some advisors barely update it.|ready|Data readiness cue: inconsistent client records]]",
            "ch": [
              {
                "t": "Then I'd do it in two steps. First, get visibility and guardrails in place. Then give advisors an approved tool that's better than what's on their phones: something that drafts the meeting notes and a follow-up email for the advisor to review, with the client's consent, and saves it to your CRM. That fixes your CRM problem at the same time. Some of the largest wealth firms already use tools like this.",
                "q": "best",
                "s": {
                  "u": 12,
                  "l": 10,
                  "p": 6
                },
                "next": "w3",
                "fb": "You sequenced governance before rollout, named a specific use case, and tied it to her CRM problem. Client consent shows you understand the business."
              },
              {
                "t": "An AI meeting assistant would save your advisors a ton of time.",
                "q": "good",
                "s": {
                  "u": 8,
                  "d": -2
                },
                "next": "w3",
                "fb": "Right use case, but you skipped compliance's question. In wealth management, that comes first."
              },
              {
                "t": "Let's roll out an AI tool to all 85 advisors next month and sort out compliance later.",
                "q": "bad",
                "s": {
                  "t": -12,
                  "p": -8
                },
                "next": "w3",
                "fb": "She just told you compliance is upset. A rushed firm-wide rollout makes her problem worse."
              }
            ]
          },
          "w3": {
            "c": "That's exactly what I want. [[We're a Microsoft shop, and we already set aside budget for this year.|buy|Budget plus an existing platform: a Microsoft Copilot path]] [[But my Chief Compliance Officer won't approve anything until she understands the risks.|red|Compliance gate: the CCO has to approve]]",
            "ch": [
              {
                "t": "Then let's start with her. An AI Risk Assessment would give your CCO a clear picture of the AI already in use, a clear view of the risks, and a plan built on a recognized framework like NIST. Then we roll out Copilot to a first group of advisors with the right data controls, measure time saved per meeting, and put real adoption support behind it. That makes compliance a co-designer instead of a roadblock.",
                "q": "best",
                "s": {
                  "p": 14,
                  "t": 8,
                  "u": 6
                },
                "next": "w4",
                "fb": "You led with the compliance officer's concerns, used the platform they already own, and set up a measurable first step."
              },
              {
                "t": "Microsoft is fully compliant, so your CCO shouldn't have any concerns.",
                "q": "meh",
                "s": {
                  "p": 2,
                  "t": -4
                },
                "next": "w4",
                "fb": "A vendor's compliance isn't the firm's compliance. The CCO needs to see how the firm controls its own AI use."
              },
              {
                "t": "We could start quietly with a few advisors and show her once it's working.",
                "q": "bad",
                "s": {
                  "t": -14,
                  "p": -8
                },
                "next": "w4",
                "fb": "That's just a second round of shadow AI. Going around compliance is how this whole problem started."
              }
            ]
          },
          "w4": {
            "c": "I think she'd go for that. [[What do you need from me to get moving?|buy|Clear buying signal: she's asking for next steps]]",
            "ch": [
              {
                "t": "An introduction to your CCO, your IT lead and two or three advisors who'd make good pilot users, including one of the ChatGPT fans. Then an hour next week to walk through the assessment. I'll bring a short summary of how client data stays protected.",
                "q": "best",
                "s": {
                  "p": 8,
                  "d": 4,
                  "t": 6
                },
                "next": "end",
                "fb": "Concrete, includes the right people, and turns the ChatGPT users into champions."
              },
              {
                "t": "Just sign the license order and we'll take it from there.",
                "q": "meh",
                "s": {
                  "p": -2,
                  "t": -2
                },
                "next": "end",
                "fb": "Licenses without governance and adoption support is how you end up with shelfware and an unhappy CCO."
              },
              {
                "t": "Let's start with a firm-wide AI strategy before we tackle the advisor problem.",
                "q": "bad",
                "s": {
                  "l": -6,
                  "p": -4
                },
                "next": "end",
                "fb": "She has an urgent, specific problem. A broad strategy now would slow her down while the risky habit continues."
              }
            ]
          }
        },
        "outcomes": {
          "great": {
            "title": "Meeting booked with the CCO",
            "text": "Andrea introduces you to her CCO and picks pilot advisors. The AI Risk Assessment and a first Copilot group are within reach."
          },
          "ok": {
            "title": "Interested, compliance still unsure",
            "text": "Andrea likes the idea, but compliance's concerns aren't addressed yet. Advisors keep using their phones in the meantime."
          },
          "poor": {
            "title": "Shut down by compliance",
            "text": "Compliance bans all AI tools firm-wide. Advisors are frustrated, and you're seen as part of the problem."
          }
        },
        "useCases": [
          "Advisor meeting assistant: drafts notes, action items and a follow-up email for the advisor to review, with client consent, saved to the CRM",
          "AI inventory and guardrails to replace shadow AI use"
        ],
        "offering": {
          "headline": "AI Risk Assessment → Copilot for a first group of advisors → Adoption and change management",
          "steps": [
            "AI Risk Assessment (aligned to NIST or ISO 42001): what AI is in use, the risks, and a plan for the CCO",
            "Data governance and controls so client data stays protected",
            "M365 Copilot Deployment Accelerator for a first group of advisors (up to 50 users)",
            "Copilot Adoption and Change Management, measured on time saved per meeting and CRM completeness"
          ]
        },
        "takeaways": [
          "Shadow AI is a signal: people are showing you what they need.",
          "In wealth management, compliance and client consent come first.",
          "Replace a risky tool with a better approved one instead of just blocking it.",
          "Start with a small group, measure time saved, then scale."
        ]
      },
      {
        "id": "fsi-cu",
        "full": false,
        "difficulty": 1,
        "turns": 4,
        "title": "The Phone Line That Never Stops",
        "persona": {
          "name": "Tasha Greene",
          "initials": "TG",
          "role": "VP of Member Services",
          "company": "Foxhollow Federal Credit Union",
          "industry": "Credit Union",
          "size": "$2.8B assets · 210,000 members · 24 branches",
          "quote": "Half our calls are password resets and 'where's my new debit card.' My people are worn out.",
          "goals": [
            "Cut hold times without hiring",
            "Keep good agents from quitting",
            "Protect the personal service members expect"
          ],
          "personality": [
            "Member-first",
            "Practical",
            "Stretched thin",
            "Wary of robots"
          ],
          "pains": [
            "Hold times hit nine minutes at peak",
            "The phone menu can't handle password resets, card status or dispute questions",
            "Lost a third of her agents this year",
            "A website chatbot two years ago frustrated members"
          ]
        },
        "mission": "Find the simple, high-volume calls AI can take off her agents' plates, keep the member experience personal, and get security on board before launch.",
        "start": "m1",
        "nodes": {
          "m1": {
            "c": "[[Our hold times hit nine minutes at peak,|pain|Measurable member-experience pain: contact center]] and [[about half our calls are the same few things: password resets, card status and dispute questions.|pain|Repetitive, high-volume requests: a fit for AI handling the first part of the call]]",
            "ch": [
              {
                "t": "Nine minutes is a long time to wait for a password reset. When those simple calls come in today, what happens? Does the phone menu try to handle them, or does everything go to an agent?",
                "q": "best",
                "s": {
                  "d": 12,
                  "l": 10
                },
                "next": "m2",
                "fb": "Great diagnostic question. You're finding out where the call breaks down before suggesting anything."
              },
              {
                "t": "AI can definitely handle password resets and card status.",
                "q": "good",
                "s": {
                  "u": 10,
                  "d": -2
                },
                "next": "m2",
                "fb": "Right idea! But ask how calls are handled today before you prescribe."
              },
              {
                "t": "Have you thought about adding a chatbot to your website?",
                "q": "bad",
                "s": {
                  "u": -6,
                  "l": -6
                },
                "next": "m2",
                "fb": "She's talking about phone calls. Listen to the problem in front of you, not the trend."
              }
            ]
          },
          "m2": {
            "c": "Everything goes to an agent. The phone menu's useless. [[We tried a website chatbot two years ago and members hated it.|red|Past failure: members want personal service, so make it easy to reach a person]] [[And I've lost a third of my agents this year.|pain|Agent turnover: lead with helping her people, not replacing them]]",
            "ch": [
              {
                "t": "That makes sense. Members want to reach someone who can actually help. What if AI handled just the first minute of the call: verifying the member and taking care of simple things like card status or a password reset, then passing everything else to an agent with the details already filled in? Your agents would spend their time on the calls that really need a person.",
                "q": "best",
                "s": {
                  "u": 12,
                  "l": 10,
                  "t": 6
                },
                "next": "m3",
                "fb": "You addressed the chatbot scar, kept the personal touch, and positioned AI as help for her agents."
              },
              {
                "t": "Today's AI voice agents are way better than the old chatbots.",
                "q": "good",
                "s": {
                  "u": 4,
                  "t": -2
                },
                "next": "m3",
                "fb": "Maybe true, but it brushes off her members' bad experience. Show how this one is different."
              },
              {
                "t": "With AI handling calls, you could run the center with fewer agents.",
                "q": "bad",
                "s": {
                  "t": -12,
                  "l": -8
                },
                "next": "m3",
                "fb": "She's trying to keep her agents, not cut them. Wrong message."
              }
            ]
          },
          "m3": {
            "c": "That I could sell to my CEO. [[We're on Five9, and our contract renews next year.|buy|Existing supported platform plus a timeline]] [[But our CISO is nervous after hearing about AI bots being tricked into giving out account information.|red|Security gate: test for manipulation before launch]]",
            "ch": [
              {
                "t": "Five9 is one of the platforms our FirstTouch AI offering works with, so you wouldn't have to rip anything out. And your CISO is right to ask. Before anything talks to members, we'd run an AI penetration test that tries to trick it into leaking data, and you'd get a letter documenting the results. Want to bring your CISO into the next conversation?",
                "q": "best",
                "s": {
                  "p": 14,
                  "t": 8,
                  "u": 4
                },
                "next": "m4",
                "fb": "You worked with the platform she already has, took the security concern seriously and offered a concrete way to test it."
              },
              {
                "t": "AI voice platforms have security built in, so that's covered.",
                "q": "meh",
                "s": {
                  "p": 2,
                  "t": -4
                },
                "next": "m3b",
                "fb": "A claim isn't a plan. Show how you'd test it, and invite the CISO in."
              },
              {
                "t": "Let's launch to all members first and test security once it's live.",
                "q": "bad",
                "s": {
                  "t": -12,
                  "p": -8
                },
                "next": "m3b",
                "fb": "Launching untested AI to members of a financial institution is a big risk. Test before launch, always."
              }
            ]
          },
          "m3b": {
            "c": "[[Hmm. My CISO isn't going to accept 'it's covered.'|red|Trust slipping: she needs a real answer for her CISO]] What would you tell him?",
            "ch": [
              {
                "t": "Fair. I'd tell him we'll test it before any member hears it: a penetration test built for AI that tries to trick it into giving out account information, with a written letter of the results. And we'd want him involved from the start.",
                "q": "best",
                "s": {
                  "p": 10,
                  "t": 8
                },
                "next": "m4",
                "fb": "Good recovery. You gave her something specific to take to her CISO."
              },
              {
                "t": "Let's set up a call between him and our security team so they can go through his questions.",
                "q": "good",
                "s": {
                  "p": 4,
                  "t": 2
                },
                "next": "m4",
                "fb": "Bringing in experts helps, but she asked what YOU would tell him. Have a specific answer ready: test it before launch."
              },
              {
                "t": "Tell him the vendor handles all of that.",
                "q": "bad",
                "s": {
                  "t": -8,
                  "p": -4
                },
                "next": "m4",
                "fb": "Pointing at the vendor won't satisfy a CISO at a financial institution."
              }
            ]
          },
          "m4": {
            "c": "Okay, let's do that. [[What would the first step look like?|buy|Clear buying signal: she's asking for next steps]]",
            "ch": [
              {
                "t": "Let's pull your top call reasons and volumes from Five9 and pick two to start, like card status and password resets. We'd agree up front on how to measure it: hold time, calls resolved without an agent, and member satisfaction. Then a meeting with you, your CISO and your contact center manager to scope it.",
                "q": "best",
                "s": {
                  "p": 8,
                  "d": 4,
                  "t": 4
                },
                "next": "end",
                "fb": "Focused, measurable and multi-stakeholder. A great first step."
              },
              {
                "t": "We'll send a quote for the full platform.",
                "q": "meh",
                "s": {
                  "p": -2
                },
                "next": "end",
                "fb": "A quote before scoping skips the measures and the CISO. It'll sit in her inbox."
              },
              {
                "t": "Let's automate every call type at once so you see the biggest impact.",
                "q": "bad",
                "s": {
                  "l": -6,
                  "p": -4,
                  "t": -2
                },
                "next": "end",
                "fb": "Her members already had one bad experience. Start small and prove it works."
              }
            ]
          }
        },
        "outcomes": {
          "great": {
            "title": "Scoping meeting booked with the CISO",
            "text": "Tasha pulls her call data and brings her CISO and contact center manager to the next meeting. A focused FirstTouch AI project is taking shape."
          },
          "ok": {
            "title": "Interested, security still open",
            "text": "Tasha likes the idea, but her CISO has unanswered questions. Expect a slow start."
          },
          "poor": {
            "title": "Members first, AI later",
            "text": "Tasha decides AI isn't worth the risk to member relationships right now. She'll revisit at contract renewal, maybe."
          }
        },
        "useCases": [
          "AI handles the first minute of member calls: verify the member, resolve card status and password resets, and pass everything else to an agent with the details filled in",
          "Security testing before anything talks to members"
        ],
        "offering": {
          "headline": "FirstTouch AI → AI LLM Penetration Testing → Contact center expansion",
          "steps": [
            "Pick the top two call reasons from Five9 data and set 'before' numbers",
            "FirstTouch AI on the existing Five9 platform",
            "AI LLM Penetration Testing before launch (manipulation and data leakage), with a letter of attestation",
            "Later: Contact Center Strategic Consulting and more call types"
          ]
        },
        "takeaways": [
          "Start with simple, high-volume requests, and make it easy to reach a person.",
          "Position AI as help for overloaded agents, not a replacement.",
          "Work with the platform they already own.",
          "Test customer-facing AI for security before launch."
        ]
      },
      {
        "id": "fsi-deepfake",
        "full": false,
        "difficulty": 2,
        "turns": 4,
        "title": "The Deepfake Wake-Up Call",
        "persona": {
          "name": "Robert Haines",
          "initials": "RH",
          "role": "Chief Financial Officer",
          "company": "Ashford Lane Asset Management",
          "industry": "Asset Management",
          "size": "$22B assets under management · 260 employees · 3 offices",
          "quote": "Someone used a fake video of our CEO to try to get a wire sent. Now everyone wants to talk about AI risk.",
          "goals": [
            "Make sure a fake-executive wire request never gets through",
            "Give the board a clear answer on AI risk",
            "Let the research team use AI without putting data at risk"
          ],
          "personality": [
            "Calm",
            "Controls-minded",
            "Detail-oriented",
            "Wants a plan, not a pitch"
          ],
          "pains": [
            "A deepfake video call of the CEO nearly got a $2.3M wire approved",
            "The CISO froze every AI project after the incident",
            "The research team's pilot to search internal notes and earnings transcripts is on hold",
            "Nobody has a full list of the AI tools in use"
          ]
        },
        "mission": "Listen first after a scary incident, offer practical advice beyond technology, and turn a security freeze into a governed path forward.",
        "start": "d1",
        "nodes": {
          "d1": {
            "c": "I'll be direct. [[Last month someone used a deepfake video call of our CEO to ask my treasury team to wire $2.3 million.|red|AI-powered attack: an urgent security conversation]] We caught it, barely. [[Now the board wants to know what our AI risk is, and I don't have a good answer.|buy|Board-level pressure: urgency and an executive owner]]",
            "ch": [
              {
                "t": "I'm glad your team caught it. That's a frightening one. Can you walk me through how it almost got through, and what you've changed since?",
                "q": "best",
                "s": {
                  "d": 12,
                  "l": 10,
                  "t": 8
                },
                "next": "d2",
                "fb": "You showed empathy and asked how it happened before offering anything. After an incident, listening is what earns trust."
              },
              {
                "t": "We're seeing more of these attacks every month. What exactly does the board want from you?",
                "q": "good",
                "s": {
                  "d": 8,
                  "t": 2
                },
                "next": "d2",
                "fb": "A useful question, but you skipped the incident itself. Understanding how it nearly worked shapes the answer for the board."
              },
              {
                "t": "We have a deepfake detection tool that would stop this. Let me show you a demo.",
                "q": "bad",
                "s": {
                  "t": -8,
                  "d": -8,
                  "l": -6
                },
                "next": "d2",
                "fb": "Product-first, before you know how it happened. Part of the fix may not be technology at all."
              }
            ]
          },
          "d2": {
            "c": "The call looked and sounded exactly like him. [[Our approval process depended on recognizing the person, not verifying the request.|pain|Process gap: controls need to assume voices and faces can be faked]] [[And afterward, our CISO froze every AI project, including the research team's pilot.|red|Security freeze: AI work stalled until there's a governance plan]]",
            "ch": [
              {
                "t": "That makes sense. Part of the answer isn't technology at all: call back on a known number to confirm any wire request, no matter who's asking. But it also shows your security and AI planning need to work together. Your CISO froze things because nobody can see the whole picture yet. What was the research pilot trying to do?",
                "q": "best",
                "s": {
                  "l": 12,
                  "d": 8,
                  "t": 8,
                  "p": 4
                },
                "next": "d3",
                "fb": "You gave practical, non-technical advice that a CFO can act on today, and you read the CISO's freeze as a visibility problem, not stubbornness."
              },
              {
                "t": "Your CISO is right to be careful. Do you know when projects might restart?",
                "q": "good",
                "s": {
                  "t": 4,
                  "d": 4
                },
                "next": "d3",
                "fb": "Respectful, but passive. You missed the process gap he just described and didn't offer a way forward."
              },
              {
                "t": "Freezing AI is an overreaction. Your competitors are moving ahead without you.",
                "q": "bad",
                "s": {
                  "t": -10,
                  "l": -6
                },
                "next": "d3",
                "fb": "Pressure tactics after a near-miss? He'll side with his CISO, and he should."
              }
            ]
          },
          "d3": {
            "c": "[[Our analysts wanted to search our internal research notes and earnings call transcripts instead of digging for hours.|pain|Knowledge search use case: AI answers with links back to the source documents]] [[And honestly, nobody has a full list of the AI tools people are already using here.|red|No AI inventory: a governance gap the board and regulators will ask about]]",
            "ch": [
              {
                "t": "Then I'd start with an AI Risk Assessment. It gives you and your CISO a clear picture of the AI already in use, the risks that come with it, and a plan built on NIST or ISO 42001 that you can take to the board. Alongside that, our security team can look at how you're protected against impersonation attacks like the one you just had. Once the guardrails are in place, the research tool can restart, built so every answer links back to the source document. Your CISO gets to set the rules instead of being the one who says no.",
                "q": "best",
                "s": {
                  "p": 14,
                  "t": 8,
                  "u": 6
                },
                "next": "d4",
                "fb": "You led with what the board and the CISO need, then showed how the business use case comes back safely. That's positioning security as an enabler."
              },
              {
                "t": "We should restart the research pilot right away to keep the momentum going.",
                "q": "meh",
                "s": {
                  "p": -2,
                  "t": -6
                },
                "next": "d4",
                "fb": "Restarting before the CISO is comfortable just goes around the freeze. Get the guardrails first."
              },
              {
                "t": "Let's build a full AI transformation roadmap for the whole firm.",
                "q": "bad",
                "s": {
                  "l": -8,
                  "p": -6
                },
                "next": "d4",
                "fb": "He needs an answer for the board and a safer process, not a firm-wide program."
              }
            ]
          },
          "d4": {
            "c": "[[That's a plan I can take to the board.|buy|Trust earned: he has a story for the board]] Where do we start?",
            "ch": [
              {
                "t": "An hour with you, your CISO and your head of research. I'll bring a one-page outline of the assessment and the questions your board is likely to ask, so you can show them a plan with a timeline at the next meeting.",
                "q": "best",
                "s": {
                  "p": 8,
                  "d": 4,
                  "t": 6
                },
                "next": "end",
                "fb": "The right three people, and you're helping him prepare for the board. Strong close."
              },
              {
                "t": "I'll send over a proposal for the assessment.",
                "q": "meh",
                "s": {
                  "p": 2
                },
                "next": "end",
                "fb": "Fine, but without the CISO involved, the proposal may sit."
              },
              {
                "t": "While we're at it, let's price out a new security platform.",
                "q": "bad",
                "s": {
                  "t": -6,
                  "p": -4
                },
                "next": "end",
                "fb": "Upselling hardware or software before the assessment undercuts the trust you just built."
              }
            ]
          }
        },
        "outcomes": {
          "great": {
            "title": "Assessment scoped with the CISO",
            "text": "Robert brings his CISO and head of research to the next meeting. You're helping him prepare his answer for the board."
          },
          "ok": {
            "title": "Concerned, but no plan yet",
            "text": "Robert appreciates the conversation, but nothing is scoped and the CISO isn't involved. AI stays frozen."
          },
          "poor": {
            "title": "Sent to the security vendors",
            "text": "Robert decides this is a pure security-tool problem and hands it to his CISO's existing vendors."
          }
        },
        "useCases": [
          "AI inventory and governance across the firm",
          "Defending against AI-powered impersonation and wire fraud (process changes plus security controls)",
          "Research search across internal notes and earnings transcripts, with every answer linked to its source"
        ],
        "offering": {
          "headline": "AI Risk Assessment → Security for AI → Governed research search",
          "steps": [
            "AI Risk Assessment (aligned to NIST or ISO 42001): AI in use, risks and a board-ready plan",
            "Impersonation and deepfake defenses with CDW's security team (check Power Plays for the latest Security from AI offers)",
            "Quick process fix: call back on a known number to confirm any wire request, no matter who's asking",
            "Security for AI: controls on how AI tools use company data",
            "Restart the research pilot with guardrails; every answer links back to a source document"
          ]
        },
        "takeaways": [
          "After a security incident, listen first. Ask how it happened before offering anything.",
          "Good advice includes non-technical fixes, like confirming wire requests by callback.",
          "An AI inventory is often the first thing boards and regulators ask for.",
          "Turn a CISO's freeze into guardrails the CISO owns."
        ]
      }
    ]
  },
  "jeopardy": {
    "categories": [
      {
        "name": "Listen Up",
        "clues": [
          {
            "q": "A bank operations leader says: \"Our KYC analysts spend half their day chasing documents and keying them in.\" What kind of signal is this?",
            "a": "A pain point and a strong fit for AI that reads documents, with analysts checking the results",
            "why": "Document processing is the area financial firms most often name as their highest-return AI use. Next, ask about volume, rework and turnaround time."
          },
          {
            "q": "\"Our second line of defense stopped the project.\" What is this telling you?",
            "a": "A governance gate: the bank's independent risk and compliance team has to approve, and should help design the guardrails",
            "why": "Don't route around them. Offer an AI Risk Assessment and invite them in as co-designers. In banking, they decide what ships."
          },
          {
            "q": "\"We bought GPUs last year, and nobody uses them efficiently.\" Name the cue AND the opportunity.",
            "a": "Under-used infrastructure, and an opening for a GPU Cluster Assessment (and possibly an AI Factory Accelerator)",
            "why": "Prove value on what they already own before anyone talks about buying more. Their CFO will thank you."
          },
          {
            "q": "\"The examiners asked us what AI we're using, and we didn't have a good answer.\" Identify the signal.",
            "a": "Regulatory pressure plus a visibility gap: they need an AI inventory and a governance plan",
            "why": "This is one of the clearest openings for an AI Risk Assessment. It turns an uncomfortable exam question into a plan."
          },
          {
            "q": "\"Our usage-based AI bills keep going up, and every department bought its own tool.\" Identify BOTH signals.",
            "a": "An AI cost concern, and AI sprawl with no clear owner (a governance gap)",
            "why": "Help them see all their AI spend in one place and tie each tool to a measurable result. Then talk about where each workload should run."
          }
        ]
      },
      {
        "name": "Use Case Match",
        "clues": [
          {
            "q": "A commercial insurer's underwriters re-key broker submissions, loss runs and schedules into the policy system before they can quote.",
            "a": "AI-assisted submission intake: read the documents and pre-fill the system, with an underwriter reviewing every file",
            "why": "Listen for re-keying, slow quote turnaround, and agents sending business to faster competitors."
          },
          {
            "q": "Financial advisors spend 45 minutes after every client meeting writing notes and follow-up emails.",
            "a": "An advisor meeting assistant: drafts notes, action items and a follow-up email for the advisor to review, saved to the CRM",
            "why": "Morgan Stanley publicly launched a tool like this in 2024. Client consent and compliance review are part of the design."
          },
          {
            "q": "Research analysts at an asset manager dig through thousands of reports and earnings transcripts to answer one question.",
            "a": "Knowledge search (RAG) with every answer linked back to the source document",
            "why": "Morgan Stanley's research division uses a tool like this across 70,000+ reports a year. Links to sources let analysts check every answer."
          },
          {
            "q": "A card issuer's fraud losses keep climbing, and its rules flag so many good transactions that customers get declined at checkout.",
            "a": "Predictive AI for fraud detection (machine learning scoring that catches more fraud with fewer false alarms)",
            "why": "Fraud is one of the longest-running, proven AI uses in financial services. Measure fraud losses avoided and false positives reduced."
          },
          {
            "q": "A payments company's dispute analysts read chargeback documents and transaction history for every case, and sometimes miss response deadlines.",
            "a": "AI-drafted dispute case summaries, with analysts making every decision",
            "why": "High volume, hard deadlines and direct dollar losses make this easy to measure. AI prepares the case; a person decides."
          }
        ]
      },
      {
        "name": "Pick the Play",
        "clues": [
          {
            "q": "\"The board wants an AI strategy, we have a few pilots, and nothing's in production.\" Lead with this two-day, fixed-fee CDW workshop.",
            "a": "Private AI Launch Workshop",
            "why": "It's the 'explore' step: a fast way to pick a first use case, get the right people aligned, and plan a path past one-off pilots."
          },
          {
            "q": "\"Our search assistant gives bad answers because our documents are a mess.\" Lead with this assessment.",
            "a": "AI Readiness Data Quality Assessment",
            "why": "It delivers a maturity scorecard, business case summary and prioritized action plan. Data Governance for AI and Modern Data Platform work often follow."
          },
          {
            "q": "The customer already owns NVIDIA DGX systems with NVIDIA AI Enterprise licenses and wants to prove one high-value use case on them.",
            "a": "AI Factory Accelerator",
            "why": "It proves a use case on their own GPUs with a small data set and delivers a working proof of concept, a metrics report, a runbook and a roadmap to production."
          },
          {
            "q": "A credit union plans to launch an AI voice agent for members next quarter. Before it goes live, recommend this.",
            "a": "AI LLM Penetration Testing",
            "why": "It tests whether the AI can be tricked into leaking data or misbehaving, and includes a letter of attestation. That's what a CISO wants before anything talks to customers."
          },
          {
            "q": "The contact center runs on Five9, hold times are long, and half the calls are simple requests like card status.",
            "a": "FirstTouch AI",
            "why": "It automates the first minute of customer contact on supported contact center platforms, and financial services is a target industry. Not a fit if they haven't chosen a contact center platform yet."
          }
        ]
      },
      {
        "name": "Objection Busters",
        "clues": [
          {
            "q": "\"We can't put customer data into AI. Our regulators would never allow it.\"",
            "a": "Agree that protecting data comes first, then explain governed options: AI running in their own environment, access controls and a governance plan. Start with an internal use case",
            "why": "Regulators expect controls, not a ban. Most financial firms in recent surveys already use AI, with governance in place."
          },
          {
            "q": "\"Let's just buy GPUs and build our own AI.\"",
            "a": "Slow down and go workload by workload: data sensitivity, speed, how much they'll use it, and cost decide where AI should run",
            "why": "Private AI is a great fit for regulated data and steady, heavy use. For light or occasional use, a hosted service may be smarter. Saying so builds trust."
          },
          {
            "q": "\"We bought Copilot, but almost nobody uses it.\"",
            "a": "Treat it as a content and adoption problem: clean up the content Copilot draws from and run an adoption and change management program",
            "why": "People stop using AI when it gives mixed answers or nobody showed them how it fits their job. Fix both before blaming the tool."
          },
          {
            "q": "\"AI makes things up, and in our business that's a compliance problem.\"",
            "a": "Agree, then cover the guardrails: answers based on their own documents with links to sources, human review, testing and monitoring. Start internal",
            "why": "Hallucination is the top generative AI risk European insurers report. Taking it seriously is what earns you the meeting with compliance."
          },
          {
            "q": "\"Everyone says AI pays off. Show me proof.\"",
            "a": "Be honest: most published AI ROI numbers are self-reported. Offer to set their own 'before' numbers and measure a focused pilot against them",
            "why": "A CFO trusts their own numbers more than any survey. Cycle time, error rates, fraud losses, adoption and net cost are good places to start."
          }
        ]
      },
      {
        "name": "Market Pulse",
        "clues": [
          {
            "q": "In NVIDIA's 2026 financial services survey, firms named this most often as their highest-return AI use case.",
            "a": "Document processing (32% of respondents)",
            "why": "Customer experience (30%) was close behind. Use it as a direction, not a promise. It's what firms reported, not audited results."
          },
          {
            "q": "Predictive, generative or agentic: which type of AI is the long-standing, in-production workhorse in financial services?",
            "a": "Predictive AI (fraud, AML, credit, pricing)",
            "why": "Generative AI is spreading fastest, mostly for internal work that people review. Agentic AI is still early."
          },
          {
            "q": "In the Bank of England and FCA's 2024 survey, only this share of AI use cases were fully autonomous.",
            "a": "2%",
            "why": "More than half had some automated decision-making, but almost all kept people involved. Don't promise full automation; position AI with people in the loop."
          },
          {
            "q": "The #1 barrier to scaling AI in NVIDIA's survey, cited by 40% of financial firms.",
            "a": "Data: privacy, sovereignty, and data spread across too many places",
            "why": "Access to AI models isn't the problem. Trusted, governed data is. That's why data quality and governance belong in almost every AI conversation."
          },
          {
            "q": "Nearly half (47%) of NVIDIA's 2026 respondents run AI this way, up from about a quarter in 2024.",
            "a": "Hybrid: a mix of cloud and on-premises",
            "why": "Different firms answered each year, so treat it as a direction. The lesson: choose where AI runs workload by workload, not 'always cloud' or 'always on-prem.'"
          }
        ]
      },
      {
        "name": "Discovery Questions",
        "clues": [
          {
            "q": "Ask this to find out whether the customer already has a use case in mind.",
            "a": "\"What's the first problem you'd want AI to solve, and how are you handling it today?\"",
            "why": "If they have a clear use case, dig into it. If they don't, they probably need help figuring out where to start, which is a workshop conversation."
          },
          {
            "q": "The question that checks whether their data is ready.",
            "a": "\"Where does the data for this live today, who manages it, and how much do you trust it?\"",
            "why": "Data is the #1 barrier to scaling AI in financial services. The answer tells you whether data quality or governance work needs to come first."
          },
          {
            "q": "Ask this to understand where the AI will need to run.",
            "a": "\"Do you see this running in your own data center, in the cloud, or a mix of both?\"",
            "why": "Data residency, speed and cost drive the answer. It tells you whether to bring in infrastructure, cloud or both."
          },
          {
            "q": "In financial services, ask this early to uncover hidden blockers.",
            "a": "\"Who in risk, compliance or security will need to sign off before something like this goes live?\"",
            "why": "The second line, the CISO and compliance can stop a deal late. Bring them in early and make them co-designers."
          },
          {
            "q": "Ask this to find out who will own the AI after go-live.",
            "a": "\"Once this is live, who keeps it accurate, secure and running? Do you have an AI Center of Excellence or someone in that role?\"",
            "why": "No owner is a warning sign. It's also a natural opening for ongoing support, managed services and training."
          }
        ]
      }
    ],
    "final": {
      "category": "The Full Deal",
      "q": "An insurance COO says: \"Our underwriters spend half their day re-keying broker submissions, our CISO shut down our ChatGPT pilot, and the board wants an AI plan by spring.\" Name the USE CASE, the key SIGNALS, and the CDW plays you'd lead with.",
      "a": "Use case: AI-assisted submission intake, with underwriters reviewing every file. Signals: measurable pain + a security gate (the CISO) + board pressure with a deadline. Lead with: a Private AI Launch Workshop with the CISO in the room and an AI Risk Assessment to set guardrails, then a pilot measured against today's numbers.",
      "why": "Listen, identify, position: the whole job in one answer."
    }
  }
};

export default deepFreeze(fsiV2Pack);
