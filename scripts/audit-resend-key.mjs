/**
 * One-shot Resend key + from-address audit. Does not print the full key.
 * Usage: node scripts/audit-resend-key.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

function loadEnv({ overwrite = true } = {}) {
  for (const name of [".env.local", ".env"]) {
    const file = path.join(ROOT, name);
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      val = val.trim();
      if (overwrite || process.env[key] === undefined) process.env[key] = val;
    }
  }
}

loadEnv({ overwrite: true });

const key = process.env.RESEND_API_KEY || "";
const from = process.env.WAITLIST_FROM_EMAIL || "Standen <waitlist@standen.io>";

console.log("Resend key audit");
console.log("- RESEND_API_KEY length:", key.length);
console.log("- starts with re_:", key.startsWith("re_"));
console.log("- char codes tail:", [...key.slice(-4)].map((c) => c.charCodeAt(0)).join(","));
console.log("- from address:", from);

if (!key) {
  console.error("FAIL: RESEND_API_KEY missing");
  process.exit(1);
}

const { Resend } = require("resend");
const resend = new Resend(key);

const result = await resend.emails.send({
  from,
  to: "tomastrombone@outlook.com",
  subject: "Standen waitlist Resend key audit",
  html: "<p>If you received this, the API key and from address work.</p>",
});

console.log(JSON.stringify(result, null, 2));
if (result.error) process.exit(1);
console.log("PASS: confirmation email accepted by Resend");
