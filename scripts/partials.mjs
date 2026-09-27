import { serviceHref, servicesHubHref } from "./service-anchors.mjs";
import { metaDescription } from "./seo-meta.mjs";

const SITE = "https://www.standen.io";
const BRAND_NAME = "standen";
const CALENDLY = "https://calendly.com/standen/discovery-call";
const CTA_LABEL = "Book a Call";
const FOOTER_TAGLINE =
    "SaaS products for founders. Live from 2 weeks.";
const CONTACT_EMAIL = "tomas@standen.io";
const CTA_ARROW =
    '<span class="btn__arrow" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M6.5 3.5 9 6 6.5 8.5" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';

export function accentCtaButton(extraClass = "nav-cta", { active = false } = {}) {
    const activeMod = active ? " btn--accent-active" : "";
    const classes = `btn btn--accent${activeMod}${extraClass ? ` ${extraClass.trim()}` : ""}`;
    return `<a href="${CALENDLY}" class="${classes}" target="_blank" rel="noopener"><span class="btn__text">${CTA_LABEL}</span>${CTA_ARROW}</a>`;
}

export function webinarsNavButton() {
    return "";
}
const LINKEDIN_URL = "https://www.linkedin.com/in/tomas-jones1/";

export const ROBOTS_INDEX = "index, follow";
export const ROBOTS_NOINDEX = "noindex, follow";

export function headBlock({ title, description, canonical, ogType = "website", schema, robots = ROBOTS_INDEX }) {
    const safeDescription = metaDescription(description);
    const schemaScript = schema
        ? `\n    <script type="application/ld+json">\n    ${JSON.stringify(schema)}\n    </script>`
        : "";
    return `    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${escapeAttr(safeDescription)}">
    <meta name="robots" content="${escapeAttr(robots)}">
    <link rel="canonical" href="${escapeAttr(canonical)}">
    <link rel="icon" type="image/png" href="/logo.png">
    <link rel="apple-touch-icon" href="/logo.png">
    <meta property="og:type" content="${ogType}">
    <meta property="og:title" content="${escapeAttr(title)}">
    <meta property="og:description" content="${escapeAttr(safeDescription)}">
    <meta property="og:url" content="${escapeAttr(canonical)}">
    <meta property="og:image" content="${SITE}/logo.png">
    <meta property="og:image:alt" content="Standen">
    <meta property="og:locale" content="en_GB">
    <meta property="og:site_name" content="Standen">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeAttr(title)}">
    <meta name="twitter:description" content="${escapeAttr(safeDescription)}">
    <title>${escapeHtml(title)}</title>
    <link rel="preload" href="/assets/fonts/gt-america-regular.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/assets/fonts/gt-america-medium.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="/home.css">${schemaScript}
    <script src="/js/vercel-analytics.js" defer></script>
    <script src="/js/ga4.js" defer></script>`;
}

export function navBlock(active = "") {
    const workActive = active === "work" ? ' aria-current="page"' : "";
    return `    <header class="site-nav" id="top">
        <div class="nav-inner">
            <a class="brand" href="#top" aria-label="Standen home">
                <span class="brand-name">${BRAND_NAME}</span>
            </a>
            <nav class="nav-links" aria-label="Primary">
                <a href="#work"${workActive}>Work</a>
                <a href="#included">What&rsquo;s included</a>
                <a href="#process">Process</a>
                <a href="#pricing">Pricing</a>
                <a href="#faq">FAQ</a>
            </nav>
            <div class="nav-actions">
                ${accentCtaButton("nav-cta")}
            </div>
            <button class="nav-toggle" type="button" aria-label="Open menu" aria-controls="mobile-menu" aria-expanded="false"><span></span></button>
        </div>
        <nav id="mobile-menu" class="mobile-menu" data-open="false" aria-label="Mobile">
            <a href="#work">Work</a>
            <a href="#included">What&rsquo;s included</a>
            <a href="#process">Process</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            ${accentCtaButton("nav-cta")}
        </nav>
    </header>`;
}

