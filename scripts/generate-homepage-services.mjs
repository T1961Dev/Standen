import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SERVICE_ANCHORS } from "./service-anchors.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const content = JSON.parse(fs.readFileSync(path.join(ROOT, "content/enterprise.json"), "utf8"));

const HOMEPAGE_ORDER = [
    "saas-mvp-development",
    "internal-tools-for-agencies",
    "agency-client-portal",
    "agency-reporting-dashboard",
    "agency-internal-crm",
];

const HOMEPAGE_COPY = {
    "saas-mvp-development": {
        h1: "SaaS MVP development",
        lead: "Turn a scoped product idea into a live SaaS MVP with auth, core workflows, billing-ready architecture, deployment and handover.",
        features: ["Auth, roles and core user journeys", "Billing-ready architecture and deployment"],
    },
    "internal-tools-for-agencies": {
        h1: "Product workflow automation",
        lead: "Automate the repeated product ops work behind onboarding, fulfilment, support and data workflows, built around how your SaaS actually runs.",
        features: ["API and CRM integrations", "Replace manual product ops work"],
    },
    "agency-proposal-systems": {
        h1: "Pricing and subscription workflows",
        lead: "Connect plan logic, trials, checkout and upgrades in one owned workflow, not a spreadsheet behind Stripe.",
        features: ["Plan logic and upgrade paths", "Checkout-ready product flows"],
    },
    "agency-reporting-dashboard": {
        h1: "Product analytics dashboards",
        lead: "Pull product, revenue and customer data into one live view, so founders can see activation, retention and the next bottleneck clearly.",
        features: ["Activation and retention KPIs", "Product, revenue and CRM in one view"],
    },
    "agency-client-portal": {
        h1: "Customer portals",
        lead: "Give customers one secure place to manage onboarding, files, approvals, status and account actions inside your product experience.",
        features: ["Status, files and approvals in one place", "Branded customer experience"],
    },
    "agency-internal-crm": {
        h1: "Admin dashboards and ops tools",
        lead: "Manage users, accounts, support queues and product operations from one workspace your team actually opens.",
        features: ["User and account management", "Operational visibility for founders"],
    },
};

const MOCKS = {
    "saas-mvp-development": `<div class="mock-portal">
        <div class="mock-portal__head"><strong>Workspace</strong><span>Live</span></div>
        <div class="mock-portal__steps">
            <span class="done">Auth</span><span class="done">Core flow</span><span>Billing</span><span>Launch</span>
        </div>
        <div class="mock-portal__note"><strong>Trial active</strong> 8 users onboarded this week.</div>
    </div>`,
    "agency-proposal-systems": `<div class="mock-proposal">
        <div class="mock-proposal__head"><strong>Q2 Retainer</strong><span>Draft</span></div>
        <div class="mock-line wide"></div>
        <div class="mock-line short"></div>
        <div class="mock-line wide"></div>
        <div class="mock-proposal__price"><span>Total</span><strong>£12,400</strong></div>
    </div>`,
    "agency-reporting-dashboard": `<div class="mock-report">
        <div class="mock-report__stats">
            <div><span>MRR</span><strong>£24k</strong></div>
            <div><span>Activation</span><strong>62%</strong></div>
            <div><span>Trials</span><strong>186</strong></div>
        </div>
        <div class="mock-bars">
            <i style="--h:58%"></i><i style="--h:82%"></i><i style="--h:44%"></i><i style="--h:70%"></i><i style="--h:92%"></i>
        </div>
    </div>`,
    "agency-client-portal": `<div class="mock-portal">
        <div class="mock-portal__head"><strong>Customer setup</strong><span>Week 1</span></div>
        <div class="mock-portal__steps">
            <span class="done">Invite</span><span class="done">Data</span><span>Review</span><span>Live</span>
        </div>
        <div class="mock-portal__note"><strong>Ready</strong> Billing and workspace access confirmed.</div>
    </div>`,
    "agency-internal-crm": `<div class="mock-ops">
        <div class="mock-ops__queue"><span>Users</span><span>Trials</span><span>Blocked</span></div>
        <div class="mock-ops__rows">
            <div><strong>Acme Co</strong><span>Onboarding</span><em>On track</em></div>
            <div><strong>Bright Ltd</strong><span>Billing</span><em>Blocked</em></div>
        </div>
    </div>`,
    "internal-tools-for-agencies": `<div class="mock-internal">
        <div class="mock-internal__flow"><span>Sheets</span><i aria-hidden="true"></i><span>Router</span><i aria-hidden="true"></i><span>CRM</span></div>
        <div class="mock-internal__rows">
            <div><strong>Signup sync</strong><em>Every hour</em></div>
            <div><strong>Usage report</strong><em>Automated</em></div>
        </div>
    </div>`,
};

function card(svc, i) {
    const id = SERVICE_ANCHORS[svc.slug] || svc.slug;
    const delay = i ? ` style="--reveal-delay: ${i * 60}ms"` : "";
    const delivery = "14 to 30 days";
    const mock = MOCKS[svc.slug] || "";
    const copy = HOMEPAGE_COPY[svc.slug];
    const features = (copy?.features || [])
        .map((f) => `<li>${f}</li>`)
        .join("");
    const h1 = copy?.h1 || svc.h1;
    const lead = copy?.lead || svc.lead;

    return `                <article id="${id}" class="services-card reveal"${delay}>
                    <div class="services-card__top">
                        <span class="module-tag">${svc.tag}</span>
                        <span class="services-card__delivery">${delivery}</span>
                    </div>
                    <div class="services-card__visual" aria-hidden="true">${mock}</div>
                    <div class="services-card__body">
                        <h3>${h1}</h3>
                        <p>${lead}</p>
                        <ul class="services-card__features">${features}</ul>
                    </div>
                </article>`;
}

const servicesBySlug = Object.fromEntries(content.services.map((s) => [s.slug, s]));
const orderedServices = HOMEPAGE_ORDER.map((slug) => servicesBySlug[slug]).filter(Boolean);

const section = `        <section class="services" id="services" aria-labelledby="services-heading">
            <div class="wrap">
                <header class="services-head reveal">
                    <span class="module-tag">Services</span>
                    <h2 id="services-heading">What we build</h2>
                    <p class="services-lead">SaaS MVPs, product workflows, customer portals and admin dashboards for founders. One owned codebase per build, scoped and shipped in fixed sprints.</p>
                </header>
                <div class="services-grid">
${orderedServices.map(card).join("\n")}
                </div>
            </div>
        </section>`;

const indexPath = path.join(ROOT, "index.html");
let index = fs.readFileSync(indexPath, "utf8");
const start = "<!-- HOMEPAGE-SERVICES -->";
const end = "<!-- /HOMEPAGE-SERVICES -->";

if (!index.includes(start)) {
    console.error("Missing HOMEPAGE-SERVICES markers in index.html");
    process.exit(1);
}
index = index.replace(new RegExp(`${start}[\\s\\S]*?${end}`, "m"), `${start}\n${section}\n        ${end}`);
fs.writeFileSync(indexPath, index, "utf8");
console.log("updated index.html services section");
