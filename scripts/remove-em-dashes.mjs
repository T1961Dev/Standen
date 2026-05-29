import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKIP_DIRS = new Set(["node_modules", ".git", ".cursor"]);
const EXT = new Set([".html", ".json", ".js", ".mjs", ".xml"]);

function fixEmDash(text) {
    return text.replace(/\s*—\s*/g, ", ").replace(/—/g, ", ").replace(/,\s+,/g, ", ");
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
    if (text.includes("—") || text.includes("&mdash;")) {
        text = fixEmDash(text.replace(/&mdash;/g, ","));
    }
    text = fixColonArtifacts(text);
    if (text !== orig) {
        fs.writeFileSync(file, text, "utf8");
        changed++;
        console.log("updated", path.relative(ROOT, file));
    }
}
console.log(`Done. ${changed} files updated.`);
