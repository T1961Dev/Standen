/**
 * Google Analytics 4, set your Measurement ID below, then add to pages:
 *   <script src="/js/ga4.js" defer></script>
 * Also connect GA4 to Google Search Console for query + conversion reporting.
 */
(function () {
    "use strict";

    var MEASUREMENT_ID = ""; // e.g. G-XXXXXXXXXX, paste from GA4 Admin

    if (!MEASUREMENT_ID || MEASUREMENT_ID.indexOf("G-") !== 0) return;

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", MEASUREMENT_ID, { send_page_view: true });

    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(MEASUREMENT_ID);
    document.head.appendChild(s);
})();
