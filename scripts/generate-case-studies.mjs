import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://www.standen.io";

const studies = [
    {
        slug: "rethink-demand",
        title: "Rethink Demand",
        meta: "Internal delivery tool · B2B demand-gen agency",
        lead: "A B2B demand generation agency was running part of its client delivery manually, repeating the same process for every account. We turned it into an internal tool the team owns and runs themselves, removing the manual step from their workflow.",
        image: "/pics/rethink.png",
        imageAlt: "Rethink Demand logo",
        logo: true,
    },
    {
        slug: "ohmypod",
        title: "OhMyPod",
        meta: "Custom SaaS MVP · 21 days",
        lead: "A podcast SaaS went from an idea in Tom's notes app to a live, owned product in 21 days.",
        image: "/assets/ohmypod-icon.svg",
        imageAlt: "OhMyPod logo",
        logo: true,
        client: "Tom Sargent",
        timeline: "21 days",
        services: "SaaS MVP / Product strategy",
        challenge: "Tom had a clear idea for a custom SaaS, but it needed to become a buildable product without drifting into unnecessary complexity. The important work was deciding what the software actually needed to do, what counted as MVP, and what could wait until the next phase.",
        delivered: "We built the core journey from creating a host or guest profile through to finding a match and arranging a podcast appearance. The product included availability and scheduling, requests and confirmations, onboarding and a dashboard for tracking the pipeline. Tom could review the product on a private live link while it was being built. Once complete, hosting, database and source code were transferred so he owned the software.",
        results: [
            "Live SaaS product in 21 days",
            "Fixed quote and clear feature list before build",
            "Private live link available from day one",
            "Hosting, database, and source code fully transferred",
        ],
        stack: ["Product scoping", "Full-stack web app", "Authentication", "Database", "Deployment", "Source-code handover"],
        quote: "Huge credit to Tomas Jones for moving fast, keeping scope tight, and building properly from day one. No fluff. Just execution.",
        quoteBy: "Tom Sargent · Founder, OhMyPod",
    },
    {
        slug: "shelfexact",
        title: "ShelfExact",
        meta: "Client SaaS product",
        lead: "Inventory SaaS across web, iOS and Android. Built with Gabor to give growing businesses one place to scan, receive, move, track and audit inventory across multiple locations.",
        image: "/assets/shelfexact.jpg",
        imageAlt: "ShelfExact inventory dashboard",
    },
    {
        slug: "fx-quant-research-platform",
        title: "FX Quant Research Platform",
        meta: "Financial research platform · 12 days",
        lead: "A complete forex research platform for exploring price data, testing strategies, and turning market information into usable insight.",
        image: "/assets/quant.png",
        imageAlt: "FX Quant Research Platform dashboard",
        client: "Custom project",
        timeline: "12 days",
        services: "Financial tech / Research dashboard",
        challenge: "The client needed a unified research environment for forex analysis. Market data, backtesting, and predictive signals were scattered, making it difficult to move from raw information to confident decisions.",
        delivered: "We built a full-stack platform with market data views, automated backtesting, predictive analytics, and clean dashboard interfaces. The system made complex financial datasets easier to inspect, compare, and act on.",
        results: [
            "Delivered in 12 days",
            "Real-time data feeds centralised",
            "Backtesting and analytics in one interface",
            "Designed for fast research workflows",
        ],
        stack: ["Dashboard UI", "Data visualisation", "Backtesting logic", "Predictive analytics", "Market data pipeline"],
    },
    {
        slug: "real-estate-property-prediction",
        title: "Real Estate Property Prediction App",
        meta: "AI property platform · 14 days",
        lead: "A full-stack property platform combining predictions, portfolio management, staff coordination, and mapping.",
        image: "/assets/realestatedash.png",
        imageAlt: "Real Estate Property Prediction App dashboard",
        client: "Custom project",
        timeline: "14 days",
        services: "AI predictions / Interactive mapping",
        challenge: "The client needed to manage property opportunities, portfolio data, staff activity, and AI-assisted investment decisions without relying on disconnected spreadsheets and tools.",
        delivered: "We delivered a single dashboard for property tracking, AI predictions, portfolio performance, staff management, and map-based exploration. The interface made the system usable for both operational and strategic decisions.",
        results: [
            "Delivered in 14 days",
            "AI-powered property predictions",
            "Portfolio and staff management in one platform",
            "Interactive map workflow",
        ],
        stack: ["Full-stack web app", "AI prediction workflow", "Mapping UI", "Portfolio dashboard", "Role-based operations"],
    },
    {
        slug: "scrapr-io",
        title: "Scrapr.io",
        meta: "Owned SaaS product · Ongoing product",
        lead: "A lead-generation platform bringing lead collection, enrichment and export into one workflow.",
        image: "/assets/scrapr.png",
        imageAlt: "Scrapr.io dashboard",
        client: "Internal SaaS",
        timeline: "Ongoing product",
        services: "Lead generation / SaaS",
        challenge: "Sales teams need qualified lead data quickly, but manual prospecting is slow and generic databases are often stale or incomplete.",
        delivered: "Scrapr.io packages lead scraping, enrichment, storage, and export workflows into a fast SaaS dashboard. It gives users real email addresses and phone numbers for decision-makers without forcing them through manual research.",
        results: [
            "Lead collection, enrichment and export in one workflow",
            "Decision-maker contact data",
            "Built and developed as Standen's own SaaS product",
        ],
        stack: ["SaaS dashboard", "Lead scraping", "Data enrichment", "Background jobs", "Exports"],
    },
    {
        slug: "instagram-lead-scraper",
        title: "Instagram Lead Scraper",
        meta: "Automation tool · 8 days",
        lead: "An automated Instagram prospecting system that processes profiles, identifies high-value leads, and moves them into a CRM.",
        image: "/assets/ig.png",
        imageAlt: "Instagram Lead Scraper dashboard",
        client: "Custom project",
        timeline: "8 days",
        services: "Automation / Lead generation",
        challenge: "The client needed to turn Instagram research into a repeatable prospecting workflow without manually checking profiles, collecting details, and copying leads into their CRM.",
        delivered: "We built a dashboard and scraping workflow for importing, filtering, and managing leads. The system could process large profile lists, surface useful prospects, and support manual lead entry where needed.",
        results: [
            "Built in 8 days",
            "Processes thousands of profiles",
            "Lead dashboard for review and upload",
            "CRM-ready prospect workflow",
        ],
        stack: ["Scraping workflow", "Dashboard UI", "CSV upload", "Lead filtering", "CRM handoff"],
    },
    {
        slug: "crypto-news-scraper",
        title: "Crypto News Scraper",
        meta: "Real-time aggregation · 6 days",
        lead: "A real-time crypto news system that monitors 50+ sources and filters market-moving updates.",
        image: "/assets/automation.png",
        imageAlt: "Crypto News Scraper automation workflow",
        client: "Custom project",
        timeline: "6 days",
        services: "Automation / News aggregation",
        challenge: "Crypto moves quickly, and the client needed a way to monitor many sources without drowning in low-value updates or checking sites manually.",
        delivered: "We built an automated scraping and filtering pipeline that pulls from dozens of sources, filters out noise, and routes important market-moving stories to the right place.",
        results: [
            "Completed in 6 days",
            "50+ sources monitored",
            "Noise-filtering pipeline",
            "Important updates delivered quickly",
        ],
        stack: ["Automation pipeline", "Firecrawl", "OpenAI filtering", "JSON parsing", "Notification workflow"],
    },
    {
        slug: "lead-magnet-generator",
        title: "Lead Magnet Generator",
        meta: "AI content tool · 9 days",
        lead: "An AI-powered generator for creating LinkedIn lead magnets, saving them to Notion, and tracking performance from one dashboard.",
        image: "/assets/magnet.png",
        imageAlt: "Lead Magnet Generator interface",
        client: "Custom project",
        timeline: "9 days",
        services: "AI generation / LinkedIn content",
        challenge: "The client wanted to create high-converting lead magnets consistently, but the workflow across ideation, writing, saving, and performance tracking was too manual.",
        delivered: "We built a focused generator with setup controls, AI output, Notion saving, and a simple dashboard so the team could generate, store, and review lead magnets from one place.",
        results: [
            "Built in 9 days",
            "AI-generated lead magnet content",
            "Notion save workflow",
            "Performance tracking dashboard",
        ],
        stack: ["AI generation", "Notion integration", "Dashboard UI", "Content workflow", "Analytics"],
    },
];

