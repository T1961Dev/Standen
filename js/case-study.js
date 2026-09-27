(function () {
    "use strict";

    var root = document.getElementById("case-root");
    if (!root) return;

    function esc(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function render(study) {
        document.title = study.title + " | Case Study | Standen";
        var stats = "";
        if (study.client) {
            stats = '<dl class="cs-stats">' +
                "<div><dt>Client</dt><dd>" + esc(study.client) + "</dd></div>" +
                "<div><dt>Timeline</dt><dd>" + esc(study.timeline) + "</dd></div>" +
                "<div><dt>Services</dt><dd>" + esc(study.services) + "</dd></div>" +
                "</dl>";
        }
        var body = "";
        if (study.challenge) {
            body = '<div class="cs-split">' +
                "<section><h2>The challenge</h2><p>" + esc(study.challenge) + "</p></section>" +
                "<section><h2>What we delivered</h2><p>" + esc(study.delivered) + "</p></section>" +
                "</div>" +
                '<div class="cs-split">' +
                "<section><h2>Results</h2><ul>" + study.results.map(function (item) {
                    return "<li>" + esc(item) + "</li>";
                }).join("") + "</ul></section>" +
                "<section><h2>Stack and workflow</h2><p>" + study.stack.map(esc).join(" · ") + "</p></section>" +
                "</div>";
        }
        var quote = study.quote
            ? '<blockquote class="quote"><p>&ldquo;' + esc(study.quote) + '&rdquo;</p><footer>' + esc(study.quoteBy) + "</footer></blockquote>"
            : "";
        var figureClass = study.logo ? "shot mark" : "shot";
        root.innerHTML =
            '<p class="cs-back"><a href="/work">All work</a></p>' +
            '<p class="kicker">' + esc(study.meta) + "</p>" +
            "<h1>" + esc(study.title) + "</h1>" +
            '<p class="cs-lead">' + esc(study.lead) + "</p>" +
            '<figure class="' + figureClass + '"><img src="' + esc(study.image) + '" alt="' + esc(study.imageAlt) + '"></figure>' +
            stats + body + quote;
    }

    var params = new URLSearchParams(location.search);
    var fromQuery = params.get("slug");
    var fromPath = (location.pathname.match(/\/case-studies\/([a-z0-9-]+)$/) || [])[1];
    var slug = fromPath || fromQuery;
    if (fromQuery && !fromPath) {
        history.replaceState({}, "", "/case-studies/" + fromQuery);
    }
    fetch("/js/case-studies.json")
        .then(function (response) { return response.json(); })
        .then(function (studies) {
            var study = studies.find(function (item) { return item.slug === slug; });
            if (!study) {
                root.innerHTML = "<h1>Case study</h1><p class=\"cs-lead\">That project is not on this page. <a href=\"/work\">Back to work</a>.</p>";
                return;
            }
            render(study);
        })
        .catch(function () {
            root.innerHTML = "<h1>Case study</h1><p class=\"cs-lead\">The case study could not be loaded. <a href=\"/work\">Back to work</a>.</p>";
        });
})();
