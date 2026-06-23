import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SITE } from "./partials.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const LASTMOD = new Date().toISOString().slice(0, 10);

const SKIP_DIRS = new Set(["scripts", "content", "public", "node_modules", ".git", "assets", "pics", "js"]);

/** Not in primary nav; keep crawl budget on commercial URLs */
const SITEMAP_EXCLUDE_PREFIXES = [];

function includeInSitemap(loc) {
    return !SITEMAP_EXCLUDE_PREFIXES.some((prefix) => loc === prefix || loc.startsWith(`${prefix}/`));
}
const SKIP_FILES = new Set([
    "case-study.html",
    "guide.html",
    "blog-post.html",
    "case-studies.html",
    "custom-build-vs-off-the-shelf.html",
    "saas-development-uk.html",
    "custom-software-development-uk.html",
    "agencies.html",
]);

function walkHtml(dir, files = []) {
    for (const name of fs.readdirSync(dir)) {
        if (SKIP_DIRS.has(name)) continue;
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
            walkHtml(full, files);
            continue;
        }
        if (!name.endsWith(".html")) continue;
        const rel = path.relative(ROOT, full).replace(/\\/g, "/");
        if (SKIP_FILES.has(rel)) continue;
        if (rel.startsWith("services/")) continue;
        files.push(rel);
    }
    return files;
}

function toUrlPath(rel) {
    if (rel === "index.html") return "/";
    if (rel.endsWith("/index.html")) return `/${rel.slice(0, -"/index.html".length)}`;
    return `/${rel.replace(/\.html$/, "")}`;
}

function priorityFor(loc) {
    if (loc === "/") return "1.0";
    if (loc === "/work" || loc === "/audit" || loc === "/blog") return "0.9";
    if (loc.startsWith("/compare")) return "0.85";
    if (loc.startsWith("/guides/") || loc.startsWith("/blog/")) {
        return loc.includes("how-to-scope") || loc.includes("scope-first") ? "0.85" : "0.75";
    }
    if (loc.startsWith("/case-studies/")) return loc.endsWith("/ohmypod") ? "0.7" : "0.6";
    if (loc === "/about") return "0.75";
    if (loc === "/guides") return "0.85";
    return "0.5";
}

function changefreqFor(loc) {
    if (loc === "/" || loc === "/blog" || loc === "/guides") return "weekly";
    if (loc === "/privacy" || loc === "/terms") return "yearly";
    if (loc.startsWith("/guides/") || loc.startsWith("/blog/")) return "monthly";
    if (loc.startsWith("/case-studies/")) return "yearly";
    return "monthly";
}

const htmlFiles = walkHtml(ROOT);
const urlPaths = [...new Set(htmlFiles.map(toUrlPath).filter(includeInSitemap))].sort((a, b) => a.localeCompare(b));

const body = urlPaths
    .map(
        (loc) => `    <url>
        <loc>${SITE}${loc}</loc>
        <lastmod>${LASTMOD}</lastmod>
        <changefreq>${changefreqFor(loc)}</changefreq>
        <priority>${priorityFor(loc)}</priority>
    </url>`
    )
    .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml, "utf8");
console.log("sitemap.xml updated,", urlPaths.length, "URLs from", htmlFiles.length, "HTML files");
