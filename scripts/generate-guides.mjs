import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";
import {
    pageShell,
    breadcrumbs,
    finalCta,
    SITE,
    escapeHtml,
    ROBOTS_INDEX,
} from "./partials.mjs";
import { renderGuideBody } from "./guides-content.mjs";
import { metaDescription, articleSchema } from "./seo-meta.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const GUIDES_DIR = path.join(ROOT, "guides");

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "guides-data.js"), "utf8"), sandbox);
const guides = sandbox.window.GUIDES || [];

const CATEGORY_COPY = {
    Proposals: {
        service: "/#service-proposals",
        system: "pricing and subscription workflow",
        pain: "plans, trials, upgrades and approval rules live in separate tools",
        first: "a reusable pricing flow with plan rules, trial logic, internal sign-off and checkout-ready handoff",
        signal: "revenue experiments slow down because the team is rewriting the same pricing logic every week",
    },
    Reporting: {
        service: "/#service-reporting",
        system: "product analytics dashboard",
        pain: "activation, retention and revenue data live in separate exports",
        first: "one founder-ready dashboard with the KPIs, cohorts and revenue signals your team actually uses",
        signal: "the numbers already exist, but your team has to rebuild the view each time",
    },
    Portals: {
        service: "/#service-portals",
        system: "customer portal",
        pain: "status, files, approvals and account actions are split across email, support tools and spreadsheets",
        first: "a secure portal for onboarding status, account actions, files, approvals and customer messages",
        signal: "customer questions repeat because the product does not give them one trusted place to act",
    },
    Operations: {
        service: "/#service-crm",
        system: "operations system",
        pain: "users, accounts, support queues and blockers are spread across tools nobody fully trusts",
        first: "a lightweight admin dashboard with queues, owners, blockers and a founder view",
        signal: "the same handover breaks every week and meetings exist just to locate the truth",
    },
    Process: {
        service: "/audit.html",
        system: "scoped first build",
        pain: "the workflow is painful, but the first version is not yet sharply defined",
        first: "one workflow, one user group, one measurable outcome and a fixed handover plan",
        signal: "the idea keeps expanding before anyone has shipped the first useful version",
    },
    Ownership: {
        service: "/#service-internal",
        system: "owned software system",
        pain: "critical product logic is rented from tools that do not match how the SaaS operates",
        first: "source code, deployment access, documentation and the workflow model in one handover",
        signal: "you are paying recurring licence fees while still doing manual glue work around the product",
    },
    Strategy: {
        service: "/compare/index.html",
        system: "build decision",
        pain: "the founder is unsure whether to buy tools, build software or change process first",
        first: "a decision map covering product value, frequency, integration needs and ownership risk",
        signal: "off-the-shelf tools solve 70% of the job and the remaining 30% costs the margin",
    },
    Technical: {
        service: "/#service-internal",
        system: "integration layer",
        pain: "useful data already exists, but people still move it manually between systems",
        first: "the smallest reliable integration that removes repeated copy-paste from a core workflow",
        signal: "operators spend more time reconciling data than using it",
    },
    Pricing: {
        service: "/#pricing",
        system: "fixed-scope build",
        pain: "pricing is unclear because the workflow has not been reduced to one useful version",
        first: "a fixed-scope phase with deliverables, acceptance criteria and ownership terms agreed upfront",
        signal: "budget conversations happen before the real workflow constraints are visible",
    },
    AI: {
        service: "/#service-saas",
        system: "agent-ready software layer",
        pain: "workflows are still built only for humans clicking through screens",
        first: "a product surface with clear data, actions, permissions and audit trail",
        signal: "AI can assist the team, but the underlying system is too fragmented to automate safely",
    },
};

function write(rel, html) {
    const abs = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, html, "utf8");
    console.log("wrote", rel);
}

function readExistingA2ABody() {
    const file = path.join(GUIDES_DIR, "a2a-protocol.html");
    if (!fs.existsSync(file)) return "";
    const html = fs.readFileSync(file, "utf8");
    const match = html.match(/<div class="guide-article__body">([\s\S]*?)\n\s*<\/div>\s*<\/div>\s*<\/article>/);
    return match ? match[1].replace(/\s*<section class="seo-faq"[\s\S]*?<\/section>\s*$/i, "").trim() : "";
}

function readTimeLabel(guide) {
    return /read/i.test(guide.readTime) ? guide.readTime : `${guide.readTime} read`;
}

function copyFor(guide) {
    return CATEGORY_COPY[guide.category] || CATEGORY_COPY.Strategy;
}

