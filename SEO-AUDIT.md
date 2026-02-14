# SEO Audit — Standen (UK Software Development Agency)

**Auditor:** Senior SEO  
**Scope:** Full codebase and content for UK market  
**Business:** Hampshire-based; SaaS development + custom software; remote delivery; target UK founders, operators, SMEs.

---

## Executive summary

The site is structurally and strategically underbuilt for UK inbound. There are no dedicated service pages for the two revenue lines (SaaS development, custom software), so the site cannot rank for the queries that drive buying intent. The homepage blurs positioning with generic “web design and development” and leftover creative-agency copy (Creative design, Video & motion, “world’s top brands”). Trust is undermined by fake or borrowed social proof (Figma, Amazon, “500+ projects”) and anonymised case studies. Critical technical gaps—no sitemap, no robots.txt, heavy reliance on client-side rendering for blog and case studies—hurt crawlability and indexation. The contact form does not submit anywhere. UK and local signals are thin. Even with better rankings, conversion would suffer from weak proof, unclear “who this is for,” and no clear path for “SaaS” vs “custom software” buyers. Competitors like Made By Shape win on service clarity, depth, and proof. This audit is blunt: fix the fundamentals below or the site will continue to underperform.

---

## 1. Technical SEO

### 1.1 Page speed and Core Web Vitals

- **Fonts:** Google Fonts (Instrument Sans + Serif) loaded in `<head>` with `display=swap`. No `preload` for critical font files—render can block or shift. Four weights + italic increase payload. **Impact:** LCP/CLS risk.
- **CSS:** Single `style.css` (~2,000+ lines) on every page. No critical-CSS inlining, no minification evident. **Impact:** FCP/LCP on mobile.
- **JS:** Multiple scripts (script.js, blog.js, blog-data.js, case-study.js, case-study-data.js). Blog and case-study content depend on JS. **Impact:** TTI, possible LCP if content is perceived as main content.
- **Images:** All from `images.unsplash.com` (external). No `srcset`/`sizes`, no WebP/AVIF. Dimensions via query params (`w=800&h=600`) only. **Impact:** Wasted bandwidth, no responsive image optimisation, dependency on third-party availability.
- **No explicit resource hints** beyond preconnect for fonts. No preload for LCP image (hero or first case study).

### 1.2 Mobile performance

- Responsive layout and mobile nav exist. Large single CSS file and font payload still affect mobile. Touch targets and viewport are in place; no obvious tap-delay issues from audit.

### 1.3 HTML structure and semantic markup

- **index.html:** One `<h1>` (hero). Multiple `<h2>` (carousel, section titles). **Issue:** “Trusted by 500+ of the world's top brands” is an `<h2>` (carousel-heading) and is misleading—these are not clients. Section structure uses `<section>` with `aria-label`; good.
- **blog.html:** `<h1>` “The latest from our studio” is generic. Blog cards inject `<h2>` per card in JS—OK for hierarchy.
- **blog-post.html:** Main content is 100% JS-injected. No `<h1>` or article structure in static HTML. **Impact:** Crawlers that do not execute JS see an empty main and generic title.
- **case-study.html:** Same pattern. Static HTML has “Loading…”; real title and `<h1>` come from case-study.js. **Impact:** Indexation and snippet quality at risk.
- **resources.html:** Proper `<h1>`, `<h2>`, `<section>`, `<dl>` for FAQs. No major semantic issues.
- **privacy.html / terms.html:** Single `<h1>`, legal body. Adequate.

### 1.4 Heading hierarchy

