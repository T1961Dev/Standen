import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SERVICE_ANCHORS } from "./service-anchors.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const content = JSON.parse(fs.readFileSync(path.join(ROOT, "content/enterprise.json"), "utf8"));

const HOMEPAGE_ORDER = [
    "internal-tools-for-agencies",
    "agency-reporting-dashboard",
    "agency-proposal-systems",
    "agency-client-portal",
    "agency-internal-crm",
];

const HOMEPAGE_COPY = {
    "internal-tools-for-agencies": {
        h1: "Custom software and internal tools",
        lead: "Automate the manual, repeated-per-client work in your delivery. Lead routers, data pipelines, qualification and research workflows, built around how your team already works.",
        features: ["API and CRM integrations", "Replace manual copy-paste work"],
    },
    "agency-proposal-systems": {
        h1: "Proposal and quoting systems",
        lead: "Send proposals while the buyer still remembers the call, with scope, pricing and approvals in one owned system, not another Google Doc.",
        features: ["Scoped pricing and approval chains", "Version history and buyer-ready export"],
    },
    "agency-reporting-dashboard": {
        h1: "Reporting dashboards",
        lead: "Pull analytics, ads and CRM data into one live client-ready view, and stop rebuilding the same report every month.",
        features: ["Live KPIs per account", "GA4, ads and CRM in one view"],
    },
    "agency-client-portal": {
        h1: "Client and customer portals",
        lead: "Move delivery out of Slack threads and email. One secure portal for status, files and approvals your users actually open.",
        features: ["Status, files and approvals in one place", "Branded portal experience"],
    },
    "agency-internal-crm": {
        h1: "Internal ops and delivery queues",
        lead: "Route work, track delivery and surface blockers in one workspace your team actually opens.",
        features: ["Lead routing and delivery queues", "Delivery visibility for leads"],
    },
};

const MOCKS = {
    "agency-proposal-systems": `<div class="mock-proposal">
        <div class="mock-proposal__head"><strong>Q2 Retainer</strong><span>Draft</span></div>
        <div class="mock-line wide"></div>
        <div class="mock-line short"></div>
        <div class="mock-line wide"></div>
        <div class="mock-proposal__price"><span>Total</span><strong>£12,400</strong></div>
    </div>`,
    "agency-reporting-dashboard": `<div class="mock-report">
        <div class="mock-report__stats">
            <div><span>Spend</span><strong>£24k</strong></div>
            <div><span>ROAS</span><strong>3.2x</strong></div>
            <div><span>Leads</span><strong>186</strong></div>
        </div>
        <div class="mock-bars">
            <i style="--h:58%"></i><i style="--h:82%"></i><i style="--h:44%"></i><i style="--h:70%"></i><i style="--h:92%"></i>
        </div>
    </div>`,
    "agency-client-portal": `<div class="mock-portal">
        <div class="mock-portal__head"><strong>Website relaunch</strong><span>Week 3</span></div>
        <div class="mock-portal__steps">
            <span class="done">Brief</span><span class="done">Design</span><span>Build</span><span>Launch</span>
        </div>
        <div class="mock-portal__note"><strong>Approved</strong>Homepage wireframes signed off today.</div>
    </div>`,
    "agency-internal-crm": `<div class="mock-ops">
        <div class="mock-ops__queue"><span>Leads</span><span>In build</span><span>Blocked</span></div>
        <div class="mock-ops__rows">
            <div><strong>Acme Co</strong><span>Design</span><em>On track</em></div>
            <div><strong>Bright Ltd</strong><span>Dev</span><em>Blocked</em></div>
        </div>
    </div>`,
    "internal-tools-for-agencies": `<div class="mock-internal">
        <div class="mock-internal__flow"><span>Sheets</span><i aria-hidden="true"></i><span>Router</span><i aria-hidden="true"></i><span>CRM</span></div>
        <div class="mock-internal__rows">
            <div><strong>Lead sync</strong><em>Every hour</em></div>
            <div><strong>Weekly report</strong><em>Automated</em></div>
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
                    <p class="services-lead">Internal tools, reporting, proposals, portals and ops software for B2B agencies. One owned codebase per build, scoped and shipped in fixed sprints.</p>
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
