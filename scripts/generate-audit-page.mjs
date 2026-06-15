import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pageShell, breadcrumbs, finalCta, CALENDLY, CTA_LABEL, SITE } from "./partials.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "audit.html");

const defaultBody = `
        <section class="audit-hero audit-hero--dark">
            <div class="wrap audit-hero__inner">
                <p class="module-tag audit-hero__tag">The Standen SaaS ops resource</p>
                <h1 class="audit-title audit-title--xl">The 14 Day SaaS Ops Audit</h1>
                <p class="audit-prose audit-prose--lead audit-prose--on-dark">5 places SaaS founders lose hours, margin and delivery speed.</p>
                <p class="audit-prose audit-prose--on-dark">Most SaaS founders do not need a giant platform rebuild first. They need one owned workflow that removes the slowest manual step between sign-up, value and retention.</p>
                <div class="audit-hero__actions">
                    <a href="#audit" class="btn btn--light">Read the audit</a>
                    <a href="${CALENDLY}" class="btn btn--outline-light" target="_blank" rel="noopener">${CTA_LABEL}</a>
                </div>
                <div class="audit-pills">
                    <span class="audit-pill">14 to 30 day builds</span>
                    <span class="audit-pill">Owned by you</span>
                    <span class="audit-pill">Money back if late</span>
                </div>
            </div>
        </section>
        <section id="audit" class="audit-section">
            <div class="wrap">
                <article class="audit-card">
                    <div class="card-content">
                        <span class="issue-number">01</span>
                        <h2 class="audit-title audit-title--lg">Onboarding still happens in docs and email</h2>
                        <p class="audit-prose">If every new customer needs a custom checklist, repeated access chasing and manual setup notes, the product is leaking value before users reach the first useful moment.</p>
                        <p class="audit-prose"><strong>Build first:</strong> a focused onboarding workflow with status, required inputs, owner, due date and handover notes.</p>
                    </div>
                </article>
                <article class="audit-card">
                    <div class="card-content">
                        <span class="issue-number">02</span>
                        <h2 class="audit-title audit-title--lg">Product and revenue data live in separate views</h2>
                        <p class="audit-prose">Activation, retention, subscriptions and CRM context often sit in different tools. Founders end up exporting data instead of making product decisions.</p>
                        <p class="audit-prose"><strong>Build first:</strong> one product dashboard that shows the handful of KPIs that decide what ships next.</p>
                    </div>
                </article>
                <article class="audit-card">
                    <div class="card-content">
                        <span class="issue-number">03</span>
                        <h2 class="audit-title audit-title--lg">Support and account work has no owner</h2>
                        <p class="audit-prose">Requests arrive through email, chat, Slack and spreadsheets. The team knows the work exists, but not who owns it or what is blocked.</p>
                        <p class="audit-prose"><strong>Build first:</strong> a simple admin queue for users, accounts, blockers and next actions.</p>
                    </div>
                </article>
                <article class="audit-card">
                    <div class="card-content">
                        <span class="issue-number">04</span>
                        <h2 class="audit-title audit-title--lg">Pricing experiments happen outside the product</h2>
                        <p class="audit-prose">Trials, add-ons, discounts and plan rules drift when they live in docs and one-off Stripe changes. That makes sales slower and support messier.</p>
                        <p class="audit-prose"><strong>Build first:</strong> a pricing workflow that captures plan logic, upgrade paths and the handoff into checkout or billing.</p>
                    </div>
                </article>
                <article class="audit-card">
                    <div class="card-content">
                        <span class="issue-number">05</span>
                        <h2 class="audit-title audit-title--lg">The team cannot safely extend the product</h2>
                        <p class="audit-prose">When deployment, permissions, data model and handover notes are unclear, every improvement depends on the same person being available.</p>
                        <p class="audit-prose"><strong>Build first:</strong> a clean owned codebase with deployment access, documentation and one narrow workflow shipped properly.</p>
                    </div>
                </article>
            </div>
        </section>`;

const html = pageShell({
    title: "SaaS Ops Audit | 5 Workflow Leaks | Standen",
    description:
        "Free SaaS ops audit: 5 workflows where SaaS founders lose hours and margin. See what to fix before hiring another ops person.",
    canonical: `${SITE}/audit`,
    activeNav: "audit",
    body: `
        <div class="audit-page">
            <div class="wrap">${breadcrumbs([{ label: "Home", href: "/" }, { label: "Audit", href: "/audit" }])}</div>
            ${defaultBody}
        </div>
        ${finalCta("Ready to fix the workflow leak?", "If one of the 5 issues in this audit sounds familiar, we map the highest-value build and the right tier (14, 21 or 30 days).")}`,
});

fs.writeFileSync(OUT, html, "utf8");
console.log("wrote audit.html");
