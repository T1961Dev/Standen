import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKIP_DIRS = new Set([".git", "node_modules", "content"]);
const LEGACY_NO_INDEX = new Set(["blog-post.html", "case-study.html", "guide.html"]);

function walk(dir, files = []) {
    for (const name of fs.readdirSync(dir)) {
        if (SKIP_DIRS.has(name)) continue;
        const full = path.join(dir, name);
        const st = fs.statSync(full);
        if (st.isDirectory()) walk(full, files);
        else if (name.endsWith(".html")) files.push(full);
    }
    return files;
}

function rel(file) {
    return path.relative(ROOT, file).replace(/\\/g, "/");
}

function stripUrl(raw) {
    if (!raw) return null;
    const value = raw.trim();
    if (!value || value.startsWith("#")) return null;
    if (/^(https?:|mailto:|tel:|data:|javascript:)/i.test(value)) return null;
    return value.split("#")[0].split("?")[0] || "/";
}

function localTargetExists(urlPath) {
    if (!urlPath || !urlPath.startsWith("/")) return true;
    if (urlPath === "/") return fs.existsSync(path.join(ROOT, "index.html"));
    const cleaned = decodeURIComponent(urlPath).replace(/^\/+/, "");
    const direct = path.join(ROOT, cleaned);
    if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return true;
    if (fs.existsSync(path.join(direct, "index.html"))) return true;
    if (!path.extname(cleaned) && fs.existsSync(path.join(ROOT, cleaned + ".html"))) return true;
    return false;
}

function textLength(regex, html) {
    const match = html.match(regex);
    return match ? match[1].replace(/\s+/g, " ").trim().length : 0;
}

function isNoIndex(html) {
    return /<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
}

function assertJsonLd(file, html, errors) {
    const scripts = [...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    for (const script of scripts) {
        const json = script[1].trim();
        if (!json) continue;
        try {
            JSON.parse(json);
        } catch (err) {
            errors.push(`${rel(file)} has invalid JSON-LD: ${err.message}`);
        }
    }
}

const files = walk(ROOT);
const errors = [];
const warnings = [];

for (const file of files) {
    const html = fs.readFileSync(file, "utf8");
    const r = rel(file);
    const noindex = isNoIndex(html) || LEGACY_NO_INDEX.has(r);

    for (const match of html.matchAll(/\s(?:href|src|action)=["']([^"']+)["']/gi)) {
        const target = stripUrl(match[1]);
        if (!target || !target.startsWith("/")) continue;
        if (target !== "/" && !path.posix.extname(target)) {
            errors.push(`${r} links to rewrite-only path ${target}; use the concrete .html file for clickable links`);
        }
        if (!localTargetExists(target)) {
            errors.push(`${r} links to missing local target ${target}`);
        }
    }

    if (!noindex && /Guide not found|This guide is being finalised|Loading\.\.\.|Cannot GET|Not Found/i.test(html)) {
        errors.push(`${r} contains placeholder or not-found copy`);
    }

    assertJsonLd(file, html, errors);
    if (noindex) continue;

    if (!/<title>[^<]{8,}<\/title>/i.test(html)) {
        errors.push(`${r} is missing a meaningful title`);
    }
    if (textLength(/<meta\s+name=["']description["'][^>]*content=["']([^"']+)["']/i, html) < 50) {
        errors.push(`${r} is missing a useful meta description`);
    }
    if (!/<link\s+rel=["']canonical["'][^>]*href=["']https:\/\/standen\.io\/[^"']*["']/i.test(html)) {
        errors.push(`${r} is missing a canonical URL`);
    }
    const h1s = html.match(/<h1\b/gi) || [];
    if (h1s.length !== 1) {
        errors.push(`${r} should have exactly one h1, found ${h1s.length}`);
    }
}

if (warnings.length) {
    console.warn("Audit warnings:");
    for (const warning of warnings) console.warn(" - " + warning);
}

if (errors.length) {
    console.error("Audit failed:");
    for (const error of errors) console.error(" - " + error);
    process.exit(1);
}

console.log(`Audit passed: ${files.length} HTML files checked.`);
