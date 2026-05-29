import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://standen.io";
const LASTMOD = "2026-05-29";

function loadWindowArray(file, globalName) {
    const sandbox = { window: {} };
    vm.runInNewContext(fs.readFileSync(path.join(ROOT, file), "utf8"), sandbox);
    return sandbox.window[globalName] || [];
}

function loadCaseStudies() {
    const sandbox = { window: {} };
    vm.runInNewContext(fs.readFileSync(path.join(ROOT, "case-study-data.js"), "utf8"), sandbox);
    return Object.values(sandbox.window.CASE_STUDIES || {});
}

const coreUrls = [
    { loc: "/", priority: "1.0", changefreq: "weekly" },
    { loc: "/audit", priority: "0.9", changefreq: "monthly" },
    { loc: "/compare", priority: "0.85", changefreq: "monthly" },
    { loc: "/compare/custom-build-vs-off-the-shelf", priority: "0.85", changefreq: "monthly" },
    { loc: "/compare/agency-build-vs-hiring-operations", priority: "0.8", changefreq: "monthly" },
    { loc: "/compare/custom-crm-vs-spreadsheet", priority: "0.8", changefreq: "monthly" },
    { loc: "/work", priority: "0.9", changefreq: "monthly" },
    { loc: "/about", priority: "0.75", changefreq: "monthly" },
    { loc: "/resources", priority: "0.65", changefreq: "monthly" },
    { loc: "/guides", priority: "0.8", changefreq: "weekly" },
    { loc: "/blog", priority: "0.7", changefreq: "weekly" },
    { loc: "/privacy", priority: "0.3", changefreq: "yearly" },
    { loc: "/terms", priority: "0.3", changefreq: "yearly" },
];

const guideUrls = loadWindowArray("guides-data.js", "GUIDES").map((guide) => ({
    loc: `/guides/${guide.slug}`,
    priority: guide.slug === "a2a-protocol" ? "0.8" : "0.65",
    changefreq: "monthly",
}));

const blogUrls = loadWindowArray("blog-data.js", "BLOG_POSTS").map((post) => ({
    loc: `/blog/${post.slug}`,
    priority: "0.6",
    changefreq: "yearly",
}));

const caseStudyUrls = loadCaseStudies().map((study) => ({
    loc: `/case-studies/${study.slug}`,
    priority: study.slug === "ohmypod" ? "0.7" : "0.6",
    changefreq: "yearly",
}));

const urls = [...coreUrls, ...guideUrls, ...caseStudyUrls, ...blogUrls];

const body = urls
    .map(
        (u) => `    <url>
        <loc>${SITE}${u.loc}</loc>
        <lastmod>${LASTMOD}</lastmod>
        <changefreq>${u.changefreq}</changefreq>
        <priority>${u.priority}</priority>
    </url>`
    )
    .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml, "utf8");
console.log("sitemap.xml updated,", urls.length, "URLs");
