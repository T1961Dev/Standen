import { serviceHref, servicesHubHref } from "./service-anchors.mjs";

const SITE = "https://www.standen.io";
const BRAND_NAME = "standen";
const CALENDLY = "https://calendly.com/standen/discovery-call";
const CTA_LABEL = "Book a call";
const FOOTER_TAGLINE =
    "Custom software and SaaS for founders and agencies. Fixed-scope tiers from 14 to 30 days. You own everything.";
const CONTACT_EMAIL = "tomas@standen.io";
const CTA_ARROW =
    '<span class="btn__arrow" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M6.5 3.5 9 6 6.5 8.5" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';

export function accentCtaButton(extraClass = "nav-cta") {
    const classes = extraClass ? `btn btn--accent ${extraClass}` : "btn btn--accent nav-cta";
    return `<a href="${CALENDLY}" class="${classes}" target="_blank" rel="noopener"><span class="btn__text">${CTA_LABEL}</span>${CTA_ARROW}</a>`;
}
const LINKEDIN_URL = "https://www.linkedin.com/in/tomas-jones1/";

export const ROBOTS_INDEX = "index, follow";
export const ROBOTS_NOINDEX = "noindex, follow";

export function headBlock({ title, description, canonical, ogType = "website", schema, robots = ROBOTS_INDEX }) {
    const schemaScript = schema
        ? `\n    <script type="application/ld+json">\n    ${JSON.stringify(schema)}\n    </script>`
        : "";
    return `    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${escapeAttr(description)}">
    <meta name="robots" content="${escapeAttr(robots)}">
    <link rel="canonical" href="${escapeAttr(canonical)}">
    <link rel="icon" type="image/png" href="/logo.png">
    <link rel="apple-touch-icon" href="/logo.png">
    <meta property="og:type" content="${ogType}">
    <meta property="og:title" content="${escapeAttr(title)}">
    <meta property="og:description" content="${escapeAttr(description)}">
    <meta property="og:url" content="${escapeAttr(canonical)}">
    <meta property="og:image" content="${SITE}/logo.png">
    <meta property="og:image:alt" content="Standen">
    <meta property="og:locale" content="en_GB">
    <meta property="og:site_name" content="Standen">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeAttr(title)}">
    <meta name="twitter:description" content="${escapeAttr(description)}">
    <title>${escapeHtml(title)}</title>
    <link rel="preload" href="/assets/fonts/gt-america-regular.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/assets/fonts/gt-america-medium.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="/home.css">${schemaScript}
    <script src="/js/vercel-analytics.js" defer></script>
    <script src="/js/ga4.js" defer></script>`;
}

export function navBlock(active = "") {
    const servicesActive = active === "services" ? ' aria-current="page"' : "";
    const workActive = active === "work" ? ' aria-current="page"' : "";
    return `    <header class="site-nav" id="top">
        <div class="nav-inner">
            <a class="brand" href="/" aria-label="Standen home">
                <span class="brand-name">${BRAND_NAME}</span>
            </a>
            <nav class="nav-links" aria-label="Primary">
                <a href="/#services"${servicesActive}>Services</a>
                <a href="/work.html"${workActive}>Work</a>
                <a href="/#process">Process</a>
                <a href="/#pricing">Pricing</a>
            </nav>
            <a href="${CALENDLY}" class="btn btn--accent nav-cta" target="_blank" rel="noopener"><span class="btn__text">${CTA_LABEL}</span><span class="btn__arrow" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M6.5 3.5 9 6 6.5 8.5" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg></span></a>
            <button class="nav-toggle" type="button" aria-label="Open menu" aria-controls="mobile-menu" aria-expanded="false"><span></span></button>
        </div>
        <nav id="mobile-menu" class="mobile-menu" data-open="false" aria-label="Mobile">
            <a href="/#services">Services</a>
            <a href="/work.html">Work</a>
            <a href="/#process">Process</a>
            <a href="/#pricing">Pricing</a>
            <a href="${CALENDLY}" class="btn btn--accent" target="_blank" rel="noopener"><span class="btn__text">${CTA_LABEL}</span><span class="btn__arrow" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M6.5 3.5 9 6 6.5 8.5" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg></span></a>
        </nav>
    </header>`;
}

export function footerBlock() {
    return `    <footer class="site-footer">
        <div class="wrap footer-grid footer-grid--enterprise">
            <div class="footer-brand">
                <a class="brand" href="/">
                    <span class="brand-name">${BRAND_NAME}</span>
                </a>
                <p class="footer-tagline">${FOOTER_TAGLINE}</p>
                <div class="footer-contact">
                    <a href="mailto:${CONTACT_EMAIL}" class="footer-contact__email">${CONTACT_EMAIL}</a>
                    <a href="${LINKEDIN_URL}" class="footer-contact__linkedin" target="_blank" rel="noopener noreferrer" aria-label="Tomas Jones on LinkedIn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                </div>
            </div>
            <nav aria-label="Services">
                <h2>Services</h2>
                <a href="/#services">All services</a>
                <a href="/#service-proposals">Proposal systems</a>
                <a href="/#service-reporting">Reporting dashboards</a>
                <a href="/#service-portals">Client portals</a>
                <a href="/#service-crm">Internal CRM</a>
                <a href="/#service-saas">SaaS MVP</a>
                <a href="/#service-internal">Internal tools</a>
            </nav>
            <nav aria-label="Company">
                <h2>Company</h2>
                <a href="/work.html">Work</a>
                <a href="/#process">Process</a>
                <a href="/#pricing">Pricing</a>
            </nav>
        </div>
        <div class="wrap footer-bottom footer-bottom--enterprise">
            <p>&copy; Standen</p>
            <nav aria-label="Legal">
                <a href="/privacy.html">Privacy</a>
                <a href="/terms.html">Terms</a>
            </nav>
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

export function pageShell({ title, description, canonical, body, activeNav, schema, ogType, robots = ROBOTS_INDEX, extraScripts = "" }) {
    return `<!DOCTYPE html>
<html lang="en-GB">
<head>
${headBlock({ title, description, canonical, ogType, schema, robots })}
</head>
<body class="page-home">
${navBlock(activeNav)}
<main>
${body}
</main>
${footerBlock()}${extraScripts}
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
    const topLevel = new Set(["/work", "/about", "/audit", "/guides", "/blog", "/resources", "/privacy", "/terms"]);
    if (topLevel.has(href)) return `${href}.html`;
    return href;
}

export { SITE, CALENDLY, CTA_LABEL, CONTACT_EMAIL, LINKEDIN_URL, escapeHtml, clickableHref };
