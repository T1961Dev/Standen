(function () {
    const search = document.getElementById("blog-search");
    const count = document.getElementById("blog-search-count");
    const empty = document.getElementById("blog-empty");
    const cards = () => [...document.querySelectorAll(".guides-bento__card, #articles-grid .blog-card")];
    const filterBtns = document.querySelectorAll(".guides-filter__btn");

    function apply() {
        const q = (search?.value || "").trim().toLowerCase();
        const active = document.querySelector(".guides-filter__btn.is-active");
        const filter = active?.dataset.filter || "all";
        let visible = 0;

        cards().forEach((card) => {
            const text = card.textContent.toLowerCase();
            const cat = card.dataset.category || "";
            const matchSearch = !q || text.includes(q);
            let matchFilter = true;
            if (filter === "saas") matchFilter = cat.includes("SaaS") || text.includes("mvp") || text.includes("saas");
            else if (filter === "custom") matchFilter = cat.includes("Custom") || text.includes("custom") || text.includes("internal");
            else if (filter !== "all") matchFilter = cat === filter || text.includes(filter.toLowerCase());

            const show = matchSearch && matchFilter;
            card.hidden = !show;
            if (show) visible++;
        });

        if (count) count.textContent = visible ? `${visible} article${visible === 1 ? "" : "s"}` : "No matches";
        if (empty) empty.hidden = visible > 0;
    }

    search?.addEventListener("input", apply);
    filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            filterBtns.forEach((b) => b.classList.remove("is-active"));
            btn.classList.add("is-active");
            apply();
        });
    });
})();
