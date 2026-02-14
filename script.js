(function () {
    "use strict";

    // Disable right-click and image save
    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    });

    // Scroll-reveal: add .reveal--visible when element enters viewport
    var revealEls = document.querySelectorAll(".reveal");
    if (revealEls.length && "IntersectionObserver" in window) {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("reveal--visible");
                    }
                });
            },
            { rootMargin: "0px 0px -40px 0px", threshold: 0.05 }
        );
        revealEls.forEach(function (el) {
            observer.observe(el);
        });
    }

    var navShell = document.querySelector(".nav-shell");
    var hero = document.querySelector(".hero");
    var scrollThreshold = 120;

    function onScroll() {
        if (!navShell) return;
        var pastHero = hero ? window.scrollY > scrollThreshold : window.scrollY > 0;
        navShell.classList.toggle("nav-shell--scrolled", pastHero);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var nav = document.querySelector(".nav-links");
    var openItem = null;

    function closeAll() {
        if (openItem) {
            openItem.classList.remove("nav-item--open");
            var trigger = openItem.querySelector(".nav-trigger");
            if (trigger) trigger.setAttribute("aria-expanded", "false");
            openItem = null;
        }
    }

    if (nav) {
        var triggers = nav.querySelectorAll(".nav-trigger");

        function openItemEl(item) {
            closeAll();
            if (item && item.classList.contains("nav-item--dropdown")) {
                item.classList.add("nav-item--open");
                var t = item.querySelector(".nav-trigger");
                if (t) t.setAttribute("aria-expanded", "true");
                openItem = item;
            }
        }

        triggers.forEach(function (trigger) {
            var item = trigger.closest(".nav-item");
            if (!item) return;
            trigger.addEventListener("click", function (e) {
                e.preventDefault();
                if (openItem === item) closeAll();
                else openItemEl(item);
            });
        });

        document.addEventListener("click", function (e) {
            if (openItem && !openItem.contains(e.target) && !e.target.closest(".nav-item--dropdown")) {
                closeAll();
            }
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") closeAll();
        });
    }

    var toggle = document.querySelector(".nav-toggle");
    var overlay = document.querySelector(".nav-overlay");
    var drawer = document.querySelector(".nav-drawer");
    if (toggle) {
        function openMobile() {
            closeAll();
            document.body.classList.add("nav-open");
            if (navShell) navShell.classList.add("nav-shell--open");
            document.body.style.overflow = "hidden";
            toggle.setAttribute("aria-expanded", "true");
            toggle.setAttribute("aria-label", "Close menu");
            if (drawer) drawer.setAttribute("aria-hidden", "false");
            if (overlay) overlay.setAttribute("aria-hidden", "false");
        }
        function closeMobile() {
            document.body.classList.remove("nav-open");
            if (navShell) navShell.classList.remove("nav-shell--open");
            document.body.style.overflow = "";
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Open menu");
            if (drawer) drawer.setAttribute("aria-hidden", "true");
            if (overlay) overlay.setAttribute("aria-hidden", "true");
        }
        toggle.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (document.body.classList.contains("nav-open")) closeMobile();
            else openMobile();
        });
        if (overlay) overlay.addEventListener("click", closeMobile);
        if (drawer) {
            drawer.querySelectorAll("a").forEach(function (a) {
                a.addEventListener("click", closeMobile);
            });
        }
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && document.body.classList.contains("nav-open")) closeMobile();
        });
    }
})();

(function () {
    "use strict";

    var layout = document.querySelector(".testimonial-layout");
    if (!layout) return;

    var thumbs = layout.querySelectorAll(".testimonial-thumb");
    var contents = layout.querySelectorAll(".testimonial-content");
    var prevBtn = layout.querySelector(".testimonial-arrow--prev");
    var nextBtn = layout.querySelector(".testimonial-arrow--next");
    var currentIndex = 1;

    function show(index) {
        currentIndex = Math.max(0, Math.min(index, contents.length - 1));
        thumbs.forEach(function (thumb, i) {
            thumb.classList.toggle("testimonial-thumb--active", i === currentIndex);
            thumb.classList.toggle("testimonial-thumb--inactive", i !== currentIndex);
        });
        contents.forEach(function (content, i) {
            var isActive = i === currentIndex;
            content.classList.toggle("testimonial-content--active", isActive);
            content.hidden = !isActive;
        });
    }

    thumbs.forEach(function (thumb, i) {
        thumb.addEventListener("click", function () {
            show(i);
        });
    });

    if (prevBtn) prevBtn.addEventListener("click", function () { show(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { show(currentIndex + 1); });

    show(1);
})();