function renderGeneratedBody(guide) {
    const c = copyFor(guide);
    return `
                    <p class="guide-article__lead">${escapeHtml(guide.excerpt)}</p>
                    <p class="seo-answer">${escapeHtml(guide.excerpt)} For teams building SaaS products or custom software, the answer is usually a smaller owned system that removes one repeated workflow and gives operators a reliable source of truth.</p>

                    <h2>Who this guide is for</h2>
                    <p>Founders, product leads and operators who are deciding whether to buy another SaaS seat, patch spreadsheets, or scope a focused custom build. If you already know the workflow is painful but the first version is not defined, start here.</p>

                    <h2>What this means in practice</h2>
                    <p>This is a ${escapeHtml(c.system)} question. If ${escapeHtml(c.pain)}, the process is already costing time, trust and margin. Buyers notice slow follow-up, inconsistent numbers, unclear approvals and handovers that depend on one person remembering the details.</p>

                    <h2>When to prioritise it</h2>
                    <p>Prioritise this when ${escapeHtml(c.signal)}. That is the point where a better template is no longer enough. You need workflow rules, permissions, history and reporting that match how the product or ops team actually works.</p>

                    <h2>What to build first</h2>
                    <p>Scope ${escapeHtml(c.first)}. Keep the first version narrow, one user group, one workflow, one measurable outcome. The goal is not to replace every tool in the company. The goal is to remove the highest-friction handoff and make the system trustworthy enough to use every week.</p>

                    <h2>How to scope it like a product</h2>
                    <ul>
                        <li>Write the workflow as steps a new hire could follow without asking you.</li>
                        <li>List inputs, outputs, integrations and who approves each step.</li>
                        <li>Define one success metric you can check at handover (time saved, errors removed, faster send).</li>
                        <li>Cut anything that does not serve that metric in version one.</li>
                    </ul>

                    <h2>How Standen scopes SaaS and custom software builds</h2>
                    <p>Standen maps the workflow on a discovery call, agrees fixed scope and price, builds behind a private live link and hands over the codebase, deployment access and documentation. The first useful version is usually scoped for a 14 to 30 day delivery window depending on surface area.</p>

                    <p class="guide-article__close"><a href="${c.service}">See the relevant Standen service</a> · <a href="/blog.html">More guides</a> · <a href="/audit.html">SaaS ops audit</a>.</p>`;
}

function renderGuide(guide) {
    const url = `${SITE}/guides/${guide.slug}`;
    const isA2A = guide.slug === "a2a-protocol";
    const existingA2ABody = isA2A ? readExistingA2ABody() : "";
    const customBody = !isA2A
        ? renderGuideBody(guide, { copyFor, escapeHtml })
        : null;
    const body = existingA2ABody || customBody || renderGeneratedBody(guide);
    const hero = guide.image
        ? `<div class="guide-article__hero${guide.imageFit === "contain" ? " guide-article__hero--contain" : ""}"><img src="${escapeHtml(guide.image)}" alt="${escapeHtml(guide.title)}" width="800" height="520" loading="eager" decoding="async"></div>`
        : "";

    const desc = metaDescription(guide.excerpt);
    return pageShell({
        title: `${guide.title} | Standen`,
        description: desc,
        canonical: url,
        activeNav: "blog",
        robots: ROBOTS_INDEX,
        ogType: "article",
        schema: articleSchema({ title: guide.title, description: desc, url }),
        body: `
        <article class="guide-article" aria-labelledby="guide-title">
            <div class="wrap">
                ${breadcrumbs([{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: guide.title, href: `/guides/${guide.slug}` }])}
                <header class="guide-article__head">
                    <a href="/blog.html" class="guide-article__back text-link">Blog <span aria-hidden="true">&gt;</span></a>
                    <p class="notes-meta guide-article__meta">${escapeHtml(guide.category)} <span>&middot;</span> ${escapeHtml(readTimeLabel(guide))}</p>
                    <h1 id="guide-title">${escapeHtml(guide.title)}</h1>
                    ${hero}
                </header>

                <div class="guide-article__body">
                    ${body}
                </div>
            </div>
        </article>
        ${finalCta("Want this workflow rebuilt properly?")}`,
    });
}

for (const guide of guides) {
    write(`guides/${guide.slug}.html`, renderGuide(guide));
}

write(
    "guides.html",
    `<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, follow">
    <link rel="canonical" href="${SITE}/blog">
    <title>Guides | Standen</title>
    <script>location.replace("/blog.html");</script>
</head>
<body><p><a href="/blog.html">View blog and guides</a></p></body>
</html>`
);
