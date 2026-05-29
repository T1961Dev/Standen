import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SERVICE_ANCHORS } from "./service-anchors.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const content = JSON.parse(fs.readFileSync(path.join(ROOT, "content/enterprise.json"), "utf8"));

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

const FEATURES = {
    "agency-proposal-systems": ["Scoped pricing and approval chains", "Version history and buyer-ready export"],
    "agency-reporting-dashboard": ["Live KPIs per client", "GA4, ads and CRM in one view"],
    "agency-client-portal": ["Status, files and approvals in one place", "Branded portal your clients open"],
    "agency-internal-crm": ["Lead routing and delivery queues", "Founder view of blockers and workload"],
    "saas-mvp-development": ["Auth, billing-ready architecture", "Private live link from day one"],
    "internal-tools-for-agencies": ["Slack, Notion and CRM integrations", "Replace spreadsheet glue work"],
};

const LINK_LABELS = {
    "agency-proposal-systems": "Proposal systems",
    "agency-reporting-dashboard": "Reporting dashboards",
    "agency-client-portal": "Client portals",
    "agency-internal-crm": "Internal CRM",
    "saas-mvp-development": "SaaS MVP builds",
    "internal-tools-for-agencies": "Internal tools",
};

function card(svc, i) {
    const id = SERVICE_ANCHORS[svc.slug] || svc.slug;
    const delay = i ? ` style="--reveal-delay: ${i * 60}ms"` : "";
    const delivery = svc.slug === "saas-mvp-development" ? "14 to 21 days" : "14 days";
    const mock = MOCKS[svc.slug] || "";
    const features = (FEATURES[svc.slug] || [])
        .map((f) => `<li>${f}</li>`)
        .join("");
    const linkLabel = LINK_LABELS[svc.slug] || svc.tag;

    return `                <article id="${id}" class="services-card reveal"${delay}>
                    <div class="services-card__top">
                        <span class="module-tag">${svc.tag}</span>
                        <span class="services-card__delivery">${delivery}</span>
                    </div>
                    <div class="services-card__visual" aria-hidden="true">${mock}</div>
                    <div class="services-card__body">
                        <h3>${svc.h1}</h3>
                        <p>${svc.lead}</p>
                        <ul class="services-card__features">${features}</ul>
                        <span class="services-card__link">Explore ${linkLabel} <span aria-hidden="true">&gt;</span></span>
                    </div>
                </article>`;
}

const section = `        <section class="services" id="services" aria-labelledby="services-heading">
            <div class="wrap">
                <header class="services-head reveal">
                    <span class="module-tag">Services</span>
                    <h2 id="services-heading">What we build for agencies</h2>
                    <p class="services-lead">Six focused systems. One owned codebase. Scoped and shipped in fixed sprints with full handover.</p>
                </header>
                <div class="services-grid">
${content.services.map(card).join("\n")}
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