function esc(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function page(study) {
    const url = `${SITE}/case-studies/${study.slug}`;
    const description = study.lead;
    const stats = study.client
        ? `<dl class="cs-stats">
                <div><dt>Client</dt><dd>${esc(study.client)}</dd></div>
                <div><dt>Timeline</dt><dd>${esc(study.timeline)}</dd></div>
                <div><dt>Services</dt><dd>${esc(study.services)}</dd></div>
            </dl>`
        : "";
    const body = study.challenge
        ? `<div class="cs-split">
                <section><h2>The challenge</h2><p>${esc(study.challenge)}</p></section>
                <section><h2>What we delivered</h2><p>${esc(study.delivered)}</p></section>
            </div>
            <div class="cs-split">
                <section>
                    <h2>Results</h2>
                    <ul>${study.results.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
                </section>
                <section>
                    <h2>Stack and workflow</h2>
                    <p class="cs-stack">${study.stack.map(esc).join(" · ")}</p>
                </section>
            </div>`
        : "";
    const quote = study.quote
        ? `<blockquote class="quote"><p>&ldquo;${esc(study.quote)}&rdquo;</p><footer>${esc(study.quoteBy)}</footer></blockquote>`
        : "";
    const shotClass = study.logo ? "shot mark" : "shot";
    return `<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${esc(description)}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${url}">
    <link rel="icon" type="image/png" href="/logo.png">
    <link rel="apple-touch-icon" href="/logo.png">
    <meta property="og:type" content="article">
    <meta property="og:title" content="${esc(study.title)} | Case Study | Standen">
    <meta property="og:description" content="${esc(description)}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${SITE}/logo.png">
    <meta property="og:image:alt" content="Standen">
    <meta property="og:locale" content="en_GB">
    <meta property="og:site_name" content="Standen">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(study.title)} | Case Study | Standen">
    <meta name="twitter:description" content="${esc(description)}">
    <title>${esc(study.title)} | Case Study | Standen</title>
    <link rel="preload" href="/assets/fonts/geist-regular.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/assets/fonts/geist-medium.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="/landing.css">
    <script type="application/ld+json">
    ${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: study.title,
        description: study.lead,
        mainEntityOfPage: url,
        author: { "@type": "Organization", name: "Standen", url: SITE },
    })}
    </script>
    <script src="/js/vercel-analytics.js" defer></script>
    <script src="/js/ga4.js" defer></script>
</head>
<body class="page-home page-landing">
    <header class="site-nav">
        <div class="nav-inner">
            <a class="brand" href="/" aria-label="Standen home">standen</a>
            <nav class="nav-links" aria-label="Primary">
                <a href="/#work">Work</a>
                <a href="/#build">What we build</a>
                <a href="/#process">Process</a>
                <a href="/#faq">FAQs</a>
            </nav>
            <div class="nav-actions">
                <a class="btn btn--nav" href="https://calendly.com/standen/discovery-call" target="_blank" rel="noopener">Book a call</a>
            </div>
            <button class="nav-toggle" type="button" aria-label="Open menu" aria-controls="mobile-menu" aria-expanded="false"><span></span></button>
        </div>
        <nav id="mobile-menu" class="mobile-menu" data-open="false" aria-label="Mobile">
            <a href="/#work">Work</a>
            <a href="/#build">What we build</a>
            <a href="/#process">Process</a>
            <a href="/#faq">FAQs</a>
            <a class="btn" href="https://calendly.com/standen/discovery-call" target="_blank" rel="noopener">Book a call</a>
        </nav>
    </header>
    <main class="cs">
        <article class="wrap">
            <p class="cs-back"><a href="/#work">All work</a></p>
            <p class="kicker">${esc(study.meta)}</p>
            <h1>${esc(study.title)}</h1>
            <p class="cs-lead">${esc(study.lead)}</p>
            <figure class="${shotClass}"><img src="${esc(study.image)}" alt="${esc(study.imageAlt)}"></figure>
            ${stats}
            ${body}
            ${quote}
        </article>
        <section class="section final-cta">
            <div class="wrap">
                <h2>Ready to scope a similar build?</h2>
                <p class="lede">Book a short call. We&rsquo;ll map the simplest system worth building first.</p>
                <a class="btn" href="https://calendly.com/standen/discovery-call" target="_blank" rel="noopener">Book a discovery call</a>
            </div>
        </section>
    </main>
    <footer class="site-footer">
        <div class="wrap">
            <div class="footer-row">
                <a class="footer-brand" href="/">standen</a>
                <p class="footer-note">SaaS products for founders.</p>
                <nav class="footer-links" aria-label="Footer">
                    <a href="mailto:tomas@standen.io">tomas@standen.io</a>
                    <a href="https://www.linkedin.com/in/tomas-jones1/" target="_blank" rel="noopener">LinkedIn</a>
                    <a href="/privacy.html">Privacy</a>
                    <a href="/terms.html">Terms</a>
                </nav>
            </div>
            <p class="footer-meta">&copy; Standen</p>
        </div>
    </footer>
    <script src="/home.js"></script>
</body>
</html>
`;
}

const hidden = new Set(["crypto-news-scraper", "lead-magnet-generator"]);
const visible = studies.filter((study) => !hidden.has(study.slug));

function redirectPage(study) {
    const href = hidden.has(study.slug) ? "/work" : `/case-studies/${study.slug}`;
    return `<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta charset="UTF-8">
    <meta name="robots" content="noindex, follow">
    <link rel="canonical" href="${SITE}${href}">
    <meta http-equiv="refresh" content="0;url=${href}">
    <title>${esc(study.title)} | Standen</title>
    <script>location.replace(${JSON.stringify(href)})</script>
</head>
<body>
    <p><a href="${href}">${esc(study.title)}</a></p>
</body>
</html>
`;
}

const outDir = path.join(ROOT, "case-studies");
fs.mkdirSync(outDir, { recursive: true });
for (const study of studies) {
    fs.writeFileSync(path.join(outDir, `${study.slug}.html`), redirectPage(study));
}
fs.writeFileSync(path.join(ROOT, "js", "case-studies.json"), JSON.stringify(visible, null, 2));
console.log(`Wrote ${visible.length} case studies for the shared detail page`);
