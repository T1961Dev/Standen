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

    function listHtml(items) {
        if (!items || !items.length) return "";
        return items.map(function (item) { return "<li>" + escapeHtml(item) + "</li>"; }).join("");
    }

    function pillHtml(items) {
        if (!items || !items.length) return "";
        return items.map(function (item) { return "<span>" + escapeHtml(item) + "</span>"; }).join("");
    }

    var data = window.CASE_STUDIES;
    var root = document.getElementById("case-study-root");
    if (!data || !root) return;

    var params = new URLSearchParams(window.location.search);
    var id = params.get("id") || "";
    var study = data[id];

    if (!study) {
        root.innerHTML =
            "<section class=\"detail-hero detail-hero--missing\">" +
            "  <div class=\"mx-auto max-w-3xl px-5 text-center sm:px-8\">" +
            "    <p class=\"section-label mx-auto mb-6 text-white/58\">Case study</p>" +
            "    <h1 class=\"title-lg font-semibold text-white\">Case study not found.</h1>" +
            "    <p class=\"body-copy-dark mx-auto mt-6 max-w-xl text-lg\">This case study does not exist yet. Head back to the work grid to choose another project.</p>" +
            "    <a href=\"/#work\" class=\"btn btn-light mt-9\">View all case studies</a>" +
            "  </div>" +
            "</section>";
        document.title = "Case Study Not Found | Standen";
        return;
    }

    var imageClass = study.imageMode === "logo" ? "detail-image detail-image--logo" : "detail-image";
    var imageHtml = study.image
        ? "<div class=\"detail-visual\" style=\"--case-glow: " + escapeAttr(study.glow || "rgba(89,39,255,.34)") + ";\">" +
          "  <img class=\"" + imageClass + "\" src=\"" + escapeAttr(study.image) + "\" alt=\"" + escapeAttr(study.imageAlt || study.title) + "\" loading=\"eager\">" +
          "</div>"
        : "";
    var liveLink = study.liveUrl ? "<a href=\"" + escapeAttr(study.liveUrl) + "\" class=\"btn btn-ghost-light\" target=\"_blank\" rel=\"noopener\">View live product</a>" : "";
    var testimonial = study.testimonial
        ? "<section class=\"detail-quote bento-card\">" +
          "  <p>\"" + escapeHtml(study.testimonial.quote) + "\"</p>" +
          "  <span>" + escapeHtml(study.testimonial.author) + (study.testimonial.role ? " / " + escapeHtml(study.testimonial.role) : "") + "</span>" +
          "</section>"
        : "";

    root.innerHTML =
        "<section class=\"detail-hero\">" +
        "  <div class=\"grid-lines absolute inset-0 opacity-90\" aria-hidden=\"true\"></div>" +
        "  <div class=\"detail-hero-inner\">" +
        "    <div class=\"detail-hero-copy\">" +
        "      <a href=\"/#work\" class=\"detail-back\">Back to case studies</a>" +
        "      <p class=\"section-label mt-10 text-white/58\">Case study / " + escapeHtml(study.eyebrow || "Custom software") + "</p>" +
        "      <h1 class=\"title-xl mx-auto mt-7 max-w-5xl font-semibold text-white\">" + escapeHtml(study.title) + "</h1>" +
        "      <p class=\"body-copy-dark mx-auto mt-7 max-w-3xl text-lg\">" + escapeHtml(study.summary || "") + "</p>" +
        "      <div class=\"mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row\">" +
        "        <a href=\"https://calendly.com/standen/discovery-call\" class=\"btn btn-light\" target=\"_blank\" rel=\"noopener\">Book a discovery call</a>" +
                 liveLink +
        "      </div>" +
        "    </div>" +
             imageHtml +
        "  </div>" +
        "</section>" +
        "<section class=\"mesh-light detail-content\">" +
        "  <div class=\"detail-content-inner\">" +
        "    <div class=\"detail-stats\">" +
        "      <div><span>Client</span><strong>" + escapeHtml(study.client || "Custom project") + "</strong></div>" +
        "      <div><span>Timeline</span><strong>" + escapeHtml(study.timeline || "Scoped sprint") + "</strong></div>" +
        "      <div><span>Services</span><strong>" + escapeHtml((study.services || []).slice(0, 2).join(" / ")) + "</strong></div>" +
        "    </div>" +
        "    <div class=\"mt-6 grid gap-5 lg:grid-cols-[1.05fr_.95fr]\">" +
        "      <article class=\"bento-card p-8 text-left md:p-10\">" +
        "        <div class=\"card-content\">" +
        "          <p class=\"section-label mb-5\">The challenge</p>" +
        "          <p class=\"body-copy text-lg\">" + escapeHtml(study.problem || "") + "</p>" +
        "        </div>" +
        "      </article>" +
        "      <article class=\"bento-card p-8 text-left md:p-10\">" +
        "        <div class=\"card-content\">" +
        "          <p class=\"section-label mb-5\">What we delivered</p>" +
        "          <p class=\"body-copy text-lg\">" + escapeHtml(study.solution || "") + "</p>" +
        "        </div>" +
        "      </article>" +
        "    </div>" +
        "    <div class=\"mt-5 grid gap-5 lg:grid-cols-[.85fr_1.15fr]\">" +
        "      <article class=\"proof-card bento-card p-8 text-left md:p-10\">" +
        "        <div class=\"card-content\">" +
        "          <p class=\"section-label mb-5 text-white/58\">Results</p>" +
        "          <ul class=\"detail-list detail-list--light\">" + listHtml(study.results) + "</ul>" +
        "        </div>" +
        "      </article>" +
        "      <article class=\"bento-card p-8 text-left md:p-10\">" +
        "        <div class=\"card-content\">" +
        "          <p class=\"section-label mb-5\">Stack and workflow</p>" +
        "          <div class=\"detail-pills\">" + pillHtml(study.stack) + "</div>" +
        "        </div>" +
        "      </article>" +
        "    </div>" +
             testimonial +
        "    <div class=\"detail-cta mt-5\">" +
        "      <p class=\"section-label mx-auto text-white/58\">Next step</p>" +
        "      <h2 class=\"title-lg mx-auto mt-6 max-w-3xl font-semibold text-white\">Turn your rough workflow into a scoped first build.</h2>" +
        "      <p class=\"body-copy-dark mx-auto mt-5 max-w-xl text-lg\">Book a short call and we will identify the highest value system to build first.</p>" +
        "      <a href=\"https://calendly.com/standen/discovery-call\" class=\"btn btn-light mt-8\" target=\"_blank\" rel=\"noopener\">Scope my system</a>" +
        "    </div>" +
        "  </div>" +
        "</section>";

    document.title = study.title + " | Case Study | Standen";
})();
