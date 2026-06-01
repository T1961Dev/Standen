import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SERVICE_ANCHORS } from "./service-anchors.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const content = JSON.parse(fs.readFileSync(path.join(ROOT, "content/enterprise.json"), "utf8"));

const HOMEPAGE_ORDER = [
    "saas-mvp-development",
    "internal-tools-for-agencies",
    "agency-proposal-systems",
    "agency-reporting-dashboard",
    "agency-client-portal",
    "agency-internal-crm",
];

const HOMEPAGE_COPY = {
    "saas-mvp-development": {
        h1: "SaaS MVP development",
        lead: "From scoped idea to live product with auth, billing-ready architecture and full handover. OhMyPod shipped in 21 days.",
        features: ["Auth and billing-ready architecture", "Private live link from day one"],
        link: "SaaS MVP builds",
    },
    "internal-tools-for-agencies": {
        h1: "Custom software and internal tools",
        lead: "Replace spreadsheet glue with owned software: lead routers, data pipelines, automation and ops dashboards built around how your team already works.",
        features: ["API and CRM integrations", "Replace manual copy-paste work"],
        link: "Custom software",
    },
    "agency-proposal-systems": {
        h1: "Proposal and quoting systems",
        lead: "Send proposals while the buyer still remembers the call, with scope, pricing and approvals in one owned system, not another Google Doc.",
        features: ["Scoped pricing and approval chains", "Version history and buyer-ready export"],
        link: "Proposal systems",
    },
    "agency-reporting-dashboard": {
        h1: "Reporting dashboards",
        lead: "Pull analytics, ads and CRM data into one live view for clients or internal teams, and stop rebuilding the same deck every month.",
        features: ["Live KPIs per account", "GA4, ads and CRM in one view"],
        link: "Reporting dashboards",
    },
    "agency-client-portal": {
        h1: "Client and customer portals",
        lead: "Move delivery out of Slack threads and email. One secure portal for status, files and approvals your users actually open.",
        features: ["Status, files and approvals in one place", "Branded portal experience"],
        link: "Client portals",
    },
    "agency-internal-crm": {
        h1: "Internal ops and delivery queues",
        lead: "Route work, track delivery and surface blockers in one workspace your team actually opens.",
        features: ["Lead routing and delivery queues", "Founder view of blockers and workload"],
        link: "Internal ops",
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
    "saas-mvp-development": `<div class="mock-saas">
        <div class="mock-saas__head"><strong>Product dashboard</strong><span>Live</span></div>
        <div class="mock-saas__metrics">
            <div><span>Users</span><strong>248</strong></div>
            <div><span>MRR</span><strong>£4.2k</strong></div>
            <div><span>Uptime</span><strong>99.9%</strong></div>
        </div>
        <div class="mock-saas__usage"><i style="--w:72%"></i></div>
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
                    <p class="services-lead">SaaS MVPs, custom software and internal tools for founders and agencies. One owned codebase per build, scoped and shipped in fixed sprints.</p>
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
