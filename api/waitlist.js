/**
 * POST /api/waitlist
 * Saves Agency Systems waitlist signups to Supabase and optionally emails via Resend.
 *
 * Env (Vercel / local):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   RESEND_API_KEY (required for confirmation email)
 *   WAITLIST_FROM_EMAIL (optional-default Standen <waitlist@standen.io>)
 *   WAITLIST_REPLY_TO (optional-default tomas@standen.io)
 *   WAITLIST_NOTIFY_TO (optional-internal notify)
 */

const ALLOWED_PROCESSES = new Set([
  "Client reporting",
  "Lead qualification",
  "Call QA",
  "Campaign setup",
  "Appointment handover",
  "Other",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function loadEnvFromFiles() {
  if (process.env.VERCEL) return;
  const fs = require("fs");
  const path = require("path");
  const root = path.join(__dirname, "..");
  const FORCE_KEYS = new Set([
    "RESEND_API_KEY",
    "WAITLIST_FROM_EMAIL",
    "WAITLIST_REPLY_TO",
    "WAITLIST_NOTIFY_TO",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_SERIVE_ROLE_KEY",
    "NEXT_PUBLIC_SUPABASE_URL",
  ]);
  for (const name of [".env.local", ".env"]) {
    const file = path.join(root, name);
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
      if (FORCE_KEYS.has(key) || process.env[key] === undefined) {
        process.env[key] = val;
      }
    }
  }
}

loadEnvFromFiles();

function supabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERIVE_ROLE_KEY;
  return { url, key };
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function trim(value, max) {
  const s = String(value == null ? "" : value).trim();
  return s.slice(0, max);
}

function normaliseWebsite(raw) {
  let s = trim(raw, 300);
  if (!s) return "";
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  try {
    const u = new URL(s);
    if (!u.hostname || !u.hostname.includes(".")) return "";
    return u.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

function validate(payload) {
  const errors = {};

  if (trim(payload.company_website || payload.website_hp || "", 200)) {
    return { honeypot: true, errors: {} };
  }

  const firstName = trim(payload.first_name, 80);
  const email = trim(payload.email || payload.work_email, 160).toLowerCase();
  const agencyWebsite = normaliseWebsite(payload.agency_website);
  const selectedProcess = trim(payload.selected_process, 80);
  const otherProcess = trim(payload.other_process, 280);
  const sourcePath = trim(payload.source_path, 200) || "/waitlist";

  if (!firstName || firstName.length < 2) {
    errors.first_name = "Enter your first name.";
  }
  if (!email || !EMAIL_RE.test(email)) {
    errors.email = "Enter a valid email.";
  }
  if (!agencyWebsite) {
    errors.agency_website = "Enter your agency website.";
  }
  if (!ALLOWED_PROCESSES.has(selectedProcess)) {
    errors.selected_process = "Choose which process to rebuild first.";
  }
  if (selectedProcess === "Other" && otherProcess.length < 2) {
    errors.other_process = "Briefly describe the process.";
  }

  if (Object.keys(errors).length) {
    return { errors };
  }

  return {
    data: {
      first_name: firstName,
      work_email: email,
      agency_website: agencyWebsite,
      selected_process: selectedProcess,
      other_process: selectedProcess === "Other" ? otherProcess : null,
      source_path: sourcePath,
    },
  };
}

async function insertSignup(row) {
  const { url, key } = supabaseConfig();
  if (!url || !key) {
    const err = new Error("Server is missing Supabase configuration.");
    err.code = "CONFIG";
    throw err;
  }

  const endpoint = `${url.replace(/\/$/, "")}/rest/v1/webinar_waitlist`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
  });

  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (res.status === 409 || (res.status === 400 && /duplicate|unique/i.test(text))) {
    const err = new Error("That email is already on the waitlist.");
    err.code = "DUPLICATE";
    throw err;
  }

  if (!res.ok) {
    const err = new Error("Could not save your signup. Please try again.");
    err.code = "DB";
    err.detail = body;
    throw err;
  }

  return Array.isArray(body) ? body[0] : body;
}

async function emailExists(email) {
  const { url, key } = supabaseConfig();
  if (!url || !key) {
    const err = new Error("Server is missing Supabase configuration.");
    err.code = "CONFIG";
    throw err;
  }

  const normalised = trim(email, 160).toLowerCase();
  if (!normalised || !EMAIL_RE.test(normalised)) {
    return { invalid: true };
  }

  const endpoint =
    `${url.replace(/\/$/, "")}/rest/v1/webinar_waitlist` +
    `?work_email=eq.${encodeURIComponent(normalised)}&select=id&limit=1`;

  const res = await fetch(endpoint, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });

  if (!res.ok) {
    const detail = await res.text();
    const err = new Error("Could not check email.");
    err.code = "DB";
    err.detail = detail;
    throw err;
  }

  const rows = await res.json();
  return { exists: Array.isArray(rows) && rows.length > 0, email: normalised };
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  const { Resend } = require("resend");
  return new Resend(apiKey);
}

