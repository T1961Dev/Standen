/**
 * Actionable guide bodies for B2B agencies.
 * Teaches enough to act today; implementation depth stays in scoped builds.
 */

export function renderGuideBody(guide, { copyFor, escapeHtml }) {
    const content = GUIDE_CONTENT[guide.slug];
    if (!content) return null;

    const c = copyFor(guide);
    const serviceHref = content.service || c.service;
    const parts = [];

    parts.push(`<p class="guide-article__lead">${content.lead}</p>`);
    if (content.answer) {
        parts.push(`<p class="seo-answer">${content.answer}</p>`);
    }

    for (const block of content.blocks) {
        if (block.h2) parts.push(`<h2>${block.h2}</h2>`);
        if (block.h3) parts.push(`<h3>${block.h3}</h3>`);
        if (block.p) block.p.forEach((t) => parts.push(`<p>${t}</p>`));
        if (block.ol) {
            parts.push(`<ol>${block.ol.map((t) => `<li>${t}</li>`).join("")}</ol>`);
        }
        if (block.ul) {
            parts.push(`<ul>${block.ul.map((t) => `<li>${t}</li>`).join("")}</ul>`);
        }
    }

    const closeText =
        content.close ||
        `Use this as a working checklist inside your team first. When the same steps repeat every week and spreadsheets start breaking, that is usually the moment to scope ${escapeHtml(c.first)} as an owned system.`;
    parts.push(`<p class="guide-article__close">${closeText} <a href="${serviceHref}">See the relevant Standen service</a> or <a href="/audit.html">read the agency ops audit</a>.</p>`);

    return parts.join("\n                    ");
}

