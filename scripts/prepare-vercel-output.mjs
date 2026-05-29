import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public");

const EXCLUDE_DIRS = new Set(["scripts", "content", "public", "node_modules", ".git"]);
const EXCLUDE_FILES = new Set([
    "dev-server.js",
    "package.json",
    "package-lock.json",
]);

function shouldCopyFile(name) {
    if (EXCLUDE_FILES.has(name)) return false;
    if (name.endsWith(".log")) return false;
    if (name.endsWith(".md")) return false;
    if (name.endsWith(".mjs")) return false;
    return true;
}

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
        const srcPath = path.join(src, name);
        const destPath = path.join(dest, name);
        const stat = fs.statSync(srcPath);

        if (stat.isDirectory()) {
            if (EXCLUDE_DIRS.has(name)) continue;
            copyDir(srcPath, destPath);
            continue;
        }

        if (!shouldCopyFile(name)) continue;
        fs.copyFileSync(srcPath, destPath);
    }
}

if (fs.existsSync(OUT)) {
    fs.rmSync(OUT, { recursive: true, force: true });
}

copyDir(ROOT, OUT);
console.log("wrote public/ for Vercel deployment");
