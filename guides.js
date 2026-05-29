(function () {
    "use strict";

    var grid = document.getElementById("guides-grid");
    var searchInput = document.getElementById("guides-search");
    var searchCount = document.getElementById("guides-search-count");
    var emptyState = document.getElementById("guides-empty");
    var guides = window.GUIDES;
    var observer;

    if (!grid || !guides || !guides.length) return;

    /* Each row always sums to 12 columns, no row-span, no gaps. */
    var ROW_LAYOUTS = [
        { cols: [6, 6], sizes: ["half", "half"] },
        { cols: [4, 4, 4], sizes: ["third", "third", "third"] },
        { cols: [8, 4], sizes: ["lead", "side"] },
        { cols: [4, 8], sizes: ["side", "lead"] }
    ];

    function escapeHtml(str) {
        if (!str) return "";
        var d = document.createElement("div");
        d.textContent = str;
        return d.innerHTML;
    }

    function escapeAttr(str) {
        return String(str || "")
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function layoutForRemainder(count) {
        if (count <= 0) return null;
        if (count === 1) return { cols: [12], sizes: ["full"] };
        if (count === 2) return { cols: [6, 6], sizes: ["half", "half"] };
        return { cols: [4, 4, 4], sizes: ["third", "third", "third"] };
    }

    function buildRows(list) {
        var rows = [];
        var i = 0;
        var layoutIndex = 0;

        while (i < list.length) {
            var remaining = list.length - i;
            var layout = remaining < ROW_LAYOUTS[layoutIndex % ROW_LAYOUTS.length].cols.length
                ? layoutForRemainder(remaining)
                : ROW_LAYOUTS[layoutIndex % ROW_LAYOUTS.length];

            if (!layout) break;

            var rowItems = [];
            var take = Math.min(layout.cols.length, remaining);

            for (var slot = 0; slot < take; slot++) {
                rowItems.push({
                    guide: list[i],
                    span: layout.cols[slot],
                    size: layout.sizes[slot]
                });
                i++;
            }

            rows.push({ items: rowItems });
            layoutIndex++;
        }

        return rows;
    }

    function matchesQuery(guide, query) {
        if (!query) return true;
        var haystack = (guide.title + " " + guide.excerpt + " " + guide.category).toLowerCase();
        return haystack.indexOf(query) !== -1;
    }

    function guideUrl(guide) {
        return "/guides/" + guide.slug + ".html";
    }

    function renderCard(item, index) {
        var guide = item.guide;
        var href = guideUrl(guide);
        return (
            "<article class=\"guide-card guide-card--" + item.size + " reveal\" style=\"--col-span:" + item.span + ";--reveal-delay:" + (index % 6) * 50 + "ms\">" +
            "  <a href=\"" + escapeAttr(href) + "\" class=\"guide-card__link\" aria-label=\"" + escapeAttr(guide.title) + "\">" +
            "    <div class=\"guide-card__media" + (guide.imageFit === "contain" ? " guide-card__media--contain" : "") + "\">" +
            "      <img src=\"" + escapeAttr(guide.image) + "\" alt=\"\" width=\"800\" height=\"520\" loading=\"lazy\" decoding=\"async\">" +
            "    </div>" +
            "    <div class=\"guide-card__body\">" +
            "      <p class=\"notes-meta guide-card__meta\">" + escapeHtml(guide.category) + " <span>, </span> " + escapeHtml(guide.readTime) + "</p>" +
            "      <h3 class=\"guide-card__title\">" + escapeHtml(guide.title) + "</h3>" +
            "      <p class=\"guide-card__excerpt\">" + escapeHtml(guide.excerpt) + "</p>" +
            "    </div>" +
            "  </a>" +
            "</article>"
        );
    }

    function renderRows(rows) {
        var cardIndex = 0;
        return rows.map(function (row, rowIndex) {
            return (
                "<div class=\"guides-bento-row guides-bento-row--" + (rowIndex % 4) + "\">" +
                row.items.map(function (item) {
                    return renderCard(item, cardIndex++);
                }).join("") +
                "</div>"
            );
        }).join("");
    }

    function bindReveal() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }

        var cards = grid.querySelectorAll(".reveal");
        if (!cards.length) return;

        if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            }, { threshold: 0.06, rootMargin: "0px 0px -32px 0px" });
            cards.forEach(function (el) { observer.observe(el); });
        } else {
            cards.forEach(function (el) { el.classList.add("is-visible"); });
        }
    }

    function renderList(list) {
        if (!list.length) {
            grid.innerHTML = "";
            grid.hidden = true;
            if (emptyState) emptyState.hidden = false;
            if (searchCount) searchCount.textContent = "0 guides";
            return;
        }

        grid.hidden = false;
        if (emptyState) emptyState.hidden = true;
        grid.innerHTML = renderRows(buildRows(list));

        if (searchCount) {
            searchCount.textContent = list.length + (list.length === 1 ? " guide" : " guides");
        }

        bindReveal();
    }

    function filterGuides() {
        var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
        renderList(guides.filter(function (guide) {
            return matchesQuery(guide, query);
        }));
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterGuides);
    }

    renderList(guides);
})();
