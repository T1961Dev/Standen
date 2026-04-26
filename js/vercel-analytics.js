/**
 * Vercel Web Analytics for static HTML.
 * Enable Web Analytics on the Vercel project, then redeploy so /_vercel/insights/* is served.
 * @see https://vercel.com/docs/analytics/quickstart
 */
(function () {
  window.va = window.va || function () {
    (window.vaq = window.vaq || []).push(arguments);
  };
  var s = document.createElement('script');
  s.defer = true;
  s.src = '/_vercel/insights/script.js';
  document.head.appendChild(s);
})();
