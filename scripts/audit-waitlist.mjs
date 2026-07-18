/**
 * Waitlist + Supabase integration audit.
 * Usage: node scripts/audit-waitlist.mjs
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local (or env).
 */
import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const waitlistApi = require(path.join(ROOT, "api", "waitlist.js"));
const { validate, handleWaitlist, supabaseConfig } = waitlistApi;

function loadEnv() {
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
            if (process.env[key] === undefined) process.env[key] = val;
        }
    }
}

loadEnv();

const errors = [];
const warnings = [];
const testEmail = `waitlist-audit-${Date.now()}@standen-audit.test`;

function createMockReq(body) {
    const raw = JSON.stringify(body);
    return {
        method: "POST",
        on(event, handler) {
            if (event === "data") handler(Buffer.from(raw));
            if (event === "end") handler();
        },
    };
}

function createMockRes() {
    return {
        statusCode: 200,
        headers: {},
        body: null,
        setHeader(name, value) {
            this.headers[name] = value;
        },
        end(payload) {
            this.body = payload ? JSON.parse(payload) : null;
        },
    };
}

function assert(condition, message) {
    if (!condition) errors.push(message);
}

function warn(message) {
    warnings.push(message);
}

// --- validation unit tests ---
const empty = validate({});
assert(empty.errors?.first_name, "validate: first_name required");
assert(empty.errors?.email, "validate: email required");
assert(empty.errors?.agency_website, "validate: agency_website required");
assert(empty.errors?.selected_process, "validate: selected_process required");

const legacyEmail = validate({
    first_name: "Audit",
    work_email: "legacy@example.com",
    agency_website: "https://example.com",
    selected_process: "Call QA",
});
assert(legacyEmail.data?.work_email === "legacy@example.com", "validate: accepts legacy work_email field");

const modern = validate({
    first_name: "Audit",
    email: "modern@example.com",
    agency_website: "https://example.com",
    selected_process: "Other",
    other_process: "Custom workflow",
});
assert(modern.data?.work_email === "modern@example.com", "validate: maps email to work_email for storage");

const honeypot = validate({ company_website: "spam-bot" });
assert(honeypot.honeypot === true, "validate: honeypot triggers on company_website");

// --- config ---
const { url: supabaseUrl, key: serviceKey } = supabaseConfig();

if (!supabaseUrl) errors.push("SUPABASE_URL is not set (.env.local or Vercel env)");
if (!serviceKey) errors.push("SUPABASE_SERVICE_ROLE_KEY is not set (.env.local or Vercel env)");

if (!process.env.RESEND_API_KEY) {
    warn("RESEND_API_KEY not set: confirmation emails will be skipped (signup still saves)");
}

async function fetchSignup(email) {
    const endpoint = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/webinar_waitlist?work_email=eq.${encodeURIComponent(email)}&select=id,first_name,work_email,selected_process`;
    const res = await fetch(endpoint, {
        headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
        },
    });
    if (!res.ok) {
        throw new Error(`Supabase read failed (${res.status})`);
    }
    return res.json();
}

async function deleteSignup(email) {
    const endpoint = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/webinar_waitlist?work_email=eq.${encodeURIComponent(email)}`;
    const res = await fetch(endpoint, {
        method: "DELETE",
        headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
        },
    });
    if (!res.ok && res.status !== 404) {
        throw new Error(`Supabase delete failed (${res.status})`);
    }
}

async function runLiveTests() {
    if (!supabaseUrl || !serviceKey) return;

    const payload = {
        first_name: "Audit",
        email: testEmail,
        agency_website: "https://standen.io",
        selected_process: "Lead qualification",
        source_path: "/waitlist-audit",
    };

    const req = createMockReq(payload);
    const res = createMockRes();
    await handleWaitlist(req, res);

    assert(res.statusCode === 200, `API handler: expected 200, got ${res.statusCode}`);
    assert(res.body?.ok === true, "API handler: response ok should be true");

    const rows = await fetchSignup(testEmail);
    assert(Array.isArray(rows) && rows.length === 1, "Supabase: signup row was inserted");
    if (rows[0]) {
        assert(rows[0].first_name === "Audit", "Supabase: first_name persisted");
        assert(rows[0].selected_process === "Lead qualification", "Supabase: selected_process persisted");
    }

    const dupReq = createMockReq(payload);
    const dupRes = createMockRes();
    await handleWaitlist(dupReq, dupRes);
    assert(dupRes.statusCode === 409, "API handler: duplicate email should return 409");
    assert(dupRes.body?.errors?.email, "API handler: duplicate error uses email field");

    await deleteSignup(testEmail);
    const afterDelete = await fetchSignup(testEmail);
    assert(Array.isArray(afterDelete) && afterDelete.length === 0, "Supabase: audit row cleaned up");
}

await runLiveTests();

if (warnings.length) {
    console.warn("Waitlist audit warnings:");
    for (const w of warnings) console.warn(" - " + w);
}

if (errors.length) {
    console.error("Waitlist audit failed:");
    for (const e of errors) console.error(" - " + e);
    process.exit(1);
}

console.log("Waitlist audit passed: validation, API handler, and Supabase insert verified.");
