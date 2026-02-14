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

    var data = window.CASE_STUDIES;
    if (!data) return;

    var params = new URLSearchParams(window.location.search);
    var id = params.get("id") || "";
    var study = data[id];

    var root = document.getElementById("case-study-root");
    if (!root) return;

    if (!study || study.empty) {
        root.innerHTML = "<div class=\"section-inner section-inner--narrow\"><p class=\"section-label section-label--center\">Case study</p><h1 class=\"hero-title\" style=\"color:var(--dark-green);font-size:var(--text-h2);\">Not found</h1><p class=\"section-body section-body--center\">This case study doesn't exist or is coming soon.</p><a href=\"index.html#work\" class=\"btn btn-primary\">View all case studies</a></div>";
        if (document.title === "Case Study | Standen") document.title = "Case Study Not Found | Standen";
        return;
    }

    var t = study.testimonial;
    var testimonialHtml = t ? "<blockquote class=\"case-study-testimonial-quote\">\"" + escapeHtml(t.quote) + "\"</blockquote><p class=\"case-study-testimonial-attribution\">" + escapeHtml(t.author) + (t.role ? ", " + escapeHtml(t.role) : "") + "</p>" : "";
    var stackHtml = study.stack && study.stack.length ? "<ul class=\"case-study-stack-list\">" + study.stack.map(function (s) { return "<li>" + escapeHtml(s) + "</li>"; }).join("") + "</ul>" : "";
    var servicesHtml = study.services && study.services.length ? "<p class=\"case-study-services\">" + study.services.join(" · ") + "</p>" : "";

    root.innerHTML =
        "<div class=\"section-inner\">" +
        "  <a href=\"index.html#work\" class=\"case-study-back\">← All case studies</a>" +
        "  <header class=\"case-study-header\">" +
        (study.image ? "    <img class=\"case-study-hero-image\" src=\"" + escapeAttr(study.image) + "\" alt=\"\" />" : "") +
        "    <div class=\"case-study-header-text\">" +
        "      <p class=\"section-label\">Case study</p>" +
        "      <h1 class=\"case-study-title\">" + escapeHtml(study.title) + "</h1>" +
        (study.client ? "      <p class=\"case-study-client\">" + escapeHtml(study.client) + "</p>" : "") +
        (study.timeline ? "      <p class=\"case-study-timeline\">Delivered in " + escapeHtml(study.timeline) + "</p>" : "") +
        servicesHtml +
        "    </div>" +
        "  </header>" +
        "  <div class=\"case-study-body\">" +
        "    <section class=\"case-study-block\">" +
        "      <h2 class=\"case-study-heading\">The challenge</h2>" +
        "      <p class=\"section-body\">" + escapeHtml(study.problem) + "</p>" +
        "    </section>" +
        "    <section class=\"case-study-block\">" +
        "      <h2 class=\"case-study-heading\">What we delivered</h2>" +
        "      <p class=\"section-body\">" + escapeHtml(study.solution) + "</p>" +
        "    </section>" +
        (stackHtml ? "    <section class=\"case-study-block\"><h2 class=\"case-study-heading\">Tech stack</h2>" + stackHtml + "</section>" : "") +
        (testimonialHtml ? "    <section class=\"case-study-block case-study-testimonial\"><h2 class=\"case-study-heading\">What the client said</h2>" + testimonialHtml + "</section>" : "") +
        "  </div>" +
        "  <div class=\"case-study-cta\">" +
        "    <p class=\"section-body\">Ready to build something similar?</p>" +
        "    <a href=\"index.html#contact\" class=\"btn btn-primary\">Get in touch</a>" +
        "  </div>" +
        "</div>";

    document.title = (study.title + " | Case Study | Standen");
})();
