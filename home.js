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

    var staggerParents = document.querySelectorAll(".page-home .stats, .page-home .values");
    staggerParents.forEach(function (parent) {
        if (!parent.classList.contains("reveal")) return;
        var children = parent.children;
        for (var i = 0; i < children.length; i++) {
            children[i].style.setProperty("--reveal-delay", String(80 + i * 70) + "ms");
        }
    });

})();
