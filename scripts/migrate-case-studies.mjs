import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";
import { pageShell, breadcrumbs, finalCta, accentCtaButton, SITE } from "./partials.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const sandbox = {};
const raw = fs.readFileSync(path.join(ROOT, "case-study-data.js"), "utf8").replace(/window\.CASE_STUDIES/g, "CASE_STUDIES");
vm.runInNewContext(raw + "\nthis.CASE_STUDIES = CASE_STUDIES;", sandbox);
const studies = sandbox.CASE_STUDIES;

function imageSrc(p) {
    if (!p) return "";
    if (p.startsWith("http") || p.startsWith("/")) return p;
    return "/" + p;
}

for (const [id, study] of Object.entries(studies)) {
    const slug = study.slug || id;
    const heroClass =
        study.imageMode === "logo" ? "case-study__hero case-study__hero--logo" : "case-study__hero";
    const imageBlock = study.image
        ? `<div class="${heroClass}"><img src="${imageSrc(study.image)}" alt="${study.imageAlt || study.title}" loading="eager" decoding="async"></div>`
        : "";
    const live = study.liveUrl
        ? `<a href="${study.liveUrl}" class="btn btn--outline" target="_blank" rel="noopener">View live product <span aria-hidden="true">&gt;</span></a>`
        : "";
    const results = (study.results || [])
        .map(
            (r) =>
                `<li><span class="case-study__check" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3 3 7-7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span>${r}</span></li>`
        )
        .join("");
    const pills = (study.stack || [])
        .map((t) => `<span class="case-study__pill">${t}</span>`)
        .join("");
    const quote = study.testimonial
        ? `<blockquote class="case-study__quote"><p>&ldquo;${study.testimonial.quote}&rdquo;</p><footer>${study.testimonial.author}${study.testimonial.role ? " <span>·</span> " + study.testimonial.role : ""}</footer></blockquote>`
        : "";
    const servicesLabel = (study.services || []).slice(0, 2).join(" / ");

    const body = `
        <article class="case-study">
            <div class="wrap">
                ${breadcrumbs([{ label: "Home", href: "/" }, { label: "Work", href: "/work" }, { label: study.title, href: `/case-studies/${slug}` }])}
                <header class="case-study__head">
                    <a href="/work.html" class="case-study__back text-link">All case studies <span aria-hidden="true">&gt;</span></a>
                    <p class="notes-meta case-study__meta">${study.eyebrow || "Custom software"} <span>·</span> ${study.timeline || "Scoped sprint"}</p>
                    <h1>${study.title}</h1>
                    <p class="case-study__lead">${study.summary || ""}</p>
                    <div class="case-study__actions">
                        ${accentCtaButton("nav-cta")}
                        ${live}
                    </div>
                </header>
                ${imageBlock}
            </div>
            <div class="wrap case-study__content">
                <div class="case-study__stats">
                    <div><span>Client</span><strong>${study.client || "Custom project"}</strong></div>
                    <div><span>Timeline</span><strong>${study.timeline || "Scoped sprint"}</strong></div>
                    <div><span>Services</span><strong>${servicesLabel || "Custom build"}</strong></div>
                </div>
                <div class="case-study__grid">
                    <section class="case-study__card"><div class="case-study__card__top"><h2 class="case-study__section-title">The challenge</h2></div><p>${study.problem || ""}</p></section>
                    <section class="case-study__card"><div class="case-study__card__top"><h2 class="case-study__section-title">What we delivered</h2></div><p>${study.solution || ""}</p></section>
                </div>
                <div class="case-study__grid case-study__grid--split">
                    <section class="case-study__card case-study__card--surface"><div class="case-study__card__top"><h2 class="case-study__section-title">Results</h2></div><ul class="case-study__results">${results}</ul></section>
                    <section class="case-study__card"><div class="case-study__card__top"><h2 class="case-study__section-title">Stack and workflow</h2></div><div class="case-study__pills">${pills}</div></section>
                </div>
                ${quote}
            </div>
        </article>
        ${finalCta("Ready to scope a similar build?")}`;

    const html = pageShell({
        title: `${study.title} | Case Study | Standen`,
        description: `${study.summary || study.title} Case study by Standen. Custom software and SaaS delivery.`,
        canonical: `${SITE}/case-studies/${slug}`,
        activeNav: "work",
        schema: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Article",
                    headline: study.title,
                    description: study.summary,
                    ...(study.image
                        ? { image: study.image.startsWith("http") ? study.image : `${SITE}${imageSrc(study.image)}` }
                        : {}),
                    author: { "@type": "Organization", name: "Standen", url: SITE },
                    publisher: { "@id": "https://www.standen.io/#organization" },
                    datePublished: "2026-05-26",
                    dateModified: "2026-05-26",
                    mainEntityOfPage: `${SITE}/case-studies/${slug}`,
                },
                {
                    "@type": "BreadcrumbList",
                    itemListElement: [
                        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                        { "@type": "ListItem", position: 2, name: "Work", item: `${SITE}/work` },
                        { "@type": "ListItem", position: 3, name: study.title, item: `${SITE}/case-studies/${slug}` },
                    ],
                },
            ],
        },
        ogType: "article",
        body,
    });

    const out = path.join(ROOT, "case-studies", `${slug}.html`);
    fs.writeFileSync(out, html, "utf8");
    console.log("migrated", out);
}