- **Homepage:** H1 = “A web design and development agency in Hampshire.” Does not state “SaaS” or “custom software.” H2s mix value (“Built for fast-moving teams”) with vague (“The support your product team has been asking for”) and wrong (“Trusted by 500+ of the world's top brands”). “SUCCESS IN NUMBERS” section: “The best return on your investment” + “Startups, enterprises and mid-market companies trust Standen to deliver pixel-perfect creative, at scale”—creative/design language, not software.
- **Blog listing:** H1 “The latest from our studio” is non-keyword, non-intent.
- **Case study pages:** H1 is study title (good). Rendered only after JS.

### 1.5 Meta titles and descriptions

- **index.html:** Title “Standen | Web Development & SaaS Agency Hampshire UK.” Description includes “Web design and development,” “SaaS,” “MVP,” “custom software,” “£4,000,” “Hampshire & UK.” Reasonable but leans “web design” first.
- **blog.html:** “Blog | Standen — Web Development & SaaS Agency Hampshire UK.” Description OK.
- **blog-post.html:** Static title “Blog post | Standen — …”. Real title set in JS (`document.title = post.title + " | Blog | …"`). **Impact:** Crawlers may index generic “Blog post” and miss target keyword.
- **case-study.html:** Static “Case Study | Standen — …”. No meta description. Per-study title set in JS. **Impact:** All case studies can look identical to crawlers (generic title, no description).
- **resources.html:** Title and description present and relevant.
- **privacy.html / terms.html:** Title present; description minimal. Low priority for SEO.

**Missing:** Unique meta description per blog post and per case study in server-rendered or prerendered HTML. og:image absent site-wide—weak social and rich results.

### 1.6 Canonicals

- index: `https://standen.co.uk/`. blog: `https://standen.co.uk/blog.html`. resources: `https://standen.co.uk/resources.html`.  
- **case-study.html:** No canonical. **Impact:** Query-string URLs (e.g. `?id=fx-quant-research-platform`) can duplicate or fragment signals if other URL forms exist.
- **blog-post.html:** No canonical. **Impact:** Same for `?slug=...`.
- **privacy/terms:** No canonicals; low risk.

### 1.7 Indexation risks

- **JS-only content:** Blog list, blog post body, case study body and title are injected by script. If crawlers do not run JS or run it late, these URLs can be indexed with empty or generic content. **High risk** for blog-post and case-study.
- **Thin/placeholder content:** “Case study coming soon” x3 on homepage and in case-study-data.js (coming-soon-1/2/3). If indexed, they add no value and dilute topic focus.
- **Orphan risk:** blog-post.html and case-study.html are only linked from JS-rendered lists (blog grid, work grid). Discovery depends on crawler executing JS and following dynamic links.

### 1.8 Sitemap and robots

- **No sitemap.xml.** Crawlers are not guided to blog posts or case study URLs. **Critical.**
- **No robots.txt.** No disallows (none required at present), but no sitemap reference either. **Critical.**

### 1.9 URL structure

- **.html** extension used. Acceptable.
- **Query parameters:** `case-study.html?id=slug`, `blog-post.html?slug=slug`. Not clean URLs (e.g. `/case-studies/fx-quant-research-platform`). Readability and consistency weaker than competitors.
- **Fragments:** Homepage uses `#work`, `#process`, `#contact`. Fine for same-page UX; no SEO issue.

### 1.10 Duplicate content

- **Case studies:** Each has unique `id`; content in case-study-data.js is unique. Risk is low if canonicals and sitemap align to one URL per study.
- **Blog:** Same per post. Risk low.
- **Homepage sections:** “Who we are” and “Why Standen” are generic; could overlap with service pages if you add them—plan H1/H2 and internal links to avoid cannibalisation.

### 1.11 JavaScript rendering

- **blog.html:** List of posts is in blog.js (reads BLOG_POSTS, injects HTML). Crawler must run JS to see links to blog-post.html?slug=.
- **blog-post.html:** Full article (title, date, body) injected by blog.js. Without JS, main is empty.
- **case-study.html:** Full case study (title, problem, solution, testimonial, etc.) injected by case-study.js. Without JS, only “Loading…”.
- **Impact:** Google generally runs JS; Bing and others may be slower or lighter. Snippets and indexing can be delayed or incomplete. **Recommendation:** Pre-render or server-render at least title, meta, and main content for blog and case studies.

### 1.12 Image optimisation

- **Source:** All from Unsplash CDN. No self-hosting; no control over caching, formats, or availability.
- **Format/size:** URL params only (e.g. `w=800&h=600&fit=crop`). No WebP/AVIF, no srcset. Lazy loading used on work grid (`loading="lazy"`).
- **Alt:** Work cards have descriptive alt (e.g. “FX Quant Research Platform”). Blog cards (blog.js) use `alt=""`. Case study hero (case-study.js) uses `alt=""`. **Impact:** Accessibility and image SEO weakened; blog/case study images do not describe content.

### 1.13 Font loading

- Preconnect to fonts.googleapis.com and fonts.gstatic.com. Font CSS loaded in head with `display=swap`. No preload of the main font file. **Impact:** Text may reflow when fonts load (CLS) or delay FCP.

### 1.14 Lighthouse and critical issues

- Not run in this audit. From structure: **likely issues** — LCP (fonts, images, render-blocking CSS), CLS (fonts, possibly images without dimensions), and possibly “Content not indexed” or “Crawlable” if JS execution is assumed. Form submit to `action="#"` fails; no endpoint.

---

## 2. Positioning clarity failure

### 2.1 Two revenue lines not separated

- **SaaS development** and **custom software** are the stated revenue lines. There is **no dedicated page** for “SaaS development” or “Custom software.” The site cannot clearly rank for “SaaS development UK,” “SaaS development agency Hampshire,” “custom software development UK,” etc. All of that is crammed into the homepage and dropdowns.

### 2.2 Homepage blurs positioning

- **H1:** “A web design and development agency in Hampshire.” Primary headline does not say “SaaS” or “custom software.” “Web design” pulls design/creative intent, not software product intent.
- **Services section (index.html ~229–272):** “What we create for you” lists **Creative design**, **Video & motion**, **Web & product**, **Strategy & consulting** with copy like “Ad creative, social, branding,” “Video production, motion design,” “Marketing and campaign strategy.” This is **creative/agency** positioning, not software development. It contradicts the rest of the site and confuses both users and Google.
- **“Who we are”** and **“Work with the best”** mention “product team,” “web and SaaS,” but also “Creatives · Designers · Writers · Strategists” and “World-class talent with no borders.” Mixed agency and software messaging.

### 2.3 Who each service is for

- Nowhere does the site clearly say “SaaS development is for founders/product teams who want to build and launch a product” vs “Custom software is for businesses that need internal tools, integrations, or bespoke systems.” Dropdowns list “Web development,” “SaaS & web apps,” “MVP development,” “Custom software” but do not define audience or use case.

### 2.4 When to choose one over the other

- The blog post “When to build custom software vs use existing SaaS” (blog-data.js) touches this but is a single article. The main site does not guide the buyer: no comparison, no “Are you building a product (SaaS) or an internal tool (custom)?” clarity.

### 2.5 Confusing or conflicting sections

- **Carousel:** “Trusted by 500+ of the world's top brands” + Figma, Amazon, BCG, etc. These are not stated as clients. **Damages trust** and can be seen as misleading.
- **Stats:** “500+ projects,” “94% three-year ROI,” “6 months payback.” Unverifiable and creative-agency style. “Pixel-perfect creative, at scale” again suggests design/creative, not software.
- **“Only 3 slots left for Q1 2026”:** Urgency without proof. No connection to UK or service type.

### 2.6 Problem the site solves

- The site does not crisply state: “We build SaaS products for UK founders who need to ship fast” and “We build custom software for UK businesses that need tools and integrations.” Value proposition is generic (“fast, reliable delivery,” “we care”) and mixed with creative-agency language. A buyer searching “SaaS development Hampshire” gets a page that leads with “web design and development” and then creative services.

---

## 3. On-page SEO by page type

### 3.1 Homepage (index.html)

- **Primary keyword it should rank for:** “SaaS development agency UK” / “custom software development Hampshire” (or similar). It currently targets “web design and development agency Hampshire” in H1 and meta.
- **Intent:** Commercial/investigative. Homepage should convert researchers and early buyers. It does not clearly segment SaaS vs custom or speak to “founder” vs “operations director.”
- **H1:** Wrong priority. Should lead with SaaS and/or custom software for UK/Hampshire.
- **Sections that add no ranking or conversion value:** Services grid (Creative design, Video & motion, etc.)—wrong business. Carousel “Trusted by 500+…”—fake or borrowed. “World-class talent with no borders”—vague and not UK-specific. Stats block—unverifiable. “Only 3 slots left”—unsubstantiated.
- **Missing:** UK-specific proof (client names, locations, “delivered for X in Hampshire”), clear CTAs per intent (e.g. “Start a SaaS project” vs “Discuss custom software”).

### 3.2 SaaS service pages

- **Do not exist.** There is no /saas-development, /saas-development-uk, /mvp-development, or equivalent. **Primary keyword:** e.g. “SaaS development UK,” “SaaS development agency Hampshire,” “MVP development UK.” **Impact:** Site cannot rank for these. **Critical gap.**

### 3.3 Custom software service pages

- **Do not exist.** No /custom-software, /custom-software-development-uk, or equivalent. **Primary keyword:** e.g. “custom software development UK,” “bespoke software Hampshire.” **Impact:** Same. **Critical gap.**

### 3.4 Case studies (case-study.html + case-study-data.js)

- **Primary keyword per page:** e.g. “[Client/Project] case study,” “SaaS case study UK.” Each URL is generic (case-study.html?id=...) with study-specific title only in JS. No per-URL meta description or canonical.
- **Intent:** Proof and consideration. Case studies are strong for conversion but **client names are anonymised** (“Quantitative Research Client,” “Property Investment Firm,” “Marketing Agency,” “Trading Desk,” “B2B Marketing Team”). One real name (Justin, Terrapin Stucco) and one product (Scrapr.io / Standen) appear. **Trust and local relevance are weak.**
- **Content:** Problem/solution/stack/testimonial are good. Rendered only by JS—indexation risk.
- **Missing:** Real client names and UK location where possible, schema (Article or CaseStudy), clear “SaaS” vs “Custom software” tagging so Google and users can filter.

### 3.5 Blog (blog.html, blog-post.html, blog-data.js)

- **blog.html:** H1 “The latest from our studio” is non-keyword. List is JS-rendered. Only 4 posts. **Primary keyword:** e.g. “SaaS development blog UK,” “MVP development insights.” Not targeted in title or H1.
- **blog-post.html:** Each post has a good title in data (e.g. “How to scope a SaaS MVP that actually ships,” “Web development in Hampshire: what to expect”). But static HTML has no meta description, no og:image, and empty main. Title is set in JS. **Intent:** Informational/consideration. Content is solid; **delivery is wrong** for SEO (JS-only).
- **Missing:** Per-post meta description and canonical in HTML, server-side or pre-rendered body for crawlers, FAQ or schema where relevant.

### 3.6 Contact page

- **Section id="contact"** on homepage. No separate /contact page. **Primary keyword:** “Contact Standen,” “Get in touch Standen Hampshire”—low volume but fine.
- **Form:** `action="#"` and `method="post"`. **Form does not submit anywhere.** **Impact:** Zero conversions from form; severe conversion failure.
- **Copy:** “Tell us about your idea. We'll get back to you within 24 hours.” Adequate. No UK-specific reassurance (e.g. “We work with UK businesses remotely”).

---

## 4. Information architecture

### 4.1 Page hierarchy

- **Flat:** index, blog, blog-post (query), resources, privacy, terms, case-study (query). No /services, /saas-development, /custom-software, /case-studies (listing), /about. **Authority is concentrated on homepage;** no clear hub for “SaaS” or “custom software” or “work.”

### 4.2 Navigation

- **Nav:** Services (dropdown → #work, #process), Our work (dropdown → #work + case-study URLs), Resources (dropdown → blog, resources), Process, Blog. No link to dedicated service pages (they do not exist). Footer repeats Work, Process, Contact, Blog, Resources. **No link to “SaaS” or “Custom software” as landing pages.**

### 4.3 Internal linking

- **Homepage → work:** #work (section). **Homepage → case studies:** Links to case-study.html?id=... in work grid (good). **Blog listing → posts:** Links in JS only. **Case study pages:** Link back to index.html#work. **Resources:** Links to blog.html (generic). No deep links to specific blog posts or “SaaS”/“custom” content from homepage.
- **Orphan risk:** blog-post.html and case-study.html are only reachable via JS-rendered lists. If JS is not run, they are effectively orphaned.

### 4.4 Link depth

- All key content is 1–2 clicks from homepage. Depth is not the issue; **missing hub pages** (e.g. /saas-development, /custom-software) and **JS-only links** are.

### 4.5 Crawl paths

- Without sitemap, crawlers depend on following links from index, blog, resources. Blog list and work grid are JS-rendered; discovery of blog-post and case-study URLs is JS-dependent. **Crawl path is fragile.**

### 4.6 Authority dilution and cannibalisation

- **Dilution:** One long homepage tries to cover “who we are,” “why us,” “services” (wrong ones), “work,” “testimonials,” “process,” “stats,” “CTA,” “contact.” No dedicated service or category pages to target distinct keywords. **Cannibalisation:** Not yet an issue because there are no competing service pages; the risk is adding “SaaS” and “custom software” pages later without clear internal linking and H1/H2 strategy.

### 4.7 Structural confusion for Google

- Google sees: a “web design and development” homepage with creative services, case study URLs with query params and JS-only content, and a blog with JS-only list and posts. No clear content pillars (SaaS vs custom vs process vs proof). **Topic and intent are mixed.**

---

## 5. Content and intent failure

### 5.1 Target audience

- **Stated target:** UK founders, operators, SMEs. **Content:** Often generic (“we care,” “fast delivery”) or agency (“creatives, designers, writers”). No consistent “you’re a founder building a product” or “you’re a business needing a tool” narrative. **Decision-makers are not clearly addressed.**

### 5.2 Trust and proof

- **Testimonials:** Some named (Justin/Terrapin Stucco), most anonymised. **Case study clients:** Mostly anonymised. **Carousel:** Global brands, not stated as clients—**trust damage.** **Stats:** Unverifiable. Trust is not earned fast enough for a cold UK visitor.

### 5.3 Pages to delete (or radically change)

- **Services section (Creative design, Video & motion, Web & product, Strategy):** Delete or replace with **SaaS development** and **Custom software** (and optionally Web/MVP as sub-offers). As-is, it confuses and misrepresents the business.
- **Carousel “Trusted by 500+…”:** Remove or replace with **real** UK/client logos or remove entirely.
- **“World-class talent with no borders” / “Creatives · Designers · Writers”:** Remove or rewrite for software/product team. Same for “pixel-perfect creative” in stats.

### 5.4 Pages to rewrite

- **Homepage:** H1 and hero for SaaS + custom software, UK/Hampshire. Remove creative services. Strengthen UK proof and clear CTAs. **Process** and **Contact** sections are keepers; tighten copy.
- **blog.html:** H1 and intro for “SaaS and custom software insights” or similar; keyword and intent-led.

### 5.5 Pages to split

- **Homepage:** Do not split into many pages; instead **add** two: **/saas-development** (or /services/saas-development) and **/custom-software** (or /services/custom-software). Move service-level messaging and “who it’s for” there; homepage should summarise and link.

### 5.6 Pages to create immediately

1. **SaaS development** (e.g. /saas-development or /services/saas-development): For “SaaS development UK,” “SaaS development agency Hampshire,” “MVP development.” Who it’s for (founders, product teams), what you deliver, proof (case studies tagged SaaS/MVP), CTA.
2. **Custom software development** (e.g. /custom-software or /services/custom-software): For “custom software development UK,” “bespoke software Hampshire.” Who it’s for (businesses, ops), what you deliver (integrations, internal tools), proof (case studies tagged custom), CTA.
3. **Case studies listing** (e.g. /case-studies): Static page listing all case studies with filters or clear SaaS vs custom tagging. Helps crawl and UX; can target “SaaS case studies UK” etc.
4. **About** (e.g. /about): Team, location (Hampshire), remote delivery, UK focus. Supports E-E-A-T and local queries.
5. **Contact** as its own page (e.g. /contact): Same form and copy, but dedicated URL. Canonical from #contact if you keep both. Enables “contact Standen Hampshire” and clear conversion tracking.

---

## 6. UK and local SEO

### 6.1 UK signals in copy

- **Present:** “Hampshire,” “UK,” “across the UK,” “£4,000,” “en-GB,” geo.region GB-HAM, schema areaServed. **Weak:** “World-class talent with no borders” and “global” tone in places. Carousel is international brands. **Missing:** Consistent “UK-based,” “working with UK businesses,” “remote across the UK” in hero and key sections.

### 6.2 Location references

- Hampshire in meta, H1, schema. No address, no “based in Hampshire” or “serving Hampshire and the UK” in visible hero/footer. No embedded map or location page. **Impact:** Local and “near me” potential underused.

### 6.3 Trust indicators

- No client logos (real), no “As seen in” or awards, no review schema or Google Business Profile mention. One schema (ProfessionalService) is good; no LocalBusiness or more detailed org schema. **Impact:** UK searchers have little to latch onto.

### 6.4 GBP and language

- **GBP:** Not referenced on site. If the business has a Google Business Profile, it should be linked and consistent (name, address, area). **Language:** en-GB, GBP in copy. Consistent.

### 6.5 Proof of UK delivery

- Case studies do not state “UK client” or “Hampshire.” Testimonials rarely say location. **Impact:** UK relevance is assumed, not proven. Weakens UK rankings and quality of inbound.

---

## 7. Conversion alignment

### 7.1 CTAs

- “Start a project,” “Book a call,” “Get in touch,” “View our work.” **Good:** Clear and repeated. **Bad:** No differentiation by intent (SaaS vs custom). No “Book a SaaS discovery call” or “Discuss your custom software project.”

### 7.2 Forms

- **Contact form:** `action="#"`, `method="post"`. **Does not submit.** No backend, no thank-you page, no email or CRM. **Impact:** 100% form abandonment; zero leads from form. **Critical.**

### 7.3 Friction

- Single long form (name, email, budget, message). Budget dropdown is good. No phone or calendar link. Optional: reduce fields or add “What do you need?” (SaaS / Custom / Not sure) to route leads.

### 7.4 Proof placement

- Testimonials and case studies sit mid-page. First screen is hero + CTA; second screen is carousel (fake proof). **Impact:** High-intent visitors may leave before seeing real proof. Move 1–2 strong UK/client quotes or case study snippets above the fold or immediately after hero.

### 7.5 Case study usage

- Case studies exist and are linked from work grid and dropdown. They are not used as conversion drivers next to CTAs (e.g. “See how we built X — get a similar proposal”). No “SaaS case studies” vs “Custom software case studies” filtering. **Impact:** Proof is underused for conversion.

### 7.6 Why traffic would not convert even with better rankings

- **Form does not work.**  
- **Positioning is blurred** (web design vs SaaS vs custom).  
- **Proof is weak or fake** (carousel, anonymised clients, unverifiable stats).  
- **No clear next step** for “I need SaaS” vs “I need custom software.”  
- **UK trust signals** are light (no address, no real client locations, no reviews).  

Fixing rankings without fixing these will not fix conversion.

---

## 8. Competitor comparison (structural)

- **Made By Shape (reference):** Clear service pages (Web Design, Craft CMS, Branding, SEO, Shopify), Work/About/Blog/Contact, case studies with real names and outcomes, location (Manchester), culture and team. **Standen:** One homepage, no service pages, mixed creative/software messaging, anonymised case studies, thin blog, no about. **Standen loses on:** service depth, intent coverage (no SaaS/custom pages), proof density (fewer real names, no clear tagging), and structural clarity. **Result:** Google can rank Made By Shape for specific services and intents; Standen competes on a single, blurred homepage.

---

## 9. Priority-ordered issue list (summary)

1. **Contact form does not submit** (action="#") — conversion zero.  
2. **No sitemap.xml or robots.txt** — crawl and indexation risk.  
3. **No dedicated SaaS development or Custom software pages** — cannot rank for main commercial keywords.  
4. **Blog and case study content is JS-only** — indexation and snippet risk.  
5. **Homepage H1 and Services section** — wrong keywords and wrong business (creative vs software).  
6. **Fake or misleading proof** — carousel “500+ brands,” unverifiable stats — trust and brand risk.  
7. **Case study and blog-post meta** — no per-URL description/canonical/og; titles set only in JS.  
8. **No og:image site-wide** — weak social and SERP.  
9. **Anonymised case studies** — weak UK and trust signals.  
10. **Images:** external Unsplash, no WebP/srcset, empty alt on blog/case study images.  
11. **Fonts and CSS** — no preload, single large CSS; LCP/CLS risk.  
12. **case-study.html** — nav links to #pricing (dead), “Book a demo,” footer privacy/terms to #.  
13. **URLs** — query params only for case studies and blog posts; not human- or SEO-optimal.  
14. **UK/local** — no address, no GBP link, no “UK client” or location in case studies.  
15. **Thin/placeholder content** — “Case study coming soon” x3; consider noindex or remove from indexable flow.

---

## 10. Top 10 fixes that move rankings fastest

1. **Add sitemap.xml** and reference it in **robots.txt**. Include index, blog, resources, all case-study and blog-post URLs (with chosen canonical form).  
2. **Create /saas-development** (or /services/saas-development)**: H1 “SaaS Development UK” (or “SaaS Development Agency Hampshire”), who it’s for, what you deliver, case studies (SaaS/MVP), CTA. Target “SaaS development UK,” “SaaS development agency Hampshire,” “MVP development UK.”  
3. **Create /custom-software** (or /services/custom-software)**: H1 “Custom Software Development UK” (or “Bespoke Software Hampshire”), who it’s for, what you deliver, case studies (custom), CTA. Target “custom software development UK,” “bespoke software Hampshire.”  
4. **Rewrite homepage H1 and hero** to lead with SaaS and custom software for UK/Hampshire; remove or replace “web design and development” as primary.  
5. **Remove or replace the Services section** that sells Creative design, Video & motion, etc., with two clear links/teasers to SaaS development and Custom software (and optionally Web/MVP).  
6. **Pre-render or server-render** blog-post and case-study pages so title, meta description, and main content are in the initial HTML. Minimum: static fallback or prerender for crawlers so each URL has unique title, description, and body.  
7. **Add unique meta description and canonical** for every blog post and case study (in HTML or server-rendered). Set og:title and og:description per page; add **og:image** site-wide (and per post/study if possible).  
8. **Fix or remove social proof:** Either replace “Trusted by 500+…” carousel with real client logos/names or remove it. Replace unverifiable stats (“500+ projects,” “94% ROI”) with verifiable ones or remove.  
9. **Internal linking:** From homepage and nav, link to /saas-development and /custom-software. From those pages, link to relevant case studies and blog posts. Add a /case-studies listing page and link to it.  
10. **UK and local:** Add “Based in Hampshire,” “We work with UK businesses remotely,” and where possible “UK client” or location in case studies. Link to Google Business Profile if you have one; add address in footer if appropriate.

---

## 11. Top 5 pages to build or rebuild first

1. **/saas-development** (new): Dedicated SaaS (and MVP) service page. Primary keywords, who it’s for, proof, CTA.  
2. **/custom-software** (new): Dedicated custom software service page. Same structure.  
3. **Homepage (rebuild):** H1 and hero for SaaS + custom software UK/Hampshire; remove creative services block; strengthen UK proof and CTAs; keep process, contact, and work grid but align copy.  
4. **Case study template (rebuild):** So each case study URL has server-rendered or prerendered HTML with unique title, meta description, canonical, and main content; add “SaaS” or “Custom” and UK/client location where possible.  
5. **Blog post template (rebuild):** Same: unique title, meta description, canonical, and article body in initial HTML; add og:image per post if possible.  

Then: **Fix the contact form** (backend, thank-you page, or replace with mailto/Calendly) so that every other improvement can actually convert.

---

*End of audit. No softening: the site underperforms on structure, positioning, proof, and conversion. Implement the top 10 fixes and the 5 page builds/rebuilds first; then iterate on technical performance, images, and UK/local depth.*
