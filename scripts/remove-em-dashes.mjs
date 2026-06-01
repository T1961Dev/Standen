import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKIP_DIRS = new Set(["node_modules", ".git", ".cursor"]);
const EXT = new Set([".html", ".json", ".js", ".mjs", ".xml", ".txt"]);

function fixEmDash(text) {
    return text.replace(/\s*\u2014\s*/g, ", ").replace(/\u2014/g, ", ").replace(/,\s+,/g, ", ");
}

function fixEnDash(text) {
    // Numeric/word ranges (14\u201321, \u00a35k\u2013\u00a318k, 0\u201310, Day 1\u20132) -> plain hyphen.
    text = text.replace(/([0-9A-Za-z%\u00a3])\s*\u2013\s*([0-9A-Za-z\u00a3])/g, "$1-$2");
    // Any remaining en dash used as punctuation -> comma, matching em-dash style.
    return text.replace(/\s*\u2013\s*/g, ", ").replace(/,\s+,/g, ", ");
}

function fixColonArtifacts(text) {
    return text.replace(/:\s+(and|with|without|one|not|so)\b/gi, ", $1");
}

function walk(dir, files = []) {
    for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        if (SKIP_DIRS.has(name)) continue;
        const st = fs.statSync(full);
        if (st.isDirectory()) walk(full, files);
        else if (EXT.has(path.extname(name))) files.push(full);
    }
    return files;
}

let changed = 0;
for (const file of walk(ROOT)) {
    if (file.includes(`${path.sep}scripts${path.sep}remove-em-dashes.mjs`)) continue;
    let text = fs.readFileSync(file, "utf8");
    const orig = text;
    if (text.includes("\u2014") || text.includes("&mdash;")) {
        text = fixEmDash(text.replace(/&mdash;/g, ","));
    }
    if (text.includes("\u2013") || text.includes("&ndash;")) {
        text = fixEnDash(text.replace(/&ndash;/g, "\u2013"));
    }
    text = fixColonArtifacts(text);
    if (text !== orig) {
        fs.writeFileSync(file, text, "utf8");
        changed++;
        console.log("updated", path.relative(ROOT, file));
    }
}
console.log(`Done. ${changed} files updated.`);
