import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";
import { pageShell, breadcrumbs, finalCta, SITE, ROBOTS_INDEX } from "./partials.mjs";
import { metaDescription } from "./seo-meta.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadWindowVar(file, varName) {
    const sandbox = { window: {} };
    vm.runInNewContext(fs.readFileSync(path.join(ROOT, file), "utf8"), sandbox);
    return sandbox.window[varName] || [];
}

const guides = loadWindowVar("guides-data.js", "GUIDES");
const blogPosts = loadWindowVar("blog-data.js", "BLOG_POSTS");

const guideCategoryMap = {
    Proposals: "SaaS MVP",
    Reporting: "Custom software",
    Portals: "Custom software",
    Operations: "Custom software",
    Process: "SaaS MVP",
    Ownership: "Custom software",
    Strategy: "SaaS MVP",
    Technical: "Custom software",
    Pricing: "SaaS MVP",
    AI: "Custom software",
};

function guideCard(g) {
    const href = `/guides/${g.slug}.html`;
    const img = g.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=520&fit=crop";
    const topic = guideCategoryMap[g.category] || g.category;
    return `<article class="blog-card guides-bento__card" data-category="${topic}">
            <a href="${href}" class="blog-card__link">
                <div class="blog-card__media${g.imageFit === "contain" ? " blog-card__media--contain" : ""}"><img src="${img}" alt="" width="800" height="520" loading="lazy" decoding="async"></div>
                <div class="blog-card__body">
                    <p class="blog-card__meta module-tag">${topic} · ${g.readTime}${/read/i.test(g.readTime) ? "" : " read"}</p>
                    <h2>${g.title}</h2>
                    <p class="blog-card__excerpt">${g.excerpt}</p>
                    <span class="blog-card__meta">Free guide · Standen</span>
                </div>
            </a>
        </article>`;
}

const guidesGrid = guides.map(guideCard).join("\n                ");

const blogGrid = blogPosts
    .map((p) => {
        const date = new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
        return `<article class="blog-card">
            <a href="/blog/${p.slug}.html" class="blog-card__link">
                <div class="blog-card__media"><img src="${p.image}" alt="" width="800" height="500" loading="lazy" decoding="async"></div>
                <div class="blog-card__body">
                    <time class="blog-card__date" datetime="${p.date}">${date}</time>
                    <h2>${p.title}</h2>
                    <p class="blog-card__excerpt">${p.excerpt}</p>
                    <span class="blog-card__meta">${p.readTime} · Standen</span>
                </div>
            </a>
        </article>`;
    })
    .join("\n                ");

const filterButtons = [
    `<button type="button" class="guides-filter__btn is-active" data-filter="all">All</button>`,
    `<button type="button" class="guides-filter__btn" data-filter="saas">SaaS</button>`,
    `<button type="button" class="guides-filter__btn" data-filter="custom">Custom software</button>`,
    `<button type="button" class="guides-filter__btn" data-filter="Process">Process</button>`,
    `<button type="button" class="guides-filter__btn" data-filter="Technical">Technical</button>`,
].join("\n                    ");

const html = pageShell({
    title: "Blog | SaaS and Custom Software Guides | Standen",
    description: metaDescription(
        "Free long-form guides on SaaS MVP development, custom software, scoping, integrations, portals and handover. Practical build notes from Standen."
    ),
    canonical: `${SITE}/blog`,
    activeNav: "blog",
    robots: ROBOTS_INDEX,
    schema: {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Standen Blog",
        description: "Guides on SaaS development and custom software",
        url: `${SITE}/blog`,
        publisher: { "@type": "Organization", name: "Standen" },
    },
    extraScripts: `
    <script src="/guides-data.js"></script>
    <script src="/blog-hub.js"></script>`,
    body: `
        <section class="blog-page notes guides-page" aria-labelledby="blog-heading">
            <div class="wrap">
                ${breadcrumbs([{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }])}
                <header class="guides-page-head">
                    <span class="guides-intro__eyebrow">Free resources</span>
                    <h1 id="blog-heading">Guides on SaaS and custom software development</h1>
                    <p class="guides-page-lead">Long-form, practical guides on scoping SaaS MVPs, building custom software, integrations, customer portals, dashboards and handover. Written for founders and product teams who want to ship owned software without guesswork.</p>
                </header>

                <div class="guides-search" role="search">
                    <label class="guides-search__field" for="blog-search">
                        <svg class="guides-search__icon" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="5.25" stroke="currentColor" stroke-width="1.35"/><path d="M12.5 12.5 16 16" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/></svg>
                        <input type="search" id="blog-search" name="q" placeholder="Search guides and articles…" autocomplete="off" spellcheck="false">
                    </label>
                    <p class="guides-search__count" id="blog-search-count" aria-live="polite">${guides.length + blogPosts.length} articles</p>
                </div>

                <div class="guides-filter" role="toolbar" aria-label="Filter by topic">
                    ${filterButtons}
                </div>

                <h2 class="blog-section-title">Guides</h2>
                <div class="blog-grid guides-bento" id="guides-grid">${guidesGrid}</div>

                <h2 class="blog-section-title">Articles</h2>
                <div class="blog-grid" id="articles-grid">${blogGrid}</div>

                <p class="guides-empty" id="blog-empty" hidden>No articles match your search.</p>

                <aside class="blog-hub-links">
                    <p>Also see: <a href="/compare/index.html">build vs buy comparisons</a>, <a href="/audit.html">SaaS ops audit</a>, <a href="/work.html">case studies</a>, <a href="/#pricing">pricing</a>.</p>
                </aside>
            </div>
        </section>
        ${finalCta("Ready to scope a SaaS or custom software build?")}`,
});

fs.writeFileSync(path.join(ROOT, "blog.html"), html, "utf8");
console.log("wrote blog.html (hub with", guides.length, "guides and", blogPosts.length, "articles)");