/** @type {Record<string, { lead: string, answer?: string, service?: string, close?: string, faqs?: object[], blocks: object[] }>} */
const GUIDE_CONTENT = {
    "agency-proposal-systems": {
        lead: "If proposals still live in Google Docs, you do not have a proposal system. You have a folder of templates and a lot of copy-paste.",
        answer: "Agencies that win faster treat proposals as workflow: sections, pricing rules, approvals, version history and a buyer-ready export, not another duplicated doc.",
        blocks: [
            {
                h2: "Audit your current proposal flow (30 minutes)",
                ol: [
                    "List the last five proposals you sent. Note how long each took from call to send.",
                    "Circle every place pricing was calculated manually (spreadsheets, mental maths, old decks).",
                    "Mark where internal sign-off happened: Slack, email, or not at all.",
                    "Check whether you can see which version the client opened and when.",
                    "Write one sentence: what slowed the last deal down?",
                ],
            },
            {
                h2: "The minimum fields every proposal should carry",
                p: ["Before you buy or build anything, standardise these on one internal template:"],
                ul: [
                    "<strong>Client context</strong>, industry, goal, constraints (pulled from CRM, not retyped).",
                    "<strong>Scope blocks</strong>, reusable modules you assemble, not freeform paragraphs.",
                    "<strong>Pricing logic</strong>, rate card, packages, optional add-ons with guardrails.",
                    "<strong>Assumptions &amp; exclusions</strong>, pre-written blocks legal has already approved.",
                    "<strong>Internal owner</strong>, who drafted, who approved, who sends.",
                    "<strong>Version label</strong>, v1, v1.1 after negotiation, never \"final FINAL\".",
                ],
            },
            {
                h2: "Red flags that Docs has hit its limit",
                ul: [
                    "Two people pricing the same deal differently.",
                    "Proposals sent without finance or delivery reviewing scope.",
                    "No record of what changed between v1 and what the client signed.",
                    "New hires rebuilding proposals from scratch because \"the template is wrong\".",
                ],
            },
            {
                h2: "What version one of a proposal system looks like",
                p: [
                    "Not a full CPQ. One service line, one pricing model, one approval chain, one PDF or link the client receives. Ship that, measure turnaround time for four weeks, then expand modules.",
                    "That is the shape of system Standen scopes in a fixed 14-day build: owned, tailored to how your agency prices and approves, not another rented doc tool.",
                ],
            },
        ],
    },

    "proposal-turnaround": {
        lead: "Speed wins when the buyer still remembers the call. Most agencies lose deals in the gap between enthusiasm and the proposal landing.",
        blocks: [
            {
                h2: "The one-hour proposal sprint",
                ol: [
                    "<strong>0–10 min:</strong> Pull call notes into a structured brief (goal, budget band, timeline, decision makers).",
                    "<strong>10–25 min:</strong> Select scope blocks from your library. Do not rewrite from scratch.",
                    "<strong>25–40 min:</strong> Apply pricing rules. Let the sheet or system calculate totals.",
                    "<strong>40–50 min:</strong> Internal sanity check, delivery lead confirms capacity, not just sales enthusiasm.",
                    "<strong>50–60 min:</strong> Export and send while you still have a thread open with the buyer.",
                ],
            },
            {
                h2: "Prepare these once, reuse forever",
                ul: [
                    "Five scope narratives you actually deliver (not aspirational service pages).",
                    "Three pricing tiers with clear upgrade paths.",
                    "Two case studies matched by industry or problem, not logo prestige.",
                    "A one-page \"how we work\" appendix clients stop asking about in calls.",
                ],
            },
            {
                h2: "Measure what matters",
                p: ["Track median hours from discovery call to proposal sent. If it is over 24 hours, fix process before you fix copy."],
            },
        ],
    },

    "approval-flows": {
        lead: "Internal approval should protect margin, not become a second sales cycle.",
        blocks: [
            {
                h2: "Draw your approval chain on one page",
                ol: [
                    "Who can send under £5k without sign-off?",
                    "Who must review custom scope or non-standard pricing?",
                    "Who checks delivery capacity before commit?",
                    "What is the SLA for each approver (hours, not days)?",
                ],
            },
            {
                h2: "Rules that keep deals moving",
                ul: [
                    "Approvals happen in the system, not in a Slack thread that gets lost.",
                    "Rejections require a reason code (pricing, scope, capacity, legal).",
                    "Emergency sends need a post-hoc review within 48 hours, not a blank cheque.",
                ],
            },
            {
                h2: "Version one",
                p: ["One proposal type, two approvers max, email notifications when stuck &gt; 4 hours. Automate reminders before you automate logic."],
            },
        ],
    },

    "client-reporting-dashboards": {
        lead: "Clients do not want more charts. They want the same answer every month without your team rebuilding the deck.",
        blocks: [
            {
                h2: "Map how the client reads performance",
                ol: [
                    "Ask: \"What three numbers do you show your boss?\" Write them down verbatim.",
                    "List data sources today (GA4, Meta, CRM, spreadsheets).",
                    "Note commentary your team adds manually each month, that is product requirements.",
                    "Identify comparisons they care about: vs last month, vs target, vs benchmark.",
                ],
            },
            {
                h2: "Design the dashboard around decisions",
                p: ["Each widget should answer one question:"],
                ul: [
                    "Are we on track for the goal we agreed?",
                    "What changed since last period?",
                    "What needs a decision or budget shift?",
                ],
            },
            {
                h2: "Pilot with one client",
                p: [
                    "Run the dashboard in parallel with the PDF for one month. When the client opens the live view first, you are ready to cut manual reporting time.",
                ],
            },
        ],
    },

    "reporting-automation": {
        lead: "Most agencies lose 10–20 hours per month per account manager to reporting glue work. That is margin walking out the door.",
        blocks: [
            {
                h2: "Time-box a reporting audit",
                ol: [
                    "Pick one retainer client. Time every step: export, clean, chart, write, format, send.",
                    "Highlight copy-paste between tools.",
                    "Note where numbers disagree between sources.",
                    "Calculate fully loaded cost (hourly rate × hours). That is your build budget ceiling.",
                ],
            },
            {
                h2: "Automate in this order",
                ol: [
                    "Data pull on a schedule (APIs beat screenshots).",
                    "Standardised metric definitions (one source of truth).",
                    "Templated commentary prompts, not blank text boxes.",
                    "Client-facing view with period lock once approved.",
                ],
            },
            {
                h2: "What not to automate first",
                p: ["Do not start with AI-written narratives or custom charts per client. Fix data reliability first."],
            },
        ],
    },

    "client-portals": {
        lead: "A portal is worth it when clients ask the same status questions every week and your team answers in five different tools.",
        blocks: [
            {
                h2: "The portal readiness checklist",
                ul: [
                    "You have a defined delivery stages model (even if it lives in Notion today).",
                    "Files and approvals have a named owner on both sides.",
                    "Clients have been trained on one channel before, you are not fixing comms culture with software alone.",
                    "You can describe what clients should do self-serve vs what still needs a call.",
                ],
            },
            {
                h2: "Start with three screens",
                ol: [
                    "<strong>Status</strong>, where are we, what is next, who owns it.",
                    "<strong>Files</strong>, latest deliverables, versioned, downloadable.",
                    "<strong>Approvals</strong>, one-click approve / request changes with timestamp.",
                ],
            },
            {
                h2: "Measure success",
                p: ["Fewer \"just checking in\" emails within 60 days, not portal login counts."],
            },
        ],
    },

    "onboarding-systems": {
        lead: "Onboarding breaks when briefs, assets and access requests scatter across email. One auditable flow beats twelve polite threads.",
        blocks: [
            {
                h2: "The 48-hour onboarding sequence",
                ol: [
                    "<strong>Hour 0:</strong> Send portal link + checklist (access, assets, stakeholders, goals).",
                    "<strong>Day 1:</strong> Auto-remind missing items. Internal owner assigned in CRM.",
                    "<strong>Day 2:</strong> Kickoff only if checklist threshold met (e.g. 80% complete).",
                    "<strong>Week 1:</strong> Signed-off brief stored as version 1. No kickoff slides renegotiating scope.",
                ],
            },
            {
                h2: "Checklist items that actually matter",
                ul: [
                    "Brand assets in correct formats.",
                    "Platform access (with expiry on shared credentials).",
                    "Single decision maker for approvals.",
                    "Success metric agreed in writing.",
                ],
            },
        ],
    },

    "before-hiring-ops": {
        lead: "Hiring ops talent before fixing recurring handoffs usually scales the chaos. Software often removes the need for the hire entirely.",
        blocks: [
            {
                h2: "Run this before you write a job spec",
                ol: [
                    "List workflows that broke twice in the last 30 days.",
                    "Mark which breaks cost client trust vs internal annoyance.",
                    "Estimate hours spent weekly on glue work (status, reporting, routing).",
                    "Ask: would a system with rules fix this, or does it need human judgment every time?",
                ],
            },
            {
                h2: "Build before hire when…",
                ul: [
                    "The same handoff fails the same way every week.",
                    "Truth lives in one person's inbox.",
                    "Meetings exist only to locate status.",
                ],
            },
            {
                h2: "Hire before build when…",
                ul: [
                    "The problem is policy and client management, not tooling.",
                    "Volume is unpredictable and relationship-heavy.",
                    "You need negotiation, not queues.",
                ],
            },
        ],
    },

    "internal-crm": {
        lead: "Your team opens the CRM when leadership asks, not when they work. That means it is a report card, not an operating system.",
        blocks: [
            {
                h2: "Design for the Monday morning question",
                p: ["\"What needs my attention today?\" Your internal CRM should answer that in one screen."],
                ol: [
                    "Queue of leads with owner, stage, next action, blocker.",
                    "Delivery view: active projects, risk flag, last client touch.",
                    "Founder view: margin signals, not vanity pipeline.",
                ],
            },
            {
                h2: "Fields you actually need (version one)",
                ul: [
                    "Owner (one person, not a team inbox).",
                    "Stage (fewer than seven).",
                    "Next action + due date.",
                    "Blocker (free text, reviewed weekly).",
                    "Source (so you know what to scale).",
                ],
            },
            {
                h2: "Rollout rule",
                p: ["One team, one pipeline, four weeks. Expand only when daily active use is above 80%."],
            },
        ],
    },

    "delivery-queues": {
        lead: "If project status lives in Slack, it will always be incomplete and unsearchable.",
        blocks: [
            {
                h2: "Move status in one migration sprint",
                ol: [
                    "Define stages that match how work actually moves (not how you wish it moved).",
                    "Assign every active project an owner and stage by end of week one.",
                    "Ban status updates in Slack except links back to the system.",
                    "Review blockers in a single weekly ops meeting with the board open.",
                ],
            },
            {
                h2: "Signals the queue is working",
                ul: [
                    "You can pull a client status in under 60 seconds.",
                    "New hires know where to look on day one.",
                    "Clients get proactive updates before they ask.",
                ],
            },
        ],
    },

    "retainer-tracking": {
        lead: "Retainer profitability hides in utilisation, scope creep and unbilled favours. Spreadsheets hide it until it is too late.",
        blocks: [
            {
                h2: "Weekly retainer review (20 minutes)",
                ol: [
                    "List active retainers with contracted hours or deliverables.",
                    "Compare actual effort or output vs plan (honest estimate, not timesheet theatre).",
                    "Flag accounts under 60% or over 110% of target utilisation.",
                    "Note scope requests outside SOW, decide bill, absorb or recontract.",
                ],
            },
            {
                h2: "One founder metric",
                p: ["Margin per retainer after fully loaded delivery cost. If you cannot compute it monthly, that is the first build."],
            },
        ],
    },

    "scope-first-build": {
        lead: "Fix time and budget first, then scope. Agencies that scope open-endedly never ship version one.",
        blocks: [
            {
                h2: "The 14-day scoping frame",
                ol: [
                    "<strong>Day 1–2:</strong> Map current workflow with one operator in the room.",
                    "<strong>Day 3–4:</strong> Define success metric (one number or observable behaviour).",
                    "<strong>Day 5–6:</strong> Cut everything that does not serve that metric.",
                    "<strong>Day 7:</strong> Fixed scope doc: users, screens, integrations, out-of-scope list.",
                    "<strong>Week 2:</strong> Build, demo, handover, no parallel feature requests.",
                ],
            },
            {
                h2: "Scope doc must include",
                ul: [
                    "Acceptance criteria per screen or workflow step.",
                    "Integration list with read/write direction.",
                    "Who owns data migration and cutover.",
                    "Handover: code, deploy, docs, training slot.",
                ],
            },
        ],
    },

    "14-day-build": {
        lead: "Fourteen days is enough for one workflow, one user group, one measurable win, not a platform.",
        blocks: [
            {
                h2: "What fits",
                ul: [
                    "Proposal builder for one service line.",
                    "Client reporting dashboard for one channel stack.",
                    "Onboarding portal for one offer.",
                    "Internal queue for one team (sales or delivery).",
                    "Integration between two tools you already pay for.",
                ],
            },
            {
                h2: "What does not fit",
                ul: [
                    "Multi-tenant SaaS with billing.",
                    "Replacing your entire CRM.",
                    "Custom mobile apps.",
                    "\"Can you also just…\" lists from four departments.",
                ],
            },
            {
                h2: "How Standen runs the sprint",
                p: [
                    "Fixed scope agreed upfront, daily progress on a private link, handover on day 14 with codebase and deployment access. Expand in phase two only after version one is used weekly.",
                ],
            },
        ],
    },

    "founder-led-delivery": {
        lead: "When the person scoping is three handoffs away from the person shipping, details die and timelines slip.",
        blocks: [
            {
                h2: "Questions to ask any build partner",
                ul: [
                    "Who attends the workflow mapping call?",
                    "Who writes the scope you sign?",
                    "Who builds, same person or a bench you have not met?",
                    "Who handles the first bug report after launch?",
                ],
            },
            {
                h2: "Why it matters for agencies",
                p: [
                    "Your clients hire you for direct senior attention. Your software vendor should work the same way. Founder-led delivery is not vanity, it is risk control on a fixed budget.",
                ],
            },
        ],
    },

    "ownership-model": {
        lead: "Renting workflow logic from SaaS means your margin pays twice: licence fees and manual work around the gaps.",
        blocks: [
            {
                h2: "The ownership checklist",
                ul: [
                    "Source code in your Git org.",
                    "Production deploy access documented.",
                    "Environment variables and secrets inventory.",
                    "Runbook: how to deploy, roll back, add a user.",
                    "Data export path if you leave the vendor.",
                ],
            },
            {
                h2: "When renting is fine",
                p: ["Commodity tools with no workflow differentiation (email, accounting). When the workflow is your edge, own the layer."],
            },
        ],
    },

    "handover-checklist": {
        lead: "A handover is not a Loom and a prayer. It is transfer of control.",
        blocks: [
            {
                h2: "Acceptance day agenda",
                ol: [
                    "Walk through production with your team driving, vendor watching.",
                    "Deploy a trivial change together (copy tweak counts).",
                    "Review error monitoring and who gets paged.",
                    "Sign acceptance against the scope doc criteria.",
                    "Schedule day-30 review for friction log.",
                ],
            },
            {
                h2: "Documentation minimum",
                ul: [
                    "Architecture one-pager.",
                    "Integration map with credentials location.",
                    "User admin guide (non-developer).",
                    "Backlog of known nice-to-haves vs bugs.",
                ],
            },
        ],
    },

    "custom-vs-saas": {
        lead: "Buy when the problem is standard. Build when the workflow is your product.",
        blocks: [
            {
                h2: "Score each option 1–5",
                ul: [
                    "<strong>Fit:</strong> Does off-the-shelf match how you actually work?",
                    "<strong>Frequency:</strong> Daily workflow or quarterly annoyance?",
                    "<strong>Integration:</strong> How many tools must talk?",
                    "<strong>Ownership:</strong> Is this core IP or commodity?",
                    "<strong>Cost of glue:</strong> Hours spent working around the tool.",
                ],
            },
            {
                h2: "Decision rule",
                p: ["If SaaS scores 4+ on fit and glue is low, buy. If fit is below 3 and glue is high, scope a narrow build."],
            },
        ],
    },

    "workflow-audit": {
        lead: "Five places leak time in almost every agency. Map yours before you buy or build anything.",
        blocks: [
            {
                h2: "The five leaks",
                ol: [
                    "<strong>Proposals</strong>, slow send, inconsistent pricing.",
                    "<strong>Reporting</strong>, manual rebuilds every month.",
                    "<strong>Onboarding</strong>, assets and access chase.",
                    "<strong>Client comms</strong>, status in inbox archaeology.",
                    "<strong>Glue work</strong>, copy-paste between systems.",
                ],
            },
            {
                h2: "Pick one leak to fix this quarter",
                p: [
                    "Score each 1–5 on pain and frequency. Highest combined score wins. Everything else waits.",
                    "For a deeper worksheet, use our <a href=\"/audit.html\">free agency ops audit</a>.",
                ],
            },
        ],
    },

    "pricing-first-build": {
        lead: "One workflow. One system. Fixed price. That is how agencies avoid open-ended dev spend.",
        blocks: [
            {
                h2: "How fixed-scope pricing works",
                ul: [
                    "Workflow mapped and written down before build starts.",
                    "Deliverables tied to acceptance criteria.",
                    "50% upfront, 50% on handover (cash flow aligned to delivery).",
                    "Change requests = new phase, not silent scope creep.",
                ],
            },
            {
                h2: "Typical first builds from £5,000",
                p: ["Proposal flow, reporting dashboard, client portal slice, or internal queue, one per phase."],
            },
        ],
    },

    "integrations-101": {
        lead: "Integrate the smallest path that removes daily copy-paste. Not the perfect enterprise map.",
        blocks: [
            {
                h2: "Priority order for agencies",
                ol: [
                    "CRM ↔ email/calendar (leads and activity).",
                    "Ads/GA4 → reporting warehouse or sheet.",
                    "Project tool ↔ time tracking (if billing depends on it).",
                    "Finance ↔ CRM (won deals, invoices).",
                ],
            },
            {
                h2: "Version one integration spec",
                p: ["One direction of sync, one object type, idempotent writes, error log you actually read."],
            },
        ],
    },

    "sow-template": {
        lead: "Clients sign scopes they understand. Vague SOWs create scope creep; over-lawyered SOWs slow deals.",
        blocks: [
            {
                h2: "Every SOW needs these sections",
                ol: [
                    "Objective (one paragraph, client language).",
                    "Deliverables (bullet list, each testable).",
                    "Timeline with client dependencies highlighted.",
                    "Assumptions &amp; exclusions (explicit).",
                    "Change process (how extras are priced).",
                    "Acceptance criteria (what \"done\" means).",
                ],
            },
            {
                h2: "Test before you send",
                p: ["Can delivery lead execute from this without calling sales? If not, rewrite."],
            },
        ],
    },

    "kickoff-checklist": {
        lead: "Bad kickoffs create bad projects. Use the same checklist every time.",
        blocks: [
            {
                h2: "48 hours before kickoff",
                ul: [
                    "Brief signed and stored.",
                    "Access confirmed (not \"requested\").",
                    "Stakeholders on calendar with decision authority.",
                    "Success metric restated in client words.",
                    "Internal owner assigned in delivery queue.",
                ],
            },
            {
                h2: "During kickoff",
                ol: [
                    "Confirm stages and communication channel.",
                    "Show where status will live (portal or shared view).",
                    "Agree response SLAs both directions.",
                    "Book next checkpoint before hanging up.",
                ],
            },
        ],
    },

    "report-narrative-template": {
        lead: "Commentary takes longer than charts. Structure the narrative so account managers fill gaps, not blank pages.",
        blocks: [
            {
                h2: "Four-block monthly narrative",
                ol: [
                    "<strong>Headline</strong>, one sentence: on track / at risk / ahead.",
                    "<strong>What moved</strong>, three bullets tied to metrics.",
                    "<strong>Why it moved</strong>, hypothesis, not essay.",
                    "<strong>Next actions</strong>, client decisions needed + your commitments.",
                ],
            },
            {
                h2: "Quality bar",
                p: ["If a paragraph has no number in it, cut it or add one."],
            },
        ],
    },

    "crm-hygiene": {
        lead: "Dirty CRM data makes every downstream system lie.",
        blocks: [
            {
                h2: "90-minute hygiene sprint",
                ol: [
                    "Merge duplicate companies and contacts.",
                    "Close zombie deals with lost reason.",
                    "Require owner on every open opportunity.",
                    "Standardise stage definitions on one wiki page.",
                    "Archive anything untouched 180+ days.",
                ],
            },
            {
                h2: "Keep it clean",
                p: ["Weekly 15-minute pipeline review beats quarterly deep cleans."],
            },
        ],
    },

    "async-status-updates": {
        lead: "Status meetings exist because nobody trusts the system. Replace meetings with a written rhythm.",
        blocks: [
            {
                h2: "Weekly async format",
                ul: [
                    "<strong>Done</strong>, shipped items with links.",
                    "<strong>Next</strong>, top three priorities.",
                    "<strong>Blocked</strong>, needs client or internal decision.",
                    "<strong>Risks</strong>, optional, only if real.",
                ],
            },
            {
                h2: "When to keep a live call",
                p: ["Negotiation, relationship repair, or genuine ambiguity, not readouts."],
            },
        ],
    },

    "proposal-pricing-models": {
        lead: "Pricing model shapes behaviour. Pick one deliberately per offer.",
        blocks: [
            {
                h2: "Three models agencies use",
                ul: [
                    "<strong>Fixed project</strong>, clear scope, clear price, change orders for extras.",
                    "<strong>Retainer</strong>, capped deliverables or hours, renewal tied to review.",
                    "<strong>Performance / hybrid</strong>, base + variable; document measurement ruthlessly.",
                ],
            },
            {
                h2: "Match model to workflow",
                p: ["Your proposal system should enforce the model (calculators, caps, approval rules) so reps cannot accidentally sell the wrong shape."],
            },
        ],
    },

    "bottleneck-map": {
        lead: "You cannot fix five bottlenecks at once. Map one chain end-to-end in 30 minutes.",
        blocks: [
            {
                h2: "Draw the chain",
                ol: [
                    "Start at trigger (lead in, client request, month end).",
                    "List each step and who owns it.",
                    "Mark wait time between steps (hours/days).",
                    "Circle the longest wait, that is the bottleneck.",
                    "Ask: policy, people, or tool?",
                ],
            },
            {
                h2: "Fix order",
                p: ["Tool last. Clarify policy and ownership first; then automate the repeated decision."],
            },
        ],
    },

    "build-vs-buy-scorecard": {
        lead: "Use the same scorecard for every \"should we build?\" conversation.",
        blocks: [
            {
                h2: "Score 1–5 per row",
                ul: [
                    "Workflow uniqueness",
                    "Weekly repetition",
                    "Integration complexity",
                    "Cost of manual workaround",
                    "Strategic value if owned",
                ],
            },
            {
                h2: "Interpretation",
                p: ["Total below 15: buy or process fix. Above 22: strongly consider a scoped build. Middle: pilot with one team."],
            },
        ],
    },

    "client-approval-sla": {
        lead: "Client delays kill margin. SLAs work both ways.",
        blocks: [
            {
                h2: "Define mutual SLAs in onboarding",
                ul: [
                    "Your response time on questions.",
                    "Client feedback time on deliverables.",
                    "What happens when feedback is late (timeline shifts automatically).",
                    "How many revision rounds are included.",
                ],
            },
            {
                h2: "Enforce in the portal",
                p: ["Timestamp approvals. Escalate when SLA breached, system nudge, not passive-aggressive email."],
            },
        ],
    },

    "ga4-client-reporting": {
        lead: "GA4 setup repeats for every client. Standardise the checklist, not the analyst's memory.",
        blocks: [
            {
                h2: "Client GA4 checklist",
                ol: [
                    "Property structure agreed (single vs subproperties).",
                    "Key events defined and documented.",
                    "UTM conventions written down.",
                    "Access for agency granted with least privilege.",
                    "Baseline report template connected to Looker/Sheet/dashboard.",
                    "QA hit recorded before first client report.",
                ],
            },
            {
                h2: "Productise it",
                p: ["Turn this into an onboarding task list inside your portal or CRM, same steps, every client."],
            },
        ],
    },

    "scope-creep-prevention": {
        lead: "Scope creep is a process failure, not a client personality type.",
        blocks: [
            {
                h2: "Three lines of defence",
                ol: [
                    "SOW with explicit exclusions and change process.",
                    "Delivery queue visible to client (requests logged, not absorbed silently).",
                    "Weekly review of out-of-scope log, decide bill, defer, or absorb with leadership sign-off.",
                ],
            },
            {
                h2: "Language for clients",
                p: ["\"Happy to do that, I'll send a change order so we can slot it without hurting the current timeline.\""],
            },
        ],
    },

    "handoff-to-accounts": {
        lead: "Sales-to-delivery handoffs lose context. Structure the packet.",
        blocks: [
            {
                h2: "Minimum handoff packet",
                ul: [
                    "Signed SOW link.",
                    "Call summary: goals, risks, political landmines.",
                    "Pricing and margin notes (internal only).",
                    "Client comms preferences.",
                    "Promised dates (only what is in SOW).",
                ],
            },
            {
                h2: "Rule",
                p: ["Delivery lead accepts or rejects handoff, not silent inheritance."],
            },
        ],
    },

    "integration-priority": {
        lead: "Not every integration earns its keep. Rank by hours saved × reliability.",
        blocks: [
            {
                h2: "Rank candidates",
                ol: [
                    "List manual steps between each tool pair.",
                    "Estimate weekly hours × people affected.",
                    "Rate data quality today (garbage in = expensive integration).",
                    "Pick top one pair only for version one.",
                ],
            },
        ],
    },

    "ops-meeting-audit": {
        lead: "If your calendar is full of syncs, your systems are not trusted.",
        blocks: [
            {
                h2: "Audit recurring meetings",
                ol: [
                    "List every recurring ops/delivery meeting.",
                    "Write the decision each is supposed to produce.",
                    "If no decision, cancel or merge.",
                    "Replace readouts with async updates in writing.",
                    "Rebook only meetings with a pre-published agenda.",
                ],
            },
        ],
    },

    "timesheet-to-margin": {
        lead: "Timesheets that nobody trusts cannot protect margin.",
        blocks: [
            {
                h2: "Lightweight utilisation",
                ol: [
                    "Track time at project/retainer level, not 6-minute increments, if culture resists.",
                    "Compare sold hours vs actual monthly.",
                    "Review outliers with leads, not public shaming.",
                    "Feed learnings back into pricing and SOW templates.",
                ],
            },
            {
                h2: "When to build proper tracking",
                p: ["When utilisation disputes happen every month or retainers regularly overrun 120%."],
            },
        ],
    },

    "software-rfp-light": {
        lead: "You do not need a 40-page RFP for a first agency system. You need clear outcomes and constraints.",
        blocks: [
            {
                h2: "One-page brief agencies can reuse",
                ul: [
                    "Problem statement (workflow, not technology).",
                    "Users and permissions.",
                    "Must-have integrations.",
                    "Success metric at 30 days.",
                    "Budget band and timeline.",
                    "Ownership requirements (code, deploy, docs).",
                ],
            },
            {
                h2: "Evaluate vendors",
                p: ["Ask for a fixed-scope response to version one only. Compare acceptance criteria, not feature wishlists."],
            },
        ],
    },

    "agent-ready-ops": {
        lead: "AI helps when your data and actions are structured. Fragmented ops means unsafe automation.",
        blocks: [
            {
                h2: "Prepare ops for agents (without boiling the ocean)",
                ol: [
                    "Pick one workflow agents might assist (reporting summary, lead routing, status drafts).",
                    "Ensure source data lives in one place with stable IDs.",
                    "Document allowed actions (read vs write).",
                    "Add human approval on any client-facing output.",
                    "Log what the agent did for audit.",
                ],
            },
            {
                h2: "Read next",
                p: ["For the protocol layer, see our <a href=\"/guides/a2a-protocol.html\">A2A protocol guide</a>."],
            },
        ],
        service: "/#service-saas",
    },
};

export { GUIDE_CONTENT };
