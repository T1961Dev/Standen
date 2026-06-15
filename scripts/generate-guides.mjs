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
    ROBOTS_NOINDEX,
} from "./partials.mjs";
import { renderGuideBody } from "./guides-content.mjs";

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
                    <p class="seo-answer">${escapeHtml(guide.excerpt)} For most SaaS founders, the answer is not another generic tool. It is a smaller owned system that removes one repeated product workflow problem and gives operators a reliable source of truth.</p>

                    <h2>What this means in practice</h2>
                    <p>This is a ${escapeHtml(c.system)} question. If ${escapeHtml(c.pain)}, the process is already costing time, trust and margin. Enterprise buyers also notice the mess: slow follow-up, inconsistent numbers, unclear approvals and handovers that depend on one person remembering the details.</p>

                    <h2>When to prioritise it</h2>
                    <p>Prioritise this when ${escapeHtml(c.signal)}. That is the point where a better template is no longer enough. You need workflow rules, permissions, history and reporting that match how the product actually operates.</p>

                    <h2>What to build first</h2>
                    <p>Scope ${escapeHtml(c.first)}. Keep the first version narrow, one user group, one workflow, one clear success metric. The goal is not to replace every tool in the company. The goal is to remove the highest-friction handoff and make the system trustworthy enough to use every week.</p>

                    <h2>How Standen scopes it</h2>
                    <p>Standen maps the workflow, agrees fixed scope, builds behind a private live link and hands over the codebase, deployment access and documentation. The first useful version is usually scoped for a 14-day delivery window.</p>

                    <p class="guide-article__close"><a href="${c.service}">See the relevant Standen service</a> or <a href="/audit.html">read the SaaS ops audit</a>.</p>`;
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

    return pageShell({
        title: `${guide.title} | Standen Guides`,
        description: guide.excerpt,
        canonical: url,
        activeNav: "guides",
        robots: ROBOTS_NOINDEX,
        ogType: "article",
        schema: {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: guide.title,
            description: guide.excerpt,
            author: { "@type": "Organization", name: "Standen" },
            publisher: { "@type": "Organization", name: "Standen" },
            dateModified: "2026-05-29",
            mainEntityOfPage: url,
        },
        body: `
        <article class="guide-article" aria-labelledby="guide-title">
            <div class="wrap">
                ${breadcrumbs([{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: guide.title, href: `/guides/${guide.slug}` }])}
                <header class="guide-article__head">
                    <a href="/guides.html" class="guide-article__back text-link">All guides <span aria-hidden="true">&gt;</span></a>
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
    pageShell({
        title: "Guides | Standen",
        description: "Free guides for SaaS founders, product workflows, customer portals, operations and custom software. Practical build notes from Standen.",
        canonical: `${SITE}/guides`,
        activeNav: "guides",
        robots: ROBOTS_NOINDEX,
        extraScripts: `
    <script src="/guides-data.js"></script>
    <script src="/guides.js"></script>`,
        body: `
        <section class="notes guides-page" aria-labelledby="guides-heading">
            <div class="wrap">
                <header class="guides-page-head">
                    <span class="guides-intro__eyebrow">SaaS resources</span>
                    <h1 id="guides-heading">Guides for SaaS founders building better products</h1>
                    <p class="guides-page-lead">Practical notes on MVPs, product workflows, customer portals and internal ops, written for SaaS founders and operators who want cleaner delivery without hiring another operations person first.</p>
                </header>

                <div class="guides-search" role="search">
                    <label class="guides-search__field" for="guides-search">
                        <svg class="guides-search__icon" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="5.25" stroke="currentColor" stroke-width="1.35"/><path d="M12.5 12.5 16 16" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/></svg>
                        <input type="search" id="guides-search" name="q" placeholder="Search guides…" autocomplete="off" spellcheck="false">
                    </label>
                    <p class="guides-search__count" id="guides-search-count" aria-live="polite"></p>
                </div>

                <div class="guides-bento" id="guides-grid"></div>
                <p class="guides-empty" id="guides-empty" hidden>No guides match your search.</p>
            </div>
        </section>

        ${finalCta("Ready to build the product workflow behind one of these ideas?")}`,
    })
);
