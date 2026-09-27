(function () {
    "use strict";

    var nav = document.querySelector(".page-home .site-nav");
    var toggle = document.querySelector(".page-home .nav-toggle");
    var menu = document.getElementById("mobile-menu");

    if (nav) {
        var onScroll = function () {
            nav.classList.toggle("is-scrolled", window.scrollY > 24);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    }

    if (toggle && menu) {
        var setOpen = function (open) {
            toggle.setAttribute("aria-expanded", String(open));
            toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
            menu.setAttribute("data-open", String(open));
            document.body.style.overflow = open ? "hidden" : "";
            nav.classList.toggle("is-menu-open", open);
        };
        toggle.addEventListener("click", function () {
            setOpen(toggle.getAttribute("aria-expanded") !== "true");
        });
        menu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () { setOpen(false); });
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") setOpen(false);
        });
    }

    function openFaqFromHash() {
        var id = (location.hash || "").replace("#", "");
        if (!id) return;
        var item = document.getElementById(id);
        if (!item || !item.classList.contains("faq-item")) return;
        item.open = true;
    }

    var sections = { "/work": "work", "/build": "build", "/process": "process", "/faqs": "faq" };

    function scrollToSection() {
        var id = sections[location.pathname];
        if (!id) return;
        var el = document.getElementById(id);
        if (el) el.scrollIntoView();
    }

    document.querySelectorAll("a[href]").forEach(function (link) {
        var path = link.getAttribute("href");
        if (!sections[path]) return;
        link.addEventListener("click", function (event) {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
            var el = document.getElementById(sections[path]);
            if (!el) return;
            event.preventDefault();
            if (location.pathname !== path) history.pushState({}, "", path);
            el.scrollIntoView();
            if (menu && toggle) setOpen(false);
        });
    });

    window.addEventListener("popstate", scrollToSection);
    scrollToSection();

    window.addEventListener("hashchange", openFaqFromHash);
    openFaqFromHash();

    if (document.body.classList.contains("page-landing")) {
        document.querySelectorAll(".work-row, .offer, .steps li, .founder, .faq-item, .final-cta .wrap").forEach(function (el, index) {
            el.classList.add("reveal");
            el.style.setProperty("--reveal-delay", String((index % 4) * 70) + "ms");
        });
    }

    var revealNodes = document.querySelectorAll(".page-home .reveal");
    if (revealNodes.length && "IntersectionObserver" in window) {
        var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reducedMotion) {
            revealNodes.forEach(function (el) { el.classList.add("is-visible"); });
        } else {
            var revealObserver = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (!entry.isIntersecting) return;
                        entry.target.classList.add("is-visible");
                        revealObserver.unobserve(entry.target);
                    });
                },
                { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
            );
            revealNodes.forEach(function (el) { revealObserver.observe(el); });
        }
    }

    var staggerParents = document.querySelectorAll(".page-home .stats, .page-home .values, .page-home .proof-items, .page-home .included-grid");
    staggerParents.forEach(function (parent) {
        if (!parent.classList.contains("reveal")) return;
        var children = parent.children;
        for (var i = 0; i < children.length; i++) {
            children[i].style.setProperty("--reveal-delay", String(80 + i * 70) + "ms");
        }
    });

    var faqItems = document.querySelectorAll("#faq .seo-faq__item, #faq .faq-item");
    if (faqItems.length) {
        faqItems.forEach(function (item) {
            item.addEventListener("toggle", function () {
                if (!item.open) return;
                faqItems.forEach(function (other) {
                    if (other !== item && other.open) other.open = false;
                });
            });
        });
    }

    document.querySelectorAll("[data-open-dialog]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            var dialog = document.getElementById(btn.getAttribute("data-open-dialog"));
            if (dialog && typeof dialog.showModal === "function") {
                dialog.showModal();
            }
        });
    });

})();
