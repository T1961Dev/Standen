import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pageShell, breadcrumbs, finalCta, SITE, ROBOTS_NOINDEX } from "./partials.mjs";

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
    description: "SaaS MVPs, product platforms, dashboards and automation built and handed over by Standen.",
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
        title: "Case Studies | SaaS & Full-Stack Software | Standen",
        description: "Standen case studies: SaaS MVPs, product platforms, dashboards, automation and full-stack software. Delivered in 6 to 21 days.",
        canonical: `${SITE}/work`,
        activeNav: "work",
        schema: workSchema,
        body: `
        <section class="work work--page">
            <div class="wrap">
                ${breadcrumbs([{ label: "Home", href: "/" }, { label: "Work", href: "/work" }])}
                <header class="work-head reveal">
                    <h1>What we can build</h1>
                    <p class="work-sub">Every system below was scoped, built and shipped with full ownership. Different domains, same engineering. The range here is what we build into SaaS products: data pipelines, dashboards, automation, integrations and full-stack tools.</p>
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
        title: "About Standen | SaaS Development for Founders",
        description: "Standen builds SaaS products for founders. Founder-led, fixed-scope tiers from 14 to 30 days, full code ownership.",
        canonical: `${SITE}/about`,
        activeNav: "",
        body: `
        <article class="guide-article">
            <div class="wrap">
                ${breadcrumbs([{ label: "Home", href: "/" }, { label: "About", href: "/about" }])}
                <header class="guide-article__head">
                    <h1>About Standen</h1>
                    <p class="guide-article__lead">We build SaaS products for founders: MVPs, product dashboards, customer portals, billing-ready workflows and ops software.</p>
                    <p class="seo-answer">Standen is a UK-based studio led by Tomas Jones. We scope one delivery workflow per build, ship in fixed sprints (14, 21 or 30 days by tier), and hand over 100% of the codebase. No licence lock-in.</p>
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

const blogPosts = [
    {
        href: "/blog/how-to-scope-a-saas-mvp.html",
        img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
        alt: "Scoping a SaaS MVP",
        date: "2025-01-15",
        title: "How to scope a SaaS MVP that actually ships",
        excerpt: "Practical steps to define scope, avoid creep, and get from idea to launch in weeks, not months.",
        meta: "5 min read",
    },
    {
        href: "/blog/web-development-hampshire-what-to-expect.html",
        img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
        alt: "Fixed-scope product studio delivery",
        date: "2025-01-08",
        title: "What to expect from a fixed-scope product studio",
        excerpt: "Timelines, communication, and how Standen delivers scoped SaaS and custom software builds for founders.",
        meta: "4 min read",
    },
    {
        href: "/blog/when-to-build-custom-software-vs-saas.html",
        img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=500&fit=crop",
        alt: "Custom software vs SaaS",
        date: "2024-12-18",
        title: "When to build custom software vs use existing SaaS",
        excerpt: "Deciding between bespoke build and off-the-shelf tools? We break down the trade-offs so you can choose with confidence.",
        meta: "6 min read",
    },
    {
        href: "/blog/rapid-delivery-without-cutting-corners.html",
        img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=500&fit=crop",
        alt: "Rapid delivery",
        date: "2024-12-05",
        title: "Rapid delivery without cutting corners",
        excerpt: "How we ship MVPs and web apps in weeks while keeping quality high and tech debt low.",
        meta: "5 min read",
    },
];

const blogGrid = blogPosts
    .map(
        (p) => `<article class="blog-card">
            <a href="${p.href}" class="blog-card__link">
                <div class="blog-card__media"><img src="${p.img}" alt="${p.alt}" width="800" height="500" loading="lazy" decoding="async"></div>
                <div class="blog-card__body">
                    <time class="blog-card__date" datetime="${p.date}">${new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time>
                    <h2>${p.title}</h2>
                    <p class="blog-card__excerpt">${p.excerpt}</p>
                    <span class="blog-card__meta">${p.meta} · Standen</span>
                </div>
            </a>
        </article>`
    )
    .join("\n                ");

write(
    "blog.html",
    pageShell({
        title: "Blog | Standen. SaaS & Custom Software",
        description:
            "Insights on SaaS development, custom software and delivery from Standen. Scoping, building and launching software for founders.",
        canonical: `${SITE}/blog`,
        robots: ROBOTS_NOINDEX,
        activeNav: "",
        body: `
        <section class="blog-page">
            <div class="wrap">
                ${breadcrumbs([{ label: "Home", href: "/" }, { label: "Blog", href: "/blog.html" }])}
                <header class="guides-page-head">
                    <h1>Insights on SaaS and software delivery</h1>
                    <p class="guides-page-lead">Practical posts on scoping, building and launching SaaS and custom software for founders and product teams.</p>
                </header>
                <div class="blog-grid">${blogGrid}</div>
            </div>
        </section>`,
    })
);
