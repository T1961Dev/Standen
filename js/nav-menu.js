(function () {
    "use strict";

    var trigger = document.querySelector(".nav-menu-trigger");
    var menu = document.getElementById("nav-services-menu");
    var navItem = document.querySelector(".nav-item--menu");

    if (!trigger || !menu || !navItem) return;

    function setOpen(open) {
        navItem.classList.toggle("is-open", open);
        trigger.setAttribute("aria-expanded", String(open));
    }

    trigger.addEventListener("click", function (e) {
        e.stopPropagation();
        setOpen(!navItem.classList.contains("is-open"));
    });

    document.addEventListener("click", function (e) {
        if (!navItem.contains(e.target)) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") setOpen(false);
    });
})();
