import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
    pageShell,
    breadcrumbs,
    faqSection,
    faqSchema,
    finalCta,
    SITE,
    CALENDLY,
    CTA_LABEL,
} from "./partials.mjs";
import { redirectPage, serviceHref, servicesHubHref } from "./service-anchors.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const content = JSON.parse(fs.readFileSync(path.join(ROOT, "content/enterprise.json"), "utf8"));

function write(rel, html) {
    const abs = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, html, "utf8");
    console.log("wrote", rel);
}

function renderCompare(c) {
    const url = `${SITE}/compare/${c.slug}`;
    const sections = (c.sections || [])
        .map((s) => `<h2>${s.h2}</h2><p>${s.p}</p>`)
        .join("\n                    ");
    const body = `
        <article class="guide-article">
            <div class="wrap">
                ${breadcrumbs([{ label: "Home", href: "/" }, { label: "Compare", href: "/compare" }, { label: c.h1, href: `/compare/${c.slug}` }])}
                <header class="guide-article__head">
                    <p class="seo-updated">Last updated May 2026</p>
                    <p class="notes-meta guide-article__meta">Guide <span>·</span> Compare</p>
                    <h1>${c.h1}</h1>
                    <p class="guide-article__lead">${c.lead}</p>
                </header>
                <div class="guide-article__body">
                    ${sections}
                    ${c.faqs ? faqSection(c.faqs) : ""}
                    <p class="guide-article__close"><a href="${servicesHubHref()}">Explore services</a> · <a href="${CALENDLY}" target="_blank" rel="noopener">${CTA_LABEL}</a></p>
                </div>
            </div>
        </article>
        ${finalCta()}`;

    return pageShell({
        title: c.title,
        description: c.meta,
        canonical: url,
        activeNav: "",
        schema: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Article",
                    headline: c.h1,
                    dateModified: "2026-05-26",
                    mainEntityOfPage: url,
                },
                ...(c.faqs ? [faqSchema(c.faqs)] : []),
            ],
        },
        ogType: "article",
        body,
    });
}

function renderCompareHub() {
    const items = content.comparisons
        .map(
            (c) =>
                `<a href="/compare/${c.slug}.html" class="service-hub__card"><h2>${c.h1}</h2><p>${c.meta}</p><span class="text-link">Read guide <span aria-hidden="true">&gt;</span></span></a>`
        )
        .join("");

    return pageShell({
        title: "Compare | Agency Build Guides | Standen",
        description: "Build vs buy, custom CRM vs spreadsheets, software vs hiring ops, practical guides for agency founders.",
        canonical: SITE + "/compare",
        body: `
        <section class="service-hub">
            <div class="wrap">
                ${breadcrumbs([{ label: "Home", href: "/" }, { label: "Compare", href: "/compare" }])}
                <header class="guides-page-head">
                    <h1>Compare your options</h1>
                    <p class="guides-page-lead">Decision guides for agency founders, written to be cited and useful, not generic thought leadership.</p>
                </header>
                <div class="service-hub__grid">${items}</div>
            </div>
        </section>
        ${finalCta()}`,
    });
}

// Service URLs redirect to homepage anchors (services live on /)
write("services/index.html", redirectPage(servicesHubHref(), "Services"));
for (const svc of content.services) {
    write(`services/${svc.slug}.html`, redirectPage(serviceHref(svc.slug), svc.h1));
}

// Compare hub + pages
write("compare/index.html", renderCompareHub());
for (const c of content.comparisons) {
    write(`compare/${c.slug}.html`, renderCompare(c));
}

console.log("Done. Service pages are redirects to homepage anchors.");
