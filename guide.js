(function () {
    "use strict";

    var params = new URLSearchParams(window.location.search);
    var slug = params.get("slug") || "";
    var guides = window.GUIDES || [];
    var guide = guides.find(function (g) { return g.slug === slug; });

    if (guide) {
        window.location.replace("/guides/" + encodeURIComponent(guide.slug) + ".html");
        return;
    }

    var titleEl = document.getElementById("guide-title");
    var bodyEl = document.getElementById("guide-body");

    document.title = "Guide moved | Standen";
    if (titleEl) titleEl.textContent = "Guide moved";
    if (bodyEl) {
        bodyEl.innerHTML = "<p>This guide has moved. <a href=\"/guides.html\">Back to all guides</a>.</p>";
    }
})();
