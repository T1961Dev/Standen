import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const REPLACEMENTS = [
    [/Custom software and SaaS for UK agencies/g, "SaaS development for founders"],
    [/for UK agencies and founders/g, "for SaaS founders"],
    [/for UK agency founders/g, "for SaaS founders"],
    [/for your UK agency/g, "for your SaaS product"],
    [/for UK founders and agencies/g, "for SaaS founders"],
    [/for UK founders/g, "for founders"],
    [/UK B2B agencies/g, "SaaS founders"],
    [/UK B2B agency/g, "SaaS founder"],
    [/UK agencies/g, "SaaS teams"],
    [/UK agency/g, "SaaS team"],
    [/UK delivery by Standen/g, "Remote delivery by Standen"],
    [/Built in the UK\./g, "Founder-led delivery."],
    [/Based in the UK\./g, "UK-based studio."],
    [/Custom Software for UK Agencies/g, "SaaS Development for Founders"],
    [/Agency Ops Audit UK/g, "SaaS Ops Audit"],
    [/"areaServed":"GB"/g, '"areaServed":"Worldwide"'],
    [/Primary focus is UK B2B agencies\./g, "We work with SaaS founders worldwide."],
    [/We are UK-based and work remotely with UK and international clients\./g, "We are UK-based and work remotely with SaaS founders worldwide."],
];

const SKIP_DIRS = new Set(["node_modules", ".git", ".cursor", "content"]);
const EXT = new Set([".html", ".json", ".mjs", ".js", ".xml"]);

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
    if (file.includes(`${path.sep}scripts${path.sep}global-copy.mjs`)) continue;
    let text = fs.readFileSync(file, "utf8");
    const orig = text;
    for (const [from, to] of REPLACEMENTS) text = text.replace(from, to);
    if (text !== orig) {
        fs.writeFileSync(file, text, "utf8");
        changed++;
        console.log("updated", path.relative(ROOT, file));
    }
}
console.log(`Done. ${changed} files updated.`);
