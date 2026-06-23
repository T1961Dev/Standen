import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pageShell, breadcrumbs, finalCta, SITE } from "./partials.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function write(rel, html) {
    fs.writeFileSync(path.join(ROOT, rel), html, "utf8");
    console.log("wrote", rel);
}

const rethinkCard = `<article class="work-card work-card--static reveal">
                    <div class="work-card__media work-card__media--logo">
                        <img src="/pics/rethink.png" alt="Rethink Demand logo" width="220" height="80" loading="lazy" decoding="async">
                    </div>
                    <div class="work-card__body">
                        <p class="work-card__meta">Internal delivery tool · B2B demand-gen agency</p>
                        <h3>Rethink Demand</h3>
                        <p class="work-card__summary">A B2B demand generation agency was running part of its client delivery manually, repeating the same process for every account. We turned it into an internal tool the team owns and runs themselves, removing the manual step from their workflow.</p>
                    </div>
                </article>`;

const workCards = [
    { href: "/case-studies/ohmypod.html", logo: true, img: "/assets/ohmypod-logo.png", alt: "OhMyPod logo", meta: "Custom SaaS MVP · 21 days", title: "OhMyPod", summary: "A podcast SaaS went from an idea in Tom&rsquo;s notes app to a live, owned product in 21 days." },
    { href: "/case-studies/fx-quant-research-platform.html", img: "/assets/quant.png", alt: "FX Quant Research Platform dashboard", meta: "Financial research platform · 12 days", title: "FX Quant Research Platform", summary: "A complete forex research platform for exploring price data, testing strategies, and turning market information into usable insight." },
    { href: "/case-studies/real-estate-property-prediction.html", img: "/assets/realestatedash.png", alt: "Real Estate Property Prediction App dashboard", meta: "AI property platform · 14 days", title: "Real Estate Property Prediction App", summary: "A full-stack property platform combining predictions, portfolio management, staff coordination, and mapping." },
    { href: "/case-studies/scrapr-io.html", img: "/assets/scrapr.png", alt: "Scrapr.io dashboard", meta: "Owned SaaS product · Ongoing", title: "Scrapr.io", summary: "A lead generation SaaS that returns 1,000+ verified leads in around 30 seconds." },
    { href: "/case-studies/instagram-lead-scraper.html", img: "/assets/ig.png", alt: "Instagram Lead Scraper dashboard", meta: "Automation tool · 8 days", title: "Instagram Lead Scraper", summary: "An automated Instagram prospecting system that processes profiles, identifies high-value leads, and moves them into a CRM." },
    { href: "/case-studies/crypto-news-scraper.html", img: "/assets/automation.png", alt: "Crypto News Scraper automation workflow", meta: "Real-time aggregation · 6 days", title: "Crypto News Scraper", summary: "A real-time crypto news system that monitors 50+ sources and filters market-moving updates." },
    { href: "/case-studies/lead-magnet-generator.html", img: "/assets/magnet.png", alt: "Lead Magnet Generator interface", meta: "AI content tool · 9 days", title: "Lead Magnet Generator", summary: "An AI-powered generator for creating LinkedIn lead magnets, saving them to Notion, and tracking performance from one dashboard." },
];

const grid = workCards
    .map((c, i) => {
        const delay = i ? ` style="--reveal-delay: ${i * 60}ms"` : "";
        const media = c.logo
            ? `<div class="work-card__media work-card__media--logo"><img src="${c.img}" alt="${c.alt}" width="220" height="80" loading="lazy" decoding="async"></div>`
            : `<div class="work-card__media"><img src="${c.img}" alt="${c.alt}" width="800" height="500" loading="lazy" decoding="async"></div>`;
        return `<a href="${c.href}" class="work-card reveal"${delay}>${media}<div class="work-card__body"><p class="work-card__meta">${c.meta}</p><h3>${c.title}</h3><p class="work-card__summary">${c.summary}</p><span class="work-card__link">View case study <span aria-hidden="true">&gt;</span></span></div></a>`;
    })
    .join("\n                ");

const workSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Case studies",
    description: "SaaS MVPs, custom software, dashboards and automation built and handed over by Standen.",
    url: `${SITE}/work`,
    isPartOf: { "@id": "https://www.standen.io/#website" },
    mainEntity: {
        "@type": "ItemList",
        itemListElement: workCards.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE}${c.href.replace(/\.html$/, "")}`,
            name: c.title,
        })),
    },
};

write(
    "work.html",
    pageShell({
        title: "Case Studies | SaaS and Custom Software | Standen",
        description: "Standen case studies: SaaS MVPs, custom software, dashboards, automation and full-stack builds. Delivered in 6 to 21 days.",
        canonical: `${SITE}/work`,
        activeNav: "work",
        schema: workSchema,
        body: `
        <section class="work work--page">
            <div class="wrap">
                ${breadcrumbs([{ label: "Home", href: "/" }, { label: "Work", href: "/work" }])}
                <header class="work-head reveal">
                    <h1>What we can build</h1>
                    <p class="work-sub">Every system below was scoped, built and shipped with full ownership. Different domains, same engineering. The range here is what we build across SaaS products and custom software: data pipelines, dashboards, automation, integrations and full-stack tools.</p>
                </header>
                <div class="work-grid">${rethinkCard}
                ${grid}</div>
            </div>
        </section>
        ${finalCta()}`,
    })
);

write(
    "about.html",
    pageShell({
        title: "About Standen | SaaS and Custom Software Development",
        description: "Standen builds SaaS products and custom software. Founder-led, fixed-scope builds from 14 to 30 days, full code ownership.",
        canonical: `${SITE}/about`,
        activeNav: "",
        body: `
        <article class="guide-article">
            <div class="wrap">
                ${breadcrumbs([{ label: "Home", href: "/" }, { label: "About", href: "/about" }])}
                <header class="guide-article__head">
                    <h1>About Standen</h1>
                    <p class="guide-article__lead">We build SaaS products and custom software: MVPs, dashboards, customer portals, automation, internal tools and ops software.</p>
                    <p class="seo-answer">Standen is a UK-based studio led by Tomas Jones. We scope one workflow per build, ship in fixed sprints from 14 days, and hand over 100% of the codebase. No licence lock-in.</p>
                </header>
                <div class="guide-article__body">
                    <h2>How we work</h2>
                    <p>Every engagement starts with mapping the workflow: users, inputs, outputs and bottlenecks. We fix scope and price before build, then deliver behind a private live link from day one.</p>
                    <h2>What clients keep</h2>
                    <p>Source code, deployment access, handover documentation and the logic of how the system runs. You are not renting our platform.</p>
                    <h2>Recent outcomes</h2>
                    <p>Live SaaS in <strong>21 days</strong> (OhMyPod). Forex research platform in <strong>12 days</strong>. Lead magnet generator in <strong>9 days</strong>. Instagram prospecting automation in <strong>8 days</strong>.</p>
                    <p><a href="https://www.linkedin.com/in/tomas-jones1/" target="_blank" rel="noopener">Tomas Jones on LinkedIn</a></p>
                </div>
            </div>
        </article>
        ${finalCta("Want to work with Standen?")}`,
    })
);

console.log("Done. Core pages (work, about) generated.");
