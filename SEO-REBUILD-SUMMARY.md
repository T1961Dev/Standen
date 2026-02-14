# SEO corrective rebuild — implementation summary

**Date:** 31 January 2026  
**Scope:** Structural, SEO and conversion fix for Standen (UK software development agency). No aesthetic redesign; focus on structure, clarity, SEO and conversion.

---

## Files created

| File | Purpose |
|------|--------|
| `case-studies.html` | Case studies index: static list of 6 case studies with SaaS/Custom Software labels |
| `case-studies/fx-quant-research-platform.html` | Static case study page |
| `case-studies/real-estate-property-prediction.html` | Static case study page |
| `case-studies/scrapr-io.html` | Static case study page |
| `case-studies/instagram-lead-scraper.html` | Static case study page |
| `case-studies/crypto-news-scraper.html` | Static case study page |
| `case-studies/lead-magnet-generator.html` | Static case study page |
| `blog/how-to-scope-a-saas-mvp.html` | Static blog post |
| `blog/web-development-hampshire-what-to-expect.html` | Static blog post |
| `blog/when-to-build-custom-software-vs-saas.html` | Static blog post |
| `blog/rapid-delivery-without-cutting-corners.html` | Static blog post |
| `sitemap.xml` | Sitemap including homepage, service pages, case studies, blog, legal |
| `robots.txt` | References sitemap; allows all crawlers |

**Note:** `saas-development-uk.html`, `custom-software-development-uk.html`, `about.html`, `contact.html`, `contact-thank-you.html` were created in an earlier phase of this rebuild.

---

## Files modified

| File | Changes |
|------|--------|
| `index.html` | Hero H1/subheading/CTAs; nav/footer to direct links; removed carousel, creative copy, fake stats; services = 2 cards (SaaS, Custom Software); work = 3 case study summaries; testimonials = 2 real only; removed stats section; contact = link to contact page; meta/og/schema updated |
| `blog.html` | Nav/footer updated; H1 "Insights on SaaS and software delivery"; static blog list (no JS); og/canonical; removed blog-data.js, blog.js |
| `resources.html` | Nav/footer updated; resource cards link to `blog/slug.html` |
| `privacy.html` | Nav/footer updated; og tags added |
| `terms.html` | Nav/footer updated; og tags added |
| `style.css` | `.hero-ctas`, `.work-tag`, `.case-study-filters`, `.btn-outline--small`; `.section-block`, `.section-heading`, `.section-list`, `.case-study-links` for service/case study pages |

---

## Structural changes

1. **URLs**
   - Service pages: `/saas-development-uk` → `saas-development-uk.html`, `/custom-software-development-uk` → `custom-software-development-uk.html`
   - Case studies: `/case-studies` → `case-studies.html`; individual studies → `case-studies/slug.html` (no query params)
   - Blog posts: `blog/slug.html` (no query params)
   - Contact: `contact.html`; thank you: `contact-thank-you.html`

2. **Navigation**
   - All primary pages use the same nav: SaaS Development, Custom Software, Case studies, About, Blog, Contact. CTA: "Get in touch" → `contact.html`
   - No anchor-based service navigation (`#work`, `#process`) for services; all links go to dedicated pages.

3. **Homepage**
   - H1: "SaaS and Custom Software Development Agency in the UK"
   - Subheading and CTAs focus on SaaS and custom software; CTAs: "Build a SaaS product", "Discuss custom software" → `contact.html`
   - "Trusted by 500+ brands" carousel removed
   - Services: two cards only (SaaS Development, Custom Software), each linking to its service page
   - Proof: three case study cards (FX Quant, Real Estate, Scrapr.io) linking to `case-studies/slug.html`; no "coming soon"
   - Testimonials: two real (Peeker AI, Terrapin Stucco); TechFlow and unverifiable metrics removed
   - "Success in Numbers" (500+, 94% ROI, etc.) removed
   - All creative-agency language (creative, designers, writers, video, motion, pixel-perfect creative) removed or replaced with software-delivery copy
   - Contact section: link to contact page instead of inline form

4. **Case studies**
   - Six real case studies as static HTML under `case-studies/`. Each has: title, problem, solution, tech stack, outcome, type (SaaS/Custom), UK mention where applicable
   - Index at `case-studies.html` with static list and SaaS/Custom labels
   - No JS-dependent content; no `case-study.html?id=slug` for primary discovery

5. **Blog**
   - Four posts as static HTML under `blog/`. Each has unique meta title, meta description, canonical
   - `blog.html` shows a static list (no JS) linking to `blog/slug.html`

6. **Technical SEO**
   - `sitemap.xml` includes all key pages
   - `robots.txt` allows all and references sitemap
   - Canonicals and og:title, og:description, og:image (site-wide where applicable)
   - Alt text added for meaningful images (case study cards, blog cards)

7. **Conversion**
   - Dedicated `contact.html` with form: Name, Email, Company, Project type (SaaS / Custom Software / Not sure), Message
   - Form posts to Formspree; redirect to `contact-thank-you.html` on success
   - Thank you page: noindex, confirmation message, links back to home and case studies

---

## Assumptions

- **Form handling:** Form submissions go to Formspree. You must replace `YOUR_FORMSPREE_ID` in `contact.html` with your real Formspree form ID.
- **og:image:** All og:image tags use `https://standen.co.uk/og-image.jpg`. You need to add a real image at that path (e.g. 1200×630) or update the meta tags.
- **Static hosting:** No server-side redirects. Old URLs (`case-study.html?id=slug`, `blog-post.html?slug=slug`) are not redirected. If you want 301s, configure them in your host (e.g. Netlify, Vercel, Apache, Nginx).
- **Case study images:** Case study and blog images still use Unsplash URLs with descriptive alt text. The audit suggested replacing proof imagery with self-hosted or neutral assets; you can swap the `src` and keep the same alt text.
- **Case study filter:** The "Filter: SaaS / Custom Software / All" links on `case-studies.html` are present but do not run JavaScript; the list is static and each card is already labeled. Filtering can be added later with JS if desired.

---

## Remaining blockers / manual steps

1. **Formspree:** In `contact.html`, set `action="https://formspree.io/f/YOUR_FORMSPREE_ID"` to your actual Formspree form ID. Optionally set `_next` to your live domain if different from `https://standen.co.uk`.
2. **og-image.jpg:** Create and upload `og-image.jpg` (recommended 1200×630) to the site root, or change all `og:image` meta tags to the URL you use.
3. **Optional redirects:** To avoid duplicate signals, add 301 redirects: `case-study.html?id=*` → `case-studies/*.html`, `blog-post.html?slug=*` → `blog/*.html`.
4. **Calendly (optional):** If you want a booking link, add a Calendly embed or button on `contact.html` alongside the form.

---

## What was not done

- No visual/design overhaul; only changes needed for positioning and SEO
- No new marketing copy or new blog/case study content beyond what existed
- Unsplash images kept; only alt text and structure updated (self-hosted swap left to you)
- No new features beyond the listed structural and conversion fixes

All phases (1–7) from the brief are implemented as above.
