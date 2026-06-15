import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pageShell, breadcrumbs, finalCta, accentCtaButton, CALENDLY, SITE, CTA_LABEL, ROBOTS_NOINDEX } from "./partials.mjs";
import { redirectPage, serviceHref } from "./service-anchors.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function write(rel, html) {
    fs.writeFileSync(path.join(ROOT, rel), html, "utf8");
    console.log("wrote", rel);
}

const content = JSON.parse(fs.readFileSync(path.join(ROOT, "content/enterprise.json"), "utf8"));

function renderLegacyRedirect(svc, legacyFile) {
    write(legacyFile, redirectPage(serviceHref(svc.slug), svc.h1));
}

const saas = content.services.find((s) => s.slug === "saas-mvp-development");
const internal = content.services.find((s) => s.slug === "internal-tools-for-agencies");
renderLegacyRedirect(saas, "saas-development-uk.html");
renderLegacyRedirect(internal, "custom-software-development-uk.html");

function renderLegal({ file, title, description, canonical, bodyParagraphs }) {
    const bodyHtml = bodyParagraphs.join("\n                    ");
    write(
        file,
        pageShell({
            title: `${title} | Standen`,
            description,
            canonical,
            activeNav: "",
            body: `
        <article class="guide-article legal-page">
            <div class="wrap">
                ${breadcrumbs([{ label: "Home", href: "/" }, { label: title, href: canonical.replace(SITE, "") }])}
                <header class="guide-article__head">
                    <h1>${title}</h1>
                    <p class="guide-article__lead"><strong>Last updated:</strong> January 2026</p>
                </header>
                <div class="guide-article__body">
                    ${bodyHtml}
                    <p><a href="/" class="text-link">Back to home <span aria-hidden="true">&gt;</span></a></p>
                </div>
            </div>
        </article>`,
        })
    );
}

renderLegal({
    file: "privacy.html",
    title: "Privacy policy",
    description: "Privacy policy for Standen. How we collect, use and protect your data.",
    canonical: SITE + "/privacy",
    bodyParagraphs: [
        "<p>Standen is committed to protecting your privacy. This policy explains how we collect, use and protect your personal data when you use our website or services.</p>",
        "<h2>Information we collect</h2><p>We may collect: (1) information you provide when you contact us (name, email, company, message); (2) usage data such as IP address, browser type and pages visited; (3) cookies and similar technologies as described in our cookie notice.</p>",
        "<h2>How we use it</h2><p>We use your data to respond to enquiries, deliver our services, improve our website and comply with legal obligations. We do not sell your data to third parties.</p>",
        "<h2>Legal basis</h2><p>We process personal data where necessary for contract performance, legitimate interests (e.g. improving our services) or with your consent where required.</p>",
        "<h2>Retention and security</h2><p>We retain data only as long as needed for the purposes above or as required by law. We use appropriate technical and organisational measures to protect your data.</p>",
        "<h2>Your rights</h2><p>You have the right to access, rectify, erase, restrict processing, object and data portability where applicable. You may lodge a complaint with a supervisory authority. To exercise your rights, contact us at the details on our website.</p>",
        "<h2>Contact</h2><p>For privacy enquiries, email <a href=\"mailto:tomas@standen.io\">tomas@standen.io</a>.</p>",
    ],
});

renderLegal({
    file: "terms.html",
    title: "Terms of use",
    description: "Terms of use for the Standen website and services.",
    canonical: SITE + "/terms",
    bodyParagraphs: [
        "<p>These terms govern your use of the Standen website and any services we provide. By using our site or services you agree to these terms.</p>",
        "<h2>Services</h2><p>Standen provides custom software, SaaS development, MVP development and related services. Specific deliverables, timelines and fees are set out in separate agreements or statements of work.</p>",
        "<h2>Use of the website</h2><p>You may use our website for lawful purposes only. You must not attempt to gain unauthorised access to our systems, transmit harmful code or use the site in a way that could damage or impair it.</p>",
        "<h2>Intellectual property</h2><p>Content on this website (text, design, logos) is owned by Standen or licensed to us. You may not copy, modify or distribute it without our prior written consent. Work we create for you is governed by the terms of your project agreement.</p>",
        "<h2>Limitation of liability</h2><p>To the fullest extent permitted by law, we exclude liability for indirect, consequential or special loss arising from your use of the website or our services. Our total liability in connection with any contract shall not exceed the fees paid by you for the relevant project.</p>",
        "<h2>Changes</h2><p>We may update these terms from time to time. The last updated date at the top indicates when they were last revised. Continued use of the site after changes constitutes acceptance.</p>",
        "<h2>Contact</h2><p>For questions about these terms, email <a href=\"mailto:tomas@standen.io\">tomas@standen.io</a>.</p>",
    ],
});

write(
    "case-studies.html",
    pageShell({
        title: "Case studies | Standen",
        description: "Standen case studies: SaaS MVPs, dashboards, automation and full-stack software. Delivered in 6 to 21 days.",
        canonical: SITE + "/work",
        robots: ROBOTS_NOINDEX,
        activeNav: "work",
        body: `
        <section class="contact-page">
            <div class="wrap">
                <header class="guides-page-head">
                    <h1>Case studies have moved</h1>
                    <p class="guides-page-lead">All project write-ups now live on our Work page.</p>
                </header>
                <div class="contact-page__actions">
                    <a href="/work.html" class="btn btn--accent btn--lg">View case studies <span aria-hidden="true">&gt;</span></a>
                </div>
            </div>
        </section>`,
    })
);

