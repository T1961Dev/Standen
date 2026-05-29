(function () {
    "use strict";

    function escapeHtml(str) {
        if (!str) return "";
        var div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }

    function escapeAttr(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function imageSrc(path) {
        if (!path) return "";
        if (/^https?:\/\//.test(path) || path.charAt(0) === "/") return path;
        return "/" + path;
    }

    function listHtml(items) {
        if (!items || !items.length) return "";
        return items.map(function (item) {
            return (
                "<li>" +
                "  <span class=\"case-study__check\" aria-hidden=\"true\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\"><path d=\"M3 8l3 3 7-7\" stroke=\"currentColor\" stroke-width=\"1.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg></span>" +
                "  <span>" + escapeHtml(item) + "</span>" +
                "</li>"
            );
        }).join("");
    }

    function pillHtml(items) {
        if (!items || !items.length) return "";
        return items.map(function (item) {
            return "<span class=\"case-study__pill\">" + escapeHtml(item) + "</span>";
        }).join("");
    }

    function bindReveal() {
        var nodes = document.querySelectorAll("#case-study-root .reveal");
        if (!nodes.length) return;

        if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            nodes.forEach(function (el) { el.classList.add("is-visible"); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -48px 0px" });

        nodes.forEach(function (el) { observer.observe(el); });
    }

    function finalCtaHtml() {
        return (
            "<section class=\"final-cta\" aria-labelledby=\"case-study-cta-heading\">" +
            "  <div class=\"wrap\">" +
            "    <h2 id=\"case-study-cta-heading\">Have a workflow your agency has outgrown?</h2>" +
            "    <p>Book a short call. We&rsquo;ll map the simplest system worth building first.</p>" +
            "    <a href=\"https://calendly.com/standen/discovery-call\" class=\"btn btn--accent btn--lg\" target=\"_blank\" rel=\"noopener\"><span class=\"btn__text\">Book a Free Consultation</span><span class=\"btn__arrow\" aria-hidden=\"true\"><svg width=\"12\" height=\"12\" viewBox=\"0 0 12 12\" fill=\"none\"><path d=\"M2.5 6h7M6.5 3.5 9 6 6.5 8.5\" stroke=\"currentColor\" stroke-width=\"1.35\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg></span></a>" +
            "  </div>" +
            "</section>"
        );
    }

    var STATIC_STUDY_URLS = {
        ohmypod: "/case-studies/ohmypod.html",
        "fx-quant-research-platform": "/case-studies/fx-quant-research-platform.html",
        "real-estate-property-prediction": "/case-studies/real-estate-property-prediction.html",
        "scrapr-io": "/case-studies/scrapr-io.html",
        "instagram-lead-scraper": "/case-studies/instagram-lead-scraper.html",
        "crypto-news-scraper": "/case-studies/crypto-news-scraper.html",
        "lead-magnet-generator": "/case-studies/lead-magnet-generator.html"
    };

    var data = window.CASE_STUDIES;
    var root = document.getElementById("case-study-root");
    if (!data || !root) return;

    var params = new URLSearchParams(window.location.search);
    var id = params.get("id") || "";

    if (STATIC_STUDY_URLS[id]) {
        window.location.replace(STATIC_STUDY_URLS[id]);
        return;
    }

    var study = data[id];

    if (!study) {
        root.innerHTML =
            "<article class=\"case-study case-study--empty\">" +
            "  <div class=\"wrap\">" +
            "    <header class=\"case-study__head\">" +
            "      <a href=\"/work.html\" class=\"case-study__back text-link\">All case studies <span aria-hidden=\"true\">&gt;</span></a>" +
            "      <p class=\"notes-meta case-study__meta\">Case study</p>" +
            "      <h1>Case study not found</h1>" +
            "      <p class=\"case-study__lead\">This case study does not exist yet. Head back to the work grid to choose another project.</p>" +
            "      <div class=\"case-study__actions\">" +
            "        <a href=\"/work.html\" class=\"btn btn--outline\">View all case studies</a>" +
            "      </div>" +
            "    </header>" +
            "  </div>" +
            "</article>" +
            finalCtaHtml();
        document.title = "Case Study Not Found | Standen";
        return;
    }

    var heroClass = "case-study__hero";
    if (study.imageMode === "logo") heroClass += " case-study__hero--logo";

    var imageHtml = study.image
        ? "<div class=\"" + heroClass + " reveal\">" +
          "  <img src=\"" + escapeAttr(imageSrc(study.image)) + "\" alt=\"" + escapeAttr(study.imageAlt || study.title) + "\" loading=\"eager\" decoding=\"async\">" +
          "</div>"
        : "";

    var liveLink = study.liveUrl
        ? "<a href=\"" + escapeAttr(study.liveUrl) + "\" class=\"btn btn--outline\" target=\"_blank\" rel=\"noopener\">View live product <span aria-hidden=\"true\">&gt;</span></a>"
        : "";

    var testimonial = study.testimonial
        ? "<blockquote class=\"case-study__quote reveal\">" +
          "  <p>&ldquo;" + escapeHtml(study.testimonial.quote) + "&rdquo;</p>" +
          "  <footer>" + escapeHtml(study.testimonial.author) + (study.testimonial.role ? " <span>·</span> " + escapeHtml(study.testimonial.role) : "") + "</footer>" +
          "</blockquote>"
        : "";

    var servicesLabel = (study.services || []).slice(0, 2).join(" / ");

    root.innerHTML =
        "<article class=\"case-study\" aria-labelledby=\"case-study-title\">" +
        "  <div class=\"wrap\">" +
        "    <header class=\"case-study__head\">" +
        "      <a href=\"/work.html\" class=\"case-study__back text-link\">All case studies <span aria-hidden=\"true\">&gt;</span></a>" +
        "      <p class=\"notes-meta case-study__meta\">" + escapeHtml(study.eyebrow || "Custom software") + " <span>·</span> " + escapeHtml(study.timeline || "Scoped sprint") + "</p>" +
        "      <h1 id=\"case-study-title\">" + escapeHtml(study.title) + "</h1>" +
        "      <p class=\"case-study__lead\">" + escapeHtml(study.summary || "") + "</p>" +
        "      <div class=\"case-study__actions\">" +
        "        <a href=\"https://calendly.com/standen/discovery-call\" class=\"btn btn--accent\" target=\"_blank\" rel=\"noopener\"><span class=\"btn__text\">Book a Free Consultation</span><span class=\"btn__arrow\" aria-hidden=\"true\"><svg width=\"12\" height=\"12\" viewBox=\"0 0 12 12\" fill=\"none\"><path d=\"M2.5 6h7M6.5 3.5 9 6 6.5 8.5\" stroke=\"currentColor\" stroke-width=\"1.35\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg></span></a>" +
               liveLink +
        "      </div>" +
        "    </header>" +
             imageHtml +
        "  </div>" +
        "  <div class=\"wrap case-study__content\">" +
        "    <div class=\"case-study__stats reveal\">" +
        "      <div><span>Client</span><strong>" + escapeHtml(study.client || "Custom project") + "</strong></div>" +
        "      <div><span>Timeline</span><strong>" + escapeHtml(study.timeline || "Scoped sprint") + "</strong></div>" +
        "      <div><span>Services</span><strong>" + escapeHtml(servicesLabel || "Custom build") + "</strong></div>" +
        "    </div>" +
        "    <div class=\"case-study__grid reveal\">" +
        "      <section class=\"case-study__card\">" +
        "        <div class=\"case-study__card__top\"><span class=\"module-tag\">The challenge</span></div>" +
        "        <p>" + escapeHtml(study.problem || "") + "</p>" +
        "      </section>" +
        "      <section class=\"case-study__card\">" +
        "        <div class=\"case-study__card__top\"><span class=\"module-tag\">What we delivered</span></div>" +
        "        <p>" + escapeHtml(study.solution || "") + "</p>" +
        "      </section>" +
        "    </div>" +
        "    <div class=\"case-study__grid case-study__grid--split reveal\">" +
        "      <section class=\"case-study__card case-study__card--surface\">" +
        "        <div class=\"case-study__card__top\"><span class=\"module-tag\">Results</span></div>" +
        "        <ul class=\"case-study__results\">" + listHtml(study.results) + "</ul>" +
        "      </section>" +
        "      <section class=\"case-study__card\">" +
        "        <div class=\"case-study__card__top\"><span class=\"module-tag\">Stack and workflow</span></div>" +
        "        <div class=\"case-study__pills\">" + pillHtml(study.stack) + "</div>" +
        "      </section>" +
        "    </div>" +
             testimonial +
        "  </div>" +
        "</article>" +
        finalCtaHtml();

    document.title = study.title + " | Case Study | Standen";

    var desc = document.querySelector('meta[name="description"]');
    if (!desc) {
        desc = document.createElement("meta");
        desc.name = "description";
        document.head.appendChild(desc);
    }
    desc.content = study.summary || "";

    bindReveal();
})();