async function sendViaResend(payload) {
  const resend = getResendClient();
  if (!resend) {
    return { ok: false, reason: "RESEND_API_KEY not set" };
  }

  const { data, error } = await resend.emails.send(payload);
  if (error) {
    return {
      ok: false,
      status: error.statusCode || 500,
      detail: error.message || JSON.stringify(error),
    };
  }

  return { ok: true, id: data && data.id };
}

async function sendEmails(row) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("Waitlist confirmation skipped: RESEND_API_KEY is not set.");
    return { sent: false, reason: "RESEND_API_KEY not set" };
  }

  const from = process.env.WAITLIST_FROM_EMAIL || "Standen <waitlist@standen.io>";
  const notifyTo = process.env.WAITLIST_NOTIFY_TO || "tomas@standen.io";
  const replyTo = process.env.WAITLIST_REPLY_TO || "tomas@standen.io";
  const { html, text, subject } = buildConfirmationEmail(row);

  const notifyText = `New Agency Systems waitlist signup

Name: ${row.first_name}
Email: ${row.work_email}
Website: ${row.agency_website}
Process: ${row.selected_process}${row.other_process ? ` (${row.other_process})` : ""}
Source: ${row.source_path}`;

  const confirmResult = await sendViaResend({
    from,
    to: [row.work_email],
    replyTo,
    subject,
    html,
    text,
  });

  if (!confirmResult.ok) {
    const key = process.env.RESEND_API_KEY || "";
    console.error(
      "Waitlist confirmation email failed",
      confirmResult.status,
      confirmResult.detail,
      {
        from,
        keyLen: key.length,
        keyPrefix: key.slice(0, 3),
      }
    );
    return { sent: false, reason: "confirmation_failed", detail: confirmResult.detail };
  }

  await sendViaResend({
    from,
    to: [notifyTo],
    replyTo: row.work_email,
    subject: `Waitlist: ${row.first_name} (${row.selected_process})`,
    text: notifyText,
  });

  return { sent: true, id: confirmResult.id };
}

function processLabel(row) {
  if (row.selected_process === "Other" && row.other_process) {
    return row.other_process;
  }
  return row.selected_process;
}

