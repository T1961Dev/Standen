'use strict';
/**
 * Local static server with Vercel-style rewrites + live reload.
 *
 * Usage: npm run dev
 * Open http://127.0.0.1:5500/ and leave the tab open.
 * Saving HTML, CSS, JS, or assets triggers an automatic browser refresh.
 *
 * Do not use the Cursor "Live Server" extension on this port, it has no rewrites
 * and no live reload wired to this project's routes.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = Number(process.env.PORT) || 5500;
const HOST = process.env.HOST || '127.0.0.1';
const ROOT = __dirname;
const OPEN_BROWSER = process.env.OPEN !== '0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

const RELOAD_EXT = new Set([
  '.html', '.css', '.js', '.json',
  '.png', '.jpg', '.jpeg', '.webp', '.svg', '.woff2',
]);

const REWRITE = {
  '/work': 'work.html',
  '/about': 'about.html',
  '/process': 'index.html',
  '/pricing': 'index.html',
  '/guides': 'guides.html',
  '/blog': 'blog.html',
  '/resources': 'resources.html',
  '/privacy': 'privacy.html',
  '/terms': 'terms.html',
  '/compare': 'compare/index.html',
};

const SERVICE_REDIRECTS = {
  'agency-proposal-systems': 'service-proposals',
  'agency-reporting-dashboard': 'service-reporting',
  'agency-client-portal': 'service-portals',
  'agency-internal-crm': 'service-crm',
  'saas-mvp-development': 'service-saas',
  'internal-tools-for-agencies': 'service-internal',
};

function serviceRedirect(pathname) {
  if (pathname === '/services' || pathname === '/services/index.html') return '/#services';
  const match = pathname.match(/^\/services\/([^/]+)(\.html)?$/);
  if (!match) return null;
  const slug = match[1];
  if (slug === 'index') return '/#services';
  const anchor = SERVICE_REDIRECTS[slug];
  return anchor ? '/#' + anchor : '/#services';
}

function rewriteTarget(pathname) {
  if (REWRITE[pathname]) return path.join(ROOT, REWRITE[pathname]);
  const compareMatch = pathname.match(/^\/compare\/([^/]+)$/);
  if (compareMatch) return path.join(ROOT, 'compare', compareMatch[1] + '.html');
  const caseStudyMatch = pathname.match(/^\/case-studies\/([^/]+)$/);
  if (caseStudyMatch) return path.join(ROOT, 'case-studies', caseStudyMatch[1] + '.html');
  const blogMatch = pathname.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) return path.join(ROOT, 'blog', blogMatch[1] + '.html');
  return null;
}

const CASE_STUDY_REDIRECTS = {
  ohmypod: '/case-studies/ohmypod',
  'fx-quant-research-platform': '/case-studies/fx-quant-research-platform',
  'real-estate-property-prediction': '/case-studies/real-estate-property-prediction',
  'scrapr-io': '/case-studies/scrapr-io',
  'instagram-lead-scraper': '/case-studies/instagram-lead-scraper',
  'crypto-news-scraper': '/case-studies/crypto-news-scraper',
  'lead-magnet-generator': '/case-studies/lead-magnet-generator',
};

const BLOG_REDIRECTS = {
  'how-to-scope-a-saas-mvp': '/blog/how-to-scope-a-saas-mvp',
  'web-development-hampshire-what-to-expect': '/blog/web-development-hampshire-what-to-expect',
  'when-to-build-custom-software-vs-saas': '/blog/when-to-build-custom-software-vs-saas',
  'rapid-delivery-without-cutting-corners': '/blog/rapid-delivery-without-cutting-corners',
};

const LIVE_RELOAD_SNIPPET =
  '<script>(function(){if(location.protocol==="file:")return;var es=new EventSource("/__dev-reload");es.onmessage=function(e){if(e.data==="reload")location.reload()};es.onerror=function(){es.close()}})();</script>';

const reloadClients = new Set();
let reloadTimer = null;

function guideSlugPath(slug) {
  if (!slug || slug.includes('..') || slug.includes('/') || slug.includes('\\')) return null;
  return path.join(ROOT, 'guides', slug + '.html');
}

function underRoot(absPath) {
  const r = path.resolve(ROOT);
  const f = path.resolve(absPath);
  return f === r || f.startsWith(r + path.sep);
}

function broadcastReload() {
  for (const res of reloadClients) {
    try {
      res.write('data: reload\n\n');
    } catch (e) {
      reloadClients.delete(res);
    }
  }
}

function scheduleReload(filename) {
  if (!filename) return;
  const ext = path.extname(filename).toLowerCase();
  if (!RELOAD_EXT.has(ext)) return;
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(function () {
    console.log('[live reload]', filename);
    broadcastReload();
  }, 120);
}

function watchProject() {
  try {
    fs.watch(ROOT, { recursive: true }, function (_event, filename) {
      scheduleReload(filename);
    });
  } catch (e) {
    console.warn('Live reload: fs.watch failed, restart the dev server after saves.');
  }
}

function sendHtml(res, absPath) {
  fs.readFile(absPath, 'utf8', function (err, html) {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }
    const body = html.includes('</body>')
      ? html.replace('</body>', LIVE_RELOAD_SNIPPET + '</body>')
      : html + LIVE_RELOAD_SNIPPET;
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(body);
  });
}

function sendFile(res, absPath) {
  fs.stat(absPath, function (err, st) {
    if (err || !st.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }
    const ext = path.extname(absPath).toLowerCase();
    if (ext === '.html') return sendHtml(res, absPath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    fs.createReadStream(absPath).pipe(res);
  });
}

function tryGuideSlug(res, slug, onMiss) {
  const abs = guideSlugPath(slug);
  if (!abs || !underRoot(abs)) return onMiss();
  fs.stat(abs, function (err, st) {
    if (!err && st.isFile()) return sendHtml(res, abs);
    onMiss();
  });
}

function openBrowser(url) {
  if (!OPEN_BROWSER) return;
  const platform = process.platform;
  if (platform === 'win32') {
    spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' }).unref();
  } else if (platform === 'darwin') {
    spawn('open', [url], { detached: true, stdio: 'ignore' }).unref();
  } else {
    spawn('xdg-open', [url], { detached: true, stdio: 'ignore' }).unref();
  }
}

http
  .createServer(function (req, res) {
    let pathname = new URL(req.url || '/', 'http://127.0.0.1').pathname;
    try {
      pathname = decodeURIComponent(pathname);
    } catch (e) {
      res.writeHead(400);
      res.end();
      return;
    }
    if (pathname.length > 1 && pathname.endsWith('/')) pathname = pathname.slice(0, -1);

    if (pathname === '/__dev-reload') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });
      res.write('data: connected\n\n');
      reloadClients.add(res);
      req.on('close', function () {
        reloadClients.delete(res);
      });
      return;
    }

    if (pathname === '/index.html') {
      res.writeHead(302, { Location: '/' });
      res.end();
      return;
    }
    if (pathname === '/audit.html') {
      res.writeHead(302, { Location: '/audit' });
      res.end();
      return;
    }
    if (pathname === '/guides.html') {
      res.writeHead(302, { Location: '/guides' });
      res.end();
      return;
    }
    if (pathname === '/blog.html') {
      res.writeHead(302, { Location: '/blog' });
      res.end();
      return;
    }
    if (pathname === '/resources.html') {
      res.writeHead(302, { Location: '/resources' });
      res.end();
      return;
    }
    if (pathname === '/privacy.html') {
      res.writeHead(302, { Location: '/privacy' });
      res.end();
      return;
    }
    if (pathname === '/terms.html') {
      res.writeHead(302, { Location: '/terms' });
      res.end();
      return;
    }
    if (pathname === '/contact.html' || pathname === '/contact') {
      res.writeHead(302, { Location: '/#contact' });
      res.end();
      return;
    }
    if (pathname === '/contact-thank-you.html' || pathname === '/contact-thank-you') {
      res.writeHead(302, { Location: '/#contact' });
      res.end();
      return;
    }
    if (pathname === '/case-studies.html' || pathname === '/case-studies') {
      res.writeHead(302, { Location: '/work' });
      res.end();
      return;
    }
    if (pathname === '/saas-development-uk.html' || pathname === '/saas-development-uk') {
      res.writeHead(302, { Location: '/#service-saas' });
      res.end();
      return;
    }
    if (pathname === '/custom-software-development-uk.html' || pathname === '/custom-software-development-uk') {
      res.writeHead(302, { Location: '/#service-internal' });
      res.end();
      return;
    }
    if (pathname === '/custom-build-vs-off-the-shelf.html' || pathname === '/custom-build-vs-off-the-shelf') {
      res.writeHead(302, { Location: '/compare/custom-build-vs-off-the-shelf' });
      res.end();
      return;
    }
    if (pathname === '/guide.html') {
      res.writeHead(302, { Location: '/guides' });
      res.end();
      return;
    }

    if (pathname === '/case-study.html') {
      const q = new URL(req.url || '/', 'http://127.0.0.1').searchParams;
      const studyId = q.get('id');
      const dest = studyId && CASE_STUDY_REDIRECTS[studyId];
      res.writeHead(302, { Location: dest || '/work' });
      res.end();
      return;
    }

    if (pathname === '/blog-post.html') {
      const q = new URL(req.url || '/', 'http://127.0.0.1').searchParams;
      const slug = q.get('slug');
      const dest = slug && BLOG_REDIRECTS[slug];
      res.writeHead(302, { Location: dest || '/blog' });
      res.end();
      return;
    }

    const caseStudyHtmlMatch = pathname.match(/^\/case-studies\/([^/]+)\.html$/);
    if (caseStudyHtmlMatch) {
      res.writeHead(302, { Location: '/case-studies/' + caseStudyHtmlMatch[1] });
      res.end();
      return;
    }

    const blogHtmlMatch = pathname.match(/^\/blog\/([^/]+)\.html$/);
    if (blogHtmlMatch) {
      res.writeHead(302, { Location: '/blog/' + blogHtmlMatch[1] });
      res.end();
      return;
    }

    const cleanGuideHtmlMatch = pathname.match(/^\/guides\/([^/]+)\.html$/);
    if (cleanGuideHtmlMatch) {
      res.writeHead(302, { Location: '/guides/' + cleanGuideHtmlMatch[1] });
      res.end();
      return;
    }

    const serviceDest = serviceRedirect(pathname);
    if (serviceDest) {
      res.writeHead(302, { Location: serviceDest });
      res.end();
      return;
    }

    const rewrittenAbs = rewriteTarget(pathname);
    if (rewrittenAbs) {
      if (!underRoot(rewrittenAbs)) {
        res.writeHead(403);
        res.end();
        return;
      }
      return sendFile(res, rewrittenAbs);
    }

    const guideHtmlMatch = pathname.match(/^\/guides\/([^/]+)\.html$/);
    const guideCleanMatch = !guideHtmlMatch && pathname.match(/^\/guides\/([^/]+)$/);
    const guideSlug = guideHtmlMatch ? guideHtmlMatch[1] : guideCleanMatch ? guideCleanMatch[1] : null;

    if (guideSlug) {
      return tryGuideSlug(res, guideSlug, function () {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Cannot GET ' + pathname);
      });
    }

    if (pathname === '/' || pathname === '') {
      return sendHtml(res, path.join(ROOT, 'index.html'));
    }

    const rel = pathname.replace(/^\/+/, '');
    const abs = path.join(ROOT, rel);
    if (!underRoot(abs)) {
      res.writeHead(403);
      res.end();
      return;
    }

    fs.stat(abs, function (err, st) {
      if (!err && st.isFile()) return sendFile(res, abs);
      if (!err && st.isDirectory()) {
        const idx = path.join(abs, 'index.html');
        return fs.stat(idx, function (e2, s2) {
          if (!e2 && s2.isFile()) return sendHtml(res, idx);
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Cannot GET ' + pathname);
        });
      }
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Cannot GET ' + pathname);
    });
  })
  .on('error', function (err) {
    if (err.code === 'EADDRINUSE') {
      console.error('');
      console.error('Port ' + PORT + ' is already in use.');
      console.error('Another dev server or Live Server is still running.');
      console.error('');
      console.error('PowerShell, free the port, then run npm run dev again:');
      console.error('  Get-NetTCPConnection -LocalPort 5500 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }');
      console.error('');
      console.error('Or use a different port:');
      console.error('  $env:PORT=5501; npm run dev');
      console.error('');
      process.exit(1);
    }
    throw err;
  })
  .listen(PORT, HOST, function () {
    const url = 'http://' + HOST + ':' + PORT + '/';
    console.log('Standen dev server (routes + live reload)');
    console.log('  ' + url);
    console.log('  /work /about /contact /services/:slug /compare/:slug /case-studies/:slug /blog/:slug /guides/:slug');
    console.log('  Save a file → browser refreshes automatically.');
    console.log('  Stop the Cursor Live Server extension if port 5500 is in use.');
    watchProject();
    openBrowser(url);
  });
