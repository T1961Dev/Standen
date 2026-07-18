import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pageShell, SITE, ROBOTS_INDEX, CALENDLY } from "./partials.mjs";
import { metaDescription } from "./seo-meta.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const PROCESSES = [
    "Client reporting",
    "Lead qualification",
    "Call QA",
    "Campaign setup",
    "Appointment handover",
    "Other",
];

const choices = PROCESSES.map(
    (p, i) => `<button type="button" class="wl-choice" data-process="${p}" aria-pressed="false">
                            <span class="wl-choice__n">${i + 1}</span>
                            <span class="wl-choice__label">${p}</span>
                        </button>`
).join("\n                        ");

const title = "Free AI Agency Systems Workshops | Standen";
const description = metaDescription(
    "Join Standen's free workshop series for founder-led B2B agencies and learn how to build AI-enabled internal delivery systems."
);
const canonical = `${SITE}/waitlist`;

const body = `
    <div class="wl-progress" aria-hidden="true"><span class="wl-progress__fill" id="wl-progress"></span></div>
    <div class="wl" id="wl" data-step="0">
        <form id="webinar-waitlist-form" novalidate>
            <div class="wl-hp" aria-hidden="true">
                <label for="company_website">Company website</label>
                <input type="text" id="company_website" name="company_website" tabindex="-1" autocomplete="off">
            </div>
            <input type="hidden" name="selected_process" id="selected_process" value="">

            <section class="wl-step hero is-on" data-panel="0" aria-labelledby="waitlist-heading">
                <div class="wrap wl-step__center">
                    <div class="hero-content">
                        <p class="hero-badge"><span class="nav-webinars__dot" aria-hidden="true"></span> Free live workshop series</p>
                        <h1 id="waitlist-heading">Build your first AI delivery system</h1>
                        <p class="hero-lead">Live workshops for founder-led B2B agencies looking to increase delivery capacity without immediately adding headcount.</p>
                        <div class="wl-row">
                            <button type="button" class="btn btn--accent btn--lg" data-go="next">
                                <span class="btn__text">Start</span>
                                <span class="btn__arrow" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M6.5 3.5 9 6 6.5 8.5" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
                            </button>
                        </div>
                        <p class="wl-fine">No date fixed yet. First access, replay and workflow breakdown for waitlist members.</p>
                    </div>
                </div>
            </section>

            <section class="wl-step hero" data-panel="1" hidden aria-labelledby="q-process">
                <div class="wrap wl-step__center">
                    <div class="hero-content">
                        <p class="module-tag wl-tag">Step 1 of 4</p>
                        <h2 id="q-process">Which process should we rebuild first?</h2>
                        <p class="hero-lead">Your vote helps choose what we build live.</p>
                        <div class="wl-choices" role="listbox" aria-label="Process">
                            ${choices}
                        </div>
                        <div class="wl-field" id="other-process-field" hidden>
                            <label for="other_process">Describe the process</label>
                            <input type="text" id="other_process" name="other_process" maxlength="280" placeholder="Type here...">
                            <p class="wl-err" id="error-other_process" hidden></p>
                        </div>
                        <p class="wl-err" id="error-selected_process" hidden></p>
                        <div class="wl-row">
                            <button type="button" class="btn btn--outline" data-go="back">Back</button>
                            <button type="button" class="btn btn--accent btn--lg" data-go="next"><span class="btn__text">Continue</span></button>
                        </div>
                    </div>
                </div>
            </section>

            <section class="wl-step hero" data-panel="2" hidden aria-labelledby="q-name">
                <div class="wrap wl-step__center">
                    <div class="hero-content">
                        <p class="module-tag wl-tag">Step 2 of 4</p>
                        <label for="first_name"><h2 id="q-name">What is your first name?</h2></label>
                        <div class="wl-field">
                            <input type="text" id="first_name" name="first_name" autocomplete="given-name" required maxlength="80" placeholder="Your first name">
                            <p class="wl-err" id="error-first_name" hidden></p>
                        </div>
                        <div class="wl-row">
                            <button type="button" class="btn btn--outline" data-go="back">Back</button>
                            <button type="button" class="btn btn--accent btn--lg" data-go="next"><span class="btn__text">Continue</span></button>
                        </div>
                    </div>
                </div>
            </section>

            <section class="wl-step hero" data-panel="3" hidden aria-labelledby="q-email">
                <div class="wrap wl-step__center">
                    <div class="hero-content">
                        <p class="module-tag wl-tag">Step 3 of 4</p>
                        <label for="email"><h2 id="q-email">What is your email?</h2></label>
                        <p class="hero-lead">We will send session details and your waitlist confirmation here.</p>
                        <div class="wl-field">
                            <input type="email" id="email" name="email" autocomplete="email" required maxlength="160" inputmode="email" placeholder="you@agency.com">
                            <p class="wl-err" id="error-email" hidden></p>
                        </div>
                        <div class="wl-row">
                            <button type="button" class="btn btn--outline" data-go="back">Back</button>
                            <button type="button" class="btn btn--accent btn--lg" id="wl-email-continue" data-go="check-email">
                                <span class="btn__text">Continue</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section class="wl-step hero" data-panel="4" hidden aria-labelledby="q-site">
                <div class="wrap wl-step__center">
                    <div class="hero-content">
                        <p class="module-tag wl-tag">Step 4 of 4</p>
                        <label for="agency_website"><h2 id="q-site">What is your agency website?</h2></label>
                        <div class="wl-field">
                            <input type="url" id="agency_website" name="agency_website" autocomplete="url" required maxlength="300" placeholder="https://youragency.com">
                            <p class="wl-err" id="error-agency_website" hidden></p>
                        </div>
                        <p class="wl-fine">Last step. Join the waitlist and we will email you within the next few days.</p>
                        <p class="wl-err" id="waitlist-form-error" role="alert" hidden></p>
                        <div class="wl-row">
                            <button type="button" class="btn btn--outline" data-go="back">Back</button>
                            <button type="submit" class="btn btn--accent btn--lg" id="waitlist-submit">
                                <span class="btn__text">Join the waitlist</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section class="wl-step hero" data-panel="5" hidden tabindex="-1" id="waitlist-success" aria-labelledby="q-done">
                <div class="wrap wl-step__center">
                    <div class="hero-content">
                        <p class="hero-badge"><span class="nav-webinars__dot" aria-hidden="true"></span> You're on the list</p>
                        <h2 id="q-done">You're in, <span id="wl-success-name">there</span>.</h2>
                        <p class="hero-lead" id="wl-success-lead">Thanks for joining. We will email you within the next few days with your place on the list.</p>
                        <p class="wl-recap" id="wl-recap" hidden></p>
                        <div class="wl-next">
                            <p class="module-tag">What happens next</p>
                            <ol class="wl-next__steps">
                                <li>We review waitlist responses and pick the first live build topic.</li>
                                <li>You get an email within the next few days with session details and what to expect.</li>
                                <li>When we go live, first access to the workshop, replay and full workflow breakdown.</li>
                            </ol>
                        </div>
                        <div class="wl-row">
                            <a href="/work.html" class="btn btn--outline">See recent work</a>
                            <a href="${CALENDLY}" class="btn btn--accent btn--lg" target="_blank" rel="noopener"><span class="btn__text">Book a call</span></a>
                        </div>
                    </div>
                </div>
            </section>
        </form>
    </div>`;

const html = pageShell({
    title,
    description,
    canonical,
    robots: ROBOTS_INDEX,
    bodyClass: "page-home page-waitlist",
    hideFooter: true,
    extraScripts: `
    <script src="/home.js"></script>
    <script src="/waitlist.js" defer></script>`,
    schema: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Free AI Agency Systems Workshops",
        description,
        url: canonical,
        isPartOf: { "@id": "https://www.standen.io/#website" },
        publisher: { "@id": "https://www.standen.io/#organization" },
    },
    body,
});

fs.writeFileSync(path.join(ROOT, "waitlist.html"), html, "utf8");
console.log("wrote waitlist.html");
