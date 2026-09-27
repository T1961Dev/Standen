'use strict';
/**
 * Local static server with live reload.
 * Unknown public HTML routes redirect to /.
 * /api/waitlist is left intact.
 *
 * Usage: npm run dev
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = Number(process.env.PORT) || 5500;
const HOST = process.env.HOST || '127.0.0.1';
const ROOT = __dirname;
const OPEN_BROWSER = process.env.OPEN !== '0';

function loadLocalEnv() {
  const candidates = ['.env.local', '.env'];
  const FORCE_KEYS = new Set([
    'RESEND_API_KEY',
    'WAITLIST_FROM_EMAIL',
    'WAITLIST_REPLY_TO',
    'WAITLIST_NOTIFY_TO',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_SERIVE_ROLE_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
  ]);
  for (const name of candidates) {
    const file = path.join(ROOT, name);
    if (!fs.existsSync(file)) continue;
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq < 1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      val = val.trim();
      if (FORCE_KEYS.has(key) || process.env[key] === undefined) {
        process.env[key] = val;
      }
    }
  }
}

loadLocalEnv();

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

const LIVE_RELOAD_SNIPPET =
  '<script>(function(){if(location.protocol==="file:")return;var es=new EventSource("/__dev-reload");es.onmessage=function(e){if(e.data==="reload")location.reload()};es.onerror=function(){es.close()}})();</script>';

const reloadClients = new Set();
let reloadTimer = null;

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

function redirectHome(res) {
  res.writeHead(301, { Location: '/' });
  res.end();
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

    if (pathname === '/api/waitlist') {
      try {
        loadLocalEnv();
        delete require.cache[path.resolve(ROOT, 'api', 'waitlist.js')];
        const handler = require('./api/waitlist.js');
        return handler(req, res);
      } catch (err) {
        console.error('Waitlist API error', err);
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Waitlist API failed to load.' }));
        return;
      }
    }

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

    if (pathname === '/' || pathname === '') {
      return sendHtml(res, path.join(ROOT, 'index.html'));
    }

    if (pathname === '/work' || pathname === '/build' || pathname === '/process' || pathname === '/faqs') {
      return sendHtml(res, path.join(ROOT, 'index.html'));
    }

    if (/^\/case-studies\/[a-z0-9-]+$/.test(pathname)) {
      return sendHtml(res, path.join(ROOT, 'case-study.html'));
    }

    const rel = pathname.replace(/^\/+/, '');
    let abs = path.join(ROOT, rel);
    if (!path.extname(pathname)) {
      const asHtml = abs + '.html';
      if (fs.existsSync(asHtml)) abs = asHtml;
      else if (fs.existsSync(path.join(abs, 'index.html'))) abs = path.join(abs, 'index.html');
    }
    if (!underRoot(abs)) {
      res.writeHead(403);
      res.end();
      return;
    }
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
      return sendFile(res, abs);
    }

    if (!path.extname(pathname) || pathname.endsWith('.html')) {
      return redirectHome(res);
    }

    sendFile(res, abs);
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
    console.log('Standen dev server (one-page + live reload)');
    console.log('  ' + url);
    console.log('  Legacy HTML routes redirect to /');
    console.log('  /api/waitlist remains available');
    watchProject();
    openBrowser(url);
  });