write(
    "resources.html",
    pageShell({
        title: "Resources | Standen",
        description: "Guides, comparisons, blog posts and FAQs for SaaS founders planning custom software builds.",
        canonical: SITE + "/resources",
        robots: ROBOTS_NOINDEX,
        activeNav: "guides",
        body: `
        <section class="blog-page">
            <div class="wrap">
                ${breadcrumbs([{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }])}
                <header class="guides-page-head">
                    <h1>Resources</h1>
                    <p class="guides-page-lead">Guides, comparisons and practical posts for SaaS founders and product operators.</p>
                </header>
                <div class="service-hub__grid">
                    <a href="/guides.html" class="service-hub__card"><h2>Guides</h2><p>SaaS MVPs, product workflows, portals, operations and custom software.</p><span class="text-link">Browse guides <span aria-hidden="true">&gt;</span></span></a>
                    <a href="/compare/index.html" class="service-hub__card"><h2>Compare</h2><p>Build vs buy, dashboards vs spreadsheets, software vs hiring ops.</p><span class="text-link">Read comparisons <span aria-hidden="true">&gt;</span></span></a>
                    <a href="/audit.html" class="service-hub__card"><h2>Ops audit</h2><p>Five workflow leaks that cost SaaS founders hours and margin.</p><span class="text-link">Read the audit <span aria-hidden="true">&gt;</span></span></a>
                    <a href="/blog.html" class="service-hub__card"><h2>Blog</h2><p>Scoping, delivery and build vs buy notes from Standen.</p><span class="text-link">Read the blog <span aria-hidden="true">&gt;</span></span></a>
                </div>
            </div>
        </section>
        ${faqSectionResources()}`,
    })
);

function faqSectionResources() {
    const faqs = [
        { q: "How long does a typical build take?", a: "Launch tier ships in <strong>14 days</strong>, Scale in <strong>21 days</strong>, and Enterprise in <strong>30 days</strong>, depending on scope." },
        { q: "What does it cost?", a: "Launch starts from <strong>£5,000</strong>, Scale from <strong>£9,500</strong>, and Enterprise from <strong>£18,000</strong>, with fixed scope and full handover." },
        { q: "Do you work with founders outside the UK?", a: "Yes. We are UK-based and work remotely with SaaS founders worldwide." },
        { q: "What is your process?", a: "Discovery and scope, build in weekly sprints with demos, then handover with full code ownership." },
    ];
    return `<section class="seo-faq wrap" aria-labelledby="res-faq"><h2 id="res-faq">Common questions</h2><div class="seo-faq__list">${faqs.map((f, i) => `<details class="seo-faq__item"${i === 0 ? " open" : ""}><summary>${f.q}</summary><p>${f.a}</p></details>`).join("")}</div></section>`;
}

function loadBlogPosts() {
    const raw = fs.readFileSync(path.join(ROOT, "blog-data.js"), "utf8").replace(/window\.BLOG_POSTS/, "BLOG_POSTS");
    return new Function(`${raw}\nreturn BLOG_POSTS;`)();
}

const blogPosts = loadBlogPosts();

function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

for (const post of blogPosts) {
    const url = `${SITE}/blog/${post.slug}`;
    write(
        `blog/${post.slug}.html`,
        pageShell({
            title: `${post.title} | Blog | Standen`,
            description: post.excerpt,
            canonical: url,
            robots: ROBOTS_NOINDEX,
            ogType: "article",
            activeNav: "",
            body: `
        <article class="guide-article blog-post-page">
            <div class="wrap">
                ${breadcrumbs([{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title, href: `/blog/${post.slug}` }])}
                <header class="guide-article__head">
                    <a href="/blog.html" class="guide-article__back text-link">Blog <span aria-hidden="true">&gt;</span></a>
                    <p class="guide-article__meta module-tag">${formatDate(post.date)} · ${post.readTime} · ${post.author}</p>
                    <h1>${post.title}</h1>
                    <p class="guide-article__lead">${post.excerpt}</p>
                </header>
                ${post.image ? `<div class="guide-article__hero"><img src="${post.image}" alt="" width="800" height="500" loading="lazy" decoding="async"></div>` : ""}
                <div class="guide-article__body">${post.body}</div>
                <p class="guide-article__close">${accentCtaButton("nav-cta")}</p>
            </div>
        </article>`,
        })
    );
}

write(
    "custom-build-vs-off-the-shelf.html",
    redirectPage("/compare/custom-build-vs-off-the-shelf.html", "Compare")
);

write(
    "case-study.html",
    `<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, follow">
    <link rel="canonical" href="${SITE}/work">
    <title>Case studies | Standen</title>
    <script>location.replace("/work.html");</script>
</head>
<body><p><a href="/work.html">View case studies</a></p></body>
</html>`
);

write(
    "guide.html",
    `<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, follow">
    <link rel="canonical" href="${SITE}/guides">
    <title>Guides | Standen</title>
    <script>location.replace("/guides.html");</script>
</head>
<body><p><a href="/guides.html">View guides</a></p></body>
</html>`
);

write(
    "blog-post.html",
    `<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, follow">
    <link rel="canonical" href="${SITE}/blog">
    <title>Blog | Standen</title>
    <script src="/blog-data.js"></script>
    <script>
        (function () {
            var slug = new URLSearchParams(location.search).get("slug");
            var posts = window.BLOG_POSTS || [];
            var post = posts.find(function (p) { return p.slug === slug; });
            location.replace(post ? "/blog/" + post.slug + ".html" : "/blog.html");
        })();
    </script>
</head>
<body><p><a href="/blog.html">Blog</a></p></body>
</html>`
);

console.log("Done. Remaining legacy pages migrated to home.css branding.");
