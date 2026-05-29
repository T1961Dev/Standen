import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pageShell, breadcrumbs, finalCta, CALENDLY, CTA_LABEL, SITE } from "./partials.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const LEGACY = path.join(ROOT, "content", "audit-legacy.html");
const OUT = path.join(ROOT, "audit.html");

const KEEP_CLASS = new Set([
    "audit-pill",
    "card-content",
    "issue-number",
    "subhead",
    "section-label",
    "audit-list",
    "dark-list",
    "price-card",
    "grid-lines",
    "reveal-on-scroll",
]);

function cleanClasses(html) {
    return html.replace(/\sclass="([^"]*)"/g, (_, raw) => {
        const kept = raw.split(/\s+/).filter(
            (c) => KEEP_CLASS.has(c) || c.startsWith("audit-") || c.startsWith("btn")
        );
        return kept.length ? ` class="${kept.join(" ")}"` : "";
    });
}

function mapSections(html) {
    return html
        .replace(/<section\s+class="[^"]*hero-bg[^"]*"[^>]*>/gi, '<section class="audit-hero audit-hero--dark">')
        .replace(/<section\s+id="audit"\s+class="[^"]*mesh-light[^"]*"[^>]*>/gi, '<section id="audit" class="audit-section">')
        .replace(/<section\s+class="[^"]*mesh-light[^"]*"[^>]*>/gi, '<section class="audit-section">')
        .replace(/<section\s+class="[^"]*bg-ink[^"]*"[^>]*>/gi, '<section class="audit-section audit-section--dark">')
        .replace(/class="bento-card dark-card[^"]*"/g, 'class="audit-card audit-card--dark"')
        .replace(/class="bento-card[^"]*"/g, 'class="audit-card"')
        .replace(/class="title-xl[^"]*"/g, 'class="audit-title audit-title--xl"')
        .replace(/class="title-lg[^"]*"/g, 'class="audit-title audit-title--lg"')
        .replace(/class="body-copy-dark[^"]*"/g, 'class="audit-prose audit-prose--on-dark"')
        .replace(/class="body-copy[^"]*"/g, 'class="audit-prose"')
        .replace(/\sclass="btn btn-light[^"]*"/g, ' class="btn btn--light"')
        .replace(/\sclass="btn btn-ghost-light[^"]*"/g, ' class="btn btn--outline-light"')
        .replace(/<div class="mx-auto max-w-6xl">/g, '<div class="wrap">')
        .replace(/<div class="relative mx-auto max-w-5xl">/g, '<div class="wrap audit-hero__inner">');
}

function standardizeAuditCtas(html) {
    return html
        .replace(/<img src="https:\/\/upload\.wikimedia\.org[^>]*>/g, "")
        .replace(/Book a (20 minute scoping call|software audit call|discovery call)/g, CTA_LABEL)
        .replace(
            /<section class="audit-section audit-section--dark">[\s\S]*?Book a Free Consultation[\s\S]*?<\/section>\s*$/i,
            ""
        );
}

function extractMain(html) {
    const m = html.match(/<main>([\s\S]*)<\/main>/i);
    if (!m) throw new Error("Could not find <main> in audit.html");
    return m[1];
}

function transformLegacy(html) {
    let main = extractMain(html);
    main = mapSections(main);
    main = cleanClasses(main);
    main = main.replace(/<a href="\/process"/g, '<a href="/#process"');
    main = main.replace(/<a href="\/pricing"/g, '<a href="/#pricing"');
    main = standardizeAuditCtas(main);
    return main;
}

function buildFromLegacy() {
    if (!fs.existsSync(LEGACY)) {
        console.warn("content/audit-legacy.html missing");
        return null;
    }
    return transformLegacy(fs.readFileSync(LEGACY, "utf8"));
}

const bodyFromLegacy = buildFromLegacy();

const defaultBody = `
        <section class="audit-hero audit-hero--dark">
            <div class="wrap audit-hero__inner">
                <p class="module-tag audit-hero__tag">The Standen agency ops resource</p>
                <h1 class="audit-title audit-title--xl">The 14 Day Agency Ops Audit</h1>
                <p class="audit-prose audit-prose--lead audit-prose--on-dark">5 places agencies lose hours, margin and delivery speed.</p>
                <p class="audit-prose audit-prose--on-dark">Most agencies do not have a software problem. They have an operations problem hiding inside broken workflows, manual reporting, slow onboarding and disconnected tools.</p>
                <div class="audit-hero__actions">
                    <a href="#audit" class="btn btn--light">Read the audit</a>
                    <a href="${CALENDLY}" class="btn btn--outline-light" target="_blank" rel="noopener">${CTA_LABEL}</a>
                </div>
                <div class="audit-pills">
                    <span class="audit-pill">Built in 14 days</span>
                    <span class="audit-pill">Owned by you</span>
                    <span class="audit-pill">Money back if late</span>
                </div>
            </div>
        </section>
        <p class="wrap"><a href="#audit">Continue to full audit content</a></p>`;

const auditMain = bodyFromLegacy || defaultBody;

const html = pageShell({
    title: "Agency Ops Audit | 5 Workflow Leaks | Standen",
    description:
        "Free agency ops audit: 5 workflows where B2B agencies lose hours and margin. See what to fix before hiring another ops person.",
    canonical: `${SITE}/audit`,
    activeNav: "audit",
    body: `
        <div class="audit-page">
            <div class="wrap">${breadcrumbs([{ label: "Home", href: "/" }, { label: "Audit", href: "/audit" }])}</div>
            ${auditMain}
        </div>
        ${finalCta("Ready to fix the workflow leak?", "If one of the 5 issues in this audit sounds familiar, we map the highest-value build and whether it fits inside 14 days.")}`,
});

fs.writeFileSync(OUT, html, "utf8");
console.log("wrote audit.html");