export function footerBlock() {
    return `    <footer class="site-footer">
        <div class="wrap footer-slim">
            <a class="brand" href="#top" aria-label="Standen home">
                <span class="brand-name">${BRAND_NAME}</span>
            </a>
            <p class="footer-tagline">${FOOTER_TAGLINE}</p>
            <p class="footer-email">${CONTACT_EMAIL}</p>
            <div class="footer-bottom footer-bottom--slim">
                <p>&copy; Standen</p>
                <nav aria-label="Legal">
                    <button type="button" class="footer-legal-btn" data-open-dialog="privacy-dialog">Privacy</button>
                    <button type="button" class="footer-legal-btn" data-open-dialog="terms-dialog">Terms</button>
                </nav>
            </div>
        </div>
    </footer>
    <script src="/home.js"></script>`;
}

export function breadcrumbs(items) {
    const lis = items
        .map((item, i) => {
            const isLast = i === items.length - 1;
            if (isLast) return `<li aria-current="page">${escapeHtml(item.label)}</li>`;
            return `<li><a href="${escapeAttr(clickableHref(item.href))}">${escapeHtml(item.label)}</a></li>`;
        })
        .join("");
    return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${lis}</ol></nav>`;
}

export function breadcrumbSchema(items) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.label,
            item: item.abs || `${SITE}${item.href}`,
        })),
    };
}

export function faqSection(faqs, heading = "Frequently asked questions") {
    const details = faqs
        .map(
            (f, i) =>
                `<details class="seo-faq__item"${i === 0 ? " open" : ""}><summary>${escapeHtml(f.q)}</summary><p>${f.a}</p></details>`
        )
        .join("");
    return `<section class="seo-faq" aria-labelledby="faq-h"><h2 id="faq-h">${escapeHtml(heading)}</h2><div class="seo-faq__list">${details}</div></section>`;
}

export function faqSchema(faqs) {
    return {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: stripHtml(f.a) },
        })),
    };
}

export function finalCta(
    heading = "Ready to scope your next build?",
    text = "Book a short call. We&rsquo;ll map the simplest system worth building first."
) {
    return `<section class="final-cta" aria-labelledby="page-cta"><div class="wrap"><h2 id="page-cta">${heading}</h2><p>${text}</p>${accentCtaButton()}</div></section>`;
}

export function pageShell({ title, description, canonical, body, activeNav, schema, ogType, robots = ROBOTS_INDEX, extraScripts = "", bodyClass = "page-home", hideFooter = false }) {
    return `<!DOCTYPE html>
<html lang="en-GB">
<head>
${headBlock({ title, description, canonical, ogType, schema, robots })}
</head>
<body class="${bodyClass}">
${navBlock(activeNav)}
<main>
${body}
</main>
${hideFooter ? "" : footerBlock()}${extraScripts}
</body>
</html>
`;
}

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
}

function stripHtml(s) {
    return String(s).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function clickableHref(href) {
    if (!href || href === "/" || href.startsWith("#") || /^https?:/i.test(href) || href.includes(".html")) {
        return href;
    }
    if (href === "/services") return servicesHubHref();
    if (href.startsWith("/services/")) {
        const slug = href.replace(/^\/services\//, "").replace(/\.html$/, "");
        return serviceHref(slug);
    }
    if (href === "/compare") return "/compare/index.html";
    if (href.startsWith("/compare/")) return `${href}.html`;
    if (href.startsWith("/case-studies/")) return `${href}.html`;
    if (href.startsWith("/blog/")) return `${href}.html`;
    if (href.startsWith("/guides/")) return `${href}.html`;
    const topLevel = new Set(["/work", "/about", "/audit", "/guides", "/blog", "/resources", "/privacy", "/terms", "/waitlist"]);
    if (topLevel.has(href)) return `${href}.html`;
    return href;
}

export { SITE, CALENDLY, CTA_LABEL, CONTACT_EMAIL, LINKEDIN_URL, escapeHtml, clickableHref };