function buildConfirmationEmail(row) {
  const name = escapeHtml(row.first_name);
  const process = escapeHtml(processLabel(row));
  const subject = "You're on the Agency Systems waitlist";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f6f4f1;font-family:Helvetica,Arial,sans-serif;color:#222221;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f4f1;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e8e4df;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:28px 32px 8px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#6f6c68;">Standen</td>
          </tr>
          <tr>
            <td style="padding:8px 32px 0;font-size:28px;line-height:1.2;letter-spacing:-0.03em;color:#160f0c;">You're on the list, ${name}.</td>
          </tr>
          <tr>
            <td style="padding:16px 32px 0;font-size:16px;line-height:1.6;color:#5f5866;">Thanks for joining the free Agency Systems workshop waitlist.</td>
          </tr>
          <tr>
            <td style="padding:20px 32px 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f4f1;border-radius:8px;">
                <tr>
                  <td style="padding:16px 18px;font-size:14px;line-height:1.55;color:#222221;">
                    <strong style="display:block;margin-bottom:6px;color:#160f0c;">Your vote</strong>
                    ${process}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 0;font-size:16px;line-height:1.6;color:#5f5866;">
              <strong style="color:#160f0c;">What happens next</strong><br><br>
              1. We review waitlist responses and pick the first live build topic.<br>
              2. You will get another email within the next few days with your place on the list and what to expect.<br>
              3. When we go live, you get first access to the workshop, replay and full workflow breakdown.
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 32px;font-size:15px;line-height:1.6;color:#222221;">
              Tomas Jones<br>
              <span style="color:#6f6c68;">Founder, Standen</span>
            </td>
          </tr>
        </table>
        <p style="max-width:560px;margin:16px auto 0;font-size:12px;line-height:1.5;color:#8a8681;text-align:center;">
          You received this because you joined the waitlist at standen.io/waitlist.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `You're on the list, ${row.first_name}.

Thanks for joining the free Agency Systems workshop waitlist.

Your vote: ${processLabel(row)}

What happens next
1. We review waitlist responses and pick the first live build topic.
2. You will get another email within the next few days with your place on the list and what to expect.
3. When we go live, you get first access to the workshop, replay and full workflow breakdown.

Tomas Jones
Founder, Standen

You received this because you joined the waitlist at standen.io/waitlist.`;

  return { html, text, subject };
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function handleWaitlist(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    json(res, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  let payload;
  try {
    payload = await readBody(req);
  } catch {
    json(res, 400, { ok: false, error: "Invalid request body." });
    return;
  }

  if (payload && payload.action === "check_email") {
    try {
      const check = await emailExists(payload.email || payload.work_email || "");
      if (check.invalid) {
        json(res, 400, {
          ok: false,
          available: false,
          errors: { email: "Enter a valid email." },
        });
        return;
      }
      if (check.exists) {
        json(res, 200, {
          ok: true,
          available: false,
          errors: { email: "That email is already on the waitlist." },
        });
        return;
      }
      json(res, 200, { ok: true, available: true });
    } catch (err) {
      if (err.code === "CONFIG") {
        console.error(err.message);
        json(res, 503, { ok: false, error: "Waitlist is temporarily unavailable." });
        return;
      }
      console.error("Waitlist email check failed", err.code, err.detail || err);
      json(res, 500, { ok: false, error: "Could not check email. Please try again." });
    }
    return;
  }

  const result = validate(payload);
  if (result.honeypot) {
    json(res, 200, { ok: true });
    return;
  }
  if (result.errors) {
    json(res, 400, { ok: false, errors: result.errors });
    return;
  }

  try {
    await insertSignup(result.data);
  } catch (err) {
    if (err.code === "DUPLICATE") {
      json(res, 409, {
        ok: false,
        error: err.message,
        errors: { email: err.message },
      });
      return;
    }
    if (err.code === "CONFIG") {
      console.error(err.message);
      json(res, 503, { ok: false, error: "Waitlist is temporarily unavailable." });
      return;
    }
    console.error("Waitlist insert failed", err.code, err.detail || err);
    json(res, 500, { ok: false, error: "Could not save your signup. Please try again." });
    return;
  }

  try {
    await sendEmails(result.data);
  } catch (err) {
    console.error("Waitlist email failed", err);
  }

  json(res, 200, { ok: true });
}

module.exports = handleWaitlist;
module.exports.handleWaitlist = handleWaitlist;
module.exports.validate = validate;
module.exports.supabaseConfig = supabaseConfig;
module.exports.buildConfirmationEmail = buildConfirmationEmail;
module.exports.sendEmails = sendEmails;
module.exports.emailExists = emailExists;
